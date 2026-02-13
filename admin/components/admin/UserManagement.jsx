import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Save, X, AlertCircle, User, Shield, Activity } from 'lucide-react';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';
import { useContent } from '../../contexts/ContentContext';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingProfile, setViewingProfile] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    role: 'admin',
    first_name: '',
    last_name: '',
    phone: '',
    bio: '',
    role_description: ''
  });
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    bio: '',
    role_description: ''
  });
  const { toast } = useToast();
  const { apiUrl } = useContent();

  const roles = [
    { id: 'admin', name: 'Administrator' },
    { id: 'editor', name: 'Editor' },
    { id: 'staff', name: 'Staff' },
    { id: 'viewer', name: 'Viewer' }
  ];

  const fetchWithRefresh = async (url, options = {}) => {
    const token = localStorage.getItem('admin_token');
    const refreshToken = localStorage.getItem('admin_refresh_token');
    const opts = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    };
    let res = await fetch(url, opts);
    if (res.status === 401 || res.status === 403) {
      if (refreshToken) {
        const r = await fetch(`${apiUrl}/api/token/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });
        if (r.ok) {
          const data = await r.json();
          if (data.token) {
            localStorage.setItem('admin_token', data.token);
            opts.headers.Authorization = `Bearer ${data.token}`;
            res = await fetch(url, opts);
          }
        }
      }
    }
    return res;
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetchWithRefresh(`${apiUrl}/api/users`);
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Failed to load users (${response.status})`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (e) {
      setError(e.message);
      toast({
        title: "Error",
        description: `Failed to load users: ${e.message}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [apiUrl]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // For now, we'll just show a message since user creation would require password handling
      // In a real implementation, this would create a new user
      toast({ 
        title: "Info", 
        description: "User creation would be implemented here with proper security measures." 
      });
      resetForm();
    } catch (e) {
      toast({
        title: "Error",
        description: `Failed to save user: ${e.message}`,
        variant: "destructive"
      });
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetchWithRefresh(`${apiUrl}/api/users/${viewingProfile.id}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Failed to update profile (${response.status})`);
      }

      const data = await response.json();
      // Update user in the list
      setUsers(prev => prev.map(u => 
        u.id === viewingProfile.id 
          ? { ...u, profile: data } 
          : u
      ));
      
      toast({ title: "Success", description: "User profile updated successfully!" });
      setViewingProfile(null);
    } catch (e) {
      toast({
        title: "Error",
        description: `Failed to update profile: ${e.message}`,
        variant: "destructive"
      });
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      email: user.email || '',
      role: user.role || 'admin',
      first_name: user.profile?.first_name || '',
      last_name: user.profile?.last_name || '',
      phone: user.profile?.phone || '',
      bio: user.profile?.bio || '',
      role_description: user.profile?.role_description || ''
    });
    setShowForm(true);
  };

  const handleViewProfile = (user) => {
    setViewingProfile(user);
    setProfileData({
      first_name: user.profile?.first_name || '',
      last_name: user.profile?.last_name || '',
      phone: user.profile?.phone || '',
      bio: user.profile?.bio || '',
      role_description: user.profile?.role_description || ''
    });
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      // In a real implementation, this would delete the user
      // For now, we'll just show a message
      toast({ 
        title: "Info", 
        description: "User deletion would be implemented with proper security measures." 
      });
    } catch (e) {
      toast({
        title: "Error",
        description: `Failed to delete user: ${e.message}`,
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setEditingUser(null);
    setFormData({
      email: '',
      role: 'admin',
      first_name: '',
      last_name: '',
      phone: '',
      bio: '',
      role_description: ''
    });
    setShowForm(false);
  };

  const getRoleName = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : roleId;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage website users and their permissions</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add New User</span>
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h2>
            <Button variant="ghost" onClick={resetForm} className="p-2">
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={!!editingUser}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role Description</label>
              <input
                type="text"
                name="role_description"
                value={formData.role_description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex space-x-3 pt-4">
              <Button type="submit" className="flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>{editingUser ? 'Update User' : 'Create User'}</span>
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {viewingProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">User Profile</h3>
              <button 
                onClick={() => setViewingProfile(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleProfileSubmit} className="p-6 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-gray-500" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900">
                    {viewingProfile.profile?.first_name} {viewingProfile.profile?.last_name}
                  </h4>
                  <p className="text-gray-500">{viewingProfile.email}</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {getRoleName(viewingProfile.role)}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={profileData.first_name}
                  onChange={handleProfileInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={profileData.last_name}
                  onChange={handleProfileInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleProfileInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role Description</label>
                <input
                  type="text"
                  name="role_description"
                  value={profileData.role_description}
                  onChange={handleProfileInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button type="submit" className="flex-1">
                  Update Profile
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setViewingProfile(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Existing Users</h2>
        </div>
        
        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-6 text-center">
            <User className="w-12 h-12 text-gray-400 mx-auto" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new user.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.profile?.first_name} {user.profile?.last_name}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getRoleName(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewProfile(user)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-indigo-600 hover:text-indigo-900 p-1"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;