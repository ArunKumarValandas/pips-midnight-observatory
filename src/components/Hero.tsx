import React, { useState, useRef, useEffect } from 'react';
import { STABLE_STARS } from '../constants';
import { Link } from '../router/RouterContext';
import { PageNavigation } from './PageNavigation';
import type { Theme } from '../types';

interface HeroProps {
  theme?: Theme;
  onOpenEasterEgg: () => void;
  isEasterEggFound: boolean;
}

export const Hero: React.FC<HeroProps> = ({ theme, onOpenEasterEgg, isEasterEggFound }) => {
  // Theme-aware video asset selection
  const currentTheme: Theme =
    theme ||
    (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'midnight'
      ? 'midnight'
      : 'observatory');

  const videoSrc =
    currentTheme === 'midnight'
      ? '/animations/pip-observatory-dark.mp4'
      : '/animations/pip-observatory-light.mp4';

  const [videoError, setVideoError] = useState<boolean>(false);
  const [prevVideoSrc, setPrevVideoSrc] = useState<string>(videoSrc);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Adjust state during render when videoSrc changes
  if (prevVideoSrc !== videoSrc) {
    setPrevVideoSrc(videoSrc);
    setVideoError(false);
  }

  // Sync and auto-play video smoothly upon theme change or initial mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback: muted video is permitted in all standard browsers
      });
    }
  }, [videoSrc]);

  return (
    <section id="hero" className="hero-section" aria-label="Welcome to Pip’s Portfolio">
      {/* Layered Observatory Sky Background */}
      <div className="observatory-sky" aria-hidden="false">
        {/* Stable Stars (Deterministic, never jump on re-renders) */}
        <div className="stable-star-field" aria-hidden="true">
          {STABLE_STARS.map((star) => (
            <div
              key={star.id}
              className="pixel-star"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size * 2}px`,
                height: `${star.size * 2}px`,
                opacity: star.opacity,
                animationDelay: `${star.delay}s`,
                animationDuration: `${star.duration}s`
              }}
            />
          ))}
        </div>

        {/* Observatory Dome Silhouette Architecture */}
        <div className="observatory-dome-arch" aria-hidden="true">
          <svg
            className="dome-svg"
            viewBox="0 0 1200 400"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,400 Q600,60 1200,400"
              stroke="var(--starlight-amber)"
              strokeWidth="2"
              strokeDasharray="6 6"
              opacity="0.35"
            />
            <path
              d="M100,400 Q600,120 1100,400"
              stroke="var(--rich-berry)"
              strokeWidth="1.5"
              opacity="0.25"
            />
            <line x1="200" y1="180" x2="340" y2="120" stroke="var(--starlight-amber)" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
            <line x1="340" y1="120" x2="420" y2="170" stroke="var(--starlight-amber)" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
            <line x1="780" y1="150" x2="890" y2="100" stroke="var(--starlight-amber)" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
            <line x1="890" y1="100" x2="1020" y2="140" stroke="var(--starlight-amber)" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
          </svg>
        </div>

        {/* Hidden Easter Egg Star: tucked in the starry celestial observatory arch */}
        <button
          type="button"
          className={`easter-egg-star-btn ${isEasterEggFound ? 'egg-revealed' : ''}`}
          onClick={onOpenEasterEgg}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onOpenEasterEgg();
            }
          }}
          aria-label="A peculiarly shimmering pixel star with gentle golden pulse"
          title="Inspect the peculiar shimmering star..."
        >
          <span className="easter-egg-glyph" aria-hidden="true">✦</span>
          <span className="sr-only">Secret Observatory Star Easter Egg</span>
        </button>
      </div>

      {/* Hero Content Container */}
      <div className="hero-content-wrapper">
        <div className="hero-grid">
          {/* Left Column: Pip's Identity & Introduction */}
          <div className="hero-text-card">
            <div className="storybook-tag-pill">
              <span className="pixel-icon">☾</span>
              <span>Midnight Nursery — Sector 07</span>
            </div>

            <h1 className="hero-title">
              Pip's Midnight <span className="highlight-text">Observatory</span>
            </h1>

            <p className="hero-tagline">
              &ldquo;Every little dream begins with a tiny star.&rdquo;
            </p>

            <div className="hero-character-intro">
              <div className="character-badge-inline">
                <span className="badge-bullet">★</span>
                <span className="badge-text">
                  <strong>Pip, the Skull Baby</strong> — Junior Dream Engineer
                </span>
              </div>
              <p className="hero-description">
                Perched high above the world in a brass-and-cloud attic, Pip harvests wandering
                starlight, spins cozy lullabies, and charts safe delivery flight paths so every
                sleepy dreamer rests soundly until dawn.
              </p>
            </div>

            {/* Two Primary Action Route Buttons */}
            <div className="hero-cta-group">
              <Link to="/projects" className="btn-primary cta-btn">
                <span className="btn-icon">🔭</span>
                <span>Explore the Observatory</span>
              </Link>

              <Link to="/origin-story" className="btn-secondary cta-btn">
                <span className="btn-icon">📖</span>
                <span>Discover Pip's Story</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Animated Pip Video Stage with Seamless Background Matching */}
          <div className="hero-visual-card">
            <div className="pip-hero-stage">
              {/* Theme-adaptive Video Animation or Fallback Static Artwork */}
              <div className="pip-video-container">
                {!videoError ? (
                  <video
                    ref={videoRef}
                    key={videoSrc}
                    src={videoSrc}
                    className="pip-hero-video"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    onError={() => setVideoError(true)}
                    aria-label="Pip floating peacefully on a cloud, watching over the starry night sky"
                  />
                ) : (
                  <img
                    src="/images/pip_avatar_cloud.png"
                    alt="Pip the skull baby, wearing a sleeping cap and pastel heart onesie, gently waving from a fluffy cloud"
                    className="pip-hero-img"
                    loading="eager"
                    width="420"
                    height="480"
                  />
                )}
              </div>

              {/* Floating Status Chip */}
              <div className="pip-status-chip" role="status" aria-live="polite">
                <span className="chip-pulsar" aria-hidden="true"></span>
                <span>On Duty: Crafting Sweet Bedtime Dreams</span>
              </div>
            </div>
          </div>
        </div>

        {/* Observatory Wings Gateway Grid (Links to all 5 other sections) */}
        <div className="observatory-wings-portal">
          <div className="portal-header">
            <span className="pixel-icon">✦</span>
            <span className="portal-title">Observatory Navigation Chambers</span>
          </div>

          <div className="portal-cards-grid">
            <Link to="/meet-pip" className="portal-card">
              <span className="portal-icon">📜</span>
              <div className="portal-text">
                <strong>Pip's Dossier</strong>
                <p>Bio, habits, dream tools & spoken voice</p>
              </div>
              <span className="portal-arrow">→</span>
            </Link>

            <Link to="/dream-making" className="portal-card">
              <span className="portal-icon">⚙️</span>
              <div className="portal-text">
                <strong>Dream Making</strong>
                <p>3-stage sleepcraft pipeline</p>
              </div>
              <span className="portal-arrow">→</span>
            </Link>

            <Link to="/projects" className="portal-card">
              <span className="portal-icon">🎶</span>
              <div className="portal-text">
                <strong>Active Projects</strong>
                <p>Lullaby Lab chimes, lantern & routes</p>
              </div>
              <span className="portal-arrow">→</span>
            </Link>

            <Link to="/origin-story" className="portal-card">
              <span className="portal-icon">⭐</span>
              <div className="portal-text">
                <strong>Origin Chronicle</strong>
                <p>3-chapter journey & the First Star</p>
              </div>
              <span className="portal-arrow">→</span>
            </Link>

            <Link to="/goodnight" className="portal-card">
              <span className="portal-icon">🌙</span>
              <div className="portal-text">
                <strong>Bedtime Farewell</strong>
                <p>Pip's sign-off & wishing well</p>
              </div>
              <span className="portal-arrow">→</span>
            </Link>
          </div>
        </div>

        {/* Five-Page Observatory Navigation Section: foreground placement */}
        <PageNavigation />
      </div>
    </section>
  );
};
