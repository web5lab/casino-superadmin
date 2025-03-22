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
  Bot,
  LogOut
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logOut } from '../store/global.Slice';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: CreditCard, label: 'Wallet', path: '/wallet' },
  { icon: Wallet, label: 'Deposites', path: '/transactions' },
  { icon: ArrowDownLeft, label: 'Withdrawals', path: '/withdrawals' },
  { icon: Settings, label: 'Settings', path: '/settings' },
  { icon: UserCog, label: 'Sub-Admins', path: '/sub-admins' },
];

export default function Sidebar() {
  const dispatch = useDispatch();
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
          <Bot className="w-6 h-6" />
          Admin Panel
        </h1>
      </div>
      <nav className="mt-6 flex-grow">
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
      <div className="border-t border-gray-200 mt-auto">
        <a
          onClick={() => {
            dispatch(logOut());
          }}
          className="flex items-center gap-3 px-6 py-4 text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </a>
      </div>
    </div>
  );
}