'use client';

import { useState } from 'react';

export interface JourneyItem {
  title: string;
  org: string;
  tag: string;
  photo?: string;
  photoLogo?: boolean;
  period: string;
  lines: string[];
}

// Timeline of expandable cards: photo column, title/tag/org/period header,
// and a checklist of what was delivered. Several entries can stay open.
export default function QuestLog({ items }: { items: JourneyItem[] }) {
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]));
  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <div className="ql">
      {items.map((item, i) => {
        const isOpen = open.has(i);
        const panelId = `journey-${i}`;
        return (
          <div key={`${item.org}-${i}`} className={`q${isOpen ? ' open' : ''}`}>
            <span className="qpin" aria-hidden="true" />
            <div className="qcard">
              {item.photo && (
                <div className={`qphoto${item.photoLogo ? ' logo' : ''}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.photo} alt={item.org} loading="lazy" />
                </div>
              )}
              <div className="qbody">
                <button
                  type="button"
                  className="qhead"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(i)}
                >
                  <span className="tx">
                    <span className="row1">
                      <h3>{item.title}</h3>
                      <span className="qtag">{item.tag}</span>
                    </span>
                    <span className="qorg">{item.org}</span>
                    <span className="qper">{item.period}</span>
                  </span>
                  <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                <div className="qmore" id={panelId}>
                  <div>
                    <ul>
                      {item.lines.map((line) => (
                        <li key={line}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
