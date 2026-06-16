import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';

interface HideAndSeekGameProps {
  onBack: () => void;
}

const HideAndSeekGame: React.FC<HideAndSeekGameProps> = ({ onBack }) => {
  const [gameMode, setGameMode] = useState<'seeker' | 'hider' | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(120);
  const [foundCount, setFoundCount] = useState(0);
  const [totalHiders] = useState(3);
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 50 });
  const [hidersFound, setHidersFound] = useState<boolean[]>([false, false, false]);

  const hidingSpots = [
    { x: 20, y: 20, name: 'Behind Tree' },
    { x: 80, y: 30, name: 'Under Bridge' },
    { x: 50, y: 60, name: 'Cave' },
    { x: 10, y: 80, name: 'Rock Formation' },
    { x: 90, y: 80, name: 'Forest' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (gameMode === 'seeker') {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setPlayerPosition({ x, y });
    }
  };

  const findHider = (index: number) => {
    if (!hidersFound[index]) {
      const newFound = [...hidersFound];
      newFound[index] = true;
      setHidersFound(newFound);
      setFoundCount((c) => c + 1);
    }
  };

  if (!gameMode) {
    return (
      <div className="w-full h-screen flex flex-col bg-gradient-to-b from-slate-900 to-slate-800 p-8">
        <button
          onClick={onBack}
          className="self-start flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-6xl font-bold text-white mb-16">👥 Hide & Seek</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setGameMode('seeker')}
              className="bg-gradient-to-br from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-bold py-12 px-8 rounded-lg text-2xl flex flex-col items-center gap-4 transition-all shadow-lg"
            >
              <Eye className="w-16 h-16" />
              Play as Seeker
              <span className="text-sm opacity-75">Find all the hiders!</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setGameMode('hider')}
              className="bg-gradient-to-br from-green-600 to-teal-700 hover:from-green-700 hover:to-teal-800 text-white font-bold py-12 px-8 rounded-lg text-2xl flex flex-col items-center gap-4 transition-all shadow-lg"
            >
              <EyeOff className="w-16 h-16" />
              Play as Hider
              <span className="text-sm opacity-75">Stay hidden as long as you can!</span>
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  if (gameMode === 'seeker') {
    return (
      <div className="w-full h-screen flex flex-col bg-gradient-to-b from-slate-900 to-slate-800 p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-6"
        >
          <button
            onClick={() => setGameMode(null)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-white">🔍 Seeker Mode</h1>
          <div className="flex gap-4 text-white font-bold">
            <div className="bg-red-600 px-4 py-2 rounded-lg">Time: {timeRemaining}s</div>
            <div className="bg-green-600 px-4 py-2 rounded-lg">Found: {foundCount}/{totalHiders}</div>
          </div>
        </motion.div>

        <div className="flex-1 grid grid-cols-4 gap-4 mb-6">
          <motion.div
            onMouseMove={handleMouseMove}
            className="col-span-3 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg shadow-2xl border-4 border-slate-600 relative overflow-hidden cursor-crosshair"
          >
            <motion.div
              animate={{ x: `${playerPosition.x}%`, y: `${playerPosition.y}%` }}
              transition={{ type: 'tween', duration: 0.05 }}
              className="absolute w-8 h-8 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg border-2 border-blue-300"
            />

            {hidingSpots.map((spot, idx) => {
              const distance = Math.sqrt(
                Math.pow((playerPosition.x - spot.x) * 1.2, 2) +
                Math.pow((playerPosition.y - spot.y) * 0.8, 2)
              );
              const discovered = distance < 15;

              return (
                <motion.button
                  key={idx}
                  onClick={() => {
                    if (discovered && hidersFound.length > idx) {
                      findHider(idx);
                    }
                  }}
                  style={{
                    left: `${spot.x}%`,
                    top: `${spot.y}%`,
                  }}
                  className={`absolute w-10 h-10 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all ${
                    discovered ? 'opacity-100 scale-125 bg-red-500' : 'opacity-30 bg-gray-500'
                  }`}
                  whileHover={{ scale: 1.3 }}
                >
                  🙋
                </motion.button>
              );
            })}

            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg text-sm">
              Move mouse to find hiders!
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-700 rounded-lg shadow-2xl border-4 border-slate-600 p-4 flex flex-col items-center justify-center"
          >
            <h3 className="text-white font-bold mb-4">Stats</h3>
            <div className="text-xs text-gray-300 text-center">
              <p>Found: {foundCount}/{totalHiders}</p>
              <p>Time: {timeRemaining}s</p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-b from-slate-900 to-slate-800 p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-6"
      >
        <button
          onClick={() => setGameMode(null)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <h1 className="text-3xl font-bold text-white">🙈 Hider Mode</h1>
        <div className="bg-purple-600 px-4 py-2 rounded-lg text-white font-bold">Time: {timeRemaining}s</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 flex flex-col items-center justify-center bg-slate-700 rounded-lg shadow-2xl"
      >
        <div className="text-center">
          <h2 className="text-5xl font-bold text-white mb-6">You're Hidden! 🙈</h2>
          <p className="text-2xl text-gray-300 mb-12">Survive for {timeRemaining} more seconds!</p>
          {timeRemaining > 0 ? (
            <div className="text-7xl font-bold text-green-400 animate-pulse">{timeRemaining}</div>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-6xl font-bold text-green-400"
            >
              🎉 You Survived!
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default HideAndSeekGame;