import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Heart, Award, Users } from 'lucide-react';
import { useI18n } from '@/lib/i18n.jsx';

const About = () => {
  // Admin settings for section images
  const adminSettings = (() => {
    try {
      const raw = localStorage.getItem('dod-admin-settings');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  })();

  const resolveAboutImage = (key, fallbackUrl) => {
    const adminUrl = adminSettings?.sectionImages?.about?.[key];
    const localUrl = `/assets/sections/about/${key}.jpg`;
    const url = adminUrl || localUrl;
    return { url, fallbackUrl };
  };
  const features = [
    {
      icon: Shield,
      title: 'Advanced Technology',
      description: 'State-of-the-art equipment and latest dental technologies for precise treatments.'
    },
    {
      icon: Heart,
      title: 'Compassionate Care',
      description: 'Patient-centered approach with gentle, caring treatment in a comfortable environment.'
    },
    {
      icon: Award,
      title: 'Expert Team',
      description: 'Highly qualified professionals with years of experience in various dental specialties.'
    },
    {
      icon: Users,
      title: 'Trusted by Thousands',
      description: 'Over 5000 satisfied patients trust us for their dental health and beautiful smiles.'
    }
  ];

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
              Why Choose <span className="gradient-text">Dent "O" Dent</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {t('about_sub')}
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Under the expert leadership of Dr. Setketu Chakraborty, our clinic 
              offers comprehensive dental services ranging from routine cleanings 
              to complex surgical procedures, all delivered with the highest 
              standards of safety and comfort.
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
                <img 
                  className="w-full h-48 object-cover rounded-2xl shadow-lg card-3d" 
                  alt="Modern dental equipment and technology"
                  src={resolveAboutImage('a1', 'https://images.unsplash.com/photo-1629909613638-0e4a1fad8f81').url}
                  onError={(e) => {
                    const fb = resolveAboutImage('a1', 'https://images.unsplash.com/photo-1629909613638-0e4a1fad8f81').fallbackUrl;
                    if (e.currentTarget.src !== fb) e.currentTarget.src = fb;
                  }}
                />
                <img 
                  className="w-full h-32 object-cover rounded-2xl shadow-lg card-3d" 
                  alt="Comfortable patient waiting area"
                  src={resolveAboutImage('a2', 'https://images.unsplash.com/photo-1694011224702-4f9c680378c5').url}
                  onError={(e) => {
                    const fb = resolveAboutImage('a2', 'https://images.unsplash.com/photo-1694011224702-4f9c680378c5').fallbackUrl;
                    if (e.currentTarget.src !== fb) e.currentTarget.src = fb;
                  }}
                />
              </div>
              <div className="space-y-6 mt-12">
                <img 
                  className="w-full h-32 object-cover rounded-2xl shadow-lg card-3d" 
                  alt="Sterilization and hygiene protocols"
                  src={resolveAboutImage('a3', 'https://images.unsplash.com/photo-1690306815553-a41b3acd99cd').url}
                  onError={(e) => {
                    const fb = resolveAboutImage('a3', 'https://images.unsplash.com/photo-1690306815553-a41b3acd99cd').fallbackUrl;
                    if (e.currentTarget.src !== fb) e.currentTarget.src = fb;
                  }}
                />
                <img 
                  className="w-full h-48 object-cover rounded-2xl shadow-lg card-3d" 
                  alt="Happy patient with beautiful smile"
                  src={resolveAboutImage('a4', 'https://images.unsplash.com/photo-1598911642263-b81130ed8ce8').url}
                  onError={(e) => {
                    const fb = resolveAboutImage('a4', 'https://images.unsplash.com/photo-1598911642263-b81130ed8ce8').fallbackUrl;
                    if (e.currentTarget.src !== fb) e.currentTarget.src = fb;
                  }}
                />
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