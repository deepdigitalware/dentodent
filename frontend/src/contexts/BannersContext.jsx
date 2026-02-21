import React, { createContext, useContext, useState, useEffect } from 'react';

const BannersContext = createContext();

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
    // Prefer same-origin so the Node servers can proxy /api internally
    if (hostname.includes('dentodent')) {
      return `${protocol}//${hostname.replace('www.', '')}`;
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

export const useBanners = () => {
  const context = useContext(BannersContext);
  if (!context) {
    throw new Error('useBanners must be used within a BannersProvider');
  }
  return context;
};

export const BannersProvider = ({ children }) => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiUrl, setApiUrl] = useState(getApiUrl());

  // Load banners from API
  useEffect(() => {
    const loadBanners = async () => {
      try {
        setLoading(true);
        console.log('Fetching banners from:', `${apiUrl}/api/banners`);
        const response = await fetch(`${apiUrl}/api/banners`);
        console.log('Banners API response status:', response.status);
        if (response.ok) {
          const raw = await response.json();
          console.log('Banners loaded successfully:', raw);
          // Normalize shape to tolerate different keys
          const normalized = (Array.isArray(raw) ? raw : [])
            .map((b, i) => ({
              id: b.id ?? i + 1,
              title: b.title ?? b.name ?? '',
              subtitle: b.subtitle ?? '',
              image_url: b.image_url ?? b.imageUrl ?? b.image ?? b.url ?? '',
              mobile_image_url: b.mobile_image_url ?? b.mobileImageUrl ?? '',
              link_url: b.link_url ?? b.linkUrl ?? '',
              link_label: b.link_label ?? b.linkLabel ?? b.cta ?? '',
              alt_text: b.alt_text ?? b.alt ?? 'Banner',
              display_order: (b.display_order ?? b.order ?? i),
              is_active: b.is_active !== undefined ? b.is_active : true,
            }))
            .filter(b => !!b.image_url);
          // Filter active and sort
          const activeBanners = normalized
            .filter(b => b.is_active)
            .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
          setError(null);
          setBanners(activeBanners);
        } else {
          console.warn('Failed to load banners from API, status:', response.status);
          setError(`Failed to load banners: ${response.status}`);
        }
      } catch (error) {
        console.error('Error loading banners from API:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadBanners();
  }, [apiUrl]);

  const value = {
    banners,
    loading,
    error,
    apiUrl
  };

  return (
    <BannersContext.Provider value={value}>
      {children}
    </BannersContext.Provider>
  );
};
