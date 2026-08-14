import type { MetadataRoute } from 'next';
import { siteUrl } from '@/data/site';

const PATHS = ['', '/journey', '/projects', '/skills'];
const LOCALES = ['pt', 'en'];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return PATHS.flatMap((path) =>
    LOCALES.map((locale) => ({
      url: `${siteUrl}/${locale}${path}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: path === '' ? 1 : 0.8,
      alternates: {
        languages: {
          'pt-BR': `${siteUrl}/pt${path}`,
          en: `${siteUrl}/en${path}`,
        },
      },
    })),
  );
}
