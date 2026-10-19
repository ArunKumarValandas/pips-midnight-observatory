import React, { useState, useEffect } from 'react';
import { useRouter } from '../router/RouterContext';

export const GlobalScrollTracker: React.FC = () => {
  const { currentPath } = useRouter();
  const [scrollPercentage, setScrollPercentage] = useState<number>(0);

  useEffect(() => {
    let ticking = false;

    const calculateScroll = () => {
      const doc = document.documentElement;
      const body = document.body;
      const scrollTop = window.scrollY || doc.scrollTop || body.scrollTop || 0;
      const scrollHeight = Math.max(doc.scrollHeight, body.scrollHeight);
      const clientHeight = doc.clientHeight || window.innerHeight;
      const totalScrollable = scrollHeight - clientHeight;

      if (totalScrollable <= 0) {
        setScrollPercentage(0);
      } else {
        const pct = Math.min(100, Math.max(0, (scrollTop / totalScrollable) * 100));
        setScrollPercentage(Math.round(pct));
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(calculateScroll);
        ticking = true;
      }
    };

    // Calculate immediately on mount and on route change
    calculateScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', calculateScroll);

    // Give DOM a tick to layout on route transitions
    const routeTimer = setTimeout(calculateScroll, 120);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', calculateScroll);
      clearTimeout(routeTimer);
    };
  }, [currentPath]);

  return (
    <div
      className="global-scroll-tracker"
      role="progressbar"
      aria-label="Document scroll progress"
      aria-valuenow={scrollPercentage}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="tracker-bar-track">
        <div
          className="tracker-bar-fill"
          style={{ width: `${scrollPercentage}%` }}
        >
          <span className="tracker-lead-star" aria-hidden="true">★</span>
        </div>
      </div>
      <div className="tracker-hud-pill">
        <span className="hud-star-icon" aria-hidden="true">✦</span>
        <span className="hud-metric-label">NAV:</span>
        <span className="hud-metric-value">{scrollPercentage}%</span>
      </div>
    </div>
  );
};
