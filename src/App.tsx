import React, { useState } from 'react';
import { motion } from 'motion/react';
import MainMenu from './components/MainMenu';
import GardenGame from './games/GardenGame';
import ObbyGame from './games/ObbyGame';
import HideAndSeekGame from './games/HideAndSeekGame';
import ForestSurvivalGame from './games/ForestSurvivalGame';

type GameState = 'menu' | 'garden' | 'obby' | 'hideseek' | 'forest';

function App() {
  const [currentGame, setCurrentGame] = useState<GameState>('menu');

  const handleSelectGame = (game: GameState) => {
    setCurrentGame(game);
  };

  const handleBackToMenu = () => {
    setCurrentGame('menu');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-screen bg-gradient-to-b from-slate-900 to-slate-800"
    >
      {currentGame === 'menu' && <MainMenu onSelectGame={handleSelectGame} />}
      {currentGame === 'garden' && <GardenGame onBack={handleBackToMenu} />}
      {currentGame === 'obby' && <ObbyGame onBack={handleBackToMenu} />}
      {currentGame === 'hideseek' && <HideAndSeekGame onBack={handleBackToMenu} />}
      {currentGame === 'forest' && <ForestSurvivalGame onBack={handleBackToMenu} />}
    </motion.div>
  );
}

export default App;