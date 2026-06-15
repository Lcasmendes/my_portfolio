'use client';

import { useEffect, useState } from 'react';
import { Aperture } from 'lucide-react';
import { useTranslations } from 'next-intl';
import RadialMenu from './RadialMenu';
import PageTransition from './PageTransition';
import { useSound } from './sound/SoundProvider';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations('nav');
  const { play } = useSound();
  const [open, setOpen] = useState(false);
  const [atBottom, setAtBottom] = useState(false);

  // Expand the mobile button to a labelled pill once the user reaches the
  // bottom of the page — makes it obvious where to navigate next.
  useEffect(() => {
    const onScroll = () => {
      const reached =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 90;
      setAtBottom(reached);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Press "M" to toggle the wheel (when not typing in a field).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'm' || e.key === 'M') setOpen((o) => !o);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const openMenu = () => {
    play('select');
    setOpen(true);
  };

  return (
    <>
      <main className="px-[clamp(1.25rem,4vw,4rem)] pb-28 pt-[clamp(2rem,5vh,4rem)] md:pb-24">
        <div className="mx-auto w-full max-w-6xl">
          <PageTransition>{children}</PageTransition>
        </div>
      </main>

      {/* Floating menu button — icon-only circle on mobile (bottom-right);
          labelled pill on desktop (bottom-left). */}
      {!open && (
        <button
          type="button"
          onClick={openMenu}
          onMouseEnter={() => play('hover')}
          aria-label={t('open')}
          aria-haspopup="menu"
          className={`group fixed bottom-5 left-1/2 z-40 flex h-14 -translate-x-1/2 items-center justify-center gap-2.5 rounded-full border border-frost/40 bg-midnight/85 text-frost-soft shadow-glow-strong backdrop-blur-md transition-colors hover:border-frost hover:text-frost-bright md:bottom-7 md:left-7 md:w-auto md:translate-x-0 md:px-5 ${
            atBottom ? 'w-auto px-5' : 'w-14'
          }`}
        >
          <span className="pointer-events-none absolute inset-0 rounded-full border border-frost/30 animate-pulse-glow" />
          <Aperture
            size={24}
            className="shrink-0 transition-transform duration-500 group-hover:rotate-90"
          />
          <span
            className={`text-xs uppercase tracking-widest2 md:inline ${
              atBottom ? 'inline' : 'hidden'
            }`}
          >
            {t('menu')}
          </span>
          <kbd className="hidden rounded-sm border border-frost/25 px-1 text-[0.6rem] text-frost-dim md:inline">
            M
          </kbd>
        </button>
      )}

      <RadialMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
