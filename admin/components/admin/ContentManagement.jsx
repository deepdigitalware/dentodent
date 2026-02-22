import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Save, Edit3, Eye, Upload, X, Plus, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { useContent } from '@/contexts/ContentContext';
import ImagePicker from './ImagePicker';

const ContentManagement = ({ initialTab = 'hero', hideNavigation = false }) => {
  const { content, updateContent } = useContent();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isEditing, setIsEditing] = useState(false);
  const [localContent, setLocalContent] = useState({});

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const [editingContent, setEditingContent] = useState({});

  useEffect(() => {
    // Initialize localContent with content from context
    setLocalContent(content);
    
    // For blogPosts, we need to handle it as a special case since it's an array
    if (activeTab === 'blogPosts') {
      setEditingContent(content[activeTab] || []);
    } else {
      setEditingContent(content[activeTab] || {});
    }
  }, [activeTab, content]);

  const tabs = [
    { id: 'header', label: 'Header & Navigation', icon: '🔝' },
    { id: 'hero', label: 'Hero Section', icon: '🏠' },
    { id: 'about', label: 'About Us', icon: 'ℹ️' },
    { id: 'services', label: 'Services', icon: '🛠️' },
    { id: 'treatments', label: 'Treatments', icon: '🧪' },
    { id: 'reviews', label: 'Reviews', icon: '⭐' },
    { id: 'map', label: 'Map & Location', icon: '🗺️' },
    { id: 'doctor', label: 'Doctor Profile', icon: '👨‍⚕️' },
    { id: 'testimonials', label: 'Testimonials', icon: '💬' },
    { id: 'gallery', label: 'Gallery', icon: '🖼️' },
    { id: 'blog', label: 'Blog Header', icon: '📝' },
    { id: 'blogPosts', label: 'Blog Posts', icon: '📰' },
    { id: 'faq', label: 'FAQ', icon: '❓' },
    { id: 'privacyPolicy', label: 'Privacy Policy', icon: '🔒' },
    { id: 'termsOfService', label: 'Terms of Service', icon: '⚖️' },
    { id: 'contact', label: 'Contact', icon: '📞' },
    { id: 'footer', label: 'Footer', icon: '🔻' },
    { id: 'appointment', label: 'Appointment Booking', icon: '📅' },
    { id: 'slider', label: 'Slider & Banners', icon: '🖼️' },
    { id: 'cta', label: 'Call to Action', icon: '📢' },
    { id: 'patient', label: 'Patient Portal', icon: '👤' }
  ];

  // Helper to render navigation if not hidden
  const renderNavigation = () => {
    if (hideNavigation) return null;
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 overflow-x-auto">
        <div className="flex space-x-2 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="font-medium whitespace-nowrap">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const handleSave = () => {
    // For blogPosts, we need to handle it as a special case
    if (activeTab === 'blogPosts') {
      updateContent(activeTab, editingContent);
    } else {
      updateContent(activeTab, editingContent);
    }
    setIsEditing(false);
    toast.success('Content updated successfully!');
  };

  const handleCancel = () => {
    setEditingContent(localContent[activeTab] || (activeTab === 'blogPosts' ? [] : {}));
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditingContent({
      ...editingContent,
      [field]: value
    });
  };

  const handleNestedInputChange = (parentField, field, value) => {
    setEditingContent({
      ...editingContent,
      [parentField]: {
        ...editingContent[parentField],
        [field]: value
      }
    });
  };

  const handleArrayChange = (arrayName, index, field, value) => {
    // Special handling for blogPosts
    if (arrayName === 'blogPosts') {
      const current = Array.isArray(editingContent) ? editingContent : [];
      const newArray = [...current];
      
      // Handle simple array of strings (like keywords)
      if (Array.isArray(field)) {
        newArray[index] = {
          ...newArray[index],
          [field[0]]: value
        };
      } 
      // Handle object arrays
      else {
        newArray[index] = {
          ...newArray[index],
          [field]: value
        };
      }
      
      setEditingContent(newArray);
    } else {
      const baseArray = Array.isArray(editingContent[arrayName]) ? editingContent[arrayName] : [];
      const newArray = [...baseArray];
      
      // Handle simple array of strings (like specialties, education, achievements)
      if (typeof field === 'number') {
        newArray[index] = value;
      } 
      // Handle object arrays (like stats, services)
      else {
        newArray[index] = {
          ...newArray[index],
          [field]: value
        };
      }
      
      setEditingContent({
        ...editingContent,
        [arrayName]: newArray
      });
    }
  };

  const addArrayItem = (arrayName, template) => {
    // Special handling for blogPosts
    if (arrayName === 'blogPosts') {
      const current = Array.isArray(editingContent) ? editingContent : [];
      setEditingContent([
        ...current,
        template
      ]);
    } else {
      const current = Array.isArray(editingContent[arrayName]) ? editingContent[arrayName] : [];
      setEditingContent({
        ...editingContent,
        [arrayName]: [...current, template]
      });
    }
  };

  const removeArrayItem = (arrayName, index) => {
    // Special handling for blogPosts
    if (arrayName === 'blogPosts') {
      const current = Array.isArray(editingContent) ? editingContent : [];
      const newArray = current.filter((_, i) => i !== index);
      setEditingContent(newArray);
    } else {
      const baseArray = Array.isArray(editingContent[arrayName]) ? editingContent[arrayName] : [];
      const newArray = baseArray.filter((_, i) => i !== index);
      setEditingContent({
        ...editingContent,
        [arrayName]: newArray
      });
    }
  };

  const moveArrayItem = (arrayName, fromIndex, toIndex) => {
    const arr = [...(arrayName === 'blogPosts' ? editingContent : editingContent[arrayName] || [])];
    if (toIndex < 0 || toIndex >= arr.length) return;
    const [moved] = arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, moved);
    if (arrayName === 'blogPosts') {
      setEditingContent(arr);
    } else {
      setEditingContent({
        ...editingContent,
        [arrayName]: arr
      });
    }
  };

  const renderHeroEditor = () => (
    <div className="space-y-6">
      <div>
        <ImagePicker
          label="Hero Image"
          value={editingContent.imageUrl || ''}
          onChange={(url) => handleInputChange('imageUrl', url)}
          section="hero"
          disabled={!isEditing}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Main Title</label>
        <textarea
          value={editingContent.title || ''}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="3"
          disabled={!isEditing}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
        <input
          type="text"
          value={editingContent.subtitle || ''}
          onChange={(e) => handleInputChange('subtitle', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={!isEditing}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={editingContent.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="3"
          disabled={!isEditing}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
          <input
            type="text"
            value={editingContent.buttonText || ''}
            onChange={(e) => handleInputChange('buttonText', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input
            type="text"
            value={editingContent.phoneNumber || ''}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!isEditing}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Statistics</label>
        {editingContent.stats?.map((stat, index) => (
          <div key={index} className="grid grid-cols-3 gap-4 mb-3 p-3 border border-gray-200 rounded-lg">
            <input
              type="text"
              placeholder="Icon"
              value={stat.icon || ''}
              onChange={(e) => handleArrayChange('stats', index, 'icon', e.target.value)}
              className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!isEditing}
            />
            <input
              type="text"
              placeholder="Number"
              value={stat.number || ''}
              onChange={(e) => handleArrayChange('stats', index, 'number', e.target.value)}
              className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!isEditing}
            />
            <input
              type="text"
              placeholder="Label"
              value={stat.label || ''}
              onChange={(e) => handleArrayChange('stats', index, 'label', e.target.value)}
              className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!isEditing}
            />
          </div>
        ))}
        {isEditing && (
          <Button
            onClick={() => addArrayItem('stats', { icon: '', number: '', label: '' })}
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Statistic
          </Button>
        )}
      </div>
    </div>
  );

  const renderAboutEditor = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
        <input
          type="text"
          value={editingContent.title || ''}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={!isEditing}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={editingContent.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="4"
          disabled={!isEditing}
        />
      </div>

      <div>
        <ImagePicker
          label="About Image"
          value={editingContent.image || ''}
          onChange={(url) => handleInputChange('image', url)}
          section="about"
          disabled={!isEditing}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Mission Statement</label>
        <textarea
          value={editingContent.mission || ''}
          onChange={(e) => handleInputChange('mission', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="3"
          disabled={!isEditing}
        />
      </div>
    </div>
  );

  const renderServicesEditor = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
        <input
          type="text"
          value={editingContent.title || ''}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={!isEditing}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
        <input
          type="text"
          value={editingContent.subtitle || ''}
          onChange={(e) => handleInputChange('subtitle', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={!isEditing}
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-medium text-gray-700">Services</label>
          {isEditing && (
            <Button
              onClick={() => addArrayItem('services', { name: '', description: '', icon: '🦷', imageUrl: '' })}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Service
            </Button>
          )}
        </div>
        {editingContent.services?.map((service, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg mb-3">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-medium text-gray-800">Service {index + 1}</h4>
              {isEditing && (
                <Button
                  onClick={() => removeArrayItem('services', index)}
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs"
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Service Name"
                value={service.name || ''}
                onChange={(e) => handleArrayChange('services', index, 'name', e.target.value)}
                className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!isEditing}
              />
              <input
                type="text"
                placeholder="Icon (emoji)"
                value={service.icon || ''}
                onChange={(e) => handleArrayChange('services', index, 'icon', e.target.value)}
                className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!isEditing}
              />
              <div className="md:col-span-3">
                <ImagePicker
                  label="Service Image"
                  value={service.imageUrl || ''}
                  onChange={(url) => handleArrayChange('services', index, 'imageUrl', url)}
                  section="services"
                  disabled={!isEditing}
                />
              </div>
              <textarea
                placeholder="Description"
                value={service.description || ''}
                onChange={(e) => handleArrayChange('services', index, 'description', e.target.value)}
                className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent md:col-span-3"
                rows="2"
                disabled={!isEditing}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDoctorEditor = () => (
    <div className="space-y-6">
      <div>
        <ImagePicker
          label="Doctor Image"
          value={editingContent.image || ''}
          onChange={(url) => handleInputChange('image', url)}
          section="doctor"
          disabled={!isEditing}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Doctor Name</label>
        <input
          type="text"
          value={editingContent.name || ''}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={!isEditing}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
        <input
          type="text"
          value={editingContent.title || ''}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={!isEditing}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
        <textarea
          value={editingContent.bio || ''}
          onChange={(e) => handleInputChange('bio', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="3"
          disabled={!isEditing}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Specialties</label>
        {editingContent.specialties?.map((specialty, index) => (
          <div key={index} className="flex mb-2">
            <input
              type="text"
              value={specialty || ''}
              onChange={(e) => handleArrayChange('specialties', index, 0, e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-l focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!isEditing}
            />
            {isEditing && (
              <button
                onClick={() => removeArrayItem('specialties', index)}
                className="bg-red-500 text-white px-3 rounded-r"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        {isEditing && (
          <Button
            onClick={() => addArrayItem('specialties', '')}
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Specialty
          </Button>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
        {editingContent.education?.map((edu, index) => (
          <div key={index} className="flex mb-2">
            <input
              type="text"
              value={edu || ''}
              onChange={(e) => handleArrayChange('education', index, 0, e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-l focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!isEditing}
            />
            {isEditing && (
              <button
                onClick={() => removeArrayItem('education', index)}
                className="bg-red-500 text-white px-3 rounded-r"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        {isEditing && (
          <Button
            onClick={() => addArrayItem('education', '')}
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Education
          </Button>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Achievements</label>
        {editingContent.achievements?.map((achievement, index) => (
          <div key={index} className="flex mb-2">
            <input
              type="text"
              value={achievement || ''}
              onChange={(e) => handleArrayChange('achievements', index, 0, e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-l focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!isEditing}
            />
            {isEditing && (
              <button
                onClick={() => removeArrayItem('achievements', index)}
                className="bg-red-500 text-white px-3 rounded-r"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        {isEditing && (
          <Button
            onClick={() => addArrayItem('achievements', '')}
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Achievement
          </Button>
        )}
      </div>
    </div>
  );

  const renderHeaderEditor = () => (
    <div className="space-y-6">
      {/* Branding */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Site Title</label>
          <input
            type="text"
            value={editingContent.siteTitle || ''}
            onChange={(e) => handleInputChange('siteTitle', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
          <input
            type="text"
            value={editingContent.siteSubtitle || ''}
            onChange={(e) => handleInputChange('siteSubtitle', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!isEditing}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <ImagePicker
            label="Logo"
            value={editingContent.logoUrl || ''}
            onChange={(url) => handleInputChange('logoUrl', url)}
            section="logos"
            disabled={!isEditing}
          />
        </div>
        <div>
          <ImagePicker
            label="Favicon"
            value={editingContent.faviconUrl || ''}
            onChange={(url) => handleInputChange('faviconUrl', url)}
            section="favicons"
            disabled={!isEditing}
          />
        </div>
      </div>

      {/* Navigation Items */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Navigation Items</label>
        {editingContent.navItems?.map((item, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3 p-3 border border-gray-200 rounded-lg">
            <input
              type="text"
              placeholder="Label"
              value={item.label || ''}
              onChange={(e) => handleArrayChange('navItems', index, 'label', e.target.value)}
              className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!isEditing}
            />
            <select
              value={item.mode || 'scroll'}
              onChange={(e) => handleArrayChange('navItems', index, 'mode', e.target.value)}
              className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!isEditing}
            >
              <option value="scroll">Scroll</option>
              <option value="route">Route</option>
              <option value="custom">Custom</option>
            </select>
            <input
              type="text"
              placeholder="Target (section id or route)"
              value={item.target || ''}
              onChange={(e) => handleArrayChange('navItems', index, 'target', e.target.value)}
              className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!isEditing}
            />
            {isEditing && (
              <button
                onClick={() => removeArrayItem('navItems', index)}
                className="bg-red-500 text-white px-3 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        {isEditing && (
          <Button
            onClick={() => addArrayItem('navItems', { label: '', mode: 'scroll', target: '' })}
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Nav Item
          </Button>
        )}
      </div>

      {/* CTA Settings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">CTA Text</label>
          <input
            type="text"
            value={editingContent.ctaText || ''}
            onChange={(e) => handleInputChange('ctaText', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">CTA Mode</label>
          <select
            value={editingContent.ctaMode || 'route'}
            onChange={(e) => handleInputChange('ctaMode', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!isEditing}
          >
            <option value="route">Route</option>
            <option value="scroll">Scroll</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">CTA Target</label>
          <input
            type="text"
            value={editingContent.ctaTarget || ''}
            onChange={(e) => handleInputChange('ctaTarget', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!isEditing}
            placeholder="e.g., appointment or contact"
          />
        </div>
      </div>

      {/* Topbar Ticker Settings */}
      <div className="border-t border-gray-200 pt-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <label className="block text-lg font-semibold text-gray-700">Topbar Ticker Messages</label>
          {isEditing && (
            <Button
              onClick={() => addArrayItem('ticker', { text: '', icon: '' })}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Message
            </Button>
          )}
        </div>
        <p className="text-sm text-gray-500 mb-4">Add messages that will slide up/down in the top bar. You can add an icon URL (optional).</p>
        
        {editingContent.ticker?.map((item, index) => (
          <div key={index} className="flex gap-3 mb-3 items-start p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="w-1/3">
              <label className="block text-xs font-medium text-gray-500 mb-1">Icon URL</label>
              <input
                type="text"
                placeholder="https://..."
                value={item.icon || ''}
                onChange={(e) => handleArrayChange('ticker', index, 'icon', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
                disabled={!isEditing}
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 mb-1">Message Text</label>
              <input
                type="text"
                placeholder="e.g., Hours Thursday to Sunday: 10AM - 10PM"
                value={item.text || ''}
                onChange={(e) => handleArrayChange('ticker', index, 'text', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
                disabled={!isEditing}
              />
            </div>
            {isEditing && (
              <div className="mt-5">
                <Button
                  onClick={() => removeArrayItem('ticker', index)}
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 h-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        ))}
        {(!editingContent.ticker || editingContent.ticker.length === 0) && (
          <div className="text-center p-4 text-gray-500 italic bg-gray-50 rounded-lg">
            No ticker messages added. Default messages will be shown.
          </div>
        )}
      </div>

      {/* SEO Settings */}
      <div>
        <h3 className="text-lg font-semibold mb-2">SEO & Social</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SEO Title</label>
            <input
              type="text"
              value={editingContent.seoTitle || ''}
              onChange={(e) => handleInputChange('seoTitle', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SEO Description</label>
            <textarea
              value={editingContent.seoDescription || ''}
              onChange={(e) => handleInputChange('seoDescription', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Open Graph Title</label>
            <input
              type="text"
              value={editingContent.ogTitle || ''}
              onChange={(e) => handleInputChange('ogTitle', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Open Graph Description</label>
            <textarea
              value={editingContent.ogDescription || ''}
              onChange={(e) => handleInputChange('ogDescription', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              disabled={!isEditing}
            />
          </div>
          <div>
            <ImagePicker
              label="Open Graph Image"
              value={editingContent.ogImage || ''}
              onChange={(url) => handleInputChange('ogImage', url)}
              section="seo"
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Twitter Title</label>
            <input
              type="text"
              value={editingContent.twitterTitle || ''}
              onChange={(e) => handleInputChange('twitterTitle', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Twitter Description</label>
            <textarea
              value={editingContent.twitterDescription || ''}
              onChange={(e) => handleInputChange('twitterDescription', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              disabled={!isEditing}
            />
          </div>
          <div>
            <ImagePicker
              label="Twitter Image"
              value={editingContent.twitterImage || ''}
              onChange={(url) => handleInputChange('twitterImage', url)}
              section="seo"
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacyEditor = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
        <input
          type="text"
          value={editingContent.title || ''}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={!isEditing}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
        <textarea
          value={editingContent.content || ''}
          onChange={(e) => handleInputChange('content', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="12"
          disabled={!isEditing}
          placeholder="Write or paste your Privacy Policy text here."
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Effective Date</label>
          <input
            type="text"
            value={editingContent.effectiveDate || ''}
            onChange={(e) => handleInputChange('effectiveDate', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Updated</label>
          <input
            type="text"
            value={editingContent.lastUpdated || ''}
            onChange={(e) => handleInputChange('lastUpdated', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!isEditing}
          />
        </div>
      </div>
    </div>
  );

  const renderTermsEditor = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
        <input
          type="text"
          value={editingContent.title || ''}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={!isEditing}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
        <textarea
          value={editingContent.content || ''}
          onChange={(e) => handleInputChange('content', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="12"
          disabled={!isEditing}
          placeholder="Write or paste your Terms of Service text here."
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Effective Date</label>
          <input
            type="text"
            value={editingContent.effectiveDate || ''}
            onChange={(e) => handleInputChange('effectiveDate', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Updated</label>
          <input
            type="text"
            value={editingContent.lastUpdated || ''}
            onChange={(e) => handleInputChange('lastUpdated', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!isEditing}
          />
        </div>
      </div>
    </div>
  );

  const renderContactEditor = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
        <input
          type="text"
          value={editingContent.title || ''}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={!isEditing}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
        <input
          type="text"
          value={editingContent.subtitle || ''}
          onChange={(e) => handleInputChange('subtitle', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={!isEditing}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
        <textarea
          value={editingContent.address || ''}
          onChange={(e) => handleInputChange('address', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="3"
          disabled={!isEditing}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input
            type="text"
            value={editingContent.phone || ''}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={editingContent.email || ''}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!isEditing}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Opening Hours</label>
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Weekdays"
              value={editingContent.hours?.weekdays || ''}
              onChange={(e) => handleNestedInputChange('hours', 'weekdays', e.target.value)}
              className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!isEditing}
            />
            <input
              type="text"
              placeholder="Saturday"
              value={editingContent.hours?.saturday || ''}
              onChange={(e) => handleNestedInputChange('hours', 'saturday', e.target.value)}
              className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!isEditing}
            />
          </div>
          <input
            type="text"
            placeholder="Sunday"
            value={editingContent.hours?.sunday || ''}
            onChange={(e) => handleNestedInputChange('hours', 'sunday', e.target.value)}
            className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!isEditing}
          />
        </div>
      </div>
    </div>
  );

  const renderTestimonialsEditor = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
        <input
          type="text"
          value={editingContent.title || ''}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={!isEditing}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
        <input
          type="text"
          value={editingContent.subtitle || ''}
          onChange={(e) => handleInputChange('subtitle', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={!isEditing}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Statistics</label>
        {editingContent.stats?.map((stat, index) => (
          <div key={index} className="grid grid-cols-2 gap-4 mb-3 p-3 border border-gray-200 rounded-lg">
            <input
              type="text"
              placeholder="Number"
              value={stat.number || ''}
              onChange={(e) => handleArrayChange('stats', index, 'number', e.target.value)}
              className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!isEditing}
            />
            <input
              type="text"
              placeholder="Label"
              value={stat.label || ''}
              onChange={(e) => handleArrayChange('stats', index, 'label', e.target.value)}
              className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!isEditing}
            />
          </div>
        ))}
        {isEditing && (
          <Button
            onClick={() => addArrayItem('stats', { number: '', label: '' })}
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Statistic
          </Button>
        )}
      </div>
    </div>
  );

  const renderGalleryEditor = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
        <input
          type="text"
          value={editingContent.title || ''}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={!isEditing}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
        <input
          type="text"
          value={editingContent.subtitle || ''}
          onChange={(e) => handleInputChange('subtitle', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={!isEditing}
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-medium text-gray-700">Gallery Images</label>
          {isEditing && (
            <Button
              onClick={() => addArrayItem('images', '')}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Image
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {editingContent.images?.map((image, index) => (
            <div key={index} className="relative p-4 border border-gray-200 rounded-lg">
              <div className="mb-2">
                 <ImagePicker
                  label={`Image ${index + 1}`}
                  value={image || ''}
                  onChange={(url) => handleArrayChange('images', index, 0, url)}
                  section="gallery"
                  disabled={!isEditing}
                />
              </div>
              {isEditing && (
                <div className="flex justify-end mt-2">
                  <Button
                    onClick={() => removeArrayItem('images', index)}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs"
                  >
                    <X className="w-3 h-3 mr-1" /> Remove
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBlogEditor = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
        <input
          type="text"
          value={editingContent.title || ''}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={!isEditing}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
        <input
          type="text"
          value={editingContent.subtitle || ''}
          onChange={(e) => handleInputChange('subtitle', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={!isEditing}
        />
      </div>
    </div>
  );

  const renderBlogPostsEditor = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-800">Blog Posts</h3>
        {isEditing && (
          <Button
            onClick={() => addArrayItem('blogPosts', { 
              slug: '', 
              title: '', 
              category: '', 
              date: new Date().toISOString().split('T')[0],
              excerpt: '',
              keywords: [],
              cover: ''
            })}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Blog Post
          </Button>
        )}
      </div>
      
      {editingContent && editingContent.map ? (
        editingContent.map((post, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg mb-4">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-medium text-gray-800">Blog Post {index + 1}</h4>
              {isEditing && (
                <Button
                  onClick={() => removeArrayItem('blogPosts', index)}
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs"
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input
                  type="text"
                  value={post.slug || ''}
                  onChange={(e) => handleArrayChange('blogPosts', index, 'slug', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  value={post.category || ''}
                  onChange={(e) => handleArrayChange('blogPosts', index, 'category', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!isEditing}
                />
              </div>
            </div>
            
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={post.title || ''}
                onChange={(e) => handleArrayChange('blogPosts', index, 'title', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!isEditing}
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={post.date || ''}
                onChange={(e) => handleArrayChange('blogPosts', index, 'date', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!isEditing}
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
              <textarea
                value={post.excerpt || ''}
                onChange={(e) => handleArrayChange('blogPosts', index, 'excerpt', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                disabled={!isEditing}
              />
            </div>
            
            <div className="mb-3">
              <ImagePicker
                label="Cover Image"
                value={post.cover || ''}
                onChange={(url) => handleArrayChange('blogPosts', index, 'cover', url)}
                section="blog"
                disabled={!isEditing}
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Keywords (comma separated)</label>
              <input
                type="text"
                value={post.keywords ? post.keywords.join(', ') : ''}
                onChange={(e) => handleArrayChange('blogPosts', index, 'keywords', e.target.value.split(',').map(k => k.trim()))}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!isEditing}
              />
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">
          No blog posts found. Add your first blog post using the "Add Blog Post" button.
        </div>
      )}
    </div>
  );

  const renderFaqEditor = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
        <input
          type="text"
          value={editingContent.title || ''}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={!isEditing}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
        <input
          type="text"
          value={editingContent.subtitle || ''}
          onChange={(e) => handleInputChange('subtitle', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={!isEditing}
        />
      </div>
    </div>
  );

  const renderFooterEditor = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Clinic Name</label>
        <input
          type="text"
          value={editingContent.clinicName || ''}
          onChange={(e) => handleInputChange('clinicName', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={!isEditing}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Copyright Text</label>
        <input
          type="text"
          value={editingContent.copyright || ''}
          onChange={(e) => handleInputChange('copyright', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={!isEditing}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Powered By Text</label>
        <input
          type="text"
          value={editingContent.poweredBy || ''}
          onChange={(e) => handleInputChange('poweredBy', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={!isEditing}
        />
      </div>
    </div>
  );

  const renderAppointmentEditor = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
        <input
          type="text"
          value={editingContent.title || ''}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={!isEditing}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
        <input
          type="text"
          value={editingContent.subtitle || ''}
          onChange={(e) => handleInputChange('subtitle', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={!isEditing}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={editingContent.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="4"
          disabled={!isEditing}
        />
      </div>
    </div>
  );

  const renderSliderEditor = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Slider Title</label>
        <input
          type="text"
          value={editingContent.title || ''}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={!isEditing}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Slider Subtitle</label>
        <input
          type="text"
          value={editingContent.subtitle || ''}
          onChange={(e) => handleInputChange('subtitle', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={!isEditing}
        />
      </div>

      {/* Advanced Slides Configuration */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-medium text-gray-700">Slides</label>
          {isEditing && (
            <div className="flex gap-2">
              {(!editingContent.slides || editingContent.slides.length === 0) && (editingContent.images?.length > 0) && (
                <Button
                  onClick={() => {
                    const slides = (editingContent.images || []).map((url, i) => ({
                      imageUrl: url,
                      title: editingContent.title || '',
                      subtitle: editingContent.subtitle || '',
                      linkUrl: '',
                      linkLabel: '',
                      order: i,
                      active: true
                    }));
                    setEditingContent({ ...editingContent, slides });
                  }}
                  className="bg-violet-600 hover:bg-violet-700 text-white px-3 py-1 text-sm"
                >
                  Migrate images → slides
                </Button>
              )}
              <Button
                onClick={() => addArrayItem('slides', { imageUrl: '', title: '', subtitle: '', linkUrl: '', linkLabel: '', order: (editingContent.slides?.length || 0), active: true })}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Slide
              </Button>
            </div>
          )}
        </div>
        {(editingContent.slides || []).map((slide, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg mb-3">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-medium text-gray-800">Slide {index + 1}</h4>
              <div className="flex gap-2">
                {isEditing && (
                  <>
                    <Button onClick={() => moveArrayItem('slides', index, index - 1)} className="px-2 py-1 bg-gray-200 text-gray-700" title="Move up">
                      <ChevronUp className="w-4 h-4" />
                    </Button>
                    <Button onClick={() => moveArrayItem('slides', index, index + 1)} className="px-2 py-1 bg-gray-200 text-gray-700" title="Move down">
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                    <Button onClick={() => removeArrayItem('slides', index)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs">
                      <X className="w-3 h-3" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <ImagePicker
                label="Slide Image"
                value={slide.imageUrl || ''}
                onChange={(url) => handleArrayChange('slides', index, 'imageUrl', url)}
                section="slider"
                disabled={!isEditing}
              />
              <input
                type="text"
                placeholder="Link URL (optional)"
                value={slide.linkUrl || ''}
                onChange={(e) => handleArrayChange('slides', index, 'linkUrl', e.target.value)}
                className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!isEditing}
              />
              <input
                type="text"
                placeholder="Link Label (optional)"
                value={slide.linkLabel || ''}
                onChange={(e) => handleArrayChange('slides', index, 'linkLabel', e.target.value)}
                className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!isEditing}
              />
              <input
                type="number"
                placeholder="Order"
                value={slide.order ?? index}
                onChange={(e) => handleArrayChange('slides', index, 'order', Number(e.target.value))}
                className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!isEditing}
              />
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700">Active</label>
                <input
                  type="checkbox"
                  checked={slide.active !== false}
                  onChange={(e) => handleArrayChange('slides', index, 'active', e.target.checked)}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <input
                type="text"
                placeholder="Title (optional)"
                value={slide.title || ''}
                onChange={(e) => handleArrayChange('slides', index, 'title', e.target.value)}
                className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!isEditing}
              />
              <input
                type="text"
                placeholder="Subtitle (optional)"
                value={slide.subtitle || ''}
                onChange={(e) => handleArrayChange('slides', index, 'subtitle', e.target.value)}
                className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!isEditing}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCtaEditor = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Call to Action Text</label>
        <textarea
          value={editingContent.text || ''}
          onChange={(e) => handleInputChange('text', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="3"
          disabled={!isEditing}
        />
      </div>
    </div>
  );

  const renderPatientEditor = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
        <input
          type="text"
          value={editingContent.title || ''}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={!isEditing}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={editingContent.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="4"
          disabled={!isEditing}
        />
      </div>
    </div>
  );

  const renderTreatmentsEditor = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <label className="block text-sm font-medium text-gray-700">Treatments</label>
        {isEditing && (
          <Button
            onClick={() => addArrayItem('items', { title: '', description: '', imageUrl: '', slug: '' })}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Treatment
          </Button>
        )}
      </div>
      {(editingContent.items || []).map((item, index) => (
        <div key={index} className="p-4 border border-gray-200 rounded-lg mb-3">
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-medium text-gray-800">Treatment {index + 1}</h4>
            {isEditing && (
              <Button onClick={() => removeArrayItem('items', index)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs">
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input type="text" placeholder="Title" value={item.title || ''} onChange={(e) => handleArrayChange('items', index, 'title', e.target.value)} className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent" disabled={!isEditing} />
            <input type="text" placeholder="Slug" value={item.slug || ''} onChange={(e) => handleArrayChange('items', index, 'slug', e.target.value)} className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent" disabled={!isEditing} />
            <div className="md:col-span-2">
              <ImagePicker
                label="Treatment Image"
                value={item.imageUrl || ''}
                onChange={(url) => handleArrayChange('items', index, 'imageUrl', url)}
                section="treatments"
                disabled={!isEditing}
              />
            </div>
            <textarea placeholder="Description" value={item.description || ''} onChange={(e) => handleArrayChange('items', index, 'description', e.target.value)} className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent md:col-span-2" rows="3" disabled={!isEditing} />
          </div>
        </div>
      ))}
    </div>
  );

  const renderReviewsEditor = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <label className="block text-sm font-medium text-gray-700">Reviews</label>
        {isEditing && (
          <Button
            onClick={() => addArrayItem('items', { name: '', rating: 5, message: '', date: new Date().toISOString().split('T')[0] })}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Review
          </Button>
        )}
      </div>
      {(editingContent.items || []).map((item, index) => (
        <div key={index} className="p-4 border border-gray-200 rounded-lg mb-3">
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-medium text-gray-800">Review {index + 1}</h4>
            {isEditing && (
              <Button onClick={() => removeArrayItem('items', index)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs">
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input type="text" placeholder="Name" value={item.name || ''} onChange={(e) => handleArrayChange('items', index, 'name', e.target.value)} className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent" disabled={!isEditing} />
            <input type="number" placeholder="Rating (1-5)" value={item.rating ?? 5} onChange={(e) => handleArrayChange('items', index, 'rating', Number(e.target.value))} className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent" disabled={!isEditing} />
            <input type="date" placeholder="Date" value={item.date || ''} onChange={(e) => handleArrayChange('items', index, 'date', e.target.value)} className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent" disabled={!isEditing} />
            <textarea placeholder="Message" value={item.message || ''} onChange={(e) => handleArrayChange('items', index, 'message', e.target.value)} className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent md:col-span-2" rows="3" disabled={!isEditing} />
          </div>
        </div>
      ))}
    </div>
  );

  const renderMapEditor = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
        <textarea
          value={editingContent.address || ''}
          onChange={(e) => handleInputChange('address', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="3"
          disabled={!isEditing}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input type="text" placeholder="Latitude" value={editingContent.lat || ''} onChange={(e) => handleInputChange('lat', e.target.value)} className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent" disabled={!isEditing} />
        <input type="text" placeholder="Longitude" value={editingContent.lng || ''} onChange={(e) => handleInputChange('lng', e.target.value)} className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent" disabled={!isEditing} />
        <input type="text" placeholder="Embed URL" value={editingContent.embedUrl || ''} onChange={(e) => handleInputChange('embedUrl', e.target.value)} className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent" disabled={!isEditing} />
      </div>
    </div>
  );

  const renderGenericEditor = () => (
    <div className="space-y-6">
      {Object.entries(editingContent).map(([key, value]) => (
        <div key={key}>
          <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </label>
          {typeof value === 'string' ? (
            value.length > 100 ? (
              <textarea
                value={value || ''}
                onChange={(e) => handleInputChange(key, e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"
                disabled={!isEditing}
              />
            ) : (
              <input
                type="text"
                value={value || ''}
                onChange={(e) => handleInputChange(key, e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!isEditing}
              />
            )
          ) : typeof value === 'object' && value !== null ? (
            <div className="p-3 bg-gray-50 rounded-lg">
              <pre className="text-sm text-gray-600">{JSON.stringify(value, null, 2)}</pre>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );

  const renderEditor = () => {
    switch (activeTab) {
      case 'header':
        return renderHeaderEditor();
      case 'hero':
        return renderHeroEditor();
      case 'about':
        return renderAboutEditor();
      case 'services':
        return renderServicesEditor();
      case 'treatments':
        return renderTreatmentsEditor();
      case 'reviews':
        return renderReviewsEditor();
      case 'map':
        return renderMapEditor();
      case 'contact':
        return renderContactEditor();
      case 'doctor':
        return renderDoctorEditor();
      case 'testimonials':
        return renderTestimonialsEditor();
      case 'gallery':
        return renderGalleryEditor();
      case 'blog':
        return renderBlogEditor();
      case 'blogPosts':
        return renderBlogPostsEditor();
      case 'faq':
        return renderFaqEditor();
      case 'privacyPolicy':
        return renderPrivacyEditor();
      case 'termsOfService':
        return renderTermsEditor();
      case 'footer':
        return renderFooterEditor();
      case 'appointment':
        return renderAppointmentEditor();
      case 'slider':
        return renderSliderEditor();
      case 'cta':
        return renderCtaEditor();
      case 'patient':
        return renderPatientEditor();
      default:
        return renderGenericEditor();
    }
  };

  return (
    <div className="w-full max-w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Content Management</h2>
        <div className="flex space-x-2">
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Content
            </Button>
          ) : (
            <>
              <Button
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      {renderNavigation()}

      {/* Content Editor */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg border border-gray-200 p-6"
      >
        {renderEditor()}
      </motion.div>
    </div>
  );
};

export default ContentManagement;
