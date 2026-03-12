import React from 'react';
import { motion } from 'framer-motion';
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

const About = () => {
  const { content } = useContent();
  const stats = Array.isArray(content?.hero?.stats) ? content.hero.stats : [];

  const { t } = useI18n();

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
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

          {/* Right Content - Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-white/90 rounded-2xl p-5 md:p-7 shadow-lg border border-blue-100">
              <div className="grid grid-cols-2 gap-4 md:gap-5">
                {stats.map((stat, index) => {
                  const { number, suffix } = parseStatNumber(stat.number);
                  return (
                    <div key={index} className="rounded-xl bg-blue-50 px-4 py-4 text-center">
                      <p className="text-2xl md:text-3xl font-bold text-blue-700">
                        {number.toLocaleString()}{suffix}
                      </p>
                      <p className="mt-1 text-sm md:text-base text-gray-700">{stat.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;