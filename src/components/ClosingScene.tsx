import React, { useState, useRef, useEffect } from 'react';
import { Link } from '../router/RouterContext';
import { PageNavigation } from './PageNavigation';
import { GuestbookWall } from './GuestbookWall';
import type { Theme } from '../types';

interface ClosingSceneProps {
  theme?: Theme;
}

export const ClosingScene: React.FC<ClosingSceneProps> = ({ theme }) => {
  // Active theme resolution with DOM attribute fallback
  const currentTheme: Theme =
    theme ||
    (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'midnight'
      ? 'midnight'
      : 'observatory');

  const videoSrc =
    currentTheme === 'midnight'
      ? '/animations/pip-goodnight-dark.mp4'
      : '/animations/pip-goodnight-light.mp4';

  // Thumbnail selection with graceful fallback for Dark Mode
  const [darkThumbError, setDarkThumbError] = useState<boolean>(false);
  const lightThumbnail = '/images/pip_avatar_cloud.png';
  const darkThumbnail = darkThumbError ? lightThumbnail : '/images/pip-goodnight-dark.png';
  const currentThumbnail = currentTheme === 'midnight' ? darkThumbnail : lightThumbnail;

  // Goodnight Video Playback State (Click-to-play, once, hold final sleeping frame)
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasPlayedOnce, setHasPlayedOnce] = useState<boolean>(false);
  const [videoError, setVideoError] = useState<boolean>(false);
  const [prevTheme, setPrevTheme] = useState<Theme>(currentTheme);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Synchronize and reset playback state when theme changes
  if (prevTheme !== currentTheme) {
    setPrevTheme(currentTheme);
    setIsPlaying(false);
    setHasPlayedOnce(false);
    setVideoError(false);
  }

  // Ensure DOM video element properties are synchronized and playback resets on theme change
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.muted = true;
      videoRef.current.currentTime = 0;
      videoRef.current.load();
    }
  }, [currentTheme, videoSrc]);

  // Handle user clicking Pip to start or replay the bedtime animation
  const handlePipClick = () => {
    if (videoError) return;
    if (!videoRef.current) return;

    if (isPlaying) {
      // Prevent rapid repeated clicks from interrupting ongoing playback
      return;
    }

    // Ensure muted is true for frictionless browser playback
    videoRef.current.muted = true;

    // Reset to start if finished or replaying
    if (hasPlayedOnce || videoRef.current.ended) {
      videoRef.current.currentTime = 0;
    }

    const playPromise = videoRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn('Goodnight video playback could not start:', err);
          setIsPlaying(false);
        });
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setHasPlayedOnce(true);
    // Note: With loop=false, HTML5 video naturally holds the final sleeping frame
  };

  // -------------------------------------------------------------
  // Secret Star Easter Egg State
  // -------------------------------------------------------------
  const [isSecretOpen, setIsSecretOpen] = useState<boolean>(false);
  const [isStarSparkling, setIsStarSparkling] = useState<boolean>(false);

  const handleSecretStarClick = () => {
    setIsStarSparkling(true);
    setTimeout(() => {
      setIsStarSparkling(false);
      setIsSecretOpen(true);
    }, 450);
  };

  // -------------------------------------------------------------
  // Bedtime Wish Well State
  // -------------------------------------------------------------
  const [wishesCount, setWishesCount] = useState<number>(7);
  const [justWished, setJustWished] = useState<boolean>(false);
  const [wishConfirmationMsg, setWishConfirmationMsg] = useState<string>('');

  const handleMakeWish = () => {
    setWishesCount((w) => w + 1);
    setJustWished(true);
    setWishConfirmationMsg('✨ Your wish has taken flight on a silver stardust beam toward the constellations!');
    setTimeout(() => {
      setJustWished(false);
      setWishConfirmationMsg('');
    }, 3800);
  };

  return (
    <section id="closing" className="closing-section" aria-label="Closing Bedtime Farewell">
      {/* Bedtime Illustrated Sanctuary */}
      <div className="bedtime-sanctuary-wrap">
        <div className="goodnight-stage-layout">
          <div className="goodnight-stage-main">
            <div className="sanctuary-sky-backdrop">
          {/* Gentle pixel cloud puffs */}
          <div className="cloud-puffs" aria-hidden="true">
            <span className="cloud-puff c-left">☁️</span>
            <span className="cloud-puff c-mid">☁️</span>
            <span className="cloud-puff c-right">☁️</span>
          </div>

          {/* Interactive Sleeping Pip Area with Secret Star Companion */}
          <div className="goodnight-character-zone">
            <div
              className={`sleeping-pip-interactive-stage ${isPlaying ? 'is-animating' : ''} ${
                hasPlayedOnce ? 'has-slept' : ''
              }`}
              onClick={handlePipClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handlePipClick();
                }
              }}
              aria-label={
                hasPlayedOnce
                  ? 'Pip is peacefully sleeping. Click to replay bedtime animation.'
                  : isPlaying
                  ? 'Pip is settling into dreamland...'
                  : 'Click Pip to start bedtime animation'
              }
              title={
                hasPlayedOnce
                  ? 'Pip is sound asleep! Click to replay bedtime animation'
                  : 'Click Pip to watch the Goodnight animation'
              }
            >
              <div className="goodnight-video-wrapper">
                {/* Theme-Adaptive Goodnight Animation Video */}
                {!videoError && (
                  <video
                    ref={videoRef}
                    key={videoSrc}
                    src={videoSrc}
                    poster={currentThumbnail}
                    className="closing-pip-video"
                    loop={false}
                    muted
                    playsInline
                    preload="auto"
                    onEnded={handleVideoEnded}
                    onError={() => setVideoError(true)}
                    aria-label="Pip drifting peacefully into bedtime slumber on a fluffy cloud"
                  />
                )}

                {/* Theme-Adaptive Goodnight Thumbnail (visible before animation playback, or on video error) */}
                {((!isPlaying && !hasPlayedOnce) || videoError) && (
                  <img
                    src={currentThumbnail}
                    alt={
                      currentTheme === 'midnight'
                        ? 'Pip in bedtime nightcap waving goodnight under the midnight sky'
                        : 'Pip sleeping warmly on a cozy cloud'
                    }
                    className={`closing-pip-img closing-pip-thumb ${
                      currentTheme === 'midnight' ? 'thumb-dark' : 'thumb-light'
                    }`}
                    onError={() => {
                      if (currentTheme === 'midnight') {
                        setDarkThumbError(true);
                      }
                    }}
                    width="280"
                    height="300"
                  />
                )}

                {/* Subtle play hint badge when animation is waiting for click */}
                {!isPlaying && !hasPlayedOnce && (
                  <div className="pip-play-hint-badge" aria-hidden="true">
                    <span className="hint-icon">▶</span>
                    <span className="hint-text">Click Pip to Sleep</span>
                  </div>
                )}

                {/* Replay indicator when animation has finished */}
                {hasPlayedOnce && !isPlaying && (
                  <div className="pip-replay-hint-badge" aria-hidden="true">
                    <span className="hint-icon">↺</span>
                    <span className="hint-text">Replay Bedtime</span>
                  </div>
                )}

                {/* Classic pixel drifting Zzz stream */}
                <div className="zzz-stream" aria-hidden="true">
                  <span className="z-char z1">z</span>
                  <span className="z-char z2">Z</span>
                  <span className="z-char z3">z</span>
                </div>
              </div>
            </div>

            {/* Subtle Secret Star Easter Egg Button (3-second periodic glow cycle) */}
            <div className="secret-star-anchor">
              <button
                type="button"
                className={`secret-star-btn ${isStarSparkling ? 'sparkle-burst' : ''}`}
                onClick={handleSecretStarClick}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSecretStarClick();
                  }
                }}
                aria-label="Discover Pip’s secret"
                title="A delicate shimmering star whispers beside Pip..."
              >
                <span className="star-glyph" aria-hidden="true">✦</span>
                <span className="star-orbit-ring" aria-hidden="true"></span>
              </button>

              {isStarSparkling && (
                <div className="star-sparkle-burst-particles" aria-hidden="true">
                  <span className="burst-sparkle s1">✨</span>
                  <span className="burst-sparkle s2">★</span>
                  <span className="burst-sparkle s3">✧</span>
                  <span className="burst-sparkle s4">⋆</span>
                </div>
              )}
            </div>
          </div>

          {/* Secret Star Easter Egg Revealed Modal / Surprise Card */}
          {isSecretOpen && (
            <div
              className="secret-star-modal-backdrop"
              onClick={() => setIsSecretOpen(false)}
              role="dialog"
              aria-modal="true"
              aria-labelledby="secret-dialog-title"
            >
              <div
                className="secret-star-dialog"
                onClick={(e) => e.stopPropagation()}
                role="document"
              >
                <div className="secret-dialog-header">
                  <span className="secret-star-icon" aria-hidden="true">★</span>
                  <span className="secret-dialog-tag">Pip’s Midnight Secret</span>
                  <span className="secret-star-icon" aria-hidden="true">★</span>
                </div>

                <div className="secret-dialog-body">
                  <div className="secret-sparkle-art" aria-hidden="true">
                    <span>✧</span>
                    <span>✨</span>
                    <span>✧</span>
                  </div>
                  <h4 id="secret-dialog-title" className="secret-dialog-heading">
                    A Whispered Bedtime Blessing
                  </h4>
                  <p className="secret-dialog-message">
                    &ldquo;You found Pip’s little secret. May your dreams always find their way home.&rdquo;
                  </p>
                  <p className="secret-dialog-subtext">
                    Tucked away under the starlight quilt of Sector 07 Midnight Nursery.
                  </p>
                </div>

                <div className="secret-dialog-footer">
                  <button
                    type="button"
                    className="btn-primary secret-close-btn"
                    onClick={() => setIsSecretOpen(false)}
                    aria-label="Close Pip’s secret message"
                  >
                    <span>Close Blessing ✕</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="signoff-card">
            <div className="signoff-tag">
              <span className="signoff-star">★</span>
              <span>Nocturnal Shift Concluded</span>
            </div>

            <h3 className="signoff-title">Time to Rest, Little Dreamer</h3>

            <blockquote className="signoff-quote">
              &ldquo;Until tomorrow's twilight, keep your starlight bright.
              Goodnight from Midnight Nursery.&rdquo;
            </blockquote>

            <p className="signoff-author">— Pip, Junior Dream Engineer</p>

            {/* Interactive Bedtime Wish Well with Real Confirmation */}
            <div className="wishing-well-box">
              <button
                type="button"
                className={`btn-primary wish-btn ${justWished ? 'wished-active' : ''}`}
                onClick={handleMakeWish}
                aria-label="Release a bedtime wish into the starry sky"
              >
                <span>{justWished ? '✨ Wish Released!' : '✨ Send a Bedtime Wish to the Stars'}</span>
              </button>

              {wishConfirmationMsg && (
                <div className="wish-live-alert" role="status" aria-live="polite">
                  <span>{wishConfirmationMsg}</span>
                </div>
              )}

              <div className="wishes-counter-text">
                <span className="counter-star">★</span>
                <span>{wishesCount} sweet wishes currently floating toward the Milky Way tonight</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Starlight Guestbook Wall (Right-side column on desktop, responsive stack on mobile) */}
      <div className="goodnight-stage-sidebar">
        <GuestbookWall />
      </div>
    </div>

        {/* Five-Page Observatory Navigation Section */}
        <PageNavigation />

        {/* Multi-Page Observatory Navigation Links */}
        <div className="closing-navigation-row">
          <span className="nav-row-title">Observatory Map:</span>
          <ul className="footer-links-list">
            <li>
              <Link to="/" className="footer-link-btn">
                Observatory Entrance
              </Link>
            </li>
            <li>
              <Link to="/meet-pip" className="footer-link-btn">
                Pip's Dossier
              </Link>
            </li>
            <li>
              <Link to="/dream-making" className="footer-link-btn">
                Dream Pipeline
              </Link>
            </li>
            <li>
              <Link to="/projects" className="footer-link-btn">
                Engineering Projects
              </Link>
            </li>
            <li>
              <Link to="/origin-story" className="footer-link-btn">
                Origin Chronicle
              </Link>
            </li>
            <li>
              <Link to="/goodnight" className="footer-link-btn">
                Bedtime Farewell
              </Link>
            </li>
          </ul>
        </div>

        {/* Accessibility & Credits Section Note */}
        <div className="footer-colophon">
          <p className="colophon-text">
            <strong>Pip’s Portfolio</strong> — Handcrafted with love, Web Audio chimes, and retro pixel-storybook detail.
          </p>
          <div className="palette-preview-dots" aria-label="Official color palette swatches">
            <span className="swatch cream" title="Warm Cream (#fff8f1)"></span>
            <span className="swatch berry" title="Rich Berry (#a34063)"></span>
            <span className="swatch cocoa" title="Cocoa (#5c4033)"></span>
            <span className="swatch navy" title="Midnight Navy (#171a35)"></span>
            <span className="swatch amber" title="Starlight Amber (#f6c76b)"></span>
            <span className="swatch rose" title="Soft Rose (#f4cbd7)"></span>
          </div>
          <p className="copyright-line">
            Midnight Nursery Department of Nocturnal Comfort • May all your dreams be soft and warm.
          </p>
        </div>
      </div>
    </section>
  );
};
