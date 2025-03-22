import React, { useState, useEffect } from 'react';
import { UserPlus, Shield, X, Edit2, AlertTriangle, Eye, EyeOff, MoreVertical, Search } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { createCasinoSubAdminsApi, getCasinoSubAdmins } from '../store/global.Action';

// Mock data


export default function SubAdminsPage() {
  const initialSubAdmins = useSelector(state => state?.global?.subAdmins?.users)
  const [subAdmins, setSubAdmins] = useState(initialSubAdmins);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const token = useSelector(state => state.global.profile.token)
  const casinoId = useSelector(state => state.global.profile.user.casinoId)
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    permissions: [],
  });
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCasinoSubAdmins({token: token , casinoId:casinoId}))
  }, [])
  

  const availablePermissions = [
    { value: 'transactions', label: 'Transactions', description: 'View and manage all transactions' },
    { value: 'users', label: 'Users', description: 'Access user management' },
    { value: 'withdrawals', label: 'Withdrawals', description: 'Approve withdrawal requests' },
    { value: 'settings', label: 'Settings', description: 'Modify system settings' },
  ];

  // Filter sub-admins based on search term
  const filteredSubAdmins = subAdmins?.filter(admin => 
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validateForm = () => {
    const errors = {};
    if (!newAdmin.name.trim()) errors.name = "Required";
    if (!newAdmin.email.trim()) errors.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(newAdmin.email)) errors.email = "Invalid email";
    
    if (!isEditModalOpen) {
      if (!newAdmin.password) errors.password = "Required";
      else if (newAdmin.password.length < 8) errors.password = "Min 8 characters";
      if (newAdmin.password !== newAdmin.confirmPassword) errors.confirmPassword = "Passwords don't match";
    }
    
    if (newAdmin.permissions.length === 0) errors.permissions = "Select at least one";
    return errors;
  };

  const resetForm = () => {
    setNewAdmin({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      permissions: [],
    });
    setFormErrors({});
    setShowPassword(false);
  };

  const handleEdit = (admin) => {
    setSelectedAdmin(admin);
    setNewAdmin({
      name: admin.name,
      email: admin.email,
      password: '',
      confirmPassword: '',
      permissions: admin.permissions,
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  const handlePermissionToggle = (permission) => {
    setNewAdmin(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission],
    }));
    
    if (formErrors.permissions && !newAdmin.permissions.includes(permission)) {
      setFormErrors(prev => ({ ...prev, permissions: undefined }));
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // Mock update in our local state
    const updatedAdmins = subAdmins.map(admin => 
      admin.id === selectedAdmin.id 
        ? { 
            ...admin, 
            name: newAdmin.name, 
            email: newAdmin.email, 
            permissions: newAdmin.permissions,
          } 
        : admin
    );
    
    setSubAdmins(updatedAdmins);
    setIsEditModalOpen(false);
    setSelectedAdmin(null);
    resetForm();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    const newAdminData = {
      name: newAdmin.name,
      email: newAdmin.email,
      password: newAdmin.password, 
      permissions: newAdmin.permissions,
      casinoId:casinoId
    };
    
    dispatch(createCasinoSubAdminsApi({token:token , data:newAdminData}))
    setSubAdmins(prev => [...prev, newAdminData]);
    setIsAddModalOpen(false);
    resetForm();
  };
  
  const handleDeactivate = (adminId) => {
    const updatedAdmins = subAdmins?.map(admin => 
      admin._id === adminId 
        ? { ...admin, isActive: !admin.isActive  } 
        : admin
    );
    
    setSubAdmins(updatedAdmins);
    setActiveDropdown(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveDropdown(null);
    };
    
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  // Toggle dropdown for a specific admin
  const toggleDropdown = (e, adminId) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === adminId ? null : adminId);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium">Sub-Admins</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-4 flex justify-between border-b">
          <div className="relative max-w-xs">
            <Search className="absolute left-2 top-2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              className="pl-8 pr-4 py-1 border rounded-md w-full"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredSubAdmins?.length === 0 ? (
          <div className="p-8 text-center">
            <Shield className="w-8 h-8 mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500">
              {searchTerm ? "No matching sub-admins found" : "No sub-admins found"}
            </p>
          </div>
        ) : (
          <div>
            {/* Desktop view - Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b text-sm">
                    <th className="px-4 py-2 font-medium text-gray-600">Name</th>
                    <th className="px-4 py-2 font-medium text-gray-600">Email</th>
                    <th className="px-4 py-2 font-medium text-gray-600">Permissions</th>
                    <th className="px-4 py-2 font-medium text-gray-600">Status</th>
                    <th className="px-4 py-2 font-medium text-gray-600">Last Login</th>
                    <th className="px-4 py-2 text-right font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubAdmins?.map((admin) => (
                    <tr key={admin.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{admin.name}</td>
                      <td className="px-4 py-3 text-sm">{admin.email}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {admin.permissions.map((permission) => (
                            <span
                              key={permission}
                              className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs"
                            >
                              {permission}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            admin.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {admin.isActive?"active":"inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{admin.updatedAt}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(admin)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeactivate(admin._id)}
                            className={admin.isActive
                              ? 'text-red-600 hover:text-red-800' 
                              : 'text-green-600 hover:text-green-800'}
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile view - Cards */}
            <div className="md:hidden">
              {filteredSubAdmins?.map((admin) => (
                <div key={admin.id} className="p-3 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{admin.name}</h3>
                      <p className="text-xs text-gray-500">{admin.email}</p>
                    </div>
                    <div className="relative">
                      <button
                        onClick={(e) => toggleDropdown(e, admin.id)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>

                      {activeDropdown === admin.id && (
                        <div className="absolute right-0 mt-1 bg-white rounded shadow-md border z-10 w-32">
                          <button
                            onClick={() => handleEdit(admin)}
                            className="flex items-center w-full px-3 py-2 text-xs text-left hover:bg-gray-50"
                          >
                            <Edit2 className="w-3 h-3 mr-2 text-gray-400" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeactivate(admin._id)}
                            className={`flex items-center w-full px-3 py-2 text-xs text-left hover:bg-gray-50 ${
                              admin.status === 'active' ? 'text-red-600' : 'text-green-600'
                            }`}
                          >
                            <AlertTriangle className="w-3 h-3 mr-2" />
                            {admin.status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1">
                    {admin.permissions.map((permission) => (
                      <span
                        key={permission}
                        className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs"
                      >
                        {permission}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-2 flex justify-between text-xs">
                    <span
                      className={`px-2 py-0.5 rounded ${
                        admin.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {admin.status}
                    </span>
                    <span className="text-gray-500">{admin.lastLogin}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Sub-Admin Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-medium">Add New Sub-Admin</h2>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  resetForm();
                }}
                className="text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-3">
              {/* Name Field */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  className={`w-full px-3 py-2 border rounded ${
                    formErrors.name ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Enter name"
                  value={newAdmin.name}
                  onChange={(e) => {
                    setNewAdmin({ ...newAdmin, name: e.target.value });
                    if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
                  }}
                />
                {formErrors.name && <p className="mt-1 text-xs text-red-600">{formErrors.name}</p>}
              </div>
              
              {/* Email Field */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  className={`w-full px-3 py-2 border rounded ${
                    formErrors.email ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="admin@example.com"
                  value={newAdmin.email}
                  onChange={(e) => {
                    setNewAdmin({ ...newAdmin, email: e.target.value });
                    if (formErrors.email) setFormErrors({ ...formErrors, email: undefined });
                  }}
                />
                {formErrors.email && <p className="mt-1 text-xs text-red-600">{formErrors.email}</p>}
              </div>
              
              {/* Password Field */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className={`w-full px-3 py-2 border rounded pr-10 ${
                      formErrors.password ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Enter password"
                    value={newAdmin.password}
                    onChange={(e) => {
                      setNewAdmin({ ...newAdmin, password: e.target.value });
                      if (formErrors.password) setFormErrors({ ...formErrors, password: undefined });
                    }}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 px-2 flex items-center text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {formErrors.password && <p className="mt-1 text-xs text-red-600">{formErrors.password}</p>}
              </div>
              
              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">Confirm Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className={`w-full px-3 py-2 border rounded ${
                    formErrors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Confirm password"
                  value={newAdmin.confirmPassword}
                  onChange={(e) => {
                    setNewAdmin({ ...newAdmin, confirmPassword: e.target.value });
                    if (formErrors.confirmPassword) setFormErrors({ ...formErrors, confirmPassword: undefined });
                  }}
                />
                {formErrors.confirmPassword && <p className="mt-1 text-xs text-red-600">{formErrors.confirmPassword}</p>}
              </div>
              
              {/* Permissions Field */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">Permissions</label>
                {formErrors.permissions && <p className="mb-1 text-xs text-red-600">{formErrors.permissions}</p>}
                <div className="border rounded p-2 space-y-1">
                  {availablePermissions.map((permission) => (
                    <label key={permission.value} className="flex items-start gap-2 p-1 hover:bg-gray-50 rounded text-sm">
                      <input
                        type="checkbox"
                        className="mt-0.5"
                        checked={newAdmin.permissions.includes(permission.value)}
                        onChange={() => handlePermissionToggle(permission.value)}
                      />
                      <div>
                        <span className="font-medium">{permission.label}</span>
                        <p className="text-xs text-gray-500">{permission.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    resetForm();
                  }}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-50 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Sub-Admin Modal */}
      {isEditModalOpen && selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-medium">Edit Sub-Admin</h2>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedAdmin(null);
                  resetForm();
                }}
                className="text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-4 space-y-3">
              {/* Name Field */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  className={`w-full px-3 py-2 border rounded ${
                    formErrors.name ? 'border-red-500' : 'border-gray-200'
                  }`}
                  value={newAdmin.name}
                  onChange={(e) => {
                    setNewAdmin({ ...newAdmin, name: e.target.value });
                    if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
                  }}
                />
                {formErrors.name && <p className="mt-1 text-xs text-red-600">{formErrors.name}</p>}
              </div>
              
              {/* Email Field */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  className={`w-full px-3 py-2 border rounded ${
                    formErrors.email ? 'border-red-500' : 'border-gray-200'
                  }`}
                  value={newAdmin.email}
                  onChange={(e) => {
                    setNewAdmin({ ...newAdmin, email: e.target.value });
                    if (formErrors.email) setFormErrors({ ...formErrors, email: undefined });
                  }}
                />
                {formErrors.email && <p className="mt-1 text-xs text-red-600">{formErrors.email}</p>}
              </div>
              
              {/* Reset Password Field (Optional for edit) */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">Reset Password (Optional)</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`w-full px-3 py-2 border rounded pr-10 ${
                      formErrors.password ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Leave blank to keep current"
                    value={newAdmin.password}
                    onChange={(e) => {
                      setNewAdmin({ ...newAdmin, password: e.target.value });
                      if (formErrors.password) setFormErrors({ ...formErrors, password: undefined });
                    }}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 px-2 flex items-center text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {formErrors.password && <p className="mt-1 text-xs text-red-600">{formErrors.password}</p>}
              </div>
              
              {/* Permissions Field */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">Permissions</label>
                {formErrors.permissions && <p className="mb-1 text-xs text-red-600">{formErrors.permissions}</p>}
                <div className="border rounded p-2 space-y-1">
                  {availablePermissions.map((permission) => (
                    <label key={permission.value} className="flex items-start gap-2 p-1 hover:bg-gray-50 rounded text-sm">
                      <input
                        type="checkbox"
                        className="mt-0.5"
                        checked={newAdmin.permissions.includes(permission.value)}
                        onChange={() => handlePermissionToggle(permission.value)}
                      />
                      <div>
                        <span className="font-medium">{permission.label}</span>
                        <p className="text-xs text-gray-500">{permission.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedAdmin(null);
                    resetForm();
                  }}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-50 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}