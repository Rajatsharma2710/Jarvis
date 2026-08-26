'use client';

import React from 'react';
import { Mic, MicOff, Volume2, Square, Loader2, Settings } from 'lucide-react';
import { AssistantState } from '@/types/jarvis';

interface MicButtonProps {
  state: AssistantState;
  isMicAvailable: boolean;
  onToggleListening: () => void;
  onStopSpeaking: () => void;
}

export default function MicButton({
  state,
  isMicAvailable,
  onToggleListening,
  onStopSpeaking,
}: MicButtonProps) {
  const isListening = state === 'listening';
  const isThinking = state === 'thinking';
  const isSpeaking = state === 'speaking';

  const handleClick = () => {
    if (isSpeaking) {
      onStopSpeaking();
    } else {
      // Always try to start listening, even if previously blocked
      // This re-triggers the browser permission dialog if it was dismissed
      onToggleListening();
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center gap-3">
      {/* Dynamic Soundwave Concentric Pulsing Rings */}
      {(isListening || isSpeaking) && (
        <>
          <div
            className={`absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full animate-ping opacity-35 ${
              isListening ? 'bg-jarvis-red' : 'bg-jarvis-green'
            }`}
          />
          <div
            className={`absolute w-36 h-36 sm:w-40 sm:h-40 rounded-full border border-dashed animate-spin-slow opacity-40 ${
              isListening ? 'border-red-500' : 'border-emerald-400'
            }`}
          />
        </>
      )}

      {/* Main Mic Button — always clickable to re-trigger browser permission */}
      <button
        onClick={handleClick}
        disabled={isThinking}
        className={`relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all duration-500 border-2 cursor-pointer shadow-2xl ${
          isListening
            ? 'bg-red-950/80 border-red-500 text-red-300 shadow-red-glow scale-110'
            : isThinking
            ? 'bg-blue-950/80 border-blue-400 text-blue-300 shadow-blue-glow animate-pulse'
            : isSpeaking
            ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 shadow-green-glow scale-105'
            : !isMicAvailable
            ? 'bg-amber-950/70 border-amber-500 text-amber-300 hover:border-amber-300 hover:scale-105 shadow-amber-500/30 shadow-lg'
            : 'bg-slate-900/90 border-cyan-400/60 text-cyan-400 hover:border-cyan-300 hover:shadow-cyan-intense hover:scale-105'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        title={
          isSpeaking
            ? 'Click to stop JARVIS speaking'
            : isListening
            ? 'Click to stop listening'
            : !isMicAvailable
            ? 'Click to retry mic permission'
            : 'Click to start speaking to JARVIS'
        }
      >
        {isThinking ? (
          <Loader2 className="w-9 h-9 animate-spin text-cyan-400" />
        ) : isSpeaking ? (
          <Square className="w-8 h-8 fill-emerald-400 text-emerald-400" />
        ) : isListening ? (
          <Mic className="w-10 h-10 animate-bounce text-red-400" />
        ) : !isMicAvailable ? (
          <MicOff className="w-9 h-9 text-amber-400 animate-pulse" />
        ) : (
          <Mic className="w-9 h-9" />
        )}
      </button>

      {/* Mic permission fix helper button */}
      {!isMicAvailable && !isListening && !isSpeaking && !isThinking && (
        <button
          onClick={() => {
            // Try to re-request permission by clicking the mic
            handleClick();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/60 border border-amber-500/70 text-amber-300 text-[10px] font-mono font-bold hover:bg-amber-950/90 transition-colors cursor-pointer"
          title="Click to request mic permission again"
        >
          <Settings className="w-3 h-3" />
          RETRY MIC PERMISSION
        </button>
      )}

      {/* Helper State Label below button */}
      <div className="text-[11px] font-mono tracking-widest uppercase flex items-center gap-1.5 font-bold">
        {isListening ? (
          <span className="text-red-400 text-glow-red animate-pulse flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            LISTENING... TAP TO STOP
          </span>
        ) : isThinking ? (
          <span className="text-cyan-400 text-glow-cyan animate-pulse">PROCESSING PROMPT...</span>
        ) : isSpeaking ? (
          <span className="text-emerald-400 text-glow-green flex items-center gap-1">
            <Volume2 className="w-3.5 h-3.5 animate-pulse" />
            JARVIS SPEAKING... TAP TO MUTE
          </span>
        ) : !isMicAvailable ? (
          <span className="text-amber-400 animate-pulse">MIC BLOCKED — TAP TO RETRY</span>
        ) : (
          <span className="text-cyan-300/80 text-glow-cyan">TAP MICROPHONE TO COMMAND</span>
        )}
      </div>
    </div>
  );
}
