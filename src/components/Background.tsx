'use client';

import { useEffect, useRef, useState } from 'react';

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
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const frame = useRef<number | null>(null);

  // Subtle mouse parallax (pointer devices only, after mount).
  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;
    const onMove = (e: MouseEvent) => {
      if (frame.current) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = null;
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        setOffset({ x, y });
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* soft, desaturated light pools with gentle parallax */}
      <div
        className="absolute -left-40 top-[12%] h-[32rem] w-[32rem] rounded-full bg-accent/[0.06] blur-3xl animate-pulse-glow transition-transform duration-700 ease-out"
        style={{ transform: `translate(${offset.x * 14}px, ${offset.y * 14}px)` }}
      />
      <div
        className="absolute -right-32 bottom-[-6rem] h-[34rem] w-[34rem] rounded-full bg-[#1e2a42]/25 blur-3xl animate-pulse-glow transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${offset.x * -20}px, ${offset.y * -20}px)`,
          animationDelay: '1.5s',
        }}
      />

      {/* drifting dust motes */}
      <div
        className="absolute inset-0 transition-transform duration-1000 ease-out"
        style={{ transform: `translate(${offset.x * 6}px, ${offset.y * 6}px)` }}
      >
        {DUST.map((p, i) => (
          <span
            key={i}
            className={`absolute rounded-full animate-particle ${
              i % 3 === 0 ? 'bg-accent/45' : 'bg-frost/40'
            }`}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.s}px`,
              height: `${p.s}px`,
              animationDelay: `${p.d}s`,
              filter: 'blur(0.5px)',
            }}
          />
        ))}
      </div>

      {/* edge vignette for depth */}
      <div
        className="absolute inset-0"
        style={{
          boxShadow: 'inset 0 0 200px 50px rgba(7, 12, 28, 0.75)',
        }}
      />
    </div>
  );
}
