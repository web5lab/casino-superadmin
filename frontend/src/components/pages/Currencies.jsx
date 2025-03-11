import React, { useState } from 'react';
import { DollarSign, Plus, Search, RefreshCw } from 'lucide-react';

const mockCurrencies= [
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    enabled: true,
    exchangeRate: 1,
    lastUpdated: new Date().toISOString()
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    enabled: true,
    exchangeRate: 0.92,
    lastUpdated: new Date().toISOString()
  },
  {
    code: 'BTC',
    name: 'Bitcoin',
    symbol: '₿',
    enabled: true,
    exchangeRate: 0.000023,
    lastUpdated: new Date().toISOString()
  },
  {
    code: 'ETH',
    name: 'Ethereum',
    symbol: 'Ξ',
    enabled: false,
    exchangeRate: 0.00034,
    lastUpdated: new Date().toISOString()
  }
];

export function Currencies() {
  const [currencies, setCurrencies] = useState(mockCurrencies);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCurrency, setNewCurrency] = useState({});

  const handleToggleCurrency = (code) => {
    setCurrencies(currencies.map(currency => 
      currency.code === code 
        ? { ...currency, enabled: !currency.enabled }
        : currency
    ));
  };

  const handleAddCurrency = (e) => {
    e.preventDefault();
    if (newCurrency.code && newCurrency.name && newCurrency.symbol) {
      setCurrencies([...currencies, {
        ...newCurrency,
        enabled: true,
        exchangeRate: newCurrency.exchangeRate || 1,
        lastUpdated: new Date().toISOString()
      } ]);
      setIsModalOpen(false);
      setNewCurrency({});
    }
  };

  const filteredCurrencies = currencies.filter(currency =>
    currency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    currency.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-white">Currencies</h1>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search currencies..."
              className="w-full sm:w-64 pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-400 to-white 400 rounded-lg text-white hover:from-blue-500 hover:to-white 500 transition-all flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Currency</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCurrencies.map((currency) => (
          <div key={currency.code} className="bg-gray-800 rounded-lg p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <DollarSign className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{currency.code}</h3>
                  <p className="text-sm text-gray-400">{currency.name}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={currency.enabled}
                  onChange={() => handleToggleCurrency(currency.code)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-400 peer-checked:to-white 400"></div>
              </label>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Symbol</span>
                <span className="text-white font-mono text-lg">{currency.symbol}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Exchange Rate</span>
                <span className="text-white">1 {currency.code} = {currency.exchangeRate} USD</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Last Updated</span>
                <span className="text-gray-300">{new Date(currency.lastUpdated).toLocaleString()}</span>
              </div>
            </div>

            <button 
              className="w-full mt-4 px-4 py-2 bg-gray-700 rounded-lg text-white hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
              onClick={() => {
                // Here you would typically make an API call to update the exchange rate
                console.log(`Updating exchange rate for ${currency.code}`);
              }}
            >
              <RefreshCw className="w-4 h-4" />
              <span>Update Rate</span>
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Add New Currency</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddCurrency} className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2">Currency Code</label>
                <input
                  type="text"
                  required
                  maxLength={5}
                  value={newCurrency.code || ''}
                  onChange={(e) => setNewCurrency({ ...newCurrency, code: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="e.g., USD"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Currency Name</label>
                <input
                  type="text"
                  required
                  value={newCurrency.name || ''}
                  onChange={(e) => setNewCurrency({ ...newCurrency, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="e.g., US Dollar"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Symbol</label>
                <input
                  type="text"
                  required
                  maxLength={3}
                  value={newCurrency.symbol || ''}
                  onChange={(e) => setNewCurrency({ ...newCurrency, symbol: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="e.g., $"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Exchange Rate (to USD)</label>
                <input
                  type="number"
                  required
                  step="0.000001"
                  value={newCurrency.exchangeRate || ''}
                  onChange={(e) => setNewCurrency({ ...newCurrency, exchangeRate: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="e.g., 1.0"
                />
              </div>

              <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-400 to-white 400 text-white rounded-lg hover:from-blue-500 hover:to-white 500 transition-all"
                >
                  Add Currency
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}