import React from 'react';
import {
  LayoutDashboard,
  Wallet,
  CreditCard,
  UserCog,
  ArrowDownLeft,
  Settings,
  Users,
  BarChart3,
  Shield,
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: CreditCard, label: 'Wallet', path: '/wallet' },
  { icon: Wallet, label: 'Transactions', path: '/transactions' },
  { icon: ArrowDownLeft, label: 'Withdrawals', path: '/withdrawals' },
  { icon: Users, label: 'Users', path: '/users' },
  { icon: Settings, label: 'Settings', path: '/settings' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: UserCog, label: 'Sub-Admins', path: '/sub-admins' },
];

export default function Sidebar() {
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
          <Wallet className="w-6 h-6" />
          CryptoAdmin
        </h1>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <a
            key={item.path}
            href={item.path}
            className="flex items-center gap-3 px-6 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
}