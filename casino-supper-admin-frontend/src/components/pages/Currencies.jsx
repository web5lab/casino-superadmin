import React, { useState } from 'react';
import { DollarSign, Plus, Search, RefreshCw, ArrowUp, ArrowDown, TrendingUp } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { GetCurrencies } from '../../store/global.Action';
import { currenciesSelector, userSelector } from '../../store/global.Selctor';
import { useEffect } from 'react';



export function Currencies() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [newCurrency, setNewCurrency] = useState({});
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [newRate, setNewRate] = useState('');
  const [updateMethod, setUpdateMethod] = useState('manual'); // manual, percentage, market
  const dispatch = useDispatch();
  const user = useSelector(userSelector)
  const currencies = useSelector(currenciesSelector); 
  useEffect(() => {
    dispatch(GetCurrencies(user.token))
  }, [])


  const handleToggleCurrency = (code) => {

  };

  const handleAddCurrency = (e) => {
    e.preventDefault();
    if (newCurrency.code && newCurrency.name && newCurrency.symbol) {

      setIsModalOpen(false);
      setNewCurrency({});
    }
  };

  const openUpdateModal = (currency) => {
    setSelectedCurrency(currency);
    setNewRate(currency.exchangeRate.toString());
    setIsUpdateModalOpen(true);
  };

  const handleUpdateRate = (e) => {
    e.preventDefault();
    if (selectedCurrency && newRate) {

      setIsUpdateModalOpen(false);
      setSelectedCurrency(null);
      setNewRate('');
    }
  };

  const applyPercentageChange = (percentage) => {
    const currentRate = parseFloat(selectedCurrency.exchangeRate);
    const change = currentRate * (percentage / 100);
    setNewRate((currentRate + change).toFixed(8));
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6">
        {filteredCurrencies.map((currency) => (
          <div key={currency.code} className="bg-gray-800 rounded-lg p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <img src={currency.icon} className="w-8 h-8 text-blue-500" />
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
                <span className="text-white font-mono text-lg">{currency.code}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Exchange Rate</span>
                <span className="text-white">1 {currency.code} = {currency.exchangeRate} USD</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Last Updated</span>
                <span className="text-gray-300">{new Date(currency.updatedAt).toLocaleString()}</span>
              </div>
            </div>

            <button
              className="w-full mt-4 px-4 py-2 bg-gray-700 rounded-lg text-white hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
              onClick={() => openUpdateModal(currency)}
            >
              <RefreshCw className="w-4 h-4" />
              <span>Update Rate</span>
            </button>
          </div>
        ))}
      </div>

      {/* Add Currency Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10">
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

      {/* Update Rate Modal */}
      {isUpdateModalOpen && selectedCurrency && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Update {selectedCurrency.code} Rate</h2>
              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="mb-6">
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Current Rate:</span>
                  <span className="text-white font-medium">1 {selectedCurrency.code} = {selectedCurrency.exchangeRate} USD</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Last updated: {new Date(selectedCurrency.lastUpdated).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex border border-gray-700 rounded-lg overflow-hidden mb-4">
                <button
                  type="button"
                  onClick={() => setUpdateMethod('manual')}
                  className={`flex-1 py-2 px-4 text-center ${updateMethod === 'manual' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                >
                  Manual
                </button>
                <button
                  type="button"
                  onClick={() => setUpdateMethod('percentage')}
                  className={`flex-1 py-2 px-4 text-center ${updateMethod === 'percentage' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                >
                  % Change
                </button>
                <button
                  type="button"
                  onClick={() => setUpdateMethod('market')}
                  className={`flex-1 py-2 px-4 text-center ${updateMethod === 'market' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                >
                  Market
                </button>
              </div>

              {updateMethod === 'manual' && (
                <div>
                  <label className="block text-gray-400 mb-2">New Exchange Rate</label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      required
                      step="0.00000001"
                      value={newRate}
                      onChange={(e) => setNewRate(e.target.value)}
                      className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                      placeholder="Enter new rate"
                    />
                    <span className="ml-2 text-gray-400">USD</span>
                  </div>
                </div>
              )}

              {updateMethod === 'percentage' && (
                <div>
                  <label className="block text-gray-400 mb-2">Percentage Change</label>
                  <div className="flex items-center space-x-2 mb-4">
                    <button
                      type="button"
                      onClick={() => applyPercentageChange(-1)}
                      className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                    >
                      -1%
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPercentageChange(-5)}
                      className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                    >
                      -5%
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPercentageChange(1)}
                      className="px-3 py-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30"
                    >
                      +1%
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPercentageChange(5)}
                      className="px-3 py-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30"
                    >
                      +5%
                    </button>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="number"
                      required
                      step="0.00000001"
                      value={newRate}
                      onChange={(e) => setNewRate(e.target.value)}
                      className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    <span className="ml-2 text-gray-400">USD</span>
                  </div>
                </div>
              )}

              {updateMethod === 'market' && (
                <div className="space-y-4">
                  <div className="bg-blue-500/10 rounded-lg p-4">
                    <div className="flex items-center text-blue-400 mb-2">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      <span className="font-medium">Market Rates</span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      Fetch current market rates from external APIs for accurate pricing.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    onClick={() => {
                      // Simulate fetching from API
                      setTimeout(() => {
                        const simulatedMarketRate = (
                          selectedCurrency.exchangeRate * (1 + (Math.random() * 0.1 - 0.05))
                        ).toFixed(8);
                        setNewRate(simulatedMarketRate);
                      }, 1000);
                    }}
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Fetch Market Rate</span>
                  </button>

                  <div className="flex items-center mt-4">
                    <input
                      type="number"
                      required
                      step="0.00000001"
                      value={newRate}
                      onChange={(e) => setNewRate(e.target.value)}
                      className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                      readOnly={false}
                    />
                    <span className="ml-2 text-gray-400">USD</span>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleUpdateRate} className="mt-6 pt-6 border-t border-gray-700">
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-400 to-white 400 text-white rounded-lg hover:from-blue-500 hover:to-white 500 transition-all flex items-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Update Rate</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}