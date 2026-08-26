'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { AssistantState, ChatMessage, LanguageMode } from '@/types/jarvis';
import { getContextualFallback, getRandomFallback } from '@/lib/jarvisIntents';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function useJarvisVoice() {
  const [state, setState] = useState<AssistantState>('idle');
  const [language, setLanguage] = useState<LanguageMode>('hinglish');
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'jarvis',
      text: 'JARVIS online. Hinglish, Hindi ya English mein baat karein. Mic tap karein ya niche type karein.',
      timestamp: '12:00 AM',
    },
  ]);

  const [transcript, setTranscript] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0.2);
  const [isMicAvailable, setIsMicAvailable] = useState<boolean>(true);

  // ─── Refs ────────────────────────────────────────────────────────────────
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const audioIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // KEY FIX: Use refs so speech callbacks always read the LATEST values
  // (React state is stale inside SpeechRecognition event callbacks)
  const transcriptRef = useRef<string>('');
  const stateRef = useRef<AssistantState>('idle');
  const languageRef = useRef<LanguageMode>('hinglish');
  const messagesRef = useRef<ChatMessage[]>([]);
  const isOfflineModeRef = useRef<boolean>(false);

  // Keep refs in sync with state
  useEffect(() => { stateRef.current = state; }, [state]);
  useEffect(() => { languageRef.current = language; }, [language]);
  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { isOfflineModeRef.current = isOfflineMode; }, [isOfflineMode]);

  // ─── Audio Level Simulator ────────────────────────────────────────────────
  const startAudioLevelSimulation = (min = 0.3, max = 0.9) => {
    if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    audioIntervalRef.current = setInterval(() => {
      setAudioLevel(min + Math.random() * (max - min));
    }, 100);
  };

  const stopAudioLevelSimulation = () => {
    if (audioIntervalRef.current) {
      clearInterval(audioIntervalRef.current);
      audioIntervalRef.current = null;
    }
    setAudioLevel(0.2);
  };

  // ─── Speak Response ────────────────────────────────────────────────────────
  const speakResponse = useCallback((text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.1;

    const voices = synthRef.current.getVoices();
    let selectedVoice = null;

    if (languageRef.current === 'hindi') {
      selectedVoice = voices.find(
        (v) =>
          v.lang.startsWith('hi') ||
          v.name.includes('Google हिन्दी') ||
          v.name.includes('Hindi') ||
          v.name.includes('Heera') ||
          v.name.includes('Kalpana')
      );
    }

    if (!selectedVoice) {
      selectedVoice =
        voices.find(
          (v) =>
            v.name.includes('Google UK English Female') ||
            v.name.includes('Microsoft Zira') ||
            v.name.includes('Samantha') ||
            v.name.includes('Victoria') ||
            v.name.includes('Karen') ||
            v.name.includes('Veena') ||
            v.name.toLowerCase().includes('female') ||
            v.name.includes('Zira')
        ) || voices.find((v) => v.lang.startsWith('en'));
    }

    if (selectedVoice) utterance.voice = selectedVoice;

    utterance.onstart = () => {
      setState('speaking');
      startAudioLevelSimulation(0.5, 1.0);
    };
    utterance.onend = () => {
      stopAudioLevelSimulation();
      setState('idle');
    };
    utterance.onerror = () => {
      stopAudioLevelSimulation();
      setState('idle');
    };

    synthRef.current.speak(utterance);
  }, []);

  // ─── Send Message ─────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (textInput: string) => {
    const trimmed = textInput.trim();
    if (!trimmed) return;
    if (stateRef.current === 'thinking' || stateRef.current === 'speaking') return;

    const lang = languageRef.current;
    const offline = isOfflineModeRef.current;
    const historySnapshot = messagesRef.current;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setTranscript('');
    transcriptRef.current = '';
    setState('thinking');
    stateRef.current = 'thinking';
    startAudioLevelSimulation(0.2, 0.5);

    let aiText = '';

    if (offline) {
      aiText = getContextualFallback(trimmed, lang) || getRandomFallback(lang);
    } else {
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: trimmed,
            history: historySnapshot,
            language: lang,
            isOffline: offline,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          aiText = data.response || getContextualFallback(trimmed, lang) || getRandomFallback(lang);
        } else {
          aiText = getContextualFallback(trimmed, lang) || getRandomFallback(lang);
        }
      } catch {
        aiText = getContextualFallback(trimmed, lang) || getRandomFallback(lang);
      }
    }

    const jarvisMsg: ChatMessage = {
      id: `jarvis-${Date.now()}`,
      sender: 'jarvis',
      text: aiText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, jarvisMsg]);
    stopAudioLevelSimulation();
    speakResponse(aiText);
  }, [speakResponse]);

  // ─── Build a fresh recognition instance ─────────────────────────────────
  const buildRecognition = useCallback(() => {
    const SpeechRecognition =
      typeof window !== 'undefined' &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SpeechRecognition) return null;

    const lang = languageRef.current;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = lang === 'hindi' ? 'hi-IN' : lang === 'hinglish' ? 'en-IN' : 'en-US';

    recognition.onstart = () => {
      setState('listening');
      stateRef.current = 'listening';
      setErrorMsg(null);
      setTranscript('');
      transcriptRef.current = '';
      startAudioLevelSimulation(0.6, 1.0);
    };

    recognition.onresult = (event: any) => {
      let current = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        current += event.results[i][0].transcript;
      }
      // Update BOTH the React state (for UI) AND the ref (for onend callback)
      setTranscript(current);
      transcriptRef.current = current;
    };

    recognition.onerror = (event: any) => {
      stopAudioLevelSimulation();
      if (event.error === 'not-allowed' || event.error === 'permission-denied') {
        setErrorMsg('Mic permission blocked — browser address bar mein 🔒 click karke Microphone → Allow karein.');
        setIsMicAvailable(false);
      } else if (event.error === 'no-speech') {
        setErrorMsg('Koi awaaz nahi aayi. Dobara mic tap karein aur bolein.');
      } else {
        console.warn('Speech error:', event.error);
      }
      setState('idle');
      stateRef.current = 'idle';
    };

    // KEY FIX: onend reads from ref, NOT from stale React state
    recognition.onend = () => {
      stopAudioLevelSimulation();
      const finalText = transcriptRef.current.trim();
      if (finalText) {
        sendMessage(finalText);
      } else {
        setState('idle');
        stateRef.current = 'idle';
      }
    };

    return recognition;
  }, [sendMessage]);

  // ─── Initialize synthesis on mount ───────────────────────────────────────
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      // Pre-load voices (some browsers need this trigger)
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
    return () => {
      stopAudioLevelSimulation();
      synthRef.current?.cancel();
    };
  }, []);

  // ─── Start Listening ─────────────────────────────────────────────────────
  const startListening = useCallback(() => {
    const SpeechRecognition =
      typeof window !== 'undefined' &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);

    if (!SpeechRecognition) {
      setErrorMsg('Yeh browser Speech API support nahi karta. Niche type karein.');
      setIsMicAvailable(false);
      return;
    }

    // Stop speaking if playing
    if (stateRef.current === 'speaking') {
      synthRef.current?.cancel();
    }

    // Toggle off if already listening
    if (stateRef.current === 'listening') {
      try { recognitionRef.current?.stop(); } catch {}
      setState('idle');
      stateRef.current = 'idle';
      stopAudioLevelSimulation();
      return;
    }

    // Don't interrupt thinking
    if (stateRef.current === 'thinking') return;

    setErrorMsg(null);
    setIsMicAvailable(true);

    // Build fresh recognition (with correct current language ref)
    const recognition = buildRecognition();
    if (!recognition) return;

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (e) {
      console.warn('Recognition start error:', e);
      setState('idle');
    }
  }, [buildRecognition]);

  // ─── Language change → rebuild recognition ─────────────────────────────
  useEffect(() => {
    languageRef.current = language;
    // If currently listening, restart with new language
    if (stateRef.current === 'listening') {
      try { recognitionRef.current?.stop(); } catch {}
    }
  }, [language]);

  // ─── Stop Speaking ───────────────────────────────────────────────────────
  const stopSpeaking = useCallback(() => {
    synthRef.current?.cancel();
    stopAudioLevelSimulation();
    setState('idle');
    stateRef.current = 'idle';
  }, []);

  return {
    state,
    language,
    setLanguage,
    isOfflineMode,
    setIsOfflineMode,
    messages,
    transcript,
    errorMsg,
    audioLevel,
    isMicAvailable,
    startListening,
    stopSpeaking,
    sendMessage,
    clearError: () => setErrorMsg(null),
  };
}
