import React, { useState } from 'react';
import {
  Bell, 
  Lock, 
  Shield, 
  Smartphone,
  Globe,
  CreditCard,
  Check,
  Wallet,
  Save
} from 'lucide-react';
import { WalletSection } from '../settings/WalletSection';

export function Settings() {
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    sessionTimeout: 30,
    passwordLastChanged: new Date().toISOString()
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailEnabled: true,
    pushEnabled: false,
    transactionThreshold: 1000
  });

  const [paymentSettings, setPaymentSettings] = useState({
    dailyLimit: 10000,
    monthlyLimit: 100000,
    autoApprovalLimit: 1000
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(null);

  const [walletSettings, setWalletSettings] = useState({
    ethereum: {
      adminWallet: {
        address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        balance: 25000.50,
        extraInfo: {
          'Total Fees Collected': { amount: 1234.56, color: 'text-white 500' }
        }
      },
      fundingWallet: {
        address: '0x123f681646d4a755815f9cb19e1acc8565a0c2ac',
        balance: 5000.75,
        extraInfo: {
          'Total Gas Spent': { amount: 456.78, color: 'text-blue-500' }
        }
      }
    },
    solana: {
      adminWallet: {
        address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
        balance: 15000.25,
        extraInfo: {
          'Total Fees Collected': { amount: 890.12, color: 'text-white 500' }
        }
      },
      fundingWallet: {
        address: '3Kz9QYZgSEqXWzbCaEy9thgFd8UJFMkf8QWL6tzeqNT3',
        balance: 3000.50,
        extraInfo: {
          'Total Gas Spent': { amount: 234.56, color: 'text-blue-500' }
        }
      }
    },
    bitcoin: {
      adminWallet: {
        address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        balance: 45000.75,
        extraInfo: {
          'Total Fees Collected': { amount: 2345.67, color: 'text-white 500' }
        }
      },
      fundingWallet: {
        address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        balance: 8000.25,
        extraInfo: {
          'Network Fees': { amount: 789.12, color: 'text-blue-500' }
        }
      }
    },
    tron: {
      adminWallet: {
        address: 'TRWBqiqoFZysoAeyR1J35ibuyc8EvhUAoY',
        balance: 12000.35,
        extraInfo: {
          'Total Fees Collected': { amount: 567.89, color: 'text-white 500' }
        }
      },
      fundingWallet: {
        address: 'TNPeeaaFB7K9v3DkeqYdqKAb2p6s2jYa5h',
        balance: 4000.15,
        extraInfo: {
          'Energy Spent': { amount: 123.45, color: 'text-blue-500' }
        }
      }
    }
  });

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }
    // Here you would typically make an API call to change the password
    setPasswordError('');
    setShowPasswordModal(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showSuccessMessage('Password updated successfully');
  };

  const showSuccessMessage = (message) => {
    setSaveSuccess(message);
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const handleSecuritySave = () => {
    // Here you would typically make an API call to save security settings
    showSuccessMessage('Security settings updated successfully');
  };

  const handleNotificationSave = () => {
    // Here you would typically make an API call to save notification settings
    showSuccessMessage('Notification settings updated successfully');
  };

  const handlePaymentSave = () => {
    // Here you would typically make an API call to save payment settings
    showSuccessMessage('Payment settings updated successfully');
  };

  const handleWalletChange = (network, type, wallet) => {
    setWalletSettings(prev => ({
      ...prev,
      [network]: {
        ...prev[network ],
        [type]: wallet
      }
    }));
  };

  const handleWalletSave = () => {
    // Here you would typically make an API call to save all wallet settings
    showSuccessMessage('Wallet settings updated successfully');
  };

  const handleRefreshBalance = (network, type) => {
    // Here you would typically make an API call to fetch the latest balance
    showSuccessMessage(`${network} ${type} balance refreshed`);
  };

  const settingSections = [
  {
    title: 'Wallet Management',
    icon: Wallet,
    content: <WalletSection
      walletSettings={walletSettings}
      onWalletChange={handleWalletChange}
      onSave={handleWalletSave}
      onRefreshBalance={handleRefreshBalance}
    />
  },
  {
    title: 'Security',
    icon: Lock,
    content: (
      <div className="space-y-6">
        <button
          onClick={() => setShowPasswordModal(true)}
          className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-700/50 transition-colors"
        >
          <div className="text-left">
            <h3 className="text-white font-medium">Change Password</h3>
            <p className="text-sm text-gray-400">Last changed: {new Date(securitySettings.passwordLastChanged).toLocaleDateString()}</p>
          </div>
          <div className="text-gray-400">→</div>
        </button>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
            <div>
              <h3 className="text-white font-medium">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-400">Add an extra layer of security</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={securitySettings.twoFactorEnabled}
                onChange={(e) => setSecuritySettings({
                  ...securitySettings,
                  twoFactorEnabled: e.target.checked
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-400 peer-checked:to-white 400"></div>
            </label>
          </div>

          <div className="p-3 bg-gray-700/50 rounded-lg">
            <h3 className="text-white font-medium mb-2">Session Timeout</h3>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={securitySettings.sessionTimeout}
                onChange={(e) => setSecuritySettings({
                  ...securitySettings,
                  sessionTimeout: parseInt(e.target.value)
                })}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-white min-w-[4rem]">{securitySettings.sessionTimeout}m</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleSecuritySave}
          className="w-full px-4 py-2 bg-gradient-to-r from-blue-400 to-white 400 text-white rounded-lg hover:from-blue-500 hover:to-white 500 transition-all flex items-center justify-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>
    )
  },
  {
    title: 'Notifications',
    icon: Bell,
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
            <div>
              <h3 className="text-white font-medium">Email Notifications</h3>
              <p className="text-sm text-gray-400">Receive alerts via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.emailEnabled}
                onChange={(e) => setNotificationSettings({
                  ...notificationSettings,
                  emailEnabled: e.target.checked
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-400 peer-checked:to-white 400"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
            <div>
              <h3 className="text-white font-medium">Push Notifications</h3>
              <p className="text-sm text-gray-400">Receive push notifications</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.pushEnabled}
                onChange={(e) => setNotificationSettings({
                  ...notificationSettings,
                  pushEnabled: e.target.checked
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-400 peer-checked:to-white 400"></div>
            </label>
          </div>

          <div className="p-3 bg-gray-700/50 rounded-lg">
            <h3 className="text-white font-medium mb-2">Transaction Alert Threshold</h3>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400">$</span>
              <input
                type="number"
                min="0"
                step="100"
                value={notificationSettings.transactionThreshold}
                onChange={(e) => setNotificationSettings({
                  ...notificationSettings,
                  transactionThreshold: parseInt(e.target.value)
                })}
                className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleNotificationSave}
          className="w-full px-4 py-2 bg-gradient-to-r from-blue-400 to-white 400 text-white rounded-lg hover:from-blue-500 hover:to-white 500 transition-all flex items-center justify-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>
    )
  },
  {
    title: 'Payment Settings',
    icon: CreditCard,
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="p-3 bg-gray-700/50 rounded-lg">
            <h3 className="text-white font-medium mb-2">Daily Transaction Limit</h3>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400">$</span>
              <input
                type="number"
                min="0"
                step="1000"
                value={paymentSettings.dailyLimit}
                onChange={(e) => setPaymentSettings({
                  ...paymentSettings,
                  dailyLimit: parseInt(e.target.value)
                })}
                className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>

          <div className="p-3 bg-gray-700/50 rounded-lg">
            <h3 className="text-white font-medium mb-2">Monthly Transaction Limit</h3>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400">$</span>
              <input
                type="number"
                min="0"
                step="5000"
                value={paymentSettings.monthlyLimit}
                onChange={(e) => setPaymentSettings({
                  ...paymentSettings,
                  monthlyLimit: parseInt(e.target.value)
                })}
                className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>

          <div className="p-3 bg-gray-700/50 rounded-lg">
            <h3 className="text-white font-medium mb-2">Auto-Approval Limit</h3>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400">$</span>
              <input
                type="number"
                min="0"
                step="100"
                value={paymentSettings.autoApprovalLimit}
                onChange={(e) => setPaymentSettings({
                  ...paymentSettings,
                  autoApprovalLimit: parseInt(e.target.value)
                })}
                className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handlePaymentSave}
          className="w-full px-4 py-2 bg-gradient-to-r from-blue-400 to-white 400 text-white rounded-lg hover:from-blue-500 hover:to-white 500 transition-all flex items-center justify-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>
    )
  }
];

  return (
    <>
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Settings</h1>

      {saveSuccess && (
        <div className="fixed top-4 right-4 bg-white 500/90 text-white px-4 py-2 rounded-lg flex items-center space-x-2 animate-fade-in-out">
          <Check className="w-4 h-4" />
          <span>{saveSuccess}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {settingSections.map((section) => (
          <div key={section.title} className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <section.icon className="w-6 h-6 text-blue-500" />
              </div>
              <h2 className="text-xl font-semibold text-white">{section.title}</h2>
            </div>

            {section.content}
          </div>
        ))}
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-6">System Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-700/50 rounded-lg">
            <div className="flex items-center space-x-2 text-gray-400 mb-2">
              <Globe className="w-4 h-4" />
              <span>API Version</span>
            </div>
            <p className="text-white">v2.1.0</p>
          </div>
          <div className="p-4 bg-gray-700/50 rounded-lg">
            <div className="flex items-center space-x-2 text-gray-400 mb-2">
              <Shield className="w-4 h-4" />
              <span>Last Security Update</span>
            </div>
            <p className="text-white">2 days ago</p>
          </div>
          <div className="p-4 bg-gray-700/50 rounded-lg">
            <div className="flex items-center space-x-2 text-gray-400 mb-2">
              <Smartphone className="w-4 h-4" />
              <span>Client Version</span>
            </div>
            <p className="text-white">1.5.2</p>
          </div>
        </div>
      </div>
    </div>

    {showPasswordModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-bold text-white mb-6">Change Password</h2>
          
          {passwordError && (
            <div className="mb-4 p-3 bg-red-500/10 text-red-500 rounded-lg">
              {passwordError}
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-2">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordError('');
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-blue-400 to-white 400 text-white rounded-lg hover:from-blue-500 hover:to-white 500 transition-all"
              >
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </>
  );
}