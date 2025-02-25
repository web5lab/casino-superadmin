import React from 'react';
import { Clock } from 'lucide-react';

const mockHistory = [
  {
    id: '1',
    action: 'Transaction Approved',
    user: 'Super Admin',
    timestamp: new Date().toISOString(),
    details: 'Approved transaction #TX123 for Casino Royal'
  },
  {
    id: '2',
    action: 'New Casino Added',
    user: 'Panel Admin',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    details: 'Added new casino: Lucky Strike'
  },
  // Add more mock history entries
];

export function History() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Activity History</h1>
        <div className="flex space-x-4">
          <select className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-300">
            <option value="all">All Actions</option>
            <option value="transactions">Transactions</option>
            <option value="casinos">Casinos</option>
            <option value="users">Users</option>
          </select>
          <input
            type="date"
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <div className="space-y-6">
          {mockHistory.map((item) => (
            <div key={item.id} className="flex items-start space-x-4">
              <div className="p-2 bg-gray-700 rounded-lg">
                <Clock className="w-5 h-5 text-blue-300" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white font-medium">{item.action}</h3>
                    <p className="text-sm text-gray-400">{item.details}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">{item.user}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(item.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}