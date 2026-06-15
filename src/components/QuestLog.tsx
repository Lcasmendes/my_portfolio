'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

export interface JourneyItem {
  title: string;
  org: string;
  tag: string;
  logo?: string;
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
                className={`absolute -left-7 top-4 flex h-5 w-5 items-center justify-center sm:-left-9 ${
                  isOpen ? 'scale-110' : ''
                } transition-transform`}
              >
                <span
                  className={`h-2.5 w-2.5 rotate-45 border ${
                    isOpen || isCurrent
                      ? 'border-frost bg-frost shadow-glow-strong'
                      : 'border-frost/50 bg-midnight'
                  }`}
                />
                {(isOpen || isCurrent) && (
                  <motion.span
                    className="absolute h-5 w-5 rounded-full bg-frost/30 blur-sm"
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 2.4, repeat: Infinity }}
                  />
                )}
              </span>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.06 * i }}
                className={`hud-panel overflow-hidden transition-colors ${
                  isOpen ? 'border-frost/40' : ''
                }`}
              >
                {/* header (toggle) */}
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-4 p-4 text-left sm:p-5"
                >
                  {item.logo && (
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-frost/20 bg-white/95 p-1.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.logo}
                        alt={item.org}
                        className="h-full w-full object-contain"
                      />
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-base tracking-wide text-white sm:text-lg">
                        {item.title}
                      </h2>
                      <span className="rounded-sm border border-frost/20 bg-frost/5 px-1.5 py-0.5 text-[0.6rem] uppercase tracking-widest text-frost-dim">
                        {item.tag}
                      </span>
                      {isCurrent && (
                        <span className="flex items-center gap-1.5 rounded-full border border-frost/30 bg-frost/10 px-2 py-0.5 text-[0.6rem] uppercase tracking-widest text-frost-soft">
                          <span className="h-1.5 w-1.5 rounded-full bg-frost animate-pulse-glow" />
                          {currentLabel}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-frost">{item.org}</p>
                    <p className="mt-0.5 text-xs tracking-wide text-frost-dim">
                      {item.period}
                    </p>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-frost-dim transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-frost' : ''
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
                              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-frost/40 bg-frost/10 text-frost">
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
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
