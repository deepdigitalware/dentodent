import React from 'react';
import ServicePage from '@/components/services/ServicePage';

export default function RootCanal({ onNavigate }) {
  return (
    <ServicePage
      title="Root Canal Treatment (RCT) in Kolkata"
      description="Pain-free root canal treatment using rotary endodontics and digital imaging to save natural teeth with minimal discomfort. Same-day RCT available for emergency cases."
      slug="root-canal"
      serviceType="Root Canal Treatment"
      image="https://images.unsplash.com/photo-1588776814546-1ff441c36edb"
      onNavigate={onNavigate}
    />
  );
}