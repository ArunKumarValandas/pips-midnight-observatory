import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PageNavigation } from './PageNavigation';

interface StorySpread {
  id: number;
  title: string;
  leftPageNumber: number;
  rightPageNumber: number;
  leftPage: {
    paragraphs: string[];
  };
  rightPage: {
    paragraphs: string[];
  };
}

const STORY_SPREADS: StorySpread[] = [
  {
    id: 1,
    title: 'A Tiny Light in the Dark ✨',
    leftPageNumber: 1,
    rightPageNumber: 2,
    leftPage: {
      paragraphs: [
        'Long ago, above the sleepy world, there was a little observatory hidden among the clouds. One quiet night, a tiny golden light appeared beneath the stars.',
        'Inside its gentle glow was a little dreamer wearing a starry nightcap and a pink bow.'
      ]
    },
    rightPage: {
      paragraphs: [
        'The little one was named Pip. With bright, glowing eyes and a curious smile, Pip looked up at the endless sky and wondered how to make the world a little kinder, warmer, and less lonely.',
        "And so, beneath the moonlit sky, Pip's extraordinary journey began. 🌙"
      ]
    }
  },
  {
    id: 2,
    title: 'The Keeper of Little Dreams 🌙',
    leftPageNumber: 3,
    rightPageNumber: 4,
    leftPage: {
      paragraphs: [
        'Every night, Pip began collecting wandering starlight, making gentle lullabies, and charting quiet routes through the sky so dreams could find their way home.',
        'Pip discovered that even the smallest light could comfort someone in the dark.'
      ]
    },
    rightPage: {
      paragraphs: [
        'Beneath the moon and the watchful stars, Pip became a tiny guardian of bedtime dreams.',
        'From that night onward, every twinkle carried a promise: no dreamer would ever have to feel alone beneath the endless sky. ⭐'
      ]
    }
  }
];

