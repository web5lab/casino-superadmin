import React, { useState } from 'react';
import { Download, Filter, X, ExternalLink, Copy } from 'lucide-react';
import FilterDialog from './FilterDialog';

const transactions = [
  {
    id: '1',
    user: 'Baz...Xt1',
    userId: 'U123',
    type: 'Deposit',
    amount: '0.5 usdt',
    fee: '$12.50',
    status: 'completed',
    timestamp: '2024-03-15 14:30',
    walletAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    txHash: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    network: 'Bitcoin',
    notes: 'Regular deposit',
  }
];

export default function TransactionsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const [activeFilters, setActiveFilters] = useState({});
  
  const filterFields = [
    {
      name: 'type',
      label: 'Transaction Type',
      type: 'select',
      options: [
        { value: 'deposit', label: 'Deposit' },
        { value: 'withdrawal', label: 'Withdrawal' },
      ],
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select' ,
      options: [
        { value: 'completed', label: 'Completed' },
        { value: 'pending', label: 'Pending' },
        { value: 'failed', label: 'Failed' },
      ],
    },
    {
      name: 'date',
      label: 'Date',
      type: 'date' ,
    },
    {
      name: 'amount',
      label: 'Minimum Amount',
      type: 'number',
    },
  ];

  const filteredTransactions = transactions.filter((tx) => {
    if (activeFilters.type && tx.type.toLowerCase() !== activeFilters.type) return false;
    if (activeFilters.status && tx.status !== activeFilters.status) return false;
    if (activeFilters.date && tx.timestamp.split(' ')[0] !== activeFilters.date) return false;
    if (activeFilters.amount && parseFloat(tx.amount.split(' ')[0]) < activeFilters.amount) return false;
    return true;
  });

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Transactions</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            {Object.keys(activeFilters).length > 0 ? `Filters (${Object.keys(activeFilters).length})` : 'Filter'}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="px-6 py-3 text-gray-500 font-medium">Transaction ID</th>
                <th className="px-6 py-3 text-gray-500 font-medium">User</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Type</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Amount</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Status</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedTx(tx)}
                >
                  <td className="px-6 py-4 font-mono text-sm">{tx.id}</td>
                  <td className="px-6 py-4">{tx.user}</td>
                  <td className="px-6 py-4">{tx.type}</td>
                  <td className="px-6 py-4">{tx.amount}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        tx.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : tx.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{tx.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <FilterDialog
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={setActiveFilters}
        fields={filterFields}
      />
      
      {selectedTx && (
        <>
        <div onClick={() => setSelectedTx(null)} className='fixed top-0 !mt-0 min-h-screen bottom-0 left-0 right-0 bg-black bg-opacity-50 z-[999] '></div>
        
        <div className=" absolute  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  z-[9999]">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Transaction Details</h2>
              <button
                onClick={() => setSelectedTx(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Basic Info</h3>
                  <div className="mt-2 space-y-3">
                    <div>
                      <label className="text-sm text-gray-500">Transaction ID</label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded truncate flex-1">
                          {selectedTx.id}
                        </code>
                        <button
                          onClick={() => handleCopy(selectedTx.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Type</label>
                      <p className="mt-1 font-medium">{selectedTx.type}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Amount</label>
                      <p className="mt-1 font-medium">{selectedTx.amount}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Fee</label>
                      <p className="mt-1 font-medium">{selectedTx.fee}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Network</label>
                      <p className="mt-1 font-medium">{selectedTx.network}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">User Details</h3>
                  <div className="mt-2 space-y-3">
                    <div>
                      <label className="text-sm text-gray-500">User</label>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="font-medium">{selectedTx.user}</p>
                        <button className="text-blue-600 hover:text-blue-700">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">User ID</label>
                      <p className="mt-1 font-medium">{selectedTx.userId}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Wallet Address</label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded truncate">
                          {selectedTx.walletAddress}
                        </code>
                        <button
                          onClick={() => handleCopy(selectedTx.walletAddress)}
                          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Transaction Hash</h3>
                <div className="flex items-center gap-2">
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded truncate flex-1">
                    {selectedTx.txHash}
                  </code>
                  <button
                    onClick={() => handleCopy(selectedTx.txHash)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-700"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {selectedTx.notes}
                </p>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => window.open(`https://example.com/tx/${selectedTx.txHash}`, '_blank')}
                  className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  View on Explorer
                </button>
                <button
                  onClick={() => setSelectedTx(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
        </>

      )}
    </div>
  );
}