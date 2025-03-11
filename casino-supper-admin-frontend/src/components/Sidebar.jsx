import React, { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  Coins,
  Building2, 
  Users, 
  Settings,
  History,
  LogOut
} from 'lucide-react';



export function Sidebar({ currentUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = useMemo(() => [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Wallet, label: 'Transactions', path: '/transactions' },
    { icon: Coins, label: 'Currencies', path: '/currencies' },
    { icon: Building2, label: 'Casinos', path: '/casinos' },
    ...(currentUser.role === 'SUPER_ADMIN' ? [{ icon: Users, label: 'Users', path: '/users' }] : []),
    { icon: History, label: 'History', path: '/history' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ], [currentUser.role]);

  return (
    <div className="w-64 bg-gray-800 min-h-screen text-white p-4">
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${
              isActive 
                ? 'bg-gray-700 text-blue-300' 
                : 'hover:bg-gray-700/50'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
          );
        })}
      </nav>
      <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-red-600/20 text-red-400 mt-8">
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </button>
    </div>
  );
}