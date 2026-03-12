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

const StatCounter = ({ value, start }) => {
  const { number, suffix } = parseStatNumber(value);
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    if (!start) return;
    const duration = 1400;
    const begin = performance.now();

    const step = (ts) => {
      const p = Math.min((ts - begin) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplayValue(Math.round(number * eased));
      if (p < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [start, number]);

  return <>{displayValue.toLocaleString()}{suffix}</>;
};

const About = () => {
  const { content } = useContent();
  const stats = Array.isArray(content?.hero?.stats) ? content.hero.stats : [];
  const [startCount, setStartCount] = React.useState(false);
  const sectionRef = React.useRef(null);

  React.useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setStartCount(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const { t } = useI18n();

  return (
    <section id="about" className="py-16 md:py-20 bg-gradient-to-br from-gray-50 to-blue-50" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-start">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-display font-bold mb-4 md:mb-6">
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
            className="relative lg:pt-2"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                {stats.map((stat, index) => {
                  const Icon = getStatIcon(stat.icon);
                  return (
                    <div key={index} className="px-1 py-2 text-center">
                      <Icon className="w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl md:text-3xl font-bold text-blue-700 leading-none">
                        <StatCounter value={stat.number} start={startCount} />
                      </p>
                      <p className="mt-2 text-sm md:text-[15px] text-gray-700 leading-snug md:whitespace-nowrap">{stat.label}</p>
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