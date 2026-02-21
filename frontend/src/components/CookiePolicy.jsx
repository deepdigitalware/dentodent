import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Info, Settings, Cookie } from 'lucide-react';
import { useContent } from '@/contexts/ContentContext';

const Section = ({ icon: Icon, title, children }) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
    className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
  >
    <div className="flex items-center space-x-3 mb-4">
      <Icon className="w-5 h-5 text-blue-600" />
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
    </div>
    <div className="text-gray-700 leading-relaxed">{children}</div>
  </motion.section>
);

function CookiePolicy() {
  const { content } = useContent();
  const title = content?.privacyPolicy?.cookiePolicyTitle || 'Cookie Policy';
  const intro = content?.privacyPolicy?.cookiePolicyIntro || 'This Cookie Policy explains how we use cookies and similar technologies to provide, protect, and improve our services.';

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 mb-4">
            <Cookie className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold">{title}</h1>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">{intro}</p>
        </motion.div>

        <div className="space-y-8">
          <Section icon={Info} title="What Are Cookies">
            <p>Cookies are small text files placed on your device to store information. They help our website remember your preferences and improve your experience.</p>
          </Section>

          <Section icon={Shield} title="Types of Cookies We Use">
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Essential Cookies:</strong> Required for core site functionality and security.</li>
              <li><strong>Analytics Cookies:</strong> Help us understand usage to improve performance.</li>
              <li><strong>Preference Cookies:</strong> Remember your choices like language and layout.</li>
              <li><strong>Marketing Cookies:</strong> Used only with consent to personalize content.</li>
            </ul>
          </Section>

          <Section icon={Settings} title="Managing Cookies">
            <ul className="list-disc pl-6 space-y-2">
              <li>You can control cookies through your browser settings.</li>
              <li>Blocking essential cookies may impact site functionality.</li>
              <li>You can withdraw consent for non-essential cookies at any time.</li>
            </ul>
          </Section>

          <Section icon={Info} title="Third-Party Cookies">
            <p>We may use trusted third-party services (such as analytics) that set cookies to help us deliver and improve our services. These providers are required to protect your information.</p>
          </Section>
        </div>
      </div>
    </section>
  );
}

export default CookiePolicy;
