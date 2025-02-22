import React from 'react';
import { Copy, RefreshCw } from 'lucide-react';
import { BlockchainWallet } from '../../types/settings';

interface WalletCardProps {
  title: string;
  wallet: BlockchainWallet;
  onAddressChange: (address: string) => void;
  onRefreshBalance: () => void;
  addressFormat: {
    regex: RegExp;
    placeholder: string;
    example: string;
  };
}

export function WalletCard({ 
  title, 
  wallet, 
  onAddressChange, 
  onRefreshBalance,
  addressFormat 
}: WalletCardProps) {
  const handleAddressChange = (newAddress: string) => {
    if (newAddress && !addressFormat.regex.test(newAddress)) {
      return; // Invalid format
    }
    onAddressChange(newAddress);
  };

  return (
    <div className="p-4 bg-gray-700/50 rounded-lg">
      <h3 className="text-white font-medium mb-4">{title}</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Address</span>
          <div className="flex items-center space-x-2 flex-1 ml-4">
            <input
              type="text"
              value={wallet.address}
              onChange={(e) => handleAddressChange(e.target.value)}
              className="flex-1 px-2 py-1 bg-gray-900 border border-gray-700 rounded text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-300"
              placeholder={addressFormat.placeholder}
            />
            <button 
              onClick={() => {
                navigator.clipboard.writeText(wallet.address);
              }}
              className="p-1 hover:bg-gray-600 rounded"
            >
              <Copy className="w-4 h-4 text-gray-400" />
            </button>
            <button 
              onClick={onRefreshBalance}
              className="p-1 hover:bg-gray-600 rounded"
            >
              <RefreshCw className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Balance</span>
          <div className="flex items-center space-x-2">
            <span className="text-white">${wallet.balance.toLocaleString()}</span>
          </div>
        </div>
        {wallet.extraInfo && Object.entries(wallet.extraInfo).map(([key, value]) => (
          <div key={key} className="flex justify-between items-center">
            <span className="text-gray-400">{key}</span>
            <span className={value.color}>${value.amount.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}