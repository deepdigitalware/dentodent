import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Upload, Save, X, AlertCircle } from 'lucide-react';
import { Button } from '../../ui/button';
import { useToast } from '../../ui/use-toast';
import { useContent } from '../../../contexts/ContentContext';

const BannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    mobile_image_url: '',
    link_url: '',
    alt_text: '',
    position: 'homepage',
    display_order: 0,
    is_active: true
  });
  
  const { toast } = useToast();
  // Attempt to get API_URL if context provides it, otherwise use relative path
  // Since we set up proxy in server.js, relative paths /api/... will work
  
  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/banners');
      if (!response.ok) throw new Error('Failed to fetch banners');
      const data = await response.json();
      setBanners(data);
    } catch (err) {
      console.error('Error fetching banners:', err);
      setError('Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadFormData = new FormData();
    uploadFormData.append('image', file);
    uploadFormData.append('section', 'banners');

    try {
      // Show loading state for upload if possible, or just toast
      toast({ title: 'Uploading...', description: 'Please wait.' });
      
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        headers: headers,
        body: uploadFormData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      // Assuming backend returns { image: { path: '/uploads/filename.jpg', ... } }
      // We need to construct the full URL if it's relative, or store relative path
      // Usually backend returns relative path like '/uploads/...'
      // If we use proxy, '/uploads/...' should work if served by backend
      // But backend usually serves static /uploads. 
      // Let's assume the path returned is usable.
      
      const imagePath = data.image.path;
      setFormData(prev => ({ ...prev, [fieldName]: imagePath }));
      
      toast({ title: 'Success', description: 'Image uploaded successfully' });
    } catch (err) {
      console.error('Upload error:', err);
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingBanner ? `/api/banners/${editingBanner.id}` : '/api/banners';
      const method = editingBanner ? 'PUT' : 'POST';
      
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json'
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save banner');

      toast({ title: 'Success', description: 'Banner saved successfully' });
      setShowForm(false);
      fetchBanners();
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to save banner', variant: 'destructive' });
    }
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      image_url: banner.image_url || '',
      mobile_image_url: banner.mobile_image_url || '',
      link_url: banner.link_url || '',
      alt_text: banner.alt_text || '',
      position: banner.position || 'homepage',
      display_order: banner.display_order || 0,
      is_active: banner.is_active
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      const response = await fetch(`/api/banners/${id}`, {
        method: 'DELETE',
        headers
      });

      if (!response.ok) throw new Error('Failed to delete banner');

      toast({ title: 'Success', description: 'Banner deleted successfully' });
      fetchBanners();
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to delete banner', variant: 'destructive' });
    }
  };
  
  const previewBanner = (banner) => {
      // Implementation for preview
      window.open(banner.image_url, '_blank');
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Banner Management</h2>
        <Button onClick={() => {
          setEditingBanner(null);
          setFormData({
            title: '',
            subtitle: '',
            image_url: '',
            mobile_image_url: '',
            link_url: '',
            alt_text: '',
            position: 'homepage',
            display_order: 0,
            is_active: true
          });
          setShowForm(true);
        }}>
          <Plus className="w-4 h-4 mr-2" /> Add Banner
        </Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">{editingBanner ? 'Edit Banner' : 'New Banner'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                  <input
                    type="text"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="space-y-4 border p-4 rounded-md bg-gray-50">
                  <h4 className="font-medium text-gray-900">Images</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Desktop Image</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            name="image_url"
                            value={formData.image_url}
                            onChange={handleInputChange}
                            placeholder="Image URL or Upload"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <div className="relative">
                            <input
                                type="file"
                                id="desktop-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, 'image_url')}
                            />
                            <label
                                htmlFor="desktop-upload"
                                className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <Upload className="w-4 h-4 mr-2" /> Upload
                            </label>
                        </div>
                    </div>
                    {formData.image_url && (
                        <div className="mt-2">
                            <img src={formData.image_url} alt="Preview" className="h-20 object-contain rounded border" />
                        </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Image (Optional)</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            name="mobile_image_url"
                            value={formData.mobile_image_url}
                            onChange={handleInputChange}
                            placeholder="Mobile Image URL or Upload"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <div className="relative">
                            <input
                                type="file"
                                id="mobile-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, 'mobile_image_url')}
                            />
                            <label
                                htmlFor="mobile-upload"
                                className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <Upload className="w-4 h-4 mr-2" /> Upload
                            </label>
                        </div>
                    </div>
                  </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
                <input
                  type="text"
                  name="link_url"
                  value={formData.link_url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                  <select
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="homepage">Homepage</option>
                    <option value="services">Services</option>
                    <option value="about">About</option>
                    <option value="contact">Contact</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    name="display_order"
                    value={formData.display_order}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center mt-6">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">Active</label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
                <input
                  type="text"
                  name="alt_text"
                  value={formData.alt_text}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" /> Save Banner
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Existing Banners</h2>
        </div>

        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading banners...</p>
          </div>
        ) : banners.length === 0 ? (
          <div className="p-6 text-center">
            {/* Replaced Image icon with simple div as Image component wasn't imported/defined in original file snippet */}
            <div className="w-12 h-12 text-gray-400 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                <Eye className="w-6 h-6" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No banners</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new banner.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Banner</th>   
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th> 
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>   
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>    
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>  
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {banners.map((banner) => (
                  <tr key={banner.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">      
                          {banner.image_url ? (
                            <img src={banner.image_url} alt={banner.alt_text} className="h-10 w-10 object-cover" /> 
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{banner.title}</div>
                          <div className="text-sm text-gray-500">{banner.subtitle}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {banner.position}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        banner.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {banner.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {banner.display_order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => previewBanner(banner)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(banner)}
                          className="text-indigo-600 hover:text-indigo-900 p-1"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(banner.id)}
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

export default BannerManagement;
