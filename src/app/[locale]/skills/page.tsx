import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import SectionHeader from '@/components/SectionHeader';
import SkillTabs, { type SkillCategory } from '@/components/SkillTabs';
import { pageMetadata } from '@/data/site';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'skills' });
  return pageMetadata({
    locale,
    path: '/skills',
    title: t('title'),
    description: t('metaDescription'),
  });
}

export default async function SkillsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('skills');
  const categories = t.raw('categories') as SkillCategory[];

  return (
    // Desktop: fit the viewport (no vertical scroll). Mobile: natural flow.
    <div className="lg:flex lg:h-[calc(100dvh-10rem)] lg:flex-col lg:overflow-hidden">
      <SectionHeader title={t('title')} subtitle={t('subtitle')} />
      <div className="lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
        <SkillTabs
          categories={categories}
          hint={t('treeHint')}
          prevLabel={t('prevTab')}
          nextLabel={t('nextTab')}
        />
      </div>
    </div>
  );
}
