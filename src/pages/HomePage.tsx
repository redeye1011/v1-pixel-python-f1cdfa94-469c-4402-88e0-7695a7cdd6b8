import React, { useCallback, useEffect, useRef } from 'react';
import { useGameStore } from '@/store/game-store';
import {
  BOOST_CONFIG,
  BOOST_TYPES,
  GRID_SIZE,
  SCORING_TIERS,
} from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useGameSounds } from '@/hooks/use-game-sounds';
import { motion, AnimatePresence } from 'framer-motion';
import { useHotkeys } from 'react-hotkeys-hook';
const GameHeader = () => {
  const score = useGameStore((s) => s.score);
  const gameTimer = useGameStore((s) => s.gameTimer);
  const activeBoost = useGameStore((s) => s.activeBoost);
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };
  return (
    <div className="flex items-center justify-between p-4 border-b-2 border-neon-pink mb-4 text-xs sm:text-sm md:text-base">
      <div className="text-neon-green">
        SCORE: <span className="text-white tabular-nums">{score}</span>
      </div>
      <div className="text-neon-green">
        TIME: <span className="text-white tabular-nums">{formatTime(gameTimer)}</span>
      </div>
      <div className="text-neon-green text-right">
        BOOST:{' '}
        <span className="text-white">
          {activeBoost
            ? `${BOOST_CONFIG[activeBoost.type].symbol} (${activeBoost.timeLeft}s)`
            : 'N/A'}
        </span>
      </div>
    </div>
  );
};
const GameGrid = () => {
  const snake = useGameStore((s) => s.snake);
  const foods = useGameStore((s) => s.foods);
  const bonusFruit = useGameStore((s) => s.bonusFruit);
  const boosts = useGameStore((s) => s.boosts);
  const activeBoost = useGameStore((s) => s.activeBoost);
  const isGlitching = activeBoost?.type === BOOST_TYPES.GLITCH_MULTIPLIER;
  return (
    <div
      className={cn(
        'relative bg-black/50 grid border-2 border-neon-pink',
        'aspect-square w-full',
        isGlitching && 'animate-glitch'
      )}
      style={{
        gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
        gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        backgroundImage:
          'linear-gradient(to right, #39FF141A 1px, transparent 1px), linear-gradient(to bottom, #39FF141A 1px, transparent 1px)',
        backgroundSize: `calc(100% / ${GRID_SIZE}) calc(100% / ${GRID_SIZE})`,
      }}
    >
      {/* Snake */}
      {snake.map((segment, i) => (
        <div
          key={`snake-${i}-${segment.x}-${segment.y}`}
          className={cn(
            'bg-neon-green',
            activeBoost?.type === BOOST_TYPES.PHASE_SHIFT && 'opacity-50 animate-pulse'
          )}
          style={{
            gridColumnStart: segment.x + 1,
            gridRowStart: segment.y + 1,
            boxShadow: i === 0 ? '0 0 8px #39FF14' : 'none',
          }}
        />
      ))}
      {/* Food */}
      {foods.map((food, i) => (
        <div
          key={`food-${food.x}-${food.y}-${i}`}
          className="bg-neon-green rounded-full box-shadow-green"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
          }}
        ></div>
      ))}
      {/* Bonus Fruit */}
      {bonusFruit && (
        <div
          className="text-neon-pink text-center text-lg animate-pulse"
          style={{
            gridColumnStart: bonusFruit.x + 1,
            gridRowStart: bonusFruit.y + 1,
          }}
        >
          🍓
        </div>
      )}
      {/* Boosts */}
      {boosts.map((boost, i) => (
        <div
          key={`${boost.type}-${i}`}
          className="text-neon-pink text-center flex items-center justify-center text-lg md:text-xl animate-pulse text-shadow-pink"
          style={{
            gridColumnStart: boost.location.x + 1,
            gridRowStart: boost.location.y + 1,
          }}
        >
          {BOOST_CONFIG[boost.type].symbol}
        </div>
      ))}
    </div>
  );
};
const StartScreen = ({ onStart }: { onStart: () => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    className="absolute inset-0 bg-[#1A1A1A] z-10 flex flex-col items-center justify-center p-4 text-center"
  >
    <h1 className="text-4xl md:text-6xl text-neon-green text-shadow-green mb-4">
      Pixel Python
    </h1>
    <p className="text-neon-pink mb-8">&gt; INSERT COIN &lt;</p>
    <div className="mb-8 text-left max-w-md mx-auto text-xs md:text-sm">
      <h2 className="text-neon-pink mb-2">SCORING TIERS:</h2>
      <ul className="text-white space-y-1">
        {SCORING_TIERS.slice().reverse().map(tier => (
          <li key={tier.rank}>{`> ${tier.min.toString().padStart(4, ' ')} : ${tier.rank}`}</li>
        ))}
      </ul>
    </div>
    <button
      onClick={onStart}
      className="px-8 py-4 bg-neon-green text-[#1A1A1A] text-xl hover:bg-white hover:text-neon-pink transition-colors duration-200 border-2 border-neon-green"
    >
      START
    </button>
    <p className="mt-12 text-xs text-neon-green/50">Use Arrow Keys to Move</p>
  </motion.div>
);
const GameOverScreen = ({ onRestart }: { onRestart: () => void }) => {
  const score = useGameStore((s) => s.score);
  const rank = SCORING_TIERS.slice().reverse().find(tier => score >= tier.min)?.rank || "Pixel Pilot";
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 bg-[#1A1A1A]/90 z-10 flex flex-col items-center justify-center p-4 text-center"
    >
      <h1 className="text-5xl md:text-7xl text-neon-pink text-shadow-pink mb-4 animate-glitch">
        GAME OVER
      </h1>
      <p className="text-2xl text-white mb-2">FINAL SCORE: {score}</p>
      <p className="text-xl text-neon-green mb-8">RANK: {rank}</p>
      <button
        onClick={onRestart}
        className="px-8 py-4 bg-neon-green text-[#1A1A1A] text-xl hover:bg-white hover:text-neon-pink transition-colors duration-200 border-2 border-neon-green"
      >
        PLAY AGAIN
      </button>
    </motion.div>
  );
};
export function HomePage() {
  const { gameStatus, startGame, resetGame, changeDirection, tick, advanceTimers } = useGameStore();
  const gameSpeed = useGameStore((s) => s.gameSpeed);
  const { playStartSound, playGameOverSound } = useGameSounds();
  const gameLoopRef = useRef<number | null>(null);
  const timerLoopRef = useRef<number | null>(null);
  useEffect(() => {
    if (gameStatus === 'playing') {
      // Game tick loop
      gameLoopRef.current = window.setInterval(tick, gameSpeed);
      // Separate timer loop that runs every second
      timerLoopRef.current = window.setInterval(advanceTimers, 1000);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      if (timerLoopRef.current) clearInterval(timerLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      if (timerLoopRef.current) clearInterval(timerLoopRef.current);
    };
  }, [gameStatus, gameSpeed, tick, advanceTimers]);
  const handleStart = useCallback(() => {
    playStartSound();
    startGame();
  }, [playStartSound, startGame]);
  const handleRestart = useCallback(() => {
    playStartSound();
    resetGame();
    startGame();
  }, [playStartSound, resetGame, startGame]);
  useEffect(() => {
    if (gameStatus === 'gameOver') {
      playGameOverSound();
    }
  }, [gameStatus, playGameOverSound]);
  useHotkeys('arrowup, w', () => changeDirection({ x: 0, y: -1 }), { preventDefault: true });
  useHotkeys('arrowdown, s', () => changeDirection({ x: 0, y: 1 }), { preventDefault: true });
  useHotkeys('arrowleft, a', () => changeDirection({ x: -1, y: 0 }), { preventDefault: true });
  useHotkeys('arrowright, d', () => changeDirection({ x: 1, y: 0 }), { preventDefault: true });
  useHotkeys('enter, space', () => {
    if (gameStatus === 'idle') handleStart();
    if (gameStatus === 'gameOver') handleRestart();
  }, { preventDefault: true }, [gameStatus, handleStart, handleRestart]);
  return (
    <main className="min-h-screen bg-[#1A1A1A] flex flex-col items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-3xl mx-auto relative">
        <AnimatePresence>
          {gameStatus === 'idle' && <StartScreen onStart={handleStart} />}
          {gameStatus === 'gameOver' && <GameOverScreen onRestart={handleRestart} />}
        </AnimatePresence>
        <div className={cn('transition-filter duration-300', gameStatus !== 'playing' && 'blur-sm')}>
          <GameHeader />
          <GameGrid />
          <div className="text-center text-neon-pink mt-4 text-xs">
            &gt; PIXEL PYTHON: A TIMED BOOST CHALLENGE &lt;
          </div>
        </div>
      </div>
      <footer className="absolute bottom-4 text-center text-neon-green/50 text-xs">
        <p>Built with ❤️ at Cloudflare</p>
      </footer>
    </main>
  );
}