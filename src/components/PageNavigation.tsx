import React from 'react';
import { Link, useRouter } from '../router/RouterContext';
import { useAudio } from '../audio/AudioContext';

interface PageRouteInfo {
  path: string;
  label: string;
  title: string;
}

const MAIN_PAGES_SEQUENCE: PageRouteInfo[] = [
  { path: '/', label: 'Observatory', title: 'Observatory Entrance' },
  { path: '/meet-pip', label: 'Meet Pip', title: 'Pip’s Dossier' },
  { path: '/dream-making', label: 'Dream Making', title: 'Dream-Making Pipeline' },
  { path: '/projects', label: 'Projects', title: 'Active Engineering Projects' },
  { path: '/origin-story', label: 'Origin Story', title: 'The Starlight Chronicle' },
  { path: '/goodnight', label: 'Goodnight', title: 'Bedtime Sanctuary' }
];

export const PageNavigation: React.FC = () => {
  const { currentPath } = useRouter();
  const { playBabyGiggle } = useAudio();

  const currentIndex = MAIN_PAGES_SEQUENCE.findIndex((p) => p.path === currentPath);
  const activeIndex = currentIndex !== -1 ? currentIndex : 0;

  const prevPage = activeIndex > 0 ? MAIN_PAGES_SEQUENCE[activeIndex - 1] : null;
  const nextPage = activeIndex < MAIN_PAGES_SEQUENCE.length - 1 ? MAIN_PAGES_SEQUENCE[activeIndex + 1] : null;

  const handleNavClick = () => {
    playBabyGiggle();
  };

  return (
    <nav className="site-page-navigation" aria-label="Observatory page navigation">
      <div className="page-nav-container">
        {/* Previous Page Button */}
        {prevPage ? (
          <Link
            to={prevPage.path}
            className="page-nav-btn prev-page-btn"
            onClick={handleNavClick}
            aria-label={`Go to previous page: ${prevPage.label}`}
          >
            <span className="page-nav-arrow" aria-hidden="true">←</span>
            <span className="page-nav-label">Previous Page</span>
            <span className="page-nav-subtext">({prevPage.label})</span>
          </Link>
        ) : (
          <button
            type="button"
            className="page-nav-btn prev-page-btn is-disabled"
            disabled
            aria-disabled="true"
            aria-label="Previous page unavailable (first page)"
          >
            <span className="page-nav-arrow" aria-hidden="true">←</span>
            <span className="page-nav-label">Previous Page</span>
          </button>
        )}

        {/* Step indicator */}
        <div className="page-nav-indicator" aria-hidden="true">
          <span className="nav-star-dot">★</span>
          <span className="nav-step-count">
            {MAIN_PAGES_SEQUENCE[activeIndex]?.label || 'Observatory'}
          </span>
          <span className="nav-star-dot">★</span>
        </div>

        {/* Next Page Button */}
        {nextPage ? (
          <Link
            to={nextPage.path}
            className="page-nav-btn next-page-btn"
            onClick={handleNavClick}
            aria-label={`Go to next page: ${nextPage.label}`}
          >
            <span className="page-nav-label">Next Page</span>
            <span className="page-nav-subtext">({nextPage.label})</span>
            <span className="page-nav-arrow" aria-hidden="true">→</span>
          </Link>
        ) : (
          <button
            type="button"
            className="page-nav-btn next-page-btn is-disabled"
            disabled
            aria-disabled="true"
            aria-label="Next page unavailable (last page)"
          >
            <span className="page-nav-label">Next Page</span>
            <span className="page-nav-arrow" aria-hidden="true">→</span>
          </button>
        )}
      </div>
    </nav>
  );
};
