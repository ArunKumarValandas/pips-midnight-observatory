import React, { useState, useRef, useEffect } from 'react';
import { useRouter, Link } from '../router/RouterContext';
import { useAuth } from '../auth/AuthContext';
import { useAudio } from '../audio/AudioContext';
import { VisitorOdometer } from './VisitorOdometer';

export const SignIn: React.FC = () => {
  const { navigate } = useRouter();
  const { login, register, isAuthenticated, user, logout } = useAuth();
  const { startAmbientAfterLogin } = useAudio();

  // Mode: sign-in vs create account
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);

  // Form Fields
  const [email, setEmail] = useState<string>(() => {
    try {
      return localStorage.getItem('pip_remembered_email') || 'dreamer@midnight.nursery';
    } catch {
      return 'dreamer@midnight.nursery';
    }
  });
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [dreamerName, setDreamerName] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem('pip_remembered_email');
    } catch {
      return true;
    }
  });

  // UI States
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [showForgotModal, setShowForgotModal] = useState<boolean>(false);

  // Video & Audio States
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMusicMuted, setIsMusicMuted] = useState<boolean>(true);
  const [videoError, setVideoError] = useState<boolean>(false);

  // Video Autoplay & Audio initialization
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let isCleanedUp = false;

    // Handle external volume changes
    const handleVolumeChange = () => {
      if (!isCleanedUp) {
        setIsMusicMuted(video.muted);
      }
    };
    video.addEventListener('volumechange', handleVolumeChange);

    // Attempt unmuted autoplay first; fallback to muted autoplay and unmute on first gesture
    const startMedia = async () => {
      try {
        video.muted = false;
        await video.play();
        if (!isCleanedUp) {
          setIsMusicMuted(false);
        }
      } catch {
        // Browser autoplay policy rejected unmuted playback
        video.muted = true;
        try {
          await video.play();
        } catch (playErr) {
          console.warn('Muted autoplay also restrained:', playErr);
        }
        if (!isCleanedUp) {
          setIsMusicMuted(true);
        }

        // Unmute gracefully on first user interaction with the window
        const unmuteOnFirstGesture = async () => {
          if (videoRef.current && !isCleanedUp) {
            try {
              videoRef.current.muted = false;
              await videoRef.current.play();
              setIsMusicMuted(false);
            } catch (err) {
              console.warn('Gesture unmute restrained:', err);
            }
          }
          window.removeEventListener('pointerdown', unmuteOnFirstGesture);
          window.removeEventListener('keydown', unmuteOnFirstGesture);
        };

        window.addEventListener('pointerdown', unmuteOnFirstGesture, { once: true });
        window.addEventListener('keydown', unmuteOnFirstGesture, { once: true });
      }
    };

    startMedia();

    return () => {
      isCleanedUp = true;
      video.pause();
      video.removeEventListener('volumechange', handleVolumeChange);
    };
  }, []);

  const handleToggleMusic = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMusicMuted) {
      video.muted = false;
      setIsMusicMuted(false);
      try {
        await video.play();
      } catch (err) {
        console.warn('Autoplay/unmute was constrained:', err);
      }
    } else {
      video.muted = true;
      setIsMusicMuted(true);
    }
  };

  // Real Credential Verification Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Client-side format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanEmail = email.trim();
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setErrorMessage('Please enter a valid starry email address (e.g. dreamer@midnight.nursery).');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your starry password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (isRegisterMode) {
      if (!dreamerName.trim()) {
        setErrorMessage('Please tell Pip your dreamer name.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please verify your starry password.');
        return;
      }
    }

    // Save or clear remember-me preference (Email only — strictly NO plaintext passwords stored)
    try {
      if (rememberMe) {
        localStorage.setItem('pip_remembered_email', cleanEmail);
      } else {
        localStorage.removeItem('pip_remembered_email');
      }
    } catch {
      // Ignored
    }

    setIsLoading(true);

    try {
      if (isRegisterMode) {
        // Real registration with cryptographic salt and hash
        const result = await register(dreamerName.trim(), cleanEmail, password);
        setIsLoading(false);

        if (!result.success) {
          setErrorMessage(result.error || 'Registration could not be completed.');
          return;
        }

        setSuccessMessage(`Welcome to Midnight Nursery, ${dreamerName.trim()}! Your cloud crib is ready.`);
        if (videoRef.current) {
          videoRef.current.pause();
        }
        setTimeout(() => {
          navigate('/');
          startAmbientAfterLogin();
        }, 600);
      } else {
        // Real credential verification using Web Crypto API
        const result = await login(cleanEmail, password);
        setIsLoading(false);

        if (!result.success) {
          // Reject invalid credentials, display clear error, DO NOT navigate
          setErrorMessage(result.error || 'Authentication failed. Please check your credentials.');
          return;
        }

        setSuccessMessage('Starlight verified! Welcome back to Pip\'s Portfolio.');
        if (videoRef.current) {
          videoRef.current.pause();
        }
        setTimeout(() => {
          navigate('/');
          startAmbientAfterLogin();
        }, 500);
      }
    } catch (err) {
      setIsLoading(false);
      console.error('Authentication handshake error:', err);
      setErrorMessage('A cosmic connection error occurred. Please try again.');
    }
  };

  return (
    <div className="signin-page-container">
      {/* Background Video using the official asset /animations/signin-space.mp4 */}
      <div className="signin-video-backdrop" aria-hidden="true">
        {!videoError ? (
          <video
            ref={videoRef}
            className="signin-bg-video"
            autoPlay
            loop
            muted={isMusicMuted}
            playsInline
            onError={() => setVideoError(true)}
            poster="/images/pip_portrait.png"
          >
            <source src="/animations/signin-space.mp4" type="video/mp4" />
          </video>
        ) : (
          <div className="signin-video-fallback" />
        )}

        {/* Ambient celestial vignette overlay to ensure text contrast on the left */}
        <div className="signin-vignette-overlay" />
      </div>

      {/* Top Controls Bar: Background Music Toggle */}
      <header className="signin-top-bar">
        {/* Visible Sound Toggle for embedded MP4 audio */}
        <button
          type="button"
          className={`signin-sound-toggle-btn ${!isMusicMuted ? 'sound-active' : ''}`}
          onClick={handleToggleMusic}
          aria-pressed={!isMusicMuted}
          aria-label={isMusicMuted ? 'Enable video background music' : 'Mute video background music'}
          title={isMusicMuted ? 'Video audio is muted. Click to enable music.' : 'Click to mute music.'}
        >
          <span className="sound-icon" aria-hidden="true">
            {isMusicMuted ? '🔇' : '🔊'}
          </span>
          <span className="sound-label">
            {isMusicMuted ? 'Enable music' : 'Mute music'}
          </span>
        </button>
      </header>

      {/* Main Sign-In Content: Positioned on the LEFT with Dream Counter beside it */}
      <main className="signin-content-wrapper">
        <div className="signin-stage-container">
          <div className="signin-glass-card">
          {/* Brand Heading */}
          <div className="signin-brand-header">
            <span className="brand-star-icon" aria-hidden="true">★</span>
            <span className="brand-name">Pip’s Portfolio</span>
          </div>

          {/* Already Authenticated Banner */}
          {isAuthenticated && user && !successMessage && (
            <div className="signin-active-session-banner">
              <div className="active-user-info">
                <span className="active-user-icon" aria-hidden="true">👤</span>
                <span className="active-user-txt">
                  Currently signed in as <strong>{user.name}</strong> ({user.email})
                </span>
              </div>
              <div className="active-user-actions">
                <Link
                  to="/"
                  className="btn-primary session-continue-btn"
                  onClick={() => {
                    if (videoRef.current) videoRef.current.pause();
                    startAmbientAfterLogin();
                  }}
                >
                  Continue to Portfolio
                </Link>
                <button
                  type="button"
                  className="switch-link-btn"
                  onClick={logout}
                  title="Sign out of current account"
                >
                  Switch account
                </button>
              </div>
            </div>
          )}

          {/* Main Heading & Subtitle */}
          <div className="signin-title-block">
            <h1 className="signin-main-heading">
              {isRegisterMode ? 'Join the dreamers.' : 'Welcome back, dreamer.'}
            </h1>
            <p className="signin-subtitle">
              {isRegisterMode
                ? 'Claim your own cloud-crib and telescope under the stars.'
                : 'Your little corner of the night sky is waiting.'}
            </p>
          </div>

          {/* Status Notifications: Validation / Error / Success */}
          {errorMessage && (
            <div className="signin-alert alert-error" role="alert" aria-live="polite">
              <span className="alert-icon" aria-hidden="true">⚠️</span>
              <span className="alert-text">{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="signin-alert alert-success" role="status" aria-live="polite">
              <span className="alert-icon" aria-hidden="true">✨</span>
              <span className="alert-text">{successMessage}</span>
            </div>
          )}

          {/* Sign-In / Register Form */}
          <form className="signin-form" onSubmit={handleSubmit} noValidate>
            {isRegisterMode && (
              <div className="form-group">
                <label htmlFor="dreamer-name-input" className="form-label">
                  Dreamer Name:
                </label>
                <div className="input-field-wrap">
                  <input
                    id="dreamer-name-input"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Nova Stargazer"
                    value={dreamerName}
                    onChange={(e) => setDreamerName(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            {/* Email Address Field */}
            <div className="form-group">
              <label htmlFor="signin-email-input" className="form-label">
                Email Address:
              </label>
              <div className="input-field-wrap">
                <input
                  id="signin-email-input"
                  type="email"
                  className="form-input"
                  placeholder="dreamer@midnight.nursery"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field with Show/Hide Toggle */}
            <div className="form-group">
              <div className="label-row">
                <label htmlFor="signin-password-input" className="form-label">
                  Password:
                </label>
                {!isRegisterMode && (
                  <button
                    type="button"
                    className="forgot-link-btn"
                    onClick={() => setShowForgotModal(true)}
                  >
                    Forgot password?
                  </button>
                )}
              </div>

              <div className="input-field-wrap password-field-wrap">
                <input
                  id="signin-password-input"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={isRegisterMode ? 'new-password' : 'current-password'}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password text' : 'Show password text'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  <span aria-hidden="true">{showPassword ? '👁️' : '👁️‍🗨️'}</span>
                </button>
              </div>
            </div>

            {/* Confirm Password (Registration mode only) */}
            {isRegisterMode && (
              <div className="form-group">
                <label htmlFor="signin-confirm-password" className="form-label">
                  Confirm Password:
                </label>
                <div className="input-field-wrap">
                  <input
                    id="signin-confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            {/* Remember Me Checkbox */}
            {!isRegisterMode && (
              <div className="form-checkbox-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoading}
                  />
                  <span className="checkbox-custom" aria-hidden="true"></span>
                  <span className="checkbox-text">Remember my star credentials</span>
                </label>
              </div>
            )}

            {/* Primary Action Button */}
            <div className="form-action-row">
              <button
                type="submit"
                className="btn-primary signin-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="submit-spinner" aria-hidden="true">★</span>
                    <span>Verifying starlight credentials...</span>
                  </>
                ) : (
                  <span>{isRegisterMode ? 'Create Dreamer Account' : 'Sign In'}</span>
                )}
              </button>
            </div>
          </form>

          {/* Seed Demo Credentials Helper Note */}
          {!isRegisterMode && (
            <div className="demo-credentials-hint">
              <span className="hint-label">★ Demo Account:</span>{' '}
              <span className="hint-val">dreamer@midnight.nursery</span> /{' '}
              <span className="hint-val">Starlight#2026</span>
            </div>
          )}

          {/* Switcher: New here? Create account / Already registered */}
          <div className="signin-switch-mode">
            {isRegisterMode ? (
              <p className="switch-text">
                Already registered with the observatory?{' '}
                <button
                  type="button"
                  className="switch-link-btn"
                  onClick={() => {
                    setIsRegisterMode(false);
                    setErrorMessage('');
                  }}
                >
                  Sign in
                </button>
              </p>
            ) : (
              <p className="switch-text">
                New here?{' '}
                <button
                  type="button"
                  className="switch-link-btn"
                  onClick={() => {
                    setIsRegisterMode(true);
                    setErrorMessage('');
                  }}
                >
                  Create an account
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Persistent Dream Counter: Positioned outside the sign-in card */}
        <aside className="signin-odometer-companion" aria-label="Observatory Dream Counter">
          <VisitorOdometer />
        </aside>
      </div>
    </main>

      {/* Pip's Description: Positioned at the bottom-right of the viewport with light subtle styling */}
      <aside className="signin-bottom-right-pip" aria-label="About Pip">
        <div className="pip-aside-top">
          <span className="pip-aside-star" aria-hidden="true">✦</span>
          <span className="pip-aside-badge">Junior Dream Engineer</span>
        </div>
        <p className="pip-aside-quote">
          &ldquo;Meet Pip, your little guide through the midnight sky. With a curious heart and a
          love for stargazing, Pip invites you into a cozy observatory filled with dreams,
          starlight, and a little everyday magic.&rdquo;
        </p>
      </aside>

      {/* Forgot Password Helper Modal */}
      {showForgotModal && (
        <div
          className="modal-backdrop"
          onClick={() => setShowForgotModal(false)}
          role="presentation"
        >
          <div
            className="easter-egg-dialog forgot-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="forgot-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-body">
              <div className="secret-tag-pill">
                <span className="secret-icon" aria-hidden="true">☾</span>
                <span>Midnight Assistance</span>
              </div>
              <h2 id="forgot-modal-title" className="modal-title">
                Recover Your Star Credentials
              </h2>
              <div className="bedtime-letter-paper">
                <p className="letter-body">
                  &ldquo;Forgot your bedtime key? In Pip’s Portfolio, dreams are never truly lost!
                  You can sign in using the demo stargazer account (<strong>dreamer@midnight.nursery</strong> / <strong>Starlight#2026</strong>)
                  or use &ldquo;Create an account&rdquo; to register your own custom dreamer key.&rdquo;
                </p>
                <div className="letter-signature">
                  <span className="sig-name">— Pip, Junior Dream Engineer</span>
                </div>
              </div>
              <div className="modal-actions-bar">
                <button
                  type="button"
                  className="btn-primary modal-close-btn"
                  onClick={() => setShowForgotModal(false)}
                >
                  <span>Understood, Pip! [Close]</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
