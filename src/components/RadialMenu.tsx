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

  // Half wheel on mobile, full wheel on desktop.
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

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        play('hover');
        setHover((h) => (h + 1) % n);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        play('hover');
        setHover((h) => (h - 1 + n) % n);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        navigate(hover);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, hover, n, navigate, onClose, play]);

  useEffect(() => {
    if (open) document.body.dataset.radialOpen = 'true';
    else delete document.body.dataset.radialOpen;
    return () => {
      delete document.body.dataset.radialOpen;
    };
  }, [open]);

  // Geometry
  const g = half
    ? { vbW: 440, vbH: 256, cx: 220, cy: 238, rOut: 196, rIn: 80, rMid: 138, base: Math.PI, slot: Math.PI / n }
    : { vbW: 440, vbH: 440, cx: 220, cy: 220, rOut: 196, rIn: 84, rMid: 140, base: (-3 * Math.PI) / 4, slot: (2 * Math.PI) / n };

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
            className="absolute inset-0 bg-abyss/45 backdrop-blur-sm"
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

          {/* wheel */}
          <motion.div
            className={half ? 'relative w-[min(96vw,26rem)] pb-1' : 'relative w-[min(86vw,30rem)]'}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          >
            <svg viewBox={`0 0 ${g.vbW} ${g.vbH}`} className="h-auto w-full">
              <defs>
                <radialGradient id="wheelHub" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#2a3a56" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="#0a1124" stopOpacity={0.55} />
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
                      <path d={wedgePath(a0, a1)} fill="#aebccd" opacity={0.22} filter="url(#wheelGlow)" />
                    )}
                    <path
                      d={wedgePath(a0, a1)}
                      fill={isHover ? 'rgba(120,155,205,0.22)' : 'rgba(40,56,92,0.18)'}
                      stroke={isHover ? '#eef1f6' : isCurrent ? '#aebccd' : 'rgba(174,188,205,0.35)'}
                      strokeWidth={isHover ? 2 : 1}
                      className="transition-colors"
                    />
                    {isCurrent && <circle cx={dx} cy={dy} r={2.6} fill="#aebccd" />}
                    <g transform={`translate(${ix} ${iy})`}>
                      <g style={{ color: isHover ? '#ffffff' : '#aebccd' }}>
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
                y={half ? g.cy - 30 : g.cy - 5}
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
                y={half ? g.cy - 14 : g.cy + 15}
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
