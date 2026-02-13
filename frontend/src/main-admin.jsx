import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { HelmetProvider } from 'react-helmet-async';
import { I18nProvider } from './lib/i18n.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { ContentProvider } from './contexts/ContentContext.jsx';
import AdminPanel from './components/admin/AdminPanel';

// Render only the admin panel
const AdminApp = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <AdminPanel />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <I18nProvider>
        <ContentProvider>
          <ErrorBoundary>
            <AdminApp />
          </ErrorBoundary>
        </ContentProvider>
      </I18nProvider>
    </HelmetProvider>
  </React.StrictMode>
);