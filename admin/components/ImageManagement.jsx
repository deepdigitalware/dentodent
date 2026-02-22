import React, { useState, useRef, useContext } from 'react';
import { motion } from 'framer-motion';
import { Upload, Trash2, Eye, Download, Image as ImageIcon, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { useContent } from '@/contexts/ContentContext';

const ImageManagement = () => {
  const { apiUrl } = useContent();
  const [activeCategory, setActiveCategory] = useState('hero');
  const [images, setImages] = useState({
    hero: [],
    about: [],
    services: [],
    gallery: [],
    branding: [],
    logos: [],
    favicons: [],
    icons: [],
    blog: [],
    sections: []
  });
  
  const [selectedImages, setSelectedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Load images on component mount
  React.useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/images`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        }
      });
      
      if (response.ok) {
        const allImages = await response.json();
        
        // Group images by section
        const groupedImages = {
          hero: [],
          about: [],
          services: [],
          gallery: [],
          branding: [],
          logos: [],
          favicons: [],
          icons: [],
          blog: [],
          sections: []
        };
        
        allImages.forEach(image => {
          const section = image.section || 'general';
          if (groupedImages[section]) {
            groupedImages[section].push({
              id: image.id,
              name: image.name,
              url: `${apiUrl}${image.path}`,
              size: `${(image.size / 1024).toFixed(0)} KB`,
              type: image.mimetype?.split('/')[1] || 'unknown',
              isBranding: section === 'branding',
              isLogo: section === 'logos',
              isFavicon: section === 'favicons'
            });
          }
        });
        
        setImages(groupedImages);
      }
    } catch (error) {
      console.error('Error loading images:', error);
      toast.error('Failed to load images');
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    { id: 'hero', label: 'Hero Section', icon: '🏠', count: images.hero.length },
    { id: 'about', label: 'About Us', icon: 'ℹ️', count: images.about.length },
    { id: 'services', label: 'Services', icon: '🛠️', count: images.services.length },
    { id: 'gallery', label: 'Gallery', icon: '🖼️', count: images.gallery.length },
    { id: 'branding', label: 'Branding', icon: '🎨', count: images.branding.length },
    { id: 'logos', label: 'Logos', icon: '🏢', count: images.logos.length },
    { id: 'favicons', label: 'Favicons', icon: '⭐', count: images.favicons.length },
    { id: 'icons', label: 'Icons', icon: '🔘', count: images.icons.length },
    { id: 'blog', label: 'Blog Images', icon: '📝', count: images.blog.length },
    { id: 'sections', label: 'Section Backgrounds', icon: '🧱', count: images.sections.length }
  ];

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setIsUploading(true);
    const token = localStorage.getItem('admin_token');
    
    if (!token) {
      toast.error('Authentication required. Please log in again.');
      setIsUploading(false);
      return;
    }

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', file.name);
        formData.append('category', activeCategory);

        const response = await fetch(`${apiUrl}/api/upload/media`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (response.ok) {
          const result = await response.json();
          const media = result.media || result.image || result;
          const path = media.file_path || media.path || media.url || '';
          const url = path.startsWith('http') ? path : `${apiUrl}${path}`;
          const sizeBytes = media.file_size || media.size || file.size;
          const fileType = media.file_type || media.mimetype || file.type || '';
          const type = fileType ? (fileType.split('/')[1] || fileType) : 'unknown';

          const newImage = {
            id: media.id,
            name: media.alt || media.name || media.title || file.name,
            url,
            size: `${(sizeBytes ? sizeBytes / 1024 : 0).toFixed(0)} KB`,
            type,
            isNew: true
          };

          setImages(prev => ({
            ...prev,
            [activeCategory]: [...prev[activeCategory], newImage]
          }));
        } else {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Upload failed');
        }
      }

      toast.success(`${files.length} image(s) uploaded successfully!`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(`Failed to upload images: ${error.message}`);
    } finally {
      setIsUploading(false);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      const response = await fetch(`${apiUrl}/api/images/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        }
      });

      if (response.ok) {
        setImages(prev => ({
          ...prev,
          [activeCategory]: prev[activeCategory].filter(img => img.id !== imageId)
        }));
        setSelectedImages(prev => prev.filter(id => id !== imageId));
        toast.success('Image deleted successfully!');
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete image');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedImages.length === 0) return;
    
    try {
      const deletePromises = selectedImages.map(id => 
        fetch(`${apiUrl}/api/images/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
          }
        })
      );
      
      await Promise.all(deletePromises);
      
      setImages(prev => ({
        ...prev,
        [activeCategory]: prev[activeCategory].filter(img => !selectedImages.includes(img.id))
      }));
      setSelectedImages([]);
      toast.success(`${selectedImages.length} image(s) deleted successfully!`);
    } catch (error) {
      console.error('Bulk delete error:', error);
      toast.error('Failed to delete images');
    }
  };

  const toggleImageSelection = (imageId) => {
    setSelectedImages(prev => 
      prev.includes(imageId) 
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const selectAllImages = () => {
    const currentImages = images[activeCategory];
    if (selectedImages.length === currentImages.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(currentImages.map(img => img.id));
    }
  };

  const handlePreviewImage = (imageUrl) => {
    window.open(imageUrl, '_blank');
  };

  const getImageTypeColor = (type) => {
    const colors = {
      jpg: 'bg-blue-100 text-blue-800',
      jpeg: 'bg-blue-100 text-blue-800',
      png: 'bg-green-100 text-green-800',
      webp: 'bg-purple-100 text-purple-800',
      svg: 'bg-yellow-100 text-yellow-800',
      ico: 'bg-red-100 text-red-800',
      gif: 'bg-pink-100 text-pink-800'
    };
    const key = (type || '').toLowerCase();
    return colors[key] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="w-full max-w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Image Management</h2>
        <div className="flex space-x-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isUploading || isLoading}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? 'Uploading...' : 'Upload Images'}
          </Button>
          {selectedImages.length > 0 && (
            <Button
              onClick={handleBulkDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Selected ({selectedImages.length})
            </Button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setActiveCategory(category.id);
                setSelectedImages([]);
              }}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeCategory === category.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.label}</span>
              <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs">
                {category.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Bulk Actions */}
      {!isLoading && images[activeCategory].length > 0 && (
        <div className="flex justify-between items-center mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedImages.length === images[activeCategory].length}
                onChange={selectAllImages}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                Select All ({images[activeCategory].length})
              </span>
            </label>
            {selectedImages.length > 0 && (
              <span className="text-sm text-blue-600">
                {selectedImages.length} selected
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500">
            Total: {images[activeCategory].reduce((acc, img) => acc + parseInt(img.size), 0)} KB
          </div>
        </div>
      )}

      {/* Images Grid */}
      {!isLoading && (
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {images[activeCategory].map((image) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className={`bg-white rounded-lg border-2 transition-all duration-200 hover:shadow-lg ${
                selectedImages.includes(image.id) 
                  ? 'border-blue-500 shadow-md' 
                  : 'border-gray-200'
              }`}
            >
              {/* Image Preview */}
              <div className="relative">
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMTAwTDEwMCAxMDBaIiBzdHJva2U9IiM5Q0E0QUYiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K';
                  }}
                />
                
                {/* Selection Checkbox */}
                <div className="absolute top-2 left-2">
                  <input
                    type="checkbox"
                    checked={selectedImages.includes(image.id)}
                    onChange={() => toggleImageSelection(image.id)}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-white"
                  />
                </div>

                {/* Branding Badge */}
                {image.isBranding && (
                  <div className="absolute top-2 right-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  </div>
                )}

                {/* New Badge */}
                {image.isNew && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    New
                  </div>
                )}

                {/* Action Buttons */}
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handlePreviewImage(image.url)}
                      className="bg-white text-gray-800 hover:bg-gray-100 p-2"
                      size="sm"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteImage(image.id)}
                      className="bg-red-500 text-white hover:bg-red-600 p-2"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Image Info */}
              <div className="p-4">
                <h3 className="font-medium text-gray-800 truncate mb-2" title={image.name}>
                  {image.name}
                </h3>
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImageTypeColor(image.type)}`}>
                    {image.type.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-500">{image.size}</span>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Upload Placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            onClick={() => fileInputRef.current?.click()}
            className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 min-h-[280px]"
          >
            <Upload className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-600 text-center">
              <span className="font-medium">Click to upload</span>
              <br />
              <span className="text-sm">or drag and drop</span>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              PNG, JPG, WEBP, SVG up to 10MB
            </p>
          </motion.div>
        </motion.div>
      )}

      {/* Empty State */}
      {!isLoading && images[activeCategory].length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">No images in this category</h3>
          <p className="text-gray-600 mb-4">Upload your first image to get started</p>
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Images
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageManagement;
