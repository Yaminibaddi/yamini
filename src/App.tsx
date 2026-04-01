import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Terminal, Activity, Cpu } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-cyan-400 flex flex-col items-center justify-center p-4 relative overflow-hidden font-pixel selection:bg-magenta-500 selection:text-white">
      {/* Static Noise Overlay */}
      <div className="absolute inset-0 z-50 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Scanline Effect */}
      <div className="scanline" />

      {/* Background Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-10" 
           style={{ 
             backgroundImage: `linear-gradient(#00ffff 1px, transparent 1px), linear-gradient(90deg, #00ffff 1px, transparent 1px)`,
             backgroundSize: '20px 20px'
           }} 
      />

      {/* Header */}
      <header className="relative z-10 mb-12 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="flex items-center gap-4">
            <Terminal className="text-magenta-500 animate-pulse" size={32} />
            <h1 className="text-6xl font-display uppercase tracking-tighter glitch-text">
              NULL_ARCADE
            </h1>
            <Cpu className="text-magenta-500 animate-pulse" size={32} />
          </div>
          <div className="h-1 w-full bg-magenta-500 mt-2 shadow-[0_0_10px_#ff00ff]" />
        </motion.div>
        <p className="mt-4 text-magenta-500 font-mono text-sm uppercase tracking-[0.5em] animate-pulse">
          [ SYSTEM_STATUS: UNSTABLE // RHYTHM_SYNC: ACTIVE ]
        </p>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col lg:flex-row items-start justify-center gap-8 w-full max-w-7xl">
        {/* Left Side: Machine Logs */}
        <div className="hidden xl:flex flex-col gap-4 w-72 h-[500px] border-2 border-cyan-500/30 p-4 bg-black/80 font-mono text-[10px] overflow-hidden">
          <div className="flex items-center gap-2 text-magenta-500 mb-2 border-b border-magenta-500/30 pb-2">
            <Activity size={14} /> <span>CORE_LOGS</span>
          </div>
          <div className="space-y-1 opacity-70">
            <p className="text-cyan-500">{`> INITIALIZING_GRID... [OK]`}</p>
            <p className="text-cyan-500">{`> LOADING_SNAKE_MODULE... [OK]`}</p>
            <p className="text-cyan-500">{`> SYNCING_AUDIO_BUFFER... [OK]`}</p>
            <p className="text-magenta-500">{`> WARNING: BUFFER_OVERFLOW_DETECTED`}</p>
            <p className="text-cyan-500">{`> REROUTING_POWER...`}</p>
            <p className="text-cyan-500">{`> GLITCH_PROTOCOL_V4_ENABLED`}</p>
            <p className="text-cyan-500">{`> USER_IDENTIFIED: <UNKNOWN>`}</p>
            <p className="text-magenta-500">{`> ERROR: REALITY_LEAK_DETECTED`}</p>
            <p className="text-cyan-500">{`> ATTEMPTING_RECOVERY...`}</p>
            <p className="text-cyan-500">{`> SYSTEM_STABLE_ISH`}</p>
          </div>
          <div className="mt-auto pt-4 border-t border-cyan-500/30">
            <p className="text-magenta-500 animate-pulse">SEARCHING FOR INPUT...</p>
          </div>
        </div>

        {/* Center: Snake Game */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex-1 glitch-border p-2 bg-black"
        >
          <SnakeGame />
        </motion.div>

        {/* Right Side: Music Player */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-full lg:w-auto glitch-border p-2 bg-black"
        >
          <MusicPlayer />
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-16 flex flex-col items-center gap-4">
        <div className="flex gap-12 text-[12px] font-mono text-magenta-500 uppercase tracking-[0.3em]">
          <span className="hover:text-cyan-400 cursor-help transition-colors">ERR_CODE: 0x000F</span>
          <span className="hover:text-cyan-400 cursor-help transition-colors">MEM_DUMP: 100%</span>
          <span className="hover:text-cyan-400 cursor-help transition-colors">SIG_LOST</span>
        </div>
        <div className="text-[10px] text-cyan-900 mt-4">
          PRODUCED BY THE MACHINE // 2026
        </div>
      </footer>
    </div>
  );
}
