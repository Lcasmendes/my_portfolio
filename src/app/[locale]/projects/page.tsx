import { ExternalLink } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import SectionHeader from '@/components/SectionHeader';
import Panel from '@/components/Panel';
import Tag from '@/components/Tag';
import { OrnamentDivider } from '@/components/Ornament';
import ContactCTA from '@/components/ContactCTA';

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
      <SectionHeader title={t('title')} subtitle={t('subtitle')} />

      <div className="grid gap-6 lg:grid-cols-2">
        {items.map((item, i) => (
          <Panel key={item.name} index={i}>
            <p className="text-[0.65rem] uppercase tracking-widest2 text-frost-dim">
              {item.tag}
            </p>
            <h2 className="mt-1 font-display text-lg tracking-wide text-white">
              {item.name}
            </h2>
            <p className="mt-1 text-xs text-frost">{item.status}</p>

            {item.image && (
              <a
                href={item.url ?? item.image}
                target="_blank"
                rel="noopener noreferrer"
                className="group/img relative mt-4 block overflow-hidden rounded-sm border border-frost/20 shadow-glow"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.imageAlt ?? item.name}
                  loading="lazy"
                  className="aspect-[16/9] w-full object-cover object-top transition-transform duration-700 ease-out group-hover/img:scale-105"
                />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-abyss/80 via-abyss/10 to-transparent" />
                {/* scan-line shimmer on hover */}
                <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/img:opacity-100">
                  <span className="absolute inset-x-0 top-0 h-px bg-frost-line" />
                </span>
                {item.linkLabel && (
                  <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-sm border border-frost/30 bg-abyss/70 px-2 py-1 text-[0.7rem] tracking-wide text-frost-soft backdrop-blur-sm">
                    {item.linkLabel}
                    <ExternalLink size={12} />
                  </span>
                )}
              </a>
            )}

            <OrnamentDivider className="my-4" />

            <p className="text-sm leading-relaxed text-frost-soft/90">
              {item.description}
            </p>

            {item.url && !item.image && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-4 inline-flex items-center gap-2 rounded-sm border border-frost/30 bg-frost/5 px-3 py-1.5 text-xs tracking-wide text-frost-soft transition-all hover:border-frost/60 hover:bg-frost/10 hover:shadow-glow"
              >
                {item.linkLabel}
                <ExternalLink
                  size={13}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </a>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {item.techs.map((tech) => (
                <Tag key={tech}>{tech}</Tag>
              ))}
            </div>
          </Panel>
        ))}
      </div>

      <ContactCTA />
    </div>
  );
}
