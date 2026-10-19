// Bedtime Lullaby Audio Management for Pip's Lullaby Lab
// Real studio MP3 master recordings & coordination structures

import starrySerenadeMp3 from './starry-serenade.mp3';
import moonlightDreamsMp3 from './moonlight-dreams.mp3';
import sleepyCloudsMp3 from './sleepy-clouds.mp3';
import babyGiggleMp3 from './baby-giggle.mp3';

export { starrySerenadeMp3, moonlightDreamsMp3, sleepyCloudsMp3, babyGiggleMp3 };

export interface LullabyTrack {
  id: string;
  title: string;
  src: string;
  tempo: string;
  bpm: number;
  mood: string;
}

export const LULLABY_TRACKS: LullabyTrack[] = [
  {
    id: 'starry-serenade',
    title: 'Starry Serenade',
    src: starrySerenadeMp3,
    tempo: '60 BPM (Adagio)',
    bpm: 60,
    mood: 'Sweet & Restful'
  },
  {
    id: 'moonlight-dreams',
    title: 'Moonlight Dreams',
    src: moonlightDreamsMp3,
    tempo: '75 BPM (Andante)',
    bpm: 75,
    mood: 'Playful & Gentle'
  },
  {
    id: 'sleepy-clouds',
    title: 'Sleepy Clouds',
    src: sleepyCloudsMp3,
    tempo: '50 BPM (Largo)',
    bpm: 50,
    mood: 'Deep Slumber'
  }
];

export interface NoteDefinition {
  pitch: string;
  freq: number;
  durationMultiplier?: number;
}

export interface MelodyTrack {
  id: string;
  title: string;
  tempo: string;
  bpm: number;
  mood: string;
  notes: NoteDefinition[];
}

export const NOTE_FREQS: Record<string, number> = {
  'G4': 392.00,
  'A4': 440.00,
  'B4': 493.88,
  'C5': 523.25,
  'D5': 587.33,
  'E5': 659.25,
  'F5': 698.46,
  'G5': 783.99,
  'A5': 880.00,
  'B5': 987.77,
  'C6': 1046.50,
  'D6': 1174.66,
  'E6': 1318.51,
  'G6': 1567.98,
  'REST': 0
};

export const LULLABY_MELODIES: MelodyTrack[] = [
  {
    id: 'serenade',
    title: 'Starry Serenade',
    tempo: '60 BPM (Adagio)',
    bpm: 60,
    mood: 'Sweet & Restful',
    notes: [
      { pitch: 'C5', freq: NOTE_FREQS['C5'] },
      { pitch: 'E5', freq: NOTE_FREQS['E5'] },
      { pitch: 'G5', freq: NOTE_FREQS['G5'] },
      { pitch: 'A5', freq: NOTE_FREQS['A5'] },
      { pitch: 'G5', freq: NOTE_FREQS['G5'], durationMultiplier: 1.5 },
      { pitch: 'E5', freq: NOTE_FREQS['E5'] },
      { pitch: 'C5', freq: NOTE_FREQS['C5'] },
      { pitch: 'D5', freq: NOTE_FREQS['D5'] },
      { pitch: 'E5', freq: NOTE_FREQS['E5'] },
      { pitch: 'D5', freq: NOTE_FREQS['D5'], durationMultiplier: 1.5 },
      { pitch: 'C5', freq: NOTE_FREQS['C5'] },
      { pitch: 'G4', freq: NOTE_FREQS['G4'] },
      { pitch: 'C5', freq: NOTE_FREQS['C5'] },
      { pitch: 'E5', freq: NOTE_FREQS['E5'] },
      { pitch: 'D5', freq: NOTE_FREQS['D5'] },
      { pitch: 'C5', freq: NOTE_FREQS['C5'], durationMultiplier: 2.0 }
    ]
  },
  {
    id: 'waltz',
    title: 'Moonlight Dreams',
    tempo: '75 BPM (Andante)',
    bpm: 75,
    mood: 'Playful & Gentle',
    notes: [
      { pitch: 'G5', freq: NOTE_FREQS['G5'] },
      { pitch: 'E5', freq: NOTE_FREQS['E5'] },
      { pitch: 'C5', freq: NOTE_FREQS['C5'] },
      { pitch: 'D5', freq: NOTE_FREQS['D5'] },
      { pitch: 'E5', freq: NOTE_FREQS['E5'] },
      { pitch: 'G5', freq: NOTE_FREQS['G5'] },
      { pitch: 'A5', freq: NOTE_FREQS['A5'], durationMultiplier: 1.3 },
      { pitch: 'C6', freq: NOTE_FREQS['C6'] },
      { pitch: 'B5', freq: NOTE_FREQS['B5'] },
      { pitch: 'A5', freq: NOTE_FREQS['A5'] },
      { pitch: 'G5', freq: NOTE_FREQS['G5'], durationMultiplier: 1.4 },
      { pitch: 'E5', freq: NOTE_FREQS['E5'] },
      { pitch: 'F5', freq: NOTE_FREQS['F5'] },
      { pitch: 'E5', freq: NOTE_FREQS['E5'] },
      { pitch: 'D5', freq: NOTE_FREQS['D5'] },
      { pitch: 'C5', freq: NOTE_FREQS['C5'], durationMultiplier: 2.0 }
    ]
  },
  {
    id: 'hush',
    title: 'Sleepy Clouds',
    tempo: '50 BPM (Largo)',
    bpm: 50,
    mood: 'Deep Slumber',
    notes: [
      { pitch: 'E5', freq: NOTE_FREQS['E5'] },
      { pitch: 'B4', freq: NOTE_FREQS['B4'] },
      { pitch: 'C5', freq: NOTE_FREQS['C5'] },
      { pitch: 'G4', freq: NOTE_FREQS['G4'], durationMultiplier: 1.4 },
      { pitch: 'A4', freq: NOTE_FREQS['A4'] },
      { pitch: 'G4', freq: NOTE_FREQS['G4'] },
      { pitch: 'C5', freq: NOTE_FREQS['C5'] },
      { pitch: 'E5', freq: NOTE_FREQS['E5'] },
      { pitch: 'D5', freq: NOTE_FREQS['D5'] },
      { pitch: 'C5', freq: NOTE_FREQS['C5'], durationMultiplier: 2.2 }
    ]
  }
];

