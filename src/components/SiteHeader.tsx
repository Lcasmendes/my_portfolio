'use client';

import { useEffect, useState, useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { profile } from '@/data/profile';

const SECTIONS = ['projects', 'skills', 'journey', 'contact'] as const;

const SOCIALS = [
  {
    label: 'GitHub',
    href: profile.github.href,
    path: 'M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.1-.4-.6-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.6 18.3 5 18.3 5c.7 1.6.2 2.8.1 3.2.8.8 1.3 1.9 1.3 3.1 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3',
  },
  {
    label: 'LinkedIn',
    href: profile.linkedin.href,
    path: 'M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z',
  },
] as const;

export default function SiteHeader() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [current, setCurrent] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Highlight the section currently in the middle of the viewport.
  useEffect(() => {
    const els = SECTIONS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setCurrent(e.target.id);
        }),
      { rootMargin: '-40% 0px -55% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  const switchTo = (next: string) => {
    if (next === locale) return;
    startTransition(() => router.replace(pathname, { locale: next }));
  };

  const links = SECTIONS.map((id) => ({ id, href: `/${locale}#${id}`, label: t(id) }));

  return (
    <header className="top">
      <div className="wrap">
        <a className="brand" href={`/${locale}`}>
          <span className="mk">LM</span>
          <span className="bn">Lucas Mendes</span>
        </a>
        <nav className="nav" aria-label={t('menu')}>
          {links.map((l) => (
            <a key={l.id} href={l.href} className={current === l.id ? 'cur' : undefined}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="right">
          <div className="social">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                title={s.label}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
          <div className="lang">
            {routing.locales.map((loc) => (
              <button
                key={loc}
                type="button"
                disabled={isPending}
                aria-current={loc === locale}
                onClick={() => switchTo(loc)}
              >
                {loc.toUpperCase()}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="menu-btn"
            aria-expanded={menuOpen}
            aria-controls="menu-panel"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? t('close') : t('menu')}
          </button>
        </div>
      </div>
      <nav className="menu-panel" id="menu-panel" hidden={!menuOpen} aria-label={t('menu')}>
        {links.map((l) => (
          <a key={l.id} href={l.href} onClick={() => setMenuOpen(false)}>
            {l.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
