import React from 'react';
import { Save } from 'lucide-react';

const currencies = [
  { symbol: 'BTC', name: 'Bitcoin', fee: 1.5, enabled: true },
  { symbol: 'ETH', name: 'Ethereum', fee: 1.2, enabled: true },
  { symbol: 'USDT', name: 'Tether', fee: 0.5, enabled: true },
  { symbol: 'SOL', name: 'Solana', fee: 0.8, enabled: false },
];

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Settings</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      {/* <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">API Configuration</h2>
          <p className="text-gray-500 mt-1">Manage API keys and endpoints for external integrations</p>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Key
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono"
                defaultValue="sk_live_123456789"
              />
              <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                Regenerate
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-500">Use this key to authenticate API requests</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Webhook URL
            </label>
            <input
              type="url"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="https://your-domain.com/webhook"
              defaultValue="https://api.example.com/webhook"
            />
            <p className="mt-1 text-sm text-gray-500">Endpoint for receiving webhook notifications</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Version
            </label>
            <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500">
              <option value="v2">v2 (Latest)</option>
              <option value="v1">v1 (Legacy)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Request Timeout (seconds)
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              defaultValue="30"
              min="1"
              max="120"
            />
          </div>
          
          <div>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded text-blue-600" defaultChecked />
              <span className="text-sm text-gray-700">Enable API Rate Limiting</span>
            </label>
          </div>
          
          <div>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded text-blue-600" defaultChecked />
              <span className="text-sm text-gray-700">Enable Webhook Retries</span>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Currency Settings</h2>
          <p className="text-gray-500 mt-1">Configure supported cryptocurrencies and their fees</p>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {currencies.map((currency) => (
              <div key={currency.symbol} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <span className="font-semibold text-blue-600">{currency.symbol}</span>
                  </div>
                  <div>
                    <h3 className="font-medium">{currency.name}</h3>
                    <p className="text-sm text-gray-500">Fee: {currency.fee}%</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked={currency.enabled} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Security Settings</h2>
          <p className="text-gray-500 mt-1">Configure security and compliance settings</p>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Withdrawal Amount (USD)
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              defaultValue="100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Daily Withdrawal (USD)
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              defaultValue="10000"
            />
          </div>
          {/* <div>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded text-blue-600" defaultChecked />
              <span className="text-sm text-gray-700">Require 2FA for withdrawals</span>
            </label>
          </div>
          <div>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded text-blue-600" defaultChecked />
              <span className="text-sm text-gray-700">Enable KYC verification</span>
            </label>
          </div> */}
        </div>
      </div>
    </div>
  );
}