import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Upload, Save, X, AlertCircle, Image as ImageIcon, List } from 'lucide-react';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';
import { useContent } from '../../contexts/ContentContext';

const CarouselManagement = () => {
  const [carousels, setCarousels] = useState([]);
  const [carouselItems, setCarouselItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingCarousel, setEditingCarousel] = useState(null);
  const [selectedCarousel, setSelectedCarousel] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    section_type: '',
    title: '',
    subtitle: '',
    is_active: true,
    display_order: 0,
    max_items: 8
  });
  const [itemFormData, setItemFormData] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    mobile_image_url: '',
    link_url: '',
    display_order: 0,
    is_active: true
  });
  const { toast } = useToast();
  const { apiUrl } = useContent();

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

  const fetchCarousels = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetchWithRefresh(`${apiUrl}/api/carousels`);
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Failed to load carousels (${response.status})`);
      }
      const data = await response.json();
      setCarousels(data);
    } catch (e) {
      setError(e.message);
      toast({
        title: "Error",
        description: `Failed to load carousels: ${e.message}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCarouselItems = async (carouselId) => {
    try {
      const response = await fetchWithRefresh(`${apiUrl}/api/carousels/${carouselId}/items`);
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Failed to load carousel items (${response.status})`);
      }
      const data = await response.json();
      setCarouselItems(prev => ({ ...prev, [carouselId]: data }));
    } catch (e) {
      toast({
        title: "Error",
        description: `Failed to load carousel items: ${e.message}`,
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchCarousels();
  }, [apiUrl]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleItemInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setItemFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingCarousel ? 'PUT' : 'POST';
      const url = editingCarousel 
        ? `${apiUrl}/api/carousels/${editingCarousel.id}` 
        : `${apiUrl}/api/carousels`;
      
      const response = await fetchWithRefresh(url, {
        method,
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Failed to save carousel (${response.status})`);
      }

      const data = await response.json();
      if (editingCarousel) {
        setCarousels(prev => prev.map(c => c.id === editingCarousel.id ? data : c));
        toast({ title: "Success", description: "Carousel updated successfully!" });
      } else {
        setCarousels(prev => [...prev, data]);
        toast({ title: "Success", description: "Carousel created successfully!" });
      }

      resetForm();
    } catch (e) {
      toast({
        title: "Error",
        description: `Failed to save carousel: ${e.message}`,
        variant: "destructive"
      });
    }
  };

  const handleItemSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingItem ? 'PUT' : 'POST';
      const url = editingItem 
        ? `${apiUrl}/api/carousels/${selectedCarousel.id}/items/${editingItem.id}` 
        : `${apiUrl}/api/carousels/${selectedCarousel.id}/items`;
      
      const response = await fetchWithRefresh(url, {
        method,
        body: JSON.stringify(itemFormData)
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Failed to save carousel item (${response.status})`);
      }

      const data = await response.json();
      if (editingItem) {
        setCarouselItems(prev => ({
          ...prev,
          [selectedCarousel.id]: prev[selectedCarousel.id].map(item => 
            item.id === editingItem.id ? data : item
          )
        }));
        toast({ title: "Success", description: "Carousel item updated successfully!" });
      } else {
        setCarouselItems(prev => ({
          ...prev,
          [selectedCarousel.id]: [...(prev[selectedCarousel.id] || []), data]
        }));
        toast({ title: "Success", description: "Carousel item created successfully!" });
      }

      resetItemForm();
    } catch (e) {
      toast({
        title: "Error",
        description: `Failed to save carousel item: ${e.message}`,
        variant: "destructive"
      });
    }
  };

  const handleEdit = (carousel) => {
    setEditingCarousel(carousel);
    setFormData({
      name: carousel.name || '',
      section_type: carousel.section_type || '',
      title: carousel.title || '',
      subtitle: carousel.subtitle || '',
      is_active: carousel.is_active !== undefined ? carousel.is_active : true,
      display_order: carousel.display_order || 0,
      max_items: carousel.max_items || 8
    });
    setShowForm(true);
  };

  const handleItemEdit = (item) => {
    setEditingItem(item);
    setItemFormData({
      title: item.title || '',
      subtitle: item.subtitle || '',
      image_url: item.image_url || '',
      mobile_image_url: item.mobile_image_url || '',
      link_url: item.link_url || '',
      display_order: item.display_order || 0,
      is_active: item.is_active !== undefined ? item.is_active : true
    });
    setShowItemForm(true);
  };

  const handleDelete = async (carouselId) => {
    if (!window.confirm('Are you sure you want to delete this carousel?')) return;
    
    try {
      const response = await fetchWithRefresh(`${apiUrl}/api/carousels/${carouselId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Failed to delete carousel (${response.status})`);
      }

      setCarousels(prev => prev.filter(c => c.id !== carouselId));
      // Remove items for this carousel
      setCarouselItems(prev => {
        const newItems = { ...prev };
        delete newItems[carouselId];
        return newItems;
      });
      toast({ title: "Success", description: "Carousel deleted successfully!" });
    } catch (e) {
      toast({
        title: "Error",
        description: `Failed to delete carousel: ${e.message}`,
        variant: "destructive"
      });
    }
  };

  const handleItemDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this carousel item?')) return;
    
    try {
      const response = await fetchWithRefresh(`${apiUrl}/api/carousels/${selectedCarousel.id}/items/${itemId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Failed to delete carousel item (${response.status})`);
      }

      setCarouselItems(prev => ({
        ...prev,
        [selectedCarousel.id]: prev[selectedCarousel.id].filter(item => item.id !== itemId)
      }));
      toast({ title: "Success", description: "Carousel item deleted successfully!" });
    } catch (e) {
      toast({
        title: "Error",
        description: `Failed to delete carousel item: ${e.message}`,
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setEditingCarousel(null);
    setFormData({
      name: '',
      section_type: '',
      title: '',
      subtitle: '',
      is_active: true,
      display_order: 0,
      max_items: 8
    });
    setShowForm(false);
  };

  const resetItemForm = () => {
    setEditingItem(null);
    setItemFormData({
      title: '',
      subtitle: '',
      image_url: '',
      mobile_image_url: '',
      link_url: '',
      display_order: 0,
      is_active: true
    });
    setShowItemForm(false);
  };

  const viewCarouselItems = (carousel) => {
    setSelectedCarousel(carousel);
    if (!carouselItems[carousel.id]) {
      fetchCarouselItems(carousel.id);
    }
  };

  const backToCarousels = () => {
    setSelectedCarousel(null);
    setEditingItem(null);
    setShowItemForm(false);
  };

  if (selectedCarousel) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Carousel Items</h1>
            <p className="text-gray-600 mt-1">Managing items for carousel: {selectedCarousel.name}</p>
          </div>
          <Button onClick={backToCarousels} variant="outline">
            Back to Carousels
          </Button>
        </div>

        {showItemForm && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {editingItem ? 'Edit Carousel Item' : 'Add New Carousel Item'}
              </h2>
              <Button variant="ghost" onClick={resetItemForm} className="p-2">
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <form onSubmit={handleItemSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={itemFormData.title}
                    onChange={handleItemInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                  <input
                    type="text"
                    name="subtitle"
                    value={itemFormData.subtitle}
                    onChange={handleItemInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="text"
                    name="image_url"
                    value={itemFormData.image_url}
                    onChange={handleItemInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Image URL</label>
                  <input
                    type="text"
                    name="mobile_image_url"
                    value={itemFormData.mobile_image_url}
                    onChange={handleItemInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
                  <input
                    type="text"
                    name="link_url"
                    value={itemFormData.link_url}
                    onChange={handleItemInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    name="display_order"
                    value={itemFormData.display_order}
                    onChange={handleItemInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={itemFormData.is_active}
                    onChange={handleItemInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button type="submit" className="flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>{editingItem ? 'Update Item' : 'Create Item'}</span>
                </Button>
                <Button type="button" variant="outline" onClick={resetItemForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Carousel Items</h2>
          <Button onClick={() => setShowItemForm(true)} className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add New Item</span>
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {carouselItems[selectedCarousel.id] ? (
            carouselItems[selectedCarousel.id].length === 0 ? (
              <div className="p-6 text-center">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No carousel items</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new carousel item.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                {carouselItems[selectedCarousel.id].map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-shrink-0 h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.title} className="h-16 w-16 rounded-md object-cover" />
                        ) : (
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleItemEdit(item)}
                          className="text-indigo-600 hover:text-indigo-900 p-1"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleItemDelete(item.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{item.subtitle}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        item.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-xs text-gray-500">Order: {item.display_order}</span>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading carousel items...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Carousel Management</h1>
          <p className="text-gray-600 mt-1">Manage website carousels and their items</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add New Carousel</span>
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
              {editingCarousel ? 'Edit Carousel' : 'Add New Carousel'}
            </h2>
            <Button variant="ghost" onClick={resetForm} className="p-2">
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Type</label>
                <input
                  type="text"
                  name="section_type"
                  value={formData.section_type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                <input
                  type="number"
                  name="display_order"
                  value={formData.display_order}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Items</label>
                <input
                  type="number"
                  name="max_items"
                  value={formData.max_items}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
            
            <div className="flex space-x-3 pt-4">
              <Button type="submit" className="flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>{editingCarousel ? 'Update Carousel' : 'Create Carousel'}</span>
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
          <h2 className="text-lg font-semibold text-gray-900">Existing Carousels</h2>
        </div>
        
        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading carousels...</p>
          </div>
        ) : carousels.length === 0 ? (
          <div className="p-6 text-center">
            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No carousels</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new carousel.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carousel</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {carousels.map((carousel) => (
                  <tr key={carousel.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{carousel.name}</div>
                        <div className="text-sm text-gray-500">{carousel.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {carousel.section_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        carousel.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {carousel.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button 
                        onClick={() => viewCarouselItems(carousel)}
                        className="flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <List className="w-4 h-4 mr-1" />
                        View Items
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {carousel.display_order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => viewCarouselItems(carousel)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View Items"
                        >
                          <List className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(carousel)}
                          className="text-indigo-600 hover:text-indigo-900 p-1"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(carousel.id)}
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

export default CarouselManagement;