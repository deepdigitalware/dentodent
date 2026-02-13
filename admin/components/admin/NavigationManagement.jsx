import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, AlertCircle, Menu, Move, Eye } from 'lucide-react';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';
import { useContent } from '../../contexts/ContentContext';

const NavigationManagement = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [formData, setFormData] = useState({
    menu_name: '',
    menu_type: 'main',
    is_active: true,
    items: []
  });
  const [newItem, setNewItem] = useState({ text: '', url: '', target: '_self' });
  const { toast } = useToast();
  const { apiUrl } = useContent();

  const menuTypes = [
    { id: 'main', name: 'Main Navigation' },
    { id: 'footer', name: 'Footer Navigation' },
    { id: 'mobile', name: 'Mobile Navigation' },
    { id: 'secondary', name: 'Secondary Navigation' }
  ];

  const targets = [
    { id: '_self', name: 'Same Window' },
    { id: '_blank', name: 'New Window' }
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

  const fetchMenus = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetchWithRefresh(`${apiUrl}/api/navigation`);
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Failed to load menus (${response.status})`);
      }
      const data = await response.json();
      setMenus(data);
    } catch (e) {
      setError(e.message);
      toast({
        title: "Error",
        description: `Failed to load menus: ${e.message}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, [apiUrl]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNewItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addItem = () => {
    if (!newItem.text || !newItem.url) {
      toast({
        title: "Error",
        description: "Please enter both text and URL for the menu item",
        variant: "destructive"
      });
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { ...newItem, id: Date.now() }]
    }));
    setNewItem({ text: '', url: '', target: '_self' });
  };

  const removeItem = (itemId) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  const moveItem = (itemId, direction) => {
    setFormData(prev => {
      const items = [...prev.items];
      const index = items.findIndex(item => item.id === itemId);
      if (index === -1) return prev;
      
      if (direction === 'up' && index > 0) {
        [items[index], items[index - 1]] = [items[index - 1], items[index]];
      } else if (direction === 'down' && index < items.length - 1) {
        [items[index], items[index + 1]] = [items[index + 1], items[index]];
      }
      
      return { ...prev, items };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingMenu ? 'PUT' : 'POST';
      const url = editingMenu 
        ? `${apiUrl}/api/navigation/${editingMenu.id}` 
        : `${apiUrl}/api/navigation`;
      
      // Prepare data for submission (remove temporary IDs)
      const submitData = {
        ...formData,
        items: formData.items.map(item => {
          const { id, ...rest } = item;
          return rest;
        })
      };
      
      const response = await fetchWithRefresh(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Failed to save menu (${response.status})`);
      }

      const data = await response.json();
      if (editingMenu) {
        setMenus(prev => prev.map(m => m.id === editingMenu.id ? data : m));
        toast({ title: "Success", description: "Menu updated successfully!" });
      } else {
        setMenus(prev => [...prev, data]);
        toast({ title: "Success", description: "Menu created successfully!" });
      }

      resetForm();
    } catch (e) {
      toast({
        title: "Error",
        description: `Failed to save menu: ${e.message}`,
        variant: "destructive"
      });
    }
  };

  const handleEdit = (menu) => {
    setEditingMenu(menu);
    setFormData({
      menu_name: menu.menu_name || '',
      menu_type: menu.menu_type || 'main',
      is_active: menu.is_active !== undefined ? menu.is_active : true,
      items: menu.items || []
    });
    setShowForm(true);
  };

  const handleDelete = async (menuId) => {
    if (!window.confirm('Are you sure you want to delete this menu?')) return;
    
    try {
      const response = await fetchWithRefresh(`${apiUrl}/api/navigation/${menuId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Failed to delete menu (${response.status})`);
      }

      setMenus(prev => prev.filter(m => m.id !== menuId));
      toast({ title: "Success", description: "Menu deleted successfully!" });
    } catch (e) {
      toast({
        title: "Error",
        description: `Failed to delete menu: ${e.message}`,
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setEditingMenu(null);
    setFormData({
      menu_name: '',
      menu_type: 'main',
      is_active: true,
      items: []
    });
    setNewItem({ text: '', url: '', target: '_self' });
    setShowForm(false);
  };

  const previewMenu = (menu) => {
    // In a real implementation, this would show a preview of the menu
    toast({ title: "Info", description: "Menu preview would be shown here." });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Navigation Management</h1>
          <p className="text-gray-600 mt-1">Manage website navigation menus</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add New Menu</span>
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
              {editingMenu ? 'Edit Menu' : 'Add New Menu'}
            </h2>
            <Button variant="ghost" onClick={resetForm} className="p-2">
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Menu Name</label>
                <input
                  type="text"
                  name="menu_name"
                  value={formData.menu_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Menu Type</label>
                <select
                  name="menu_type"
                  value={formData.menu_type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {menuTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Active</span>
              </label>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Menu Items</label>
                <span className="text-sm text-gray-500">{formData.items.length} items</span>
              </div>
              
              <div className="space-y-3 mb-4">
                {formData.items.map((item, index) => (
                  <div key={item.id} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <button
                      type="button"
                      onClick={() => moveItem(item.id, 'up')}
                      disabled={index === 0}
                      className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                    >
                      <Move className="w-4 h-4" />
                    </button>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={item.text}
                        readOnly
                        className="px-2 py-1 border border-gray-300 rounded text-sm bg-white"
                      />
                      <input
                        type="text"
                        value={item.url}
                        readOnly
                        className="px-2 py-1 border border-gray-300 rounded text-sm bg-white"
                      />
                      <select
                        value={item.target}
                        readOnly
                        className="px-2 py-1 border border-gray-300 rounded text-sm bg-white"
                      >
                        {targets.map(target => (
                          <option key={target.id} value={target.id}>{target.name}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() => moveItem(item.id, 'down')}
                      disabled={index === formData.items.length - 1}
                      className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                    >
                      <Move className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <input
                  type="text"
                  name="text"
                  placeholder="Link text"
                  value={newItem.text}
                  onChange={handleNewItemChange}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="url"
                  placeholder="URL"
                  value={newItem.url}
                  onChange={handleNewItemChange}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  name="target"
                  value={newItem.target}
                  onChange={handleNewItemChange}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {targets.map(target => (
                    <option key={target.id} value={target.id}>{target.name}</option>
                  ))}
                </select>
                <Button type="button" onClick={addItem} className="flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                  <span className="ml-1">Add</span>
                </Button>
              </div>
            </div>
            
            <div className="flex space-x-3 pt-4">
              <Button type="submit" className="flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>{editingMenu ? 'Update Menu' : 'Create Menu'}</span>
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Existing Menus</h2>
        </div>
        
        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading menus...</p>
          </div>
        ) : menus.length === 0 ? (
          <div className="p-6 text-center">
            <Menu className="w-12 h-12 text-gray-400 mx-auto" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No menus</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new menu.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Menu</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {menus.map((menu) => (
                  <tr key={menu.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{menu.menu_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {menuTypes.find(t => t.id === menu.menu_type)?.name || menu.menu_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {menu.items?.length || 0} items
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        menu.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {menu.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => previewMenu(menu)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(menu)}
                          className="text-indigo-600 hover:text-indigo-900 p-1"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(menu.id)}
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

export default NavigationManagement;