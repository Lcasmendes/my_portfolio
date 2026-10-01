'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

const GLYPHS = '01#%/<>=*+';

// Spread each letter's switch point over (0.15, 0.86) in a shuffled order so
// the word decodes letter by letter instead of left to right. The lower bound
// keeps every letter clean at the very top of the page.
const thresholds = (n: number) =>
  Array.from({ length: n }, (_, i) => 0.15 + ((((i * 5) % n) + 0.5) / n) * 0.75);

/**
 * Editorial poster hero. The section is pinned while the visitor scrolls
 * through it: the giant word decodes from FROM to TO, the layers drift at
 * different depths and follow the pointer. Only then does the page move on.
 * DOM updates are done imperatively from a rAF loop to keep scrolling smooth.
 */
export default function HeroPoster() {
  const t = useTranslations('hero');
  const from = t('wordFrom');
  const to = t('wordTo');
  const stack = t.raw('stack') as string[];
  const slots = Math.max(from.length, to.length);

  const pinRef = useRef<HTMLDivElement>(null);
  const posterRef = useRef<HTMLElement>(null);
  const meterBar = useRef<HTMLElement>(null);
  const meterDot = useRef<HTMLElement>(null);

  useEffect(() => {
    const pin = pinRef.current;
    const poster = posterRef.current;
    if (!pin || !poster) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(hover: hover)').matches && !reduce;
    const words = [...poster.querySelectorAll<HTMLElement>('.bigword')];
    const sets = words.map((w) => [...w.querySelectorAll<HTMLElement>('span')]);
    const layers = [...poster.querySelectorAll<HTMLElement>('.layer[data-depth]')];
    const thr = thresholds(slots);

    // 0 at the top of the pin, 1 once the pinned stretch has been scrolled through.
    const progress = () => {
      const run = pin.offsetHeight - poster.offsetHeight;
      const stuck = pin.getBoundingClientRect().top - parseFloat(getComputedStyle(poster).top);
      return run > 0 ? Math.min(1, Math.max(0, -stuck / run)) : 1;
    };

    let lastT = -1;
    const morph = (p: number) => {
      const tt = Math.min(1, Math.max(0, (p - 0.06) / 0.82)); // hold each word briefly at both ends
      if (Math.abs(tt - lastT) < 0.003 && tt !== 0 && tt !== 1) return;
      lastT = tt;
      sets.forEach((spans) =>
        spans.forEach((sp, i) => {
          const visible = i < to.length || (i < from.length && thr[i] > tt);
          sp.hidden = !visible;
          if (!visible) return;
          const k = thr[i];
          let ch: string;
          let cls = '';
          if (tt >= k + 0.12 && i < to.length) {
            ch = to[i];
            cls = 'to';
          } else if (tt > k - 0.1 && tt < k + 0.12) {
            ch = GLYPHS[(i * 7 + Math.floor(tt * 60)) % GLYPHS.length];
            cls = 'glitch';
          } else {
            ch = from[i] ?? to[i];
          }
          if (sp.textContent !== ch) sp.textContent = ch;
          sp.className = cls;
        }),
      );
      const pct = `${tt * 100}%`;
      if (meterBar.current) meterBar.current.style.width = pct;
      if (meterDot.current) meterDot.current.style.left = pct;
    };

    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let raf = 0;
    const render = () => {
      raf = 0;
      const p = progress();
      morph(p);
      if (reduce) return;
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      layers.forEach((l) => {
        const d = Number(l.dataset.depth);
        const m = Number(l.dataset.mx);
        l.style.transform = `translate3d(${cx * m}px, ${-p * d * 110 + cy * m * 0.5}px, 0)`;
      });
      if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) raf = requestAnimationFrame(render);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };
    const onMove = (e: PointerEvent) => {
      const r = poster.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5;
      ty = (e.clientY - r.top) / r.height - 0.5;
      kick();
    };
    const onLeave = () => {
      tx = ty = 0;
      kick();
    };

    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', kick);
    if (fine) {
      poster.addEventListener('pointermove', onMove);
      poster.addEventListener('pointerleave', onLeave);
    }
    // Stop the load-in animation so letters dropping back in don't replay it.
    const settle = window.setTimeout(() => words.forEach((w) => w.classList.add('settled')), 1400);
    render();

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(settle);
      window.removeEventListener('scroll', kick);
      window.removeEventListener('resize', kick);
      poster.removeEventListener('pointermove', onMove);
      poster.removeEventListener('pointerleave', onLeave);
    };
  }, [from, to, slots]);

  const letters = Array.from({ length: slots }, (_, i) => from[i] ?? '');

  return (
    <div className="pin" ref={pinRef}>
      <section className="poster" id="top" ref={posterRef} aria-label={t('wordLabel')}>
        <div className="layer" data-depth="0.45" data-mx="-16">
          <h1 className="bigword" aria-label={t('wordLabel')}>
            {letters.map((c, i) => (
              <span key={i} aria-hidden="true">
                {c}
              </span>
            ))}
          </h1>
        </div>

        <div className="layer" data-depth="0.12" data-mx="10">
          <div className="frame">
            <i className="bg" />
            <i className="bg" />
            <i className="bg" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/hero/me-cut.webp" alt={t('photoAlt')} fetchPriority="high" />
          </div>
        </div>

        {/* Outline copy of the word, drawn over the photo windows. */}
        <div className="layer" data-depth="0.45" data-mx="-16" aria-hidden="true">
          <div className="bigword bigword-outline">
            {letters.map((c, i) => (
              <span key={i}>{c}</span>
            ))}
          </div>
        </div>

        <div className="layer thirds" aria-hidden="true" />
        <div className="layer" data-depth="0.3" data-mx="22" aria-hidden="true">
          <div className="orbit" />
        </div>

        <div className="layer" data-depth="0" data-mx="0">
          <div className="mc tl">
            <b>Lucas Silva Mendes</b>
            {t('role')}
            <br />
            {t('cities')}
          </div>
          <div className="mc tr">{t('focus')}</div>
          <div className="mc ml">
            {stack.map((s) => (
              <span key={s}>
                {s}
                <br />
              </span>
            ))}
            <hr />
          </div>
          <div className="mc mr">
            <div className="meter" aria-hidden="true">
              <div className="ends">
                <span>{t('meterFrom')}</span>
                <span>{t('meterTo')}</span>
              </div>
              <div className="track">
                <b ref={meterBar} />
                <i ref={meterDot} />
              </div>
              <small>{t('meterHint')}</small>
            </div>
            <span className="av">
              <i />
              {t('available')}
            </span>
          </div>
          <div className="mc bl">
            {t('degree')}
            <span className="yr">{t('year')}</span>
          </div>
          <a className="down" href="#projects">
            {t('scroll')}
          </a>
        </div>
      </section>
    </div>
  );
}
