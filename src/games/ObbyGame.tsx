import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

interface ObbyGameProps {
  onBack: () => void;
}

const ObbyGame: React.FC<ObbyGameProps> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  const playerRef = useRef({
    x: 50,
    y: 300,
    width: 20,
    height: 30,
    velocityY: 0,
    velocityX: 0,
    jumping: false,
  });

  const platformsRef = useRef([
    { x: 0, y: 350, width: 100, height: 20, color: '#22c55e', moving: false, direction: 0 },
    { x: 150, y: 300, width: 80, height: 20, color: '#3b82f6', moving: true, direction: 1 },
    { x: 300, y: 250, width: 80, height: 20, color: '#22c55e', moving: false, direction: 0 },
    { x: 450, y: 200, width: 80, height: 20, color: '#f59e0b', moving: false, direction: 0 },
    { x: 600, y: 150, width: 200, height: 20, color: '#10b981', moving: false, direction: 0 },
  ]);

  const handleKeyDown = (e: KeyboardEvent) => {
    keysPressed.current[e.key.toLowerCase()] = true;
    if (e.key === ' ') {
      e.preventDefault();
      const player = playerRef.current;
      if (!player.jumping) {
        player.velocityY = -12;
        player.jumping = true;
      }
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    keysPressed.current[e.key.toLowerCase()] = false;
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (!gameStarted || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    let animationId: number;

    const gameLoop = () => {
      const player = playerRef.current;
      const platforms = platformsRef.current;

      if (keysPressed.current['a']) player.velocityX = -5;
      if (keysPressed.current['d']) player.velocityX = 5;
      if (!keysPressed.current['a'] && !keysPressed.current['d']) player.velocityX *= 0.8;

      player.x += player.velocityX;
      player.velocityY += 0.5;
      player.y += player.velocityY;

      let onGround = false;
      for (let platform of platforms) {
        if (
          player.x < platform.x + platform.width &&
          player.x + player.width > platform.x &&
          player.y + player.height >= platform.y &&
          player.y + player.height <= platform.y + 30 &&
          player.velocityY >= 0
        ) {
          player.velocityY = 0;
          player.y = platform.y - player.height;
          player.jumping = false;
          onGround = true;
          setScore((s) => s + 1);
        }
      }

      for (let platform of platforms) {
        if (platform.moving) {
          platform.x += platform.direction * 2;
          if (platform.x < 0 || platform.x + platform.width > canvas.width) {
            platform.direction *= -1;
          }
        }
      }

      if (player.y > canvas.height) {
        playerRef.current = { ...playerRef.current, x: 50, y: 300, velocityY: 0 };
      }

      if (player.y < 50) {
        setLevel((l) => l + 1);
        playerRef.current = { ...playerRef.current, x: 50, y: 300, velocityY: 0 };
      }

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let platform of platforms) {
        ctx.fillStyle = platform.color;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
      }

      ctx.fillStyle = '#ef4444';
      ctx.fillRect(player.x, player.y, player.width, player.height);

      animationId = requestAnimationFrame(gameLoop);
    };

    gameLoop();
    return () => cancelAnimationFrame(animationId);
  }, [gameStarted]);

  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-b from-slate-900 to-slate-800 p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-6"
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <h1 className="text-4xl font-bold text-white">🏔️ Obby Parkour</h1>
        <div className="flex gap-4 text-white font-bold">
          <div className="bg-orange-600 px-4 py-2 rounded-lg">Level: {level}</div>
          <div className="bg-blue-600 px-4 py-2 rounded-lg">Score: {score}</div>
        </div>
      </motion.div>

      {!gameStarted ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center"
        >
          <div className="text-center bg-white/10 backdrop-blur-md rounded-lg p-12">
            <h2 className="text-5xl font-bold text-white mb-6">Welcome to Obby!</h2>
            <p className="text-xl text-gray-300 mb-8">Navigate through platforms to reach the top!</p>
            <div className="text-lg text-gray-300 mb-8">
              <p>Controls:</p>
              <p>A/D - Move Left/Right</p>
              <p>SPACE - Jump</p>
            </div>
            <button
              onClick={() => setGameStarted(true)}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-4 px-8 rounded-lg text-2xl transition-all transform hover:scale-105"
            >
              START GAME
            </button>
          </div>
        </motion.div>
      ) : (
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="flex-1 bg-slate-700 rounded-lg shadow-2xl border-4 border-slate-600"
        />
      )}

      <div className="mt-6 text-gray-300 text-center">
        <p>⬆️ Reach the top platforms to advance • ⚠️ Don't fall off!</p>
      </div>
    </div>
  );
};

export default ObbyGame;