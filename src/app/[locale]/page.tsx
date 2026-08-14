import type { Metadata } from 'next';
import { Check } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import FocusRadar, { type Attribute } from '@/components/FocusRadar';
import ContactCTA from '@/components/ContactCTA';
import HeroLanding from '@/components/HeroLanding';
import { Flourish } from '@/components/Ornament';
import { pageMetadata } from '@/data/site';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({ locale, path: '' });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');
  const attributes = t.raw('attributes') as Attribute[];
  const bio = t.raw('bio') as { title: string; desc: string }[];
  const stats = t.raw('stats') as { value: string; label: string }[];

  return (
    <div>
      {/* ---- Hero — full-bleed immersive landing with scroll-driven exit ---- */}
      <HeroLanding />

      {/* ---- What I do — open editorial list ---- */}
      <section className="mt-20 sm:mt-28">
        <div>
          <div className="mb-7 flex items-center gap-4">
            <span className="text-xs uppercase tracking-widest2 text-accent">
              {t('bioKicker')}
            </span>
            <span className="h-px flex-1 bg-frost-line" />
          </div>
          <div className="grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
            {bio.map((f, i) => (
              <div key={f.title} className="group relative">
                <span className="font-display text-sm text-accent/70">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-1 flex items-center gap-2 font-display text-base font-medium tracking-wide text-white">
                  <Check size={14} className="text-accent" />
                  {f.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-frost-soft/80">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Stats band — big open numbers ---- */}
      <section className="mt-20 grid grid-cols-2 gap-y-10 border-y border-frost/15 py-10 sm:mt-28 sm:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`px-4 sm:px-6 ${
              i > 0 ? 'sm:border-l sm:border-frost/15' : ''
            }`}
          >
            <p className="font-display text-[clamp(2.25rem,5vw,3.5rem)] font-medium leading-none text-white">
              {s.value}
            </p>
            <p className="mt-2 text-xs leading-snug tracking-wide text-frost-dim">
              {s.label}
            </p>
          </div>
        ))}
      </section>

      {/* ---- Focus radar — de-boxed ---- */}
      <section className="mt-20 sm:mt-28">
        <div className="mb-8">
          <p className="mb-2 text-xs uppercase tracking-widest2 text-accent">
            {t('focusLabel')}
          </p>
          <Flourish />
        </div>
        <FocusRadar
          label={t('focusLabel')}
          hint={t('focusHint')}
          attributes={attributes}
        />
      </section>

      <div className="mt-20 sm:mt-28">
        <ContactCTA />
      </div>
    </div>
  );
}
