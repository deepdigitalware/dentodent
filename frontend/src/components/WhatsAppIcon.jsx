import React from 'react';
import whatsappIcon from '@/assets/icons/whatsapp.svg';

const WhatsAppIcon = ({ className = "w-5 h-5" }) => {
  return (
    <img
      src={whatsappIcon}
      alt="WhatsApp"
      className={className}
    />
  );
};

export default WhatsAppIcon;
