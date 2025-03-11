import React from 'react';
import { UserPlus, Search, Shield, AlertCircle } from 'lucide-react';

const users = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    status: 'active',
    kycStatus: 'verified',
    lastLogin: '2024-03-15 14:30',
    totalVolume: '$45,230',
  },
  {
    id: '2',
    name: 'Alice Smith',
    email: 'alice@example.com',
    status: 'active',
    kycStatus: 'pending',
    lastLogin: '2024-03-15 12:45',
    totalVolume: '$12,450',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    status: 'suspended',
    kycStatus: 'rejected',
    lastLogin: '2024-03-14 18:20',
    totalVolume: '$8,760',
  },
];

export default function UsersPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Users</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <UserPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">KYC Pending</p>
              <p className="text-xl font-semibold">23</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Suspicious Activity</p>
              <p className="text-xl font-semibold">5</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full md:w-96 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="px-6 py-3 text-gray-500 font-medium">Name</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Email</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Status</th>
                <th className="px-6 py-3 text-gray-500 font-medium">KYC Status</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Last Login</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Total Volume</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.kycStatus === 'verified'
                          ? 'bg-green-100 text-green-700'
                          : user.kycStatus === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {user.kycStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{user.lastLogin}</td>
                  <td className="px-6 py-4">{user.totalVolume}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}