import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';

export default function ServicePage({
  title,
  description,
  slug,
  image = 'https://images.unsplash.com/photo-1629909613638-0e4a1fad8f81',
  serviceType,
  onNavigate,
}) {
  const canonicalUrl = (typeof window !== 'undefined')
    ? `${window.location.origin}/${slug}`
    : `https://www.dentodent.in/${slug}`;

  const otherLinks = [
    { name: 'Dental Implants', slug: 'dental-implants' },
    { name: 'Root Canal Treatment', slug: 'root-canal' },
    { name: 'Braces & Orthodontics', slug: 'braces' },
    { name: 'Clear Aligners', slug: 'aligners' },
    { name: 'Teeth Whitening', slug: 'teeth-whitening' },
    { name: 'Smile Makeover', slug: 'smile-makeover' },
    { name: 'Pediatric Dentistry', slug: 'pediatric-dentistry' },
  ].filter((l) => l.slug !== slug);

  return (
    <section className="py-20" id="services-page">
      <Helmet>
        <title>{title} | Dent O Dent Kolkata</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${title} | Dent O Dent Kolkata`} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={`${image}?w=1200&h=630&fit=crop`} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Service',
          serviceType,
          provider: {
            '@type': 'Dentist',
            name: 'Dent O Dent',
            address: {
              '@type': 'PostalAddress',
              streetAddress: '1/8/1, near Master Da Surya Sen Club, Suryanagar, Regent Grove, Bansdroni',
              addressLocality: 'Kolkata',
              addressRegion: 'West Bengal',
              postalCode: '700040',
              addressCountry: 'IN'
            },
            telephone: '+916290093271'
          },
          areaServed: 'Kolkata',
          availableChannel: 'InPerson',
        })}</script>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl lg:text-5xl font-display font-bold mb-4">{title}</h1>
            <p className="text-lg text-gray-700 mb-6">{description}</p>
            <div className="flex gap-4">
              <Button onClick={() => onNavigate && onNavigate('appointment')} className="bg-blue-600 text-white">
                Book Appointment
              </Button>
              <Button onClick={() => onNavigate && onNavigate('contact')} variant="outline" className="border-blue-600 text-blue-600">
                Contact Us
              </Button>
            </div>
          </div>
          <div>
            <img src={image} alt={`${title} treatment illustration`} className="w-full h-auto rounded-2xl shadow-xl" />
          </div>
        </div>

        {/* Internal Links */}
        <div className="mt-12 border-t pt-8">
          <h2 className="text-2xl font-semibold mb-4">Explore Other Services</h2>
          <div className="flex flex-wrap gap-3">
            {otherLinks.map((l) => (
              <Button key={l.slug} variant="outline" className="border-blue-600 text-blue-600" onClick={() => onNavigate && onNavigate(l.slug)}>
                {l.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}