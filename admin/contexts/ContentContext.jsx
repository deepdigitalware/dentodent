import React, { createContext, useContext, useState, useEffect } from 'react';

const ContentContext = createContext();

// API base URL - using window.location for client-side detection
const getApiUrl = () => {
  // Check environment variable first
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  try {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const port = window.location.port;
      if (hostname.includes('admin')) {
        return `${window.location.protocol}//${hostname}${port ? `:${port}` : ''}`;
      }
    }
  } catch {}
  // In production, use the current domain with /api path
  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol === 'http:' ? 'http:' : 'https:';
    const hostname = window.location.hostname;
    const port = window.location.port;
    if (hostname.includes('dentodent')) {
      return `${protocol}//${hostname}`;
    }
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      // On localhost, if we're on admin port, API is on backend port 4444
      if (port === '4001' || port === '6001') {
        return `http://${hostname}:4444`;
      }
      // Otherwise, default to 4444 for backend
      return `http://${hostname}:4444`;
    }
    
    // For IP address or other domains running on admin port
    if (port === '4001' || port === '6001') {
      return `${protocol}//${hostname}:4444`;
    }

    // Default fallback: VPS API
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
    privacyPolicy: {},
    termsOfService: {},
    faq: {},
    appointment: {},
    slider: {},
    cta: {},
    patient: {},
    footer: {},
    blogPosts: [],
    treatments: [],
    reviews: [],
    map: {}
  });

  const [apiUrl, setApiUrl] = useState(getApiUrl());
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('dod-api-url');
      }
    } catch {}
  }, []);
  
  // Helper: authenticated fetch with refresh-token retry
  const fetchWithRefresh = async (url, options = {}) => {
    const token = (typeof window !== 'undefined') ? localStorage.getItem('admin_token') : null;
    const refreshToken = (typeof window !== 'undefined') ? localStorage.getItem('admin_refresh_token') : null;
    const isFormData = options && options.body && typeof FormData !== 'undefined' && options.body instanceof FormData;
    const baseHeaders = {
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : undefined,
    };
    if (!isFormData && !baseHeaders['Content-Type']) {
      baseHeaders['Content-Type'] = 'application/json';
    }
    const opts = { ...options, headers: baseHeaders };
    let res = await fetch(url, opts);
    if ((res.status === 401 || res.status === 403) && refreshToken) {
      try {
        const r = await fetch(`${apiUrl}/api/token/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });
        if (r.ok) {
          const data = await r.json();
          if (data.token) {
            try { localStorage.setItem('admin_token', data.token); } catch {}
            const retryOpts = {
              ...opts,
              headers: {
                ...(opts.headers || {}),
                Authorization: `Bearer ${data.token}`,
              },
            };
            res = await fetch(url, retryOpts);
          }
        } else {
          // Refresh failed; clear tokens so UI can prompt re-login
          try {
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_refresh_token');
          } catch {}
        }
      } catch (e) {
        // fall through to original response
      }
    }
    return res;
  };

  // Detect API availability and fall back to VPS if local is unavailable
  useEffect(() => {
    const detectApi = async () => {
      // If we are using an explicit localhost API URL from env, assume it's correct and don't fallback to VPS automatically
      // This prevents switching to VPS when local backend is restarting or slow
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
          // Generic normalization: any object containing array 'items' or 'posts' -> use that array
          const generic = (() => {
            const out = {};
            try {
              Object.entries(apiContent || {}).forEach(([k, v]) => {
                if (v && typeof v === 'object' && !Array.isArray(v)) {
                  if (Array.isArray(v.items)) out[k] = v.items;
                  else if (Array.isArray(v.posts)) out[k] = v.posts;
                }
              });
            } catch {}
            return out;
          })();
          // Ensure array-based sections are always arrays
          const safeContent = {
            // Start with defaults to ensure all properties exist
            header: {},
            hero: {},
            about: {},
            services: {},
            contact: {},
            doctor: {},
            testimonials: (() => {
              const t = apiContent.testimonials;
              if (Array.isArray(t)) return t;
              if (t && typeof t === 'object') {
                if (Array.isArray(t.items)) return t.items;
              }
              return [];
            })(),
            gallery: (() => {
              const g = apiContent.gallery;
              if (Array.isArray(g)) return g;
              if (g && typeof g === 'object') {
                if (Array.isArray(g.items)) return g.items;
              }
              return [];
            })(),
            blog: {},
            privacyPolicy: {},
            termsOfService: {},
            faq: {},
            appointment: {},
            slider: {},
            cta: {},
            patient: {},
            footer: {},
            map: {},
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
            })(),
            // Merge other properties from API content then override with generic array normalization
            ...apiContent,
            ...generic
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
            // Generic normalization: any object containing array 'items' or 'posts' -> use that array
            const generic = (() => {
              const out = {};
              try {
                Object.entries(apiContent || {}).forEach(([k, v]) => {
                  if (v && typeof v === 'object' && !Array.isArray(v)) {
                    if (Array.isArray(v.items)) out[k] = v.items;
                    else if (Array.isArray(v.posts)) out[k] = v.posts;
                  }
                });
              } catch {}
              return out;
            })();
            // Ensure array-based sections are always arrays
            const base = (apiContent && typeof apiContent === 'object' && !Array.isArray(apiContent)) ? apiContent : {};
            const safeContent = {
              // Start with defaults to ensure all properties exist
              header: {},
              hero: {},
              about: {},
              services: {},
              contact: {},
              doctor: {},
              testimonials: (() => {
                const t = base.testimonials;
                if (Array.isArray(t)) return t;
                if (t && typeof t === 'object') {
                  if (Array.isArray(t.items)) return t.items;
                }
                return [];
              })(),
              gallery: (() => {
                const g = base.gallery;
                if (Array.isArray(g)) return g;
                if (g && typeof g === 'object') {
                  if (Array.isArray(g.items)) return g.items;
                }
                return [];
              })(),
              blog: {},
              privacyPolicy: {},
              termsOfService: {},
              faq: {},
              appointment: {},
              slider: {},
              cta: {},
              patient: {},
              footer: {},
              map: {},
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
              })(),
              // Merge other properties then override with generic array normalization
              ...base,
              ...generic
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
    // Optimistically update local state
    setContent(prev => ({
      ...prev,
      [section]: newContent
    }));

    // Save to API with robust error handling and status return
    try {
      const response = await fetchWithRefresh(`${apiUrl}/api/content/${section}`, {
        method: 'PUT',
        body: JSON.stringify(newContent)
      });

      let data;
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        const message = data?.error || `Failed to save content: ${response.status}`;
        console.error('[DOD] Persist failed:', message);
        // If unauthorized and refresh wasn't possible, clear tokens to force re-login
        if (response.status === 401 || response.status === 403) {
          try {
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_refresh_token');
          } catch {}
        }
        return { success: false, error: message, status: response.status };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error saving content to API:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    content,
    updateContent,
    apiUrl,
    fetchWithRefresh
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};
