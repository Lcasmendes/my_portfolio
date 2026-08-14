import type { Metadata } from 'next';

// Canonical production URL. Defaults to the Vercel deployment; override with
// NEXT_PUBLIC_SITE_URL in the deploy environment if a custom domain is added.
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lucassmdev.vercel.app'
)
  .trim()
  .replace(/\s+/g, '') // guard against stray whitespace in the env var
  .replace(/\/+$/, '');

export const SITE_NAME = 'Lucas Mendes';

export const author = {
  name: 'Lucas Silva Mendes',
  email: 'lucas.smds1728@gmail.com',
  sameAs: [
    'https://www.linkedin.com/in/lcasm',
    'https://github.com/Lcasmendes',
  ],
} as const;

// Open Graph locale tags per app locale.
const OG_LOCALE: Record<string, string> = { pt: 'pt_BR', en: 'en_US' };

// Shared per-page metadata: canonical + hreflang alternates + Open Graph URL.
// Open Graph is set here (not in the layout) so siteName/url/locale resolve
// correctly per route; the OG image comes from the opengraph-image file.
export function pageMetadata({
  locale,
  path = '',
  title,
  description,
}: {
  locale: string;
  path?: string;
  title?: string;
  description?: string;
}): Metadata {
  const url = `${siteUrl}/${locale}${path}`;
  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    alternates: {
      canonical: url,
      languages: {
        'pt-BR': `${siteUrl}/pt${path}`,
        en: `${siteUrl}/en${path}`,
        'x-default': `${siteUrl}/pt${path}`,
      },
    },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: OG_LOCALE[locale] ?? 'pt_BR',
      url,
    },
  };
}

// schema.org Person — drives rich results and local relevance (São Carlos/SP
// and Cataguases/MG).
export function personJsonLd(jobTitle: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    url: siteUrl,
    image: `${siteUrl}/me/profile-square.jpg`,
    jobTitle,
    email: `mailto:${author.email}`,
    sameAs: [...author.sameAs],
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Universidade Federal de São Carlos (UFSCar)',
    },
    worksFor: { '@type': 'Organization', name: 'Deep Metrics' },
    knowsAbout: [
      'React',
      'Next.js',
      'TypeScript',
      'Node.js',
      'JavaScript',
      'Python',
      'BigQuery',
      'ETL',
      'Google Cloud Platform',
      'Full-stack development',
      'Data Engineering',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'São Carlos',
      addressRegion: 'SP',
      addressCountry: 'BR',
    },
    workLocation: [
      {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'São Carlos',
          addressRegion: 'SP',
          addressCountry: 'BR',
        },
      },
      {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Cataguases',
          addressRegion: 'MG',
          addressCountry: 'BR',
        },
      },
    ],
  };
}
