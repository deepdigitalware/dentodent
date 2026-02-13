import React from 'react';
import { motion } from 'framer-motion';
import mapPinIcon from '@/assets/icons/map-pin.svg';
import phoneIcon from '@/assets/icons/phone.svg';
import mailIcon from '@/assets/icons/mail.svg';
import clockIcon from '@/assets/icons/clock.svg';
import { toast } from '@/components/ui/use-toast';
import { useI18n } from '@/lib/i18n.jsx';
import { useContent } from '@/contexts/ContentContext';

const Footer = ({ onNavigate }) => {
  const { content } = useContent();
  const handleSocialClick = (platform) => {
    toast({
      title: `📱 ${platform}`,
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  const handleLinkClick = (link) => {
    if (onNavigate) {
      onNavigate(link.toLowerCase().replace(/\s+/g, '-'));
    } else {
      toast({
        title: `🔗 ${link}`,
        description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
      });
    }
  };

  // Handle Deepverse link click
  const handleDeepverseClick = () => {
    window.open('https://wa.me/917003614633', '_blank');
  };

  const quickLinks = [
    'About Us',
    'Gallery',
    'Blog',
    'FAQ',
    'Contact Us',
    'Patient Portal'
  ];

  const services = [
    'General Dentistry',
    'Cosmetic Dentistry',
    'Orthodontics',
    'Oral Surgery',
    'Dental Implants',
    'Pediatric Care'
  ];

  const legalLinks = [
    'Privacy Policy',
    'Terms of Service',
    'Cookie Policy'
  ];

  const { t } = useI18n();

  // Fallback values for footer content
  const footerText = content.footer.text || "© 2025 Dent 'O' Dent Dental Clinic. All rights reserved.";
  const clinicName = content.footer.clinicName || "Dent 'O' Dent";
  const poweredByText = "Powered by";

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-8">
          {/* Clinic Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.1 }} // Reduce amount for better performance
            className="space-y-6"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg md:text-xl">D</span>
              </div>
              <div>
                <span className="text-xl md:text-2xl font-display font-bold">{clinicName}</span>
                <p className="text-blue-200 text-xs md:text-sm">Premium Dental Care</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed text-sm md:text-base">
              {t('footer_premium')}
            </p>
            <div className="flex space-x-2 md:space-x-3">
              {/* Facebook */}
              <button
                onClick={() => handleSocialClick('Facebook')}
                className="w-7 h-7 md:w-8 md:h-8 bg-[#1877F2] rounded-lg flex items-center justify-center hover:bg-[#166FE5] transition-all duration-300 hover:scale-110"
              >
                <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              
              {/* Instagram */}
              <button
                onClick={() => handleSocialClick('Instagram')}
                className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] rounded-lg flex items-center justify-center hover:scale-110 transition-all duration-300"
              >
                <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </button>
              
              {/* Twitter/X */}
              <button
                onClick={() => handleSocialClick('Twitter')}
                className="w-7 h-7 md:w-8 md:h-8 bg-[#000000] rounded-lg flex items-center justify-center hover:bg-[#333333] transition-all duration-300 hover:scale-110"
              >
                <svg className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </button>
              
              {/* LinkedIn */}
              <button
                onClick={() => handleSocialClick('LinkedIn')}
                className="w-7 h-7 md:w-8 md:h-8 bg-[#0A66C2] rounded-lg flex items-center justify-center hover:bg-[#004182] transition-all duration-300 hover:scale-110"
              >
                <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </button>
              
              {/* YouTube */}
              <button
                onClick={() => handleSocialClick('YouTube')}
                className="w-7 h-7 md:w-8 md:h-8 bg-[#FF0000] rounded-lg flex items-center justify-center hover:bg-[#CC0000] transition-all duration-300 hover:scale-110"
              >
                <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </button>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true, amount: 0.1 }} // Reduce amount for better performance
            className="space-y-6"
          >
            <span className="text-lg md:text-xl font-semibold">{t('footer_quick_links')}</span>
            <ul className="space-y-2 md:space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleLinkClick(link)}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm md:text-base"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, amount: 0.1 }} // Reduce amount for better performance
            className="space-y-6"
          >
            <span className="text-lg md:text-xl font-semibold">{t('footer_services')}</span>
            <ul className="space-y-2 md:space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleLinkClick(service)}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm md:text-base"
                  >
                    {service}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true, amount: 0.1 }} // Reduce amount for better performance
            className="space-y-6"
          >
            <span className="text-lg md:text-xl font-semibold">{t('footer_contact')}</span>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <img src={mapPinIcon} alt="Location" className="w-5 h-5 mt-0.5 flex-shrink-0" loading="lazy" />
                <div>
                  <p className="text-gray-300 text-sm">
                    1/8/1, near Master Da Surya Sen Club, Suryanagar, Regent Grove, Bansdroni, Kolkata, West Bengal 700040
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <img src={phoneIcon} alt="Phone" className="w-5 h-5 flex-shrink-0" loading="lazy" />
                <p className="text-gray-300 text-sm">{content?.contact?.phone || '+91 6290093271'}</p>
              </div>
              {/* Email removed as requested */}
              <div className="flex items-start space-x-3">
                <img src={clockIcon} alt="Hours" className="w-5 h-5 mt-0.5 flex-shrink-0" loading="lazy" />
                <div>
                  <p className="text-gray-300 text-sm">
                    Thursday to Sunday: 10AM - 10PM
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true, amount: 0.1 }} // Reduce amount for better performance
          className="border-t border-white/10 mt-8 md:mt-12 pt-6 md:pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-xs md:text-sm text-center md:text-left">
              {footerText} <span className="hover:text-white cursor-pointer transition-colors duration-200" onClick={handleDeepverseClick}>{poweredByText} Deepverse</span>
            </p>
            <div className="flex flex-wrap gap-4 md:gap-6 text-xs md:text-sm justify-center">
              {legalLinks.map((link) => (
                <button
                  key={link}
                  onClick={() => handleLinkClick(link)}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {link}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;