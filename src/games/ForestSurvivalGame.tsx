import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

interface ForestSurvivalGameProps {
  onBack: () => void;
}

const ForestSurvivalGame: React.FC<ForestSurvivalGameProps> = ({ onBack }) => {
  const [night, setNight] = useState(1);
  const [health, setHealth] = useState(100);
  const [hunger, setHunger] = useState(100);
  const [wood, setWood] = useState(0);
  const [stone, setStone] = useState(0);
  const [food, setFood] = useState(0);
  const [dayTime, setDayTime] = useState(100);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [shelter, setShelter] = useState(false);
  const [fire, setFire] = useState(false);
  const [enemies, setEnemies] = useState<Array<{ id: number; x: number; y: number; health: number }>>([]);
  const [message, setMessage] = useState('Welcome to the forest. Survive 99 nights!');

  useEffect(() => {
    if (gameOver || won) return;

    const interval = setInterval(() => {
      setDayTime((t) => {
        if (t <= 0) {
          setNight((n) => {
            if (n >= 99) {
              setWon(true);
              setMessage('🎉 You survived 99 nights!');
              return n;
            }
            return n + 1;
          });
          return 100;
        }
        return t - 1;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [gameOver, won]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHunger((h) => Math.max(0, h - 1));
      setHealth((hp) => {
        if (hunger < 20) return Math.max(0, hp - 2);
        if (dayTime < 30 && !fire && night > 10) return Math.max(0, hp - 3);
        return Math.min(100, hp + 0.5);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [hunger, dayTime, fire, night]);

  useEffect(() => {
    if (dayTime < 30 && night > 5) {
      if (enemies.length < Math.min(1 + Math.floor(night / 10), 5)) {
        const newEnemy = {
          id: Date.now(),
          x: Math.random() * 80 + 10,
          y: Math.random() * 60 + 20,
          health: night > 50 ? 2 : 1,
        };
        setEnemies((prev) => [...prev, newEnemy]);
      }
    } else if (dayTime > 70) {
      setEnemies([]);
    }
  }, [dayTime, night, enemies.length]);

  useEffect(() => {
    if (health === 0 || hunger === 0) {
      setGameOver(true);
      setMessage(`💀 You died on night ${night}!`);
    }
  }, [health, hunger, night]);

  const gatherWood = () => {
    setWood((w) => w + 10);
    setHunger((h) => Math.max(0, h - 5));
    setMessage('🪵 Gathered wood!');
  };

  const gatherStone = () => {
    setStone((s) => s + 5);
    setHunger((h) => Math.max(0, h - 3));
    setMessage('🪨 Gathered stone!');
  };

  const huntFood = () => {
    setFood((f) => f + 20);
    setHunger((h) => Math.max(0, h - 10));
    setMessage('🦌 Hunted food!');
  };

  const eatFood = () => {
    if (food > 0) {
      setFood((f) => f - 1);
      setHunger((h) => Math.min(100, h + 30));
      setMessage('😋 Ate food!');
    }
  };

  const buildShelter = () => {
    if (wood >= 30 && stone >= 20) {
      setWood((w) => w - 30);
      setStone((s) => s - 20);
      setShelter(true);
      setMessage('🏠 Built shelter!');
    } else {
      setMessage('Need 30 wood and 20 stone');
    }
  };

  const startFire = () => {
    if (wood >= 10 && shelter) {
      setWood((w) => w - 10);
      setFire(true);
      setMessage('🔥 Fire started!');
    } else {
      setMessage('Need 10 wood and a shelter');
    }
  };

  const attackEnemy = (id: number) => {
    setEnemies((prev) =>
      prev
        .map((e) => (e.id === id ? { ...e, health: e.health - 1 } : e))
        .filter((e) => e.health > 0)
    );
    setMessage('⚔️ Attacked enemy!');
  };

  const isNight = dayTime < 30;

  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-b from-slate-900 to-slate-800 p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-6"
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <h1 className="text-4xl font-bold text-white">🌲 99 Nights in Forest</h1>
        <div className="flex gap-2 text-white font-bold">
          <div className="bg-purple-600 px-4 py-2 rounded-lg">Night {night}/99</div>
        </div>
      </motion.div>

      {gameOver || won ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex items-center justify-center"
        >
          <div className={`text-center bg-white/10 backdrop-blur-md rounded-lg p-12 ${won ? 'border-4 border-green-500' : 'border-4 border-red-500'}`}>
            <h2 className={`text-5xl font-bold mb-6 ${won ? 'text-green-400' : 'text-red-400'}`}>
              {message}
            </h2>
            <p className="text-2xl text-gray-300 mb-8">Reached night {night}</p>
            <button
              onClick={onBack}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-all"
            >
              Return to Menu
            </button>
          </div>
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <div className="flex justify-between text-white mb-2">
                <span>❤️ Health</span>
                <span>{health}/100</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
                <motion.div
                  animate={{ width: `${health}%` }}
                  className="bg-red-500 h-full"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-white mb-2">
                <span>🍖 Hunger</span>
                <span>{hunger}/100</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
                <motion.div
                  animate={{ width: `${hunger}%` }}
                  className="bg-yellow-500 h-full"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-white mb-2">
                <span>{isNight ? '🌙' : '☀️'} Time</span>
                <span>{dayTime}/100</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
                <motion.div
                  animate={{ width: `${dayTime}%` }}
                  className={isNight ? 'bg-blue-600 h-full' : 'bg-orange-400 h-full'}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-700 rounded-lg p-4 text-center text-white font-bold">
              🪵 {wood}
            </div>
            <div className="bg-slate-700 rounded-lg p-4 text-center text-white font-bold">
              🪨 {stone}
            </div>
            <div className="bg-slate-700 rounded-lg p-4 text-center text-white font-bold">
              🍗 {food}
            </div>
            <div className="bg-slate-700 rounded-lg p-4 text-center text-white font-bold">
              {shelter ? '🏠' : '⚠️'} {fire ? '🔥' : '❄️'}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`flex-1 rounded-lg mb-6 p-6 relative overflow-hidden border-4 ${
              isNight ? 'bg-slate-900 border-blue-600' : 'bg-gradient-to-b from-blue-300 to-green-200 border-green-600'
            }`}
          >
            <div className="absolute inset-0 flex items-center justify-center opacity-10 text-9xl">
              {isNight ? '🌙' : '🌞'}
            </div>

            {enemies.map((enemy) => (
              <motion.button
                key={enemy.id}
                style={{ left: `${enemy.x}%`, top: `${enemy.y}%` }}
                onClick={() => attackEnemy(enemy.id)}
                whileHover={{ scale: 1.2 }}
                className="absolute text-6xl hover:opacity-75 transition-all transform -translate-x-1/2 -translate-y-1/2 cursor-crosshair"
              >
                👹
              </motion.button>
            ))}

            {shelter && (
              <div className="absolute bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg font-bold">
                ✅ Safe in shelter
              </div>
            )}
          </motion.div>

          <motion.div
            key={message}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white font-bold mb-4 h-6"
          >
            {message}
          </motion.div>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={gatherWood}
              className="bg-amber-700 hover:bg-amber-800 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105"
            >
              🪵 Gather Wood
            </button>
            <button
              onClick={gatherStone}
              className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105"
            >
              🪨 Gather Stone
            </button>
            <button
              onClick={huntFood}
              className="bg-orange-700 hover:bg-orange-800 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105"
            >
              🦌 Hunt
            </button>
            <button
              onClick={eatFood}
              disabled={food === 0}
              className="bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105"
            >
              🍗 Eat
            </button>
            <button
              onClick={buildShelter}
              disabled={shelter || wood < 30 || stone < 20}
              className="bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105"
            >
              🏠 Build Shelter
            </button>
            <button
              onClick={startFire}
              disabled={fire || wood < 10 || !shelter}
              className="bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105"
            >
              🔥 Start Fire
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ForestSurvivalGame;