import React, { useState } from 'react';
import type { Theme } from '../types';
import { Link, useRouter } from '../router/RouterContext';
import { useAuth } from '../auth/AuthContext';
import { useAudio } from '../audio/AudioContext';

interface NavbarProps {
  theme: Theme;
  onToggleTheme: () => void;
  onSetTheme?: (theme: Theme) => void;
  onOpenEasterEgg: () => void;
  isEasterEggFound: boolean;
}

const NAV_ROUTES = [
  { path: '/', label: 'Observatory' },
  { path: '/meet-pip', label: 'Meet Pip' },
  { path: '/dream-making', label: 'Dream Making' },
  { path: '/projects', label: 'Projects' },
  { path: '/origin-story', label: 'Origin Story' },
  { path: '/goodnight', label: 'Goodnight' }
];

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onToggleTheme,
  onSetTheme
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentPath, navigate } = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { isAmbientPlaying, toggleAmbientMusic, playBabyGiggle } = useAudio();

  const handleNavClick = () => {
    setMobileMenuOpen(false);
    playBabyGiggle();
  };

  const handleLogout = () => {
    setMobileMenuOpen(false);
    playBabyGiggle();
    logout();
    navigate('/signin');
  };

  const handleSetTheme = (newTheme: Theme) => {
    playBabyGiggle();
    if (onSetTheme) {
      onSetTheme(newTheme);
    } else if (theme !== newTheme) {
      onToggleTheme();
    }
  };

  return (
    <header className="site-header" role="banner">
      <div className="nav-container">
        {/* Brand: Display-only, non-interactive purely decorative text */}
        <div
          className="brand-logo brand-display-only"
          aria-label="Pip’s Portfolio — Sector 07 Midnight Nursery"
          role="img"
        >
          <span className="brand-star" aria-hidden="true">★</span>
          <div className="brand-text-block">
            <span className="brand-title">Pip’s Portfolio</span>
            <span className="brand-badge">Sector 07 • Midnight Nursery</span>
          </div>
        </div>

        {/* Header Controls: Persistent Ambient Music & Mobile Menu Toggle */}
        <div className="nav-header-controls">
          {/* Ambient Music Control: Symbol-Only 🎵 */}
          <button
            type="button"
            className={`nav-music-btn ${isAmbientPlaying ? 'music-playing' : ''}`}
            onClick={toggleAmbientMusic}
            aria-label={isAmbientPlaying ? 'Pause ambient music' : 'Resume ambient music'}
            title={isAmbientPlaying ? 'Pause ambient music' : 'Resume ambient music'}
          >
            <span className="nav-music-icon" aria-hidden="true">
              🎵
            </span>
          </button>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>

        {/* Navigation links & controls */}
        <nav
          className={`site-nav ${mobileMenuOpen ? 'nav-open' : ''}`}
          role="navigation"
          aria-label="Main observatory navigation"
        >
          <ul className="nav-list">
            {NAV_ROUTES.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`nav-link-btn ${isActive ? 'nav-item-active' : ''}`}
                    onClick={handleNavClick}
                  >
                    <span className="nav-label-txt">{item.label}</span>
                    {isActive && <span className="nav-active-pip" aria-hidden="true">◀</span>}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="nav-actions">
            {/* Authenticated User Status Badge OR Sign In Pill */}
            {isAuthenticated && user ? (
              <div className="nav-user-badge">
                <span className="nav-user-icon" aria-hidden="true">👤</span>
                <span className="nav-user-name" title={`Signed in as ${user.name}`}>
                  {user.name}
                </span>
              </div>
            ) : (
              <Link
                to="/signin"
                className={`nav-signin-pill ${currentPath === '/signin' ? 'nav-item-active' : ''}`}
                onClick={handleNavClick}
                aria-label="Go to Sign In page"
              >
                <span>🔑 Sign In</span>
              </Link>
            )}

            {/* Day / Night Theme Selection: Symbol-Only (☀ Light / ☾ Dark) */}
            <div className="theme-toggle-group" role="group" aria-label="Theme selection">
              <button
                type="button"
                className={`theme-symbol-btn ${theme === 'observatory' ? 'theme-active' : ''}`}
                onClick={() => handleSetTheme('observatory')}
                aria-pressed={theme === 'observatory'}
                aria-label="Observatory Mode (Light theme)"
                title="Observatory Mode (Light)"
              >
                <span className="theme-symbol" aria-hidden="true">☀</span>
              </button>
              <button
                type="button"
                className={`theme-symbol-btn ${theme === 'midnight' ? 'theme-active' : ''}`}
                onClick={() => handleSetTheme('midnight')}
                aria-pressed={theme === 'midnight'}
                aria-label="Midnight Mode (Dark theme)"
                title="Midnight Mode (Dark)"
              >
                <span className="theme-symbol" aria-hidden="true">☾</span>
              </button>
            </div>

            {/* Logout Button: Absolute Rightmost Position, After Theme Control */}
            {isAuthenticated && user && (
              <button
                type="button"
                className="nav-logout-btn"
                onClick={handleLogout}
                aria-label={`Log out of ${user.name}`}
                title="Sign out of your starry session"
              >
                <span className="logout-icon" aria-hidden="true">🚪</span>
                <span className="logout-text">Log Out</span>
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};
