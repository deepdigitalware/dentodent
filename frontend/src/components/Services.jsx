import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useContent } from '@/contexts/ContentContext';

const Services = () => {
  const { content } = useContent();
  const servicesData = Array.isArray(content.services?.services)
    ? content.services.services
    : [];

  const handleLearnMore = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/appointment';
    }
  };

  return (
    <section id="services" className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.1 }}
          className="text-center mb-12 md:mb-16"
        >
          {content.services?.title && (
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-display font-bold mb-4 md:mb-6">
              {content.services.title}
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
              className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden card-3d group"
            >
              <div className="relative h-32 sm:h-36 md:h-40">
                {service.image ? (
                  <img
                    src={service.image}
                    alt={`${service.title} header`}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    loading="lazy"
                  />
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-r ${service.color || 'from-blue-600 to-cyan-600'}`}></div>
                )}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
                <div className="absolute inset-x-0 bottom-0 h-16 sm:h-20 md:h-24 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute inset-x-0 bottom-0 z-10 p-3 sm:p-4 md:p-6 text-white">
                  <h3 className="text-lg md:text-xl font-bold mb-1">{service.title}</h3>
                  {service.description && (
                    <p className="text-white/90 text-xs sm:text-sm">{service.description}</p>
                  )}
                </div>
              </div>

              <div className="p-4 sm:p-5 md:p-6">
                <ul className="space-y-2 mb-4 md:mb-6">
                  {(Array.isArray(service.features) ? service.features : []).map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-600 text-sm">
                      <div className={`w-1.5 h-1.5 bg-gradient-to-r ${service.color} rounded-full mr-2`}></div>
                      <span className="text-xs sm:text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={handleLearnMore}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-2 rounded-full font-semibold text-sm transition-all duration-300 flex items-center justify-center"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Now
                </Button>
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
              Book a Free Appointment
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
