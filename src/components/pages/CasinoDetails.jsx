import React from 'react';
import { useParams } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3
} from 'lucide-react';

const mockCasinoDetails = {
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
  },
  analytics: {
    totalTransactions: 5678,
    totalVolume: 2500000.00,
    totalFees: 25000.00,
    averageTransactionSize: 440.31,
    successRate: 98.5,
    activeUsers: 789,
    peakHour: '14:00',
    monthlyGrowth: 12.5,
    recentActivity: [
      { time: '1h ago', type: 'deposit', amount: 1000, status: 'completed' },
      { time: '2h ago', type: 'withdrawal', amount: 500, status: 'completed' },
      { time: '3h ago', type: 'deposit', amount: 2000, status: 'failed' }
    ],
    volumeByDay: [
      { day: 'Mon', volume: 50000 },
      { day: 'Tue', volume: 45000 },
      { day: 'Wed', volume: 60000 },
      { day: 'Thu', volume: 55000 },
      { day: 'Fri', volume: 75000 },
      { day: 'Sat', volume: 85000 },
      { day: 'Sun', volume: 70000 }
    ]
  }
};

export function CasinoDetails() {
  const { id } = useParams();
  // In a real app, fetch casino details based on id
  const casino = mockCasinoDetails;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">{casino.name}</h1>
          <p className="text-gray-400">ID: {casino.id}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${
          casino.status === 'active' ? 'bg-white 500/20 text-white 500' : 'bg-red-500/20 text-red-500'
        }`}>
          {casino.status.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Volume"
          value={`$${casino.analytics.totalVolume.toLocaleString()}`}
          change="+15.3%"
          icon={DollarSign}
          color="bg-white 500/10 text-white 500"
        />
        <StatCard
          title="Total Fees Earned"
          value={`$${casino.analytics.totalFees.toLocaleString()}`}
          change="+8.2%"
          icon={TrendingUp}
          color="bg-blue-500/10 text-blue-500"
        />
        <StatCard
          title="Active Users"
          value={casino.analytics.activeUsers.toString()}
          change="+12.5%"
          icon={Users}
          color="bg-blue-500/10 text-blue-500"
        />
        <StatCard
          title="Success Rate"
          value={`${casino.analytics.successRate}%`}
          change="+2.1%"
          icon={CheckCircle}
          color="bg-purple-500/10 text-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Volume Chart */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Weekly Volume</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Total: </span>
              <span className="text-sm text-white font-semibold">
                ${casino.analytics.volumeByDay.reduce((acc, day) => acc + day.volume, 0).toLocaleString()}
              </span>
            </div>
          </div>
          <div className="h-64 flex items-end space-x-2">
            {casino.analytics.volumeByDay.map((day) => (
              <div key={day.day} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-blue-500/20 rounded-t-lg hover:bg-blue-500/30 transition-colors"
                  style={{ 
                    height: `${(day.volume / Math.max(...casino.analytics.volumeByDay.map(d => d.volume))) * 100}%` 
                  }}
                />
                <div className="mt-2 text-xs text-gray-400">{day.day}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {casino.analytics.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {activity.type === 'deposit' ? (
                    <TrendingUp className="w-5 h-5 text-white 500" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-500" />
                  )}
                  <div>
                    <p className="text-white capitalize">{activity.type}</p>
                    <p className="text-sm text-gray-400">{activity.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white">${activity.amount.toLocaleString()}</p>
                  <p className={`text-sm ${
                    activity.status === 'completed' ? 'text-white 500' : 'text-red-500'
                  }`}>
                    {activity.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Performance Metrics */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Performance Metrics</h2>
          <div className="space-y-4">
            <MetricItem
              label="Average Transaction"
              value={`$${casino.analytics.averageTransactionSize.toFixed(2)}`}
              icon={Activity}
            />
            <MetricItem
              label="Peak Hour"
              value={casino.analytics.peakHour}
              icon={Clock}
            />
            <MetricItem
              label="Monthly Growth"
              value={`${casino.analytics.monthlyGrowth}%`}
              icon={BarChart3}
            />
          </div>
        </div>

        {/* API Status */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-6">API Status</h2>
          <div className="space-y-4">
            <ApiStatusItem
              label="Balance API"
              status="operational"
              endpoint={casino.apiConfig.balanceApi}
            />
            <ApiStatusItem
              label="Deposit API"
              status="operational"
              endpoint={casino.apiConfig.depositApi}
            />
            <ApiStatusItem
              label="Deduction API"
              status="operational"
              endpoint={casino.apiConfig.deductionApi}
            />
          </div>
        </div>

        {/* Theme Preview */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Theme Configuration</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-2">Primary Color</label>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-10 h-10 rounded-lg"
                  style={{ backgroundColor: casino.theme.primaryColor }}
                />
                <span className="text-white font-mono">{casino.theme.primaryColor}</span>
              </div>
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Secondary Color</label>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-10 h-10 rounded-lg"
                  style={{ backgroundColor: casino.theme.secondaryColor }}
                />
                <span className="text-white font-mono">{casino.theme.secondaryColor}</span>
              </div>
            </div>
            {casino.theme.logo && (
              <div>
                <label className="block text-gray-400 mb-2">Logo</label>
                <img 
                  src={casino.theme.logo} 
                  alt="Casino logo" 
                  className="h-12 object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


function StatCard({ title, value, change, icon: Icon, color }) {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="flex items-center mt-4">
        <TrendingUp className="w-4 h-4 text-white 500" />
        <span className="ml-1 text-white 500">{change}</span>
      </div>
    </div>
  );
}


function MetricItem({ label, value, icon: Icon }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
      <div className="flex items-center space-x-3">
        <Icon className="w-5 h-5 text-gray-400" />
        <span className="text-gray-400">{label}</span>
      </div>
      <span className="text-white font-medium">{value}</span>
    </div>
  );
}

function ApiStatusItem({ label, status, endpoint }) {
  return (
    <div className="p-3 bg-gray-700/50 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-400">{label}</span>
        <span className={`flex items-center ${
          status === 'operational' ? 'text-white 500' :
          status === 'warning' ? 'text-yellow-500' :
          'text-red-500'
        }`}>
          {status === 'operational' ? (
            <CheckCircle className="w-4 h-4 mr-1" />
          ) : status === 'warning' ? (
            <AlertTriangle className="w-4 h-4 mr-1" />
          ) : (
            <XCircle className="w-4 h-4 mr-1" />
          )}
          {status}
        </span>
      </div>
      <p className="text-sm text-gray-500 truncate">{endpoint}</p>
    </div>
  );
}