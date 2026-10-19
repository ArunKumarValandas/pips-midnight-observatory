import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  shape: 'star' | 'circle';
  rotation: number;
  rotationSpeed: number;
}

const STAR_COLORS = [
  '#f6c76b', // Starlight amber
  '#fff8f1', // Warm cream
  '#f4cbd7', // Soft rose
  '#fbd38d'  // Golden sparkle
];

export const StardustCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (typeof window === 'undefined') return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Only enable on pointer: fine (mouse / trackpad) to avoid battery/touch issues on mobile
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number | null = null;
    let isRunning = false;
    const particles: Particle[] = [];

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const draw4PointStar = (
      context: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      outerRadius: number,
      rotation: number
    ) => {
      const innerRadius = outerRadius * 0.35;
      context.save();
      context.translate(cx, cy);
      context.rotate(rotation);
      context.beginPath();
      for (let i = 0; i < 8; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / 4;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (i === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.closePath();
      context.fill();
      context.restore();
    };

    const loop = () => {
      if (particles.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        isRunning = false;
        animId = null;
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        p.rotation += p.rotationSpeed;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowColor = '#f6c76b';
        ctx.shadowBlur = 4;

        if (p.shape === 'star') {
          draw4PointStar(ctx, p.x, p.y, p.size, p.rotation);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      animId = requestAnimationFrame(loop);
    };

    const handlePointerMove = (e: PointerEvent) => {
      // Spawn 1 to 2 golden stardust motes per movement
      const count = Math.random() > 0.4 ? 2 : 1;
      for (let i = 0; i < count; i++) {
        const offsetDist = Math.random() * 8;
        const offsetAngle = Math.random() * Math.PI * 2;
        particles.push({
          x: e.clientX + Math.cos(offsetAngle) * offsetDist,
          y: e.clientY + Math.sin(offsetAngle) * offsetDist,
          vx: (Math.random() - 0.5) * 1.0,
          vy: (Math.random() - 0.5) * 1.0 - 0.4, // gentle upward drift
          size: Math.random() * 3 + 1.5,
          color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
          alpha: 0.9,
          decay: 0.02 + Math.random() * 0.02,
          shape: Math.random() > 0.5 ? 'star' : 'circle',
          rotation: Math.random() * Math.PI,
          rotationSpeed: (Math.random() - 0.5) * 0.1
        });
      }

      // Limit particle count to avoid any performance hit
      if (particles.length > 50) {
        particles.splice(0, particles.length - 50);
      }

      if (!isRunning) {
        isRunning = true;
        animId = requestAnimationFrame(loop);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      if (animId !== null) {
        cancelAnimationFrame(animId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="stardust-cursor-canvas"
      aria-hidden="true"
    />
  );
};
