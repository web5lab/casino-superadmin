import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';


export function UserModal({ isOpen, onClose, onSubmit, user, mode }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'PANEL_ADMIN'
  });

  useEffect(() => {
    if (user && mode === 'edit') {
      setFormData(user);
    }
  }, [user, mode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">
            {mode === 'create' ? 'Add New User' : 'Edit User'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-2">Name</label>
            <input
              type="text"
              required
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Enter user's name"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Email</label>
            <input
              type="email"
              required
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Role</label>
            <select
              required
              value={formData.role || 'PANEL_ADMIN'}
              onChange={(e) => setFormData({ ...formData, role: e.target.value  })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="PANEL_ADMIN">Panel Admin</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>
          </div>

          {mode === 'create' && (
            <div>
              <label className="block text-gray-400 mb-2">Initial Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Enter initial password"
              />
              <p className="mt-1 text-sm text-gray-400">
                User will be prompted to change password on first login
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-blue-400 to-white 400 text-white rounded-lg hover:from-blue-500 hover:to-white 500 transition-all"
            >
              {mode === 'create' ? 'Create User' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}