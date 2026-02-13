import React from 'react';
import ServicePage from '@/components/services/ServicePage';

export default function PediatricDentistry({ onNavigate }) {
  return (
    <ServicePage
      title="Pediatric Dentistry in Kolkata"
      description="Gentle dental care for children: preventive treatments, cavity management, habit counseling, and orthodontic monitoring in a child-friendly environment."
      slug="pediatric-dentistry"
      serviceType="Pediatric Dentistry"
      image="https://images.unsplash.com/photo-1583912267984-6bd45a0d49f3"
      onNavigate={onNavigate}
    />
  );
}