import React, { useState } from 'react';
import { DELIVERY_STOPS } from '../constants';
import type { DeliveryStop } from '../types';
import { useAudio } from '../audio/AudioContext';
import { LULLABY_TRACKS } from '../audio/lullabyEngine';
import { PageNavigation } from './PageNavigation';

interface LanternCardData {
  id: string;
  name: string;
  badge: string;
  imageSrc: string;
  altText: string;
  description: string;
  spectrum: string;
  colorTemp: string;
  glowRgba: string;
  artisanDetail: string;
  defaultGlow: number;
}

const LANTERNS_COLLECTION: LanternCardData[] = [
  {
    id: 'slumber-cloud',
    name: 'The Slumber-Cloud Bell',
    badge: 'Lantern 01 • Peach Cloud Embers',
    imageSrc: '/images/lanterns/lantern-1.png',
    altText: 'Bell-shaped peach ceramic lantern with glowing star and moon cutouts and a sleeping pastel cloud relief',
    description: 'Sculpted from warm peach clay with a resting cloud guardian. Casts gentle rose-hued starlight cutouts across nursery walls to lull newborns into restful sleep.',
    spectrum: 'Soft Peach & Rose Ember',
    colorTemp: '2100K Warm Glow',
    glowRgba: '255, 168, 140',
    artisanDetail: 'Fitted with lavender clay rims, biscuit base, and brass suspension ring for hanging above nursery cribs.',
    defaultGlow: 65
  },
  {
    id: 'twilight-sol',
    name: 'The Twilight Sol Guardian',
    badge: 'Lantern 02 • Midnight Sun Radiance',
    imageSrc: '/images/lanterns/lantern-2.png',
    altText: 'Deep twilight blue bell lantern with silver ring, lavender base, and a smiling sun face emitting gentle violet starlight',
    description: 'Finished in deep twilight navy with a smiling sun relief. Emits a soothing violet-indigo aura that softens bedtime shadows and protects slumbering dreamers throughout the darkest hours.',
    spectrum: 'Violet Starlight & Midnight Indigo',
    colorTemp: '3800K Calming Glow',
    glowRgba: '178, 158, 255',
    artisanDetail: 'Silver suspension ring forged from fallen meteorite metal; features twilight cloud trims and starry illumination vents.',
    defaultGlow: 70
  },
  {
    id: 'celestial-orbit',
    name: 'The Celestial Orbit Lantern',
    badge: 'Lantern 03 • Emerald Ringed Planet',
    imageSrc: '/images/lanterns/lantern-3.png',
    altText: 'Obsidian black bell lantern with brass ring featuring a smiling ringed planet glowing with vibrant emerald and cyan light',
    description: 'Forged with obsidian-lacquered ceramic and a luminous emerald ringed planet. Channels deep cosmic tranquility to slow busy thoughts and soothe active minds before bedtime.',
    spectrum: 'Aurora Emerald & Cosmic Cyan',
    colorTemp: '5000K Serene Radiance',
    glowRgba: '64, 230, 180',
    artisanDetail: 'Equipped with orbital planet core that holds celestial starlight energy in a steady, calming pulse.',
    defaultGlow: 75
  },
  {
    id: 'starlight-meadow',
    name: 'The Starlight Meadow Projector',
    badge: 'Lantern 04 • Forest Moss & Blushing Star',
    imageSrc: '/images/lanterns/lantern-4.png',
    altText: 'Forest green bell lantern projecting cyan stars onto the table, centered around a smiling bright pink star relief',
    description: 'Crafted from deep moss-green pottery with a radiant blushing star centerpiece. Projects delicate cyan constellations across tables and floors to create a soothing bedside nightscape.',
    spectrum: 'Rose Quartz & Constellation Cyan',
    colorTemp: '4200K Dreamcast Aura',
    glowRgba: '255, 120, 180',
    artisanDetail: 'Under-cast projection ports cast crescent moons and twinkling stars onto bedside surfaces and nursery walls.',
    defaultGlow: 80
  },
  {
    id: 'moon-catcher',
    name: 'The Moon-Catcher Beacon',
    badge: 'Lantern 05 • Golden Crescent Classic',
    imageSrc: '/images/lanterns/lantern-5.png',
    altText: 'Warm ivory and biscuit ceramic lantern featuring a smiling crescent moon glowing with warm golden starlight',
    description: 'Pip’s classic signature beacon forged from warm biscuit porcelain and brass. Houses an eternally smiling crescent moon that emits comforting golden candlelight.',
    spectrum: 'Pure Honey Gold & Warm Amber',
    colorTemp: '1800K Candlelight Glow',
    glowRgba: '246, 199, 107',
    artisanDetail: 'Pip’s first successful prototype for Midnight Nursery; remains the gold standard for bedtime comfort.',
    defaultGlow: 65
  }
];