export type PlaybackState = 'stopped' | 'playing' | 'paused';

export class LullabyAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;
  private currentTrackIndex: number = 0;
  private currentStepIndex: number = 0;
  private playbackState: PlaybackState = 'stopped';
  private timerId: number | null = null;
  private onStateChange: ((state: PlaybackState) => void) | null = null;
  private onStepChange: ((stepIndex: number, noteName: string) => void) | null = null;
  private readonly defaultVolume: number = 0.16;

  public isSupported(): boolean {
    return typeof window !== 'undefined' && ('AudioContext' in window || 'webkitAudioContext' in window);
  }

  private initContext(): boolean {
    if (this.ctx) return true;
    if (!this.isSupported()) return false;

    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.defaultVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
      return true;
    } catch {
      return false;
    }
  }

  public setCallbacks(
    onState: (state: PlaybackState) => void,
    onStep: (step: number, note: string) => void
  ) {
    this.onStateChange = onState;
    this.onStepChange = onStep;
  }

  private playChime(freq: number, durationSec: number) {
    if (!this.ctx || !this.masterGain || freq <= 0) return;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    const osc2 = this.ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2.002, now);

    const noteGain = this.ctx.createGain();
    const overtoneGain = this.ctx.createGain();

    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.linearRampToValueAtTime(0.7, now + 0.006);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + Math.max(0.6, durationSec * 1.5));

    overtoneGain.gain.setValueAtTime(0.0001, now);
    overtoneGain.gain.linearRampToValueAtTime(0.2, now + 0.004);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + Math.max(0.3, durationSec * 0.7));

    osc1.connect(noteGain);
    osc2.connect(overtoneGain);

    noteGain.connect(this.masterGain);
    overtoneGain.connect(this.masterGain);

    const stopTime = now + Math.max(0.8, durationSec * 1.6);
    osc1.start(now);
    osc2.start(now);
    osc1.stop(stopTime);
    osc2.stop(stopTime);

    setTimeout(() => {
      try {
        osc1.disconnect();
        osc2.disconnect();
        noteGain.disconnect();
        overtoneGain.disconnect();
      } catch {
        // Ignored
      }
    }, (stopTime - now + 0.1) * 1000);
  }

  private scheduleNext() {
    if (this.playbackState !== 'playing') return;

    const track = LULLABY_MELODIES[this.currentTrackIndex];
    if (!track || track.notes.length === 0) return;

    const note = track.notes[this.currentStepIndex];
    const baseDuration = 60 / track.bpm;
    const actualDuration = baseDuration * (note.durationMultiplier || 1.0);

    this.playChime(note.freq, actualDuration);

    if (this.onStepChange) {
      this.onStepChange(this.currentStepIndex, note.pitch);
    }

    this.currentStepIndex = (this.currentStepIndex + 1) % track.notes.length;

    const delayMs = Math.max(250, actualDuration * 1000);
    this.timerId = window.setTimeout(() => {
      this.scheduleNext();
    }, delayMs);
  }

  public async play(): Promise<boolean> {
    if (!this.initContext()) return false;

    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    if (this.playbackState === 'playing') return true;

    this.playbackState = 'playing';
    if (this.onStateChange) this.onStateChange('playing');

    this.scheduleNext();
    return true;
  }

  public pause(): void {
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.playbackState = 'paused';
    if (this.onStateChange) this.onStateChange('paused');
  }

  public resume(): void {
    if (this.playbackState === 'paused') {
      this.play();
    }
  }

  public stop(): void {
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.currentStepIndex = 0;
    this.playbackState = 'stopped';
    if (this.onStateChange) this.onStateChange('stopped');
    if (this.onStepChange) this.onStepChange(0, '');
  }

  public setMute(mute: boolean): void {
    this.isMuted = mute;
    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(mute ? 0 : this.defaultVolume, now + 0.04);
    }
  }

  public toggleMute(): boolean {
    this.setMute(!this.isMuted);
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getPlaybackState(): PlaybackState {
    return this.playbackState;
  }

  public setTrackIndex(index: number): void {
    const wasPlaying = this.playbackState === 'playing';
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.currentTrackIndex = Math.max(0, Math.min(index, LULLABY_MELODIES.length - 1));
    this.currentStepIndex = 0;

    if (wasPlaying) {
      this.scheduleNext();
    } else if (this.onStepChange) {
      this.onStepChange(0, '');
    }
  }

  public dispose(): void {
    this.stop();
    if (this.ctx) {
      try {
        this.ctx.close();
      } catch {
        // Ignored
      }
      this.ctx = null;
      this.masterGain = null;
    }
  }
}
