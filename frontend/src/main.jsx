import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';

import { HelmetProvider } from 'react-helmet-async';
import { I18nProvider } from '@/lib/i18n.jsx';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import { ContentProvider } from '@/contexts/ContentContext.jsx';
import { BannersProvider } from '@/contexts/BannersContext.jsx';

// Initialize Google Analytics
if (typeof window !== 'undefined' && !window.location.pathname.includes('/admin')) {
  // Create script element for gtag.js
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-BCTEYDNMMR';
  document.head.appendChild(script);
  
  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', 'G-BCTEYDNMMR');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <I18nProvider>
        <ContentProvider>
          <BannersProvider>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </BannersProvider>
        </ContentProvider>
      </I18nProvider>
    </HelmetProvider>
  </React.StrictMode>
);