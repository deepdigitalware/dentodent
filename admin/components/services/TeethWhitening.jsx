import React from 'react';
import ServicePage from '@/components/services/ServicePage';

export default function TeethWhitening({ onNavigate }) {
  return (
    <ServicePage
      title="Teeth Whitening in Kolkata"
      description="In-clinic laser and chemical whitening to remove stains and brighten your smile instantly. Safe, effective, and long-lasting results."
      slug="teeth-whitening"
      serviceType="Teeth Whitening"
      image="https://images.unsplash.com/photo-1581089781785-04049cb29d0f"
      onNavigate={onNavigate}
    />
  );
}