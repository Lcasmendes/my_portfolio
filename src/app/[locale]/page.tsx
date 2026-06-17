import type { Metadata } from 'next';
import { Check } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import FocusRadar, { type Attribute } from '@/components/FocusRadar';
import ContactCTA from '@/components/ContactCTA';
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
  const tMeta = await getTranslations('meta');
  const attributes = t.raw('attributes') as Attribute[];
  const bio = t.raw('bio') as { title: string; desc: string }[];
  const stats = t.raw('stats') as { value: string; label: string }[];

  return (
    <div>
      {/* ---- Hero ---- */}
      <section className="relative pb-2 pt-2">
        <p className="mb-4 text-xs uppercase tracking-widest2 text-accent">
          {tMeta('tagline')}
        </p>
        <h1 className="font-display text-[clamp(2.5rem,7vw,5.5rem)] font-medium leading-[0.95] text-white">
          {t('welcome')}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-frost sm:text-xl">
          {t('welcomeText')}
        </p>
        <div className="mt-7 h-px w-32 bg-accent shadow-glow-accent" />
      </section>

      {/* ---- Editorial split: portrait + what I do ---- */}
      <section className="mt-20 grid items-center gap-12 sm:mt-28 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        {/* Portrait — open, framed only by an accent rail + corner ticks */}
        <div className="relative mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none">
          {/* vertical accent rail */}
          <span className="absolute -left-3 top-6 bottom-6 w-px bg-gradient-to-b from-transparent via-accent to-transparent sm:-left-5" />
          <div
            className="relative overflow-hidden rounded-lg"
            style={{ aspectRatio: '4 / 5' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/me/profile-square.jpg"
              alt={tMeta('name')}
              className="h-full w-full object-cover object-center"
            />
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-abyss/85 via-transparent to-accent/5" />
            {/* floating name tag — the single intentional overlap */}
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
              <div>
                <p className="font-display text-lg font-medium tracking-wide text-white">
                  {tMeta('name')}
                </p>
                <p className="text-[0.7rem] uppercase tracking-widest text-accent-bright">
                  {tMeta('role')}
                </p>
              </div>
            </div>
          </div>
          {/* corner ticks */}
          <span className="pointer-events-none absolute -left-1.5 -top-1.5 h-5 w-5 border-l-2 border-t-2 border-accent" />
          <span className="pointer-events-none absolute -right-1.5 -bottom-1.5 h-5 w-5 border-b-2 border-r-2 border-accent" />
        </div>

        {/* What I do — open list, editorial index numbers, no surrounding box */}
        <div>
          <div className="mb-7 flex items-center gap-4">
            <span className="text-xs uppercase tracking-widest2 text-accent">
              {t('bioKicker')}
            </span>
            <span className="h-px flex-1 bg-frost-line" />
          </div>
          <div className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
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
