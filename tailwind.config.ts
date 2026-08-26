import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#030712',
        surface: 'rgba(15, 23, 42, 0.65)',
        'cyan-glow': '#00f0ff',
        'neon-cyan': '#00f0ff',
        'cobalt-blue': '#3b82f6',
        'jarvis-red': '#ff2a5f',
        'jarvis-green': '#00ffaa',
      },
      fontFamily: {
        mono: ['Courier New', 'monospace', 'ui-monospace', 'SFMono-Regular'],
      },
      boxShadow: {
        'cyan-glow': '0 0 25px rgba(0, 240, 255, 0.4)',
        'cyan-intense': '0 0 40px rgba(0, 240, 255, 0.8)',
        'red-glow': '0 0 30px rgba(255, 42, 95, 0.7)',
        'blue-glow': '0 0 30px rgba(59, 130, 246, 0.7)',
        'green-glow': '0 0 30px rgba(0, 255, 170, 0.7)',
        'hud-card': '0 8px 32px 0 rgba(0, 240, 255, 0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
        'ping-slow': 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'radar-sweep': 'radar 4s linear infinite',
        'hud-scan': 'hudScan 6s ease-in-out infinite',
      },
      keyframes: {
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        hudScan: {
          '0%, 100%': { transform: 'translateY(0%)' },
          '50%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
