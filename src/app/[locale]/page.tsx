import { Check } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Panel from '@/components/Panel';
import SectionHeader from '@/components/SectionHeader';
import FocusRadar, { type Attribute } from '@/components/FocusRadar';
import ContactCTA from '@/components/ContactCTA';

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

  return (
    <div>
      {/* Hero — welcome */}
      <div className="mb-12">
        <p className="mb-3 text-xs uppercase tracking-widest2 text-frost-dim">
          {tMeta('tagline')}
        </p>
        <h1 className="font-display text-4xl leading-tight text-white sm:text-6xl">
          {t('welcome')}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-frost">
          {t('welcomeText')}
        </p>
        <div className="mt-5 h-px w-32 bg-frost shadow-glow" />
      </div>

      <SectionHeader title={t('title')} subtitle={t('subtitle')} />

      {/* About me — portrait + feature grid */}
      <Panel index={0}>
        <div className="flex flex-col gap-7 sm:flex-row sm:items-start">
          {/* Portrait with name card */}
          <div className="relative shrink-0 sm:w-2/5">
            <div
              className="relative w-full overflow-hidden rounded-sm border border-frost/30 shadow-glow-strong"
              style={{ aspectRatio: '1 / 1' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/me/profile-square.jpg"
                alt={tMeta('name')}
                className="h-full w-full object-cover object-center"
              />
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-abyss/90 via-transparent to-frost/5" />
              {/* name card overlay */}
              <div className="absolute inset-x-3 bottom-3 rounded-sm border border-frost/30 bg-midnight/80 px-3 py-2 backdrop-blur-md">
                <p className="font-display text-sm font-medium tracking-wide text-white">
                  {tMeta('name')}
                </p>
                <p className="text-[0.7rem] uppercase tracking-widest text-frost-dim">
                  {tMeta('role')}
                </p>
              </div>
            </div>
            <span className="pointer-events-none absolute -left-1 -top-1 h-4 w-4 border-l-2 border-t-2 border-frost" />
            <span className="pointer-events-none absolute -right-1 -top-1 h-4 w-4 border-r-2 border-t-2 border-frost" />
            <span className="pointer-events-none absolute -bottom-1 -left-1 h-4 w-4 border-b-2 border-l-2 border-frost" />
            <span className="pointer-events-none absolute -bottom-1 -right-1 h-4 w-4 border-b-2 border-r-2 border-frost" />
          </div>

          {/* Feature grid */}
          <div className="flex-1 self-center">
            <p className="mb-5 text-xs uppercase tracking-widest2 text-frost">
              {t('bioKicker')}
            </p>
            <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
              {bio.map((f) => (
                <div key={f.title}>
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border border-frost/40 bg-frost/10 text-frost">
                      <Check size={12} />
                    </span>
                    <h3 className="font-display text-sm font-medium tracking-wide text-white">
                      {f.title}
                    </h3>
                  </div>
                  <p className="mt-1.5 pl-[1.9rem] text-sm leading-relaxed text-frost-soft/80">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Panel>

      {/* Focus areas radar */}
      <div className="mt-6">
        <FocusRadar
          label={t('focusLabel')}
          hint={t('focusHint')}
          attributes={attributes}
        />
      </div>

      {/* Contact CTA */}
      <ContactCTA />
    </div>
  );
}
