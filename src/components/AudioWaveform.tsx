'use client';

import React from 'react';
import { AssistantState } from '@/types/jarvis';

interface AudioWaveformProps {
  state: AssistantState;
  audioLevel: number;
}

export default function AudioWaveform({ state, audioLevel }: AudioWaveformProps) {
  const barsCount = 24;

  return (
    <div className="w-full flex items-center justify-center gap-1 h-10 px-4">
      {Array.from({ length: barsCount }).map((_, i) => {
        // Calculate symmetrical wave height offset
        const centerDistance = Math.abs(i - barsCount / 2) / (barsCount / 2);
        const waveFactor = 1 - centerDistance * 0.6;
        
        let heightPercent = 15;
        if (state === 'listening' || state === 'speaking') {
          heightPercent = Math.min(
            100,
            Math.max(20, Math.floor(audioLevel * 100 * waveFactor * (0.8 + Math.sin(i + Date.now() * 0.01) * 0.4)))
          );
        } else if (state === 'thinking') {
          heightPercent = Math.floor(30 + Math.sin(i * 0.8 + Date.now() * 0.008) * 25);
        }

        const activeColor =
          state === 'listening'
            ? '#ff2a5f'
            : state === 'speaking'
            ? '#00ffaa'
            : state === 'thinking'
            ? '#3b82f6'
            : '#00f0ff';

        return (
          <div
            key={i}
            className="w-1 sm:w-1.5 rounded-full transition-all duration-150"
            style={{
              height: `${heightPercent}%`,
              backgroundColor: activeColor,
              boxShadow: `0 0 8px ${activeColor}`,
              opacity: state === 'idle' ? 0.3 : 0.95,
            }}
          />
        );
      })}
    </div>
  );
}
