import React, { createContext, useContext, useState, useEffect } from 'react';

const ContentContext = createContext();

const initialContent = {
  header: {},
  hero: {},
  about: {},
  services: {
    title: 'Our Treatments',
    subtitle: 'Comprehensive dental care for the whole family',
    services: [
      {
        title: 'Teeth Cleaning',
        description: 'Professional cleaning to remove plaque and tartar.',
        price: '₹800',
        duration: '45-60 minutes',
        imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1200&auto=format&fit=crop'
      },
      {
        title: 'Dental Implants',
        description: 'Replace missing teeth with natural-looking implants.',
        price: '₹25,000+',
        duration: '2-3 visits',
        imageUrl: 'https://images.unsplash.com/photo-1609840172440-4100665f7f83?w=1200&auto=format&fit=crop'
      },
      {
        title: 'Painless Root Canal',
        description: 'Single or two-visit rotary root canal procedure.',
        price: '₹3,500+',
        duration: '1-2 visits',
        imageUrl: 'https://images.unsplash.com/photo-1572635196236-6f0c9b47f36a?w=1200&auto=format&fit=crop'
      }
    ]
  },
  contact: {},
  doctor: {},
  testimonials: {},
  gallery: {},
  blog: {},
  faq: {
    title: 'Frequently Asked Questions',
    subtitle: 'Answers to the most common questions we receive',
    items: [
      { id: 'faq-1', question: 'Is root canal treatment painful?', answer: 'With modern anaesthesia and rotary instruments, most patients report only mild discomfort and no significant pain during the procedure.' },
      { id: 'faq-2', question: 'How long do dental implants last?', answer: 'Dental implants can last many years when properly maintained, often 10+ years. Good oral hygiene and regular checkups improve longevity.' },
      { id: 'faq-3', question: 'Do you offer clear aligners?', answer: 'Yes, we provide clear aligners for discreet teeth straightening, with digital planning and regular monitoring.' },
      { id: 'faq-4', question: 'Is teeth whitening safe?', answer: 'Professional dental whitening supervised by a dentist is safe and effective. We assess enamel condition and sensitivity before treatment.' }
    ]
  },
  appointment: {},
  slider: {},
  cta: {},
  patient: {},
  footer: {},
  privacyPolicy: {},
  termsOfService: {},
  blogPosts: [
    {
      id: 1,
      slug: 'painless-root-canal-kolkata',
      title: 'Painless Root Canal Treatment in Kolkata: Step-by-Step Guide',
      category: 'root-canal',
      date: '2024-01-10',
      excerpt: 'Learn how modern rotary instruments, digital X-rays, and proper anaesthesia make root canal treatment almost painless at Dent \'O\' Dent.',
      readTime: '6 min read',
      author: 'Dr. Setketu Chakraborty',
      tags: ['Root Canal', 'Pain Free', 'Kolkata'],
      keywords: ['painless rct kolkata', 'root canal cost', 'dentist bansdroni'],
      cover: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1200&auto=format&fit=crop',
      featured: true
    },
    {
      id: 2,
      slug: 'braces-vs-aligners-kolkata',
      title: 'Braces vs Clear Aligners: Which is Better for You?',
      category: 'orthodontics',
      date: '2024-02-02',
      excerpt: 'Compare treatment time, comfort, cost and appearance of traditional metal braces vs. clear aligners for teens and adults.',
      readTime: '7 min read',
      author: 'Dr. Setketu Chakraborty',
      tags: ['Braces', 'Aligners', 'Smile Makeover'],
      keywords: ['braces in kolkata', 'clear aligners cost', 'teeth straightening'],
      cover: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1200&auto=format&fit=crop',
      featured: true
    },
    {
      id: 3,
      slug: 'teeth-whitening-tips-at-home-and-clinic',
      title: 'Teeth Whitening in Kolkata: Home vs. Clinic Treatments',
      category: 'teeth-whitening',
      date: '2024-02-20',
      excerpt: 'Understand the difference between over-the-counter whitening kits and professional in‑clinic teeth whitening.',
      readTime: '5 min read',
      author: 'Dr. Setketu Chakraborty',
      tags: ['Whitening', 'Cosmetic Dentistry'],
      keywords: ['teeth whitening kolkata', 'yellow teeth treatment'],
      cover: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=1200&auto=format&fit=crop',
      featured: false
    }
  ],
  treatments: {
    items: [
      {
        title: 'Smile Makeover',
        slug: 'smile-makeover',
        description: 'Personalized cosmetic plan using veneers, bonding, and crowns.',
        price: '₹15,000+',
        duration: '2-3 visits',
        imageUrl: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=1200&auto=format&fit=crop'
      },
      {
        title: 'Braces',
        slug: 'braces',
        description: 'Metal, ceramic & self-ligating options for all ages.',
        price: '₹20,000+',
        duration: '12-18 months',
        imageUrl: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1200&auto=format&fit=crop'
      }
    ]
  },
  reviews: {
    title: 'What Our Patients Say',
    subtitle: 'Real experiences from patients treated at Dent "O" Dent',
    items: [
      {
        name: 'Priya Sharma',
        rating: 5,
        message: 'Very professional and friendly staff. My root canal was completely painless and the doctor explained every step clearly.',
        date: '2024-01-15'
      },
      {
        name: 'Rahul Verma',
        rating: 5,
        message: 'Clean clinic, modern equipment and excellent treatment. I am very happy with my smile makeover.',
        date: '2024-02-03'
      },
      {
        name: 'Ananya Gupta',
        rating: 4,
        message: 'Got my teeth cleaning and fillings done. The team was patient and made sure I was comfortable throughout.',
        date: '2024-02-20'
      }
    ]
  },
  map: {}
};

