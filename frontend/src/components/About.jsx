import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Heart, Award, Users } from 'lucide-react';
import { useI18n } from '@/lib/i18n.jsx';
import { useContent } from '@/contexts/ContentContext';

const About = () => {
  const { content, apiUrl } = useContent();
  
  // Use only API data
  const features = Array.isArray(content.about?.features) ? content.about.features : [];
  
  // Fetch images assigned to the 'about' section from API
  const [aboutImages, setAboutImages] = React.useState([]);
  React.useEffect(() => {
    let cancelled = false;
    const loadImages = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/images?category=about`);
        if (!res.ok) throw new Error(`Failed to load about images: ${res.status}`);
        const data = await res.json();
        const items = Array.isArray(data) ? data : (data.images || []);
        const mapped = items
          .map((img, i) => ({
            id: img.id || img._id || i + 1,
            src: img.url || img.path || img.imageUrl || img.link,
            alt: img.title || img.name || 'About image',
          }))
          .filter(x => !!x.src);
        if (!cancelled) setAboutImages(mapped);
      } catch (e) {
        // silently ignore; no local fallbacks
      }
    };
    loadImages();
    return () => { cancelled = true; };
  }, [apiUrl]);

  const { t } = useI18n();

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
              {content.about.title}
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {t('about_sub')}
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {content.about.description}
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {content.about.mission}
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 card-3d"
                >
                  <feature.icon className="w-10 h-10 text-blue-600 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - Images */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                {aboutImages[0] && (
                  <img 
                    className="w-full h-48 object-cover rounded-2xl shadow-lg card-3d" 
                    alt={aboutImages[0].alt}
                    src={aboutImages[0].src}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    loading="lazy"
                  />
                )}
                {aboutImages[1] && (
                  <img 
                    className="w-full h-32 object-cover rounded-2xl shadow-lg card-3d" 
                    alt={aboutImages[1].alt}
                    src={aboutImages[1].src}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    loading="lazy"
                  />
                )}
              </div>
              <div className="space-y-6 mt-12">
                {aboutImages[2] && (
                  <img 
                    className="w-full h-32 object-cover rounded-2xl shadow-lg card-3d" 
                    alt={aboutImages[2].alt}
                    src={aboutImages[2].src}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    loading="lazy"
                  />
                )}
                {aboutImages[3] && (
                  <img 
                    className="w-full h-48 object-cover rounded-2xl shadow-lg card-3d" 
                    alt={aboutImages[3].alt}
                    src={aboutImages[3].src}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    loading="lazy"
                  />
                )}
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full opacity-20 blur-xl"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 blur-xl"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;