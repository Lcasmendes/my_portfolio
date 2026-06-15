'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Corners } from './Ornament';

export interface Attribute {
  label: string;
  value: number; // 0-100, relative emphasis across the profile
}

interface FocusRadarProps {
  label: string;
  hint: string;
  attributes: Attribute[];
}

// ---- Radar geometry -------------------------------------------------------
// Wide viewBox with side margins so axis labels never bleed out of the panel.
const W = 460;
const H = 360;
const CX = W / 2;
const CY = 172;
const R = 120;

function axisAngle(i: number, n: number) {
  return (-90 + (360 / n) * i) * (Math.PI / 180);
}
function point(i: number, n: number, frac: number) {
  const a = axisAngle(i, n);
  return { x: CX + R * frac * Math.cos(a), y: CY + R * frac * Math.sin(a) };
}
function polygon(n: number, frac: number) {
  return Array.from({ length: n }, (_, i) => {
    const p = point(i, n, frac);
    return `${p.x},${p.y}`;
  }).join(' ');
}

export default function FocusRadar({ label, hint, attributes }: FocusRadarProps) {
  const n = attributes.length;
  const [hovered, setHovered] = useState<number | null>(null);
  const dataPoints = attributes.map((a, i) => point(i, n, a.value / 100));
  const dataPolygon = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div className="hud-panel p-5 sm:p-6">
      <Corners />

      <p className="text-xs uppercase tracking-widest2 text-frost-soft">{label}</p>

      <div className="mt-4 grid items-center gap-6 md:grid-cols-2">
        {/* Radar */}
        <div className="mx-auto w-full max-w-md">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full">
            <defs>
              <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#aebccd" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#243044" stopOpacity={0.25} />
              </radialGradient>
              <filter id="radarGlow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="4" />
              </filter>
            </defs>

            {/* grid rings */}
            {[0.25, 0.5, 0.75, 1].map((f) => (
              <polygon
                key={f}
                points={polygon(n, f)}
                fill="none"
                stroke="#aebccd"
                strokeOpacity={0.15}
                strokeWidth={1}
              />
            ))}

            {/* spokes */}
            {attributes.map((_, i) => {
              const p = point(i, n, 1);
              const active = hovered === i;
              return (
                <line
                  key={i}
                  x1={CX}
                  y1={CY}
                  x2={p.x}
                  y2={p.y}
                  stroke="#aebccd"
                  strokeOpacity={active ? 0.7 : 0.18}
                  strokeWidth={active ? 1.6 : 1}
                />
              );
            })}

            {/* data polygon */}
            <motion.polygon
              points={dataPolygon}
              fill="url(#radarFill)"
              stroke="#aebccd"
              strokeWidth={2}
              filter="url(#radarGlow)"
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            />
            <motion.polygon
              points={dataPolygon}
              fill="none"
              stroke="#eef1f6"
              strokeWidth={1.5}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            />

            {/* vertices */}
            {dataPoints.map((p, i) => {
              const active = hovered === i;
              return (
                <g
                  key={i}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  style={{ cursor: 'pointer' }}
                >
                  {active && (
                    <circle cx={p.x} cy={p.y} r={9} fill="#aebccd" filter="url(#radarGlow)" opacity={0.7} />
                  )}
                  <circle cx={p.x} cy={p.y} r={active ? 5 : 3.5} fill="#ffffff" />
                  <circle cx={p.x} cy={p.y} r={16} fill="transparent" />
                </g>
              );
            })}

            {/* axis labels */}
            {attributes.map((a, i) => {
              const lp = point(i, n, 1.22);
              const ca = Math.cos(axisAngle(i, n));
              const sa = Math.sin(axisAngle(i, n));
              const anchor = ca > 0.1 ? 'start' : ca < -0.1 ? 'end' : 'middle';
              const dy = sa > 0.5 ? 12 : sa < -0.5 ? -6 : 4;
              const active = hovered === i;
              return (
                <text
                  key={i}
                  x={lp.x}
                  y={lp.y + dy}
                  textAnchor={anchor}
                  fontFamily="var(--font-body), sans-serif"
                  fontSize={13}
                  fontWeight={active ? 700 : 400}
                  fill={active ? '#ffffff' : '#9aa6b8'}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  style={{ cursor: 'pointer' }}
                >
                  {a.label}
                </text>
              );
            })}
          </svg>
        </div>

        {/* Attribute bars */}
        <div>
          <div className="space-y-2.5">
            {attributes.map((a, i) => {
              const active = hovered === i;
              return (
                <div
                  key={a.label}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className="cursor-pointer"
                >
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className={active ? 'text-white' : 'text-frost-soft'}>
                      {a.label}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                    <motion.div
                      className={`h-full rounded-full ${
                        active ? 'bg-frost-soft shadow-glow' : 'bg-frost/70'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${a.value}%` }}
                      transition={{ duration: 0.8, delay: 0.1 + i * 0.08, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-[0.7rem] italic text-frost-dim">{hint}</p>
        </div>
      </div>
    </div>
  );
}
