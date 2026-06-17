'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  User,
  Milestone,
  FolderGit2,
  Cpu,
  X,
  type LucideIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { sections } from '@/data/profile';
import { useSound } from './sound/SoundProvider';
import LocaleSwitcher from './LocaleSwitcher';

const ICONS: Record<string, LucideIcon> = {
  about: User,
  journey: Milestone,
  projects: FolderGit2,
  skills: Cpu,
};

const GAP = 0.04;

// Cross/diamond layout — maps each section index to a compass point.
// Order follows `sections`: about → top, journey → left, projects → right, skills → bottom.
type Slot = 'top' | 'left' | 'right' | 'bottom';
const SLOTS: Slot[] = ['top', 'left', 'right', 'bottom'];
const SLOT_POS: Record<Slot, { left: string; top: string }> = {
  top: { left: '50%', top: '21%' },
  left: { left: '21%', top: '50%' },
  right: { left: '79%', top: '50%' },
  bottom: { left: '50%', top: '79%' },
};
// Arrow key → slot → section index
const ARROW_SLOT: Record<string, Slot> = {
  ArrowUp: 'top',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowDown: 'bottom',
};

interface RadialMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function RadialMenu({ open, onClose }: RadialMenuProps) {
  const t = useTranslations('nav');
  const router = useRouter();
  const pathname = usePathname();
  const { play } = useSound();

  const n = sections.length;
  const [half, setHalf] = useState(false);
  const [hover, setHover] = useState(0);

