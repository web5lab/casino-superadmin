import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Check, X, Plus, Palette } from 'lucide-react';
import { Casino } from '../../types/auth';

const mockCasinos: Casino[] = [
  {
    id: 'casino1',
    name: 'Royal Casino',
    status: 'active',
    balance: 125000.00,
    transactions: 1234,
    lastActive: new Date().toISOString(),
    apiConfig: {
      balanceApi: 'https://api.royalcasino.com/balance',
      depositApi: 'https://api.royalcasino.com/deposit',
      deductionApi: 'https://api.royalcasino.com/deduct',
      secretKey: 'sk_live_123456789'
    },
    theme: {
      primaryColor: '#FFA500',
      secondaryColor: '#90EE90'
    }
  },
  // Add more mock casinos as needed
];

export function Casinos() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [newCasino, setNewCasino] = useState<Partial<Casino>>({
    theme: {
      primaryColor: '#FFA500',
      secondaryColor: '#90EE90'
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call to create the casino
    console.log('New casino:', newCasino);
    setIsModalOpen(false);
    setCurrentStep(1);
    setNewCasino({
      theme: {
        primaryColor: '#FFA500',
        secondaryColor: '#90EE90'
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Casinos</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-orange-400 to-green-400 rounded-lg text-white hover:from-orange-500 hover:to-green-500 transition-all flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          Add New Casino
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCasinos.map((casino) => (
          <div key={casino.id} className="bg-gray-800 rounded-lg p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Building2 className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{casino.name}</h3>
                  <p className="text-sm text-gray-400">ID: {casino.id}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                casino.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
              }`}>
                {casino.status.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700/50 p-3 rounded-lg">
                <p className="text-sm text-gray-400">Balance</p>
                <p className="text-lg font-semibold text-white">${casino.balance.toLocaleString()}</p>
              </div>
              <div className="bg-gray-700/50 p-3 rounded-lg">
                <p className="text-sm text-gray-400">Transactions</p>
                <p className="text-lg font-semibold text-white">{casino.transactions}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Last Active</span>
                <span className="text-sm text-white">{new Date(casino.lastActive).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button 
                onClick={() => navigate(`/casinos/${casino.id}`)}
                className="flex-1 px-4 py-2 bg-gray-700 rounded-lg text-white hover:bg-gray-600 transition-colors"
              >
                View Details
              </button>
              <button className="px-4 py-2 bg-green-500/20 text-green-500 rounded-lg hover:bg-green-500/30 transition-colors">
                <Check className="w-5 h-5" />
              </button>
              <button className="px-4 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Add New Casino</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="mb-6">
              <div className="flex space-x-4 mb-4">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`flex-1 h-2 rounded-full ${
                      step <= currentStep ? 'bg-orange-400' : 'bg-gray-700'
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-400 text-sm text-center">
                Step {currentStep} of 3: {
                  currentStep === 1 ? 'Basic Information' :
                  currentStep === 2 ? 'API Configuration' :
                  'Theme Settings'
                }
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 mb-2">Casino Name</label>
                    <input
                      type="text"
                      required
                      value={newCasino.name || ''}
                      onChange={(e) => setNewCasino({ ...newCasino, name: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-300"
                      placeholder="Enter casino name"
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 mb-2">Balance API Endpoint</label>
                    <input
                      type="url"
                      required
                      value={newCasino.apiConfig?.balanceApi || ''}
                      onChange={(e) => setNewCasino({
                        ...newCasino,
                        apiConfig: { ...newCasino.apiConfig, balanceApi: e.target.value }
                      })}
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-300"
                      placeholder="https://api.example.com/balance"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">Deposit API Endpoint</label>
                    <input
                      type="url"
                      required
                      value={newCasino.apiConfig?.depositApi || ''}
                      onChange={(e) => setNewCasino({
                        ...newCasino,
                        apiConfig: { ...newCasino.apiConfig, depositApi: e.target.value }
                      })}
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-300"
                      placeholder="https://api.example.com/deposit"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">Deduction API Endpoint</label>
                    <input
                      type="url"
                      required
                      value={newCasino.apiConfig?.deductionApi || ''}
                      onChange={(e) => setNewCasino({
                        ...newCasino,
                        apiConfig: { ...newCasino.apiConfig, deductionApi: e.target.value }
                      })}
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-300"
                      placeholder="https://api.example.com/deduct"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">Secret Key</label>
                    <input
                      type="password"
                      required
                      value={newCasino.apiConfig?.secretKey || ''}
                      onChange={(e) => setNewCasino({
                        ...newCasino,
                        apiConfig: { ...newCasino.apiConfig, secretKey: e.target.value }
                      })}
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-300"
                      placeholder="Enter secret key"
                    />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 mb-2">Primary Color</label>
                      <div className="flex space-x-2">
                        <input
                          type="color"
                          value={newCasino.theme?.primaryColor || '#FFA500'}
                          onChange={(e) => setNewCasino({
                            ...newCasino,
                            theme: { ...newCasino.theme, primaryColor: e.target.value }
                          })}
                          className="h-10 w-20 bg-gray-900 border border-gray-700 rounded"
                        />
                        <input
                          type="text"
                          value={newCasino.theme?.primaryColor || '#FFA500'}
                          onChange={(e) => setNewCasino({
                            ...newCasino,
                            theme: { ...newCasino.theme, primaryColor: e.target.value }
                          })}
                          className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-2">Secondary Color</label>
                      <div className="flex space-x-2">
                        <input
                          type="color"
                          value={newCasino.theme?.secondaryColor || '#90EE90'}
                          onChange={(e) => setNewCasino({
                            ...newCasino,
                            theme: { ...newCasino.theme, secondaryColor: e.target.value }
                          })}
                          className="h-10 w-20 bg-gray-900 border border-gray-700 rounded"
                        />
                        <input
                          type="text"
                          value={newCasino.theme?.secondaryColor || '#90EE90'}
                          onChange={(e) => setNewCasino({
                            ...newCasino,
                            theme: { ...newCasino.theme, secondaryColor: e.target.value }
                          })}
                          className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">Logo URL (Optional)</label>
                    <input
                      type="url"
                      value={newCasino.theme?.logo || ''}
                      onChange={(e) => setNewCasino({
                        ...newCasino,
                        theme: { ...newCasino.theme, logo: e.target.value }
                      })}
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-300"
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                  <div className="mt-4 p-4 bg-gray-900 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Palette className="w-5 h-5 text-orange-400" />
                      <h3 className="text-white font-medium">Preview</h3>
                    </div>
                    <div className="flex space-x-4">
                      <div
                        className="w-20 h-20 rounded-lg"
                        style={{ background: newCasino.theme?.primaryColor }}
                      />
                      <div
                        className="w-20 h-20 rounded-lg"
                        style={{ background: newCasino.theme?.secondaryColor }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-6 pt-6 border-t border-gray-700">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Previous
                  </button>
                )}
                <button
                  type={currentStep === 3 ? 'submit' : 'button'}
                  onClick={() => currentStep < 3 && setCurrentStep(currentStep + 1)}
                  className="px-4 py-2 bg-gradient-to-r from-orange-400 to-green-400 text-white rounded-lg hover:from-orange-500 hover:to-green-500 transition-all ml-auto"
                >
                  {currentStep === 3 ? 'Create Casino' : 'Next'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}