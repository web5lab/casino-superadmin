import React, { useState } from 'react';
import { UserPlus, Shield, X, Edit2 } from 'lucide-react';

const subAdmins = [
  {
    id: 'SA1',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    role: 'Finance Manager',
    permissions: ['transactions', 'withdrawals', 'analytics'],
    status: 'active',
    lastLogin: '2024-03-15 10:30',
  },
  {
    id: 'SA2',
    name: 'Mike Brown',
    email: 'mike@example.com',
    role: 'Compliance Officer',
    permissions: ['users', 'compliance'],
    status: 'active',
    lastLogin: '2024-03-15 09:45',
  },
];

export default function SubAdminsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    role: '',
    permissions: [] ,
  });

  const availablePermissions = [
    { value: 'transactions', label: 'Transactions' },
    { value: 'users', label: 'Users' },
    { value: 'withdrawals', label: 'Withdrawals' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'compliance', label: 'Compliance' },
    { value: 'settings', label: 'Settings' },
  ];

  const handleEdit = (admin) => {
    setSelectedAdmin(admin);
    setNewAdmin({
      name: admin.name,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions,
    });
    setIsEditModalOpen(true);
  };

  const handlePermissionToggle = (permission) => {
    setNewAdmin(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to update the sub-admin
    console.log('Updating sub-admin:', { id: selectedAdmin?.id, ...newAdmin });
    setIsEditModalOpen(false);
    setSelectedAdmin(null);
    setNewAdmin({
      name: '', email: '', role: '', permissions: []
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to create the sub-admin
    console.log('Creating new sub-admin:', newAdmin);
    setIsAddModalOpen(false);
    setNewAdmin({ name: '', email: '', role: '', permissions: [] });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Sub-Admins</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <UserPlus className="w-4 h-4" />
          Add Sub-Admin
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="px-6 py-3 text-gray-500 font-medium">Name</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Email</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Role</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Permissions</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Status</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Last Login</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subAdmins.map((admin) => (
                <tr key={admin.id} className="border-b border-gray-100">
                  <td className="px-6 py-4">{admin.name}</td>
                  <td className="px-6 py-4">{admin.email}</td>
                  <td className="px-6 py-4">{admin.role}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {admin.permissions.map((permission) => (
                        <span
                          key={permission}
                          className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                        >
                          {permission}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        admin.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {admin.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{admin.lastLogin}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(admin)}
                        className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit2 className="w-4 h-4 inline-block mr-1" />
                        Edit
                      </button>
                      <button className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded">
                        Deactivate
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Add New Sub-Admin</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  value={newAdmin.role}
                  onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permissions
                </label>
                <div className="space-y-2">
                  {availablePermissions.map((permission) => (
                    <label key={permission.value} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="rounded text-blue-600"
                        checked={newAdmin.permissions.includes(permission.value)}
                        onChange={() => handlePermissionToggle(permission.value)}
                      />
                      <span className="text-sm text-gray-700">{permission.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Sub-Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Edit Sub-Admin</h2>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedAdmin(null);
                  setNewAdmin({ name: '', email: '', role: '', permissions: [] });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  value={newAdmin.role}
                  onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permissions
                </label>
                <div className="space-y-2">
                  {availablePermissions.map((permission) => (
                    <label key={permission.value} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="rounded text-blue-600"
                        checked={newAdmin.permissions.includes(permission.value)}
                        onChange={() => handlePermissionToggle(permission.value)}
                      />
                      <span className="text-sm text-gray-700">{permission.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedAdmin(null);
                    setNewAdmin({ name: '', email: '', role: '', permissions: [] });
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}