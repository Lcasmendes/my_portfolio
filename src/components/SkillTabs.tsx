'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';

export interface SkillItem {
  name: string;
  desc: string;
}
export interface SkillCategory {
  name: string;
  icon: string;
  desc: string;
  items: SkillItem[];
}

// Line icons (lucide shapes) keyed by the `icon` field in the message files.
const ICONS: Record<string, ReactNode> = {
  code: <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />,
  shield: (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  cloud: <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />,
  bot: (
    <>
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <path d="M12 7v4M8 16h.01M16 16h.01" />
      <circle cx="12" cy="5" r="2" />
    </>
  ),
  check: (
    <>
      <path d="M21 10.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      <path d="m9 11 3 3L22 4" />
    </>
  ),
  lang: <path d="m5 8 6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6" />,
};

const ICON_PROPS = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

interface Node {
  x: number;
  y: number;
  item: SkillItem;
  side: 'left' | 'right';
}
interface Layout {
  W: number;
  H: number;
  hubX: number;
  hubY: number;
  vertical: boolean;
  nodes: Node[];
}

// Horizontal radial layout on desktop; vertical tree on narrow screens.
function buildLayout(items: SkillItem[], vertical: boolean): Layout {
  const k = items.length;
  if (vertical) {
    const W = 640;
    const hubX = 320;
    const hubY = 80;
    const topY = 200;
    const gap = 110;
    return {
      W,
      H: topY + (k - 1) * gap + 90,
      hubX,
      hubY,
      vertical,
      nodes: items.map((item, i) => {
        const d = i % 2 ? 1 : -1;
        return { x: hubX + d * 140, y: topY + i * gap, item, side: d > 0 ? 'right' : 'left' };
      }),
    };
  }
  const W = 1000;
  const H = 480;
  const CX = W / 2;
  const CY = H / 2;
  const rc = Math.ceil(k / 2);
  const nodes: Node[] = [];
  const place = (arr: SkillItem[], dir: 1 | -1) =>
    arr.forEach((item, j) => {
      const m = arr.length;
      const gy = m > 1 ? Math.min(118, (H - 150) / (m - 1)) : 0;
      nodes.push({
        x: CX + dir * (210 + (j % 2) * 24),
        y: CY + (j - (m - 1) / 2) * gy,
        item,
        side: dir > 0 ? 'right' : 'left',
      });
    });
  place(items.slice(0, rc), 1);
  place(items.slice(rc), -1);
  return { W, H, hubX: CX, hubY: CY, vertical, nodes };
}

const BLUE = '#6ea8dc';

export default function SkillTabs({ categories }: { categories: SkillCategory[] }) {
  const t = useTranslations('skills');
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [locked, setLocked] = useState<number | null>(null);
  const [vertical, setVertical] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setVertical(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const category = categories[active];
  const layout = useMemo(() => buildLayout(category.items, vertical), [category, vertical]);
  const focus = hovered ?? locked;
  const focusItem = focus !== null ? category.items[focus] : null;

  const go = (i: number) => {
    setActive((i + categories.length) % categories.length);
    setHovered(null);
    setLocked(null);
  };

  const ringY = layout.vertical ? layout.H / 2 : layout.hubY;
  const fs = layout.vertical ? 21 : 16;

  return (
    <div>
      <div className="tabbar">
        <button type="button" className="arrowbtn" aria-label={t('prev')} onClick={() => go(active - 1)}>
          <svg width="18" height="18" viewBox="0 0 24 24" {...ICON_PROPS} strokeWidth={1.8}>
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <div
          className="tabs"
          role="tablist"
          aria-label={t('title')}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
              e.preventDefault();
              const next = (active + (e.key === 'ArrowRight' ? 1 : -1) + categories.length) % categories.length;
              go(next);
              document.getElementById(`skill-tab-${next}`)?.focus();
            }
          }}
        >
          {categories.map((c, i) => (
            <button
              key={c.name}
              id={`skill-tab-${i}`}
              type="button"
              role="tab"
              className="tab"
              title={c.name}
              aria-selected={i === active}
              tabIndex={i === active ? 0 : -1}
              onClick={() => go(i)}
            >
              <svg viewBox="0 0 24 24" {...ICON_PROPS}>
                {ICONS[c.icon]}
              </svg>
              <span className="tl">{c.name}</span>
            </button>
          ))}
        </div>
        <button type="button" className="arrowbtn" aria-label={t('next')} onClick={() => go(active + 1)}>
          <svg width="18" height="18" viewBox="0 0 24 24" {...ICON_PROPS} strokeWidth={1.8}>
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className="sk-detail" aria-live="polite">
        <div className="swap" key={`${active}-${focus ?? 'cat'}`}>
          <span className="lbl">
            {focusItem ? category.name : t('areaOf', { n: String(active + 1).padStart(2, '0'), total: categories.length })}
          </span>
          <h3>{focusItem ? focusItem.name : category.name}</h3>
          <p>{focusItem ? focusItem.desc : category.desc}</p>
        </div>
      </div>

      <div className="constellation">
        <svg viewBox={`0 0 ${layout.W} ${layout.H}`} role="img" aria-label={category.name}>
          <circle cx={layout.hubX} cy={ringY} r={230} fill="none" stroke="rgba(150,175,210,0.08)" />
          <circle cx={layout.hubX} cy={ringY} r={150} fill="none" stroke="rgba(150,175,210,0.08)" />
          <rect x={0} y={0} width={layout.W} height={layout.H} fill="transparent" onClick={() => setLocked(null)} />
          {layout.vertical && layout.nodes.length > 0 && (
            <line
              x1={layout.hubX}
              y1={layout.hubY}
              x2={layout.hubX}
              y2={layout.nodes[layout.nodes.length - 1].y}
              stroke="rgba(150,175,210,0.35)"
              strokeWidth={1.2}
            />
          )}

          {layout.nodes.map((n, i) => {
            const mx = (layout.hubX + n.x) / 2;
            const d = layout.vertical
              ? `M ${layout.hubX} ${n.y} L ${n.x} ${n.y}`
              : `M ${layout.hubX} ${layout.hubY} C ${mx} ${layout.hubY}, ${mx} ${n.y}, ${n.x} ${n.y}`;
            const on = focus === i;
            return (
              <path
                key={`e-${i}`}
                d={d}
                fill="none"
                strokeLinecap="round"
                stroke={on ? BLUE : 'rgba(150,175,210,0.35)'}
                strokeWidth={on ? 2 : 1.2}
              />
            );
          })}

          <g transform={`translate(${layout.hubX} ${layout.hubY})`}>
            <circle r={40} fill="none" stroke="rgba(150,175,210,0.3)" strokeDasharray="2 8" />
            <circle r={30} fill="#eef1f6" />
            <g transform="translate(-13 -13) scale(1.0833)" {...ICON_PROPS} stroke="#0a1222">
              {ICONS[category.icon]}
            </g>
          </g>

          {layout.nodes.map((n, i) => {
            const on = focus === i;
            const w = n.item.name.length * fs * 0.56 + 20;
            const rx = n.side === 'right' ? 24 : -(24 + w);
            return (
              <g
                key={`${active}-${n.item.name}`}
                className="node"
                tabIndex={0}
                role="button"
                aria-label={n.item.name}
                aria-pressed={locked === i}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  setLocked((c) => (c === i ? null : i));
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setLocked((c) => (c === i ? null : i));
                  }
                }}
              >
                <g transform={`translate(${n.x} ${n.y})`}>
                  <circle r={26} fill="transparent" />
                  <circle r={14} fill="#0a1222" stroke={on ? BLUE : '#8fa3bf'} strokeWidth={1.5} />
                  <circle r={5} fill={on ? BLUE : '#c3cddb'} />
                  {layout.vertical ? (
                    <text
                      x={0}
                      y={42}
                      textAnchor="middle"
                      fontSize={fs}
                      fill={on ? '#eef1f6' : '#9fb0c6'}
                      fontWeight={on ? 600 : 400}
                    >
                      {n.item.name}
                    </text>
                  ) : (
                    <>
                      <rect
                        x={rx}
                        y={-fs / 2 - 7}
                        width={w}
                        height={fs + 14}
                        rx={7}
                        fill={on ? '#1b2c4f' : 'transparent'}
                      />
                      <text
                        x={n.side === 'right' ? 34 : -34}
                        y={1}
                        textAnchor={n.side === 'right' ? 'start' : 'end'}
                        dominantBaseline="middle"
                        fontSize={fs}
                        fill={on ? '#eef1f6' : '#9fb0c6'}
                        fontWeight={on ? 600 : 400}
                      >
                        {n.item.name}
                      </text>
                    </>
                  )}
                </g>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
