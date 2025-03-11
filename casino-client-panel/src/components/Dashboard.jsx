import React from 'react';
import { ArrowUpRight, ArrowDownRight, DollarSign, Users, Activity, TrendingUp } from 'lucide-react';


const metrics = [
  {
    title: 'Total Transaction Volume',
    value: '$12.5M',
    change: '+15.3%',
    trend: 'up',
  },
  {
    title: 'Average Transaction Size',
    value: '$2,450',
    change: '+5.2%',
    trend: 'up',
  },
  {
    title: 'Active Users',
    value: '3,123',
    change: '-2.1%',
    trend: 'down',
  },
  {
    title: 'Conversion Rate',
    value: '2.8%',
    change: '+0.5%',
    trend: 'up',
  },
];

const topCurrencies = [
  { name: 'Bitcoin', volume: '$5.2M', change: '+12.3%' },
  { name: 'Ethereum', volume: '$3.1M', change: '+8.7%' },
  { name: 'USDT', volume: '$2.8M', change: '+5.2%' },
  { name: 'Solana', volume: '$1.4M', change: '+15.8%' },
];

const stats = [
  {
    title: 'Total Volume',
    value: '$2.4M',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
  },
  {
    title: 'Active Users',
    value: '1,234',
    change: '+8.2%',
    trend: 'up',
    icon: Users,
  },
  {
    title: 'Success Rate',
    value: '98.5%',
    change: '-0.5%',
    trend: 'down',
    icon: Activity,
  },
  {
    title: 'Revenue',
    value: '$125K',
    change: '+15.3%',
    trend: 'up',
    icon: TrendingUp,
  },
];

const recentTransactions = [
  {
    id: '1',
    user: 'John Doe',
    type: 'Deposit',
    amount: '0.5 BTC',
    status: 'completed',
    timestamp: '2 min ago',
  },
  {
    id: '2',
    user: 'Alice Smith',
    type: 'Withdrawal',
    amount: '2.3 ETH',
    status: 'pending',
    timestamp: '5 min ago',
  },
  {
    id: '3',
    user: 'Bob Johnson',
    type: 'Deposit',
    amount: '1000 USDT',
    status: 'completed',
    timestamp: '10 min ago',
  },
];

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-blue-50 rounded-lg">
                <stat.icon className="w-6 h-6 text-blue-600" />
              </div>
              <span className={`flex items-center ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change}
                {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              </span>
            </div>
            <h3 className="text-2xl font-bold mt-4">{stat.value}</h3>
            <p className="text-gray-500 text-sm">{stat.title}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Volume by Currency</h2>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {topCurrencies.map((currency) => (
              <div key={currency.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">
                      {currency.name.substring(0, 3).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium">{currency.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-medium">{currency.volume}</p>
                  <p className="text-sm text-green-500">{currency.change}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-6">Transaction Success Rate</h2>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                  Success
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-green-600">98%</span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
              <div className="w-[98%] shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
            </div>
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-yellow-600 bg-yellow-200">
                  Pending
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-yellow-600">1.5%</span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-yellow-200">
              <div className="w-[1.5%] shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500"></div>
            </div>
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600 bg-red-200">
                  Failed
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-red-600">0.5%</span>
              </div>
            </div>
            <div className="overflow-hidden h-2 text-xs flex rounded bg-red-200">
              <div className="w-[0.5%] shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="pb-3 text-gray-500 font-medium">User</th>
                <th className="pb-3 text-gray-500 font-medium">Type</th>
                <th className="pb-3 text-gray-500 font-medium">Amount</th>
                <th className="pb-3 text-gray-500 font-medium">Status</th>
                <th className="pb-3 text-gray-500 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="border-b border-gray-100">
                  <td className="py-3">{tx.user}</td>
                  <td className="py-3">{tx.type}</td>
                  <td className="py-3">{tx.amount}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        tx.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3 text-gray-500">{tx.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}