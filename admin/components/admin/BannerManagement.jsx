import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2, Eye, Upload, Save, X, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';
import { useContent } from '../../contexts/ContentContext';

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
    is_active: true,
    start_date: '',
    end_date: ''
  });
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewMobileImage, setPreviewMobileImage] = useState(null);
  const fileInputRef = useRef(null);
  const mobileFileInputRef = useRef(null);
  const { toast } = useToast();
  const { apiUrl } = useContent();

  const getUploadBaseUrl = () => {
    if (typeof window !== 'undefined') {
      const protocol = window.location.protocol;
      const hostname = window.location.hostname;
      if (hostname.includes('dentodentdentalclinic.com')) {
        return `${protocol}//api.dentodentdentalclinic.com`;
      }
    }
    return apiUrl;
  };

  const fetchWithRefresh = async (url, options = {}) => {
    const token = localStorage.getItem('admin_token');
    const refreshToken = localStorage.getItem('admin_refresh_token');

    const isFormData =
      options &&
      options.body &&
      typeof FormData !== 'undefined' &&
      options.body instanceof FormData;

    const baseHeaders = {
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : undefined,
    };

    if (!isFormData && !baseHeaders['Content-Type']) {
      baseHeaders['Content-Type'] = 'application/json';
    }

    const opts = {
      ...options,
      headers: baseHeaders,
    };

    let res = await fetch(url, opts);

    if ((res.status === 401 || res.status === 403) && refreshToken) {
      const r = await fetch(`${apiUrl}/api/token/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (r.ok) {
        const data = await r.json();
        if (data.token) {
          localStorage.setItem('admin_token', data.token);
          const retryOpts = {
            ...opts,
            headers: {
              ...(opts.headers || {}),
              Authorization: `Bearer ${data.token}`,
            },
          };
          res = await fetch(url, retryOpts);
        }
      }
    }

    return res;
  };

  const fetchBanners = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetchWithRefresh(`${apiUrl}/api/banners`);
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Failed to load banners (${response.status})`);
      }
      const data = await response.json();
      setBanners(data);
    } catch (e) {
      setError(e.message);
      toast({
        title: "Error",
        description: `Failed to load banners: ${e.message}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, [apiUrl]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle image upload for desktop banner
  const handleImageUpload = async (e, isMobile = false) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('title', file.name);
      formDataUpload.append('category', 'banners');

      const response = await fetchWithRefresh(`${apiUrl}/api/upload/media`, {
        method: 'POST',
        body: formDataUpload
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Failed to upload file (${response.status})`);
      }

      const data = await response.json();

      const media =
        data.media ||
        data.image ||
        data;

      const fileUrl =
        media?.file_path ||
        media?.url ||
        media?.path ||
        '';

      if (isMobile) {
        setFormData(prev => ({ ...prev, mobile_image_url: fileUrl }));
        setPreviewMobileImage(URL.createObjectURL(file));
      } else {
        setFormData(prev => ({ ...prev, image_url: fileUrl }));
        setPreviewImage(URL.createObjectURL(file));
      }

      toast({ title: "Success", description: "Image uploaded successfully!" });
    } catch (e) {
      setError(e.message);
      toast({
        title: "Error",
        description: `Failed to upload image: ${e.message}`,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      // Reset file input
      if (isMobile && mobileFileInputRef.current) {
        mobileFileInputRef.current.value = '';
      } else if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingBanner ? 'PUT' : 'POST';
      const url = editingBanner 
        ? `${apiUrl}/api/banners/${editingBanner.id}` 
        : `${apiUrl}/api/banners`;
      
      const response = await fetchWithRefresh(url, {
        method,
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Failed to save banner (${response.status})`);
      }

      const data = await response.json();
      if (editingBanner) {
        setBanners(prev => prev.map(b => b.id === editingBanner.id ? (data.banner || data) : b));
        toast({ title: "Success", description: "Banner updated successfully!" });
      } else {
        setBanners(prev => [...prev, (data.banner || data)]);
        toast({ title: "Success", description: "Banner created successfully!" });
      }

      resetForm();
    } catch (e) {
      toast({
        title: "Error",
        description: `Failed to save banner: ${e.message}`,
        variant: "destructive"
      });
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
      is_active: banner.is_active !== undefined ? banner.is_active : true,
      start_date: banner.start_date || '',
      end_date: banner.end_date || ''
    });
    // Set previews if URLs exist
    if (banner.image_url) {
      setPreviewImage(banner.image_url);
    }
    if (banner.mobile_image_url) {
      setPreviewMobileImage(banner.mobile_image_url);
    }
    setShowForm(true);
  };

  const handleDelete = async (bannerId) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;
    
    try {
      const response = await fetchWithRefresh(`${apiUrl}/api/banners/${bannerId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Failed to delete banner (${response.status})`);
      }

      setBanners(prev => prev.filter(b => b.id !== bannerId));
      toast({ title: "Success", description: "Banner deleted successfully!" });
    } catch (e) {
      toast({
        title: "Error",
        description: `Failed to delete banner: ${e.message}`,
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
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
      is_active: true,
      start_date: '',
      end_date: ''
    });
    setPreviewImage(null);
    setPreviewMobileImage(null);
    setShowForm(false);
    // Reset file inputs
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (mobileFileInputRef.current) mobileFileInputRef.current.value = '';
  };

  const previewBanner = (banner) => {
    window.open(banner.link_url || '#', '_blank');
  };

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (previewImage && previewImage.startsWith('blob:')) {
        URL.revokeObjectURL(previewImage);
      }
      if (previewMobileImage && previewMobileImage.startsWith('blob:')) {
        URL.revokeObjectURL(previewMobileImage);
      }
    };
  }, [previewImage, previewMobileImage]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Banner Management</h1>
          <p className="text-gray-600 mt-1">Manage website banners and their positioning</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add New Banner</span>
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
              {editingBanner ? 'Edit Banner' : 'Add New Banner'}
            </h2>
            <Button variant="ghost" onClick={resetForm} className="p-2">
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
                  <input
                    type="text"
                    name="link_url"
                    value={formData.link_url}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
                  <input
                    type="text"
                    name="alt_text"
                    value={formData.alt_text}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                    <select
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="dd-mm-yyyy"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="dd-mm-yyyy"
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
              </div>
              
              <div className="space-y-6">
                {/* Desktop Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Desktop Banner Image</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    {previewImage ? (
                      <div className="relative">
                        <img 
                          src={previewImage} 
                          alt="Preview" 
                          className="w-full h-48 object-contain rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewImage(null);
                            setFormData(prev => ({ ...prev, image_url: '' }));
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="flex items-center space-x-2"
                          >
                            {uploading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Uploading...</span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-4 h-4" />
                                <span>Upload Image</span>
                              </>
                            )}
                          </Button>
                          <p className="mt-2 text-xs text-gray-500">
                            Supports JPG, PNG, WEBP, GIF, Videos. Max file size 10MB.
                          </p>
                        </div>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,image/webp,image/gif,video/*,.webp"
                      onChange={(e) => handleImageUpload(e, false)}
                      className="hidden"
                    />
                  </div>
                  {formData.image_url && (
                    <input
                      type="text"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleInputChange}
                      placeholder="Or enter image URL"
                      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  )}
                </div>
                
                {/* Mobile Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Banner Image (Optional)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    {previewMobileImage ? (
                      <div className="relative">
                        <img 
                          src={previewMobileImage} 
                          alt="Mobile Preview" 
                          className="w-full h-48 object-contain rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewMobileImage(null);
                            setFormData(prev => ({ ...prev, mobile_image_url: '' }));
                            if (mobileFileInputRef.current) mobileFileInputRef.current.value = '';
                          }}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => mobileFileInputRef.current?.click()}
                            disabled={uploading}
                            className="flex items-center space-x-2"
                          >
                            {uploading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Uploading...</span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-4 h-4" />
                                <span>Upload Mobile Image</span>
                              </>
                            )}
                          </Button>
                          <p className="mt-2 text-xs text-gray-500">
                            Supports JPG, PNG, WEBP, GIF, Videos. Max file size 10MB.
                          </p>
                        </div>
                      </div>
                    )}
                    <input
                      ref={mobileFileInputRef}
                      type="file"
                      accept="image/*,image/webp,image/gif,video/*,.webp"
                      onChange={(e) => handleImageUpload(e, true)}
                      className="hidden"
                    />
                  </div>
                  {formData.mobile_image_url && (
                    <input
                      type="text"
                      name="mobile_image_url"
                      value={formData.mobile_image_url}
                      onChange={handleInputChange}
                      placeholder="Or enter mobile image URL"
                      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 pt-4">
              <Button type="submit" className="flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>{editingBanner ? 'Update Banner' : 'Create Banner'}</span>
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
          <h2 className="text-lg font-semibold text-gray-900">Existing Banners</h2>
        </div>
        
        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading banners...</p>
          </div>
        ) : banners.length === 0 ? (
          <div className="p-6 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto" />
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
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
                          {banner.image_url ? (
                            <img src={banner.image_url} alt={banner.alt_text} className="h-10 w-10 rounded-md object-cover" />
                          ) : (
                            <Upload className="h-5 w-5 text-gray-400" />
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
