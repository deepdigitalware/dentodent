import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import phoneIcon from '@/assets/icons/phone.svg';
import mapPinIcon from '@/assets/icons/map-pin.svg';
import clockIcon from '@/assets/icons/clock.svg';
import { Button } from '@/components/ui/button';
import LanguageToggle from '@/components/LanguageToggle.jsx';
import { useI18n } from '@/lib/i18n.jsx';
import { toast } from '@/components/ui/use-toast';

const Header = ({ onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showTopbar, setShowTopbar] = useState(true);
  const [siteSettings, setSiteSettings] = useState(() => {
    try {
      return (typeof window !== 'undefined') ? JSON.parse(localStorage.getItem('site_settings') || '{}') : {};
    } catch { return {}; }
  });

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY || 0;
      setIsScrolled(y > 20);
      setShowTopbar(y === 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('header')) {
        setIsMenuOpen(false);
      }
    };
    
    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Listen for settings updates
  useEffect(() => {
    const handler = (e) => setSiteSettings(e.detail || JSON.parse(localStorage.getItem('site_settings') || '{}'));
    window.addEventListener('site-settings-updated', handler);
    return () => window.removeEventListener('site-settings-updated', handler);
  }, []);

  const handleBooking = () => {
    toast({
      title: "🦷 Booking System",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleNavigation = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
    setIsMenuOpen(false);
  };

  const { t } = useI18n();

  return (
    <>
      {/* Top Bar attached to header */}

      {/* Main Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white shadow-lg' 
            : 'bg-white shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            {/* Logo (click to go Home) */}
            <button
              onClick={() => handleNavigation('home')}
              aria-label="Go to Home"
              className="flex items-center space-x-3 group"
            >
              <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500">
                  {siteSettings?.appearance?.logoUrl ? (
                    <img src={siteSettings.appearance.logoUrl} alt="Dent O Dent Logo" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-white font-bold text-xl">D</span>
                  )}
                </div>
                <div className="text-left">
                  <h1 className="text-2xl font-display font-bold gradient-text">
                    Dent "O" Dent
                  </h1>
                  <p className="text-sm text-gray-600">Premium Dental Care</p>
                </div>
              </motion.div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {[
                { name: 'Home', action: () => scrollToSection('home') },
                { name: 'Why Choose Us', action: () => scrollToSection('about') },
                { name: 'Treatments', action: () => scrollToSection('services') },
                { name: 'Gallery', action: () => handleNavigation('gallery') },
                { name: 'Blog', action: () => handleNavigation('blog') },
                { name: 'FAQ', action: () => scrollToSection('faq') },
                { name: 'Get in Touch', action: () => scrollToSection('contact') }
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={item.action}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
                </button>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden md:flex items-center">
              <Button
                onClick={() => handleNavigation('appointment')}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Book a Free Appointment
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-3 rounded-lg hover:bg-gray-100 transition-colors ml-4"
            >
              {isMenuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
            </button>
          </div>

          {/* Attached Topbar */}
        </div>

        {showTopbar && (
          <div className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2">
            <div className="flex justify-between items-center text-sm px-4 sm:px-6 lg:px-8 overflow-hidden">
              {/* Left cluster: phone, location, hours */}
              <div className="flex items-center gap-6 min-w-0">
                <div className="flex items-center gap-2 flex-shrink-0">
                  <img src={phoneIcon} alt="Phone" className="w-4 h-4" />
                  <span className="truncate">{(typeof window !== 'undefined' && JSON.parse(localStorage.getItem('site_settings') || '{}')?.contact?.primaryPhone) || t('header_phone')}</span>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <img src={mapPinIcon} alt="Location" className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{(typeof window !== 'undefined' && JSON.parse(localStorage.getItem('site_settings') || '{}')?.contact?.address) || '1/8/1, near Master Da Surya Sen Club, Suryanagar, Regent Grove, Bansdroni, Kolkata, West Bengal 700040'}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <img src={clockIcon} alt="Hours" className="w-4 h-4" />
                  <span className="truncate">{t('header_hours')}</span>
                </div>
              </div>
              {/* Right cluster: language toggle (single globe icon inside) */}
              <div className="flex-shrink-0">
                <LanguageToggle />
              </div>
            </div>
          </div>
        )}
        

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white border-t shadow-lg absolute left-0 right-0 top-full"
          >
            <div className="px-6 py-6 space-y-4">
              {[
                { name: 'Home', action: () => scrollToSection('home') },
                { name: 'Why Choose Us', action: () => scrollToSection('about') },
                { name: 'Treatments', action: () => scrollToSection('services') },
                { name: 'Gallery', action: () => handleNavigation('gallery') },
                { name: 'Blog', action: () => handleNavigation('blog') },
                { name: 'FAQ', action: () => scrollToSection('faq') },
                { name: 'Get in Touch', action: () => scrollToSection('contact') }
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={item.action}
                  className="block w-full text-left text-gray-700 hover:text-blue-600 font-medium py-3 px-2 transition-colors rounded-lg hover:bg-blue-50"
                >
                  {item.name}
                </button>
              ))}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <Button
                  onClick={() => handleNavigation('appointment')}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-full font-semibold shadow-lg"
                >
                  Book a Free Appointment
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.header>
    </>
  );
};

export default Header;