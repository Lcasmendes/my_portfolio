import { getTranslations, getLocale } from 'next-intl/server';
import ContactRow, { type ContactIconKey } from './ContactRow';
import AvailabilityBadge from './AvailabilityBadge';
import { OrnamentDivider } from './Ornament';
import { profile } from '@/data/profile';

// Contact call-to-action used at the foot of pages (replaces a dedicated page).
export default async function ContactCTA() {
  const t = await getTranslations('contact');
  const tMeta = await getTranslations('meta');
  // Serve the full-stack CV in the page's language (pt/en).
  const locale = await getLocale();
  const cvHref = `/cv/Lucas_Mendes_CV_${locale === 'en' ? 'en' : 'pt'}.pdf`;

  const entries: {
    iconKey: ContactIconKey;
    label: string;
    value: string;
    href?: string;
    external?: boolean;
    download?: boolean;
  }[] = [
    {
      iconKey: 'cv',
      label: t('cv'),
      value: t('cvValue'),
      href: cvHref,
      download: true,
    },
    {
      iconKey: 'email',
      label: t('email'),
      value: profile.email,
      href: `mailto:${profile.email}`,
    },
    {
      iconKey: 'linkedin',
      label: t('linkedin'),
      value: profile.linkedin.label,
      href: profile.linkedin.href,
      external: true,
    },
    {
      iconKey: 'github',
      label: t('github'),
      value: profile.github.label,
      href: profile.github.href,
      external: true,
    },
    {
      iconKey: 'phone',
      label: t('phone'),
      value: profile.phone,
      href: profile.phoneHref,
    },
    {
      iconKey: 'location',
      label: t('location'),
      value: t('locationValue'),
    },
  ];

  return (
    <section id="contact" className="mt-14 scroll-mt-8">
      <OrnamentDivider className="mb-8" />
      <AvailabilityBadge label={tMeta('available')} className="mb-4" />
      <h2 className="font-display text-2xl tracking-wide text-white">
        {t('ctaTitle')}
      </h2>
      <p className="mt-2 text-frost-soft/90">{t('ctaText')}</p>

      <div className="mt-7 grid gap-4 lg:grid-cols-2">
        {entries.map((e, i) => (
          <ContactRow
            key={e.label}
            iconKey={e.iconKey}
            label={e.label}
            value={e.value}
            href={e.href}
            external={e.external}
            download={e.download}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}
