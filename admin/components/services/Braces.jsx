import React from 'react';
import ServicePage from '@/components/services/ServicePage';

export default function Braces({ onNavigate }) {
  return (
    <ServicePage
      title="Braces & Orthodontics in Kolkata"
      description="Metal, ceramic, and self-ligating braces to correct crowding, gaps, and bite issues. Customized orthodontic plans for teens and adults."
      slug="braces"
      serviceType="Orthodontic Braces"
      image="https://images.unsplash.com/photo-1586089209857-6621e1d61b78"
      onNavigate={onNavigate}
    />
  );
}