import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';
import { Zap, Heart, Skull, Star, Sword } from 'lucide-react';

interface Enemy {
  id: number;
  health: number;
  maxHealth: number;
  level: number;
  name: string;
}

interface GameState {
  playerHealth: number;
  playerMaxHealth: number;
  score: number;
  level: number;
  enemies: Enemy[];
  gameOver: boolean;
  wave: number;
}

const ENEMY_NAMES = [
  'Bug Sprite',
  'Crash Monster',
  'Error Beast',
  'Null Entity',
  'Cache Demon',
  'Loop Lord',
  'Stack Fiend',
  'Memory Leak',
];

export const Game: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    playerHealth: 100,
    playerMaxHealth: 100,
    score: 0,
    level: 1,
    enemies: [
      { id: 1, health: 20, maxHealth: 20, level: 1, name: ENEMY_NAMES[0] },
      { id: 2, health: 20, maxHealth: 20, level: 1, name: ENEMY_NAMES[1] },
    ],
    gameOver: false,
    wave: 1,
  });

  const [selectedEnemyId, setSelectedEnemyId] = useState<number | null>(1);
  const [attackLog, setAttackLog] = useState<string[]>([]);

  // Attack enemy
  const attackEnemy = useCallback(() => {
    if (!selectedEnemyId) return;

    const damage = Math.floor(Math.random() * 15) + 10; // 10-25 damage

    setGameState((prev) => {
      const updatedEnemies = prev.enemies
        .map((enemy) => {
          if (enemy.id === selectedEnemyId) {
            return {
              ...enemy,
              health: Math.max(0, enemy.health - damage),
            };
          }
          return enemy;
        })
        .filter((enemy) => enemy.health > 0);

      const isWaveComplete = updatedEnemies.length === 0;
      let newScore = prev.score + 50;
      let newLevel = prev.level;
      let newWave = prev.wave;
      let newEnemies = updatedEnemies;

      if (isWaveComplete) {
        newWave += 1;
        newLevel = Math.floor(newWave / 2) + 1;
        newScore += 200;
        const enemyCount = Math.min(2 + newWave, 5);
        newEnemies = Array.from({ length: enemyCount }, (_, i) => ({
          id: Date.now() + i,
          health: 20 + newLevel * 5,
          maxHealth: 20 + newLevel * 5,
          level: newLevel,
          name: ENEMY_NAMES[(i + newWave) % ENEMY_NAMES.length],
        }));
      }

      return {
        ...prev,
        enemies: newEnemies,
        score: newScore,
        level: newLevel,
        wave: newWave,
      };
    });

    setAttackLog((prev) => [`Dealt ${damage} damage!`, ...prev.slice(0, 4)]);
  }, [selectedEnemyId]);

  // Enemy attack
  useEffect(() => {
    if (gameState.gameOver || gameState.enemies.length === 0) return;

    const interval = setInterval(() => {
      setGameState((prev) => {
        const totalEnemyDamage = prev.enemies.reduce(
          () => Math.floor(Math.random() * 10) + 5,
          0
        );
        const newHealth = Math.max(0, prev.playerHealth - totalEnemyDamage);
        const isGameOver = newHealth === 0;

        if (isGameOver) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }

        return {
          ...prev,
          playerHealth: newHealth,
          gameOver: isGameOver,
        };
      });

      setAttackLog((prev) => [
        `Enemies attack for ${Math.floor(Math.random() * 10) + 5} damage!`,
        ...prev.slice(0, 4),
      ]);
    }, 3000);

    return () => clearInterval(interval);
  }, [gameState.gameOver, gameState.enemies.length]);

  const resetGame = () => {
    setGameState({
      playerHealth: 100,
      playerMaxHealth: 100,
      score: 0,
      level: 1,
      enemies: [
        { id: 1, health: 20, maxHealth: 20, level: 1, name: ENEMY_NAMES[0] },
        { id: 2, health: 20, maxHealth: 20, level: 1, name: ENEMY_NAMES[1] },
      ],
      gameOver: false,
      wave: 1,
    });
    setSelectedEnemyId(1);
    setAttackLog([]);
  };

  const healthPercent = (gameState.playerHealth / gameState.playerMaxHealth) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-white mb-2">⚔️ Battle Arena</h1>
          <p className="text-purple-200 text-lg">Defeat the digital hordes to save the realm!</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
          {/* Score */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-slate-800/80 border border-slate-700 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-gray-400 font-semibold">Score</span>
            </div>
            <div className="text-3xl font-bold text-yellow-400">{gameState.score}</div>
          </motion.div>

          {/* Level */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-slate-800/80 border border-slate-700 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-blue-400" />
              <span className="text-gray-400 font-semibold">Level</span>
            </div>
            <div className="text-3xl font-bold text-blue-400">{gameState.level}</div>
          </motion.div>

          {/* Wave */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-slate-800/80 border border-slate-700 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Skull className="w-5 h-5 text-orange-400" />
              <span className="text-gray-400 font-semibold">Wave</span>
            </div>
            <div className="text-3xl font-bold text-orange-400">{gameState.wave}</div>
          </motion.div>

          {/* Health */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-slate-800/80 border border-slate-700 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-red-400" />
              <span className="text-gray-400 font-semibold">Health</span>
            </div>
            <div className="text-3xl font-bold text-red-400">{gameState.playerHealth}</div>
          </motion.div>
        </div>

        {/* Player Health Bar */}
        <div className="mb-8 bg-slate-800/80 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white font-bold text-lg">Your Health</span>
            <span className="text-gray-400">{gameState.playerHealth}/{gameState.playerMaxHealth}</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-8 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-green-400 to-green-600 h-full rounded-full"
              animate={{ width: `${healthPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {gameState.gameOver ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="bg-gradient-to-br from-red-900/80 to-red-800/80 border border-red-600 rounded-lg p-12 mb-8 backdrop-blur">
              <h2 className="text-5xl font-bold text-red-200 mb-4">💀 Game Over!</h2>
              <p className="text-red-100 text-xl mb-6">You survived {gameState.wave} waves</p>
              <p className="text-4xl font-bold text-yellow-300 mb-8">{gameState.score} points</p>
              <button
                onClick={resetGame}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all transform hover:scale-105"
              >
                Play Again
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Enemies Section */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Sword className="w-6 h-6" />
                Enemies ({gameState.enemies.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gameState.enemies.map((enemy) => (
                  <motion.div
                    key={enemy.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedEnemyId(enemy.id)}
                  >
                    <div
                      className={`cursor-pointer transition-all rounded-lg border-2 p-6 backdrop-blur ${
                        selectedEnemyId === enemy.id
                          ? 'bg-purple-700/60 border-purple-400 ring-2 ring-purple-500 shadow-lg shadow-purple-500/50'
                          : 'bg-slate-800/60 border-slate-600 hover:border-slate-500'
                      }`}
                    >
                      <h3 className="text-lg font-bold text-white mb-2">{enemy.name}</h3>
                      <p className="text-sm text-gray-300 mb-3">Level {enemy.level}</p>
                      <div className="mb-3">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-400">Health</span>
                          <span className="text-sm font-semibold text-white">
                            {enemy.health}/{enemy.maxHealth}
                          </span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                          <motion.div
                            className="bg-gradient-to-r from-red-400 to-red-600 h-full"
                            animate={{
                              width: `${(enemy.health / enemy.maxHealth) * 100}%`,
                            }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Action Panel */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-6 sticky top-8">
                <h3 className="text-xl font-bold text-white mb-6">Actions</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={attackEnemy}
                  disabled={gameState.enemies.length === 0}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg text-lg transition-all mb-6 flex items-center justify-center gap-2"
                >
                  <Sword className="w-5 h-5" />
                  Attack!
                </motion.button>

                {/* Attack Log */}
                <div className="bg-slate-900/80 rounded-lg p-4 border border-slate-600">
                  <h4 className="text-sm font-bold text-gray-300 mb-3">Battle Log</h4>
                  <div className="space-y-2 text-sm">
                    {attackLog.length > 0 ? (
                      attackLog.map((log, i) => (
                        <motion.p
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-amber-300"
                        >
                          • {log}
                        </motion.p>
                      ))
                    ) : (
                      <p className="text-gray-500">Battle begins...</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
