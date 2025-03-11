import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Wallet, Dice1 as DiceIcon } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { creditBalance, deductBalance } from '../store/global.Slice';



const Dice = ({ value, rolling }) => {
  const dots = Array(value).fill(0);

  return (
    <div className={`w-24 h-24 bg-white rounded-2xl shadow-lg relative ${rolling ? 'animate-bounce' : ''
      }`}>
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-2 p-4">
        {dots.map((_, i) => (
          <div
            key={i}
            className="rounded-full bg-gray-900"
            style={{
              gridArea: [
                '2/2/3/3', // 1
                '1/1/2/2,3/3/4/4', // 2
                '1/1/2/2,2/2/3/3,3/3/4/4', // 3
                '1/1/2/2,1/3/2/4,3/1/4/2,3/3/4/4', // 4
                '1/1/2/2,1/3/2/4,2/2/3/3,3/1/4/2,3/3/4/4', // 5
                '1/1/2/2,1/3/2/4,2/1/3/2,2/3/3/4,3/1/4/2,3/3/4/4', // 6
              ][value - 1].split(',')[i]
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default function CasinoGame() {
  const { id } = useParams();
  const [showWallet, setShowWallet] = useState(false);
  const [diceValue, setDiceValue] = useState(1);
  const [rolling, setRolling] = useState(false);
  const [betAmount, setBetAmount] = useState('100');
  const [prediction, setPrediction] = useState('high');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const dispatch = useDispatch();

  const rollDice = () => {
    if (rolling) return;
    dispatch(deductBalance(betAmount))
    setRolling(true);
    setResult(null);

    // Animate through random values
    const duration = 1000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed < duration) {
        setDiceValue(Math.floor(Math.random() * 6) + 1);
        requestAnimationFrame(animate);
      } else {
        // Final result
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalValue);
        setRolling(false);

        // Determine win/lose
        const won = (prediction === 'high' && finalValue > 3) ||
          (prediction === 'low' && finalValue <= 3);

        setResult(won ? 'win' : 'lose');

        if (won) {
          dispatch(creditBalance(betAmount * 2))

        } else {
          dispatch(deductBalance(betAmount))
        }
        // Update history
        setHistory(prev => [{
          id: Date.now(),
          amount: betAmount,
          result: won ? 'win' : 'lose',
          roll: finalValue
        }, ...prev.slice(0, 4)]);
      }
    };

    requestAnimationFrame(animate);
  };

  // Game-specific content based on ID
  const getGameContent = () => {
    switch (id) {
      case 'dice':
        return {
          title: 'Dice',
          color: 'purple',
          description: 'Roll the dice and multiply your crypto!',
        };
      case 'blackjack':
        return {
          title: 'Blackjack',
          color: 'green',
          description: 'Classic casino card game. Get closer to 21 than the dealer!',
        };
      case 'crash':
        return {
          title: 'Crash',
          color: 'red',
          description: 'Watch the multiplier grow and cash out before it crashes!',
        };
      case 'slots':
        return {
          title: 'Slots',
          color: 'yellow',
          description: 'Spin the reels and win big with matching symbols!',
        };
      default:
        return {
          title: 'Unknown Game',
          color: 'gray',
          description: 'Game not found',
        };
    }
  };

  const game = getGameContent();

  return (
    <div className="relative">
      {/* Game Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Link to="/" className="p-2 hover:bg-gray-800 rounded-lg transition-colors mr-4">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl font-bold">{game.title}</h1>
        </div>
        <button
          onClick={() => setShowWallet(!showWallet)}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          <Wallet className="w-5 h-5 mr-2" />
          Wallet
        </button>
      </div>

      {/* Main Game Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Game Interface */}
        <div className="lg:col-span-2 bg-gray-800 rounded-xl p-6 h-[600px] flex items-center justify-center">
          {id === 'dice' ? (
            <div className="text-center space-y-8">
              <div className="flex justify-center">
                <Dice value={diceValue} rolling={rolling} />
              </div>

              <div className="space-y-4">
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setPrediction('low')}
                    className={`px-6 py-3 rounded-lg font-bold transition-colors ${prediction === 'low'
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                  >
                    Low (1-3)
                  </button>
                  <button
                    onClick={() => setPrediction('high')}
                    className={`px-6 py-3 rounded-lg font-bold transition-colors ${prediction === 'high'
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                  >
                    High (4-6)
                  </button>
                </div>

                {result && (
                  <div className={`text-2xl font-bold ${result === 'win' ? 'text-green-500' : 'text-red-500'
                    }`}>
                    {result === 'win' ? 'You Won!' : 'You Lost!'}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-xl text-gray-400 mb-4">{game.description}</p>
              <button className="px-8 py-4 bg-green-500 hover:bg-green-600 rounded-xl font-bold text-lg transition-colors">
                Start Game
              </button>
            </div>
          )}
        </div>

        {/* Wallet/Controls Panel */}
        <div className="bg-gray-800 rounded-xl p-6">
          {showWallet ? (
            <iframe
              src="/wallet"
              className="w-full h-[600px] border-0"
              title="Wallet"
            />
          ) : (
            <div className="space-y-6">
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-bold mb-2">Game Controls</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Bet Amount</label>
                    <input
                      type="number"
                      value={betAmount}
                      onChange={(e) => setBetAmount(e.target.value)}
                      className="w-full bg-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="0.001"
                    />
                  </div>
                  <button
                    onClick={rollDice}
                    disabled={rolling}
                    className="w-full py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-bold transition-colors"
                  >
                    {rolling ? 'Rolling...' : 'Roll Dice'}
                  </button>
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-bold mb-2">Game History</h3>
                <div className="space-y-2">
                  {history.map((game) => (
                    <div key={game.id} className="flex justify-between text-sm">
                      <span className="text-gray-400">Roll: {game.roll}</span>
                      <span className={game.result === 'win' ? 'text-green-500' : 'text-red-500'}>
                        {game.result === 'win' ? '+' : '-'}{game.amount} Coins
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}