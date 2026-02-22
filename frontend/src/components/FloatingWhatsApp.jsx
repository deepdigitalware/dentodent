import React from 'react';
import WhatsAppIcon from '@/components/WhatsAppIcon';

const FloatingWhatsApp = () => {
  const openWhatsApp = () => {
    window.open('https://wa.me/916290093271', '_blank');
  };

  return (
    <button
      aria-label="Chat on WhatsApp"
      onClick={openWhatsApp}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 focus:outline-none active:scale-95 transition transform flex items-center justify-center text-teal-500"
    >
      <WhatsAppIcon className="w-10 h-10" />
    </button>
  );
};

export default FloatingWhatsApp;
