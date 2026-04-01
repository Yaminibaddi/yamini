import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const SPEED = 150;

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const directionRef = useRef(INITIAL_DIRECTION);
  const snakeRef = useRef(INITIAL_SNAKE);

  // Sync refs with state for the game loop
  useEffect(() => {
    snakeRef.current = snake;
  }, [snake]);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const generateFood = useCallback((currentSnake: {x: number, y: number}[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    const newSnake = INITIAL_SNAKE;
    const newFood = generateFood(newSnake);
    setSnake(newSnake);
    setDirection(INITIAL_DIRECTION);
    setFood(newFood);
    setScore(0);
    setGameOver(false);
    setIsPaused(true);
    directionRef.current = INITIAL_DIRECTION;
    snakeRef.current = newSnake;
  };

  const moveSnake = useCallback(() => {
    setSnake(prevSnake => {
      const head = prevSnake[0];
      const currentDir = directionRef.current;
      const newHead = {
        x: (head.x + currentDir.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + currentDir.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (directionRef.current.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (directionRef.current.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (directionRef.current.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (directionRef.current.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!isPaused && !gameOver) {
      gameLoopRef.current = setInterval(moveSnake, SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPaused, gameOver, moveSnake]);

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-black border-2 border-cyan-500 shadow-[0_0_15px_rgba(0,255,255,0.3)] relative overflow-hidden">
      {/* Glitchy Background Effect */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      <div className="flex justify-between w-full px-2 relative z-10">
        <div className="text-cyan-400 font-pixel text-2xl tracking-widest glitch-text">
          SCORE: <span className="text-magenta-500">{score}</span>
        </div>
        <div className="text-magenta-500 font-pixel text-lg animate-pulse uppercase">
          {gameOver ? '!! CRITICAL_FAILURE !!' : isPaused ? '>> STANDBY' : '>> EXECUTING'}
        </div>
      </div>

      <div 
        className="relative bg-black border-4 border-magenta-500 shadow-[0_0_20px_rgba(255,0,255,0.2)] overflow-hidden"
        style={{ 
          width: GRID_SIZE * 20, 
          height: GRID_SIZE * 20,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Snake Body */}
        {snake.map((segment, i) => (
          <motion.div
            key={`${i}-${segment.x}-${segment.y}`}
            initial={false}
            animate={{ 
              x: segment.x * 20, 
              y: segment.y * 20,
              scale: i === 0 ? 1 : 0.9
            }}
            className={`absolute w-5 h-5 ${
              i === 0 ? 'bg-cyan-400 shadow-[0_0_10px_#00ffff]' : 'bg-cyan-900 border border-cyan-400/30'
            }`}
          />
        ))}

        {/* Food */}
        <motion.div
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
            rotate: [0, 90, 180, 270, 360]
          }}
          transition={{ repeat: Infinity, duration: 0.5 }}
          className="absolute w-5 h-5 bg-magenta-500 shadow-[0_0_15px_#ff00ff]"
          style={{ 
            left: food.x * 20, 
            top: food.y * 20 
          }}
        />

        {/* Overlays */}
        <AnimatePresence>
          {(gameOver || isPaused) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm z-10"
            >
              {gameOver ? (
                <>
                  <h2 className="text-5xl font-display text-magenta-500 mb-6 glitch-text tracking-tighter">FATAL_ERROR</h2>
                  <button 
                    onClick={resetGame}
                    className="px-8 py-3 bg-cyan-500 text-black font-pixel text-xl font-bold hover:bg-magenta-500 hover:text-white transition-all border-2 border-white shadow-[4px_4px_0px_white] active:translate-x-1 active:translate-y-1 active:shadow-none"
                  >
                    REBOOT_SYSTEM
                  </button>
                </>
              ) : (
                <div className="text-center p-4 border-2 border-cyan-500 bg-cyan-500/10">
                  <p className="text-cyan-400 text-2xl mb-6 font-pixel glitch-text tracking-[0.2em]">WAITING_FOR_INPUT</p>
                  <div className="flex gap-4 justify-center">
                    <div className="w-10 h-10 border-2 border-magenta-500 flex items-center justify-center text-magenta-500 font-bold">W</div>
                    <div className="w-10 h-10 border-2 border-magenta-500 flex items-center justify-center text-magenta-500 font-bold">A</div>
                    <div className="w-10 h-10 border-2 border-magenta-500 flex items-center justify-center text-magenta-500 font-bold">S</div>
                    <div className="w-10 h-10 border-2 border-magenta-500 flex items-center justify-center text-magenta-500 font-bold">D</div>
                  </div>
                  <p className="text-magenta-500 text-xs mt-4 font-mono">[ SPACE ] TO INITIALIZE</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-magenta-500/40 text-[12px] font-mono uppercase tracking-[0.3em] mt-2">
        DIRECTION_VECTORS: ACTIVE // GRID_COORD: {snake[0].x},{snake[0].y}
      </div>
    </div>
  );
};
