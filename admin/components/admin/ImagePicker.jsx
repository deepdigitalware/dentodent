import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image as ImageIcon, Check, Search, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useContent } from '@/contexts/ContentContext';
import { toast } from 'react-hot-toast';

const ImagePicker = ({ value, onChange, section = 'general', label = 'Image', disabled = false }) => {
  const { apiUrl } = useContent();
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef(null);

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/images`);
      if (response.ok) {
        const data = await response.json();
        setImages(data);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('Failed to load images');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchImages();
    }
  }, [isOpen]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('section', section);

    setIsUploading(true);
    try {
      const response = await fetch(`${apiUrl}/api/upload/image`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const newImage = await response.json();
        setImages([newImage, ...images]);
        onChange(newImage.url); // Auto-select the uploaded image
        setIsOpen(false);
        toast.success('Image uploaded successfully');
      } else {
        toast.error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload error');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    
    try {
      const res = await fetch(`${apiUrl}/api/images/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setImages(images.filter(img => img.id !== id));
        toast.success('Image deleted');
      } else {
        toast.error('Failed to delete image');
      }
    } catch (err) {
      toast.error('Error deleting image');
    }
  };

  const filteredImages = images.filter(img => 
    img.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (img.section && img.section.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      
      <div className="flex items-center space-x-4">
        <div className="relative w-24 h-24 border rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
          {value ? (
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-8 h-8 text-gray-400" />
          )}
        </div>
        
        <div className="flex flex-col space-y-2">
          {!disabled && (
            <Button 
              onClick={() => setIsOpen(true)}
              variant="outline"
              type="button"
              className="flex items-center"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Select Image
            </Button>
          )}
          
          {value && !disabled && (
            <Button 
              onClick={() => onChange('')}
              variant="ghost" 
              type="button"
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              Remove
            </Button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col"
            >
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-xl font-bold">Media Library</h3>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-4 border-b bg-gray-50 flex flex-wrap gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search images..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isUploading ? 'Uploading...' : 'Upload New Image'}
                    {!isUploading && <Upload className="w-4 h-4 ml-2" />}
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filteredImages.map((img) => (
                      <div 
                        key={img.id}
                        onClick={() => {
                          onChange(img.url);
                          setIsOpen(false);
                        }}
                        className={`group relative aspect-square bg-white rounded-lg overflow-hidden cursor-pointer border-2 hover:border-blue-500 transition-all ${value === img.url ? 'border-blue-600 ring-2 ring-blue-200' : 'border-transparent shadow-sm'}`}
                      >
                        <img 
                          src={img.url} 
                          alt={img.name} 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
                          {value === img.url && (
                            <div className="bg-blue-600 text-white rounded-full p-1 shadow-lg">
                              <Check className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                          {img.name}
                        </div>
                        <button
                            onClick={(e) => handleDelete(e, img.id)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-opacity"
                            title="Delete Image"
                        >
                            <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {filteredImages.length === 0 && (
                      <div className="col-span-full text-center py-12 text-gray-500">
                        No images found. Upload one to get started!
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImagePicker;