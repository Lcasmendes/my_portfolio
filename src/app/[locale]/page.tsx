import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import HeroPoster from '@/components/HeroPoster';
import SkillTabs, { type SkillCategory } from '@/components/SkillTabs';
import QuestLog, { type JourneyItem } from '@/components/QuestLog';
import CopyEmail from '@/components/CopyEmail';
import { pageMetadata } from '@/data/site';
import { profile } from '@/data/profile';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({ locale, path: '' });
}

interface ProjectItem {
  name: string;
  status: string;
  live: boolean;
  description: string;
  image?: string;
  imageAlt?: string;
  url: string;
  linkLabel?: string;
  techs: string[];
}

const Arrow = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <path d="M4 12 12 4M6 4h6v6" />
  </svg>
);

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tIntro = await getTranslations('intro');
  const tProj = await getTranslations('projects');
  const tSkills = await getTranslations('skills');
  const tJourney = await getTranslations('journey');
  const tContact = await getTranslations('contact');

  const figs = tIntro.raw('figs') as { value: string; label: string }[];
  const projects = tProj.raw('items') as ProjectItem[];
  // With an odd number of screenshot cards, the first one spans the full row so the 2-column grid has no gap.
  const featureFirst = projects.filter((p) => p.image).length % 2 === 1;
  const categories = tSkills.raw('categories') as SkillCategory[];
  const journey = tJourney.raw('items') as JourneyItem[];
  const cvHref = `/cv/Lucas_Mendes_CV_${locale === 'en' ? 'en' : 'pt'}.pdf`;

  return (
    <>
      <HeroPoster />

      <section className="intro">
        <div className="wrap">
          <p className="lead">
            {tIntro.rich('lead', {
              b: (c) => <b>{c}</b>,
              em: (c) => <em>{c}</em>,
            })}
          </p>
          <div className="intro-side">
            <div className="figs">
              {figs.map((f) => (
                <div className="fig" key={f.label}>
                  <b>{f.value}</b>
                  <span>{f.label}</span>
                </div>
              ))}
            </div>
            <div className="ctas">
              <a className="btn primary" href="#projects">
                {tIntro('ctaProjects')}
              </a>
              <a className="btn" href="#contact">
                {tIntro('ctaContact')}
                <Arrow />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="sec" id="projects" style={{ paddingTop: 'clamp(56px, 8vw, 96px)' }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="kicker">{tProj('kicker')}</span>
            <h2>{tProj('title')}</h2>
          </div>
          <div className="work">
            {projects.map((p, i) =>
              p.image ? (
                <a className={featureFirst && i === 0 ? 'card wide' : 'card'} key={p.name} href={p.url} target="_blank" rel="noopener noreferrer">
                  <div className="shot">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt={p.imageAlt ?? p.name} loading="lazy" />
                  </div>
                  <div className="card-body">
                    <div className="card-top">
                      <h3>{p.name}</h3>
                      <span className="st">
                        {p.live && <i />}
                        {p.status}
                      </span>
                    </div>
                    <p>{p.description}</p>
                    <div className="techs">
                      {p.techs.map((tech) => (
                        <span key={tech}>{tech}</span>
                      ))}
                    </div>
                  </div>
                </a>
              ) : (
                <a className="card wide" key={p.name} href={p.url} target="_blank" rel="noopener noreferrer">
                  <pre className="snippet" aria-hidden="true">
                    <em># config</em>
                    {'\n'}
                    <b>services</b>:{'\n'}
                    {'  '}
                    <b>orders</b>:{'\n'}
                    {'    roles: [admin, seller]\n'}
                    {'    routes:\n'}
                    {'      POST   /orders  → seller\n'}
                    {'      DELETE /orders  → admin\n'}
                    <em># → Keycloak realm, clients & policies</em>
                  </pre>
                  <div className="card-body">
                    <div className="card-top">
                      <h3>{p.name}</h3>
                      <span className="st">{p.status}</span>
                    </div>
                    <p>{p.description}</p>
                    <div className="techs">
                      {p.techs.map((tech) => (
                        <span key={tech}>{tech}</span>
                      ))}
                    </div>
                    {p.linkLabel && (
                      <span className="go">
                        {p.linkLabel}
                        <Arrow />
                      </span>
                    )}
                  </div>
                </a>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="sec" id="skills" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="kicker">{tSkills('kicker')}</span>
            <h2>{tSkills('title')}</h2>
            <p>{tSkills('hint')}</p>
          </div>
          <SkillTabs categories={categories} />
        </div>
      </section>

      <section className="sec" id="journey" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="kicker">{tJourney('kicker')}</span>
            <h2>{tJourney('title')}</h2>
          </div>
          <QuestLog items={journey} />
        </div>
      </section>

      <section className="sec" id="contact" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="contact-box">
            <div>
              <span className="kicker">{tContact('kicker')}</span>
              <h2 style={{ marginTop: 18 }}>
                {tContact('title')} <span>{tContact('titleAccent')}</span>
              </h2>
              <p className="sub">{tContact('text')}</p>
            </div>
            <div className="links">
              <CopyEmail
                email={profile.email}
                label={tContact('email')}
                copy={tContact('copy')}
                copied={tContact('copied')}
              />
              <a className="link" href={profile.linkedin.href} target="_blank" rel="noopener noreferrer">
                <span className="k">{tContact('linkedin')}</span>
                <span className="v">{profile.linkedin.label}</span>
                <span className="a">↗</span>
              </a>
              <a className="link" href={profile.github.href} target="_blank" rel="noopener noreferrer">
                <span className="k">{tContact('github')}</span>
                <span className="v">{profile.github.label}</span>
                <span className="a">↗</span>
              </a>
              <a className="link" href={profile.phoneHref}>
                <span className="k">{tContact('phone')}</span>
                <span className="v">{profile.phone}</span>
                <span className="a">↗</span>
              </a>
              <a className="link" href={cvHref} download>
                <span className="k">{tContact('cv')}</span>
                <span className="v">{tContact('cvValue')}</span>
                <span className="a">PDF</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
