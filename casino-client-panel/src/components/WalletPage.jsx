import React, { useState } from 'react';
import { Wallet, ArrowUpRight, ArrowDownRight, RefreshCw, Copy, CheckCircle, ArrowDown, ArrowUp } from 'lucide-react';

const wallets = [
  {
    currency: 'USDT',
    symbol: 'USDT',
    balance: '50,000',
    usdValue: '50,000',
    icon: "https://cryptologos.cc/logos/tether-usdt-logo.svg?v=040",
    address: 'TXyz123abcdefghijklmnopqrstuvwxyz123',
    change: '+0.1%',
    trend: 'up',
  }
];

export default function WalletPage() {
  const [activeModal, setActiveModal] = useState(null);
  const [copiedAddress, setCopiedAddress] = useState(null);
  const [selectedWallet, setSelectedWallet] = useState(null);

  const handleCopyAddress = (address, symbol) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(symbol);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const openModal = (type, wallet) => {
    setSelectedWallet(wallet);
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedWallet(null);
  };

  const renderModal = () => {
    if (!activeModal || !selectedWallet) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {activeModal === 'deposit' ? 'Deposit' : 'Withdraw'} {selectedWallet.currency}
            </h3>
            <button
              onClick={closeModal}
              className="text-gray-400 hover:text-gray-600"
            >
              &times;
            </button>
          </div>

          {activeModal === 'deposit' ? (
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-2">Your {selectedWallet.currency} Address</p>
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                  <p className="text-sm font-mono truncate">{selectedWallet.address}</p>
                  <button
                    onClick={() => handleCopyAddress(selectedWallet.address, selectedWallet.symbol)}
                    className="text-blue-600 hover:text-blue-800 ml-2"
                  >
                    {copiedAddress === selectedWallet.symbol ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <ArrowDown className="w-4 h-4" />
                  <p className="font-medium">Important</p>
                </div>
                <p className="text-sm text-gray-700">
                  Only send {selectedWallet.currency} to this address. Sending any other cryptocurrency may result in permanent loss.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount to Withdraw</label>
                <div className="flex">
                  <input
                    type="text"
                    className="flex-grow border border-gray-300 rounded-l-lg p-2"
                    placeholder="0.00"
                  />
                  <div className="bg-gray-100 border border-gray-300 border-l-0 rounded-r-lg p-2 flex items-center">
                    {selectedWallet.symbol}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Available: {selectedWallet.balance} {selectedWallet.symbol}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination Address</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-2"
                  placeholder={`Enter ${selectedWallet.currency} address`}
                />
              </div>

              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                Withdraw {selectedWallet.currency}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Wallet</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
          <RefreshCw className="w-4 h-4" />
          Refresh Balances
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wallets.map((wallet) => (
          <div key={wallet.symbol} className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <img src={wallet.icon} className="font-semibold text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">{wallet.currency}</h3>
                </div>
              </div>
              
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{wallet.balance} {wallet.symbol}</p>
              <p className="text-gray-500">{50000 * 89} INR</p>
            </div>
            <div className="mt-4 flex gap-2">

              <button
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-1"
                onClick={() => openModal('withdraw', wallet)}
              >
                <ArrowUp className="w-4 h-4" />
                Withdraw
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* <div className="bg-white rounded-xl shadow-sm">
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
                  <p className={`text-sm ${activity.status === 'completed' ? 'text-green-500' : 'text-yellow-500'
                    }`}>
                    {activity.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {renderModal()}
    </div>
  );
}