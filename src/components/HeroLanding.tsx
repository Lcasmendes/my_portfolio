'use client';

import {
  motion,
  useReducedMotion,
  type Variants,
} from 'framer-motion';
import { ArrowUpRight, Github, Linkedin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { profile } from '@/data/profile';

// Editorial hero, layout estático (sem scroll-pin/parallax de imagem de fundo).
// A foto ocupa a altura inteira da section, de ponta a ponta (inclusive a
// faixa onde ficaria o header) — por isso o "header" não é mais uma linha
// única no topo: nome + redes ficam presos ao topo da coluna esquerda, e a
// navegação (Projetos/Trajetória/Habilidades) ao topo da coluna direita,
// nos dois vãos que sobram ao lado da imagem.
export default function HeroLanding() {
  const t = useTranslations('about');
  const tMeta = useTranslations('meta');
  const tNav = useTranslations('nav');
  const reduce = useReducedMotion();

  const fromSide = (dir: 'left' | 'right', delay = 0): Variants => ({
    hidden: { opacity: 0, x: reduce ? 0 : dir === 'left' ? -32 : 32 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
    },
  });

  const fadeUp = (delay = 0): Variants => ({
    hidden: { opacity: 0, y: reduce ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
    },
  });

  return (
    <section
      className="relative left-1/2 right-1/2 -mt-[clamp(2rem,5vh,4rem)] h-dvh w-screen -translate-x-1/2 overflow-hidden bg-abyss"
      aria-label={tMeta('role')}
    >
      {/* atmosfera sutil — glow radial na mesma paleta, fundo continua chapado */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 55% at 82% 18%, rgba(79,195,214,0.16), transparent 65%),' +
            'radial-gradient(45% 40% at 8% 92%, rgba(79,195,214,0.10), transparent 70%)',
        }}
      />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1440px] flex-col px-[clamp(1.5rem,5vw,5rem)] pb-[clamp(0.75rem,2.5vh,1.5rem)] pt-0">
        <div className="flex min-h-0 flex-1 flex-col gap-4 sm:gap-6 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-10">
          {/* Coluna esquerda — nome+redes no topo, tagline/título no meio */}
          <div className="order-2 flex min-h-0 flex-col text-center lg:order-1 lg:text-right">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fromSide('left', 0)}
              className="flex items-center justify-center gap-3 pb-2 pt-[clamp(0.75rem,2.5vh,1.25rem)] lg:justify-end"
            >
              <span className="font-display text-xs font-medium uppercase tracking-widest2 text-frost-bright sm:text-sm">
                {tMeta('name')}
              </span>
              <span className="h-3 w-px bg-frost/20" />
              <a
                href={profile.github.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-frost-soft transition-colors hover:text-accent-bright"
              >
                <Github size={15} />
              </a>
              <a
                href={profile.linkedin.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-frost-soft transition-colors hover:text-accent-bright"
              >
                <Linkedin size={15} />
              </a>
            </motion.div>

            <div className="flex min-h-0 flex-1 flex-col justify-center">
              <motion.p
                initial="hidden"
                animate="visible"
                variants={fromSide('left', 0.9)}
                className="mb-2 text-xs uppercase tracking-widest2 text-accent sm:mb-3 sm:text-sm"
              >
                {tMeta('tagline')}
              </motion.p>

              <motion.h1
                initial="hidden"
                animate="visible"
                variants={fromSide('left', 1.0)}
                className="font-display text-[clamp(1.5rem,min(5.5vw,6.5vh),4.25rem)] font-medium leading-[0.95] text-frost-bright"
              >
                {t('heroLine1')}
              </motion.h1>
            </div>
          </div>

          {/* Foto — centro, de ponta a ponta (atravessa a faixa do header) */}
          <motion.div
            initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            transition={{ duration: reduce ? 0 : 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="order-1 mx-auto min-h-0 w-full max-w-md flex-1 lg:order-2 lg:h-full lg:min-h-0 lg:w-[32vw] lg:max-w-lg lg:flex-none"
          >
            <div className="relative h-full w-full overflow-hidden rounded-t-none rounded-b-[999px] bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/hero/me.jpg"
                alt={tMeta('name')}
                className="h-full w-full object-contain object-bottom"
              />
            </div>
          </motion.div>

          {/* Coluna direita — navegação no topo, título/lead/cta no meio */}
          <div className="order-3 flex min-h-0 flex-col text-center lg:text-left">
            <motion.nav
              initial="hidden"
              animate="visible"
              variants={fromSide('right', 0)}
              className="flex items-center justify-center gap-4 pb-2 pt-[clamp(0.75rem,2.5vh,1.25rem)] text-[0.65rem] uppercase tracking-widest2 text-frost-soft sm:gap-6 sm:text-[0.7rem] lg:justify-start"
            >
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
            </motion.nav>

            <div className="flex min-h-0 flex-1 flex-col justify-center">
              <motion.p
                initial="hidden"
                animate="visible"
                variants={fromSide('right', 1.0)}
                className="font-display text-[clamp(1.5rem,min(5.5vw,6.5vh),4.25rem)] font-medium leading-[0.95] text-accent-bright"
              >
                {t('heroLine2')}
              </motion.p>

              <motion.p
                initial="hidden"
                animate="visible"
                variants={fromSide('right', 1.1)}
                className="mx-auto mt-3 line-clamp-4 max-w-sm text-sm leading-relaxed text-frost-soft/90 sm:mt-4 sm:text-base lg:mx-0"
              >
                {t('heroLead')}
              </motion.p>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={fromSide('right', 1.2)}
                className="mt-4 flex justify-center sm:mt-6 lg:justify-start"
              >
                <Link
                  href="/projects"
                  className="group inline-flex items-center gap-3 text-xs font-medium uppercase tracking-widest2 text-frost-bright transition-colors hover:text-accent-bright"
                >
                  {t('ctaProjects')}
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-frost/30 transition-colors group-hover:border-accent-bright group-hover:text-accent-bright">
                    <ArrowUpRight size={16} />
                  </span>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>

        {/* BOTTOM — status + localização */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp(1.3)}
          className="flex items-end justify-between gap-4 border-t border-frost/10 pt-3 sm:pt-4"
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
    </section>
  );
}