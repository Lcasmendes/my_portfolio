'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

export interface JourneyItem {
  title: string;
  org: string;
  tag: string;
  logo?: string;
  photo?: string;
  photoLogo?: boolean;
  period: string;
  lines: string[];
}

interface QuestLogProps {
  items: JourneyItem[];
  currentLabel: string;
}

export default function QuestLog({ items, currentLabel }: QuestLogProps) {
  // Independent toggles so several entries can stay open at once.
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]));
  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <div className="relative pl-7 sm:pl-9">
      {/* timeline spine */}
      <div className="absolute bottom-2 left-[10px] top-2 w-px bg-frost-line opacity-40 sm:left-[14px]" />

      <div className="space-y-4">
        {items.map((item, i) => {
          const isCurrent = item.period.includes(currentLabel);
          const isOpen = open.has(i);
          return (
            <div key={`${item.org}-${i}`} className="relative">
              {/* node on the spine */}
              <span
                className={`absolute -left-7 top-4 z-10 flex h-5 w-5 items-center justify-center sm:-left-9 ${
                  isOpen ? 'scale-110' : ''
                } transition-transform`}
              >
                <span
                  className={`h-2.5 w-2.5 rotate-45 border ${
                    isOpen || isCurrent
                      ? 'border-accent bg-accent shadow-glow-accent-strong'
                      : 'border-frost/50 bg-midnight'
                  }`}
                />
                {(isOpen || isCurrent) && (
                  <motion.span
                    className="absolute h-5 w-5 rounded-full bg-accent/40 blur-sm"
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 2.4, repeat: Infinity }}
                  />
                )}
              </span>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.06 * i }}
                className={`hud-panel flex flex-col overflow-hidden transition-colors sm:flex-row ${
                  isOpen ? 'border-frost/40' : ''
                }`}
              >
                {/* ---- Photo column — covers ~1/3 of the card ---- */}
                {item.photo && (
                  /* Full-width banner on mobile (top), 1/3 side column on desktop */
                  <div className="relative h-36 w-full shrink-0 overflow-hidden sm:h-auto sm:w-1/3 sm:self-stretch">
                    {item.photoLogo ? (
                      <div
                        className="flex h-full w-full items-center justify-center p-4"
                        style={{
                          backgroundImage:
                            'radial-gradient(circle at 35% 30%, rgba(79,195,214,0.18), transparent 60%), linear-gradient(150deg, #15294d 0%, #0a1124 100%)',
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.photo}
                          alt={item.org}
                          className="max-h-[70%] max-w-[60%] object-contain sm:max-w-[80%]"
                        />
                      </div>
                    ) : (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.photo}
                          alt={item.org}
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                        {/* darken bottom for cohesion */}
                        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-abyss/55 via-transparent to-transparent" />
                      </>
                    )}
                    {/* edge fade into the card body — bottom on mobile, right on desktop */}
                    <span className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-abyss/70 to-transparent sm:inset-y-0 sm:left-auto sm:right-0 sm:h-auto sm:w-10 sm:bg-gradient-to-r sm:from-transparent sm:to-abyss/70" />
                    {/* live accent rail on the current entry — top on mobile, left on desktop */}
                    {isCurrent && (
                      <span className="pointer-events-none absolute left-0 top-0 h-0.5 w-full bg-accent shadow-glow-accent sm:h-full sm:w-0.5" />
                    )}
                  </div>
                )}

                {/* ---- Content column ---- */}
                <div className="min-w-0 flex-1">
                  {/* header (toggle) */}
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-start gap-3 p-4 text-left sm:p-5"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-display text-base tracking-wide text-white sm:text-lg">
                          {item.title}
                        </h2>
                        <span className="rounded-sm border border-frost/20 bg-frost/5 px-1.5 py-0.5 text-[0.6rem] uppercase tracking-widest text-frost-dim">
                          {item.tag}
                        </span>
                        {isCurrent && (
                          <span className="flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[0.6rem] uppercase tracking-widest text-accent-bright">
                            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-glow" />
                            {currentLabel}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm text-frost">{item.org}</p>
                      <p className="mt-0.5 text-xs tracking-wide text-frost-dim">
                        {item.period}
                      </p>
                    </div>
                    <ChevronDown
                      size={20}
                      className={`mt-1 shrink-0 text-frost-dim transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-accent' : ''
                      }`}
                    />
                  </button>

                  {/* expandable detail */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-5 sm:px-5">
                          <ul className="space-y-2.5">
                            {item.lines.map((line, j) => (
                              <motion.li
                                key={j}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.05 * j }}
                                className="flex gap-2.5 text-sm leading-relaxed text-frost-soft/90"
                              >
                                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-accent/40 bg-accent/10 text-accent">
                                  <Check size={11} />
                                </span>
                                <span>{line}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
