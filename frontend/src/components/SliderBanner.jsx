import React, { useState, useEffect } from 'react';
import { useContent } from '@/contexts/ContentContext';

const SliderBanner = () => {
  const { content, apiUrl } = useContent();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch banners from the new API endpoint
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/banners`);
        if (response.ok) {
          const banners = await response.json();
          // Convert banners to slides format
          const bannerSlides = banners
            .filter(banner => banner.is_active)
            .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
            .map((banner, i) => ({
              id: banner.id,
              image: banner.image_url,
              title: banner.title,
              subtitle: banner.subtitle,
              linkUrl: banner.link_url,
              linkLabel: banner.link_label || 'Learn More',
              order: banner.display_order || i
            }));
          
          if (bannerSlides.length > 0) {
            setSlides(bannerSlides);
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.warn('Failed to fetch banners from new API, falling back to content API:', error);
      }
      
      // Fallback to content API
      const rawSlides = (content.slider?.slides && content.slider.slides.length > 0)
        ? content.slider.slides
        : ((content.slider?.images && content.slider.images.length > 0)
          ? content.slider.images.map((url, i) => ({ imageUrl: url, order: i, active: true }))
          : ((content.slider?.items && content.slider.items.length > 0)
            ? content.slider.items.map((item, i) => ({ 
                imageUrl: item.image || item.imageUrl, 
                title: item.title,
                subtitle: item.subtitle,
                linkUrl: item.linkUrl,
                linkLabel: item.linkLabel,
                order: i, 
                active: true 
              }))
            : []));

      const convertedSlides = rawSlides
        .filter((s) => s && s.active !== false)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((s, i) => {
          const img =
            typeof s === 'string'
              ? (s.startsWith('/assets/') || s.startsWith('http') ? s : undefined)
              : (s.imageUrl?.startsWith('/assets/') ? s.imageUrl : (s.image?.startsWith('/assets/') ? s.image : s.imageUrl || s.image));
          return {
            id: i + 1,
            image: img,
            title: typeof s === 'object' ? s.title : undefined,
            subtitle: typeof s === 'object' ? s.subtitle : undefined,
            linkUrl: typeof s === 'object' ? s.linkUrl : undefined,
            linkLabel: typeof s === 'object' ? s.linkLabel : undefined
          };
        })
        .filter((s) => !!s.image);
      
      setSlides(convertedSlides);
      setLoading(false);
    };
    
    fetchBanners();
  }, [content, apiUrl]);

  // Preload images to avoid white flash
  useEffect(() => {
    slides.forEach(s => {
      const img = new Image();
      img.src = s.image;
    });
  }, [slides]);

  // Auto-slide functionality with reduced frequency for better performance
  useEffect(() => {
    if (slides.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 2500); // Change slide every 2.5 seconds

      return () => clearInterval(timer);
    }
  }, [slides.length]);

  const nextSlide = () => {
    if (slides.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }
  };

  const prevSlide = () => {
    if (slides.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Show loading state
  if (loading) {
    return (
      <section className="relative w-full h-96 md:h-screen overflow-hidden bg-gray-200 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-500">Loading slider...</div>
        </div>
      </section>
    );
  }

  // Don't render anything if no slides
  if (slides.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full min-h-screen overflow-hidden z-10 pt-0 md:pt-0">
      {/* Slides - no fade, instant switch */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
        style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
      />

      {/* Navigation Arrows - hidden on mobile for better UX */}
      <button
        onClick={prevSlide}
        className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-2 md:p-3 rounded-full transition-all duration-300 backdrop-blur-sm hidden md:block"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-2 md:p-3 rounded-full transition-all duration-300 backdrop-blur-sm hidden md:block"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2 md:space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar removed to avoid fade/flash delays */}
    </section>
  );
};

export default SliderBanner;
