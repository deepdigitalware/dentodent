import React from 'react';
import ServicePage from '@/components/services/ServicePage';

export default function DentalImplants({ onNavigate }) {
  return (
    <ServicePage
      title="Dental Implants in Kolkata"
      description="Permanent tooth replacement with titanium implants and zirconia crowns. Single, multiple, and full-mouth rehabilitation with guided surgery. EMI available."
      slug="dental-implants"
      serviceType="Dental Implants"
      image="https://images.unsplash.com/photo-1606811842058-3c80e8d78af2"
      onNavigate={onNavigate}
    />
  );
}