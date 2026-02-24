import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as HotToaster } from 'react-hot-toast';
import Header from '@/components/Header';
 import SliderBanner from '@/components/SliderBanner';
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
import CookiePolicy from '@/components/CookiePolicy';
import AdminRoute from '@/components/admin/AdminRoute';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { useContent } from '@/contexts/ContentContext';
import siteLogo from '@/assets/icons/logo.svg';
 
// Chatwoot widget integration
const initChatwoot = () => {
  if (typeof window === 'undefined') return;
  if (window.chatwootSDK) return;
  const BASE_URL = 'https://chatwoot.deepverse.cloud';
  const g = document.createElement('script');
  const s = document.getElementsByTagName('script')[0];
  g.src = `${BASE_URL}/packs/js/sdk.js`;
  g.async = true;
  s.parentNode.insertBefore(g, s);
  g.onload = function () {
    if (window.chatwootSDK && !window._chatwootInitialized) {
      window._chatwootInitialized = true;
      window.chatwootSDK.run({
        websiteToken: '4gFLWccH7v1ggNZbx321t3PZ',
        baseUrl: BASE_URL
      });
    }
  };
};

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

  const baseTitle = header.seoTitle || header.siteTitle || "Dent 'O' Dent - Premier Dental Clinic in Kolkata | Dr. Setketu Chakraborty";
  const baseDescription = header.seoDescription || 'Top-rated Dentist and Dental Clinic in Kolkata offering painless treatments: Dental Implants, Root Canal, Braces, Aligners, Smile Makeover, and Emergency Care. Book your appointment today!';
  let seoTitle = baseTitle;
  let seoDescription = baseDescription;
  let seoRobots = 'index,follow';

  switch (currentPage) {
    case 'gallery':
      seoTitle = "Dental Treatment Before & After Photos | Dent 'O' Dent Kolkata";
      seoDescription = "View real before-and-after dental treatment photos from Dent 'O' Dent in Kolkata, including smile makeovers, implants, braces, and more.";
      break;
    case 'blog':
      seoTitle = "Dental Blog Kolkata | Dental Tips, Treatment Costs & Guides";
      seoDescription = "Expert dental blog from Dent 'O' Dent Kolkata: root canal, implants, braces vs aligners, teeth whitening safety, and clinic selection tips.";
      break;
    case 'appointment':
      seoTitle = "Book Dentist Appointment Online | Dent 'O' Dent Kolkata";
      seoDescription = "Book a dental appointment online with Dent 'O' Dent Kolkata for painless treatments, same-day emergencies, and routine check-ups.";
      break;
    case 'patient-portal':
      seoTitle = "Dental Patient Portal | Dent 'O' Dent Kolkata";
      seoDescription = "Secure patient portal for managing appointments, treatment history, and communication with Dent 'O' Dent clinic in Kolkata.";
      seoRobots = 'noindex,follow';
      break;
    case 'faq':
      seoTitle = "Dental FAQs | Common Questions Answered | Dent 'O' Dent Kolkata";
      seoDescription = "Answers to common questions about dental treatments, root canal pain, implant safety, braces vs aligners, and clinic timings in Kolkata.";
      break;
    case 'privacy-policy':
      seoTitle = "Privacy Policy | Dent 'O' Dent Dental Clinic Kolkata";
      seoDescription = "Read the privacy policy of Dent 'O' Dent Dental Clinic Kolkata explaining how we collect, use, and protect your personal data.";
      seoRobots = 'noindex,nofollow';
      break;
    case 'terms-of-service':
      seoTitle = "Terms of Service | Dent 'O' Dent Dental Clinic Kolkata";
      seoDescription = "Review the terms and conditions for using Dent 'O' Dent Dental Clinic Kolkata website, services, and appointment system.";
      seoRobots = 'noindex,nofollow';
      break;
    case 'cookie-policy':
      seoTitle = "Cookie Policy | Dent 'O' Dent Dental Clinic Kolkata";
      seoDescription = "Learn how Dent 'O' Dent Dental Clinic Kolkata uses cookies and similar technologies on our website.";
      seoRobots = 'noindex,nofollow';
      break;
    case 'root-canal':
      seoTitle = "Painless Root Canal Treatment in Kolkata | Dent 'O' Dent";
      seoDescription = "Single or two-visit painless root canal treatment in Kolkata with modern rotary endodontics and digital X-rays at Dent 'O' Dent.";
      break;
    case 'dental-implants':
      seoTitle = "Dental Implants in Kolkata | Replace Missing Teeth | Dent 'O' Dent";
      seoDescription = "Long-lasting dental implants in Kolkata for single or multiple missing teeth with 3D planning and premium implant systems.";
      break;
    case 'braces':
      seoTitle = "Braces Treatment in Kolkata | Metal, Ceramic & Self-Ligating | Dent 'O' Dent";
      seoDescription = "Comprehensive orthodontic treatment in Kolkata: metal braces, ceramic braces, and self-ligating options for teens and adults.";
      break;
    case 'aligners':
      seoTitle = "Clear Aligners in Kolkata | Invisible Teeth Straightening | Dent 'O' Dent";
      seoDescription = "Transparent clear aligners in Kolkata for discreet teeth straightening with digital planning and regular monitoring.";
      break;
    case 'teeth-whitening':
      seoTitle = "Teeth Whitening in Kolkata | Safe Laser & Office Bleaching | Dent 'O' Dent";
      seoDescription = "Safe dental teeth whitening in Kolkata including laser whitening and in-office bleaching supervised by an experienced dentist.";
      break;
    case 'smile-makeover':
      seoTitle = "Smile Makeover in Kolkata | Veneers, Bonding & Contouring | Dent 'O' Dent";
      seoDescription = "Customized smile makeover plans in Kolkata using veneers, bonding, crowns, and gum contouring to transform your smile.";
      break;
    case 'pediatric-dentistry':
      seoTitle = "Child Dentist in Kolkata | Pediatric Dental Clinic | Dent 'O' Dent";
      seoDescription = "Gentle pediatric dentistry in Kolkata for kids and teens, including fillings, preventive care, and habit counseling.";
      break;
    case 'home':
    default:
      break;
  }

  const serviceSeoMap = {
    'root-canal': {
      name: 'Root Canal Treatment',
      description: 'Painless single or two-visit root canal treatment using rotary instruments and digital X-rays.',
      urlPath: '/root-canal'
    },
    'dental-implants': {
      name: 'Dental Implants',
      description: 'Implant-supported tooth replacement for single or multiple missing teeth.',
      urlPath: '/dental-implants'
    },
    'braces': {
      name: 'Braces Treatment',
      description: 'Orthodontic braces for correcting crowded, spaced, or protruding teeth.',
      urlPath: '/braces'
    },
    'aligners': {
      name: 'Clear Aligners',
      description: 'Transparent removable aligners for discreet teeth straightening.',
      urlPath: '/aligners'
    },
    'teeth-whitening': {
      name: 'Teeth Whitening',
      description: 'Dental whitening procedures to brighten stained or discolored teeth.',
      urlPath: '/teeth-whitening'
    },
    'smile-makeover': {
      name: 'Smile Makeover',
      description: 'Combined cosmetic dental treatments to enhance overall smile aesthetics.',
      urlPath: '/smile-makeover'
    },
    'pediatric-dentistry': {
      name: 'Pediatric Dentistry',
      description: 'Comprehensive dental care for infants, children, and teenagers.',
      urlPath: '/pediatric-dentistry'
    }
  };

  const structuredData = [];

  structuredData.push({
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    name: "Dent 'O' Dent",
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
  });

  const faqItems = Array.isArray(content?.faq?.items) ? content.faq.items : [];
  if (currentPage === 'faq' && faqItems.length > 0) {
    structuredData.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer
        }
      }))
    });
  }

  if (serviceSeoMap[currentPage]) {
    const svc = serviceSeoMap[currentPage];
    structuredData.push({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: svc.name,
      description: svc.description,
      provider: {
        '@type': 'Dentist',
        name: "Dent 'O' Dent"
      },
      areaServed: {
        '@type': 'City',
        name: 'Kolkata'
      },
      url: `${typeof window !== 'undefined' ? window.location.origin : 'https://www.dentodentdentalclinic.com'}${svc.urlPath}`
    });
  }

  useEffect(() => {
    // Check current route
    const checkRoute = () => {
      const path = window.location.pathname;
      const parts = path.split('/').filter(Boolean);
      if (path.includes('/admin')) {
        setIsAdminRoute(true);
        setCurrentPage('admin');
      } else {
        setIsAdminRoute(false);
        // Support /blog-{slug} and /blog/{slug}
        if (parts[0] === 'blog' && parts[1]) {
          setCurrentPage(`blog-${parts[1]}`);
        } else {
          const page = path.replace('/', '') || 'home';
          setCurrentPage(page);
        }
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
    initChatwoot();
    
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
      'home','admin','gallery','blog','appointment','patient-portal','faq','privacy-policy','terms-of-service','cookie-policy',
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
      case 'cookie-policy':
        return <CookiePolicy />;
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
            <SliderBanner />
            <Hero />
            <About />
            <Services />
            <Doctor />
            <Testimonials />
            <Gallery />
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
          <title>Admin Panel - Dent 'O' Dent</title>
          <meta name="description" content="Admin panel for managing Dent 'O' Dent website content and settings." />
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
          <title>{seoTitle}</title>
          <meta name="description" content={seoDescription} />
          <meta
            name="keywords"
            content="Dentist Kolkata, Dental Clinic Kolkata, Best Dentist in Kolkata, Root Canal Treatment Kolkata, Painless Root Canal Kolkata, Dental Implants Kolkata, Full Mouth Implants Kolkata, Braces Treatment Kolkata, Ceramic Braces Kolkata, Invisible Braces Kolkata, Clear Aligners Kolkata, Invisalign Kolkata, Smile Makeover Kolkata, Teeth Whitening Kolkata, Cosmetic Dentistry Kolkata, Pediatric Dentist Kolkata, Child Dental Clinic Kolkata, Emergency Dentist Kolkata, 24x7 Dental Emergency Kolkata, Dent O Dent Dental Clinic"
          />
          <meta name="robots" content={seoRobots} />
          <link rel="canonical" href={canonicalUrl} />
          <link rel="icon" href={header.faviconUrl || siteLogo} />

          <meta property="og:type" content="website" />
          <meta property="og:title" content={header.ogTitle || seoTitle} />
          <meta property="og:description" content={header.ogDescription || seoDescription} />
          <meta property="og:url" content={canonicalUrl} />
          <meta property="og:image" content={header.ogImage || 'https://images.unsplash.com/photo-1629909613638-0e4a1fad8f81?w=1200&h=630&fit=crop'} />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={header.twitterTitle || seoTitle} />
          <meta name="twitter:description" content={header.twitterDescription || seoDescription} />
          <meta name="twitter:image" content={header.twitterImage || header.ogImage || 'https://images.unsplash.com/photo-1629909613638-0e4a1fad8f81?w=1200&h=630&fit=crop'} />

          {structuredData.map((entry, index) => (
            <script key={index} type="application/ld+json">
              {JSON.stringify(entry)}
            </script>
          ))}
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
