import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import phoneIcon from '@/assets/icons/phone.svg';
import mapPinIcon from '@/assets/icons/map-pin.svg';
import clockIcon from '@/assets/icons/clock.svg';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n.jsx';
import { toast } from '@/components/ui/use-toast';
import { useContent } from '@/contexts/ContentContext';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { AnimatePresence, motion } from 'framer-motion';
import siteLogo from '@/assets/icons/logo.svg';

const Header = ({ onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showTopbar, setShowTopbar] = useState(true);
  const [tickerIndex, setTickerIndex] = useState(0);
  
  const { t } = useI18n();
  const { content } = useContent();

  const tickerItems = (content?.header?.ticker && content.header.ticker.length > 0)
    ? content.header.ticker
    : [
        { icon: phoneIcon, text: content?.contact?.phone || '+91 6290093271' },
        { icon: clockIcon, text: "Hours Thursday to Sunday: 10AM - 10PM" },
        { icon: mapPinIcon, text: content?.contact?.address || 'Kolkata, West Bengal' }
      ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickerItems.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);
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
    window.addEventListener('scroll', handleScroll, { passive: true }); // Add passive for better performance
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

  const header = content?.header || {};
  const navItems = Array.isArray(header.navItems) && header.navItems.length > 0
    ? header.navItems
    : [
        { label: 'Home', mode: 'scroll', target: 'home' },
        { label: 'Why Choose Us', mode: 'scroll', target: 'about' },
        { label: 'Treatments', mode: 'scroll', target: 'services' },
        { label: 'Gallery', mode: 'route', target: 'gallery' },
        { label: 'Blog', mode: 'route', target: 'blog' },
        { label: 'FAQ', mode: 'scroll', target: 'faq' },
        { label: 'Get in Touch', mode: 'scroll', target: 'contact' }
      ];

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
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-md overflow-hidden flex items-center justify-center bg-white flex-shrink-0 border border-gray-200">
                  <img src={header.logoUrl || siteLogo} alt={(header.siteTitle || 'Site') + ' Logo'} className="w-full h-full object-contain" loading="eager" />
                </div>
                <div className="text-left hidden sm:block">
                  <h1 className="text-xl md:text-2xl font-display font-bold gradient-text">
                    {header.siteTitle || 'Dent "O" Dent'}
                  </h1>
                  <p className="text-xs md:text-sm text-gray-600 hidden md:block">{header.siteSubtitle || 'Premium Dental Care'}</p>
                </div>
              </motion.div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
              {navItems.map((item, idx) => (
                <button
                  key={(item.label || item.name || 'nav') + '-' + idx}
                  onClick={() => {
                    const label = item.target || item.name;
                    const mode = item.mode || (item.action ? 'custom' : 'scroll');
                    if (mode === 'route') {
                      handleNavigation(label);
                    } else if (mode === 'scroll') {
                      scrollToSection(label);
                    } else if (mode === 'custom' && typeof item.action === 'function') {
                      item.action();
                    } else {
                      scrollToSection(label);
                    }
                  }}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group text-sm lg:text-base"
                >
                  {item.label || item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
                </button>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden md:flex items-center">
              <button
                onClick={() => window.open('https://wa.me/916290093271', '_blank')}
                className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <WhatsAppIcon className="w-6 h-6" />
                <span className="text-sm md:text-base">Schedule a Free Consultation</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors ml-4"
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
            </button>
          </div>

          {/* Attached Topbar */}
        </div>

        {showTopbar && (
          <div className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2 hidden md:block overflow-hidden">
            <div className="flex justify-center items-center text-sm px-4 sm:px-6 lg:px-8 h-6 relative">
              <AnimatePresence mode='wait'>
                <motion.div
                  key={tickerIndex}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center gap-2 absolute"
                >
                  <img src={tickerItems[tickerIndex].icon} alt="Icon" className="w-4 h-4" />
                  <span className="font-medium">{tickerItems[tickerIndex].text}</span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}
        
        {/* Mobile Topbar */}
        {showTopbar && (
          <div className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2 md:hidden overflow-hidden">
            <div className="flex justify-center items-center text-xs px-4 h-5 relative">
              <AnimatePresence mode='wait'>
                <motion.div
                  key={tickerIndex}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center gap-2 absolute"
                >
                  <img src={tickerItems[tickerIndex].icon} alt="Icon" className="w-3 h-3" />
                  <span className="font-medium">{tickerItems[tickerIndex].text}</span>
                </motion.div>
              </AnimatePresence>
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
            <div className="px-4 py-4 space-y-3">
              {navItems.map((item, idx) => (
                <button
                  key={(item.label || item.name || 'nav') + '-' + idx}
                  onClick={() => {
                    const label = item.target || item.name;
                    const mode = item.mode || (item.action ? 'custom' : 'scroll');
                    if (mode === 'route') {
                      handleNavigation(label);
                    } else if (mode === 'scroll') {
                      scrollToSection(label);
                    } else if (mode === 'custom' && typeof item.action === 'function') {
                      item.action();
                    } else {
                      scrollToSection(label);
                    }
                  }}
                  className="block w-full text-left text-gray-700 hover:text-blue-600 font-medium py-2 px-2 transition-colors rounded-lg hover:bg-blue-50 text-sm"
                >
                  {item.label || item.name}
                </button>
              ))}
              <div className="space-y-3 pt-3 border-t border-gray-200">
                <Button
                  onClick={() => {
                    const ctaMode = header.ctaMode || 'route';
                    const ctaTarget = header.ctaTarget || 'appointment';
                    if (ctaMode === 'route') handleNavigation(ctaTarget);
                    else if (ctaMode === 'scroll') scrollToSection(ctaTarget);
                    else handleNavigation('appointment');
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2 rounded-full font-semibold shadow-lg text-sm"
                >
                  {header.ctaText || 'Book Appointment'}
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
