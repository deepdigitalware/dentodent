import React, { createContext, useContext, useState, useEffect } from 'react';

const ContentContext = createContext();

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
    // For dentodent domain, use api subdomain
    if (hostname.includes('dentodent')) {
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
  const [content, setContent] = useState({
    // Initialize with empty objects to be populated from API
    header: {},
    hero: {},
    about: {},
    services: {},
    contact: {},
    doctor: {},
    testimonials: {},
    gallery: {},
    blog: {},
    faq: {},
    appointment: {},
    slider: {},
    cta: {},
    patient: {},
    footer: {},
    privacyPolicy: {},
    termsOfService: {},
    blogPosts: [],
    treatments: [],
    reviews: [],
    map: {}
  });

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
          // Ensure array-based sections are always arrays
          const safeContent = {
            ...apiContent,
            // Handle nested array structures with more robust checking
            blogPosts: (() => {
              const bp = apiContent.blogPosts;
              if (Array.isArray(bp)) return bp;
              if (bp && typeof bp === 'object') {
                if (Array.isArray(bp.posts)) return bp.posts;
                if (Array.isArray(bp.items)) return bp.items;
              }
              return [];
            })(),
            treatments: (() => {
              const t = apiContent.treatments;
              if (Array.isArray(t)) return t;
              if (t && typeof t === 'object') {
                if (Array.isArray(t.items)) return t.items;
                if (Array.isArray(t.posts)) return t.posts;
              }
              return [];
            })(),
            reviews: (() => {
              const r = apiContent.reviews;
              if (Array.isArray(r)) return r;
              if (r && typeof r === 'object') {
                if (Array.isArray(r.items)) return r.items;
                if (Array.isArray(r.posts)) return r.posts;
              }
              return [];
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
            // Ensure array-based sections are always arrays
            const base = (apiContent && typeof apiContent === 'object' && !Array.isArray(apiContent)) ? apiContent : {};
            const safeContent = {
              ...base,
              // Handle nested array structures with more robust checking
              blogPosts: (() => {
                const bp = base.blogPosts;
                if (Array.isArray(bp)) return bp;
                if (bp && typeof bp === 'object') {
                  if (Array.isArray(bp.posts)) return bp.posts;
                  if (Array.isArray(bp.items)) return bp.items;
                }
                return [];
              })(),
              treatments: (() => {
                const t = base.treatments;
                if (Array.isArray(t)) return t;
                if (t && typeof t === 'object') {
                  if (Array.isArray(t.items)) return t.items;
                  if (Array.isArray(t.posts)) return t.posts;
                }
                return [];
              })(),
              reviews: (() => {
                const r = base.reviews;
                if (Array.isArray(r)) return r;
                if (r && typeof r === 'object') {
                  if (Array.isArray(r.items)) return r.items;
                  if (Array.isArray(r.posts)) return r.posts;
                }
                return [];
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
        body: JSON.stringify({ data: newContent })
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
