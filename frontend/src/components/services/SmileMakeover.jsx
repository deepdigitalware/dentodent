import React from 'react';
import ServicePage from '@/components/services/ServicePage';

export default function SmileMakeover({ onNavigate }) {
  return (
    <ServicePage
      title="Smile Makeover & Cosmetic Dentistry in Kolkata"
      description="Veneers, bonding, contouring, and digital smile design for a stunning transformation. Personalized plans crafted by our cosmetic specialists."
      slug="smile-makeover"
      serviceType="Smile Makeover"
      image="https://images.unsplash.com/photo-1602526431573-a0a68636c0a5"
      onNavigate={onNavigate}
    />
  );
}