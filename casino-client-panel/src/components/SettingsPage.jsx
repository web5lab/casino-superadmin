import React, { useEffect, useState } from 'react';
import { Save, Wallet, Globe, Sliders, Paintbrush, Key } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getCasinoSettingApi, updateCasinoSettingApi } from '../store/global.Action';

export default function CasinoSettingsPage() {
  const casinoSetting = useSelector(state => state.global.casinoSettings);
  const token = useSelector(state => state.global.profile.token);
  const casinoId = useSelector(state => state.global.profile.user.casinoId);
  const [settings, setSettings] = useState(casinoSetting?.casino);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCasinoSettingApi({casinoId:casinoId , token:token}))
  }, [])

  const [activeTab, setActiveTab] = useState('general');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleApiConfigChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      apiConfig: { ...prev.apiConfig, [name]: value },
    }));
  };

  const handleThemeChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      theme: { ...prev.theme, [name]: value },
    }));
  };

  const handleSave = async () => {
   dispatch(updateCasinoSettingApi({casinoId:casinoId , token:token , setting:settings}))
  };

  const formatLabel = (key) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Casino Settings</h1>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('general')}
              className={`px-6 py-4 font-medium flex items-center gap-2 ${activeTab === 'general'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              <Sliders className="w-4 h-4" />
              General
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={`px-6 py-4 font-medium flex items-center gap-2 ${activeTab === 'api'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              <Globe className="w-4 h-4" />
              API Config
            </button>
            <button
              onClick={() => setActiveTab('theme')}
              className={`px-6 py-4 font-medium flex items-center gap-2 ${activeTab === 'theme'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              <Paintbrush className="w-4 h-4" />
              Theme
            </button>
            <button
              onClick={() => setActiveTab('wallet')}
              className={`px-6 py-4 font-medium flex items-center gap-2 ${activeTab === 'wallet'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              <Wallet className="w-4 h-4" />
              Wallet & Withdrawals
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">General Settings</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-medium text-gray-700">Casino Name</label>
                    <input
                      name="name"
                      value={settings.name}
                      onChange={handleChange}
                      placeholder="Enter casino name"
                      className="w-full mt-2 border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700">Casino Status</label>
                    <select
                      name="status"
                      value={settings.status}
                      onChange={handleChange}
                      className="w-full mt-2 border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none bg-white"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="maintenance">Maintenance Mode</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'api' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">API Configuration</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.keys(settings.apiConfig).map((key) => (
                    <div key={key}>
                      <label className="block font-medium text-gray-700">{formatLabel(key)}</label>
                      <input
                        name={key}
                        value={settings.apiConfig[key]}
                        onChange={handleApiConfigChange}
                        placeholder={`Enter ${key.toLowerCase()}`}
                        className="w-full mt-2 border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        type={key.includes('key') ? 'password' : 'text'}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'theme' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Theme Settings</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-medium text-gray-700">Primary Color</label>
                    <div className="flex mt-2 items-center">
                      <div
                        className="w-10 h-10 rounded-lg border border-gray-300 mr-3"
                        style={{ backgroundColor: settings.theme.primaryColor }}
                      ></div>
                      <input
                        name="primaryColor"
                        type="color"
                        value={settings.theme.primaryColor}
                        onChange={handleThemeChange}
                        className="w-12 h-10"
                      />
                      <input
                        name="primaryColor"
                        type="text"
                        value={settings.theme.primaryColor}
                        onChange={handleThemeChange}
                        className="ml-3 border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700">Secondary Color</label>
                    <div className="flex mt-2 items-center">
                      <div
                        className="w-10 h-10 rounded-lg border border-gray-300 mr-3"
                        style={{ backgroundColor: settings.theme.secondaryColor }}
                      ></div>
                      <input
                        name="secondaryColor"
                        type="color"
                        value={settings.theme.secondaryColor}
                        onChange={handleThemeChange}
                        className="w-12 h-10"
                      />
                      <input
                        name="secondaryColor"
                        type="text"
                        value={settings.theme.secondaryColor}
                        onChange={handleThemeChange}
                        className="ml-3 border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-gray-700">Logo URL</label>
                  <input
                    name="logo"
                    value={settings.theme.logo}
                    onChange={handleThemeChange}
                    placeholder="Enter logo URL"
                    className="w-full mt-2 border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                  {settings.theme.logo && (
                    <div className="mt-4 p-4 border border-gray-200 rounded-lg inline-block">
                      <p className="text-sm text-gray-500 mb-2">Logo Preview:</p>
                      <img
                        src={settings.theme.logo}
                        alt="Logo preview"
                        className="max-h-16 object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/api/placeholder/200/64";
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'wallet' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Wallet & Withdrawal Settings</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-medium text-gray-700">Minimum Withdrawal (USD)</label>
                    <div className="relative mt-2">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">$</span>
                      </div>
                      <input
                        name="minimumWithdrawlAmount"
                        type="number"
                        value={settings.minimumWithdrawlAmount}
                        onChange={handleChange}
                        className="w-full pl-8 border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700">Maximum Daily Withdrawal (USD)</label>
                    <div className="relative mt-2">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">$</span>
                      </div>
                      <input
                        name="maximumDailyWithdrawlAmount"
                        type="number"
                        value={settings.maximumDailyWithdrawlAmount}
                        onChange={handleChange}
                        className="w-full pl-8 border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="autoWithdrawl"
                      name="autoWithdrawl"
                      checked={settings.autoWithdrawl}
                      onChange={handleChange}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="autoWithdrawl" className="font-medium text-gray-700">Enable Auto Withdrawal</label>
                  </div>

                  {settings.autoWithdrawl && (
                    <div className="mt-4 pl-8">
                      <label className="block font-medium text-gray-700">Auto Withdrawal Limit (USD)</label>
                      <div className="relative mt-2">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">$</span>
                        </div>
                        <input
                          name="autoWithdrawlAmount"
                          type="number"
                          value={settings.autoWithdrawlAmount}
                          onChange={handleChange}
                          className="w-full pl-8 border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Withdrawals above this amount will require manual approval</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}