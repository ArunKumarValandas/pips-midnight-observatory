import React, { useState, useEffect } from 'react';
import type { Theme } from './types';
import { RouterProvider, useRouter } from './router/RouterContext';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { AudioProvider } from './audio/AudioContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CharacterProfile } from './components/CharacterProfile';
import { DreamWorkflow } from './components/DreamWorkflow';
import { InteractiveProjects } from './components/InteractiveProjects';
import { OriginStory } from './components/OriginStory';
import { ClosingScene } from './components/ClosingScene';
import { EasterEggModal } from './components/EasterEggModal';
import { GlobalScrollTracker } from './components/GlobalScrollTracker';
import { PixelBackground } from './components/PixelBackground';
import { SignIn } from './components/SignIn';
import { StardustCursor } from './components/StardustCursor';
import './App.css';

const AppContent: React.FC = () => {
  const { currentPath, navigate } = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  // Day / Night Theme state with localStorage persistence
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('pip_observatory_theme');
      if (saved === 'midnight' || saved === 'observatory') return saved;
    } catch {
      // Ignored
    }
    return 'observatory';
  });

  const [isEasterEggOpen, setIsEasterEggOpen] = useState<boolean>(false);
  const [isEasterEggFound, setIsEasterEggFound] = useState<boolean>(false);

  // Sync theme with root dataset and storage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('pip_observatory_theme', theme);
    } catch {
      // Ignored
    }
  }, [theme]);

  // Determine if sign-in view should be shown
  // When unauthenticated, all observatory pages are protected and require sign-in
  const isSignInPage = currentPath === '/signin' || !isAuthenticated;

  // Route protection guard: redirect unauthenticated users away from protected routes to /signin
  // Handles direct navigation and browser Back button after logout so protected content is never exposed
  useEffect(() => {
    if (!isLoading && !isAuthenticated && currentPath !== '/signin') {
      navigate('/signin');
    }
  }, [isLoading, isAuthenticated, currentPath, navigate]);

  // Lock scrolling strictly when sign-in view is active, restore on all other pages
  useEffect(() => {
    if (isSignInPage) {
      document.body.classList.add('signin-scroll-lock');
      document.documentElement.classList.add('signin-scroll-lock');
    } else {
      document.body.classList.remove('signin-scroll-lock');
      document.documentElement.classList.remove('signin-scroll-lock');
    }
    return () => {
      document.body.classList.remove('signin-scroll-lock');
      document.documentElement.classList.remove('signin-scroll-lock');
    };
  }, [isSignInPage]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'observatory' ? 'midnight' : 'observatory'));
  };

  const handleOpenEasterEgg = () => {
    setIsEasterEggFound(true);
    setIsEasterEggOpen(true);
  };

  // Route View Resolver (Protected routes require authentication)
  const renderCurrentRoute = () => {
    if (!isAuthenticated || currentPath === '/signin') {
      return <SignIn />;
    }

    switch (currentPath) {
      case '/':
        return (
          <Hero
            theme={theme}
            onOpenEasterEgg={handleOpenEasterEgg}
            isEasterEggFound={isEasterEggFound}
          />
        );
      case '/meet-pip':
        return <CharacterProfile />;
      case '/dream-making':
        return <DreamWorkflow />;
      case '/projects':
        return <InteractiveProjects />;
      case '/origin-story':
        return <OriginStory />;
      case '/goodnight':
        return <ClosingScene theme={theme} />;
      default:
        // Fallback to Home
        return (
          <Hero
            theme={theme}
            onOpenEasterEgg={handleOpenEasterEgg}
            isEasterEggFound={isEasterEggFound}
          />
        );
    }
  };

  if (isLoading) {
    return (
      <div className="starlight-auth-loading">
        <span className="loading-star">★</span>
        <span className="loading-text">Loading Pip’s Portfolio...</span>
      </div>
    );
  }

  return (
    <div className={`app-root theme-${theme} ${isSignInPage ? 'app-signin-layout' : ''}`}>
      {/* Golden Stardust Cursor Trail */}
      <StardustCursor />

      {/* Skip link for keyboard accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Living Pixel Art Layered Environment (rendered on regular pages) */}
      {!isSignInPage && <PixelBackground theme={theme} />}

      {/* Real Site-Wide Document Scroll Progress Tracker (regular scrollable pages only) */}
      {!isSignInPage && <GlobalScrollTracker />}

      {/* Multi-Page Navigation Bar (rendered on regular pages) */}
      {!isSignInPage && (
        <Navbar
          theme={theme}
          onToggleTheme={toggleTheme}
          onSetTheme={(t) => setTheme(t)}
          onOpenEasterEgg={handleOpenEasterEgg}
          isEasterEggFound={isEasterEggFound}
        />
      )}

      {/* Main Page Content Landmark */}
      <main id="main-content" className={`main-content-flow ${isSignInPage ? 'signin-main-flow' : ''}`}>
        {renderCurrentRoute()}
      </main>

      {/* Bedtime Footer on all regular pages including /goodnight */}
      {!isSignInPage && (
        <footer className="compact-site-footer" role="contentinfo">
          <div className="compact-footer-inner">
            <span className="footer-pip-note">★ Pip’s Portfolio • May all your dreams be soft and warm ★</span>
          </div>
        </footer>
      )}

      {/* Secret Star Easter Egg Modal */}
      <EasterEggModal
        isOpen={isEasterEggOpen}
        onClose={() => setIsEasterEggOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <RouterProvider>
      <AuthProvider>
        <AudioProvider>
          <AppContent />
        </AudioProvider>
      </AuthProvider>
    </RouterProvider>
  );
};

export default App;
