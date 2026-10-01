import { getLocale, getTranslations } from 'next-intl/server';

export default async function NotFound() {
  const t = await getTranslations('notFound');
  const tNav = await getTranslations('nav');
  const locale = await getLocale();
  return (
    <div className="wrap">
      <div className="notfound">
        <span className="kicker">404</span>
        <div className="big" aria-hidden="true">
          4<span>0</span>4
        </div>
        <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}>{t('title')}</h1>
        <p>{t('text')}</p>
        <a className="btn primary" href={`/${locale}`}>
          {tNav('home')}
        </a>
      </div>
    </div>
  );
}
