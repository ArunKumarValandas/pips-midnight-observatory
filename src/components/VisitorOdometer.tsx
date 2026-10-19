import React, { useState, useEffect, useRef } from 'react';
import { recordVisitSession, getVisitCount } from '../services/apiService';

const SESSION_KEY = 'pip_visitor_session_id';

export const VisitorOdometer: React.FC = () => {
  const [count, setCount] = useState<number>(1204);
  const [prevCount, setPrevCount] = useState<number>(1204);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const hasSentVisit = useRef<boolean>(false);

  useEffect(() => {
    if (hasSentVisit.current) return;
    hasSentVisit.current = true;

    const trackVisit = async () => {
      try {
        let sessionId = '';
        let isExistingSession = false;
        try {
          sessionId = sessionStorage.getItem(SESSION_KEY) || '';
          if (sessionId) {
            isExistingSession = true;
          } else {
            sessionId = 'sess-' + Date.now() + '-' + Math.random().toString(36).slice(2, 10);
            sessionStorage.setItem(SESSION_KEY, sessionId);
          }
        } catch {
          sessionId = 'sess-' + Date.now();
        }

        if (isExistingSession) {
          // Session already tracked; retrieve persistent current total without incrementing
          const currentTotal = await getVisitCount();
          setCount(currentTotal);
          setPrevCount(currentTotal);
        } else {
          // New session: record visit and retrieve incremented total
          const result = await recordVisitSession(sessionId);
          setPrevCount(result.count - (result.isNewVisit ? 1 : 0));
          setCount(result.count);
          if (result.isNewVisit) {
            setIsRolling(true);
            setTimeout(() => setIsRolling(false), 800);
          }
        }
      } catch (err) {
        console.warn('Visitor counter unavailable, using graceful fallback:', err);
        // Fallback safely to baseline count
        setCount(1204);
      }
    };

    trackVisit();
  }, []);

  // Format number into at least 6 digits with comma separation (e.g., 001,204)
  const formatOdometerDigits = (num: number): string[] => {
    const rawStr = Math.max(0, num).toString();
    const padded = rawStr.padStart(6, '0');
    // Insert commas from right to left
    const parts: string[] = [];
    for (let i = 0; i < padded.length; i++) {
      const posFromRight = padded.length - i;
      parts.push(padded[i]);
      if (posFromRight > 1 && posFromRight % 3 === 1) {
        parts.push(',');
      }
    }
    return parts;
  };

  const digits = formatOdometerDigits(count);

  return (
    <div
      className="vintage-visitor-odometer"
      aria-label={`Visitor counter: ${count.toLocaleString()} dreams delivered`}
      role="status"
    >
      <div className="odometer-header-row">
        <span className="odometer-star-badge" aria-hidden="true">★</span>
        <span className="odometer-title">DREAMS DELIVERED</span>
        <span className="odometer-star-badge" aria-hidden="true">★</span>
      </div>

      <div className="odometer-drum-housing" aria-hidden="true">
        {digits.map((char, idx) => {
          if (char === ',') {
            return (
              <span key={`sep-${idx}`} className="odometer-comma-cell">
                ,
              </span>
            );
          }

          const hasIncremented = isRolling && count > prevCount;

          return (
            <div key={`digit-${idx}`} className="odometer-digit-frame">
              <div className={`odometer-digit-reel ${hasIncremented ? 'reel-rolling' : ''}`}>
                <span className="odometer-digit-val">{char}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="odometer-sub-caption">
        <span>Persistent Observatory Starlight Log</span>
      </div>
    </div>
  );
};
