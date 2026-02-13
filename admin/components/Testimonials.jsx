import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const Testimonials = () => {
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
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const testimonials = [
    {
      name: 'Priya Sharma',
      location: 'Salt Lake, Kolkata',
      rating: 5,
      text: 'Dr. Chakraborty transformed my smile completely! The entire team at Dent O Dent is professional, caring, and uses the latest technology. I couldn\'t be happier with my dental implants.',
      treatment: 'Dental Implants'
    },
    {
      name: 'Rajesh Kumar',
      location: 'Park Street, Kolkata',
      rating: 5,
      text: 'Excellent service and pain-free treatment. The clinic is modern and hygienic. Dr. Chakraborty explained everything clearly and made me feel comfortable throughout the procedure.',
      treatment: 'Root Canal Treatment'
    },
    {
      name: 'Anita Das',
      location: 'Ballygunge, Kolkata',
      rating: 5,
      text: 'My daughter was scared of dentists, but the team here made her feel so comfortable. The pediatric care is exceptional, and now she actually looks forward to her dental visits!',
      treatment: 'Pediatric Care'
    },
    {
      name: 'Suresh Agarwal',
      location: 'Howrah, West Bengal',
      rating: 5,
      text: 'I had a complex case requiring multiple procedures. Dr. Chakraborty\'s expertise and the clinic\'s advanced equipment made everything smooth. Highly recommend for any dental work.',
      treatment: 'Full Mouth Rehabilitation'
    },
    {
      name: 'Meera Banerjee',
      location: 'New Town, Kolkata',
      rating: 5,
      text: 'The cosmetic dentistry work here is outstanding! My teeth whitening and veneers look so natural. The staff is friendly and the clinic maintains the highest hygiene standards.',
      treatment: 'Cosmetic Dentistry'
    },
    {
      name: 'Amit Ghosh',
      location: 'Jadavpur, Kolkata',
      rating: 5,
      text: 'Emergency dental care at its best! When I had severe tooth pain at night, they accommodated me immediately. Professional, efficient, and truly caring service.',
      treatment: 'Emergency Care'
    }
  ];

  const cardsPerSlide = isDesktop ? 3 : 1;
  const totalSlides = Math.ceil(testimonials.length / cardsPerSlide);

  // Auto-play functionality
  useEffect(() => {
    if (totalSlides <= 1) return; // Don't auto-play if there's only one slide
    
    const autoPlay = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(autoPlay);
  }, [totalSlides]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const getCurrentSlideTestimonials = () => {
    const start = currentIndex * cardsPerSlide;
    return testimonials.slice(start, start + cardsPerSlide);
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

  return (
    <section className="py-20 pb-24 bg-white">
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
            What Our <span className="gradient-text">Patients Say</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our satisfied patients 
            have to say about their experience at Dent "O" Dent.
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className={`absolute left-2 md:-left-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 md:p-3 hover:bg-gray-50 transition-all duration-300 hover:scale-110 ${
              currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
          </button>
          
          <button
            onClick={nextSlide}
            className={`absolute right-2 md:-right-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 md:p-3 hover:bg-gray-50 transition-all duration-300 hover:scale-110 ${
              currentIndex === totalSlides - 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={currentIndex === totalSlides - 1}
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
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
                    isDesktop ? 'gap-8' : 'gap-0'
                  }`}
                >
                  {testimonials
                    .slice(slideIndex * cardsPerSlide, (slideIndex + 1) * cardsPerSlide)
                    .map((testimonial, cardIndex) => (
                      <motion.div
                        key={`${slideIndex}-${cardIndex}`}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: cardIndex * 0.1 }}
                        viewport={{ once: true }}
                        className={`bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 pb-10 shadow-lg hover:shadow-xl transition-all duration-300 card-3d relative overflow-hidden ${
                          isDesktop ? 'flex-1' : 'w-full'
                        }`}
                      >
                        {/* Quote Icon */}
                        <div className="absolute top-4 right-4 opacity-10">
                          <Quote className="w-16 h-16 text-blue-600" />
                        </div>

                        {/* Rating */}
                        <div className="flex items-center mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                          ))}
                        </div>

                        {/* Testimonial Text */}
                        <p className="text-gray-700 mb-6 leading-relaxed relative z-10">
                          "{testimonial.text}"
                        </p>

                        {/* Treatment Badge */}
                        <div className="mb-4">
                          <span className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {testimonial.treatment}
                          </span>
                        </div>

                        {/* Patient Info */}
                        <div className="border-t pt-4">
                          <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                          <p className="text-sm text-gray-600">{testimonial.location}</p>
                        </div>

                        {/* Decorative Element */}
                        <div className="absolute bottom-2 right-2 w-12 h-12 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full opacity-20 blur-xl"></div>
                      </motion.div>
                    ))}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-blue-600 scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-8 text-white"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">5000+</div>
              <div className="text-blue-100">Happy Patients</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.9</div>
              <div className="text-blue-100">Average Rating</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">15+</div>
              <div className="text-blue-100">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-blue-100">Success Rate</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;