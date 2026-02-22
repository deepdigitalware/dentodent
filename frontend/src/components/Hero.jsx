import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Star, Award, Users, Clock } from 'lucide-react';
import smileIcon from '@/assets/icons/smile.svg';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n.jsx';
import { useContent } from '@/contexts/ContentContext';

const Hero = () => {
  const { content } = useContent();
  
  const handleBooking = () => {
    if (typeof window !== 'undefined') {
      window.open('https://wa.me/916290093271', '_blank');
    }
  };

  const handleCall = () => {
    // Open phone dialer
    window.location.href = 'tel:+916290093271';
  };

  const splineUrl = import.meta.env.VITE_SPLINE_URL; // Optional Spline embed
  const { t } = useI18n();

  // Icon mapping function
  const getIconComponent = (iconName) => {
    const iconMap = {
      'Users': Users,
      'Award': Award,
      'Star': Star,
      'Clock': Clock
    };
    return iconMap[iconName] || Users; // Default to Users icon if not found
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 md:pt-32">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50"></div>
      
      {/* Optional 3D Spline Embed - only load on larger screens */}
      {splineUrl && window.innerWidth >= 1024 && (
        <div className="absolute inset-0 -z-0 pointer-events-none">
          <iframe
            title="3D Dental Scene"
            src={splineUrl}
            className="w-full h-full opacity-70"
            loading="lazy"
            allow="autoplay; fullscreen"
          />
        </div>
      )}
      
      {/* Floating Dental Icons - hidden on mobile for performance */}
      <div className="hidden md:block">
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 0.25, y: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 left-10"
        >
          <img src={smileIcon} alt="Decorative" className="w-16 h-16" loading="lazy" />
        </motion.div>
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.25, y: [0, 12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-40 right-20"
        >
          <img src={smileIcon} alt="Decorative" className="w-12 h-12" loading="lazy" />
        </motion.div>
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 0.2, y: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-40 left-20"
        >
          <img src={smileIcon} alt="Decorative" className="w-20 h-20" loading="lazy" />
        </motion.div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-4 md:mb-6"
            >
              {content.hero.title}
              <span className="gradient-text block">{content.hero.subtitle}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 md:mb-8 leading-relaxed"
            >
              {content.hero.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-8 md:mb-12"
            >
              <Button
                onClick={handleBooking}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-semibold text-base md:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 pulse-glow"
              >
                Book a Free Appointment
              </Button>
              <Button
                onClick={handleCall}
                variant="outline"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-semibold text-base md:text-lg transition-all duration-300"
              >
                Call Now
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-6"
            >
              {content.hero.stats && content.hero.stats.map ? content.hero.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  {React.createElement(getIconComponent(stat.icon), { className: "w-5 h-5 md:w-8 md:h-8 text-blue-600 mx-auto mb-1 md:mb-2" })}
                  <div className="text-lg md:text-2xl font-bold text-gray-800">{stat.number}</div>
                  <div className="text-xs md:text-sm text-gray-600">{stat.label}</div>
                </div>
              )) : null}
            </motion.div>
          </motion.div>

          {/* Right Content - 3D Dental Image or Scene */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {!splineUrl && (
              <div className="relative z-10">
                <img 
                  className="w-full h-auto rounded-2xl md:rounded-3xl shadow-2xl card-3d"
                  alt="Modern dental clinic interior with advanced equipment"
                  src="https://images.unsplash.com/photo-1629909613638-0e4a1fad8f81" 
                  loading="eager" />
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator - hidden on mobile */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden md:block"
      >
        <div className="w-6 h-10 border-2 border-blue-600 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-blue-600 rounded-full mt-2 animate-bounce"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
