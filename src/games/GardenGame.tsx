import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

interface Plant {
  id: number;
  type: string;
  stage: number;
  position: [number, number];
}

interface GardenGameProps {
  onBack: () => void;
}

const GardenGame: React.FC<GardenGameProps> = ({ onBack }) => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [score, setScore] = useState(0);
  const [currency, setCurrency] = useState(0);
  const [selectedType, setSelectedType] = useState('tomato');
  const [gameTime, setGameTime] = useState(0);

  const plantTypes = [
    { id: 'tomato', name: '🍅 Tomato', color: 'bg-red-500', growTime: 15 },
    { id: 'carrot', name: '🥕 Carrot', color: 'bg-orange-500', growTime: 12 },
    { id: 'lettuce', name: '🥬 Lettuce', color: 'bg-green-500', growTime: 10 },
    { id: 'pumpkin', name: '🎃 Pumpkin', color: 'bg-yellow-600', growTime: 20 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setGameTime((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setPlants((prev) =>
      prev.map((plant) => ({
        ...plant,
        stage: Math.min(plant.stage + 1, 3),
      }))
    );
  }, [gameTime]);

  const plantSeeds = (gridRow: number, gridCol: number) => {
    const newPlant: Plant = {
      id: Date.now(),
      type: selectedType,
      stage: 0,
      position: [gridRow, gridCol],
    };
    setPlants((prev) => [...prev, newPlant]);
  };

  const harvestPlant = (id: number) => {
    const plant = plants.find((p) => p.id === id);
    if (plant?.stage === 3) {
      setScore((s) => s + 100);
      setCurrency((c) => c + 50);
      setPlants((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const gridSize = 3;

  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-b from-sky-300 to-green-200 p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-6"
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 font-bold py-2 px-4 rounded-lg transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <h1 className="text-4xl font-bold text-green-800">🌱 Garden Simulator</h1>
        <div className="flex gap-4">
          <div className="bg-white rounded-lg px-4 py-2 font-bold">
            Score: {score}
          </div>
          <div className="bg-yellow-300 rounded-lg px-4 py-2 font-bold">
            💰 {currency}
          </div>
        </div>
      </motion.div>

      <div className="flex gap-3 mb-6 justify-center">
        {plantTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setSelectedType(type.id)}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              selectedType === type.id
                ? 'bg-white scale-110 shadow-lg'
                : 'bg-white/70 hover:bg-white'
            }`}
          >
            {type.name}
          </button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 flex items-center justify-center"
      >
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
          {Array.from({ length: gridSize * gridSize }).map((_, idx) => {
            const row = Math.floor(idx / gridSize);
            const col = idx % gridSize;
            const plant = plants.find((p) => p.position[0] === row && p.position[1] === col);

            return (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  if (plant) {
                    harvestPlant(plant.id);
                  } else {
                    plantSeeds(row, col);
                  }
                }}
                className="w-32 h-32 bg-amber-700 rounded-lg cursor-pointer shadow-lg relative overflow-hidden hover:shadow-xl transition-all border-4 border-amber-800"
              >
                {plant ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0.5, 0.7, 0.9, 1][plant.stage] }}
                    className={`w-full h-full flex items-center justify-center text-6xl ${
                      plantTypes.find((t) => t.id === plant.type)?.color
                    }`}
                  >
                    {['🌱', '🌿', '🌾', '✅'][plant.stage]}
                  </motion.div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl opacity-30 hover:opacity-60 transition-all">
                    +
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-gray-700 mt-6"
      >
        <p>Select a plant type and click empty soil to plant. Click ripe crops (✅) to harvest!</p>
      </motion.div>
    </div>
  );
};

export default GardenGame;