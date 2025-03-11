import React from 'react';
import { Bell, Settings, User } from 'lucide-react';


export function TopBar({ user }) {
  return (
    <div className="bg-gray-800 text-white p-4 flex justify-between items-center border-b border-gray-700">
      <h1 className="text-xl font-bold bg-gradient-to-r from-blue-300 to-white 300 bg-clip-text text-transparent">
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