import React from 'react';
import { Wallet, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';

const wallets = [
  {
    currency: 'Bitcoin',
    symbol: 'BTC',
    balance: '2.5',
    usdValue: '125,000',
    address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    change: '+12.5%',
    trend: 'up',
  },
  {
    currency: 'Ethereum',
    symbol: 'ETH',
    balance: '45.8',
    usdValue: '98,550',
    address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    change: '-2.3%',
    trend: 'down',
  },
  {
    currency: 'USDT',
    symbol: 'USDT',
    balance: '50,000',
    usdValue: '50,000',
    address: 'TXyz123abc...',
    change: '+0.1%',
    trend: 'up',
  },
  {
    currency: 'Solana',
    symbol: 'SOL',
    balance: '1,250',
    usdValue: '156,250',
    address: 'SOL123xyz...',
    change: '+18.7%',
    trend: 'up',
  },
];

export default function WalletPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Wallet</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
          <RefreshCw className="w-4 h-4" />
          Refresh Balances
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {wallets.map((wallet) => (
          <div key={wallet.symbol} className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <span className="font-semibold text-blue-600">{wallet.symbol}</span>
                </div>
                <div>
                  <h3 className="font-medium">{wallet.currency}</h3>
                  <p className="text-sm text-gray-500">{wallet.address}</p>
                </div>
              </div>
              <span className={`flex items-center ${wallet.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {wallet.change}
                {wallet.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{wallet.balance} {wallet.symbol}</p>
              <p className="text-gray-500">${wallet.usdValue} USD</p>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Deposit
              </button>
              <button className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                Withdraw
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Recent Wallet Activity</h2>
          <p className="text-gray-500 mt-1">Latest transactions and balance changes</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              { type: 'Deposit', currency: 'BTC', amount: '0.5', time: '2 hours ago', status: 'completed' },
              { type: 'Withdrawal', currency: 'ETH', amount: '12.5', time: '5 hours ago', status: 'pending' },
              { type: 'Deposit', currency: 'USDT', amount: '10,000', time: '1 day ago', status: 'completed' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${activity.type === 'Deposit' ? 'bg-green-50' : 'bg-blue-50'}`}>
                    <Wallet className={`w-5 h-5 ${activity.type === 'Deposit' ? 'text-green-600' : 'text-blue-600'}`} />
                  </div>
                  <div>
                    <p className="font-medium">{activity.type}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{activity.amount} {activity.currency}</p>
                  <p className={`text-sm ${
                    activity.status === 'completed' ? 'text-green-500' : 'text-yellow-500'
                  }`}>
                    {activity.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}