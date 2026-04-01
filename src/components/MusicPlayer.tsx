import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SONGS = [
  {
    id: 1,
    title: "Neon Dreams",
    artist: "Synthwave AI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://picsum.photos/seed/neon/200/200"
  },
  {
    id: 2,
    title: "Cyber City",
    artist: "Retro Future",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://picsum.photos/seed/cyber/200/200"
  },
  {
    id: 3,
    title: "Digital Horizon",
    artist: "AI Beats",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://picsum.photos/seed/digital/200/200"
  }
];

export const MusicPlayer: React.FC = () => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSong = SONGS[currentSongIndex];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipForward = () => {
    setCurrentSongIndex((prev) => (prev + 1) % SONGS.length);
    setIsPlaying(true);
  };

  const skipBackward = () => {
    setCurrentSongIndex((prev) => (prev - 1 + SONGS.length) % SONGS.length);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentSong.url;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentSongIndex, currentSong.url]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const p = (audio.currentTime / audio.duration) * 100;
      setProgress(p || 0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', skipForward);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', skipForward);
    };
  }, []);

  return (
    <div className="w-full max-w-md p-6 bg-black border-2 border-magenta-500 shadow-[0_0_15px_rgba(255,0,255,0.3)] relative overflow-hidden">
      {/* Static Noise Effect */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      <audio ref={audioRef} />
      
      <div className="flex items-center gap-6 mb-6 relative z-10">
        <motion.div 
          key={currentSong.id}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="relative w-24 h-24 border-2 border-cyan-500 shadow-[4px_4px_0px_#00ffff]"
        >
          <img 
            src={currentSong.cover} 
            alt={currentSong.title} 
            className="w-full h-full object-cover grayscale contrast-125"
            referrerPolicy="no-referrer"
          />
          {isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-magenta-500/20 backdrop-invert-[0.2]">
              <div className="flex gap-1 items-end h-12">
                {[1, 2, 3, 4, 5].map(i => (
                  <motion.div
                    key={i}
                    animate={{ height: [4, 32, 8, 24, 4] }}
                    transition={{ repeat: Infinity, duration: 0.4, delay: i * 0.05 }}
                    className="w-1.5 bg-cyan-400"
                  />
                ))}
              </div>
            </div>
          )}
        </motion.div>

        <div className="flex-1 overflow-hidden">
          <h3 className="text-2xl font-display text-white truncate tracking-tighter glitch-text">{currentSong.title}</h3>
          <p className="text-cyan-400 font-pixel text-lg truncate uppercase tracking-[0.2em]">{currentSong.artist}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-4 w-full bg-cyan-900 border border-cyan-500 mb-6 overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 h-full bg-magenta-500 shadow-[0_0_10px_#ff00ff]"
          style={{ width: `${progress}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-[8px] font-mono text-white mix-blend-difference">
          DATA_STREAM: {Math.floor(progress)}%
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6">
        <button 
          onClick={skipBackward}
          className="text-cyan-400 hover:text-magenta-500 transition-colors p-2 border border-transparent hover:border-magenta-500"
        >
          <SkipBack size={32} />
        </button>

        <button 
          onClick={togglePlay}
          className="w-16 h-16 flex items-center justify-center bg-magenta-500 text-black hover:bg-cyan-400 transition-all border-2 border-white shadow-[4px_4px_0px_white] active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
        </button>

        <button 
          onClick={skipForward}
          className="text-cyan-400 hover:text-magenta-500 transition-colors p-2 border border-transparent hover:border-magenta-500"
        >
          <SkipForward size={32} />
        </button>
      </div>

      <div className="mt-8 pt-4 border-t border-magenta-500/30 flex items-center justify-between text-[10px] font-mono text-magenta-500 uppercase tracking-[0.3em]">
        <div className="flex items-center gap-2">
          <Volume2 size={14} />
          <span>SIGNAL_STRENGTH: 100%</span>
        </div>
        <div className="flex items-center gap-2">
          <Music size={14} />
          <span>BUFFER_ID: {currentSong.id}</span>
        </div>
      </div>
    </div>
  );
};
