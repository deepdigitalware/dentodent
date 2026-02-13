import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import chevronLeft from '@/assets/icons/chevron-left.svg';
import chevronRight from '@/assets/icons/chevron-right.svg';
import slide1 from '@/assets/images/banner/slide1.svg';
import slide2 from '@/assets/images/banner/slide2.svg';
import slide3 from '@/assets/images/banner/slide3.svg';

const SliderBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 1, image: slide1 },
    { id: 2, image: slide2 },
    { id: 3, image: slide3 }
  ];

  // Preload images to avoid white flash
  useEffect(() => {
    slides.forEach(s => {
      const img = new Image();
      img.src = s.image;
    });
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 2500);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative w-full min-h-screen overflow-hidden z-10 pt-0 md:pt-0">
      {/* Slides - no fade, instant switch */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
      />

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
      >
        <img src={chevronLeft} alt="Previous" className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
      >
        <img src={chevronRight} alt="Next" className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>

      {/* Progress Bar removed to avoid fade/flash delays */}
    </section>
  );
};

export default SliderBanner;
