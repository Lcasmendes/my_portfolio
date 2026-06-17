import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { Analytics } from '@vercel/analytics/next';
import { Jost, Inter } from 'next/font/google';
import { routing } from '@/i18n/routing';
import AppShell from '@/components/AppShell';
import Background from '@/components/Background';
import { SoundProvider } from '@/components/sound/SoundProvider';
import { siteUrl, SITE_NAME, author, personJsonLd } from '@/data/site';
import '../globals.css';

const display = Jost({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-display',
  display: 'swap',
});

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    metadataBase: new URL(siteUrl),
    title: { default: t('homeTitle'), template: `%s — ${SITE_NAME}` },
    description: t('siteDescription'),
    keywords: t('keywords')
      .split(',')
      .map((k) => k.trim()),
    applicationName: SITE_NAME,
    authors: [{ name: author.name, url: siteUrl }],
    creator: author.name,
    publisher: author.name,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    twitter: { card: 'summary_large_image', creator: '@lcasm' },
    formatDetection: { telephone: false },
    verification: {
      google: 'uNs80-RcA8Pk9VnX45ySkXT_qjNYHqPpRZpC36ijT8E',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as never)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const tMeta = await getTranslations({ locale, namespace: 'meta' });
  const jsonLd = personJsonLd(tMeta('role'));

  return (
    <html
      lang={locale === 'pt' ? 'pt-BR' : locale}
      className={`${display.variable} ${body.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          // Person schema for rich results & local (São Carlos / Cataguases) relevance
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextIntlClientProvider messages={messages}>
          <SoundProvider>
            <Background />
            <AppShell>{children}</AppShell>
          </SoundProvider>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
