import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import SectionHeader from '@/components/SectionHeader';
import Panel from '@/components/Panel';

export default async function NotFound() {
  const t = await getTranslations('nav');
  return (
    <div>
      <SectionHeader title="404" subtitle="Lost in the realm" />
      <Panel>
        <Link
          href="/"
          className="text-frost transition-colors hover:text-frost-soft"
        >
          ← {t('about')}
        </Link>
      </Panel>
    </div>
  );
}
