import React, { createContext, useContext, useMemo, useState } from 'react';

const I18nContext = createContext({ lang: 'en', setLang: () => {}, t: (k) => k });

const translations = {
  en: {
    header_hours: 'Mon to Sat: 10AM - 9PM · Sun: 10AM - 9PM',
    header_phone: '+91 6290093271',
    hero_title: 'Premier Dental Care in Kolkata',
    hero_sub: 'Painless treatments with advanced technology and compassionate care.',
    hero_cta_book: 'Book Appointment',
    hero_cta_services: 'View Services',
    about_title: 'About Our Clinic',
    about_sub: 'Trusted by thousands for 15+ years in Kolkata.',
    footer_premium: "Kolkata's premier dental clinic providing world-class oral healthcare.",
    footer_quick_links: 'Quick Links',
    footer_services: 'Our Services',
    footer_contact: 'Contact Info',
    lang_en: 'English',
    lang_hi: 'Hindi',
    lang_bn: 'Bengali',
  },
  hi: {
    header_hours: 'सोम से शनि: 10AM - 9PM · रवि: 10AM - 9PM',
    header_phone: '+91 6290093271',
    hero_title: 'कोलकाता में प्रीमियम डेंटल केयर',
    hero_sub: 'उन्नत तकनीक के साथ दर्द रहित और स्नेहपूर्ण उपचार।',
    hero_cta_book: 'अपॉइंटमेंट बुक करें',
    hero_cta_services: 'सेवाएँ देखें',
    about_title: 'हमारे क्लिनिक के बारे में',
    about_sub: '15+ वर्षों से हज़ारों मरीजों का विश्वास।',
    footer_premium: 'कोलकाता का प्रीमियम डेंटल क्लिनिक, विश्व-स्तरीय देखभाल।',
    footer_quick_links: 'त्वरित लिंक',
    footer_services: 'हमारी सेवाएँ',
    footer_contact: 'संपर्क जानकारी',
    lang_en: 'English',
    lang_hi: 'हिन्दी',
    lang_bn: 'বাংলা',
  },
  bn: {
    header_hours: 'সোম থেকে শনি: 10AM - 9PM · রবি: 10AM - 9PM',
    header_phone: '+91 6290093271',
    hero_title: 'কলকাতায় প্রিমিয়াম ডেন্টাল কেয়ার',
    hero_sub: 'উন্নত প্রযুক্তিতে ব্যথাহীন ও আন্তরিক চিকিৎসা।',
    hero_cta_book: 'অ্যাপয়েন্টমেন্ট বুক করুন',
    hero_cta_services: 'সার্ভিস দেখুন',
    about_title: 'আমাদের ক্লিনিক সম্পর্কে',
    about_sub: '১৫+ বছর ধরে হাজারো রোগীর আস্থা।',
    footer_premium: 'কলকাতার প্রিমিয়াম ডেন্টাল ক্লিনিক, বিশ্বমানের যত্ন।',
    footer_quick_links: 'কুইক লিঙ্কস',
    footer_services: 'আমাদের সার্ভিসসমূহ',
    footer_contact: 'যোগাযোগ',
    lang_en: 'English',
    lang_hi: 'हिन्दी',
    lang_bn: 'বাংলা',
  },
};

export function I18nProvider({ children }) {
  const [lang, setLang] = useState('en');
  const value = useMemo(() => ({
    lang,
    setLang,
    t: (key) => (translations[lang] && translations[lang][key]) || translations.en[key] || key,
  }), [lang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}