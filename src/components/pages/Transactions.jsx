import React from 'react';
import { useState } from 'react';
import { Search, Filter } from 'lucide-react';

const mockTransactions = [
  {
    id: 'tx1',
    amount: 1234.56,
    currency: 'USD',
    status: 'completed',
    timestamp: new Date().toISOString(),
    casinoId: 'casino1',
    walletAddress: '0x1234...5678',
    network: 'Ethereum'
  },
  // Add more mock transactions as needed
];

export function Transactions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-white">Transactions</h1>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search transactions..."
              className="w-full sm:w-64 pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div className="relative flex-1 sm:flex-initial">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-500" />
            </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-48 pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <div className="min-w-full">
            <table className="w-full text-sm text-gray-300">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="p-4">Transaction ID</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Currency</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Wallet Address</th>
                  <th className="p-4">Network</th>
                  <th className="p-4">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {mockTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-700/50">
                    <td className="p-4">{tx.id}</td>
                    <td className="p-4">${tx.amount.toFixed(2)}</td>
                    <td className="p-4">{tx.currency}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        tx.status === 'completed' ? 'bg-green-400 text-black 500' :
                        tx.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                        'bg-red-500/20 text-red-500'
                      }`}>
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4">{tx.walletAddress}</td>
                    <td className="p-4">{tx.network}</td>
                    <td className="p-4">{new Date(tx.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-gray-700">
          {mockTransactions.map((tx) => (
            <div key={tx.id} className="p-4 hover:bg-gray-700/50">
              <div className="flex justify-between items-start mb-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-white">{tx.id}</p>
                  <p className="text-lg font-bold text-white">${tx.amount.toFixed(2)} {tx.currency}</p>
                </div>
                <div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      tx.status === 'completed' ? 'bg-white 500/20 text-white 500' :
                      tx.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                      'bg-red-500/20 text-red-500'
                    }`}>
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </span>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Wallet</span>
                  <span className="text-white">{tx.walletAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Network</span>
                  <span className="text-white">{tx.network}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Time</span>
                  <span className="text-white">{new Date(tx.timestamp).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}