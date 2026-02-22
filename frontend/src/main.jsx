import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';

import { HelmetProvider } from 'react-helmet-async';
import { I18nProvider } from '@/lib/i18n.jsx';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import { ContentProvider } from '@/contexts/ContentContext.jsx';
import { BannersProvider } from '@/contexts/BannersContext.jsx';

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
