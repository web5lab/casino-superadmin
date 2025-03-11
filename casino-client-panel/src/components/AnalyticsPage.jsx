import React from 'react';
import { Calendar, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

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

export default function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Analytics</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
          <Calendar className="w-4 h-4" />
          Last 30 Days
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div key={metric.title} className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-500 text-sm">{metric.title}</h3>
              <span className={`flex items-center ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {metric.change}
                {metric.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              </span>
            </div>
            <p className="text-2xl font-bold mt-2">{metric.value}</p>
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
    </div>
  );
}