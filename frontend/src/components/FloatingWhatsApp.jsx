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
      className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-xl focus:outline-none bg-teal-600 hover:bg-teal-700 active:scale-95 transition transform flex items-center justify-center text-white"
    >
      <WhatsAppIcon className="w-10 h-10" />
    </button>
  );
};

export default FloatingWhatsApp;