// API base URL - using window.location for client-side detection
const getApiUrl = () => {
  // Check environment variable first
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Allow a local override for testing: set localStorage['dod-api-url']
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const forced = window.localStorage.getItem('dod-api-url');
      if (forced && /^(https?:\/\/)/.test(forced)) {
        console.log('[DOD] Using forced API URL from localStorage:', forced);
        return forced;
      }
    }
  } catch {}
  // In production, use the current domain with /api path
  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    // For dentodent domain, use api subdomain for backend data
    if (hostname.includes('dentodent')) {
      // If we are on admin or frontend, we should point to api subdomain for data
      if (hostname.startsWith('admin.') || hostname === 'dentodentdentalclinic.com' || hostname === 'www.dentodentdentalclinic.com') {
        return `${protocol}//api.dentodentdentalclinic.com`;
      }
      return `${protocol}//${hostname}`;
    }
    // For localhost, use same-origin base to leverage local proxy (/api -> VPS)
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `${protocol}//${hostname}${window.location.port ? `:${window.location.port}` : ''}`;
    }
    // Default fallback to VPS API
    return 'https://api.dentodentdentalclinic.com';
  }
  // Server-side fallback
  return 'https://api.dentodentdentalclinic.com';
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState(initialContent);

  const [apiUrl, setApiUrl] = useState(getApiUrl());

  // Detect API availability and fall back to VPS if local is unavailable
  useEffect(() => {
    const detectApi = async () => {
      // If we are using an explicit localhost API URL from env, assume it's correct and don't fallback to VPS automatically
      if (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.includes('localhost')) {
        console.log('[DOD] Using configured local API:', apiUrl);
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      try {
        const healthUrl = `${apiUrl}/api/health`;
        const res = await fetch(healthUrl, { signal: controller.signal });
        if (!res.ok) throw new Error('Health check failed');
      } catch (e) {
        const vpsUrl = 'https://api.dentodentdentalclinic.com';
        console.warn('[DOD] Local API unavailable. Falling back to VPS:', vpsUrl);
        try { window.localStorage && localStorage.setItem('dod-api-url', vpsUrl); } catch {}
        setApiUrl(vpsUrl);
      } finally {
        clearTimeout(timeoutId);
      }
    };
    detectApi();
    // Run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load content from API when apiUrl is determined
  useEffect(() => {
    const loadContent = async () => {
      try {
        console.log('Fetching content from:', `${apiUrl}/api/content`);
        const response = await fetch(`${apiUrl}/api/content`);
        console.log('API response status:', response.status);
        if (response.ok) {
          const apiContent = await response.json();
          console.log('API content loaded successfully:', apiContent);

          const normalizeArray = (value) => {
            if (Array.isArray(value)) return value;
            if (value && typeof value === 'object') {
              if (Array.isArray(value.items)) return value.items;
              if (Array.isArray(value.posts)) return value.posts;
            }
            return [];
          };

          const normalizeObject = (value) => {
            if (value && typeof value === 'object' && !Array.isArray(value)) return value;
            return {};
          };

          const base = (apiContent && typeof apiContent === 'object' && !Array.isArray(apiContent))
            ? { ...initialContent, ...apiContent }
            : { ...initialContent };

          const safeContent = {
            ...base,
            hero: normalizeObject(base.hero),
            about: normalizeObject(base.about),
            services: normalizeObject(base.services),
            contact: normalizeObject(base.contact),
            doctor: normalizeObject(base.doctor),
            blog: normalizeObject(base.blog),
            faq: normalizeObject(base.faq),
            appointment: normalizeObject(base.appointment),
            slider: normalizeObject(base.slider),
            cta: normalizeObject(base.cta),
            patient: normalizeObject(base.patient),
            footer: normalizeObject(base.footer),
            privacyPolicy: normalizeObject(base.privacyPolicy),
            termsOfService: normalizeObject(base.termsOfService),
            map: normalizeObject(base.map),
            testimonials: normalizeArray(base.testimonials),
            gallery: normalizeArray(base.gallery),
            blogPosts: (() => {
              const arr = normalizeArray(base.blogPosts);
              return arr && arr.length > 0 ? arr : initialContent.blogPosts;
            })(),
            treatments: (() => {
              const section = normalizeObject(base.treatments);
              const items = normalizeArray(section.items || base.treatments);
              return { ...section, items };
            })(),
            reviews: (() => {
              const section = normalizeObject(base.reviews);
              const items = normalizeArray(section.items || base.reviews);
              return { ...section, items };
            })()
          };

          setContent(safeContent);
        } else {
          console.warn('Failed to load content from API, status:', response.status);
          // Try alternative endpoints
          console.log('Trying alternative endpoint: /api/content/all');
          const altResponse = await fetch(`${apiUrl}/api/content/all`);
          if (altResponse.ok) {
            const apiContent = await altResponse.json();
            console.log('Alternative API content loaded successfully:', apiContent);

            const normalizeArray = (value) => {
              if (Array.isArray(value)) return value;
              if (value && typeof value === 'object') {
                if (Array.isArray(value.items)) return value.items;
                if (Array.isArray(value.posts)) return value.posts;
              }
              return [];
            };

            const normalizeObject = (value) => {
              if (value && typeof value === 'object' && !Array.isArray(value)) return value;
              return {};
            };

            const baseRaw = (apiContent && typeof apiContent === 'object' && !Array.isArray(apiContent))
              ? apiContent
              : {};
            const base = { ...initialContent, ...baseRaw };

            const safeContent = {
              ...base,
              hero: normalizeObject(base.hero),
              about: normalizeObject(base.about),
              services: normalizeObject(base.services),
              contact: normalizeObject(base.contact),
              doctor: normalizeObject(base.doctor),
              blog: normalizeObject(base.blog),
              faq: normalizeObject(base.faq),
              appointment: normalizeObject(base.appointment),
              slider: normalizeObject(base.slider),
              cta: normalizeObject(base.cta),
              patient: normalizeObject(base.patient),
              footer: normalizeObject(base.footer),
              privacyPolicy: normalizeObject(base.privacyPolicy),
              termsOfService: normalizeObject(base.termsOfService),
              map: normalizeObject(base.map),
              testimonials: normalizeArray(base.testimonials),
              gallery: normalizeArray(base.gallery),
              blogPosts: normalizeArray(base.blogPosts),
              treatments: (() => {
                const section = normalizeObject(base.treatments);
                const items = normalizeArray(section.items || base.treatments);
                return { ...section, items };
              })(),
              reviews: (() => {
                const section = normalizeObject(base.reviews);
                const items = normalizeArray(section.items || base.reviews);
                return { ...section, items };
              })()
            };

            setContent(safeContent);
          } else {
            console.warn('Alternative endpoint also failed, status:', altResponse.status);
          }
        }
      } catch (error) {
        console.error('Error loading content from API:', error);
      }
    };

    loadContent();
  }, [apiUrl]);

  const updateContent = async (section, newContent) => {
    // Update local state immediately for responsive UI
    setContent(prev => ({
      ...prev,
      [section]: newContent
    }));
    
    // Save to API
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      const response = await fetch(`${apiUrl}/api/content/${section}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newContent)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to update content: ${response.status} ${response.statusText}. ${errorData.error || ''}`);
      }
      
      const result = await response.json();
      console.log('Content updated successfully:', result);
      return { success: true, data: result };
    } catch (error) {
      console.error('Error saving content to API:', error);
      // Revert the local state if API update fails
      setContent(prev => ({
        ...prev,
        [section]: content[section] // Revert to previous content
      }));
      return { success: false, error: error.message };
    }
  };

  const value = {
    content,
    updateContent,
    apiUrl
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};
