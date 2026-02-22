import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useContent } from '@/contexts/ContentContext';

const MapSection = () => {
  const { content } = useContent();
  const map = content.map || {};
  const address = map.address || '1/8/1, near Master Da Surya Sen Club, Suryanagar, Regent Grove, Bansdroni, Kolkata 700040';
  const lat = map.latitude || 22.4749;
  const lng = map.longitude || 88.3730;
  const embedUrl = map.embedUrl || `https://www.google.com/maps?q=${lat},${lng}&output=embed`;

  return (
    <section id="map" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-4">
            {map.title || 'Find Us'}
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            {address}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="rounded-2xl overflow-hidden shadow-lg"
        >
          <iframe
            title="Clinic Location"
            src={embedUrl}
            width="100%"
            height="420"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-6 text-center"
        >
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`}
            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            target="_blank"
            rel="noreferrer"
          >
            <MapPin className="w-5 h-5 mr-2" />
            Get Directions
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default MapSection;
