import React, { useState } from 'react';
import { User as UserIcon, Shield, UserCheck, X } from 'lucide-react';
import { User, UserRole } from '../../types/auth';
import { UserModal } from '../modals/UserModal';

const mockUsers: (User & { lastActive: string })[] = [
  {
    id: '1',
    email: 'admin@example.com',
    role: 'SUPER_ADMIN',
    name: 'Super Admin',
    lastActive: new Date().toISOString()
  },
  {
    id: '2',
    email: 'panel@example.com',
    role: 'PANEL_ADMIN',
    name: 'Panel Admin',
    lastActive: new Date().toISOString()
  }
];

export function Users() {
  const [users, setUsers] = useState(mockUsers);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const handleAddUser = () => {
    setModalMode('create');
    setSelectedUser(undefined);
    setShowModal(true);
  };

  const handleEditUser = (user: User) => {
    setModalMode('edit');
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDeactivateUser = (userId: string) => {
    // Here you would typically make an API call to deactivate the user
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleUserSubmit = (userData: Partial<User>) => {
    if (modalMode === 'create') {
      const newUser = {
        ...userData,
        id: `user${users.length + 1}`,
        lastActive: new Date().toISOString()
      } as User & { lastActive: string };
      setUsers([...users, newUser]);
    } else {
      setUsers(users.map(user => 
        user.id === selectedUser?.id 
          ? { ...user, ...userData }
          : user
      ));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Users</h1>
        <button 
          onClick={handleAddUser}
          className="px-4 py-2 bg-gradient-to-r from-orange-400 to-green-400 rounded-lg text-white hover:from-orange-500 hover:to-green-500 transition-all flex items-center space-x-2"
        >
          <UserIcon className="w-5 h-5" />
          Add New User
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div key={user.id} className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  {user.role === 'SUPER_ADMIN' ? (
                    <Shield className="w-6 h-6 text-orange-500" />
                  ) : (
                    <UserIcon className="w-6 h-6 text-orange-500" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                user.role === 'SUPER_ADMIN' 
                  ? 'bg-orange-500/20 text-orange-500'
                  : 'bg-green-500/20 text-green-500'
              }`}>
                {user.role.replace('_', ' ')}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Last Active</span>
                <span className="text-white">{new Date(user.lastActive).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Status</span>
                <span className="flex items-center text-green-500">
                  <UserCheck className="w-4 h-4 mr-1" />
                  Active
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700 flex space-x-2">
              <button 
                onClick={() => handleEditUser(user)}
                className="flex-1 px-4 py-2 bg-gray-700 rounded-lg text-white hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
              >
                <UserIcon className="w-4 h-4" />
                Edit User
              </button>
              <button 
                onClick={() => handleDeactivateUser(user.id)}
                className="px-4 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors flex items-center justify-center"
              >
                <X className="w-4 h-4" />
                Deactivate
              </button>
            </div>
          </div>
        ))}
      </div>

      <UserModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleUserSubmit}
        user={selectedUser}
        mode={modalMode}
      />
    </div>
  );
}