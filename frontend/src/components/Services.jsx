import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useContent } from '@/contexts/ContentContext';
import WhatsAppIcon from '@/components/WhatsAppIcon';

const Services = () => {
  const { content } = useContent();
  const servicesData = (Array.isArray(content.services?.services)
    ? content.services.services
    : []).filter(
      (service) =>
        service &&
        (service.title || service.name || service.description || service.image)
    );

  const rawTitle = content.services?.title;
  const displayTitle = rawTitle
    ? rawTitle.replace(/Services/gi, 'Treatments')
    : 'Our Treatments';

  const handleLearnMore = () => {
    if (typeof window !== 'undefined') {
      window.open('https://wa.me/916290093271', '_blank');
    }
  };

  return (
    <section id="treatments" className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.1 }}
          className="text-center mb-12 md:mb-16"
        >
          {displayTitle && (
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-display font-bold mb-4 md:mb-6">
              {displayTitle}
            </h2>
          )}
          {content.services?.subtitle && (
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              {content.services.subtitle}
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {servicesData.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.1 }}
              className="relative rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden card-3d group h-64 sm:h-72 md:h-80"
            >
              {(service.imageUrl || service.image) ? (
                <img
                  src={service.imageUrl || service.image}
                  alt={`${service.title} header`}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  loading="lazy"
                />
              ) : (
                <div className={`absolute inset-0 bg-gradient-to-r ${service.color || 'from-blue-600 to-cyan-600'}`}></div>
              )}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
              {service.iconImageUrl && (
                <img
                  src={service.iconImageUrl}
                  alt="Icon"
                  className="absolute top-3 left-3 w-10 h-10 rounded-md shadow-md bg-white/80 p-1"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  loading="lazy"
                />
              )}
              <div className="absolute inset-x-0 bottom-0 h-28 sm:h-32 md:h-36 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>

              <div className="relative z-10 h-full flex flex-col justify-end p-4 sm:p-5 md:p-6 text-white">
                <h3 className="text-lg md:text-xl font-bold mb-1">{service.title}</h3>
                {service.price && (
                  <p className="text-blue-200 font-semibold text-xs sm:text-sm mb-0.5">
                    {service.price}
                  </p>
                )}
                {service.description && (
                  <p className="text-white/90 text-xs sm:text-sm">
                    {service.description}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.1 }}
          className="text-center mt-12 md:mt-16"
        >
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl md:rounded-3xl p-6 md:p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Ready to Transform Your Smile?</h3>
            <p className="text-base md:text-xl mb-4 md:mb-6 opacity-90">
              Schedule a consultation today and discover how we can help you achieve 
              the perfect smile you've always wanted.
            </p>
            <Button
              onClick={handleLearnMore}
              className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-2.5 md:px-8 md:py-3 rounded-full font-semibold text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                <WhatsAppIcon className="w-5 h-5" />
                <span>Book a Free Appointment</span>
              </span>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
