'use client';

import React, { useState, useEffect } from 'react';
import JarvisCore from './JarvisCore';
import SystemMetrics from './SystemMetrics';
import TranscriptBox from './TranscriptBox';
import MicButton from './MicButton';
import AudioWaveform from './AudioWaveform';
import { useJarvisVoice } from '@/hooks/useJarvisVoice';
import { LanguageMode } from '@/types/jarvis';
import { AlertTriangle, Clock, Shield, Activity, X, Globe, Wifi, WifiOff } from 'lucide-react';

export default function JarvisHUD() {
  const {
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
    clearError,
  } = useJarvisVoice();

  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-background text-slate-100 flex flex-col justify-between overflow-hidden select-none p-3 sm:p-6">
      {/* Sci-Fi Grid Overlay Effect */}
      <div className="absolute inset-0 scanline-overlay z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

      {/* Top Header HUD Bar */}
      <header className="relative z-20 w-full glass-hud rounded-xl px-4 py-3 mb-4 flex flex-wrap items-center justify-between gap-4 border border-cyan-500/30 font-mono text-xs shadow-cyan-glow">
        {/* Left Title & System Badge */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-400 flex items-center justify-center text-cyan-400 shadow-cyan-glow">
            <Shield className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold tracking-widest text-cyan-400 text-glow-cyan uppercase">
                J.A.R.V.I.S.
              </h1>
              <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-[10px] text-cyan-300 border border-cyan-500/40">
                v4.0.2
              </span>
            </div>
            <p className="text-[10px] text-slate-400">MARK VII NEURAL INTERFACE</p>
          </div>
        </div>

        {/* Center Language Selector & Offline Mode Control */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Language Selector Bar */}
          <div className="flex items-center bg-slate-950/90 rounded-lg p-1 border border-cyan-500/30 gap-1">
            <Globe className="w-3.5 h-3.5 text-cyan-400 ml-1.5 shrink-0" />
            <button
              onClick={() => setLanguage('english')}
              className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                language === 'english'
                  ? 'bg-cyan-500 text-black shadow-cyan-glow'
                  : 'text-slate-400 hover:text-cyan-300'
              }`}
            >
              ENGLISH
            </button>
            <button
              onClick={() => setLanguage('hinglish')}
              className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                language === 'hinglish'
                  ? 'bg-cyan-500 text-black shadow-cyan-glow'
                  : 'text-slate-400 hover:text-cyan-300'
              }`}
            >
              HINGLISH
            </button>
            <button
              onClick={() => setLanguage('hindi')}
              className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                language === 'hindi'
                  ? 'bg-cyan-500 text-black shadow-cyan-glow'
                  : 'text-slate-400 hover:text-cyan-300'
              }`}
            >
              हिंदी
            </button>
          </div>

          {/* Offline Mode Toggle Switch */}
          <button
            onClick={() => setIsOfflineMode(!isOfflineMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-bold text-[10px] transition-all cursor-pointer ${
              isOfflineMode
                ? 'bg-amber-950/80 border-amber-500/80 text-amber-300 shadow-amber-500/20 shadow-lg'
                : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400 hover:bg-emerald-950/60'
            }`}
            title="Toggle between Cloud AI and Pure Offline Engine"
          >
            {isOfflineMode ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span>OFFLINE MODE: ON</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span>ONLINE CLOUD AI</span>
              </>
            )}
          </button>
        </div>

        {/* Right Holographic State Indicator & Clock */}
        <div className="flex items-center gap-4 text-slate-400">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 border border-cyan-500/30">
            <div
              className={`w-2 h-2 rounded-full animate-ping ${
                state === 'listening'
                  ? 'bg-red-500'
                  : state === 'thinking'
                  ? 'bg-blue-500'
                  : state === 'speaking'
                  ? 'bg-emerald-400'
                  : 'bg-cyan-400'
              }`}
            />
            <span
              className={`font-bold tracking-widest uppercase text-[10px] ${
                state === 'listening'
                  ? 'text-red-400 text-glow-red'
                  : state === 'thinking'
                  ? 'text-blue-400 text-glow-blue'
                  : state === 'speaking'
                  ? 'text-emerald-400 text-glow-green'
                  : 'text-cyan-400 text-glow-cyan'
              }`}
            >
              {state === 'idle' ? 'STANDBY' : state}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span suppressHydrationWarning>{currentTime || '00:00:00'}</span>
          </div>
        </div>
      </header>

      {/* Error Alert Notification Banner */}
      {errorMsg && (
        <div className="relative z-30 mb-4 px-4 py-2.5 rounded-lg bg-rose-950/90 border border-rose-500/60 text-rose-200 text-xs font-mono flex items-center justify-between gap-2 shadow-red-glow">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button
            onClick={clearError}
            className="p-1 hover:bg-rose-900/60 rounded text-rose-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Grid Section */}
      <main className="relative z-20 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Left Side: System Metrics (3 cols on desktop) */}
        <div className="lg:col-span-3 order-2 lg:order-1 flex flex-col">
          <SystemMetrics state={state} />
        </div>

        {/* Center: 3D Visualizer & Mic Button (5 cols on desktop) */}
        <div className="lg:col-span-5 order-1 lg:order-2 flex flex-col justify-between items-center glass-hud p-4 rounded-xl border border-cyan-500/20 gap-4 min-h-[420px]">
          {/* 3D Core Canvas */}
          <div className="w-full flex-1 relative flex items-center justify-center">
            <JarvisCore state={state} audioLevel={audioLevel} />
          </div>

          {/* Real-time Audio Waveform */}
          <div className="w-full">
            <AudioWaveform state={state} audioLevel={audioLevel} />
          </div>

          {/* Interactive Microphone Control */}
          <div className="pb-2">
            <MicButton
              state={state}
              isMicAvailable={isMicAvailable}
              onToggleListening={startListening}
              onStopSpeaking={stopSpeaking}
            />
          </div>
        </div>

        {/* Right Side: Conversation Transcript (4 cols on desktop) */}
        <div className="lg:col-span-4 order-3 flex flex-col min-h-[380px]">
          <TranscriptBox
            messages={messages}
            transcript={transcript}
            state={state}
            onSendMessage={sendMessage}
          />
        </div>
      </main>

      {/* Sci-Fi HUD Footer Bar */}
      <footer className="relative z-20 w-full mt-4 glass-hud px-4 py-2 rounded-lg border border-cyan-500/20 text-[10px] font-mono text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="text-cyan-400 font-semibold">JARVIS OS v4.0</span>
          <span>•</span>
          <span className="text-cyan-300 uppercase">MODE: {isOfflineMode ? 'LOCAL_OFFLINE' : 'CLOUD_AI'}</span>
          <span>•</span>
          <span className="text-emerald-400 uppercase">LANG: {language}</span>
        </div>
        <div className="flex items-center gap-2 text-cyan-300/70">
          <span>POWERED BY NEXT.JS + THREE.JS + WEB SPEECH API</span>
        </div>
      </footer>
    </div>
  );
}
