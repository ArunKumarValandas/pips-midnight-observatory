import React from 'react';

// Handcrafted 8-bit pixel art props with crisp pixel edges

export const PixelJar: React.FC<{ size?: number; sparksCount?: number }> = ({ size = 64 }) => (
  <svg
    width={size}
    height={size * 1.25}
    viewBox="0 0 32 40"
    shapeRendering="crispEdges"
    className="pixel-prop-svg pixel-jar-prop"
    aria-hidden="true"
  >
    {/* Jar Cork Stopper */}
    <rect x="11" y="2" width="10" height="4" fill="var(--cocoa)" />
    <rect x="12" y="4" width="8" height="2" fill="var(--starlight-amber)" />

    {/* Jar Rim */}
    <rect x="8" y="6" width="16" height="3" fill="var(--rich-berry)" />

    {/* Glass Body Outline */}
    <rect x="6" y="9" width="20" height="26" fill="rgba(255, 255, 255, 0.18)" />
    <rect x="5" y="11" width="1" height="22" fill="var(--starlight-amber)" />
    <rect x="26" y="11" width="1" height="22" fill="var(--starlight-amber)" />
    <rect x="7" y="35" width="18" height="2" fill="var(--starlight-amber)" />

    {/* Glass Highlights */}
    <rect x="8" y="12" width="2" height="18" fill="#fff" opacity="0.6" />

    {/* Floating Pixel Embers inside */}
    <rect x="12" y="20" width="3" height="3" fill="var(--starlight-amber)" className="pixel-ember pe1" />
    <rect x="18" y="16" width="4" height="4" fill="#fff" className="pixel-ember pe2" />
    <rect x="14" y="27" width="3" height="3" fill="var(--soft-rose)" className="pixel-ember pe3" />
  </svg>
);

export const PixelStarNet: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    shapeRendering="crispEdges"
    className="pixel-prop-svg pixel-net-prop"
    aria-hidden="true"
  >
    {/* Wooden Pole */}
    <line x1="4" y1="28" x2="16" y2="16" stroke="var(--cocoa)" strokeWidth="3" />

    {/* Brass Net Hoop */}
    <rect x="14" y="8" width="14" height="2" fill="var(--starlight-amber)" />
    <rect x="12" y="10" width="2" height="8" fill="var(--starlight-amber)" />
    <rect x="28" y="10" width="2" height="8" fill="var(--starlight-amber)" />
    <rect x="14" y="18" width="14" height="2" fill="var(--starlight-amber)" />

    {/* Velvet Mesh Grid */}
    <rect x="15" y="11" width="12" height="6" fill="var(--rich-berry)" opacity="0.45" />
    <rect x="17" y="12" width="2" height="2" fill="var(--starlight-amber)" />
    <rect x="23" y="14" width="2" height="2" fill="var(--starlight-amber)" />
  </svg>
);

export const PixelLoomShuttle: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <svg
    width={size}
    height={size * 0.5}
    viewBox="0 0 40 20"
    shapeRendering="crispEdges"
    className="pixel-prop-svg pixel-shuttle-prop"
    aria-hidden="true"
  >
    {/* Pointed Shuttle Body */}
    <rect x="8" y="6" width="24" height="8" fill="var(--cocoa)" />
    <rect x="4" y="8" width="4" height="4" fill="var(--cocoa)" />
    <rect x="32" y="8" width="4" height="4" fill="var(--cocoa)" />
    <rect x="2" y="9" width="2" height="2" fill="var(--cocoa)" />
    <rect x="36" y="9" width="2" height="2" fill="var(--cocoa)" />

    {/* Center Bobbin with Silver Starlight Thread */}
    <rect x="14" y="7" width="12" height="6" fill="var(--starlight-amber)" />
    <rect x="16" y="8" width="8" height="4" fill="#fff" />
  </svg>
);

export const PixelMoonBubble: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    shapeRendering="crispEdges"
    className="pixel-prop-svg pixel-bubble-prop"
    aria-hidden="true"
  >
    {/* Stepped Pixel Bubble Perimeter */}
    <rect x="10" y="4" width="12" height="2" fill="var(--starlight-amber)" />
    <rect x="6" y="6" width="4" height="2" fill="var(--starlight-amber)" />
    <rect x="22" y="6" width="4" height="2" fill="var(--starlight-amber)" />
    <rect x="4" y="8" width="2" height="4" fill="var(--starlight-amber)" />
    <rect x="26" y="8" width="2" height="4" fill="var(--starlight-amber)" />
    <rect x="2" y="12" width="2" height="8" fill="var(--starlight-amber)" />
    <rect x="28" y="12" width="2" height="8" fill="var(--starlight-amber)" />
    <rect x="4" y="20" width="2" height="4" fill="var(--starlight-amber)" />
    <rect x="26" y="20" width="2" height="4" fill="var(--starlight-amber)" />
    <rect x="6" y="24" width="4" height="2" fill="var(--starlight-amber)" />
    <rect x="22" y="24" width="4" height="2" fill="var(--starlight-amber)" />
    <rect x="10" y="26" width="12" height="2" fill="var(--starlight-amber)" />

    {/* Translucent Interior */}
    <rect x="6" y="8" width="20" height="16" fill="rgba(246, 199, 107, 0.2)" />

    {/* Glint highlight */}
    <rect x="8" y="8" width="4" height="4" fill="#fff" opacity="0.8" />

    {/* Tiny Dream Teddy inside */}
    <rect x="14" y="14" width="4" height="4" fill="var(--rich-berry)" />
    <rect x="12" y="12" width="2" height="2" fill="var(--rich-berry)" />
    <rect x="18" y="12" width="2" height="2" fill="var(--rich-berry)" />
  </svg>
);
