import React from 'react';
import { motion } from 'framer-motion';
import { Users, Award, Star, Clock } from 'lucide-react';
import { useI18n } from '@/lib/i18n.jsx';
import { useContent } from '@/contexts/ContentContext';

const parseStatNumber = (value) => {
  const raw = String(value || '').trim();
  const match = raw.match(/\d+/g);
  if (!match) return { number: 0, suffix: '' };
  const number = Number(match.join(''));
  const suffix = raw.replace(match.join(''), '');
  return { number: Number.isFinite(number) ? number : 0, suffix };
};

const getStatIcon = (iconName = '') => {
  const map = {
    Users,
    Award,
    Star,
    Clock
  };
  return map[iconName] || Users;
};

const About = () => {
  const { content } = useContent();
  const stats = Array.isArray(content?.hero?.stats) ? content.hero.stats : [];

  const { t } = useI18n();

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-start">
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
            <p className="text-lg text-gray-600 mb-5 leading-relaxed">
              {t('about_sub')}
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              {content.about.description}
            </p>
          </motion.div>

          {/* Right Content - Transparent Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative lg:pt-3"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                  const { number, suffix } = parseStatNumber(stat.number);
                  const Icon = getStatIcon(stat.icon);
                  return (
                    <div key={index} className="px-2 py-2 text-center">
                      <Icon className="w-6 h-6 md:w-7 md:h-7 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl md:text-3xl font-bold text-blue-700 leading-none">
                        {number.toLocaleString()}{suffix}
                      </p>
                      <p className="mt-2 text-sm md:text-base text-gray-700 leading-snug">{stat.label}</p>
                    </div>
                  );
                })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;