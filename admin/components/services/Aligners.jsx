import React from 'react';
import ServicePage from '@/components/services/ServicePage';

export default function Aligners({ onNavigate }) {
  return (
    <ServicePage
      title="Clear Aligners (Invisible Braces) in Kolkata"
      description="Custom clear aligners for discreet teeth straightening. Digital scanning, treatment simulation, and fast results with minimal clinic visits."
      slug="aligners"
      serviceType="Clear Aligners"
      image="https://images.unsplash.com/photo-1598257006888-9fec1d06867d"
      onNavigate={onNavigate}
    />
  );
}