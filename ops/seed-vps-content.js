const API_BASE = 'https://api.dentodentdentalclinic.com';

const defaults = {
  header: {
    siteTitle: 'Dent O Dent Dental Clinic',
    siteSubtitle: 'Healthy smiles for life',
    logoUrl: '/assets/icons/logo.svg',
    faviconUrl: '/assets/icons/favicon.svg',
    navItems: [
      { label: 'Home', mode: 'scroll', target: 'home' },
      { label: 'Why Choose Us', mode: 'scroll', target: 'about' },
      { label: 'Treatments', mode: 'scroll', target: 'treatments' },
      { label: 'Gallery', mode: 'route', target: 'gallery' },
      { label: 'Blog', mode: 'route', target: 'blog' },
      { label: 'FAQ', mode: 'scroll', target: 'faq' },
      { label: 'Get in Touch', mode: 'scroll', target: 'contact' }
    ],
    ctaText: 'Book a Free Appointment',
    ctaMode: 'external',
    ctaTarget: 'https://wa.me/916290093271',
    ticker: [
      { text: 'Emergency Slots Available' },
      { text: 'Free Dental Check-up for Child below age 5' },
      { text: 'Call: +91 6290093271' }
    ]
  },
  hero: {
    title: 'Exceptional Dental Care',
    subtitle: 'Your smile is our priority',
    description: 'We provide comprehensive dental services with modern technology and a patient-first approach.',
    imageUrl: 'https://images.unsplash.com/photo-1629909613638-0e4a1fad8f81?auto=format&fit=crop&w=1400&q=80',
    imageAlt: 'Modern dental clinic interior with advanced equipment',
    stats: [
      { icon: 'Clock', number: '5+', label: 'Years Of Experiences' },
      { icon: 'Users', number: '1000+', label: 'Happy Patients' },
      { icon: 'Users', number: '1000+', label: 'Orthodontic Cases' },
      { icon: 'Users', number: '500+', label: 'Implants Placed' }
    ],
    buttonText: 'Book a Free Appointment',
    phoneNumber: '+91 6290093271'
  },
  about: {
    title: 'About Our Clinic',
    description: 'Dent O Dent has been delivering trusted dental care with a focus on comfort and outcomes.',
    mission: 'To provide ethical, advanced, and affordable dental treatment for every patient.',
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1200&auto=format&fit=crop',
    features: ['Modern Equipment', 'Experienced Team', 'Sterile Environment', 'Patient-Centric Care']
  },
  services: {
    title: 'Our Treatments',
    subtitle: 'Comprehensive dental care for the whole family',
    services: [
      { title: 'Teeth Cleaning', description: 'Professional cleaning to remove plaque and tartar.', price: 'INR 800', duration: '45-60 minutes' },
      { title: 'Dental Implants', description: 'Replace missing teeth with natural-looking implants.', price: 'INR 25,000+', duration: '2-3 visits' },
      { title: 'Root Canal', description: 'Single or two-visit painless rotary root canal treatment.', price: 'INR 3,500+', duration: '1-2 visits' }
    ]
  },
  treatments: {
    title: 'Featured Treatments',
    subtitle: 'Comprehensive care for every smile',
    items: [
      { title: 'Teeth Whitening', slug: 'teeth-whitening', description: 'Safe, effective whitening treatments to brighten your smile.', imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600' },
      { title: 'Dental Implants', slug: 'dental-implants-kolkata', description: 'Natural-looking implant solutions for missing teeth.', imageUrl: 'https://images.unsplash.com/photo-1582719478250-cc250a63c9a3?w=600' }
    ]
  },
  reviews: {
    title: 'What Our Patients Say',
    subtitle: 'Real stories from our happy patients',
    items: [
      { name: 'Priya Sharma', rating: 5, message: 'Very professional and friendly team.', date: '2026-01-10' },
      { name: 'Rahul Verma', rating: 5, message: 'Great treatment quality and smooth process.', date: '2026-01-18' }
    ]
  },
  map: {
    title: 'Find Us',
    subtitle: 'Visit our clinic in Kolkata',
    address: '1/8/1, near Master Da Surya Sen Club, Suryanagar, Regent Grove, Bansdroni, Kolkata, West Bengal 700040',
    lat: '22.4769517',
    lng: '88.3569182',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.1234567890!2d88.3569182!3d22.4769517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02716fdf94eb89%3A0xdddb71badc260474!2s1%2F8%2F1%2C%20near%20Master%20Da%20Surya%20Sen%20Club%2C%20Suryanagar%2C%20Regent%20Grove%2C%20Bansdroni%2C%20Kolkata%2C%20West%20Bengal%20700040!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin'
  },
  doctor: {
    name: 'Dr. Setketu Chakraborty',
    title: 'Lead Dental Surgeon',
    bio: 'Dedicated to comfortable and precise dental care.',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=900&auto=format&fit=crop',
    specialties: ['Root Canal', 'Dental Implants', 'Smile Design'],
    education: ['BDS', 'Advanced Endodontics Training'],
    achievements: ['10+ years experience', '1000+ successful cases']
  },
  testimonials: {
    title: 'Patient Testimonials',
    subtitle: 'Hear from our patients',
    stats: [
      { label: 'Happy Patients', value: '1000+' },
      { label: 'Years Experience', value: '5+' }
    ]
  },
  gallery: {
    title: 'Our Gallery',
    subtitle: 'Clinic moments and smile transformations',
    images: []
  },
  blog: {
    title: 'Dental Blog',
    subtitle: 'Tips, updates, and treatment guides'
  },
  blogPosts: [
    {
      id: 1,
      slug: 'painless-root-canal-kolkata-2026',
      title: 'Painless Root Canal Treatment in Kolkata (2026 Guide)',
      category: 'root-canal',
      date: '2026-01-10',
      excerpt: 'Learn how modern rotary instruments and digital X-rays make root canal therapy comfortable.',
      author: 'Dr. Setketu Chakraborty',
      readTime: '6 min',
      cover: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=1200',
      featured: true
    }
  ],
  faq: {
    title: 'Frequently Asked Questions',
    subtitle: 'Answers to common dental questions',
    items: [
      { id: 'faq-1', question: 'Is root canal treatment painful?', answer: 'Modern anesthesia and techniques make treatment comfortable.' },
      { id: 'faq-2', question: 'How long do implants last?', answer: 'With proper care, implants can last many years.' }
    ]
  },
  privacyPolicy: {
    title: 'Privacy Policy',
    content: 'Your privacy is important to us. We only collect information required to provide treatment and communication.',
    effectiveDate: '2026-01-01',
    lastUpdated: '2026-03-12'
  },
  termsOfService: {
    title: 'Terms of Service',
    content: 'By using our website and services, you agree to our terms and applicable clinic policies.',
    effectiveDate: '2026-01-01',
    lastUpdated: '2026-03-12'
  },
  contact: {
    title: 'Get in Touch',
    subtitle: 'Book an appointment or ask a question',
    address: '1/8/1, near Master Da Surya Sen Club, Suryanagar, Regent Grove, Bansdroni, Kolkata, West Bengal 700040',
    phone: '+91 6290093271',
    email: 'deepversestudio@gmail.com',
    hours: {
      weekdays: '10:00 AM - 10:00 PM',
      saturday: '10:00 AM - 10:00 PM',
      sunday: '10:00 AM - 10:00 PM'
    },
    services: ['Teeth Cleaning', 'Root Canal', 'Implants', 'Whitening']
  },
  footer: {
    title: 'Dent O Dent Dental Clinic',
    subtitle: 'Healthy smiles for life',
    clinicName: 'Dent O Dent',
    text: 'All Rights Reserved.',
    copyright: 'Copyright 2026 Dent O Dent Dental Clinic',
    poweredBy: 'Powered by Deepverse',
    quickLinks: [
      { label: 'Home', target: 'home', mode: 'scroll' },
      { label: 'Treatments', target: 'treatments', mode: 'scroll' },
      { label: 'Contact', target: 'contact', mode: 'scroll' }
    ],
    legalLinks: [
      { label: 'Privacy Policy', target: 'privacy-policy', mode: 'route' },
      { label: 'Terms of Service', target: 'terms-of-service', mode: 'route' }
    ]
  },
  appointment: {
    title: 'Book an Appointment',
    description: 'Choose your preferred date and time and our team will confirm your visit.',
    text: 'Quick booking available via WhatsApp and phone.'
  },
  slider: {
    title: 'Featured Treatments',
    subtitle: 'Our most popular services',
    slides: [
      { imageUrl: 'https://api.dentodentdentalclinic.com/assets/images/banner/slide1.svg', title: 'Modern Dentistry', subtitle: 'Advanced technology for painless treatments', order: 1, active: true },
      { imageUrl: 'https://api.dentodentdentalclinic.com/assets/images/banner/slide2.svg', title: 'Expert Care', subtitle: 'Experienced professionals for your smile', order: 2, active: true }
    ]
  },
  cta: {
    title: 'Ready for Your Best Smile?',
    description: 'Book your consultation today.',
    text: 'Book your visit now',
    buttonText: 'Book a Free Appointment',
    buttonLink: 'https://wa.me/916290093271'
  },
  patient: {
    title: 'Patient Portal',
    description: 'Access your records and appointments.',
    text: 'Secure patient access coming soon',
    items: []
  },
  site: {
    seoTitle: 'Dent O Dent Dental Clinic',
    seoDescription: 'Dent O Dent provides advanced and affordable dental care in Kolkata.',
    ogTitle: 'Dent O Dent Dental Clinic',
    ogDescription: 'Exceptional dental care. Your smile is our priority.',
    ogImage: 'https://dentodentdentalclinic.com/logo.svg',
    twitterTitle: 'Dent O Dent Dental Clinic',
    twitterDescription: 'Exceptional dental care. Your smile is our priority.',
    twitterImage: 'https://dentodentdentalclinic.com/logo.svg'
  },
  social: {
    whatsapp: 'https://wa.me/916290093271',
    phone: 'tel:+916290093271',
    email: 'mailto:deepversestudio@gmail.com',
    facebook: '',
    instagram: ''
  }
};

const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

const mergeWithDefaults = (existing, fallback) => {
  if (Array.isArray(fallback)) {
    if (!Array.isArray(existing) || existing.length === 0) return fallback;
    return existing;
  }

  if (fallback && typeof fallback === 'object') {
    const base = (existing && typeof existing === 'object' && !Array.isArray(existing)) ? { ...existing } : {};
    for (const [key, val] of Object.entries(fallback)) {
      const current = base[key];
      if (isEmpty(current)) {
        base[key] = val;
      } else if (typeof val === 'object' && !Array.isArray(val)) {
        base[key] = mergeWithDefaults(current, val);
      }
    }
    return base;
  }

  return isEmpty(existing) ? fallback : existing;
};

const requestJson = async (url, options = {}) => {
  const res = await fetch(url, options);
  const text = await res.text();
  const body = text ? JSON.parse(text) : {};
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}: ${text}`);
  }
  return body;
};

(async () => {
  console.log('Loading current content...');
  const current = await requestJson(`${API_BASE}/api/content`);

  const updates = [];
  for (const [section, sectionDefaults] of Object.entries(defaults)) {
    const merged = mergeWithDefaults(current[section], sectionDefaults);

    const before = JSON.stringify(current[section] ?? {});
    const after = JSON.stringify(merged ?? {});
    if (before !== after) {
      updates.push(section);
      await requestJson(`${API_BASE}/api/content/${section}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(merged)
      });
      console.log(`Updated section: ${section}`);
    }
  }

  if (updates.length === 0) {
    console.log('No section needed updates.');
  } else {
    console.log(`Done. Updated ${updates.length} sections.`);
  }
})();
