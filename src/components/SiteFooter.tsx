import { useTranslations } from 'next-intl';

export default function SiteFooter() {
  const t = useTranslations('footer');
  return (
    <footer className="site-footer">
      <div className="wrap">
        <span>
          © {new Date().getFullYear()} {t('rights')}
        </span>
        <span>{t('place')}</span>
      </div>
    </footer>
  );
}