export const InteractiveProjects: React.FC = () => {
  // -------------------------------------------------------------
  // Project 1: Lullaby Lab & Real MP3 Audio State
  // -------------------------------------------------------------
  const {
    activeLullabyIndex,
    activeLullabyTrack,
    lullabyPlaybackState,
    isLullabyPlaying,
    lullabyCurrentTime,
    lullabyDuration,
    pauseLullaby,
    resumeLullaby,
    selectLullabyTrack,
    seekLullaby
  } = useAudio();

  // Helper: Format seconds to MM:SS
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // -------------------------------------------------------------
  // Project 2: Five Distinct Lantern Cards State & Carousel
  // -------------------------------------------------------------
  const [activeLanternIndex, setActiveLanternIndex] = useState<number>(0);
  const [lanternGlow, setLanternGlow] = useState<number>(65);

  const activeLantern = LANTERNS_COLLECTION[activeLanternIndex];

  const handlePrevLantern = () => {
    if (activeLanternIndex > 0) {
      setActiveLanternIndex(activeLanternIndex - 1);
    }
  };

  const handleNextLantern = () => {
    if (activeLanternIndex < LANTERNS_COLLECTION.length - 1) {
      setActiveLanternIndex(activeLanternIndex + 1);
    }
  };

  const getLanternIntensityLabel = (val: number, lanternName: string) => {
    if (val < 25) {
      return {
        name: 'Gentle Nursery Ember',
        desc: `Soft nightlight warmth emitted by ${lanternName}`,
        lumens: `${val * 2} Lumens`
      };
    }
    if (val < 50) {
      return {
        name: 'Slumber Candlelight',
        desc: `Comforting bedtime reading glow from ${lanternName}`,
        lumens: `${val * 2} Lumens`
      };
    }
    if (val < 80) {
      return {
        name: 'Midnight Starlight',
        desc: `Standard nocturnal guardian radiance for ${lanternName}`,
        lumens: `${val * 2} Lumens`
      };
    }
    return {
      name: 'Radiant Dawn Watch',
      desc: `Maximum shadow-chasing brilliance from ${lanternName}`,
      lumens: `${val * 2} Lumens`
    };
  };

  const lanternInfo = getLanternIntensityLabel(lanternGlow, activeLantern.name);

  // -------------------------------------------------------------
  // Project 3: Delivery Routes State
  // -------------------------------------------------------------
  const [selectedStopId, setSelectedStopId] = useState<string>('cloudtop-nursery');
  const [isTraveling, setIsTraveling] = useState<boolean>(false);

  const activeStop: DeliveryStop =
    DELIVERY_STOPS.find((s) => s.id === selectedStopId) || DELIVERY_STOPS[0];

  const handleSelectStop = (stopId: string) => {
    setSelectedStopId(stopId);
    setIsTraveling(true);
    setTimeout(() => setIsTraveling(false), 1400);
  };

  return (
    <section id="projects" className="projects-section" aria-label="Interactive Projects in Pip’s Portfolio">
      <div className="section-header-block">
        <div className="section-eyebrow">
          <span className="pixel-icon">✦</span>
          <span>Laboratory & Workshop Experiments</span>
        </div>
        <h2 className="section-title">Pip's Active Engineering Projects</h2>
        <p className="section-subtitle">
          Three specialized nocturnal inventions designed to soothe restless dreamers across the realms.
        </p>
      </div>

      <div className="projects-stack">
        {/* ========================================================= */}
        {/* PROJECT 1: THE LULLABY LAB                                */}
        {/* ========================================================= */}
        <article className="project-card lullaby-card" aria-labelledby="proj-1-title">
          <div className="project-grid">
            {/* Visual Music Box Stage with Active Mechanical Effects */}
            <div className="project-visual-col">
              <div
                className={`lullaby-box-stage ${isLullabyPlaying ? 'is-playing' : ''} ${
                  lullabyPlaybackState === 'paused' ? 'is-paused' : ''
                }`}
                style={{
                  boxShadow: isLullabyPlaying ? '0 0 28px var(--star-glow)' : 'none'
                }}
              >
                {/* Official Asset: pip_lullaby_box.png (Undistorted) */}
                <div className="lullaby-img-wrap">
                  <img
                    src="/images/pip_lullaby_box.png"
                    alt="Pip's pastel music box with a miniature winged unicorn and golden winding key"
                    className="lullaby-box-img"
                    width="340"
                    height="300"
                  />
                  {/* Rotating winding key effect synchronized with audio */}
                  <div className={`mechanical-key-ring ${isLullabyPlaying ? 'key-turning' : ''}`}></div>
                </div>

                {/* Animated Decorative Musical Notes Floating Upward */}
                {isLullabyPlaying && (
                  <div className="musical-notes-field" aria-hidden="true">
                    <span className="float-note note-1">♪</span>
                    <span className="float-note note-2">♫</span>
                    <span className="float-note note-3">♩</span>
                    <span className="float-note note-4">♬</span>
                    <span className="float-note note-5">★</span>
                    <span className="float-note note-6">✧</span>
                  </div>
                )}

                {/* Mechanical state badge */}
                <div className="mechanical-status-chip">
                  <span
                    className={`status-indicator-dot ${
                      isLullabyPlaying
                        ? 'dot-active'
                        : lullabyPlaybackState === 'paused'
                        ? 'dot-paused'
                        : ''
                    }`}
                  ></span>
                  <span className="status-chip-text">
                    {isLullabyPlaying
                      ? `Playing: ${activeLullabyTrack.title}`
                      : lullabyPlaybackState === 'paused'
                      ? 'Melody Paused'
                      : 'Music Box Standby'}
                  </span>
                </div>
              </div>
            </div>

            {/* Audio Controls & Diagnostics */}
            <div className="project-details-col">
              <div className="project-header-row">
                <span className="project-badge">Project 01 • Studio Acoustics</span>
                <h3 id="proj-1-title" className="project-name">The Lullaby Lab</h3>
              </div>

              <p className="project-description">
                Hand-calibrated music cylinder fitted with a rotating porcelain unicorn. Plays warm,
                comforting master lullaby recordings to guide restless dreamers into deep slumber.
              </p>

              {/* Real Audio Control Deck: Pause & Resume */}
              <div className="lullaby-controls">
                {/* Primary Transport Buttons */}
                <div className="transport-button-row" role="group" aria-label="Lullaby Audio Controls">
                  {isLullabyPlaying ? (
                    <button
                      type="button"
                      className="btn-primary transport-btn"
                      onClick={pauseLullaby}
                      aria-label="Pause lullaby audio"
                    >
                      <span>⏸ Pause Melody</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn-primary transport-btn"
                      onClick={resumeLullaby}
                      aria-label={lullabyPlaybackState === 'paused' ? 'Resume lullaby melody' : 'Play lullaby melody'}
                    >
                      <span>▶ {lullabyPlaybackState === 'paused' ? 'Resume Melody' : 'Play Melody'}</span>
                    </button>
                  )}
                </div>

                {/* Real Playback Progress & Seeking Timeline */}
                <div className="lullaby-progress-box">
                  <div className="progress-time-row">
                    <span className="progress-label">Melody Timeline</span>
                    <span className="progress-time-val">
                      {formatTime(lullabyCurrentTime)} / {formatTime(lullabyDuration)}
                    </span>
                  </div>
                  <div className="seek-bar-track">
                    <input
                      type="range"
                      className="lullaby-seek-slider"
                      min="0"
                      max={lullabyDuration > 0 ? lullabyDuration : 100}
                      step="0.1"
                      value={lullabyCurrentTime}
                      onChange={(e) => seekLullaby(Number(e.target.value))}
                      aria-label="Seek lullaby playback position"
                    />
                  </div>
                </div>

                {/* Cylinder Melody Selector (3 Tracks) */}
                <div className="track-selector-box">
                  <span className="track-box-label">Select Bedtime Music Cylinder:</span>
                  <div className="track-chips" role="radiogroup" aria-label="Lullaby Melodies">
                    {LULLABY_TRACKS.map((track, i) => (
                      <button
                        key={track.id}
                        type="button"
                        role="radio"
                        aria-checked={i === activeLullabyIndex}
                        className={`track-chip ${i === activeLullabyIndex ? 'track-selected' : ''}`}
                        onClick={() => selectLullabyTrack(i)}
                      >
                        <span className="track-name">{track.title}</span>
                        <span className="track-tempo">{track.tempo} • {track.mood}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Diagnostics HUD */}
                <div className="specs-card-compact">
                  <div className="diag-row">
                    <span className="diag-key">Active Track:</span>
                    <span className="diag-val">{activeLullabyTrack.title}</span>
                  </div>
                  <div className="diag-row">
                    <span className="diag-key">Cadence:</span>
                    <span className="diag-val">{activeLullabyTrack.tempo}</span>
                  </div>
                  <div className="diag-row">
                    <span className="diag-key">Audio Engine:</span>
                    <span className="diag-val">Real MP3 Master Recording (Studio Quality)</span>
                  </div>
                  <div className="diag-row">
                    <span className="diag-key">Progress:</span>
                    <span className="diag-val">
                      {formatTime(lullabyCurrentTime)} / {formatTime(lullabyDuration)}
                    </span>
                  </div>
                  <div className="diag-row">
                    <span className="diag-key">Status:</span>
                    <span className="diag-val">
                      {isLullabyPlaying
                        ? 'Audible (Studio Quality MP3)'
                        : lullabyPlaybackState === 'paused'
                        ? 'Melody Paused'
                        : 'Standby / Stopped'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* ========================================================= */}
        {/* PROJECT 2: FIVE DISTINCT LANTERN CARDS (CAROUSEL)          */}
        {/* ========================================================= */}
        <article className="project-card nightlight-card" aria-labelledby="proj-2-title">
          {/* Top Carousel Navigation Header */}
          <div className="lantern-carousel-header">
            <div className="lantern-header-meta">
              <span className="project-badge">Project 02 • Luminescence</span>
              <h3 id="proj-2-title" className="project-name">{activeLantern.name}</h3>
              <span className="lantern-sub-badge">{activeLantern.badge}</span>
            </div>

            {/* Previous and Next Lantern Carousel Controls */}
            <div className="lantern-carousel-controls" role="group" aria-label="Lantern Carousel Navigation">
              <button
                type="button"
                className={`lantern-nav-arrow prev-arrow ${activeLanternIndex === 0 ? 'is-disabled' : ''}`}
                onClick={handlePrevLantern}
                disabled={activeLanternIndex === 0}
                aria-disabled={activeLanternIndex === 0}
                aria-label="Previous lantern"
                title="View previous lantern card"
              >
                <span aria-hidden="true">←</span>
                <span className="arrow-text">Prev</span>
              </button>

              <div className="lantern-position-pill" aria-live="polite" aria-label={`Lantern ${activeLanternIndex + 1} of ${LANTERNS_COLLECTION.length}`}>
                <span className="position-star">★</span>
                <span className="position-text">{activeLanternIndex + 1} of {LANTERNS_COLLECTION.length}</span>
                <span className="position-star">★</span>
              </div>

              <button
                type="button"
                className={`lantern-nav-arrow next-arrow ${
                  activeLanternIndex === LANTERNS_COLLECTION.length - 1 ? 'is-disabled' : ''
                }`}
                onClick={handleNextLantern}
                disabled={activeLanternIndex === LANTERNS_COLLECTION.length - 1}
                aria-disabled={activeLanternIndex === LANTERNS_COLLECTION.length - 1}
                aria-label="Next lantern"
                title="View next lantern card"
              >
                <span className="arrow-text">Next</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>

          {/* Quick Lantern Direct Selection Strip */}
          <div className="lantern-picker-strip" role="tablist" aria-label="Select lantern card">
            {LANTERNS_COLLECTION.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={idx === activeLanternIndex}
                className={`lantern-picker-chip ${idx === activeLanternIndex ? 'chip-active' : ''}`}
                onClick={() => setActiveLanternIndex(idx)}
                aria-label={`Switch to ${item.name}`}
              >
                <span className="picker-num">0{idx + 1}</span>
                <span className="picker-name">{item.name.replace('The ', '')}</span>
              </button>
            ))}
          </div>

          {/* Active Lantern Card Body */}
          <div className="project-grid lantern-card-grid">
            {/* Visual Lantern Stage with Dynamic Spectrum Glow */}
            <div className="project-visual-col">
              <div
                className="lantern-stage"
                style={{
                  boxShadow: `0 0 ${lanternGlow * 1.4}px ${lanternGlow * 0.4}px rgba(${activeLantern.glowRgba}, ${
                    lanternGlow / 120
                  })`,
                  borderColor: `rgba(${activeLantern.glowRgba}, ${0.35 + lanternGlow / 180})`
                }}
              >
                {/* Supplied PNG Image: 1 of 5 (Aspect ratio strictly preserved, no distortion) */}
                <div className="lantern-img-frame">
                  <img
                    src={activeLantern.imageSrc}
                    alt={activeLantern.altText}
                    className="lantern-img"
                    width="320"
                    height="320"
                  />
                  <div
                    className="lantern-light-core"
                    style={{
                      backgroundColor: `rgba(${activeLantern.glowRgba}, 0.5)`,
                      opacity: 0.25 + lanternGlow / 150,
                      transform: `scale(${0.8 + lanternGlow / 250})`
                    }}
                  ></div>
                </div>

                {/* Lantern Spectrum Tag */}
                <div className="lantern-readout-pill">
                  <span className="readout-star">★</span>
                  <span className="readout-text">{activeLantern.spectrum}</span>
                </div>
              </div>
            </div>

            {/* Lantern Details & Calibration Controls */}
            <div className="project-details-col">
              <p className="project-description lantern-description-text">
                {activeLantern.description}
              </p>

              {/* Intensity Slider Control */}
              <div className="lantern-controls">
                <div className="slider-header-row">
                  <label htmlFor="lantern-slider" className="control-label">
                    Adjust Radiance Intensity:
                  </label>
                  <span className="lumens-badge">{lanternInfo.lumens}</span>
                </div>

                <div className="slider-track-wrap">
                  <input
                    id="lantern-slider"
                    type="range"
                    min="10"
                    max="100"
                    value={lanternGlow}
                    onChange={(e) => setLanternGlow(Number(e.target.value))}
                    className="glow-range-input"
                    aria-label="Adjust lantern radiance intensity"
                  />
                  <div className="slider-ticks" aria-hidden="true">
                    <span>Dim</span>
                    <span>Soft</span>
                    <span>Comfort</span>
                    <span>Bright</span>
                  </div>
                </div>

                {/* Real-time description box with high contrast */}
                <div className="lantern-status-box">
                  <span className="status-name">{lanternInfo.name}</span>
                  <p className="status-desc">{lanternInfo.desc}</p>
                </div>

                {/* Artisan Specs Table */}
                <div className="lantern-artisan-specs">
                  <div className="artisan-spec-row">
                    <span className="artisan-spec-key">Color Temperature:</span>
                    <span className="artisan-spec-val">{activeLantern.colorTemp}</span>
                  </div>
                  <div className="artisan-spec-row">
                    <span className="artisan-spec-key">Chamber Spectrum:</span>
                    <span className="artisan-spec-val">{activeLantern.spectrum}</span>
                  </div>
                  <div className="artisan-spec-row">
                    <span className="artisan-spec-key">Artisan Notes:</span>
                    <span className="artisan-spec-val">{activeLantern.artisanDetail}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* ========================================================= */}
        {/* PROJECT 3: BEDTIME DELIVERY ROUTES                        */}
        {/* ========================================================= */}
        <article className="project-card routes-card" aria-labelledby="proj-3-title">
          <div className="project-grid">
            {/* Interactive Flight Map SVG */}
            <div className="project-visual-col">
              <div className="route-map-stage">
                <svg
                  className="route-svg-map"
                  viewBox="0 0 600 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  aria-label="Delivery flight map showing four nocturnal stops"
                >
                  {/* Flight trajectory curve connecting stops */}
                  <path
                    d="M60,130 Q140,50 210,70 T370,140 T520,60"
                    stroke="var(--starlight-amber)"
                    strokeWidth="2.5"
                    strokeDasharray="6 6"
                    className="route-flight-path"
                    opacity="0.75"
                  />

                  {/* Delivery Stop Nodes */}
                  {DELIVERY_STOPS.map((stop) => {
                    const isSelected = stop.id === selectedStopId;
                    return (
                      <g
                        key={stop.id}
                        className={`map-node-group ${isSelected ? 'is-selected' : ''}`}
                        onClick={() => handleSelectStop(stop.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleSelectStop(stop.id);
                          }
                        }}
                        aria-label={`Delivery stop: ${stop.name}`}
                      >
                        <circle
                          cx={stop.x}
                          cy={stop.y}
                          r={isSelected ? 14 : 9}
                          fill={isSelected ? 'var(--starlight-amber)' : 'var(--bg-card)'}
                          stroke="var(--starlight-amber)"
                          strokeWidth="2"
                          className="node-point"
                        />
                        {isSelected && (
                          <circle
                            cx={stop.x}
                            cy={stop.y}
                            r="20"
                            stroke="var(--starlight-amber)"
                            strokeWidth="1.5"
                            className="pulse-halo"
                            opacity="0.6"
                          />
                        )}
                        <text
                          x={stop.x}
                          y={stop.y + 24}
                          textAnchor="middle"
                          fill="var(--text-heading)"
                          fontSize="11"
                          fontFamily="var(--font-pixel)"
                          fontWeight="600"
                          className="node-label"
                        >
                          {stop.name}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {isTraveling && (
                  <div className="flight-status-banner" role="status" aria-live="polite">
                    <span>✨ Navigating constellation wind to {activeStop.name}...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Stop Details */}
            <div className="project-details-col">
              <div className="project-header-row">
                <span className="project-badge">Project 03 • Logistics</span>
                <h3 id="proj-3-title" className="project-name">Constellation Delivery Routes</h3>
              </div>

              <p className="project-description">
                Pip charts nocturnal wind corridors across celestial sectors to ensure fragile
                moon-bubble dreams arrive whisper-quiet before bedtime.
              </p>

              {/* Stop Selector Pills */}
              <div className="stop-selector-chips" role="radiogroup" aria-label="Select delivery stop">
                {DELIVERY_STOPS.map((stop) => (
                  <button
                    key={stop.id}
                    type="button"
                    role="radio"
                    aria-checked={stop.id === selectedStopId}
                    className={`stop-chip ${stop.id === selectedStopId ? 'chip-active' : ''}`}
                    onClick={() => handleSelectStop(stop.id)}
                  >
                    <span>★ {stop.name}</span>
                  </button>
                ))}
              </div>

              {/* Active Stop Dossier Card (Distinct Grid with Clear Separation) */}
              <div className="stop-dossier-card">
                <div className="dossier-header">
                  <h4 className="dossier-title">{activeStop.name}</h4>
                  <span className="dossier-status-pill">{activeStop.deliveryStatus}</span>
                </div>

                <div className="route-specs-grid">
                  <div className="route-spec-item">
                    <span className="route-spec-label">Recipient:</span>
                    <span className="route-spec-val">{activeStop.recipient}</span>
                  </div>
                  <div className="route-spec-item">
                    <span className="route-spec-label">Dream Formula:</span>
                    <span className="route-spec-val">{activeStop.dreamType}</span>
                  </div>
                  <div className="route-spec-item">
                    <span className="route-spec-label">Wind Corridors:</span>
                    <span className="route-spec-val">{activeStop.windSpeed}</span>
                  </div>
                  <div className="route-spec-item">
                    <span className="route-spec-label">Drop Altitude:</span>
                    <span className="route-spec-val">{activeStop.altitude}</span>
                  </div>
                </div>

                <p className="dossier-desc">{activeStop.description}</p>
                <div className="dossier-tip">
                  <span className="tip-star">✧</span>
                  <span className="tip-text">
                    <strong>Flight Note:</strong> {activeStop.specialNote}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>

      {/* Five-Page Observatory Navigation Section */}
      <PageNavigation />
    </section>
  );
};
