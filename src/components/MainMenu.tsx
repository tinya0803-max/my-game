import React from 'react';
import { motion } from 'motion/react';
import { Leaf, Mountain, Users, Trees } from 'lucide-react';

interface MainMenuProps {
  onSelectGame: (game: 'garden' | 'obby' | 'hideseek' | 'forest') => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onSelectGame }) => {
  const games = [
    {
      id: 'garden',
      title: '🌱 Garden Simulator',
      description: 'Plant, grow, and harvest crops to earn points',
      icon: Leaf,
      color: 'from-green-500 to-green-700',
    },
    {
      id: 'obby',
      title: '🏔️ Obby Parkour',
      description: 'Navigate through challenging obstacle courses',
      icon: Mountain,
      color: 'from-orange-500 to-red-700',
    },
    {
      id: 'hideseek',
      title: '👥 Hide & Seek',
      description: 'Play as seeker or hider in an interactive arena',
      icon: Users,
      color: 'from-blue-500 to-purple-700',
    },
    {
      id: 'forest',
      title: '🌲 99 Nights in Forest',
      description: 'Survive increasingly dangerous nights in the wilderness',
      icon: Trees,
      color: 'from-emerald-600 to-teal-800',
    },
  ];

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center p-8 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h1 className="text-6xl font-bold text-white mb-4">🎮 Game Hub</h1>
        <p className="text-xl text-gray-300">Select a game to play</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {games.map((game, index) => {
          const Icon = game.icon;
          return (
            <motion.button
              key={game.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectGame(game.id as any)}
              className={`relative group rounded-lg overflow-hidden shadow-2xl cursor-pointer transition-all h-48`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${game.color}`} />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all" />
              <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
                <Icon className="w-16 h-16 text-white mb-3" />
                <h2 className="text-2xl font-bold text-white mb-2">{game.title}</h2>
                <p className="text-sm text-gray-100">{game.description}</p>
              </div>
            </motion.button>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-16 text-center text-gray-400"
      >
        <p className="text-sm">Made with React, Three.js, and ❤️</p>
      </motion.div>
    </div>
  );
};

export default MainMenu;