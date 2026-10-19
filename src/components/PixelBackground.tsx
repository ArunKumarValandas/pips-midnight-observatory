import React from 'react';
import { STABLE_STARS } from '../constants';
import type { Theme } from '../types';

interface PixelBackgroundProps {
  theme: Theme;
}

export const PixelBackground: React.FC<PixelBackgroundProps> = ({ theme }) => {
  return (
    <div className={`pixel-env-backdrop theme-${theme}`} aria-hidden="true">
      {/* Layer 1: Far Sky & Stable Twinkling Stars */}
      <div className="pixel-sky-layer">
        <svg
          className="pixel-stars-svg"
          width="100%"
          height="100%"
          shapeRendering="crispEdges"
        >
          {STABLE_STARS.map((star) => {
            // Render genuine 8-bit cross / pixel diamond star
            const s = Math.max(3, star.size);
            return (
              <g
                key={star.id}
                className="pixel-star-group"
                style={{
                  transform: `translate(${star.x}vw, ${star.y}vh)`,
                  animationDelay: `${star.delay}s`,
                  animationDuration: `${star.duration}s`
                }}
              >
                {/* Center pixel block */}
                <rect x={-s / 2} y={-s / 2} width={s} height={s} fill="var(--starlight-amber)" opacity={star.opacity} />
                {/* Cross points */}
                <rect x={-s / 2} y={-s * 1.5} width={s} height={s} fill="var(--starlight-amber)" opacity={star.opacity * 0.75} />
                <rect x={-s / 2} y={s / 2} width={s} height={s} fill="var(--starlight-amber)" opacity={star.opacity * 0.75} />
                <rect x={-s * 1.5} y={-s / 2} width={s} height={s} fill="var(--starlight-amber)" opacity={star.opacity * 0.75} />
                <rect x={s / 2} y={-s / 2} width={s} height={s} fill="var(--starlight-amber)" opacity={star.opacity * 0.75} />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Layer 2: Handcrafted Pixel Moon in Top Sky */}
      <div className="pixel-moon-container">
        <svg
          width="96"
          height="96"
          viewBox="0 0 32 32"
          shapeRendering="crispEdges"
          className="pixel-crescent-moon-svg"
        >
          {/* Outer glowing halo */}
          <rect x="10" y="4" width="12" height="24" fill="var(--starlight-amber)" opacity="0.12" />
          <rect x="6" y="8" width="20" height="16" fill="var(--starlight-amber)" opacity="0.12" />

          {/* Stepped Pixel Crescent Moon */}
          <rect x="14" y="2" width="6" height="2" fill="var(--starlight-amber)" />
          <rect x="10" y="4" width="6" height="2" fill="var(--starlight-amber)" />
          <rect x="8" y="6" width="6" height="2" fill="var(--starlight-amber)" />
          <rect x="6" y="8" width="6" height="4" fill="var(--starlight-amber)" />
          <rect x="4" y="12" width="6" height="8" fill="var(--starlight-amber)" />
          <rect x="6" y="20" width="6" height="4" fill="var(--starlight-amber)" />
          <rect x="8" y="24" width="6" height="2" fill="var(--starlight-amber)" />
          <rect x="10" y="26" width="6" height="2" fill="var(--starlight-amber)" />
          <rect x="14" y="28" width="6" height="2" fill="var(--starlight-amber)" />

          {/* Inner crescent cut shadow */}
          <rect x="12" y="6" width="4" height="2" fill="#fff" opacity="0.25" />
          <rect x="8" y="12" width="4" height="8" fill="#fff" opacity="0.25" />

          {/* Pixel Sleepy Eye (closed peaceful line) */}
          <rect x="7" y="14" width="3" height="1" fill="var(--cocoa)" />
          <rect x="9" y="15" width="2" height="1" fill="var(--cocoa)" />

          {/* Pixel Rosy Blush Cheek */}
          <rect x="6" y="17" width="3" height="2" fill="var(--soft-rose)" opacity="0.8" />
        </svg>
      </div>

      {/* Layer 3: Drifting Pixel Clouds */}
      <div className="pixel-clouds-layer">
        {/* Cloud 1 (Slow drift) */}
        <div className="pixel-cloud drift-cloud-1">
          <svg width="144" height="48" viewBox="0 0 48 16" shapeRendering="crispEdges">
            <rect x="16" y="2" width="16" height="4" fill="var(--cloud-color, #fff)" opacity="0.8" />
            <rect x="10" y="4" width="28" height="4" fill="var(--cloud-color, #fff)" opacity="0.85" />
            <rect x="6" y="6" width="36" height="6" fill="var(--cloud-color, #fff)" opacity="0.9" />
            <rect x="4" y="8" width="40" height="6" fill="var(--cloud-color, #fff)" opacity="0.95" />
            <rect x="8" y="14" width="32" height="2" fill="var(--cloud-base, #e5d5c5)" opacity="0.6" />
          </svg>
        </div>

        {/* Cloud 2 (Mid-altitude drift) */}
        <div className="pixel-cloud drift-cloud-2">
          <svg width="192" height="64" viewBox="0 0 48 16" shapeRendering="crispEdges">
            <rect x="12" y="3" width="24" height="3" fill="var(--cloud-color, #fff)" opacity="0.75" />
            <rect x="8" y="6" width="32" height="4" fill="var(--cloud-color, #fff)" opacity="0.8" />
            <rect x="4" y="8" width="40" height="6" fill="var(--cloud-color, #fff)" opacity="0.85" />
            <rect x="6" y="13" width="36" height="2" fill="var(--cloud-base, #e5d5c5)" opacity="0.5" />
          </svg>
        </div>

        {/* Cloud 3 (High gentle drift) */}
        <div className="pixel-cloud drift-cloud-3">
          <svg width="120" height="40" viewBox="0 0 48 16" shapeRendering="crispEdges">
            <rect x="18" y="4" width="12" height="3" fill="var(--cloud-color, #fff)" opacity="0.7" />
            <rect x="12" y="7" width="24" height="4" fill="var(--cloud-color, #fff)" opacity="0.75" />
            <rect x="8" y="9" width="32" height="5" fill="var(--cloud-color, #fff)" opacity="0.8" />
          </svg>
        </div>
      </div>

      {/* Layer 4: Distant Pixel Mountain Ridges & Rooftops */}
      <div className="pixel-horizon-layer">
        <svg
          className="horizon-svg"
          viewBox="0 0 1200 180"
          preserveAspectRatio="none"
          shapeRendering="crispEdges"
        >
          {/* Distant mountain silhouette (stepped 8-bit ridges) */}
          <path
            d="M0,180 L0,120 L80,120 L80,100 L160,100 L160,80 L240,80 L240,60 L320,60 L320,80 L400,80 L400,110 L480,110 L480,90 L560,90 L560,70 L640,70 L640,50 L720,50 L720,70 L800,70 L800,90 L880,90 L880,70 L960,70 L960,100 L1040,100 L1040,120 L1120,120 L1120,130 L1200,130 L1200,180 Z"
            fill="var(--mountain-color)"
            opacity="0.35"
          />

          {/* Midground Observatory Dome & Stepped Rooftops */}
          {/* Left Roofs */}
          <rect x="40" y="130" width="80" height="50" fill="var(--rooftop-color)" opacity="0.7" />
          <polygon points="30,130 80,90 130,130" fill="var(--rooftop-trim)" opacity="0.8" />
          {/* Chimney */}
          <rect x="50" y="80" width="14" height="24" fill="var(--cocoa)" opacity="0.85" />
          <rect x="48" y="78" width="18" height="4" fill="var(--rich-berry)" />

          {/* Central Observatory Tower Silhouette */}
          <rect x="520" y="80" width="160" height="100" fill="var(--rooftop-color)" opacity="0.85" />
          {/* Stepped Dome Base */}
          <rect x="540" y="60" width="120" height="20" fill="var(--rooftop-color)" opacity="0.85" />
          <rect x="560" y="44" width="80" height="16" fill="var(--rooftop-color)" opacity="0.85" />
          <rect x="580" y="32" width="40" height="12" fill="var(--rooftop-color)" opacity="0.85" />
          <rect x="596" y="16" width="8" height="16" fill="var(--starlight-amber)" />

          {/* Glowing Square Pixel Windows (Lit up at Night) */}
          <rect x="550" y="100" width="16" height="16" fill="var(--starlight-amber)" className="window-glow w1" />
          <rect x="580" y="100" width="16" height="16" fill="var(--starlight-amber)" className="window-glow w2" />
          <rect x="610" y="100" width="16" height="16" fill="var(--starlight-amber)" className="window-glow w3" />
          <rect x="640" y="100" width="16" height="16" fill="var(--starlight-amber)" className="window-glow w4" />

          <rect x="565" y="130" width="16" height="20" fill="var(--starlight-amber)" className="window-glow w5" />
          <rect x="625" y="130" width="16" height="20" fill="var(--starlight-amber)" className="window-glow w6" />

          {/* Right Roofs with Weather Vane */}
          <rect x="1000" y="120" width="120" height="60" fill="var(--rooftop-color)" opacity="0.75" />
          <polygon points="990,120 1060,80 1130,120" fill="var(--rooftop-trim)" opacity="0.8" />
          <rect x="1056" y="64" width="8" height="16" fill="var(--starlight-amber)" />
          <rect x="1052" y="64" width="16" height="4" fill="var(--starlight-amber)" />
        </svg>
      </div>

      {/* Layer 5: Decorative Pixel Balustrade Border along Bottom */}
      <div className="pixel-balustrade-rail" />
    </div>
  );
};
