import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as HotToaster } from 'react-hot-toast';
import Header from '@/components/Header';
import SliderBanner from '@/components/SliderBanner';
import BannerSlider from '@/components/BannerSlider';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import RootCanal from '@/components/services/RootCanal';
import DentalImplants from '@/components/services/DentalImplants';
import Braces from '@/components/services/Braces';
import Aligners from '@/components/services/Aligners';
import TeethWhitening from '@/components/services/TeethWhitening';
import SmileMakeover from '@/components/services/SmileMakeover';
import PediatricDentistry from '@/components/services/PediatricDentistry';
import Doctor from '@/components/Doctor';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Gallery from '@/components/Gallery';
import Blog from '@/components/Blog';
import Treatments from '@/components/Treatments';
import Reviews from '@/components/Reviews';
import BlogList from '@/components/BlogList';
import BlogPost from '@/components/BlogPost';
import AppointmentBooking from '@/components/AppointmentBooking';
import PatientPortal from '@/components/PatientPortal';
import FAQ from '@/components/FAQ';
import Error404 from '@/components/Error404';
import LoadingSpinner from '@/components/LoadingSpinner';
import PrivacyPolicy from '@/components/PrivacyPolicy';
import TermsOfService from '@/components/TermsOfService';
import AdminRoute from '@/components/admin/AdminRoute';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { useContent } from '@/contexts/ContentContext';