  // Half wheel on mobile, diamond cross on desktop.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setHalf(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const currentIndex = sections.findIndex((s) =>
    s.href === '/' ? pathname === '/' : pathname.startsWith(s.href),
  );

  useEffect(() => {
    if (open) setHover(currentIndex >= 0 ? currentIndex : 0);
  }, [open, currentIndex]);

  const navigate = useCallback(
    (i: number) => {
      play('select');
      router.push(sections[i].href);
      onClose();
    },
    [play, router, onClose],
  );

  // The diamond cross is only well-defined for exactly 4 sections.
  const cross = !half && n === 4;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        navigate(hover);
        return;
      }
      if (cross && ARROW_SLOT[e.key]) {
        e.preventDefault();
        const idx = SLOTS.indexOf(ARROW_SLOT[e.key]);
        if (idx >= 0 && idx !== hover) {
          play('hover');
          setHover(idx);
        }
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        play('hover');
        setHover((h) => (h + 1) % n);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        play('hover');
        setHover((h) => (h - 1 + n) % n);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, hover, n, navigate, onClose, play, cross]);

  // Lock page scroll while the menu is open and compensate for the
  // removed scrollbar so the layout underneath doesn't shift.
  useEffect(() => {
    if (!open) return;
    document.body.dataset.radialOpen = 'true';
    const prevOverflow = document.body.style.overflow;
    const prevPad = document.body.style.paddingRight;
    const sbw = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (sbw > 0) document.body.style.paddingRight = `${sbw}px`;
    return () => {
      delete document.body.dataset.radialOpen;
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPad;
    };
  }, [open]);

  // --- Half-wheel geometry (mobile only) ---
  const g = {
    vbW: 440,
    vbH: 256,
    cx: 220,
    cy: 238,
    rOut: 196,
    rIn: 80,
    rMid: 138,
    base: Math.PI,
    slot: Math.PI / n,
  };
  const polar = (r: number, a: number): [number, number] => [
    g.cx + r * Math.cos(a),
    g.cy + r * Math.sin(a),
  ];
  const wedgePath = (a0: number, a1: number) => {
    const [x0o, y0o] = polar(g.rOut, a0);
    const [x1o, y1o] = polar(g.rOut, a1);
    const [x1i, y1i] = polar(g.rIn, a1);
    const [x0i, y0i] = polar(g.rIn, a0);
    const large = a1 - a0 > Math.PI ? 1 : 0;
    return `M ${x0o} ${y0o} A ${g.rOut} ${g.rOut} 0 ${large} 1 ${x1o} ${y1o} L ${x1i} ${y1i} A ${g.rIn} ${g.rIn} 0 ${large} 0 ${x0i} ${y0i} Z`;
  };

  const hoveredKey = sections[hover]?.key;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={`fixed inset-0 z-50 flex justify-center ${
            half ? 'items-end' : 'items-center'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* backdrop */}
          <button
            type="button"
            aria-label={t('close')}
            onClick={onClose}
            className="absolute inset-0 bg-abyss/70 backdrop-blur-md"
          />

          {/* language switcher — only while the menu is open, top-left */}
          <div className="absolute left-5 top-5 z-10">
            <LocaleSwitcher collapsed={false} />
          </div>

          <button
            type="button"
            aria-label={t('close')}
            onClick={onClose}
            className="absolute right-5 top-5 z-10 text-frost-dim transition hover:text-frost-bright"
          >
            <X size={26} />
          </button>

          {cross ? (
            /* ---------- DESKTOP: diamond cross (FFXV "Primary Arms") ---------- */
            <motion.div
              className="relative z-[1] w-[min(90vw,52rem)] px-4"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            >
              {/* top band — echoes the "Primary Arms" header */}
              <div className="mb-2 flex items-center gap-4">
                <span className="font-display text-2xl tracking-wide text-frost-bright">
                  {hoveredKey ? t(hoveredKey) : t('menu')}
                </span>
                <span className="h-px flex-1 bg-frost-line" />
              </div>

              <div className="relative mx-auto aspect-square w-[min(62vmin,29rem)]">
                {/* center compass ornament */}
                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <svg width={54} height={54} viewBox="0 0 54 54" aria-hidden>
                    <g
                      stroke="#aebccd"
                      strokeOpacity={0.5}
                      strokeWidth={1}
                      fill="none"
                    >
                      <path d="M27 6 L31 27 L27 48 L23 27 Z" />
                      <path d="M6 27 L27 23 L48 27 L27 31 Z" />
                    </g>
                    <circle cx={27} cy={27} r={2.4} fill="#aebccd" />
                  </svg>
                </div>

                {sections.map((section, i) => {
                  const slot = SLOTS[i];
                  const pos = SLOT_POS[slot];
                  const isHover = hover === i;
                  const isCurrent = currentIndex === i;
                  const Icon = ICONS[section.key];
                  return (
                    <button
                      key={section.key}
                      type="button"
                      aria-label={t(section.key)}
                      onMouseEnter={() => {
                        play('hover');
                        setHover(i);
                      }}
                      onFocus={() => setHover(i)}
                      onClick={() => navigate(i)}
                      className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center outline-none"
                      style={{ left: pos.left, top: pos.top }}
                    >
                      <motion.div
                        className="relative"
                        style={{ width: 'clamp(112px,14vmin,150px)' }}
                        animate={{ scale: isHover ? 1.06 : 1 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                      >
                        <svg viewBox="0 0 128 128" className="h-auto w-full">
                          <defs>
                            <radialGradient
                              id="diamondHub"
                              cx="50%"
                              cy="40%"
                              r="62%"
                            >
                              <stop offset="0%" stopColor="#26344f" stopOpacity={0.99} />
                              <stop offset="100%" stopColor="#070d1c" stopOpacity={1} />
                            </radialGradient>
                            <filter
                              id="diamondGlow"
                              x="-40%"
                              y="-40%"
                              width="180%"
                              height="180%"
                            >
                              <feGaussianBlur stdDeviation="4" />
                            </filter>
                          </defs>

                          {/* hover glow behind the frame */}
                          {isHover && (
                            <rect
                              x={25}
                              y={25}
                              width={78}
                              height={78}
                              transform="rotate(45 64 64)"
                              fill="#4fc3d6"
                              opacity={0.28}
                              filter="url(#diamondGlow)"
                            />
                          )}

                          {/* outer diamond frame */}
                          <rect
                            x={25}
                            y={25}
                            width={78}
                            height={78}
                            transform="rotate(45 64 64)"
                            fill="rgba(40,56,92,0.2)"
                            stroke={
                              isHover
                                ? '#7ee0ee'
                                : isCurrent
                                  ? '#4fc3d6'
                                  : 'rgba(174,188,205,0.4)'
                            }
                            strokeWidth={isHover ? 2 : 1.2}
                            className="transition-colors"
                          />
                          {/* inner diamond frame */}
                          <rect
                            x={31}
                            y={31}
                            width={66}
                            height={66}
                            transform="rotate(45 64 64)"
                            fill="none"
                            stroke="rgba(174,188,205,0.22)"
                            strokeWidth={1}
                          />

                          {/* portrait circle — opaque, with ornate double ring */}
                          <circle cx={64} cy={64} r={29} fill="url(#diamondHub)" />
                          <circle
                            cx={64}
                            cy={64}
                            r={29}
                            fill="none"
                            stroke={isHover ? '#7ee0ee' : '#aebccd'}
                            strokeOpacity={isHover ? 0.95 : 0.7}
                            strokeWidth={1.4}
                            className="transition-colors"
                          />
                          <circle
                            cx={64}
                            cy={64}
                            r={32.5}
                            fill="none"
                            stroke={isHover ? '#4fc3d6' : 'rgba(174,188,205,0.4)'}
                            strokeWidth={0.8}
                          />
                          {/* diagonal tick ornaments around the ring */}
                          {[45, 135, 225, 315].map((deg) => {
                            const a = (deg * Math.PI) / 180;
                            const c = Math.cos(a);
                            const s = Math.sin(a);
                            return (
                              <line
                                key={deg}
                                x1={64 + 29 * c}
                                y1={64 + 29 * s}
                                x2={64 + 35 * c}
                                y2={64 + 35 * s}
                                stroke={isHover ? '#7ee0ee' : 'rgba(174,188,205,0.6)'}
                                strokeWidth={1.2}
                                className="transition-colors"
                              />
                            );
                          })}

                          {/* corner flourishes at the four diamond points */}
                          {[
                            [64, 9],
                            [119, 64],
                            [64, 119],
                            [9, 64],
                          ].map(([px, py]) => (
                            <rect
                              key={`${px}-${py}`}
                              x={px - 4}
                              y={py - 4}
                              width={8}
                              height={8}
                              transform={`rotate(45 ${px} ${py})`}
                              fill={isHover ? '#eef1f6' : 'rgba(174,188,205,0.55)'}
                              className="transition-colors"
                            />
                          ))}
                        </svg>

                        {/* icon centered over the portrait circle */}
                        <span
                          className="absolute inset-0 grid place-items-center transition-colors"
                          style={{ color: isHover ? '#7ee0ee' : '#aebccd' }}
                        >
                          <Icon size={30} strokeWidth={1.6} />
                        </span>
                      </motion.div>

                      <span
                        className="mt-2.5 flex items-center gap-1.5 font-body text-[0.95rem] transition-colors"
                        style={{
                          color: isHover ? '#ffffff' : '#d4dbe6',
                          fontWeight: isHover ? 700 : 500,
                          textShadow: '0 1px 8px rgba(7,13,28,0.9)',
                        }}
                      >
                        {isCurrent && (
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent shadow-glow-accent" />
                        )}
                        {t(section.key)}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* bottom band — echoes the "Accessories" footer */}
              <div className="mt-2 flex items-center gap-4">
                <span className="font-body text-[0.7rem] tracking-[0.2em] text-frost-dim">
                  {t('wheelHint')}
                </span>
                <span className="h-px flex-1 bg-frost-line" />
              </div>
            </motion.div>
          ) : (
            /* ---------- MOBILE: half wheel ---------- */
            <motion.div
              className="relative z-[1] w-[min(96vw,26rem)] pb-1"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            >
              <svg viewBox={`0 0 ${g.vbW} ${g.vbH}`} className="h-auto w-full">
                <defs>
                  <radialGradient id="wheelHub" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#26344f" stopOpacity={0.92} />
                    <stop offset="100%" stopColor="#070d1c" stopOpacity={0.98} />
                  </radialGradient>
                  <filter id="wheelGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="5" />
                  </filter>
                </defs>

                <circle cx={g.cx} cy={g.cy} r={g.rOut + 8} fill="none" stroke="#aebccd" strokeOpacity={0.15} />
                <circle cx={g.cx} cy={g.cy} r={g.rIn - 8} fill="none" stroke="#aebccd" strokeOpacity={0.15} />

                {sections.map((section, i) => {
                  const center = g.base + (i + 0.5) * g.slot;
                  const a0 = g.base + i * g.slot + GAP / 2;
                  const a1 = g.base + (i + 1) * g.slot - GAP / 2;
                  const isHover = hover === i;
                  const isCurrent = currentIndex === i;
                  const [ix, iy] = polar(g.rMid, center);
                  const [dx, dy] = polar(g.rOut - 14, center);
                  const Icon = ICONS[section.key];
                  return (
                    <g
                      key={section.key}
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={() => {
                        play('hover');
                        setHover(i);
                      }}
                      onClick={() => navigate(i)}
                      tabIndex={0}
                      onFocus={() => setHover(i)}
                      role="link"
                      aria-label={t(section.key)}
                    >
                      {isHover && (
                        <path d={wedgePath(a0, a1)} fill="#4fc3d6" opacity={0.26} filter="url(#wheelGlow)" />
                      )}
                      <path
                        d={wedgePath(a0, a1)}
                        fill={isHover ? 'rgba(79,195,214,0.20)' : 'rgba(40,56,92,0.18)'}
                        stroke={isHover ? '#7ee0ee' : isCurrent ? '#4fc3d6' : 'rgba(174,188,205,0.35)'}
                        strokeWidth={isHover ? 2 : 1}
                        className="transition-colors"
                      />
                      {isCurrent && <circle cx={dx} cy={dy} r={2.6} fill="#4fc3d6" />}
                      <g transform={`translate(${ix} ${iy})`}>
                        <g style={{ color: isHover ? '#7ee0ee' : '#aebccd' }}>
                          <Icon x={-13} y={-22} width={26} height={26} />
                        </g>
                        <text
                          x={0}
                          y={20}
                          textAnchor="middle"
                          fontFamily="var(--font-body), sans-serif"
                          fontSize={13}
                          fontWeight={isHover ? 700 : 400}
                          fill={isHover ? '#ffffff' : '#9aa6b8'}
                        >
                          {t(section.key)}
                        </text>
                      </g>
                    </g>
                  );
                })}

                {/* hub */}
                <circle cx={g.cx} cy={g.cy} r={g.rIn - 10} fill="url(#wheelHub)" stroke="#aebccd" strokeOpacity={0.4} />
                <text
                  x={g.cx}
                  y={g.cy - 30}
                  textAnchor="middle"
                  fontFamily="var(--font-display), sans-serif"
                  fontSize={18}
                  letterSpacing={0.5}
                  fill="#eef1f6"
                >
                  {hoveredKey ? t(hoveredKey) : t('menu')}
                </text>
                <text
                  x={g.cx}
                  y={g.cy - 14}
                  textAnchor="middle"
                  fontFamily="var(--font-body), sans-serif"
                  fontSize={7.5}
                  letterSpacing={1}
                  fill="#8b95a6"
                >
                  {t('wheelHint')}
                </text>
              </svg>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
