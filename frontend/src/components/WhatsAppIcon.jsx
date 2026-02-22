import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppIcon = ({ className = 'w-5 h-5' }) => {
  return (
    <MessageCircle
      className={className}
    />
  );
};

export default WhatsAppIcon;
