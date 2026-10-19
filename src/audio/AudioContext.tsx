/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from '../router/RouterContext';
import { LULLABY_TRACKS, babyGiggleMp3 } from './lullabyEngine';
import type { LullabyTrack, PlaybackState } from './lullabyEngine';

export interface AudioContextType {
  // Ambient Observatory Music (Pause / Resume only)
  isAmbientPlaying: boolean;
  toggleAmbientMusic: () => Promise<void>;
  pauseAmbientMusic: () => void;
  resumeAmbientMusic: () => Promise<void>;
  startAmbientAfterLogin: () => Promise<void>;

  // Lullaby Lab (Pause / Resume, Track Selection, Progress display)
  activeLullabyIndex: number;
  activeLullabyTrack: LullabyTrack;
  lullabyPlaybackState: PlaybackState;
  isLullabyPlaying: boolean;
  lullabyCurrentTime: number;
  lullabyDuration: number;
  playLullaby: (trackIndex?: number) => Promise<void>;
  pauseLullaby: () => void;
  resumeLullaby: () => Promise<void>;
  stopLullaby: () => void;
  selectLullabyTrack: (trackIndex: number) => Promise<void>;
  seekLullaby: (timeInSeconds: number) => void;

  // Baby Giggle SFX (Interactive Navbar Accent)
  playBabyGiggle: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentPath } = useRouter();

  // --------------------------------------------------------------------------
  // 1. Ambient Background Audio Element (public/audio/observatory-ambient.mp3)
  // --------------------------------------------------------------------------
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState<boolean>(false);

  // --------------------------------------------------------------------------
  // 2. Lullaby Lab Audio Element (src/audio/*.mp3)
  // --------------------------------------------------------------------------
  const lullabyAudioRef = useRef<HTMLAudioElement | null>(null);
  const [activeLullabyIndex, setActiveLullabyIndex] = useState<number>(0);
  const [lullabyPlaybackState, setLullabyPlaybackState] = useState<PlaybackState>('stopped');
  const [lullabyCurrentTime, setLullabyCurrentTime] = useState<number>(0);
  const [lullabyDuration, setLullabyDuration] = useState<number>(0);

  // --------------------------------------------------------------------------
  // 3. Baby Giggle SFX Audio Element (src/audio/baby-giggle.mp3)
  // --------------------------------------------------------------------------
  const giggleAudioRef = useRef<HTMLAudioElement | null>(null);

  // Active track object
  const activeLullabyTrack = LULLABY_TRACKS[activeLullabyIndex] || LULLABY_TRACKS[0];
  const isLullabyPlaying = lullabyPlaybackState === 'playing';

  // Track currentPath with ref to avoid stale closures in audio event listeners
  const currentPathRef = useRef<string>(currentPath);
  useEffect(() => {
    currentPathRef.current = currentPath;
  }, [currentPath]);

  // Refs for tracking playback states inside event listeners without stale closures
  const isLullabyPlayingRef = useRef<boolean>(false);
  useEffect(() => {
    isLullabyPlayingRef.current = isLullabyPlaying;
  }, [isLullabyPlaying]);

  // Initialize Ambient Audio Player
  useEffect(() => {
    const ambient = new Audio('/audio/observatory-ambient.mp3');
    ambient.loop = true;
    ambient.preload = 'auto';
    ambientAudioRef.current = ambient;

    const handleAmbientPlay = () => setIsAmbientPlaying(true);
    const handleAmbientPause = () => setIsAmbientPlaying(false);
    const handleAmbientEnded = () => {
      // Loop backup for browser quirks
      if (ambientAudioRef.current && !isLullabyPlayingRef.current) {
        ambientAudioRef.current.currentTime = 0;
        ambientAudioRef.current.play().catch(() => {});
      }
    };
    const handleAmbientError = (e: Event) => {
      console.warn('Ambient observatory audio error:', e);
      setIsAmbientPlaying(false);
    };

    ambient.addEventListener('play', handleAmbientPlay);
    ambient.addEventListener('pause', handleAmbientPause);
    ambient.addEventListener('ended', handleAmbientEnded);
    ambient.addEventListener('error', handleAmbientError);

    return () => {
      ambient.removeEventListener('play', handleAmbientPlay);
      ambient.removeEventListener('pause', handleAmbientPause);
      ambient.removeEventListener('ended', handleAmbientEnded);
      ambient.removeEventListener('error', handleAmbientError);
      ambient.pause();
      ambient.src = '';
      ambientAudioRef.current = null;
    };
  }, []);

  // Initialize Lullaby Audio Player
  useEffect(() => {
    const lullaby = new Audio(LULLABY_TRACKS[0].src);
    lullaby.preload = 'metadata';
    lullabyAudioRef.current = lullaby;

    const handleTimeUpdate = () => {
      setLullabyCurrentTime(lullaby.currentTime);
    };

    const handleLoadedMetadata = () => {
      setLullabyDuration(lullaby.duration || 0);
    };

    const handlePlay = () => {
      setLullabyPlaybackState('playing');
    };

    const handlePause = () => {
      setLullabyPlaybackState((prev) => (prev === 'stopped' ? 'stopped' : 'paused'));
    };

    const handleEnded = () => {
      isLullabyPlayingRef.current = false;
      setLullabyPlaybackState('stopped');
      setLullabyCurrentTime(0);
      // Requirement: Automatically resume global ambient music when a lullaby finishes naturally
      if (currentPathRef.current !== '/signin' && ambientAudioRef.current) {
        ambientAudioRef.current.play().then(() => {
          setIsAmbientPlaying(true);
        }).catch((err) => {
          console.warn('Ambient auto-resume prevented (autoplay restriction):', err);
          setIsAmbientPlaying(false);
        });
      }
    };

    const handleError = (e: Event) => {
      console.warn('Lullaby audio playback error:', e);
      setLullabyPlaybackState('stopped');
    };

    lullaby.addEventListener('timeupdate', handleTimeUpdate);
    lullaby.addEventListener('loadedmetadata', handleLoadedMetadata);
    lullaby.addEventListener('play', handlePlay);
    lullaby.addEventListener('pause', handlePause);
    lullaby.addEventListener('ended', handleEnded);
    lullaby.addEventListener('error', handleError);

    return () => {
      lullaby.removeEventListener('timeupdate', handleTimeUpdate);
      lullaby.removeEventListener('loadedmetadata', handleLoadedMetadata);
      lullaby.removeEventListener('play', handlePlay);
      lullaby.removeEventListener('pause', handlePause);
      lullaby.removeEventListener('ended', handleEnded);
      lullaby.removeEventListener('error', handleError);
      lullaby.pause();
      lullaby.src = '';
      lullabyAudioRef.current = null;
    };
  }, []);

  // Guarantee: When on /signin, ambient audio must NEVER play
  useEffect(() => {
    if (currentPath === '/signin') {
      if (ambientAudioRef.current && !ambientAudioRef.current.paused) {
        ambientAudioRef.current.pause();
        setIsAmbientPlaying(false);
      }
      if (lullabyAudioRef.current && !lullabyAudioRef.current.paused) {
        lullabyAudioRef.current.pause();
        setLullabyPlaybackState('paused');
      }
    }
  }, [currentPath]);

  // --------------------------------------------------------------------------
  // Ambient Music Controls: Pause and Resume only
  // --------------------------------------------------------------------------
  const pauseAmbientMusic = useCallback(() => {
    const ambient = ambientAudioRef.current;
    if (ambient && !ambient.paused) {
      ambient.pause();
      setIsAmbientPlaying(false);
    }
  }, []);

  const resumeAmbientMusic = useCallback(async () => {
    // Critical Rule: If a lullaby is currently playing, clicking Resume must NOT start ambient music!
    if (isLullabyPlayingRef.current) {
      return;
    }

    // Do not play ambient on signin page
    if (currentPath === '/signin') {
      return;
    }

    const ambient = ambientAudioRef.current;
    if (!ambient) return;

    try {
      await ambient.play();
      setIsAmbientPlaying(true);
    } catch (err) {
      console.warn('Ambient audio resume prevented (autoplay policy):', err);
      setIsAmbientPlaying(false);
    }
  }, [currentPath]);

  const toggleAmbientMusic = useCallback(async () => {
    // If a lullaby is currently playing:
    // "If the user clicks Resume while a lullaby is currently playing:
    //  - Do not start ambient music.
    //  - Do not pause or interrupt the lullaby.
    //  - Keep ambient music paused.
    //  - Keep the navbar control in the correct Resume state."
    if (isLullabyPlayingRef.current) {
      return;
    }

    const ambient = ambientAudioRef.current;
    if (!ambient) return;

    if (!ambient.paused) {
      // Pause ambient and preserve playback position
      ambient.pause();
      setIsAmbientPlaying(false);
    } else {
      // Resume ambient from saved position
      await resumeAmbientMusic();
    }
  }, [resumeAmbientMusic]);

  const startAmbientAfterLogin = useCallback(async () => {
    // Critical Rule: If a lullaby is currently playing, clicking Resume or auto-starting must NOT start ambient music!
    if (isLullabyPlayingRef.current) {
      return;
    }

    const ambient = ambientAudioRef.current;
    if (!ambient) return;

    try {
      await ambient.play();
      setIsAmbientPlaying(true);
    } catch (err) {
      console.warn('Ambient audio auto-start prevented (autoplay restriction):', err);
      setIsAmbientPlaying(false);
    }
  }, []);

  // --------------------------------------------------------------------------
  // Lullaby Lab Controls: Priority playback, Auto-Resumption of Ambient
  // --------------------------------------------------------------------------
  const autoResumeAmbient = useCallback(() => {
    if (currentPathRef.current === '/signin') return;
    const ambient = ambientAudioRef.current;
    if (!ambient) return;
    ambient.play().then(() => {
      setIsAmbientPlaying(true);
    }).catch((err) => {
      console.warn('Ambient auto-resume prevented (autoplay policy):', err);
      setIsAmbientPlaying(false);
    });
  }, []);

  const playLullaby = useCallback(async (trackIndex?: number) => {
    const lullaby = lullabyAudioRef.current;
    const ambient = ambientAudioRef.current;

    isLullabyPlayingRef.current = true;

    // 1. Immediately pause ambient background music!
    if (ambient && !ambient.paused) {
      ambient.pause();
      setIsAmbientPlaying(false);
    }

    if (!lullaby) return;

    const targetIndex = trackIndex !== undefined ? trackIndex : activeLullabyIndex;
    const targetTrack = LULLABY_TRACKS[targetIndex];

    if (!targetTrack) return;

    // If changing track, switch source before playing
    if (targetIndex !== activeLullabyIndex || lullaby.src !== targetTrack.src) {
      lullaby.pause();
      lullaby.src = targetTrack.src;
      lullaby.currentTime = 0;
      setActiveLullabyIndex(targetIndex);
    }

    try {
      await lullaby.play();
      setLullabyPlaybackState('playing');
    } catch (err) {
      console.warn('Lullaby audio play error:', err);
      isLullabyPlayingRef.current = false;
      setLullabyPlaybackState('stopped');
      autoResumeAmbient();
    }
  }, [activeLullabyIndex, autoResumeAmbient]);

  const pauseLullaby = useCallback(() => {
    const lullaby = lullabyAudioRef.current;
    if (lullaby) {
      lullaby.pause();
      isLullabyPlayingRef.current = false;
      setLullabyPlaybackState('paused');
      // Requirement: Automatically resume global ambient music when a lullaby is paused
      autoResumeAmbient();
    }
  }, [autoResumeAmbient]);

  const resumeLullaby = useCallback(async () => {
    isLullabyPlayingRef.current = true;

    // Immediately pause ambient music
    const ambient = ambientAudioRef.current;
    if (ambient && !ambient.paused) {
      ambient.pause();
      setIsAmbientPlaying(false);
    }

    const lullaby = lullabyAudioRef.current;
    if (!lullaby) return;

    try {
      await lullaby.play();
      setLullabyPlaybackState('playing');
    } catch (err) {
      console.warn('Lullaby resume error:', err);
      isLullabyPlayingRef.current = false;
      setLullabyPlaybackState('paused');
      autoResumeAmbient();
    }
  }, [autoResumeAmbient]);

  const stopLullaby = useCallback(() => {
    const lullaby = lullabyAudioRef.current;
    if (lullaby) {
      lullaby.pause();
      lullaby.currentTime = 0;
      isLullabyPlayingRef.current = false;
      setLullabyPlaybackState('stopped');
      setLullabyCurrentTime(0);
      // Requirement: Automatically resume global ambient music when a lullaby is stopped
      autoResumeAmbient();
    }
  }, [autoResumeAmbient]);

  const selectLullabyTrack = useCallback(async (trackIndex: number) => {
    if (trackIndex === activeLullabyIndex) return;

    const lullaby = lullabyAudioRef.current;
    const wasPlaying = isLullabyPlayingRef.current;

    setActiveLullabyIndex(trackIndex);
    const newTrack = LULLABY_TRACKS[trackIndex];

    if (lullaby && newTrack) {
      // Stop previous track before loading new track
      lullaby.pause();
      lullaby.src = newTrack.src;
      lullaby.currentTime = 0;
      setLullabyCurrentTime(0);

      if (wasPlaying) {
        // When switching directly from one lullaby to another, keep ambient music paused between tracks
        isLullabyPlayingRef.current = true;
        try {
          await lullaby.play();
          setLullabyPlaybackState('playing');
        } catch {
          isLullabyPlayingRef.current = false;
          setLullabyPlaybackState('stopped');
          autoResumeAmbient();
        }
      } else {
        setLullabyPlaybackState('stopped');
      }
    }
  }, [activeLullabyIndex, autoResumeAmbient]);

  const seekLullaby = useCallback((timeInSeconds: number) => {
    const lullaby = lullabyAudioRef.current;
    if (lullaby && !isNaN(timeInSeconds)) {
      lullaby.currentTime = Math.max(0, Math.min(timeInSeconds, lullaby.duration || 0));
      setLullabyCurrentTime(lullaby.currentTime);
    }
  }, []);

  // --------------------------------------------------------------------------
  // Baby Giggle Sound Effect (Separate, Non-overlapping)
  // --------------------------------------------------------------------------
  const playBabyGiggle = useCallback(() => {
    try {
      if (!giggleAudioRef.current) {
        giggleAudioRef.current = new Audio(babyGiggleMp3);
        giggleAudioRef.current.preload = 'auto';
      }
      const audio = giggleAudioRef.current;
      // Prevent overlapping duplicate instances: reset to start
      audio.currentTime = 0;
      audio.play().catch((err) => {
        console.warn('Baby giggle playback prevented:', err);
      });
    } catch (err) {
      console.warn('Giggle sound effect exception:', err);
    }
  }, []);

  return (
    <AudioContext.Provider
      value={{
        isAmbientPlaying,
        toggleAmbientMusic,
        pauseAmbientMusic,
        resumeAmbientMusic,
        startAmbientAfterLogin,
        activeLullabyIndex,
        activeLullabyTrack,
        lullabyPlaybackState,
        isLullabyPlaying,
        lullabyCurrentTime,
        lullabyDuration,
        playLullaby,
        pauseLullaby,
        resumeLullaby,
        stopLullaby,
        selectLullabyTrack,
        seekLullaby,
        playBabyGiggle
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