export const OriginStory: React.FC = () => {
  // Current active spread index (0: Spread 1, 1: Spread 2)
  const [currentSpreadIndex, setCurrentSpreadIndex] = useState<number>(0);

  // Transition & flipping animation states
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev' | null>(null);
  const [incomingSpreadIndex, setIncomingSpreadIndex] = useState<number>(0);

  // Sound effect ref for realistic page-flip audio
  const pageFlipAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize page-flip sound effect
  useEffect(() => {
    const audio = new Audio('/audio/page-flip.mp3');
    audio.preload = 'auto';
    audio.volume = 0.55;
    pageFlipAudioRef.current = audio;

    return () => {
      if (pageFlipAudioRef.current) {
        pageFlipAudioRef.current.pause();
        pageFlipAudioRef.current = null;
      }
    };
  }, []);

  // Safe playback helper that prevents overlapping sounds and handles browser autoplay limits
  const playPageFlipSound = useCallback(() => {
    const audio = pageFlipAudioRef.current;
    if (!audio) return;
    try {
      audio.currentTime = 0;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          // Playback blocked or silently deferred by browser policy
          console.warn('Page-flip sound playback notice:', err);
        });
      }
    } catch {
      // Gracefully continue without throwing
    }
  }, []);

  // Handle turning to Next Spread or Previous Spread
  const handleTurnSpread = useCallback(
    (direction: 'next' | 'prev') => {
      // Prevent rapid repeated clicks while flipping is in progress
      if (isFlipping) return;

      if (direction === 'next') {
        if (currentSpreadIndex >= STORY_SPREADS.length - 1) return;
        const nextIdx = currentSpreadIndex + 1;
        setIncomingSpreadIndex(nextIdx);
        setFlipDirection('next');
        setIsFlipping(true);
        playPageFlipSound();

        window.setTimeout(() => {
          setCurrentSpreadIndex(nextIdx);
          setIsFlipping(false);
          setFlipDirection(null);
        }, 520);
      } else {
        if (currentSpreadIndex <= 0) return;
        const prevIdx = currentSpreadIndex - 1;
        setIncomingSpreadIndex(prevIdx);
        setFlipDirection('prev');
        setIsFlipping(true);
        playPageFlipSound();

        window.setTimeout(() => {
          setCurrentSpreadIndex(prevIdx);
          setIsFlipping(false);
          setFlipDirection(null);
        }, 520);
      }
    },
    [currentSpreadIndex, isFlipping, playPageFlipSound]
  );

  // Keyboard navigation support for storybook (Arrow keys and PageUp/PageDown)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        if (currentSpreadIndex < STORY_SPREADS.length - 1 && !isFlipping) {
          handleTurnSpread('next');
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (currentSpreadIndex > 0 && !isFlipping) {
          handleTurnSpread('prev');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSpreadIndex, isFlipping, handleTurnSpread]);

  const activeSpread = STORY_SPREADS[currentSpreadIndex];
  const incomingSpread = STORY_SPREADS[incomingSpreadIndex];
  const isFirstSpread = currentSpreadIndex === 0;
  const isLastSpread = currentSpreadIndex === STORY_SPREADS.length - 1;

  return (
    <section id="story" className="origin-story-section" aria-label="Pip's Origin Storybook">
      {/* Page Header */}
      <div className="section-header-block storybook-header-block">
        <div className="section-eyebrow">
          <span className="pixel-icon">📖</span>
          <span>The Starlight Chronicle</span>
        </div>
        <h2 className="section-title">Pip's Origin Story</h2>
        <p className="section-subtitle">
          An interactive pixel-art storybook chronicling how a gentle little dreamer became Midnight Observatory's keeper of stars.
        </p>
      </div>

      {/* Storybook Stage & Controls Container */}
      <div className="storybook-interactive-container">
        {/* Storybook Top Controls Bar */}
        <div className="storybook-controls-bar" aria-label="Storybook page controls">
          <button
            type="button"
            className={`storybook-nav-btn prev-spread-btn ${isFirstSpread ? 'is-disabled' : ''}`}
            onClick={() => handleTurnSpread('prev')}
            disabled={isFirstSpread || isFlipping}
            aria-disabled={isFirstSpread || isFlipping}
            aria-label="Previous Page (Turn to Spread 1)"
          >
            <span className="storybook-nav-arrow" aria-hidden="true">←</span>
            <span className="storybook-nav-text">Previous Page</span>
          </button>

          <div className="storybook-spread-pill" aria-live="polite" aria-atomic="true">
            <span className="pill-star-glyph" aria-hidden="true">★</span>
            <span className="pill-spread-text">
              Spread {currentSpreadIndex + 1} of {STORY_SPREADS.length}
            </span>
            <span className="pill-spread-separator">•</span>
            <span className="pill-chapter-title">{activeSpread.title}</span>
            <span className="pill-star-glyph" aria-hidden="true">★</span>
          </div>

          <button
            type="button"
            className={`storybook-nav-btn next-spread-btn ${isLastSpread ? 'is-disabled' : ''}`}
            onClick={() => handleTurnSpread('next')}
            disabled={isLastSpread || isFlipping}
            aria-disabled={isLastSpread || isFlipping}
            aria-label="Next Page (Turn to Spread 2)"
          >
            <span className="storybook-nav-text">Next Page</span>
            <span className="storybook-nav-arrow" aria-hidden="true">→</span>
          </button>
        </div>

        {/* ===================================================================
            DESKTOP / TABLET TWO-PAGE OPEN BOOK STAGE
            =================================================================== */}
        <div
          className={`storybook-stage ${isFlipping ? 'stage-flipping' : ''} ${flipDirection ? `flip-${flipDirection}` : ''}`}
          role="region"
          aria-label={`Interactive Storybook: ${activeSpread.title}`}
        >
          {/* Pixel-art open book background image */}
          <div className="storybook-stage-aspect">
            <img
              src="/images/origin-story-book.png"
              alt="Open pixel-art storybook with parchment pages"
              className="storybook-bg-img"
              draggable={false}
            />

            {/* Overlaid HTML Text Layer: Left Page */}
            <div className={`parchment-overlay parchment-overlay-left ${isFlipping ? 'parchment-transitioning' : ''}`}>
              <div className="parchment-page-card">
                <header className="parchment-page-header">
                  <span className="parchment-page-number">Page {activeSpread.leftPageNumber}</span>
                  <h3 className="parchment-chapter-heading">{activeSpread.title}</h3>
                  <div className="parchment-rule-ornament" aria-hidden="true">
                    <span>✦ ─── ✧ ─── ✦</span>
                  </div>
                </header>

                <div className="parchment-paragraphs">
                  {activeSpread.leftPage.paragraphs.map((para, idx) => (
                    <p key={idx} className={`parchment-body-text ${idx === 0 ? 'lead-para' : ''}`}>
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Overlaid HTML Text Layer: Right Page */}
            <div className={`parchment-overlay parchment-overlay-right ${isFlipping ? 'parchment-transitioning' : ''}`}>
              <div className="parchment-page-card">
                <header className="parchment-page-header right-page-header">
                  <span className="parchment-page-number">Page {activeSpread.rightPageNumber}</span>
                  <span className="parchment-starlight-tag">Midnight Starlight</span>
                  <div className="parchment-rule-ornament" aria-hidden="true">
                    <span>✦ ─── ✧ ─── ✦</span>
                  </div>
                </header>

                <div className="parchment-paragraphs">
                  {activeSpread.rightPage.paragraphs.map((para, idx) => (
                    <p key={idx} className={`parchment-body-text ${idx === 1 ? 'concluding-para' : ''}`}>
                      {para}
                    </p>
                  ))}
                </div>

                <footer className="parchment-page-footer" aria-hidden="true">
                  <span className="parchment-seal-symbol">★ ✧ ★</span>
                </footer>
              </div>
            </div>

            {/* 3D Realistic Page-Turn Flap Overlay */}
            {isFlipping && flipDirection === 'next' && (
              <div className="turning-page-flap flap-forward" aria-hidden="true">
                <div className="flap-face flap-face-front">
                  <div className="flap-content-ghost">
                    <span className="flap-page-num">Page {activeSpread.rightPageNumber}</span>
                    <p className="flap-ghost-text">{activeSpread.rightPage.paragraphs[0]}</p>
                  </div>
                </div>
                <div className="flap-face flap-face-back">
                  <div className="flap-content-ghost">
                    <span className="flap-page-num">Page {incomingSpread.leftPageNumber}</span>
                    <p className="flap-ghost-text">{incomingSpread.leftPage.paragraphs[0]}</p>
                  </div>
                </div>
              </div>
            )}

            {isFlipping && flipDirection === 'prev' && (
              <div className="turning-page-flap flap-backward" aria-hidden="true">
                <div className="flap-face flap-face-front">
                  <div className="flap-content-ghost">
                    <span className="flap-page-num">Page {activeSpread.leftPageNumber}</span>
                    <p className="flap-ghost-text">{activeSpread.leftPage.paragraphs[0]}</p>
                  </div>
                </div>
                <div className="flap-face flap-face-back">
                  <div className="flap-content-ghost">
                    <span className="flap-page-num">Page {incomingSpread.rightPageNumber}</span>
                    <p className="flap-ghost-text">{incomingSpread.rightPage.paragraphs[0]}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ===================================================================
            MOBILE INTENTIONAL STORYBOOK FOLIO LAYOUT (< 680px)
            Preserves the storybook aesthetic with large, comfortable typography
            =================================================================== */}
        <div
          className={`storybook-mobile-folio ${isFlipping ? 'mobile-flipping' : ''}`}
          role="region"
          aria-label={`Mobile Storybook: ${activeSpread.title}`}
        >
          {/* Decorative Book Tabs Top Edge */}
          <div className="mobile-book-tabs-row" aria-hidden="true">
            <span className="mobile-tab-pill tab-wood">📖</span>
            <span className="mobile-tab-pill tab-red"></span>
            <span className="mobile-tab-pill tab-blue"></span>
            <span className="mobile-tab-pill tab-green"></span>
            <span className="mobile-tab-pill tab-purple"></span>
          </div>

          <div className="mobile-parchment-card">
            {/* Storybook Heading */}
            <div className="mobile-chapter-header">
              <span className="mobile-spread-badge">Spread {currentSpreadIndex + 1} of {STORY_SPREADS.length}</span>
              <h3 className="mobile-chapter-title">{activeSpread.title}</h3>
              <div className="mobile-rule-ornament" aria-hidden="true">
                <span>✦ ─── ✧ ─── ✦</span>
              </div>
            </div>

            {/* Left Page Segment */}
            <div className="mobile-page-segment segment-left">
              <div className="mobile-segment-label">
                <span className="segment-dot">★</span>
                <span>Page {activeSpread.leftPageNumber}</span>
              </div>
              {activeSpread.leftPage.paragraphs.map((p, i) => (
                <p key={i} className="mobile-narrative-text">
                  {p}
                </p>
              ))}
            </div>

            {/* In-Between Page Divider */}
            <div className="mobile-spine-divider" aria-hidden="true">
              <div className="mobile-divider-line"></div>
              <span className="mobile-divider-star">✦</span>
              <div className="mobile-divider-line"></div>
            </div>

            {/* Right Page Segment */}
            <div className="mobile-page-segment segment-right">
              <div className="mobile-segment-label">
                <span className="segment-dot">★</span>
                <span>Page {activeSpread.rightPageNumber}</span>
              </div>
              {activeSpread.rightPage.paragraphs.map((p, i) => (
                <p key={i} className="mobile-narrative-text">
                  {p}
                </p>
              ))}
            </div>

            {/* Bedtime Seal */}
            <div className="mobile-footer-seal" aria-hidden="true">
              <span className="mobile-seal-ribbon">🎗️</span>
              <span className="mobile-seal-text">Pip’s Midnight Chronicle</span>
            </div>
          </div>
        </div>

        {/* Keyboard accessibility hint */}
        <div className="storybook-keyboard-hint">
          <span>Tip: Use left (←) and right (→) arrow keys to turn storybook pages</span>
        </div>
      </div>

      {/* Website-Wide Five-Page Observatory Navigation */}
      <PageNavigation />
    </section>
  );
};
