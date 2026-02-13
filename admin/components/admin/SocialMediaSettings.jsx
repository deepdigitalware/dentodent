import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Save, Link, Image, Globe, Facebook, Twitter, Instagram, Linkedin, Youtube, MessageCircle, Upload, X } from 'lucide-react';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';
import { useContent } from '../../contexts/ContentContext';

const SocialMediaSettings = () => {
  const { content, updateContent, apiUrl } = useContent();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [localSettings, setLocalSettings] = useState({
    site: {
      logo: '',
      favicon: '',
      name: 'Dent O Dent Dental Clinic',
      description: 'Premier dental clinic in Kolkata'
    },
    social: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
      youtube: '',
      whatsapp: ''
    }
  });
  const logoFileRef = useRef(null);
  const faviconFileRef = useRef(null);
  const [uploading, setUploading] = useState({ logo: false, favicon: false });

  useEffect(() => {
    // Initialize with existing content or defaults
    const siteSettings = content.site || {};
    const socialSettings = content.social || {};
    
    setLocalSettings({
      site: {
        logo: siteSettings.logo || '',
        favicon: siteSettings.favicon || '',
        name: siteSettings.name || 'Dent O Dent Dental Clinic',
        description: siteSettings.description || 'Premier dental clinic in Kolkata'
      },
      social: {
        facebook: socialSettings.facebook || '',
        twitter: socialSettings.twitter || '',
        instagram: socialSettings.instagram || '',
        linkedin: socialSettings.linkedin || '',
        youtube: socialSettings.youtube || '',
        whatsapp: socialSettings.whatsapp || ''
      }
    });
  }, [content]);

  const fetchWithRefresh = async (url, options = {}) => {
    const token = localStorage.getItem('admin_token');
    const refreshToken = localStorage.getItem('admin_refresh_token');
    const opts = {
      ...options,
      headers: {
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

  const handleFileUpload = async (file, type) => {
    if (!file) return;
    
    setUploading(prev => ({ ...prev, [type]: true }));
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', `${type} upload`);
      formData.append('category', 'branding');
      
      const response = await fetchWithRefresh(`${apiUrl}/api/upload/media`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Failed to upload ${type}`);
      }
      
      const data = await response.json();
      const fileUrl = data.media?.file_path || data.media?.url || '';
      
      if (fileUrl) {
        setLocalSettings(prev => ({
          ...prev,
          site: {
            ...prev.site,
            [type]: fileUrl
          }
        }));
        toast({
          title: "Success",
          description: `${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully!`
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to upload ${type}: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleSave = async () => {
    try {
      // Save site settings
      const siteResult = await updateContent('site', localSettings.site);
      // Save social settings
      const socialResult = await updateContent('social', localSettings.social);
      
      if (siteResult?.success && socialResult?.success) {
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Settings saved successfully!",
        });
      } else {
        const errorMessage = siteResult?.error || socialResult?.error || 'Failed to save settings';
        throw new Error(errorMessage);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to save settings: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (section, field, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleRemoveImage = (type) => {
    setLocalSettings(prev => ({
      ...prev,
      site: {
        ...prev.site,
        [type]: ''
      }
    }));
  };

  return (
    <div className="w-full max-w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Social Media & Branding Settings</h2>
        <div className="flex space-x-2">
          <Button 
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? "outline" : "default"}
          >
            {isEditing ? 'Cancel' : 'Edit Settings'}
          </Button>
          {isEditing && (
            <Button 
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Logo & Favicon Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <div className="flex items-center mb-4">
            <Image className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold">Branding</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={localSettings.site.logo}
                    onChange={(e) => handleInputChange('site', 'logo', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/logo.png"
                  />
                  <div className="flex space-x-2">
                    <Button 
                      type="button"
                      onClick={() => logoFileRef.current?.click()}
                      disabled={uploading.logo}
                      variant="outline"
                      className="flex items-center space-x-1"
                    >
                      {uploading.logo ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      <span>Upload Logo</span>
                    </Button>
                    <input
                      ref={logoFileRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e.target.files[0], 'logo')}
                      className="hidden"
                    />
                    {localSettings.site.logo && (
                      <Button 
                        type="button"
                        onClick={() => handleRemoveImage('logo')}
                        variant="outline"
                        className="flex items-center space-x-1 text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                        <span>Remove</span>
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <input
                  type="text"
                  value={localSettings.site.logo}
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                  placeholder="Logo URL"
                />
              )}
              {localSettings.site.logo && (
                <div className="mt-2">
                  <img 
                    src={localSettings.site.logo} 
                    alt="Logo Preview" 
                    className="h-16 max-w-xs object-contain border rounded"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRTRFNkY3Ii8+CjxwYXRoIGQ9Ik0yNS41IDE4SDM4LjVDMzkuMDUyMyAxOCAzOS41IDE4LjQ0NzcgMzkuNSAxOUwyMC41IDQ1QzE5Ljk0NzcgNDUgMTkuNSA0NC41NTIzIDE5LjUgNDRMMjUuNSAxOFoiIHN0cm9rZT0iIzk3OUJBOSIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxwYXRoIGQ9Ik0yNS41IDQ2SDM4LjVDMzkuMDUyMyA0NiAzOS41IDQ1LjU1MjMgMzkuNSA0NUwyMC41IDE5QzE5Ljk0NzcgMTkgMTkuNSAxOS40NDc3IDE5LjUgMjBMMjUuNSA0NloiIHN0cm9rZT0iIzk3OUJBOSIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjwvc3ZnPgo=';
                    }}
                  />
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Favicon</label>
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={localSettings.site.favicon}
                    onChange={(e) => handleInputChange('site', 'favicon', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/favicon.ico"
                  />
                  <div className="flex space-x-2">
                    <Button 
                      type="button"
                      onClick={() => faviconFileRef.current?.click()}
                      disabled={uploading.favicon}
                      variant="outline"
                      className="flex items-center space-x-1"
                    >
                      {uploading.favicon ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      <span>Upload Favicon</span>
                    </Button>
                    <input
                      ref={faviconFileRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e.target.files[0], 'favicon')}
                      className="hidden"
                    />
                    {localSettings.site.favicon && (
                      <Button 
                        type="button"
                        onClick={() => handleRemoveImage('favicon')}
                        variant="outline"
                        className="flex items-center space-x-1 text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                        <span>Remove</span>
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <input
                  type="text"
                  value={localSettings.site.favicon}
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                  placeholder="Favicon URL"
                />
              )}
              {localSettings.site.favicon && (
                <div className="mt-2">
                  <img 
                    src={localSettings.site.favicon} 
                    alt="Favicon Preview" 
                    className="h-8 w-8 object-contain border rounded"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjRTRFNkY3Ii8+CjxwYXRoIGQ9Ik0xMi41IDlIMjEuNUMyMS43NzYxIDkgMjIgOS4yMjM4NiAyMiA5LjVMMTIgMjJDMTEuNzIzOSAyMiAxMS41IDIxLjc3NjEgMTEuNSAyMS41TDEyLjUgOVoiIHN0cm9rZT0iIzk3OUJBOSIgc3Ryb2tlLXdpZHRoPSIxLjUiLz4KPHBhdGggZD0iTTEyLjUgMjNIMjEuNUMyMS43NzYxIDIzIDIyIDIyLjc3NjEgMjIgMjIuNUwxMiA5QzExLjcyMzkgOSAxMS41IDkuMjIzODYgMTEuNSA5LjVMMTIuNSAyM1oiIHN0cm9rZT0iIzk3OUJBOSIgc3Ryb2tlLXdpZHRoPSIxLjUiLz4KPC9zdmc+Cg==';
                    }}
                  />
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
              <input
                type="text"
                value={localSettings.site.name}
                onChange={(e) => handleInputChange('site', 'name', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!isEditing}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Description</label>
              <textarea
                value={localSettings.site.description}
                onChange={(e) => handleInputChange('site', 'description', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                disabled={!isEditing}
              />
            </div>
          </div>
        </motion.div>

        {/* Social Media Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <div className="flex items-center mb-4">
            <Globe className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold">Social Media Links</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Facebook className="w-4 h-4 mr-2 text-blue-600" />
                Facebook URL
              </label>
              <input
                type="text"
                value={localSettings.social.facebook}
                onChange={(e) => handleInputChange('social', 'facebook', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!isEditing}
                placeholder="https://facebook.com/yourpage"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Twitter className="w-4 h-4 mr-2 text-blue-400" />
                Twitter URL
              </label>
              <input
                type="text"
                value={localSettings.social.twitter}
                onChange={(e) => handleInputChange('social', 'twitter', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!isEditing}
                placeholder="https://twitter.com/yourhandle"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Instagram className="w-4 h-4 mr-2 text-pink-500" />
                Instagram URL
              </label>
              <input
                type="text"
                value={localSettings.social.instagram}
                onChange={(e) => handleInputChange('social', 'instagram', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!isEditing}
                placeholder="https://instagram.com/yourhandle"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Linkedin className="w-4 h-4 mr-2 text-blue-700" />
                LinkedIn URL
              </label>
              <input
                type="text"
                value={localSettings.social.linkedin}
                onChange={(e) => handleInputChange('social', 'linkedin', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!isEditing}
                placeholder="https://linkedin.com/company/yourcompany"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Youtube className="w-4 h-4 mr-2 text-red-600" />
                YouTube URL
              </label>
              <input
                type="text"
                value={localSettings.social.youtube}
                onChange={(e) => handleInputChange('social', 'youtube', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!isEditing}
                placeholder="https://youtube.com/yourchannel"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <MessageCircle className="w-4 h-4 mr-2 text-green-500" />
                WhatsApp Number
              </label>
              <input
                type="text"
                value={localSettings.social.whatsapp}
                onChange={(e) => handleInputChange('social', 'whatsapp', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!isEditing}
                placeholder="+1234567890"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SocialMediaSettings;