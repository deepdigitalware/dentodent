import React, { useRef, useState, useEffect } from 'react';
import { useContent } from '@/contexts/ContentContext';

const SliderBanner = () => {
  const { content, apiUrl } = useContent();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSwiping, setIsSwiping] = useState(false);
  const startXRef = useRef(null);

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
          
          if (bannerSlides.length > 1) {
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

  // Auto-slide: every 3 seconds.
  useEffect(() => {
    if (slides.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 3000);

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
      <section className="relative w-full h-[46vh] sm:h-[56vh] md:h-[72vh] lg:h-screen overflow-hidden bg-gray-200 animate-pulse">
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

  const handleSlideClick = () => {
    if (isSwiping) return;
    const slide = slides[currentSlide];
    if (slide?.linkUrl) {
      window.open(slide.linkUrl, '_blank');
    }
  };

  const handleTouchStart = (e) => {
    if (!e.touches || e.touches.length === 0) return;
    startXRef.current = e.touches[0].clientX;
    setIsSwiping(false);
  };

  const handleTouchMove = (e) => {
    if (!e.touches || e.touches.length === 0 || startXRef.current === null) return;
    const currentX = e.touches[0].clientX;
    if (Math.abs(currentX - startXRef.current) > 10) {
      setIsSwiping(true);
    }
  };

  const handleTouchEnd = (e) => {
    if (startXRef.current === null || !e.changedTouches || e.changedTouches.length === 0) {
      startXRef.current = null;
      return;
    }

    const endX = e.changedTouches[0].clientX;
    const distance = endX - startXRef.current;
    const threshold = 35;

    if (distance > threshold) {
      prevSlide();
      setIsSwiping(true);
    } else if (distance < -threshold) {
      nextSlide();
      setIsSwiping(true);
    }

    startXRef.current = null;
    // Small timeout prevents post-swipe tap from opening slide link.
    setTimeout(() => setIsSwiping(false), 120);
  };

  const handleMouseDown = (e) => {
    startXRef.current = e.clientX;
    setIsSwiping(false);
  };

  const handleMouseMove = (e) => {
    if (startXRef.current === null) return;
    if (Math.abs(e.clientX - startXRef.current) > 10) {
      setIsSwiping(true);
    }
  };

  const handleMouseUp = (e) => {
    if (startXRef.current === null) return;
    const distance = e.clientX - startXRef.current;
    if (distance > 35) prevSlide();
    else if (distance < -35) nextSlide();
    startXRef.current = null;
    setTimeout(() => setIsSwiping(false), 120);
  };

  const handleMouseLeave = () => {
    startXRef.current = null;
  };

  const handleCtaClick = (e) => {
    e.stopPropagation();
    const slide = slides[currentSlide];
    if (slide?.linkUrl) {
      window.open(slide.linkUrl, '_blank');
    }
  };

  const current = slides[currentSlide];

  return (
    <section
      className="relative w-full md:h-[72vh] lg:h-screen overflow-hidden z-10 pt-0 md:pt-0 cursor-pointer touch-pan-y"
      onClick={handleSlideClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {/* Keep full banner visible on small screens and use cover from tablet/desktop. */}
      <div className="relative md:absolute md:inset-0 transition-all duration-700 ease-in-out md:bg-[#eef2f7]">
        <img
          src={current.image}
          alt={current.title || 'Banner image'}
          className="w-full h-auto md:h-full object-cover object-center"
          loading="eager"
          draggable="false"
        />
      </div>

      {/* Navigation Arrows - hidden on mobile for better UX */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          prevSlide();
        }}
        className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-2 md:p-3 rounded-full transition-all duration-300 backdrop-blur-sm hidden md:block"
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
        className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-2 md:p-3 rounded-full transition-all duration-300 backdrop-blur-sm hidden md:block"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-2 sm:bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-1.5 md:gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              goToSlide(index);
            }}
            className={`w-3 h-3 md:w-3.5 md:h-3.5 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white border border-gray-300/60'
                : 'bg-gray-400/60 hover:bg-gray-400/80'
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
