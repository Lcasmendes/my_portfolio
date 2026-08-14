import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import SectionHeader from '@/components/SectionHeader';
import QuestLog, { type JourneyItem } from '@/components/QuestLog';
import { pageMetadata } from '@/data/site';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'journey' });
  return pageMetadata({
    locale,
    path: '/journey',
    title: t('title'),
    description: t('metaDescription'),
  });
}

export default async function JourneyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('journey');
  const items = t.raw('items') as JourneyItem[];

  return (
    <div>
      <SectionHeader title={t('title')} subtitle={t('subtitle')} />
      <QuestLog items={items} currentLabel={t('current')} />
    </div>
  );
}
