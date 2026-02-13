import React from 'react';
import { motion } from 'framer-motion';
import { Smile, Shield, Zap, Heart, Star, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const Services = () => {
  // Admin settings for section images
  const adminSettings = (() => {
    try {
      const raw = localStorage.getItem('dod-admin-settings');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  })();

  const slugify = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const resolveServiceImage = (title, fallbackUrl) => {
    const slug = slugify(title);
    const adminUrl = adminSettings?.sectionImages?.services?.[slug];
    const localUrl = `/assets/sections/services/${slug}.jpg`;
    const url = adminUrl || localUrl;
    const isRemote = /^https?:\/\//.test(url);
    return { url, isRemote, fallbackUrl };
  };
  const services = [
    {
      title: 'Cosmetic Dentistry',
      description: 'Transform your smile with veneers, whitening, and aesthetic treatments.',
      features: ['Teeth Whitening', 'Porcelain Veneers', 'Smile Makeover', 'Bonding'],
      color: 'from-pink-500 to-rose-500',
      image: 'https://images.unsplash.com/photo-1604416679951-2e1b1a96e5e0?auto=format&fit=crop&w=1200&q=60',
      imageSrcSet: 'https://images.unsplash.com/photo-1604416679951-2e1b1a96e5e0?auto=format&fit=crop&w=480&q=60 480w, https://images.unsplash.com/photo-1604416679951-2e1b1a96e5e0?auto=format&fit=crop&w=768&q=60 768w, https://images.unsplash.com/photo-1604416679951-2e1b1a96e5e0?auto=format&fit=crop&w=1200&q=60 1200w',
      webpSrcSet: 'https://images.unsplash.com/photo-1604416679951-2e1b1a96e5e0?auto=format&fit=crop&fm=webp&w=480&q=60 480w, https://images.unsplash.com/photo-1604416679951-2e1b1a96e5e0?auto=format&fit=crop&fm=webp&w=768&q=60 768w, https://images.unsplash.com/photo-1604416679951-2e1b1a96e5e0?auto=format&fit=crop&fm=webp&w=1200&q=60 1200w'
    },
    {
      title: 'Preventive Care',
      description: 'Comprehensive cleanings and preventive treatments for optimal oral health.',
      features: ['Regular Cleanings', 'Fluoride Treatments', 'Sealants', 'Oral Exams'],
      color: 'from-green-500 to-emerald-500',
      image: 'https://images.unsplash.com/photo-1588771936751-b84b1ecf6b02?auto=format&fit=crop&w=1200&q=60',
      imageSrcSet: 'https://images.unsplash.com/photo-1588771936751-b84b1ecf6b02?auto=format&fit=crop&w=480&q=60 480w, https://images.unsplash.com/photo-1588771936751-b84b1ecf6b02?auto=format&fit=crop&w=768&q=60 768w, https://images.unsplash.com/photo-1588771936751-b84b1ecf6b02?auto=format&fit=crop&w=1200&q=60 1200w',
      webpSrcSet: 'https://images.unsplash.com/photo-1588771936751-b84b1ecf6b02?auto=format&fit=crop&fm=webp&w=480&q=60 480w, https://images.unsplash.com/photo-1588771936751-b84b1ecf6b02?auto=format&fit=crop&fm=webp&w=768&q=60 768w, https://images.unsplash.com/photo-1588771936751-b84b1ecf6b02?auto=format&fit=crop&fm=webp&w=1200&q=60 1200w'
    },
    {
      title: 'Restorative Dentistry',
      description: 'Restore damaged teeth with crowns, bridges, and advanced techniques.',
      features: ['Dental Crowns', 'Bridges', 'Fillings', 'Root Canal'],
      color: 'from-blue-500 to-cyan-500',
      image: 'https://images.unsplash.com/photo-1592296901955-75b4f7b1e5a2?auto=format&fit=crop&w=1200&q=60',
      imageSrcSet: 'https://images.unsplash.com/photo-1592296901955-75b4f7b1e5a2?auto=format&fit=crop&w=480&q=60 480w, https://images.unsplash.com/photo-1592296901955-75b4f7b1e5a2?auto=format&fit=crop&w=768&q=60 768w, https://images.unsplash.com/photo-1592296901955-75b4f7b1e5a2?auto=format&fit=crop&w=1200&q=60 1200w',
      webpSrcSet: 'https://images.unsplash.com/photo-1592296901955-75b4f7b1e5a2?auto=format&fit=crop&fm=webp&w=480&q=60 480w, https://images.unsplash.com/photo-1592296901955-75b4f7b1e5a2?auto=format&fit=crop&fm=webp&w=768&q=60 768w, https://images.unsplash.com/photo-1592296901955-75b4f7b1e5a2?auto=format&fit=crop&fm=webp&w=1200&q=60 1200w'
    },
    {
      title: 'Orthodontics',
      description: 'Straighten teeth with traditional braces and modern clear aligners.',
      features: ['Metal Braces', 'Clear Aligners', 'Retainers', 'Bite Correction'],
      color: 'from-purple-500 to-violet-500',
      image: 'https://images.unsplash.com/photo-1599658882373-0f4aa47f1d49?auto=format&fit=crop&w=1200&q=60',
      imageSrcSet: 'https://images.unsplash.com/photo-1599658882373-0f4aa47f1d49?auto=format&fit=crop&w=480&q=60 480w, https://images.unsplash.com/photo-1599658882373-0f4aa47f1d49?auto=format&fit=crop&w=768&q=60 768w, https://images.unsplash.com/photo-1599658882373-0f4aa47f1d49?auto=format&fit=crop&w=1200&q=60 1200w',
      webpSrcSet: 'https://images.unsplash.com/photo-1599658882373-0f4aa47f1d49?auto=format&fit=crop&fm=webp&w=480&q=60 480w, https://images.unsplash.com/photo-1599658882373-0f4aa47f1d49?auto=format&fit=crop&fm=webp&w=768&q=60 768w, https://images.unsplash.com/photo-1599658882373-0f4aa47f1d49?auto=format&fit=crop&fm=webp&w=1200&q=60 1200w'
    },
    {
      title: 'Oral Surgery',
      description: 'Expert surgical procedures including extractions and implants.',
      features: ['Tooth Extraction', 'Dental Implants', 'Wisdom Teeth', 'Gum Surgery'],
      color: 'from-red-500 to-pink-500',
      image: 'https://images.unsplash.com/photo-1581091014533-0dc1949fa0a1?auto=format&fit=crop&w=1200&q=60',
      imageSrcSet: 'https://images.unsplash.com/photo-1581091014533-0dc1949fa0a1?auto=format&fit=crop&w=480&q=60 480w, https://images.unsplash.com/photo-1581091014533-0dc1949fa0a1?auto=format&fit=crop&w=768&q=60 768w, https://images.unsplash.com/photo-1581091014533-0dc1949fa0a1?auto=format&fit=crop&w=1200&q=60 1200w',
      webpSrcSet: 'https://images.unsplash.com/photo-1581091014533-0dc1949fa0a1?auto=format&fit=crop&fm=webp&w=480&q=60 480w, https://images.unsplash.com/photo-1581091014533-0dc1949fa0a1?auto=format&fit=crop&fm=webp&w=768&q=60 768w, https://images.unsplash.com/photo-1581091014533-0dc1949fa0a1?auto=format&fit=crop&fm=webp&w=1200&q=60 1200w'
    },
    {
      title: 'Pediatric Dentistry',
      description: 'Gentle, specialized care for children and adolescents.',
      features: ['Child Cleanings', 'Fluoride Treatments', 'Sealants', 'Education'],
      color: 'from-yellow-500 to-orange-500',
      image: 'https://images.unsplash.com/photo-1605497788044-53e2701b9b4f?auto=format&fit=crop&w=1200&q=60',
      imageSrcSet: 'https://images.unsplash.com/photo-1605497788044-53e2701b9b4f?auto=format&fit=crop&w=480&q=60 480w, https://images.unsplash.com/photo-1605497788044-53e2701b9b4f?auto=format&fit=crop&w=768&q=60 768w, https://images.unsplash.com/photo-1605497788044-53e2701b9b4f?auto=format&fit=crop&w=1200&q=60 1200w',
      webpSrcSet: 'https://images.unsplash.com/photo-1605497788044-53e2701b9b4f?auto=format&fit=crop&fm=webp&w=480&q=60 480w, https://images.unsplash.com/photo-1605497788044-53e2701b9b4f?auto=format&fit=crop&fm=webp&w=768&q=60 768w, https://images.unsplash.com/photo-1605497788044-53e2701b9b4f?auto=format&fit=crop&fm=webp&w=1200&q=60 1200w'
    }
  ];

  const handleLearnMore = (serviceName) => {
    toast({
      title: `🦷 ${serviceName}`,
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
            Our <span className="gradient-text">Treatments</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive dental care tailored to your needs. From routine cleanings 
            to complex procedures, we provide exceptional treatment with the latest 
            technology and techniques.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden card-3d group"
            >
              {/* Header with image background (admin/asset managed), text at bottom */}
              <div className="relative h-36 sm:h-40">
                {(() => {
                  const { url, fallbackUrl } = resolveServiceImage(service.title, service.image);
                  return (
                    <img
                      src={url}
                      alt={`${service.title} header`}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        if (e.currentTarget.src !== fallbackUrl) e.currentTarget.src = fallbackUrl;
                      }}
                    />
                  );
                })()}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
                <div className="absolute inset-x-0 bottom-0 h-20 sm:h-24 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-6 text-white">
                  <h3 className="text-xl font-bold mb-1">{service.title}</h3>
                  <p className="text-white/90 text-sm">{service.description}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-600">
                      <div className={`w-2 h-2 bg-gradient-to-r ${service.color} rounded-full mr-3`}></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleLearnMore(service.title)}
                  variant="outline"
                  className="w-full border-2 hover:bg-gray-50 transition-all duration-300"
                >
                  Learn More
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-8 text-white">
            <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Smile?</h3>
            <p className="text-xl mb-6 opacity-90">
              Schedule a consultation today and discover how we can help you achieve 
              the perfect smile you've always wanted.
            </p>
            <Button
              onClick={() => handleLearnMore('Consultation')}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Book a Free Appointment
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;