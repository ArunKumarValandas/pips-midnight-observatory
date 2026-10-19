import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useRouter } from '../router/RouterContext';
import {
  fetchGuestbookMessages,
  submitGuestbookMessage,
  type GuestbookMessage
} from '../services/apiService';

const MAX_MESSAGE_LENGTH = 240;
const INITIAL_VISIBLE_COUNT = 3;

function formatTimestamp(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return 'Starlight hour';
  }
}

export const GuestbookWall: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { navigate } = useRouter();

  // Guestbook messages state
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_VISIBLE_COUNT);

  // Modal & form states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [messageText, setMessageText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [submitSuccess, setSubmitSuccess] = useState<string>('');

  // Initial load of messages on mount
  useEffect(() => {
    let isMounted = true;
    fetchGuestbookMessages(30, 0)
      .then((data) => {
        if (isMounted) {
          setMessages(data.messages);
          setTotalCount(data.total);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          console.warn('Guestbook load error:', err);
          setLoadError('Starlight messages could not be fetched from the nursery. Tap refresh to try again.');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Manual refresh handler
  const handleRefresh = async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const data = await fetchGuestbookMessages(30, 0);
      setMessages(data.messages);
      setTotalCount(data.total);
    } catch (err: unknown) {
      console.warn('Guestbook load error:', err);
      setLoadError('Starlight messages could not be fetched from the nursery. Tap refresh to try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Open modal handler
  const handleOpenModal = () => {
    setSubmitError('');
    setSubmitSuccess('');
    setMessageText('');
    setIsModalOpen(true);
  };

  // Close modal handler
  const handleCloseModal = () => {
    if (isSubmitting) return;
    setIsModalOpen(false);
    setSubmitError('');
    setSubmitSuccess('');
  };

  // Submit dream message
  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      setSubmitError('Please sign in to write a dream message for Pip.');
      return;
    }

    const trimmed = messageText.trim();
    if (!trimmed) {
      setSubmitError('Please enter a dream wish before sending.');
      return;
    }

    if (trimmed.length > MAX_MESSAGE_LENGTH) {
      setSubmitError(`Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`);
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');

    try {
      const newEntry = await submitGuestbookMessage(
        trimmed,
        user.token || '',
        user.name,
        user.id
      );

      // Add new message immediately to local state without page reload
      setMessages((prev) => [newEntry, ...prev]);
      setTotalCount((c) => c + 1);
      setSubmitSuccess('✨ Your dream wish was softly sealed in starlight!');
      setMessageText('');

      // Automatically close modal after showing success
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitSuccess('');
      }, 1400);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not send dream message. Please try again.';
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Card pastel color themes cycling by index
  const getCardThemeClass = (index: number): string => {
    const variants = ['card-pastel-rose', 'card-pastel-gold', 'card-pastel-lavender', 'card-pastel-navy'];
    return variants[index % variants.length];
  };

  const displayedMessages = messages.slice(0, visibleCount);

  return (
    <aside className="goodnight-guestbook-wall" aria-label="Pip’s Live Dream Guestbook">
      {/* Wall Header Block */}
      <div className="guestbook-header-box">
        <div className="guestbook-badge">
          <span className="badge-star" aria-hidden="true">★</span>
          <span>Live Starlight Guestbook</span>
          {totalCount > 0 && <span className="badge-count">({totalCount})</span>}
        </div>
        <h3 className="guestbook-title">Wishes Floating to Pip</h3>
        <p className="guestbook-subtitle">
          Notes and bedtime blessings left by stargazers across the dream sky.
        </p>

        {/* Action Controls Row */}
        <div className="guestbook-actions-bar">
          <button
            type="button"
            className="btn-primary write-wish-trigger-btn"
            onClick={handleOpenModal}
            aria-label="Write Pip a Message or leave a dream wish"
          >
            <span className="btn-glyph" aria-hidden="true">✍️</span>
            <span>Leave a Dream Wish</span>
          </button>

          <button
            type="button"
            className="refresh-wall-btn"
            onClick={handleRefresh}
            disabled={isLoading}
            aria-label="Refresh dream messages"
            title="Refresh latest messages"
          >
            <span className={`refresh-icon ${isLoading ? 'spinning' : ''}`} aria-hidden="true">
              ↻
            </span>
          </button>
        </div>
      </div>

      {/* Floating Messages Deck */}
      <div className="guestbook-cards-stream" role="feed" aria-busy={isLoading}>
        {isLoading && messages.length === 0 && (
          <div className="guestbook-empty-state">
            <span className="empty-sparkle" aria-hidden="true">✨</span>
            <p className="empty-text">Gathering dream wishes from the starry sky...</p>
          </div>
        )}

        {loadError && messages.length === 0 && (
          <div className="guestbook-error-notice" role="alert">
            <p>{loadError}</p>
            <button type="button" className="retry-btn" onClick={handleRefresh}>
              Retry
            </button>
          </div>
        )}

        {!isLoading && messages.length === 0 && !loadError && (
          <div className="guestbook-empty-state">
            <span className="empty-sparkle" aria-hidden="true">🌟</span>
            <p className="empty-text">No dream notes yet tonight. Be the first to whisper a wish to Pip!</p>
          </div>
        )}

        {displayedMessages.map((msg, index) => (
          <article
            key={msg.id}
            className={`dream-note-card ${getCardThemeClass(index)} card-float-${(index % 4) + 1}`}
            aria-labelledby={`note-author-${msg.id}`}
          >
            <div className="note-card-pin" aria-hidden="true">
              <span className="pin-gem">✦</span>
            </div>

            <header className="note-card-header">
              <span id={`note-author-${msg.id}`} className="note-author-name">
                {msg.author}
              </span>
              <time className="note-timestamp" dateTime={msg.createdAt}>
                {formatTimestamp(msg.createdAt)}
              </time>
            </header>

            <div className="note-card-body">
              <p className="note-message-text">{msg.message}</p>
            </div>

            <footer className="note-card-footer" aria-hidden="true">
              <span className="note-seal">★ ✧ ★</span>
            </footer>
          </article>
        ))}
      </div>

      {/* View More / Pagination Controls */}
      {(messages.length > visibleCount || visibleCount > INITIAL_VISIBLE_COUNT) && (
        <div className="guestbook-expand-row">
          {messages.length > visibleCount && (
            <button
              type="button"
              className="guestbook-more-btn"
              onClick={() => setVisibleCount((c) => Math.min(c + 3, messages.length))}
              aria-label={`View more dream wishes (${messages.length - visibleCount} more available)`}
            >
              <span>Read More Wishes ({messages.length - visibleCount} more) ✦</span>
            </button>
          )}
          {visibleCount > INITIAL_VISIBLE_COUNT && (
            <button
              type="button"
              className="guestbook-collapse-btn"
              onClick={() => setVisibleCount(INITIAL_VISIBLE_COUNT)}
              aria-label="Collapse dream wishes back to 3 recent"
            >
              <span>Collapse Wishes ↑</span>
            </button>
          )}
        </div>
      )}

      {/* ===================================================================
          THEMED DREAM WISH MODAL / FORM
          =================================================================== */}
      {isModalOpen && (
        <div
          className="guestbook-modal-backdrop"
          onClick={handleCloseModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="wish-modal-title"
        >
          <div
            className="guestbook-modal-dialog"
            onClick={(e) => e.stopPropagation()}
            role="document"
          >
            <div className="modal-dialog-header">
              <div className="modal-eyebrow">
                <span className="eyebrow-star" aria-hidden="true">★</span>
                <span>Midnight Sanctuary Letter</span>
                <span className="eyebrow-star" aria-hidden="true">★</span>
              </div>
              <h4 id="wish-modal-title" className="modal-dialog-title">
                Write Pip a Dream Wish
              </h4>
              <p className="modal-dialog-desc">
                Leave a message that will float across the night sky for Pip and all dreamers to see.
              </p>
            </div>

            {isAuthenticated && user ? (
              <form onSubmit={handleSubmitMessage} className="guestbook-form">
                {/* Author Display Name Badge (Derived from active session) */}
                <div className="form-author-indicator">
                  <span className="author-label">Dreamer Author:</span>
                  <span className="author-val">
                    <strong>{user.name}</strong> <span className="author-badge">Verified Stargazer</span>
                  </span>
                </div>

                {/* Message Textarea */}
                <div className="form-field-group">
                  <label htmlFor="dream-message-input" className="form-label">
                    Your Bedtime Message / Wish:
                  </label>
                  <textarea
                    id="dream-message-input"
                    className="dream-textarea"
                    rows={4}
                    maxLength={MAX_MESSAGE_LENGTH}
                    placeholder="Whisper your wish to the constellations... (e.g. May your sleep be peaceful and soft tonight! ✨)"
                    value={messageText}
                    onChange={(e) => {
                      setMessageText(e.target.value);
                      if (submitError) setSubmitError('');
                    }}
                    disabled={isSubmitting}
                    required
                    autoFocus
                  />
                  <div className="textarea-footer-row">
                    <span
                      className={`char-counter ${
                        messageText.length >= MAX_MESSAGE_LENGTH ? 'char-limit-reached' : ''
                      }`}
                      aria-live="polite"
                    >
                      {messageText.length} / {MAX_MESSAGE_LENGTH} characters
                    </span>
                    <span className="textarea-hint">Visible to all visitors</span>
                  </div>
                </div>

                {/* Status Alerts */}
                {submitError && (
                  <div className="form-alert alert-error" role="alert">
                    <span>⚠️ {submitError}</span>
                  </div>
                )}

                {submitSuccess && (
                  <div className="form-alert alert-success" role="status">
                    <span>{submitSuccess}</span>
                  </div>
                )}

                {/* Dialog Footer Actions */}
                <div className="modal-dialog-actions">
                  <button
                    type="button"
                    className="btn-secondary modal-cancel-btn"
                    onClick={handleCloseModal}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary modal-submit-btn"
                    disabled={isSubmitting || !messageText.trim()}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-star" aria-hidden="true">★</span>
                        <span>Sealing in Starlight...</span>
                      </>
                    ) : (
                      <span>Release Wish to the Sky ✦</span>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* Unauthenticated Prompt */
              <div className="unauth-guestbook-prompt">
                <div className="unauth-icon-box" aria-hidden="true">
                  <span>🔒</span>
                </div>
                <p className="unauth-title">Stargazer Authentication Required</p>
                <p className="unauth-text">
                  Only signed-in dreamers can write notes on Pip's dream wall. Please sign in to verify your identity.
                </p>
                <div className="unauth-actions">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => {
                      setIsModalOpen(false);
                      navigate('/signin');
                    }}
                  >
                    Sign in to Pip’s Portfolio
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleCloseModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};
