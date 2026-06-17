import type { Metadata } from 'next';
import { ExternalLink, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Tag from '@/components/Tag';
import ContactCTA from '@/components/ContactCTA';
import { Flourish } from '@/components/Ornament';
import { pageMetadata } from '@/data/site';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'projects' });
  return pageMetadata({
    locale,
    path: '/projects',
    title: t('title'),
    description: t('metaDescription'),
  });
}

interface ProjectItem {
  name: string;
  tag: string;
  status: string;
  description: string;
  image?: string;
  imageAlt?: string;
  url?: string;
  linkLabel?: string;
  techs: string[];
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('projects');
  const items = t.raw('items') as ProjectItem[];

  return (
    <div>
      {/* ---- Editorial header ---- */}
      <header className="pt-2">
        <p className="mb-3 text-xs uppercase tracking-widest2 text-accent">
          {t('subtitle')}
        </p>
        <h1 className="font-display text-[clamp(2.5rem,7vw,5rem)] font-medium leading-[0.95] text-white">
          {t('title')}
        </h1>
        <Flourish className="mt-5" />
      </header>

      {/* ---- Alternating full-width showcases ---- */}
      <div className="mt-16 space-y-24 sm:mt-24 sm:space-y-32">
        {items.map((item, i) => {
          const reverse = i % 2 === 1;
          const num = String(i + 1).padStart(2, '0');
          return (
            <article
              key={item.name}
              className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
            >
              {/* ---- Visual ---- */}
              <div className={reverse ? 'lg:order-2' : ''}>
                {item.image ? (
                  <a
                    href={item.url ?? item.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/img relative block overflow-hidden rounded-xl ring-1 ring-frost/15"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.imageAlt ?? item.name}
                      loading="lazy"
                      className="aspect-[16/10] w-full object-cover object-top transition-transform duration-700 ease-out group-hover/img:scale-[1.04]"
                    />
                    <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-abyss/70 via-transparent to-transparent" />
                    {/* cyan scan-line on hover */}
                    <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-accent-line opacity-0 transition-opacity duration-300 group-hover/img:opacity-100" />
                    {item.linkLabel && (
                      <span className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full border border-frost/25 bg-abyss/70 px-3 py-1.5 text-xs tracking-wide text-frost-soft backdrop-blur-md transition-colors group-hover/img:border-accent group-hover/img:text-accent-bright">
                        {item.linkLabel}
                        <ArrowUpRight size={14} />
                      </span>
                    )}
                  </a>
                ) : (
                  /* Decorative block for image-less projects */
                  <div
                    className="relative flex items-center justify-center overflow-hidden rounded-xl ring-1 ring-frost/15"
                    style={{
                      aspectRatio: '16 / 10',
                      backgroundImage:
                        'radial-gradient(circle at 30% 20%, rgba(79,195,214,0.18), transparent 55%), linear-gradient(155deg, #14223e 0%, #0a1124 70%)',
                    }}
                  >
                    {/* huge faded monogram */}
                    <span className="pointer-events-none absolute -bottom-6 -right-2 font-display text-[12rem] font-medium leading-none text-frost/[0.06]">
                      {num}
                    </span>
                    {/* centered emblem */}
                    <span className="relative flex h-24 w-24 items-center justify-center rounded-full border border-accent/40 bg-accent/5 text-accent shadow-glow-accent">
                      <span className="absolute inset-2 rounded-full border border-frost/15" />
                      <ShieldCheck size={40} strokeWidth={1.4} />
                    </span>
                    <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-accent-line opacity-50" />
                  </div>
                )}
              </div>

              {/* ---- Content ---- */}
              <div className={reverse ? 'lg:order-1' : ''}>
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-2xl font-medium text-accent/60">
                    {num}
                  </span>
                  <span className="text-[0.7rem] uppercase tracking-widest2 text-frost-dim">
                    {item.tag}
                  </span>
                </div>

                <h2 className="mt-3 font-display text-3xl font-medium leading-tight tracking-wide text-white sm:text-4xl">
                  {item.name}
                </h2>
                <p className="mt-2 text-sm text-accent">{item.status}</p>

                <p className="mt-5 max-w-xl text-base leading-relaxed text-frost-soft/90">
                  {item.description}
                </p>

                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-6 inline-flex items-center gap-2 border-b border-accent/40 pb-1 text-sm tracking-wide text-frost-soft transition-colors hover:border-accent hover:text-accent-bright"
                  >
                    {item.linkLabel}
                    <ExternalLink
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </a>
                )}

                <div className="mt-7 flex flex-wrap gap-2">
                  {item.techs.map((tech) => (
                    <Tag key={tech}>{tech}</Tag>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-24 sm:mt-32">
        <ContactCTA />
      </div>
    </div>
  );
}
