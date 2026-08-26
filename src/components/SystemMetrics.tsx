'use client';

import React, { useState, useEffect } from 'react';
import { Cpu, HardDrive, Activity, Zap, ShieldCheck, Radio, Server } from 'lucide-react';
import { AssistantState } from '@/types/jarvis';

interface SystemMetricsProps {
  state: AssistantState;
}

export default function SystemMetrics({ state }: SystemMetricsProps) {
  const [cpu, setCpu] = useState<number>(34);
  const [ram, setRam] = useState<number>(4.2);
  const [neuralSync, setNeuralSync] = useState<number>(98.7);
  const [latency, setLatency] = useState<number>(14);
  const [coreTemp, setCoreTemp] = useState<number>(42);

  // Dynamic simulation effect for metrics
  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuate cpu based on current state
      let baseCpu = 25;
      if (state === 'listening') baseCpu = 55;
      if (state === 'thinking') baseCpu = 88;
      if (state === 'speaking') baseCpu = 65;

      setCpu(Math.min(99, Math.max(10, Math.floor(baseCpu + (Math.random() * 18 - 9)))));
      setRam(parseFloat((4.1 + Math.random() * 0.4).toFixed(1)));
      setNeuralSync(parseFloat((98.2 + Math.random() * 1.5).toFixed(1)));
      setLatency(Math.floor(12 + Math.random() * 8));
      setCoreTemp(Math.floor(41 + (state === 'thinking' ? 12 : 2) + Math.random() * 4));
    }, 1500);

    return () => clearInterval(interval);
  }, [state]);

  return (
    <div className="w-full h-full flex flex-col justify-between gap-4 select-none">
      {/* Top System Health Card */}
      <div className="glass-hud p-4 rounded-xl border border-cyan-500/20 text-xs font-mono">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-cyan-500/20">
          <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>JARVIS Diagnostics</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 text-[10px] border border-cyan-500/40">
            SEC-7 ONLINE
          </span>
        </div>

        {/* CPU Metric */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1 text-slate-300">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              CPU Load
            </span>
            <span className="font-semibold text-cyan-300">{cpu}%</span>
          </div>
          <div className="w-full bg-slate-900/80 h-1.5 rounded-full overflow-hidden border border-cyan-500/30">
            <div
              className={`h-full transition-all duration-500 ${
                cpu > 80 ? 'bg-rose-500' : cpu > 60 ? 'bg-amber-400' : 'bg-cyan-400'
              }`}
              style={{ width: `${cpu}%` }}
            />
          </div>
        </div>

        {/* Memory Metric */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1 text-slate-300">
            <span className="flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
              RAM Allocated
            </span>
            <span className="font-semibold text-cyan-300">{ram} / 16 GB</span>
          </div>
          <div className="w-full bg-slate-900/80 h-1.5 rounded-full overflow-hidden border border-cyan-500/30">
            <div
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${(ram / 16) * 100}%` }}
            />
          </div>
        </div>

        {/* Core Temperature */}
        <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-slate-400">
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Core Temp
          </span>
          <span className={`font-semibold ${coreTemp > 50 ? 'text-rose-400' : 'text-slate-200'}`}>
            {coreTemp}°C
          </span>
        </div>
      </div>

      {/* Bottom Neural telemetry Card */}
      <div className="glass-hud p-4 rounded-xl border border-cyan-500/20 text-xs font-mono">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-cyan-500/20">
          <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-wider">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Neural Telemetry</span>
          </div>
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-ping" />
        </div>

        <div className="space-y-2.5">
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">Neural Sync</span>
            <span className="font-semibold text-emerald-400">{neuralSync}%</span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">API Latency</span>
            <span className="font-semibold text-cyan-300">{latency} ms</span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">Quantum Matrix</span>
            <span className="font-semibold text-indigo-400">STABLE</span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">Audio Engine</span>
            <span className="font-semibold text-cyan-400">WEB_SPEECH</span>
          </div>
        </div>

        {/* Live Graphic Equalizer Bars */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          <div className="text-[10px] text-slate-500 mb-1 flex items-center justify-between">
            <span>SPECTRUM FREQ</span>
            <span>24.4 kHz</span>
          </div>
          <div className="flex items-end justify-between h-8 gap-1">
            {[45, 80, 60, 30, 90, 75, 40, 65, 85, 50, 95, 35].map((val, idx) => {
              const dynamicHeight = Math.min(
                100,
                Math.max(15, Math.floor(val * (state === 'speaking' || state === 'listening' ? 1.2 : 0.6)))
              );
              return (
                <div
                  key={idx}
                  className="flex-1 bg-cyan-500/40 rounded-t transition-all duration-300"
                  style={{
                    height: `${dynamicHeight}%`,
                    backgroundColor:
                      state === 'listening'
                        ? '#ff2a5f'
                        : state === 'speaking'
                        ? '#00ffaa'
                        : '#00f0ff',
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
