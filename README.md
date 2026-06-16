# Battle Arena Game 🎮

An interactive web-based battle game built with React, TypeScript, and Tailwind CSS.

## Features

- 🎯 Wave-based combat system
- 📊 Progressive difficulty scaling
- 🎨 Smooth animations with Motion
- ✨ Visual effects and confetti
- 📱 Responsive design
- 🏆 Score and level tracking

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- pnpm (or npm)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/tinya0803-max/my-game.git
cd my-game
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm run dev
```

The game will automatically open in your browser at `http://localhost:3000`

## How to Play

1. **Select an Enemy**: Click on an enemy to select it
2. **Attack**: Click the "Attack!" button to deal damage
3. **Survive**: Defeat all enemies before your health reaches 0
4. **Progress**: Defeat waves to increase your level and score
5. **Aim for High Score**: Try to survive as many waves as possible!

## Game Mechanics

- **Player Health**: You start with 100 HP
- **Enemy Damage**: Enemies attack every 3 seconds
- **Attack Damage**: Each attack deals 10-25 damage
- **Wave Progression**: Defeat all enemies to advance to the next wave
- **Scaling Difficulty**: Each wave has more enemies and higher stats

## Building for Production

```bash
pnpm run build
```

## Technologies Used

- React 18.3.1
- TypeScript
- Vite
- Tailwind CSS
- Motion (Animations)
- Canvas Confetti
- Lucide React (Icons)

## License

MIT
