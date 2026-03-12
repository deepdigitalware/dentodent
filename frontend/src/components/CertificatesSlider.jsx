import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useContent } from '@/contexts/ContentContext';

const fallbackSection = {
  title: 'Our Certifications & Recognition',
  subtitle: 'Verified credentials and certifications that reflect our commitment to safe, ethical, and modern dental care.',
  items: [
    {
      title: 'Clinical Excellence Certificate',
      description: 'Recognized for high standards in patient safety and clinical protocols.',
      imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&auto=format&fit=crop'
    },
    {
      title: 'Advanced Implantology Training',
      description: 'Completion of advanced implant planning and restoration workflow training.',
      imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&auto=format&fit=crop'
    },
    {
      title: 'Digital Dentistry Certification',
      description: 'Certified usage of digital diagnostics and treatment planning systems.',
      imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&auto=format&fit=crop'
    }
  ]
};

const CertificatesSlider = () => {
  const { content } = useContent();
  const section = content?.certificates && typeof content.certificates === 'object'
    ? content.certificates
    : fallbackSection;

  const items = useMemo(() => {
    const list = Array.isArray(section?.items) ? section.items : [];
    return (list.length > 0 ? list : fallbackSection.items).filter((item) => item?.imageUrl);
  }, [section]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerSlide, setCardsPerSlide] = useState(3);
  const [touchStartX, setTouchStartX] = useState(null);
  const [mouseStartX, setMouseStartX] = useState(null);
  const totalSlides = Math.max(1, Math.ceil(items.length / cardsPerSlide));

  useEffect(() => {
    const updateCardsPerSlide = () => {
      const width = window.innerWidth || 0;
      if (width < 640) {
        setCardsPerSlide(1);
      } else if (width < 1024) {
        setCardsPerSlide(2);
      } else {
        setCardsPerSlide(3);
      }
    };

    updateCardsPerSlide();
    window.addEventListener('resize', updateCardsPerSlide, { passive: true });
    return () => window.removeEventListener('resize', updateCardsPerSlide);
  }, []);

  useEffect(() => {
    if (currentIndex > totalSlides - 1) {
      setCurrentIndex(0);
    }
  }, [currentIndex, totalSlides]);

  useEffect(() => {
    if (totalSlides <= 1) return undefined;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 2000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  const next = () => setCurrentIndex((prev) => (prev + 1) % totalSlides);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);

  const handleTouchStart = (e) => {
    if (!e.touches || e.touches.length === 0) return;
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null || !e.changedTouches || e.changedTouches.length === 0) {
      setTouchStartX(null);
      return;
    }

    const endX = e.changedTouches[0].clientX;
    const distance = endX - touchStartX;
    if (distance > 50) prev();
    if (distance < -50) next();
    setTouchStartX(null);
  };

  const handleMouseDown = (e) => {
    setMouseStartX(e.clientX);
  };

  const handleMouseUp = (e) => {
    if (mouseStartX === null) return;
    const distance = e.clientX - mouseStartX;
    if (distance > 50) prev();
    if (distance < -50) next();
    setMouseStartX(null);
  };

  const handleMouseLeave = () => {
    setMouseStartX(null);
  };

  return (
    <section id="certificates" className="py-16 md:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.1 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-display font-bold mb-4 md:mb-6">
            {section?.title || fallbackSection.title}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {section?.subtitle || fallbackSection.subtitle}
          </p>
        </motion.div>

        <div className="relative">
          {totalSlides > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous certificates slide"
                className="absolute left-0 md:-left-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-1.5 md:p-2 hover:bg-gray-50 transition-all"
              >
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-blue-700" />
              </button>
              <button
                onClick={next}
                aria-label="Next certificates slide"
                className="absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-1.5 md:p-2 hover:bg-gray-50 transition-all"
              >
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-blue-700" />
              </button>
            </>
          )}

          <div
            className="overflow-hidden rounded-2xl"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            <motion.div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => {
                const start = slideIndex * cardsPerSlide;
                const group = items.slice(start, start + cardsPerSlide);
                return (
                  <div key={slideIndex} className="w-full flex-shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                    {group.map((item, idx) => (
                      <article key={`${slideIndex}-${idx}`} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100/70">
                        <div className="aspect-video w-full">
                          <img
                            src={item.imageUrl}
                            alt={item.title || 'Certificate'}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            draggable="false"
                          />
                        </div>
                      </article>
                    ))}
                  </div>
                );
              })}
            </motion.div>
          </div>

          {totalSlides > 1 && (
            <div className="flex justify-center mt-6 md:mt-8 gap-2">
              {Array.from({ length: totalSlides }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to certificates slide ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all ${idx === currentIndex ? 'w-6 bg-blue-600' : 'w-2.5 bg-blue-200 hover:bg-blue-300'}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CertificatesSlider;