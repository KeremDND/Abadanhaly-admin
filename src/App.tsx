import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Header, Footer, LanguageToast } from './components/layout';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load components
const Hero = lazy(() => import('./components/home/Hero'));
const Gallery = lazy(() => import('./components/gallery/Gallery'));
const Collaboration = lazy(() => import('./components/collaboration/Collaboration'));
const About = lazy(() => import('./components/about/About'));

type Page = 'home' | 'gallery' | 'collaboration' | 'about' | 'shop' | 'product' | 'support' | 'certificates';

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-emerald-800 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isInitialized, setIsInitialized] = useState(false);

  const skipToMain = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
    }
  };

  // Get base path from vite config (for GitHub Pages)
  const BASE_PATH = '/Abadanhaly-admin';
  
  // Initialize page from current URL on mount
  useEffect(() => {
    const initializePage = () => {
      try {
        const path = window.location.pathname;
        // Remove base path and trailing slash
        let normalizedPath = path.replace(BASE_PATH, '') || '/';
        if (normalizedPath.endsWith('/') && normalizedPath !== '/') {
          normalizedPath = normalizedPath.slice(0, -1);
        }
        
        if (normalizedPath === '/' || normalizedPath === '') {
          setCurrentPage('home');
        } else if (normalizedPath === '/gallery') {
          setCurrentPage('gallery');
        } else if (normalizedPath === '/collaboration') {
          setCurrentPage('collaboration');
        } else if (normalizedPath === '/about') {
          setCurrentPage('about');
        } else {
          setCurrentPage('home'); // Default to home for unknown paths
        }
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize page:', error);
        setCurrentPage('home');
        setIsInitialized(true);
      }
    };
    
    initializePage();
  }, []);

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const normalizedPath = path.replace(BASE_PATH, '') || '/';
      
      if (normalizedPath === '/' || normalizedPath === '') setCurrentPage('home');
      else if (normalizedPath === '/gallery') setCurrentPage('gallery');
      else if (normalizedPath === '/collaboration') setCurrentPage('collaboration');
      else if (normalizedPath === '/about') setCurrentPage('about');
      else setCurrentPage('home');
      
      // Scroll to top when using browser back/forward
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (page: Page) => {
    setCurrentPage(page);
    const relativePath = page === 'home' ? '/' : `/${page}`;
    const fullPath = `${BASE_PATH}${relativePath}`;
    window.history.pushState({}, '', fullPath);
    // Scroll to top when navigating to a new page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <Hero onNavigate={navigate} />
          </Suspense>
        );
      case 'gallery':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <Gallery />
          </Suspense>
        );
      case 'collaboration':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <Collaboration />
          </Suspense>
        );

      case 'about':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <About onNavigate={navigate} />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <Hero onNavigate={navigate} />
          </Suspense>
        );
    }
  };

  // Show loading spinner until initialized
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-800 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
          <a href="#main-content" className="skip-link" onClick={skipToMain}>
            Skip to main content
          </a>
          <Header currentPage={currentPage} onNavigate={navigate} />
          <main id="main-content" tabIndex={-1}>
            {renderPage()}
          </main>
          <Footer onNavigate={navigate} />
          <LanguageToast />
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;