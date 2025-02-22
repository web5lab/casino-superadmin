import React from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight,
  Wallet,
  Building2,
  AlertTriangle
} from 'lucide-react';

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Deposits"
          value="$2,456,789"
          change="+12.5%"
          isPositive={true}
          icon={Wallet}
          color="bg-green-500/10 text-green-500"
        />
        <StatCard
          title="Active Casinos"
          value="156"
          change="+3"
          isPositive={true}
          icon={Building2}
          color="bg-orange-500/10 text-orange-500"
        />
        <StatCard
          title="Pending Transactions"
          value="23"
          change="+5"
          isPositive={false}
          icon={AlertTriangle}
          color="bg-yellow-500/10 text-yellow-500"
        />
        <StatCard
          title="Failed Transactions"
          value="7"
          change="-2"
          isPositive={true}
          icon={AlertTriangle}
          color="bg-red-500/10 text-red-500"
        />
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-300">
            <thead>
              <tr className="text-left border-b border-gray-700">
                <th className="pb-3">Transaction ID</th>
                <th className="pb-3">Casino</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="hover:bg-gray-700/50">
                  <td className="py-3">#TX{Math.random().toString(36).substr(2, 8)}</td>
                  <td className="py-3">Casino Royal</td>
                  <td className="py-3">$1,234.56</td>
                  <td className="py-3">
                    <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-500">
                      Completed
                    </span>
                  </td>
                  <td className="py-3">2 minutes ago</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ElementType;
  color: string;
}

function StatCard({ title, value, change, isPositive, icon: Icon, color }: StatCardProps) {
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
        {isPositive ? (
          <ArrowUpRight className="w-4 h-4 text-green-500" />
        ) : (
          <ArrowDownRight className="w-4 h-4 text-red-500" />
        )}
        <span className={`ml-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {change}
        </span>
      </div>
    </div>
  );
}