import React from 'react';
import whatsappGlyph from '@/assets/icons/whatsapp.svg';

const WhatsAppIcon = ({ className = 'w-5 h-5' }) => {
  return (
    <span
      role="img"
      aria-label="WhatsApp"
      className={`inline-block shrink-0 ${className}`}
      style={{
        backgroundColor: 'currentColor',
        WebkitMask: `url(${whatsappGlyph}) center / contain no-repeat`,
        mask: `url(${whatsappGlyph}) center / contain no-repeat`
      }}
    />
  );
};

export default WhatsAppIcon;
