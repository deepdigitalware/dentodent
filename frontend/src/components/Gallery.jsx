import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share2, Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useContent } from '@/contexts/ContentContext';

const FALLBACK_GALLERY_IMAGES = [
  {
    id: 1,
    src: 'https://images.pexels.com/photos/6812529/pexels-photo-6812529.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: 'Modern dental chair in treatment room',
    category: 'clinic',
    title: 'State-of-the-Art Clinic',
    description: 'Advanced treatment rooms designed for your comfort.',
    likes: 0,
    isLiked: false
  },
  {
    id: 2,
    src: 'https://images.pexels.com/photos/6812599/pexels-photo-6812599.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: 'Dentist examining patient',
    category: 'treatments',
    title: 'Gentle Dental Care',
    description: 'Experienced dentists providing painless treatments.',
    likes: 0,
    isLiked: false
  },
  {
    id: 3,
    src: 'https://images.pexels.com/photos/5355692/pexels-photo-5355692.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: 'Dental instruments on tray',
    category: 'equipment',
    title: 'Sterilized Instruments',
    description: 'Strict hygiene protocols for every procedure.',
    likes: 0,
    isLiked: false
  },
  {
    id: 4,
    src: 'https://images.pexels.com/photos/5355717/pexels-photo-5355717.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: 'Smiling patient after treatment',
    category: 'smiles',
    title: 'Happy Smiles',
    description: 'Transforming smiles with cosmetic dentistry.',
    likes: 0,
    isLiked: false
  }
];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const { apiUrl } = useContent();
  const [apiImages, setApiImages] = useState([]);
  const [isLoadingApi, setIsLoadingApi] = useState(true);

  // Fetch gallery images from API (category=gallery) with graceful fallback
  useEffect(() => {
    let cancelled = false;
    const loadFromApi = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/images?category=gallery`);
        if (!res.ok) throw new Error(`Failed to load images: ${res.status}`);
        const data = await res.json();
        const items = Array.isArray(data) ? data : (data.images || []);
        const mapped = items
          .map((img, i) => ({
            id: img.id || img._id || i + 1,
            src: img.url || img.path || img.imageUrl || img.link,
            alt: img.name || img.title || 'Gallery image',
            category: img.category || 'gallery',
            title: img.title || img.name || 'Gallery',
            description: img.description || 'Clinic gallery image',
            likes: img.likes || 0,
            isLiked: false,
          }))
          .filter(x => !!x.src);
        if (!cancelled) setApiImages(mapped);
      } catch (e) {
        console.warn('[Gallery] API images unavailable, using local assets. Reason:', e?.message || e);
      } finally {
        if (!cancelled) setIsLoadingApi(false);
      }
    };
    loadFromApi();
    return () => { cancelled = true; };
  }, [apiUrl]);

  // Use API images when available, otherwise fall back to default demo images
  const galleryImages = apiImages.length > 0 ? apiImages : FALLBACK_GALLERY_IMAGES;

  // Build categories dynamically from available images
  const toLabel = (id) => id.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  const counts = galleryImages.reduce((acc, img) => {
    const cat = img.category || 'gallery';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});
  const categories = [
    { id: 'all', label: 'All Photos', count: galleryImages.length },
    ...Object.keys(counts).sort().map(cat => ({ id: cat, label: toLabel(cat), count: counts[cat] }))
  ];

  const filteredImages = activeFilter === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeFilter);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  // Download and share actions removed per production requirements

  return (
    <section id="gallery" className="py-16 md:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.1 }} // Reduce amount for better performance
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-display font-bold mb-4 md:mb-6">
            Gallery
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Browse images uploaded via the admin panel.
          </p>
          {isLoadingApi && (
            <p className="mt-2 text-sm text-gray-500">Loading images…</p>
          )}
          {!isLoadingApi && galleryImages.length === 0 && (
            <p className="mt-2 text-sm text-gray-500">No gallery images available yet.</p>
          )}
        </motion.div>

        {/* Filters and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.1 }} // Reduce amount for better performance
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 space-y-3 sm:space-y-0"
        >
          {/* Category Filters */}
          <div className="flex flex-wrap gap-1.5 md:gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveFilter(category.id)}
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 ${
                  activeFilter === category.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                {category.label} ({category.count})
              </button>
            ))}
          </div>

          {/* View Controls */}
          <div className="flex items-center space-x-1.5 md:space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 md:p-2 rounded-lg transition-all duration-300 ${
                viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-blue-50'
              }`}
              aria-label="Grid view"
            >
              <Grid className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 md:p-2 rounded-lg transition-all duration-300 ${
                viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-blue-50'
              }`}
              aria-label="List view"
            >
              <List className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          layout
          className={`grid gap-4 md:gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
              : 'grid-cols-1'
          }`}
        >
          <AnimatePresence>
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, delay: index * 0.05 }} // Reduce delay for better performance
                className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden card-3d group ${
                  viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''
                }`}
              >
                <div className={`relative ${viewMode === 'list' ? 'w-full sm:w-1/3' : 'w-full'} h-48 md:h-64`}>
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => handleImageClick(image)}
                    loading="lazy"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-1.5 md:space-x-2">
                      <Button
                        onClick={() => handleImageClick(image)}
                        className="bg-white text-gray-800 hover:bg-gray-100 p-1.5 md:p-2"
                        size="sm"
                        aria-label="View image"
                      >
                        <Filter className="w-3 h-3 md:w-4 md:h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 md:top-4 md:left-4">
                    <span className="bg-white/90 backdrop-blur-sm px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-medium text-gray-700">
                      {categories.find(cat => cat.id === image.category)?.label}
                    </span>
                  </div>
                </div>

                <div className={`p-4 md:p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1.5 md:mb-2">{image.title}</h3>
                  <p className="text-gray-600 text-xs md:text-sm mb-3 md:mb-4">{image.description}</p>
                  
                  <div className="flex items-center justify-between" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.1 }} // Reduce amount for better performance
          className="text-center mt-12 md:mt-16"
        >
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl md:rounded-3xl p-6 md:p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Ready to Transform Your Smile?</h3>
            <p className="text-base md:text-xl mb-4 md:mb-6 opacity-90">
              Schedule a consultation today and see how we can help you achieve 
              the perfect smile you've always wanted.
            </p>
            <Button
              className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-2.5 md:px-8 md:py-3 rounded-full font-semibold text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Book Your Consultation
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-2 md:p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleCloseModal}
                className="absolute top-3 right-3 md:top-4 md:right-4 z-10 bg-white/90 backdrop-blur-sm p-1.5 md:p-2 rounded-full hover:bg-white transition-colors"
                aria-label="Close image"
              >
                <X className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
              </button>
              
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-full h-auto max-h-[60vh] md:max-h-[70vh] object-contain"
                loading="eager"
              />
              
              <div className="p-4 md:p-6">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-1.5 md:mb-2">{selectedImage.title}</h3>
                <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base">{selectedImage.description}</p>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex space-x-2 ml-auto">
                    <Button
                      onClick={() => handleDownload(selectedImage.src)}
                      className="bg-blue-600 text-white hover:bg-blue-700 py-1.5 md:py-2 px-3 md:px-4 text-sm md:text-base"
                    >
                      <Download className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" />
                      Download
                    </Button>
                    <Button
                      onClick={() => handleShare(selectedImage)}
                      variant="outline"
                      className="border-blue-600 text-blue-600 hover:bg-blue-50 py-1.5 md:py-2 px-3 md:px-4 text-sm md:text-base"
                    >
                      <Share2 className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
