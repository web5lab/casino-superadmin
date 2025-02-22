import React from 'react';
import { Bell, Settings, User } from 'lucide-react';
import { User as UserType } from '../types/auth';

interface TopBarProps {
  user: UserType;
}

export function TopBar({ user }: TopBarProps) {
  return (
    <div className="bg-gray-800 text-white p-4 flex justify-between items-center border-b border-gray-700">
      <h1 className="text-xl font-bold bg-gradient-to-r from-orange-300 to-green-300 bg-clip-text text-transparent">
        Crypto Admin Panel
      </h1>
      <div className="flex items-center space-x-4">
        <button className="p-2 hover:bg-gray-700 rounded-lg">
          <Bell className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-gray-700 rounded-lg">
          <Settings className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-2">
          <User className="w-5 h-5" />
          <span>{user.name}</span>
        </div>
      </div>
    </div>
  );
}