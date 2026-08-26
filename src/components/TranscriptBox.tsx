'use client';

import React, { useRef, useEffect, useState } from 'react';
import { ChatMessage, AssistantState } from '@/types/jarvis';
import { Bot, User, Send, Sparkles, Terminal } from 'lucide-react';

interface TranscriptBoxProps {
  messages: ChatMessage[];
  transcript: string;
  state: AssistantState;
  onSendMessage: (text: string) => void;
}

export default function TranscriptBox({
  messages,
  transcript,
  state,
  onSendMessage,
}: TranscriptBoxProps) {
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, transcript]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  return (
    <div className="w-full h-full flex flex-col glass-hud rounded-xl border border-cyan-500/20 overflow-hidden font-mono text-xs">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-950/60 border-b border-cyan-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-wider">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span>Live Conversation Stream</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-[10px] text-cyan-300/80 uppercase">LOG_FEED_ACTIVE</span>
        </div>
      </div>

      {/* Message List */}
      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[350px] sm:max-h-[420px]">
        {messages.map((msg) => {
          const isJarvis = msg.sender === 'jarvis';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isJarvis ? 'items-start' : 'items-start flex-row-reverse'}`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  isJarvis
                    ? 'bg-cyan-950 border border-cyan-500/40 text-cyan-400 shadow-cyan-glow'
                    : 'bg-blue-950 border border-blue-500/40 text-blue-400'
                }`}
              >
                {isJarvis ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message Content */}
              <div className={`max-w-[82%] space-y-1 ${isJarvis ? 'text-left' : 'text-right'}`}>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 px-1">
                  <span className="font-semibold text-cyan-300">
                    {isJarvis ? 'JARVIS' : 'USER'}
                  </span>
                  <span>•</span>
                  <span suppressHydrationWarning>{msg.timestamp}</span>
                </div>
                <div
                  className={`p-3 rounded-xl border leading-relaxed text-slate-200 ${
                    msg.isError
                      ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                      : isJarvis
                      ? 'bg-slate-900/80 border-cyan-500/30 text-cyan-50 shadow-sm'
                      : 'bg-blue-950/40 border-blue-500/30 text-blue-100'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}

        {/* Live Recognition Speech Preview */}
        {state === 'listening' && transcript && (
          <div className="flex gap-3 items-start flex-row-reverse">
            <div className="w-7 h-7 rounded-lg bg-red-950 border border-red-500/50 text-red-400 flex items-center justify-center shrink-0 animate-pulse">
              <User className="w-4 h-4" />
            </div>
            <div className="max-w-[82%] space-y-1 text-right">
              <span className="text-[10px] text-red-400 font-semibold uppercase tracking-wider">
                Listening in real-time...
              </span>
              <div className="p-3 rounded-xl border bg-red-950/20 border-red-500/40 text-red-200 italic animate-pulse">
                "{transcript}"
              </div>
            </div>
          </div>
        )}

        {/* AI Thinking Indicator */}
        {state === 'thinking' && (
          <div className="flex gap-3 items-start">
            <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0 animate-spin">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="p-3 rounded-xl border bg-cyan-950/20 border-cyan-500/30 text-cyan-300 flex items-center gap-2">
              <span className="animate-pulse">JARVIS is processing quantum parameters...</span>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Text Input Box */}
      <form
        onSubmit={handleSubmit}
        className="p-3 bg-slate-950/80 border-t border-cyan-500/20 flex gap-2 items-center"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Command JARVIS via text or speak using the mic..."
          disabled={state === 'thinking' || state === 'speaking'}
          className="flex-1 bg-slate-900/90 border border-cyan-500/30 rounded-lg px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || state === 'thinking' || state === 'speaking'}
          className="px-3.5 py-2 bg-cyan-500/20 border border-cyan-500/50 hover:bg-cyan-500/30 text-cyan-300 rounded-lg flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed font-semibold"
        >
          <span>SEND</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
