'use client';

import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { profile } from '@/data/profile';

// Immersive, full-bleed editorial hero. Content sits directly on a treated
// background image (no panels). As the user scrolls, the text layers slide
// up and fade one after another, clearing the way to the section below.
export default function HeroLanding() {
  const t = useTranslations('about');
  const tMeta = useTranslations('meta');
  const tNav = useTranslations('nav');
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // 0 when the hero pins to the top, 1 just before it unpins.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  // Each text block slides up + fades across its own scroll window, so they
  // leave the screen one after another. Scroll-linked (not autoplay), so it
  // stays on even under reduced-motion — we just shorten the travel there.
  const travel = reduce ? -70 : -240;
  const useExit = (
    start: number,
    end: number,
  ): { y: MotionValue<number>; opacity: MotionValue<number> } => {
    const y = useTransform(scrollYProgress, [start, end], [0, travel]);
    const opacity = useTransform(scrollYProgress, [start, end], [1, 0]);
    return { y, opacity };
  };

  // The header (nav) is the last thing to leave — it stays available the
  // longest, then slides away just before the hero unpins.
  const kicker = useExit(0.04, 0.2);
  const line1 = useExit(0.12, 0.3);
  const line2 = useExit(0.22, 0.4);
  const lead = useExit(0.32, 0.52);
  const labels = useExit(0.44, 0.64);
  const header = useExit(0.64, 0.86);

  // Background slowly darkens + drifts as you scroll through the hero.
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const bgDim = useTransform(scrollYProgress, [0, 0.85], [0.28, 0.72]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);

  const layer = (e: { y: MotionValue<number>; opacity: MotionValue<number> }) => ({
    y: e.y,
    opacity: e.opacity,
  });

  return (
    <section
      ref={ref}
      className="relative left-1/2 right-1/2 -mt-[clamp(2rem,5vh,4rem)] w-screen -translate-x-1/2 min-h-[170vh]"
      aria-label={tMeta('role')}
    >
      <div className="sticky top-0 flex h-screen w-full flex-col overflow-hidden">
        {/* ---- Background image + high-contrast teal treatment ---- */}
        <motion.div
          aria-hidden
          className="absolute inset-0"
          style={{ scale: reduce ? 1 : bgScale }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero/workspace.jpg"
            alt=""
            className="h-full w-full object-cover object-center"
            style={{ filter: 'saturate(0.5) contrast(1.2) brightness(0.95)' }}
          />
          {/* teal duotone — recolours the screen toward the brand cyan */}
          <span
            className="absolute inset-0"
            style={{
              backgroundColor: 'rgba(79,195,214,0.55)',
              mixBlendMode: 'color',
            }}
          />
        </motion.div>
        {/* dark wash that deepens on scroll */}
        <motion.div
          aria-hidden
          className="absolute inset-0 bg-abyss"
          style={{ opacity: reduce ? 0.4 : bgDim }}
        />
        {/* teal aura + left-side legibility gradient + vignette */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(75% 95% at 16% 42%, rgba(79,195,214,0.2), transparent 60%),' +
              'linear-gradient(90deg, rgba(10,17,36,0.95) 0%, rgba(10,17,36,0.55) 45%, rgba(10,17,36,0.3) 100%),' +
              'linear-gradient(0deg, rgba(10,17,36,0.96) 0%, transparent 38%)',
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ boxShadow: 'inset 0 0 240px 60px rgba(7,12,28,0.8)' }}
        />

        {/* ---- Overlaid content (no boxes) ---- */}
        <div className="relative z-10 flex h-full flex-col justify-between px-[clamp(1.5rem,5vw,5rem)] py-[clamp(1.5rem,4vh,3rem)]">
          {/* HEADER strip */}
          <motion.header
            style={layer(header)}
            className="flex items-center justify-between gap-4"
          >
            <span className="font-display text-sm font-medium uppercase tracking-widest2 text-frost-bright sm:text-base">
              {tMeta('name')}
            </span>
            <nav className="flex items-center gap-5 text-[0.7rem] uppercase tracking-widest2 text-frost-soft sm:gap-7 sm:text-xs">
              <Link
                href="/projects"
                className="hidden transition-colors hover:text-accent-bright md:inline"
              >
                {tNav('projects')}
              </Link>
              <Link
                href="/journey"
                className="hidden transition-colors hover:text-accent-bright md:inline"
              >
                {tNav('journey')}
              </Link>
              <Link
                href="/skills"
                className="hidden transition-colors hover:text-accent-bright lg:inline"
              >
                {tNav('skills')}
              </Link>
              <span className="hidden h-3 w-px bg-frost/30 md:inline-block" />
              <a
                href={profile.github.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-accent-bright"
              >
                GitHub
              </a>
              <a
                href={profile.linkedin.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-accent-bright"
              >
                LinkedIn
              </a>
            </nav>
          </motion.header>

          {/* MIDDLE — headline (left) + lead paragraph (center-right) */}
          <div className="relative flex-1">
            <div className="absolute left-0 top-1/2 -translate-y-1/2">
              <motion.p
                style={layer(kicker)}
                className="mb-4 text-xs uppercase tracking-widest2 text-accent sm:text-sm"
              >
                {tMeta('tagline')}
              </motion.p>
              <h1 className="font-display font-medium leading-[0.92] text-frost-bright">
                <motion.span
                  style={layer(line1)}
                  className="block text-[clamp(2.75rem,11vw,9rem)]"
                >
                  {t('heroLine1')}
                </motion.span>
                <motion.span
                  style={layer(line2)}
                  className="block text-[clamp(2.75rem,11vw,9rem)] text-accent-bright"
                >
                  {t('heroLine2')}
                </motion.span>
              </h1>
            </div>

            <motion.p
              style={layer(lead)}
              className="absolute right-0 top-[62%] max-w-xs text-sm leading-relaxed text-frost-soft/90 sm:max-w-sm sm:text-base lg:right-[4%]"
            >
              {t('heroLead')}
              <Link
                href="/projects"
                className="mt-4 inline-flex items-center gap-1.5 font-medium text-accent-bright transition-colors hover:text-accent"
              >
                {t('ctaProjects')}
                <ArrowUpRight size={16} />
              </Link>
            </motion.p>
          </div>

          {/* BOTTOM corners — labels */}
          <motion.div
            style={layer(labels)}
            className="flex items-end justify-between gap-4"
          >
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-[0.7rem] uppercase tracking-widest2 text-frost-soft sm:text-xs">
                {tMeta('available')}
              </span>
            </div>
            <span className="text-right text-[0.7rem] uppercase tracking-widest2 text-frost-dim sm:text-xs">
              {t('heroLocation')}
            </span>
          </motion.div>
        </div>

        {/* scroll cue */}
        <motion.div
          style={{ opacity: reduce ? 1 : cueOpacity }}
          className="pointer-events-none absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-1 text-frost-dim sm:flex"
        >
          <span className="text-[0.6rem] uppercase tracking-widest2">
            {t('scrollHint')}
          </span>
          <ArrowDown size={16} className="animate-bounce text-accent" />
        </motion.div>
      </div>
    </section>
  );
}
