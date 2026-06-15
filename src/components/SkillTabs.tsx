'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSound } from './sound/SoundProvider';
import {
  Code2,
  ShieldCheck,
  Cloud,
  FlaskConical,
  Database,
  Languages,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';

export interface SkillItem {
  name: string;
  desc: string;
}
export interface SkillCategory {
  name: string;
  desc: string;
  items: SkillItem[];
}

interface SkillTabsProps {
  categories: SkillCategory[];
  hint: string;
  prevLabel: string;
  nextLabel: string;
}

// Tab icons, matched to the category order in the message files.
const TAB_ICONS: LucideIcon[] = [
  Code2, // Front-end
  ShieldCheck, // Back-end & Security
  Cloud, // Cloud & Infra
  FlaskConical, // Testing
  Database, // Database
  Languages, // Languages
];

// ---- Constellation layout (one per category) ------------------------------
// Horizontal radial on desktop; vertical tree on mobile (taller, readable).
interface PlacedNode {
  id: string;
  x: number;
  y: number;
  name: string;
  desc: string;
  side: 'left' | 'right';
}

interface Layout {
  W: number;
  H: number;
  hubX: number;
  hubY: number;
  nodes: PlacedNode[];
  vertical: boolean;
  spineBottom: number;
}

function buildLayout(items: SkillItem[], vertical: boolean): Layout {
  const k = items.length;

  if (vertical) {
    const W = 640;
    const hubX = 320;
    const hubY = 92;
    const topY = 210;
    const gap = 116;
    const H = topY + (k - 1) * gap + 120;
    const nodes: PlacedNode[] = items.map((it, i) => {
      const dir = i % 2 === 0 ? -1 : 1;
      return {
        id: `v-${i}`,
        x: hubX + dir * 132,
        y: topY + i * gap,
        name: it.name,
        desc: it.desc,
        side: dir > 0 ? 'right' : 'left',
      };
    });
    return {
      W,
      H,
      hubX,
      hubY,
      nodes,
      vertical: true,
      spineBottom: nodes.length ? nodes[nodes.length - 1].y : hubY,
    };
  }

  const W = 1000;
  const H = 520;
  const CX = W / 2;
  const CY = H / 2;
  const rightCount = Math.ceil(k / 2);
  const rightItems = items.slice(0, rightCount);
  const leftItems = items.slice(rightCount);
  const nodes: PlacedNode[] = [];
  const place = (arr: SkillItem[], dir: 1 | -1) => {
    const m = arr.length;
    arr.forEach((it, j) => {
      const gapY = m > 1 ? Math.min(120, (H - 170) / (m - 1)) : 0;
      const offY = (j - (m - 1) / 2) * gapY;
      const baseX = 200 + (j % 2) * 22;
      nodes.push({
        id: `${dir > 0 ? 'r' : 'l'}-${j}`,
        x: CX + dir * baseX,
        y: CY + offY,
        name: it.name,
        desc: it.desc,
        side: dir > 0 ? 'right' : 'left',
      });
    });
  };
  place(rightItems, 1);
  place(leftItems, -1);
  return { W, H, hubX: CX, hubY: CY, nodes, vertical: false, spineBottom: CY };
}

function edgePath(L: Layout, n: PlacedNode) {
  if (L.vertical) {
    const mx = (L.hubX + n.x) / 2;
    return `M ${L.hubX} ${n.y} C ${mx} ${n.y}, ${mx} ${n.y}, ${n.x} ${n.y}`;
  }
  const mx = (L.hubX + n.x) / 2;
  return `M ${L.hubX} ${L.hubY} C ${mx} ${L.hubY}, ${mx} ${n.y}, ${n.x} ${n.y}`;
}

export default function SkillTabs({
  categories,
  hint,
  prevLabel,
  nextLabel,
}: SkillTabsProps) {
  const { play } = useSound();
  const [activeTab, setActiveTab] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);
  const [locked, setLocked] = useState<string | null>(null);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const u = () => setIsMobile(mq.matches);
    u();
    mq.addEventListener('change', u);
    return () => mq.removeEventListener('change', u);
  }, []);

  const category = categories[activeTab];
  const layout = useMemo(
    () => buildLayout(category.items, isMobile),
    [category, isMobile],
  );
  const nodes = layout.nodes;

  const activeId = hovered ?? locked;
  const activeNode = activeId ? nodes.find((n) => n.id === activeId) ?? null : null;

  const goTo = (i: number) => {
    const next = (i + categories.length) % categories.length;
    play('select');
    setActiveTab(next);
    setHovered(null);
    setLocked(null);
  };

  // Arrow keys switch the active area (yield to the radial menu when it's open).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (document.body.dataset.radialOpen) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goTo(activeTab + 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goTo(activeTab - 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, categories.length]);

  const HubIcon = TAB_ICONS[activeTab] ?? Sparkles;

  return (
    <div className="lg:flex lg:h-full lg:flex-col">
      {/* ---- Tab bar (FFXV Ascension style) ---- */}
      <div className="hud-panel mb-5 flex shrink-0 items-center gap-2 px-2 py-2 lg:mb-4 sm:px-3">
        <button
          type="button"
          aria-label={prevLabel}
          onClick={() => goTo(activeTab - 1)}
          className="shrink-0 rounded-sm p-1.5 text-frost-dim transition hover:bg-white/5 hover:text-frost"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex flex-1 items-center justify-between gap-1" role="tablist">
          {categories.map((cat, i) => {
            const Icon = TAB_ICONS[i] ?? Sparkles;
            const active = i === activeTab;
            return (
              <button
                key={cat.name}
                role="tab"
                aria-selected={active}
                aria-label={cat.name}
                title={cat.name}
                onClick={() => goTo(i)}
                className={`group relative flex flex-1 items-center justify-center rounded-sm px-1 py-2.5 transition-all ${
                  active
                    ? 'text-white'
                    : 'text-frost-dim hover:bg-white/[0.04] hover:text-frost-soft'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="skillTabActive"
                    className="absolute inset-0 rounded-sm border border-frost/40 bg-frost/10 shadow-glow"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <Icon
                  size={22}
                  className={`relative z-10 transition-transform ${
                    active ? 'scale-110' : 'group-hover:scale-105'
                  }`}
                />
                {/* selected indicator chevron */}
                {active && (
                  <motion.span
                    layoutId="skillTabPointer"
                    className="absolute -bottom-[10px] left-1/2 z-10 h-1.5 w-1.5 -translate-x-1/2 rotate-45 bg-frost shadow-glow-strong"
                  />
                )}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          aria-label={nextLabel}
          onClick={() => goTo(activeTab + 1)}
          className="shrink-0 rounded-sm p-1.5 text-frost-dim transition hover:bg-white/5 hover:text-frost"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* ---- Reactive detail header ---- */}
      <div className="hud-panel mb-6 min-h-[112px] shrink-0 px-5 py-4 lg:mb-4">
        <p className="text-[0.65rem] uppercase tracking-widest2 text-frost-dim">
          {activeNode ? category.name : hint}
        </p>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${activeNode?.id ?? 'cat'}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22 }}
          >
            <h2 className="mt-1 font-display text-xl tracking-wide text-white">
              {activeNode ? activeNode.name : category.name}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-frost-soft/90">
              {activeNode ? activeNode.desc : category.desc}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ---- Constellation ---- */}
      <div className="mx-auto w-full max-w-5xl lg:flex lg:min-h-0 lg:flex-1 lg:items-center lg:justify-center">
        <svg
          viewBox={`0 0 ${layout.W} ${layout.H}`}
          className="h-auto w-full lg:h-full lg:max-h-full"
          role="img"
          aria-label={category.name}
        >
          <defs>
            <radialGradient id="hubFill2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#eef1f6" />
              <stop offset="45%" stopColor="#aebccd" />
              <stop offset="100%" stopColor="#243044" />
            </radialGradient>
            <radialGradient id="coreFill2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#d4dbe6" />
              <stop offset="100%" stopColor="#6e7888" />
            </radialGradient>
            <filter id="soft2" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="6" />
            </filter>
          </defs>

          {/* faint ornamental backdrop */}
          <g opacity={0.1} stroke="#aebccd" fill="none">
            <circle cx={layout.hubX} cy={layout.vertical ? layout.H / 2 : layout.hubY} r={230} strokeWidth={1} />
            <circle cx={layout.hubX} cy={layout.vertical ? layout.H / 2 : layout.hubY} r={150} strokeWidth={1} />
          </g>

          <rect
            x={0}
            y={0}
            width={layout.W}
            height={layout.H}
            fill="transparent"
            onClick={() => setLocked(null)}
          />

          {/* tab content fades/re-keys on switch */}
          <motion.g
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
          >
            {/* vertical spine (mobile) */}
            {layout.vertical && (
              <>
                <line
                  x1={layout.hubX}
                  y1={layout.hubY}
                  x2={layout.hubX}
                  y2={layout.spineBottom}
                  stroke="#aebccd"
                  strokeWidth={4}
                  opacity={0.18}
                  filter="url(#soft2)"
                />
                <line
                  x1={layout.hubX}
                  y1={layout.hubY}
                  x2={layout.hubX}
                  y2={layout.spineBottom}
                  stroke="#aebccd"
                  strokeWidth={1.4}
                  opacity={0.5}
                />
              </>
            )}

            {/* edges */}
            {nodes.map((n, i) => {
              const active = activeId === n.id;
              const d = edgePath(layout, n);
              return (
                <g key={`edge-${n.id}`}>
                  <path
                    d={d}
                    fill="none"
                    stroke="#aebccd"
                    strokeWidth={active ? 7 : 4}
                    opacity={active ? 0.5 : 0.18}
                    filter="url(#soft2)"
                  />
                  <motion.path
                    d={d}
                    fill="none"
                    stroke={active ? '#eef1f6' : '#aebccd'}
                    strokeWidth={active ? 2.4 : 1.4}
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: active ? 1 : 0.55 }}
                    transition={{
                      pathLength: { duration: 0.6, delay: 0.1 + i * 0.05 },
                      opacity: { duration: 0.3 },
                    }}
                  />
                </g>
              );
            })}

            {/* central hub */}
            <g transform={`translate(${layout.hubX} ${layout.hubY})`}>
              <motion.circle
                r={42}
                fill="#aebccd"
                filter="url(#soft2)"
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                animate={{ opacity: [0.18, 0.4, 0.18], scale: [0.95, 1.08, 0.95] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.circle
                r={42}
                fill="none"
                stroke="#aebccd"
                strokeWidth={1}
                strokeDasharray="2 10"
                opacity={0.6}
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
              />
              <circle r={34} fill="none" stroke="#eef1f6" strokeWidth={2} opacity={0.85} />
              <circle r={26} fill="url(#hubFill2)" />
              {/* category icon */}
              <HubIcon x={-15} y={-15} width={30} height={30} color="#0a1124" />
            </g>

            {/* skill nodes */}
            {nodes.map((n, i) => {
              const active = activeId === n.id;
              return (
                <motion.g
                  key={n.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.15 + i * 0.06 }}
                  style={{ cursor: 'pointer' }}
                  tabIndex={0}
                  onMouseEnter={() => {
                    play('hover');
                    setHovered(n.id);
                  }}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(n.id)}
                  onBlur={() => setHovered(null)}
                  onClick={() => {
                    play('select');
                    setLocked((c) => (c === n.id ? null : n.id));
                  }}
                >
                  <g transform={`translate(${n.x} ${n.y})`}>
                    {active && (
                      <motion.circle
                        r={22}
                        fill="#aebccd"
                        filter="url(#soft2)"
                        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                        animate={{ opacity: [0.25, 0.6, 0.25], scale: [0.95, 1.15, 0.95] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                    <circle r={26} fill="transparent" />
                    <circle
                      r={15}
                      fill="none"
                      stroke={active ? '#eef1f6' : '#aebccd'}
                      strokeWidth={1.5}
                      opacity={active ? 1 : 0.7}
                    />
                    <circle r={8} fill="url(#coreFill2)" opacity={active ? 1 : 0.85} />
                    <circle r={2.6} fill="#ffffff" />
                    {layout.vertical ? (
                      <text
                        x={0}
                        y={40}
                        textAnchor="middle"
                        fontFamily="var(--font-body), sans-serif"
                        fontSize={22}
                        fontWeight={active ? 700 : 400}
                        fill={active ? '#ffffff' : '#9aa6b8'}
                      >
                        {n.name}
                      </text>
                    ) : (
                      <SkillLabel
                        text={n.name}
                        side={n.side}
                        offset={24}
                        active={active}
                      />
                    )}
                  </g>
                </motion.g>
              );
            })}
          </motion.g>
        </svg>
      </div>
    </div>
  );
}

function SkillLabel({
  text,
  side,
  offset,
  active,
}: {
  text: string;
  side: 'left' | 'right';
  offset: number;
  active: boolean;
}) {
  const fs = 16;
  const dir = side === 'right' ? 1 : -1;
  const w = text.length * fs * 0.6 + 16;
  const rectX = side === 'right' ? offset : -(offset + w);
  return (
    <g>
      <rect
        x={rectX}
        y={-fs / 2 - 6}
        width={w}
        height={fs + 12}
        rx={3}
        fill="#0a1124"
        opacity={active ? 0.85 : 0.5}
        stroke="#aebccd"
        strokeOpacity={active ? 0.45 : 0}
        strokeWidth={1}
      />
      <text
        x={dir * (offset + 8)}
        y={0}
        textAnchor={side === 'right' ? 'start' : 'end'}
        dominantBaseline="middle"
        fontFamily="var(--font-body), sans-serif"
        fontSize={fs}
        fill={active ? '#ffffff' : '#9aa6b8'}
      >
        {text}
      </text>
    </g>
  );
}
