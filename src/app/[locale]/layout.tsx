import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { Analytics } from '@vercel/analytics/next';
import { Geist, Geist_Mono } from 'next/font/google';
import { routing } from '@/i18n/routing';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { siteUrl, SITE_NAME, author, personJsonLd } from '@/data/site';
import '../globals.css';

const sans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const mono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
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
      className={`${sans.variable} ${mono.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          // Person schema for rich results & local (Cataguases/MG) relevance
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextIntlClientProvider messages={messages}>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
