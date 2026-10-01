'use client';

import { useEffect, useRef } from 'react';

// Deterministic dust motes (fixed values avoid SSR hydration mismatch).
const DUST = [
  { x: 8, y: 18, s: 2, d: 0 },
  { x: 22, y: 72, s: 2.5, d: 1.2 },
  { x: 35, y: 30, s: 1.5, d: 2.4 },
  { x: 48, y: 85, s: 2, d: 0.6 },
  { x: 60, y: 12, s: 1.5, d: 3 },
  { x: 70, y: 55, s: 1.5, d: 1.8 },
  { x: 82, y: 28, s: 2, d: 2.1 },
  { x: 90, y: 78, s: 1.5, d: 0.9 },
  { x: 15, y: 48, s: 1.5, d: 3.4 },
  { x: 42, y: 60, s: 2, d: 1.5 },
  { x: 55, y: 40, s: 1.5, d: 2.7 },
  { x: 76, y: 90, s: 2, d: 0.3 },
  { x: 28, y: 10, s: 1.5, d: 3.8 },
  { x: 95, y: 45, s: 1.5, d: 1.1 },
  { x: 5, y: 88, s: 1.5, d: 2.9 },
  { x: 65, y: 70, s: 1.5, d: 0.5 },
];

export default function Background() {
  const root = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);

  // Subtle mouse parallax (pointer devices only, after mount). Writes CSS
  // variables straight to the DOM — no React re-render per mouse move.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (
      window.matchMedia('(hover: none)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;
    const onMove = (e: MouseEvent) => {
      if (frame.current) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = null;
        el.style.setProperty('--mx', String((e.clientX / window.innerWidth - 0.5) * 2));
        el.style.setProperty('--my', String((e.clientY / window.innerHeight - 0.5) * 2));
      });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <div
      ref={root}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ '--mx': 0, '--my': 0 } as React.CSSProperties}
    >
      {/* soft light pools — radial gradients instead of CSS blur (blur on large
          animated layers is very costly to rasterize in Firefox) */}
      <div
        className="absolute -left-40 top-[12%] h-[40rem] w-[40rem] animate-pulse-glow will-change-[opacity,transform]"
        style={{
          background:
            'radial-gradient(closest-side, rgba(79,195,214,0.07), transparent)',
          transform: 'translate3d(calc(var(--mx) * 14px), calc(var(--my) * 14px), 0)',
        }}
      />
      <div
        className="absolute -right-32 bottom-[-6rem] h-[42rem] w-[42rem] animate-pulse-glow will-change-[opacity,transform]"
        style={{
          background:
            'radial-gradient(closest-side, rgba(30,42,66,0.30), transparent)',
          transform: 'translate3d(calc(var(--mx) * -20px), calc(var(--my) * -20px), 0)',
          animationDelay: '1.5s',
        }}
      />

      {/* drifting dust motes */}
      <div
        className="absolute inset-0"
        style={{
          transform: 'translate3d(calc(var(--mx) * 6px), calc(var(--my) * 6px), 0)',
        }}
      >
        {DUST.map((p, i) => (
          <span
            key={i}
            className={`absolute rounded-full animate-particle will-change-[transform,opacity] ${
              i % 3 === 0 ? 'bg-accent/45' : 'bg-frost/40'
            }`}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.s}px`,
              height: `${p.s}px`,
              animationDelay: `${p.d}s`,
            }}
          />
        ))}
      </div>

      {/* edge vignette for depth (static gradient — cheaper than a huge inset shadow) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 45%, rgba(7,12,28,0.75) 100%)',
        }}
      />
    </div>
  );
}