function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoading, setIsLoading] = useState(false);
  const { content } = useContent();
  const header = content?.header || {};

  // Canonical URL for current route
  const canonicalUrl = (typeof window !== 'undefined')
    ? `${window.location.origin}${window.location.pathname}`
    : 'https://www.dentodentdentalclinic.com/';

  useEffect(() => {
    // Check current route
    const checkRoute = () => {
      const path = window.location.pathname;
      
      if (path.includes('/admin')) {
        setIsAdminRoute(true);
        setCurrentPage('admin');
      } else {
        setIsAdminRoute(false);
        // Extract page from path
        const page = path.replace('/', '') || 'home';
        setCurrentPage(page);
      }
    };

    checkRoute();

    // Listen for URL changes
    const handlePopState = () => {
      checkRoute();
    };

    const handlePushState = () => {
      checkRoute();
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('pushstate', handlePushState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('pushstate', handlePushState);
    };
  }, []);

  // Handle admin route navigation
  useEffect(() => {
    const handleAdminAccess = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        navigateToPage('admin');
      }
    };

    window.addEventListener('keydown', handleAdminAccess);
    return () => window.removeEventListener('keydown', handleAdminAccess);
  }, []);

  // Navigation function
  const navigateToPage = (page) => {
    setIsLoading(true);
    
    setTimeout(() => {
      if (page === 'admin') {
        window.history.pushState({}, '', '/admin');
        setIsAdminRoute(true);
        setCurrentPage('admin');
      } else {
        const path = page === 'home' ? '/' : `/${page}`;
        window.history.pushState({}, '', path);
        setIsAdminRoute(false);
        setCurrentPage(page);
      }
      setIsLoading(false);
    }, 300); // Reduce timeout for better performance
  };

  // Render page content
  const renderPage = () => {
    if (isLoading) {
      return <LoadingSpinner fullScreen={true} text="Loading page..." />;
    }

    // Blog post dynamic routing (e.g., blog-root-canal-cost-...)
    if (currentPage.startsWith('blog-')) {
      const slug = currentPage.replace('blog-', '');
      return <BlogPost slug={slug} />;
    }

    const known = new Set([
      'home','admin','gallery','blog','appointment','patient-portal','faq','privacy-policy','terms-of-service',
      'root-canal','dental-implants','braces','aligners','teeth-whitening','smile-makeover','pediatric-dentistry'
    ]);
    if (!known.has(currentPage)) {
      return <Error404 />;
    }

    switch (currentPage) {
      case 'admin':
        return <AdminRoute />;
      case 'gallery':
        return <Gallery />;
      case 'blog':
        return <BlogList onNavigate={navigateToPage} />;
      case 'appointment':
        return <AppointmentBooking />;
      case 'patient-portal':
        return <PatientPortal />;
      case 'faq':
        return <FAQ />;
      case 'privacy-policy':
        return <PrivacyPolicy />;
      case 'terms-of-service':
        return <TermsOfService />;
      // Service pages
      case 'root-canal':
        return <RootCanal onNavigate={navigateToPage} />;
      case 'dental-implants':
        return <DentalImplants onNavigate={navigateToPage} />;
      case 'braces':
        return <Braces onNavigate={navigateToPage} />;
      case 'aligners':
        return <Aligners onNavigate={navigateToPage} />;
      case 'teeth-whitening':
        return <TeethWhitening onNavigate={navigateToPage} />;
      case 'smile-makeover':
        return <SmileMakeover onNavigate={navigateToPage} />;
      case 'pediatric-dentistry':
        return <PediatricDentistry onNavigate={navigateToPage} />;
      case 'home':
      default:
        return (
          <>
            <BannerSlider />
            <Hero />
            <About />
            <Services />
            <Treatments />
            <Doctor />
            <Testimonials />
            <Gallery />
            <Reviews />
            <Blog />
            <FAQ />
            <Contact />
          </>
        );
    }
  };

  // Admin route component
  if (isAdminRoute) {
    return (
      <>
        <Helmet>
          <title>Admin Panel - Dent O Dent</title>
          <meta name="description" content="Admin panel for managing Dent O Dent website content and settings." />
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        {renderPage()}
        <HotToaster position="top-right" />
      </>
    );
  }

  // Main website
  return (
    <>
        <Helmet>
          <title>{header.seoTitle || header.siteTitle || 'Dent O Dent - Premier Dental Clinic in Kolkata | Dr. Setketu Chakraborty'}</title>
          <meta name="description" content={header.seoDescription || 'Top-rated Dentist and Dental Clinic in Kolkata offering painless treatments: Dental Implants, Root Canal, Braces, Aligners, Smile Makeover, and Emergency Care. Book your appointment today!'} />
          <meta name="keywords" content="Dentist Kolkata, Dental Clinic Kolkata, Best Dentist in Kolkata, Dental Implants Kolkata, Root Canal Kolkata, Orthodontist Kolkata, Cosmetic Dentistry Kolkata, Emergency Dentist Kolkata" />
          <link rel="canonical" href={canonicalUrl} />
          {header.faviconUrl && <link rel="icon" href={header.faviconUrl} />}

          {/* Open Graph */}
          <meta property="og:type" content="website" />
          <meta property="og:title" content={header.ogTitle || 'Dent O Dent - Premier Dental Clinic in Kolkata'} />
          <meta property="og:description" content={header.ogDescription || 'Advanced dental treatments with modern technology and compassionate care in Kolkata. Book your appointment with Dent O Dent.'} />
          <meta property="og:url" content={canonicalUrl} />
          <meta property="og:image" content={header.ogImage || 'https://images.unsplash.com/photo-1629909613638-0e4a1fad8f81?w=1200&h=630&fit=crop'} />

          {/* Twitter Card */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={header.twitterTitle || 'Dent O Dent - Premier Dental Clinic in Kolkata'} />
          <meta name="twitter:description" content={header.twitterDescription || 'Advanced dental treatments with modern technology and compassionate care in Kolkata.'} />
          <meta name="twitter:image" content={header.twitterImage || header.ogImage || 'https://images.unsplash.com/photo-1629909613638-0e4a1fad8f81?w=1200&h=630&fit=crop'} />

          {/* Local Business Schema (Dentist) */}
          <script type="application/ld+json">{JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Dentist',
            name: 'Dent O Dent',
            image: 'https://images.unsplash.com/photo-1629909613638-0e4a1fad8f81',
            url: canonicalUrl,
            telephone: '+916290093271',
            address: {
              '@type': 'PostalAddress',
              streetAddress: '1/8/1, near Master Da Surya Sen Club, Suryanagar, Regent Grove, Bansdroni',
              addressLocality: 'Kolkata',
              addressRegion: 'West Bengal',
              postalCode: '700040',
              addressCountry: 'IN'
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: 22.4749,
              longitude: 88.3629
            },
            openingHoursSpecification: [
              { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], opens: '09:00', closes: '20:00' },
              { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Sunday', opens: '10:00', closes: '18:00' }
            ],
            sameAs: [
              'https://www.facebook.com/',
              'https://www.instagram.com/',
              'https://g.co/kgs/'
            ]
          })}</script>
        </Helmet>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 overflow-x-hidden pt-24 md:pt-28">
          <Header onNavigate={navigateToPage} />
          {renderPage()}
          <Footer onNavigate={navigateToPage} />
          <FloatingWhatsApp />
          <Toaster />
          {/* Admin Access Hint */}
          <div className="fixed bottom-4 right-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div className="bg-gray-800 text-white text-xs px-3 py-2 rounded-lg shadow-lg">
              Press Ctrl+Shift+A for Admin Panel
            </div>
          </div>
        </div>
    </>
  );
}

export default App;