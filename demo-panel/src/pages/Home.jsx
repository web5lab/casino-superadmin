import React from 'react';
import { Link } from 'react-router-dom';
import { Dice1 as Dice, Car as Cards, Target, Joystick } from 'lucide-react';

const games = [
  {
    id: 'dice',
    name: 'Dice',
    icon: <Dice className="w-8 h-8" />,
    description: 'Classic dice game with multipliers',
    color: 'from-purple-500 to-indigo-500',
  },
 
];

export default function Home() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Popular Games</h1>
      
      <div className="grid grid-cols-1 gap-6">
        {games.map((game) => (
          <Link
            key={game.id}
            to={`/game/${game.id}`}
            className="block group"
          >
            <div className={`bg-gradient-to-br ${game.color} p-6 rounded-xl hover:scale-105 transition-transform`}>
              <div className="flex items-center mb-4">
                {game.icon}
                <h3 className="text-xl font-bold ml-3">{game.name}</h3>
              </div>
              <p className="text-gray-100">{game.description}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Featured Banner */}
      <div className="mt-12 bg-gradient-to-r from-yellow-900 to-yellow-800 rounded-xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">🎁 Welcome Bonus</h2>
            <p className="text-lg">Get 180% bonus on your first deposit!</p>
            <Link
              to="/wallet"
              className="inline-block mt-4 px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg font-bold transition-colors"
            >
              Deposit Now
            </Link>
          </div>
          <div className="hidden lg:block">
            <span className="text-6xl">🎲</span>
          </div>
        </div>
      </div>
    </div>
  );
}