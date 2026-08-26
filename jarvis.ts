export type AssistantState = 'idle' | 'listening' | 'thinking' | 'speaking';

export type LanguageMode = 'english' | 'hinglish' | 'hindi';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'jarvis';
  text: string;
  timestamp: string;
  isError?: boolean;
}

export interface SystemMetrics {
  cpuLoad: number;
  memoryUsage: number;
  neuralSync: number;
  latencyMs: number;
  coreTempCelsius: number;
  quantumFlux: number;
}
