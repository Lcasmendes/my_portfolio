import { getTranslations, setRequestLocale } from 'next-intl/server';
import SectionHeader from '@/components/SectionHeader';
import QuestLog, { type JourneyItem } from '@/components/QuestLog';

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
