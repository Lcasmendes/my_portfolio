'use client';

import { useEffect, useState, useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

const SECTIONS = ['projects', 'skills', 'journey', 'contact'] as const;
const clockFmt = new Intl.DateTimeFormat('pt-BR', {
  timeZone: 'America/Sao_Paulo',
  hour: '2-digit',
  minute: '2-digit',
});

export default function SiteHeader() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [current, setCurrent] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [clock, setClock] = useState('--:--');

  // Local time in Brazil, refreshed every 15 s.
  useEffect(() => {
    const tick = () => setClock(clockFmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);

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
          <span className="mk">LM</span>Lucas Mendes
        </a>
        <nav className="nav" aria-label={t('menu')}>
          {links.map((l) => (
            <a key={l.id} href={l.href} className={current === l.id ? 'cur' : undefined}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="right">
          <span className="clock">{clock} BRT</span>
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
