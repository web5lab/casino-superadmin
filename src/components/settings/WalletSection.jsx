import React from 'react';
import { Save } from 'lucide-react';
import { WalletCard } from './WalletCard';



const ADDRESS_FORMATS = {
  ethereum: {
    regex: /^0x[a-fA-F0-9]{40}$/,
    placeholder: '0x...',
    example: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
  },
  solana: {
    regex: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
    placeholder: 'Solana address...',
    example: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU'
  },
  bitcoin: {
    regex: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/,
    placeholder: 'BTC address...',
    example: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
  },
  tron: {
    regex: /^T[A-Za-z1-9]{33}$/,
    placeholder: 'TRX address...',
    example: 'TRWBqiqoFZysoAeyR1J35ibuyc8EvhUAoY'
  }
};

export function WalletSection({ 
  walletSettings,
  onWalletChange,
  onSave,
  onRefreshBalance
}) {
  return (
    <div className="space-y-6">
      {Object.entries(walletSettings).map(([network, wallets]) => (
        <div key={network} className="space-y-4">
          <h3 className="text-lg font-semibold text-white capitalize">{network} Wallets</h3>
          {Object.entries(wallets).map(([type, wallet]) => (
            <WalletCard
              key={`${network}-${type}`}
              title={`${type.replace(/([A-Z])/g, ' $1').trim()} Wallet`}
              wallet={wallet}
              onAddressChange={(address) => onWalletChange(network, type, { ...wallet, address })}
              onRefreshBalance={() => onRefreshBalance(network, type)}
              addressFormat={ADDRESS_FORMATS[network ]}
            />
          ))}
        </div>
      ))}

      <button
        onClick={onSave}
        className="w-full px-4 py-2 bg-gradient-to-r from-blue-400 to-white 400 text-white rounded-lg hover:from-blue-500 hover:to-white 500 transition-all flex items-center justify-center space-x-2"
      >
        <Save className="w-4 h-4" />
        <span>Save Changes</span>
      </button>
      
      <div className="text-sm text-gray-400">
        <p>Note: Each blockchain requires its own address format:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Ethereum: Starts with "0x" followed by 40 hexadecimal characters</li>
          <li>Solana: 32-44 characters long, Base58 encoded</li>
          <li>Bitcoin: Starts with 1, 3, or bc1</li>
          <li>Tron: Starts with "T" followed by 33 characters</li>
        </ul>
      </div>
    </div>
  );
}