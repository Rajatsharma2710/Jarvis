import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'JARVIS - 3D Real-time AI Voice Assistant',
  description: 'Futuristic 3D AI Voice Assistant inspired by Iron Man JARVIS, powered by Next.js, React Three Fiber, Web Speech API, and OpenAI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-background text-slate-100 selection:bg-cyan-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
