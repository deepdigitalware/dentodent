import React from 'react';
import { motion } from 'framer-motion';
import { useContent } from '@/contexts/ContentContext';

const Treatments = () => {
  const { content } = useContent();
  
  // Use API-only data
  const treatmentsData = Array.isArray(content.treatments?.items)
    ? content.treatments.items
    : [];

  return (
    <section id="treatments" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          {content.treatments?.title && (
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-4">
              {content.treatments.title}
            </h2>
          )}
          {content.treatments?.subtitle && (
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              {content.treatments.subtitle}
            </p>
          )}
        </motion.div>

        {treatmentsData.length === 0 ? (
          <p className="text-center text-gray-500">No treatments available yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {treatmentsData.map((treatment, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group bg-gradient-to-br from-white to-blue-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 card-3d"
            >
              {treatment.imageUrl && (
                <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${treatment.imageUrl})` }} />
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{treatment.title}</h3>
                {treatment.description && (
                  <p className="text-gray-600 mb-4">{treatment.description}</p>
                )}
                {treatment.slug && (
                  <a 
                    href={`/${treatment.slug}`} 
                    className="inline-block bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-full text-sm hover:from-blue-700 hover:to-cyan-700 transition-all duration-300"
                  >
                    Learn more
                  </a>
                )}
              </div>
            </motion.div>
          ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Treatments;