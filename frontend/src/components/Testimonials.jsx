import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useContent } from '@/contexts/ContentContext';
import WhatsAppIcon from '@/components/WhatsAppIcon';

const Testimonials = () => {
  const { content } = useContent();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const carouselRef = useRef(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize, { passive: true }); // Add passive for better performance
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const reviewsSource = Array.isArray(content.reviews)
    ? content.reviews
    : Array.isArray(content.reviews?.items)
      ? content.reviews.items
      : [];

  const normalizedReviews = (() => {
    if (Array.isArray(reviewsSource) && reviewsSource.length > 0) {
      return reviewsSource;
    }

    return [
      {
        name: 'Priya Sharma',
        rating: 5,
        message: 'Very professional and friendly staff. My root canal was completely painless and the doctor explained every step clearly.',
        date: '2024-01-15'
      },
      {
        name: 'Rahul Verma',
        rating: 5,
        message: 'Clean clinic, modern equipment and excellent treatment. I am very happy with my smile makeover.',
        date: '2024-02-03'
      },
      {
        name: 'Ananya Gupta',
        rating: 4,
        message: 'Got my teeth cleaning and fillings done. The team was patient and made sure I was comfortable throughout.',
        date: '2024-02-20'
      }
    ];
  })();

  const testimonialsData = normalizedReviews
    .map((review) => {
      const rawDate = review.date;
      let formattedDate = rawDate;

      if (rawDate) {
        const d = new Date(rawDate);
        if (!Number.isNaN(d.getTime())) {
          formattedDate = d.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
        }
      }

      return {
        name: review.name || 'Patient',
        rating: Number.isFinite(Number(review.rating)) ? Number(review.rating) : 5,
        text: review.message || review.comment || '',
        date: formattedDate
      };
    })
    .filter((item) => item.text);

  const cardsPerSlide = isDesktop ? 3 : 1;
  const rawTotal = Math.ceil((Array.isArray(testimonialsData) ? testimonialsData.length : 0) / (cardsPerSlide || 1));
  const totalSlides = Number.isFinite(rawTotal) && rawTotal > 0 ? rawTotal : 1;

  // Auto-play functionality with reduced frequency for better performance
  useEffect(() => {
    if (totalSlides <= 1) return; // Don't auto-play if there's only one slide
    
    const autoPlay = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 8000); // Change slide every 8 seconds instead of 5 for better performance

    return () => clearInterval(autoPlay);
  }, [totalSlides]);

  const nextSlide = () => {
    if (totalSlides <= 0) return;
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    if (totalSlides <= 0) return;
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    if (totalSlides <= 0) return;
    setCurrentIndex(index);
  };

  const getCurrentSlideTestimonials = () => {
    const start = currentIndex * cardsPerSlide;
    return testimonialsData.slice(start, start + cardsPerSlide);
  };

  // Touch handlers for swipe functionality
  const handleTouchStart = (e) => {
    setTouchEnd(0); // Reset touchEnd
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentIndex < totalSlides - 1) {
      nextSlide();
    }
    if (isRightSwipe && currentIndex > 0) {
      prevSlide();
    }
  };

  const handleBookAppointment = () => {
    if (typeof window !== 'undefined') {
      window.open('https://wa.me/916290093271', '_blank');
    }
  };

  return (
    <section className="py-16 md:py-20 pb-20 md:pb-24 bg-white">
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
            {content.testimonials.title}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {content.testimonials.subtitle}
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className={`absolute left-0 md:-left-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-1.5 md:p-2 hover:bg-gray-50 transition-all duration-300 hover:scale-110 ${
              currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={currentIndex === 0}
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-gray-600" />
          </button>
          
          <button
            onClick={nextSlide}
            className={`absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-1.5 md:p-2 hover:bg-gray-50 transition-all duration-300 hover:scale-110 ${
              currentIndex === totalSlides - 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={currentIndex === totalSlides - 1}
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-4 h-4 md:w-6 md:h-6 text-gray-600" />
          </button>

          {/* Carousel Container */}
          <div 
            className="overflow-hidden rounded-2xl pb-4"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <motion.div
              ref={carouselRef}
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div
                  key={slideIndex}
                  className={`flex-shrink-0 w-full flex ${
                    isDesktop ? 'gap-6 md:gap-8' : 'gap-0'
                  }`}
                >
                  {testimonialsData
                    .slice(slideIndex * cardsPerSlide, (slideIndex + 1) * cardsPerSlide)
                    .map((testimonial, cardIndex) => (
                      <motion.div
                        key={`${slideIndex}-${cardIndex}`}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: cardIndex * 0.1 }}
                        viewport={{ once: true, amount: 0.1 }} // Reduce amount for better performance
                        className={`bg-gradient-to-br from-white to-blue-50 rounded-2xl p-4 md:p-6 pb-8 md:pb-10 shadow-lg hover:shadow-xl transition-all duration-300 card-3d relative overflow-hidden ${
                          isDesktop ? 'flex-1' : 'w-full'
                        }`}
                      >
                        {/* Quote Icon */}
                        <div className="absolute top-3 md:top-4 right-3 md:right-4 opacity-10">
                          <Quote className="w-12 h-12 md:w-16 md:h-16 text-blue-600" />
                        </div>

                        {/* Rating */}
                        <div className="flex items-center mb-3 md:mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current" />
                          ))}
                        </div>

                        {/* Testimonial Text */}
                        <p className="text-gray-700 mb-4 md:mb-6 leading-relaxed text-sm md:text-base relative z-10">
                          "{testimonial.text}"
                        </p>

                        {/* Date */}
                        <div className="mb-3 md:mb-4">
                          <span className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 px-2.5 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium">
                            {testimonial.date}
                          </span>
                        </div>

                        {/* Patient Info */}
                        <div className="border-t pt-3 md:pt-4">
                          <h4 className="font-semibold text-gray-800 text-sm md:text-base">{testimonial.name}</h4>
                        </div>

                        {/* Decorative Element */}
                        <div className="absolute bottom-1 md:bottom-2 right-1 md:right-2 w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full opacity-20 blur-xl"></div>
                      </motion.div>
                    ))}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-6 md:mt-8 space-x-1.5 md:space-x-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-blue-600 scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Stats Section */}
        {content.testimonials.stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 mt-12 md:mt-16"
          >
            {content.testimonials.stats.map((stat, index) => (
              <div key={index} className="bg-gradient-to-br from-white to-blue-50 p-4 md:p-6 rounded-2xl shadow-lg text-center">
                <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">{stat.number}</div>
                <div className="text-sm md:text-base text-gray-600">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.1 }} // Reduce amount for better performance
          className="text-center mt-12 md:mt-16"
        >
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl md:rounded-3xl p-6 md:p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Inspired by Our Patients?</h3>
            <p className="text-base md:text-xl mb-4 md:mb-6 opacity-90">
              Join our community of satisfied patients and experience the Dent 'O' Dent difference.
            </p>
            <Button
              onClick={handleBookAppointment}
              className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-2.5 md:px-8 md:py-3 rounded-full font-semibold text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center mx-auto gap-2"
            >
              <span className="bg-blue-600 text-white rounded-full p-1.5">
                <WhatsAppIcon className="w-4 h-4" />
              </span>
              <span>Book a Free Appointment</span>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
