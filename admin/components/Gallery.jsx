import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Heart, Share2, Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const categories = [
    { id: 'all', label: 'All Photos', count: 24 },
    { id: 'before-after', label: 'Before & After', count: 8 },
    { id: 'treatments', label: 'Treatments', count: 6 },
    { id: 'clinic', label: 'Clinic', count: 5 },
    { id: 'team', label: 'Team', count: 3 },
    { id: 'technology', label: 'Technology', count: 2 }
  ];

  // Load local gallery assets if available using Vite's import.meta.glob
  const localGalleryFiles = (() => {
    try {
      // Eagerly import as URLs so images can be used directly
      return import.meta.glob('/src/assets/gallery/*.{jpg,jpeg,png,webp,avif}', { eager: true, as: 'url' });
    } catch (e) {
      return {};
    }
  })();

  const mapFileToImage = (path, url, idx) => {
    const file = path.split('/').pop() || `image-${idx}`;
    const lower = file.toLowerCase();
    const category = lower.startsWith('before-after')
      ? 'before-after'
      : lower.startsWith('treatments')
      ? 'treatments'
      : lower.startsWith('clinic')
      ? 'clinic'
      : lower.startsWith('team')
      ? 'team'
      : lower.startsWith('technology')
      ? 'technology'
      : 'all';
    const title = file.replace(/[-_]/g, ' ').replace(/\.(jpg|jpeg|png|webp|avif)$/i, '');
    return {
      id: 1000 + idx,
      src: url,
      alt: title,
      category,
      title,
      description: 'Clinic gallery image',
      likes: 0,
      isLiked: false,
    };
  };

  const localImages = Object.keys(localGalleryFiles).map((p, i) => mapFileToImage(p, localGalleryFiles[p], i));

  const galleryImages = localImages.length > 0 ? localImages : [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800',
      alt: 'Teeth Whitening Before & After',
      category: 'before-after',
      title: 'Teeth Whitening Transformation',
      description: 'Professional teeth whitening results showing dramatic improvement',
      likes: 45,
      isLiked: false
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800',
      alt: 'Dental Implant Procedure',
      category: 'treatments',
      title: 'Dental Implant Surgery',
      description: 'Advanced dental implant procedure with precision placement',
      likes: 32,
      isLiked: true
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1629909613638-0e4a1fad8f81?w=800',
      alt: 'Modern Dental Clinic',
      category: 'clinic',
      title: 'State-of-the-Art Clinic',
      description: 'Our modern clinic equipped with latest dental technology',
      likes: 28,
      isLiked: false
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1690306815553-a41b3acd99cd?w=800',
      alt: 'Orthodontic Treatment',
      category: 'treatments',
      title: 'Orthodontic Treatment',
      description: 'Comprehensive orthodontic care for perfect smile alignment',
      likes: 41,
      isLiked: true
    },
    {
      id: 5,
      src: 'https://images.unsplash.com/photo-1598911642263-b81130ed8ce8?w=800',
      alt: 'Happy Patient Smile',
      category: 'before-after',
      title: 'Smile Makeover Success',
      description: 'Complete smile transformation with cosmetic dentistry',
      likes: 67,
      isLiked: false
    },
    {
      id: 6,
      src: 'https://images.unsplash.com/photo-1683349370055-7eba66a404c6?w=800',
      alt: 'Dr. Chakraborty at Work',
      category: 'team',
      title: 'Expert Care in Action',
      description: 'Dr. Chakraborty providing expert dental care to patients',
      likes: 38,
      isLiked: true
    },
    {
      id: 7,
      src: 'https://images.unsplash.com/photo-1694011224702-4f9c680378c5?w=800',
      alt: 'Dental Technology',
      category: 'technology',
      title: 'Advanced Dental Technology',
      description: 'Latest dental equipment for precise and comfortable treatment',
      likes: 29,
      isLiked: false
    },
    {
      id: 8,
      src: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800',
      alt: 'Root Canal Treatment',
      category: 'treatments',
      title: 'Root Canal Therapy',
      description: 'Pain-free root canal treatment with modern techniques',
      likes: 35,
      isLiked: false
    }
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

  const handleLike = (imageId) => {
    toast({
      title: "❤️ Like Added",
      description: "Thank you for your appreciation!"
    });
  };

  const handleDownload = (imageUrl) => {
    toast({
      title: "📥 Download Started",
      description: "Image download will begin shortly"
    });
  };

  const handleShare = (image) => {
    toast({
      title: "🔗 Share Link",
      description: "Share link copied to clipboard!"
    });
  };

  return (
    <section id="gallery" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
            Our <span className="gradient-text">Gallery</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our collection of before & after photos, treatment procedures, 
            and state-of-the-art clinic facilities. See the quality of our work 
            and the beautiful smiles we create.
          </p>
        </motion.div>

        {/* Filters and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0"
        >
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveFilter(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
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
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all duration-300 ${
                viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-blue-50'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all duration-300 ${
                viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-blue-50'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          layout
          className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
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
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden card-3d group ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                <div className={`relative ${viewMode === 'list' ? 'w-1/3' : 'w-full'} h-64`}>
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => handleImageClick(image)}
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleImageClick(image)}
                        className="bg-white text-gray-800 hover:bg-gray-100 p-2"
                        size="sm"
                      >
                        <Filter className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleLike(image.id)}
                        className={`p-2 ${
                          image.isLiked 
                            ? 'bg-red-500 text-white hover:bg-red-600' 
                            : 'bg-white text-gray-800 hover:bg-gray-100'
                        }`}
                        size="sm"
                      >
                        <Heart className={`w-4 h-4 ${image.isLiked ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700">
                      {categories.find(cat => cat.id === image.category)?.label}
                    </span>
                  </div>
                </div>

                <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{image.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{image.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Heart className={`w-4 h-4 ${image.isLiked ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                        <span>{image.likes}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleDownload(image.src)}
                        variant="outline"
                        size="sm"
                        className="text-gray-600 hover:text-blue-600"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleShare(image)}
                        variant="outline"
                        size="sm"
                        className="text-gray-600 hover:text-blue-600"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
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
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-8 text-white">
            <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Smile?</h3>
            <p className="text-xl mb-6 opacity-90">
              Schedule a consultation today and see how we can help you achieve 
              the perfect smile you've always wanted.
            </p>
            <Button
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
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
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
              
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-full h-auto max-h-[70vh] object-cover"
              />
              
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedImage.title}</h3>
                <p className="text-gray-600 mb-4">{selectedImage.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      onClick={() => handleLike(selectedImage.id)}
                      className={`flex items-center space-x-2 ${
                        selectedImage.isLiked 
                          ? 'bg-red-500 text-white hover:bg-red-600' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${selectedImage.isLiked ? 'fill-current' : ''}`} />
                      <span>{selectedImage.likes}</span>
                    </Button>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleDownload(selectedImage.src)}
                      className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      onClick={() => handleShare(selectedImage)}
                      variant="outline"
                      className="border-blue-600 text-blue-600 hover:bg-blue-50"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
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
