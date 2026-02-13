import React, { useState, useEffect } from 'react';
import { useBanners } from '@/contexts/BannersContext';

const BannerSlider = () => {
  const { banners, loading, error } = useBanners();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide functionality
  useEffect(() => {
    if (banners.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
      }, 5000); // Change slide every 5 seconds

      return () => clearInterval(timer);
    }
  }, [banners.length]);

  const nextSlide = () => {
    if (banners.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }
  };

  const prevSlide = () => {
    if (banners.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    }
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleBannerClick = (linkUrl) => {
    if (linkUrl) {
      window.open(linkUrl, '_blank');
    }
  };

  // Show loading state
  if (loading) {
    return (
      <section className="relative w-full h-96 md:h-screen overflow-hidden bg-gray-200 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-500">Loading banners...</div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    console.error('BannerSlider error:', error);
    return (
      <section className="relative w-full h-96 md:h-screen overflow-hidden bg-red-50">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-red-500">Failed to load banners</div>
        </div>
      </section>
    );
  }

  // Don't render anything if no banners
  if (banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentSlide];

  return (
    <section className="relative w-full min-h-screen overflow-hidden z-10 pt-0 md:pt-0">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out cursor-pointer"
        style={{ backgroundImage: `url(${currentBanner.image_url})` }}
        onClick={() => handleBannerClick(currentBanner.link_url)}
      />

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Banner content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 py-20 md:py-0">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 max-w-4xl">
          {currentBanner.title}
        </h1>
        {currentBanner.subtitle && (
          <p className="text-lg md:text-xl text-white mb-8 max-w-2xl">
            {currentBanner.subtitle}
          </p>
        )}
        {currentBanner.link_url && currentBanner.link_label && (
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105"
            onClick={(e) => {
              e.stopPropagation();
              handleBannerClick(currentBanner.link_url);
            }}
          >
            {currentBanner.link_label || 'Learn More'}
          </button>
        )}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          prevSlide();
        }}
        className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-2 md:p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          nextSlide();
        }}
        className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-2 md:p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2 md:space-x-3">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              goToSlide(index);
            }}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default BannerSlider;