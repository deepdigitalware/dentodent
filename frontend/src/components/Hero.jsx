import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';
import smileIcon from '@/assets/icons/smile.svg';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n.jsx';
import { useContent } from '@/contexts/ContentContext';
import WhatsAppIcon from '@/components/WhatsAppIcon';

const FALLBACK_HERO_IMAGE = 'https://images.unsplash.com/photo-1629909613638-0e4a1fad8f81?auto=format&fit=crop&w=1400&q=80';

const Hero = () => {
  const { content, apiUrl } = useContent();
  const [heroImageSrc, setHeroImageSrc] = useState(FALLBACK_HERO_IMAGE);
  
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

  useEffect(() => {
    const candidate = content?.hero?.image || content?.hero?.imageUrl;
    if (!candidate) {
      setHeroImageSrc(FALLBACK_HERO_IMAGE);
      return;
    }

    if (candidate.startsWith('/assets')) {
      setHeroImageSrc(`${apiUrl}${candidate}`);
      return;
    }

    setHeroImageSrc(candidate);
  }, [apiUrl, content?.hero?.image, content?.hero?.imageUrl]);

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
          <img src={smileIcon} alt="" className="w-16 h-16" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        </motion.div>
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.25, y: [0, 12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-40 right-20"
        >
          <img src={smileIcon} alt="" className="w-12 h-12" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        </motion.div>
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 0.2, y: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-40 left-20"
        >
          <img src={smileIcon} alt="" className="w-20 h-20" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        </motion.div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 md:gap-14 items-center">
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
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold leading-tight mb-4 md:mb-6 break-words"
            >
              <span className="block">{content.hero.title}</span>
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
                <span className="flex items-center gap-2">
                  <WhatsAppIcon className="w-5 h-5" />
                  <span>Book a Free Appointment</span>
                </span>
              </Button>
              <Button
                onClick={handleCall}
                variant="outline"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-semibold text-base md:text-lg transition-all duration-300"
              >
                <span className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>Call Now</span>
                </span>
              </Button>
            </motion.div>

          </motion.div>

          {/* Right Content - 3D Dental Image or Scene */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative w-full max-w-xl md:ml-auto"
          >
            {!splineUrl && (
              <div className="relative z-10">
                <img 
                  className="w-full h-auto rounded-2xl md:rounded-3xl shadow-2xl card-3d"
                  alt={content.hero.imageAlt || "Modern dental clinic interior with advanced equipment"}
                  src={heroImageSrc}
                  onError={(e) => {
                    if (e.currentTarget.src !== FALLBACK_HERO_IMAGE) {
                      setHeroImageSrc(FALLBACK_HERO_IMAGE);
                    }
                  }}
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
