import React from 'react';
import whatsappGlyph from '@/assets/icons/whatsapp.svg';

const WhatsAppIcon = ({ className = 'w-5 h-5' }) => {
  return <img src={whatsappGlyph} alt="WhatsApp" className={className} />;
};

export default WhatsAppIcon;
