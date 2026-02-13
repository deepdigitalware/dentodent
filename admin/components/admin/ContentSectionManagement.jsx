import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Save, X, AlertCircle, FileText, Grid } from 'lucide-react';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';
import { useContent } from '../../contexts/ContentContext';

const ContentSectionManagement = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [formData, setFormData] = useState({
    section_name: '',
    section_type: '',
    title: '',
    subtitle: '',
    content: '',
    is_active: true,
    display_order: 0
  });
  const { toast } = useToast();
  const { apiUrl } = useContent();

  const sectionTypes = [
    { id: 'hero', name: 'Hero Section' },
    { id: 'about', name: 'About Section' },
    { id: 'services', name: 'Services Section' },
    { id: 'team', name: 'Team Section' },
    { id: 'testimonials', name: 'Testimonials Section' },
    { id: 'faq', name: 'FAQ Section' },
    { id: 'contact', name: 'Contact Section' },
    { id: 'blog', name: 'Blog Section' },
    { id: 'gallery', name: 'Gallery Section' }
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

  const fetchSections = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetchWithRefresh(`${apiUrl}/api/content-sections`);
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Failed to load content sections (${response.status})`);
      }
      const data = await response.json();
      setSections(data);
    } catch (e) {
      setError(e.message);
      toast({
        title: "Error",
        description: `Failed to load content sections: ${e.message}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, [apiUrl]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingSection ? 'PUT' : 'POST';
      const url = editingSection 
        ? `${apiUrl}/api/content-sections/${editingSection.id}` 
        : `${apiUrl}/api/content-sections`;
      
      // Convert content to JSON if it's a string
      let submitContent = formData.content;
      if (typeof formData.content === 'string') {
        try {
          submitContent = JSON.parse(formData.content);
        } catch (e) {
          // If it's not valid JSON, keep it as string
        }
      }
      
      const submitData = {
        ...formData,
        content: submitContent
      };
      
      const response = await fetchWithRefresh(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Failed to save content section (${response.status})`);
      }

      const data = await response.json();
      if (editingSection) {
        setSections(prev => prev.map(s => s.id === editingSection.id ? data : s));
        toast({ title: "Success", description: "Content section updated successfully!" });
      } else {
        setSections(prev => [...prev, data]);
        toast({ title: "Success", description: "Content section created successfully!" });
      }

      resetForm();
    } catch (e) {
      toast({
        title: "Error",
        description: `Failed to save content section: ${e.message}`,
        variant: "destructive"
      });
    }
  };

  const handleEdit = (section) => {
    setEditingSection(section);
    setFormData({
      section_name: section.section_name || '',
      section_type: section.section_type || '',
      title: section.title || '',
      subtitle: section.subtitle || '',
      content: typeof section.content === 'object' ? JSON.stringify(section.content, null, 2) : section.content || '',
      is_active: section.is_active !== undefined ? section.is_active : true,
      display_order: section.display_order || 0
    });
    setShowForm(true);
  };

  const handleDelete = async (sectionId) => {
    if (!window.confirm('Are you sure you want to delete this content section?')) return;
    
    try {
      const response = await fetchWithRefresh(`${apiUrl}/api/content-sections/${sectionId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Failed to delete content section (${response.status})`);
      }

      setSections(prev => prev.filter(s => s.id !== sectionId));
      toast({ title: "Success", description: "Content section deleted successfully!" });
    } catch (e) {
      toast({
        title: "Error",
        description: `Failed to delete content section: ${e.message}`,
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setEditingSection(null);
    setFormData({
      section_name: '',
      section_type: '',
      title: '',
      subtitle: '',
      content: '',
      is_active: true,
      display_order: 0
    });
    setShowForm(false);
  };

  const previewSection = (section) => {
    // In a real implementation, this would show a preview of the section
    toast({ title: "Info", description: "Content section preview would be shown here." });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Section Management</h1>
          <p className="text-gray-600 mt-1">Manage reusable content sections and templates</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add New Section</span>
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
              {editingSection ? 'Edit Content Section' : 'Add New Content Section'}
            </h2>
            <Button variant="ghost" onClick={resetForm} className="p-2">
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Name</label>
                <input
                  type="text"
                  name="section_name"
                  value={formData.section_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Type</label>
                <select
                  name="section_type"
                  value={formData.section_type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select section type</option>
                  {sectionTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Content (JSON or text)</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder='{"items": [{"title": "Item 1", "description": "Description"}]}'
              />
            </div>
            
            <div className="flex space-x-3 pt-4">
              <Button type="submit" className="flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>{editingSection ? 'Update Section' : 'Create Section'}</span>
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
          <h2 className="text-lg font-semibold text-gray-900">Existing Content Sections</h2>
        </div>
        
        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading content sections...</p>
          </div>
        ) : sections.length === 0 ? (
          <div className="p-6 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No content sections</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new content section.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sections.map((section) => (
                  <tr key={section.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{section.section_name}</div>
                      <div className="text-sm text-gray-500">{section.subtitle}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sectionTypes.find(t => t.id === section.section_type)?.name || section.section_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {section.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        section.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {section.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {section.display_order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => previewSection(section)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(section)}
                          className="text-indigo-600 hover:text-indigo-900 p-1"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(section.id)}
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

export default ContentSectionManagement;