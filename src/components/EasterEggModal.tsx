import React, { useEffect, useRef } from 'react';

interface EasterEggModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EasterEggModal: React.FC<EasterEggModalProps> = ({ isOpen, onClose }) => {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus close button when modal opens for accessibility
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="presentation"
      aria-hidden={!isOpen}
    >
      <div
        className="easter-egg-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="easter-egg-title"
        onClick={(e) => e.stopPropagation()} // Prevent accidental closing when clicking dialog body
      >
        {/* Animated Constellation Header */}
        <div className="modal-constellation-hero">
          <svg viewBox="0 0 300 120" className="constellation-heart-svg" aria-hidden="true">
            {/* Sparkling Constellation path tracing a star/heart */}
            <path
              d="M150,90 Q90,30 110,15 Q135,10 150,40 Q165,10 190,15 Q210,30 150,90 Z"
              fill="none"
              stroke="var(--starlight-amber)"
              strokeWidth="2.5"
              strokeDasharray="4 4"
              className="heart-trace-path"
            />
            {/* Constellation nodes */}
            <circle cx="150" cy="90" r="4" fill="var(--soft-rose)" />
            <circle cx="110" cy="15" r="4" fill="var(--starlight-amber)" />
            <circle cx="150" cy="40" r="3.5" fill="#fff" />
            <circle cx="190" cy="15" r="4" fill="var(--starlight-amber)" />
            <circle cx="95" cy="50" r="3" fill="var(--starlight-amber)" />
            <circle cx="205" cy="50" r="3" fill="var(--starlight-amber)" />

            {/* Floating sparkle symbols */}
            <text x="70" y="30" fill="var(--soft-rose)" fontSize="14" className="modal-sparkle m1">✨</text>
            <text x="220" y="30" fill="var(--starlight-amber)" fontSize="14" className="modal-sparkle m2">★</text>
            <text x="145" y="115" fill="var(--starlight-amber)" fontSize="12" className="modal-sparkle m3">✧</text>
          </svg>
        </div>

        <div className="modal-body">
          <div className="secret-tag-pill">
            <span className="secret-icon">★</span>
            <span>You Discovered Pip's Secret Star!</span>
          </div>

          <h3 id="easter-egg-title" className="modal-title">
            Pip's Secret Starlight Note
          </h3>

          <div className="bedtime-letter-paper">
            <p className="letter-salutation">Dear Sleepy Explorer,</p>
            <p className="letter-body">
              &ldquo;Psst... you found my hidden wish star! I tucked it right up here in the telescope
              dome just for curious stargazers like you.
            </p>
            <p className="letter-highlight">
              Even the smallest star can light up the deepest night. Sleep well, dream big, and don't
              forget to tuck in your dreams!&rdquo;
            </p>
            <div className="letter-signature">
              <span className="sig-name">— Pip, Junior Dream Engineer</span>
              <span className="sig-place">Midnight Nursery Observatory ★</span>
            </div>
          </div>

          <div className="modal-actions-bar">
            <button
              ref={closeBtnRef}
              type="button"
              className="btn-primary modal-close-btn"
              onClick={onClose}
            >
              <span>🌙 Sweet Dreams, Pip! [Close]</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
