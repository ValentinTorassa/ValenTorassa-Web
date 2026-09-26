import { useCallback, useEffect, useRef, useState, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import {
  ArrowRight,
  Award,
  Calendar,
  Check,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Cloud,
  Copy,
  ExternalLink,
  GitFork,
  Github,
  GraduationCap,
  Lock,
  Mail,
  Network,
  Server,
  ShieldCheck,
  Wrench,
  Star,
  Terminal,
  X,
  Presentation,
} from 'lucide-react';
import portraitAvif256 from './assets/portrait-dark-256.avif';
import portraitAvif384 from './assets/portrait-dark-384.avif';
import portraitAvif512 from './assets/portrait-dark-512.avif';
import portraitWebp256 from './assets/portrait-dark-256.webp';
import portraitWebp384 from './assets/portrait-dark-384.webp';
import portraitWebp512 from './assets/portrait-dark-512.webp';
import portraitFallback from './assets/portrait-dark-384.png';
import {
  contentByLanguage,
  socialLinks,
  talkLabelsByLanguage,
  type FeaturedRepo,
  type Language,
  type StackTag,
} from './content';
import { talks, type Talk } from './events';
import { formatTalkDate, formatTalkPlace, formatTalkTime, splitTalks, todayInArgentina } from './eventSchedule';
import { getInitialLanguage, setMetaContent } from './site';
import { SiteFooter, SiteHeader, SocialIcon } from './siteChrome';
import { TalkChips } from './talkComponents';
import { talkMedia } from './talkMedia';

const portraitAvifSrcSet = `${portraitAvif256} 256w, ${portraitAvif384} 384w, ${portraitAvif512} 512w`;
const portraitWebpSrcSet = `${portraitWebp256} 256w, ${portraitWebp384} 384w, ${portraitWebp512} 512w`;
const portraitSizes = '(max-width: 520px) 156px, 172px';

type LiveRepoStats = Record<string, {
  stars: number;
  forks: number;
  updatedAt: string;
}>;

const contactEmail = 'valentin.torassa.colombero@gmail.com';
const canonicalBaseUrl = 'https://valentorassa.com/';
const contactSocialLinks = socialLinks.filter((link) => link.name !== 'Email');

function useLiveRepoStats() {
  const [stats, setStats] = useState<LiveRepoStats>({});

  useEffect(() => {
    const controller = new AbortController();

    fetch('https://api.github.com/users/ValentinTorassa/repos?per_page=100&sort=updated', {
      signal: controller.signal,
      headers: { Accept: 'application/vnd.github+json' },
    })
      .then((response) => {
        if (!response.ok) throw new Error('GitHub metadata unavailable');
        return response.json() as Promise<Array<{
          name: string;
          stargazers_count: number;
          forks_count: number;
          updated_at: string;
        }>>;
      })
      .then((repos) => {
        const nextStats = Object.fromEntries(
          repos.map((repo) => [
            repo.name,
            {
              stars: repo.stargazers_count,
              forks: repo.forks_count,
              updatedAt: repo.updated_at,
            },
          ]),
        );

        setStats(nextStats);
      })
      .catch(() => {
        // The page keeps recently verified fallback values when the API is unavailable.
      });

    return () => controller.abort();
  }, []);

  return stats;
}

function App() {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const [activeSection, setActiveSection] = useState('');
  const [activeExperienceIndex, setActiveExperienceIndex] = useState(-1);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [emailCopied, setEmailCopied] = useState(false);
  const [selectedRepoName, setSelectedRepoName] = useState<string | null>(null);
  const copyResetTimer = useRef<ReturnType<typeof globalThis.setTimeout> | undefined>(undefined);
  const projectTriggerRef = useRef<HTMLButtonElement | null>(null);
  const liveRepoStats = useLiveRepoStats();
  const content = contentByLanguage[language];
  const selectedRepo = content.research.repos.find((repo) => repo.name === selectedRepoName) ?? null;
  const closeProjectDrawer = useCallback(() => setSelectedRepoName(null), []);

  useEffect(() => {
    const canonicalUrl = `${canonicalBaseUrl}?lang=${language}`;

    document.documentElement.lang = language;
    document.title = content.documentTitle;
    window.localStorage.setItem('vt-language', language);
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', canonicalUrl);
    setMetaContent('meta[name="description"]', content.seo.description);
    setMetaContent('meta[property="og:title"]', content.documentTitle);
    setMetaContent('meta[property="og:description"]', content.seo.description);
    setMetaContent('meta[property="og:locale"]', content.seo.locale);
    setMetaContent('meta[property="og:url"]', canonicalUrl);
    setMetaContent('meta[name="twitter:title"]', content.documentTitle);
    setMetaContent('meta[name="twitter:description"]', content.seo.description);
  }, [content.documentTitle, content.seo.description, content.seo.locale, language]);

  useEffect(() => () => {
    if (copyResetTimer.current !== undefined) {
      globalThis.clearTimeout(copyResetTimer.current);
    }
  }, []);

  useEffect(() => {
    // Every section counts, not only the ones in the menu: otherwise, past Experiencia the
    // menu kept Experiencia lit through Educación, Stack and Charlas.
    const sectionIds = [...document.querySelectorAll<HTMLElement>('section[id]')].map((section) => section.id);
    let animationFrame: number | undefined;

    const updateNavigation = () => {
      animationFrame = undefined;
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = scrollableHeight > 0
        ? Math.min(Math.max(window.scrollY / scrollableHeight, 0), 1)
        : 0;
      const marker = window.scrollY + window.innerHeight * 0.34;
      let nextSection = '';

      sectionIds.forEach((sectionId) => {
        const section = document.getElementById(sectionId);
        if (section && section.offsetTop <= marker) nextSection = sectionId;
      });

      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) {
        nextSection = sectionIds.at(-1) ?? nextSection;
      }

      const timeline = document.querySelector<HTMLElement>('#experience .timeline');

      if (timeline) {
        const timelineRect = timeline.getBoundingClientRect();
        const timelineMarker = window.innerHeight * 0.56;
        const timelineProgress = Math.min(
          Math.max((timelineMarker - timelineRect.top) / Math.max(timelineRect.height, 1), 0),
          1,
        );
        const items = [...timeline.querySelectorAll<HTMLElement>('.timeline-item')];
        let nextExperienceIndex = -1;

        items.forEach((item, index) => {
          if (item.getBoundingClientRect().top <= timelineMarker) nextExperienceIndex = index;
        });

        timeline.style.setProperty('--timeline-progress', timelineProgress.toString());
        setActiveExperienceIndex((current) => (
          current === nextExperienceIndex ? current : nextExperienceIndex
        ));
      }

      setScrollProgress(nextProgress);
      setActiveSection((current) => current === nextSection ? current : nextSection);
    };

    const scheduleUpdate = () => {
      if (animationFrame === undefined) {
        animationFrame = window.requestAnimationFrame(updateNavigation);
      }
    };

    updateNavigation();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    const bodyResizeObserver = new ResizeObserver(scheduleUpdate);
    bodyResizeObserver.observe(document.body);

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      bodyResizeObserver.disconnect();
      if (animationFrame !== undefined) window.cancelAnimationFrame(animationFrame);
    };
  }, [content.navItems]);

  const formatUpdatedAt = (date: string) => new Intl.DateTimeFormat(
    language === 'es' ? 'es-AR' : 'en-US',
    { day: 'numeric', month: 'short', year: 'numeric' },
  ).format(new Date(date));

  const copyEmail = async () => {
    let copied = false;

    try {
      await navigator.clipboard.writeText(contactEmail);
      copied = true;
    } catch {
      const copyTarget = document.createElement('textarea');
      copyTarget.value = contactEmail;
      copyTarget.setAttribute('readonly', '');
      copyTarget.style.position = 'fixed';
      copyTarget.style.opacity = '0';
      document.body.appendChild(copyTarget);
      copyTarget.select();
      copied = document.execCommand('copy');
      copyTarget.remove();
    }

    if (!copied) return;

    setEmailCopied(true);

    if (copyResetTimer.current !== undefined) {
      globalThis.clearTimeout(copyResetTimer.current);
    }

    copyResetTimer.current = globalThis.setTimeout(() => setEmailCopied(false), 2200);
  };

  // Talks come from src/events.ts: the next three open to the public, then the
  // past talks flagged as highlights. /eventos lists all of them.
  const talkLabels = talkLabelsByLanguage[language];
  const today = todayInArgentina();
  const currentYear = today.slice(0, 4);
  const { upcoming: upcomingTalks, past: pastTalks } = splitTalks(talks, today);
  const [featuredTalk, ...moreUpcomingTalks] = upcomingTalks.filter((talk) => talk.status !== 'closed').slice(0, 3);
  const highlightedPastTalks = pastTalks.filter((talk) => talk.highlight);
  const talkWhen = (talk: Talk) => [
    formatTalkDate(talk, language, currentYear),
    formatTalkTime(talk),
    formatTalkPlace(talk, language),
  ].filter(Boolean).join(' · ');

  return (
    <div className="site-shell">
      <SiteHeader
        language={language}
        onToggleLanguage={() => setLanguage((current) => current === 'es' ? 'en' : 'es')}
        labels={content.header}
        navItems={content.navItems}
        brandHref="#top"
        activeSection={activeSection}
        scrollProgress={scrollProgress}
        meta={content.footer}
      />

      <main>
        <section className="hero" id="top">
          <HeroScene />
          <div className="hero-inner">
            <p className="hero-status">
              <span className="hero-avatar">
                <PortraitImage />
              </span>
              <span className="status-dot" />
              {content.status}
            </p>

            <p className="terminal-kicker">
              vt@security:~$ <span>whoami</span>
              <span className="caret" aria-hidden="true" />
            </p>

            <h1>Valentin Torassa Colombero</h1>

            <p className="hero-role">{content.heroRole}</p>

            <div className="hero-actions">
              <a className="btn btn-primary" href="/charlas">
                <Presentation aria-hidden="true" />
                {content.heroTalksLabel}
              </a>
              <a className="btn btn-secondary" href="#contact">
                <Mail aria-hidden="true" />
                {content.heroContactLabel}
              </a>
            </div>

            <div className="hero-socials" aria-label={content.heroSocialLabel}>
              {socialLinks.map((link) => (
                <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" title={link.name}>
                  <SocialIcon link={link} />
                  <span>{link.name}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <div className="strip" aria-hidden="true">
          <div className="strip-track">
            {['GO BACKEND', 'SOC 2', 'ISO 27001', 'MCP/OAUTH', 'AWS SECURITY', 'LINUX', 'VT SECURITY'].map((item) => (
              <span key={item}>{item}</span>
            ))}
            {['GO BACKEND', 'SOC 2', 'ISO 27001', 'MCP/OAUTH', 'AWS SECURITY', 'LINUX', 'VT SECURITY'].map((item) => (
              <span key={`${item}-copy`}>{item}</span>
            ))}
          </div>
        </div>

        <section className="section" id="profile">
          <div className="profile-layout">
          <div className="section-head profile-head">
            <span className="eyebrow">{content.profile.eyebrow}</span>
            <h2>{content.profile.title}</h2>
            <p>{content.profile.intro}</p>
            <TerminalCard title="vt@security:~/career" lines={content.terminalLines} />
          </div>

          <div className="profile-grid">
            <Reveal className="statement">
              <p>{content.profile.statement}</p>
              <div className="statement-watermark" aria-hidden="true">
                <span className="watermark-orbit" />
                <span className="watermark-trace trace-a" />
                <span className="watermark-trace trace-b" />
                <span className="watermark-trace trace-c" />
                <i className="watermark-node node-a" />
                <i className="watermark-node node-b" />
                <i className="watermark-node node-c" />
              </div>
            </Reveal>

            <div className="fact-list">
              {content.profile.facts.map((fact) => (
                <Reveal as="article" key={fact.key} className={`fact-card fact-${fact.key}`}>
                  <FactIcon factKey={fact.key} />
                  <div>
                    <span className="fact-key">{fact.key}</span>
                    <h3>{fact.title}</h3>
                    <p>{fact.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          </div>
        </section>

        <section className="section section-raised" id="experience">
          <div className="section-head">
            <span className="eyebrow">{content.experience.eyebrow}</span>
            <h2>{content.experience.title}</h2>
          </div>

          <div className="timeline">
            {content.experience.items.map((item, index) => (
              <Reveal as="article" className="timeline-item" key={`${item.company}-${item.role}`}>
                <span
                  className={[
                    'timeline-node',
                    index < activeExperienceIndex ? 'is-complete' : '',
                    index === activeExperienceIndex ? 'is-active' : '',
                  ].filter(Boolean).join(' ')}
                  aria-hidden="true"
                />
                <div className="timeline-content timeline-card">
                  <div className="timeline-head">
                    <div className={`experience-company logo-${item.logoMode}`}>
                      <span className="experience-logo">
                        <img
                          src={item.logo}
                          alt={item.hideCompanyLabel ? item.company : ''}
                          aria-hidden={item.hideCompanyLabel ? undefined : 'true'}
                        />
                      </span>
                      {item.hideCompanyLabel ? null : <p className="company">{item.company}</p>}
                    </div>
                    <div className="time">
                      <Calendar aria-hidden="true" />
                      <span>{item.period}</span>
                    </div>
                  </div>
                  <h3>{item.role}</h3>
                  <p>{item.description}</p>
                  <TagList tags={item.tags} />
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section split-section" id="education">
          <div className="section-head compact">
            <span className="eyebrow">{content.education.eyebrow}</span>
            <h2>{content.education.title}</h2>
          </div>

          <div className="split-grid">
            <Reveal className="panel education-panel">
              <div className="panel-title">
                <GraduationCap aria-hidden="true" />
                <h3>{content.education.academicTitle}</h3>
              </div>
              <div className="stack-list">
                {content.education.items.map((item) => (
                  <div className="stack-row education-row" key={item.title}>
                    <span className="education-entry-logo" aria-hidden="true">
                      <img
                        src={content.education.institutionLogo}
                        alt=""
                        width="150"
                        height="199"
                        loading="lazy"
                        decoding="async"
                      />
                    </span>
                    <div className="education-entry-content">
                      <div>
                        <strong>{item.title}</strong>
                        <span>{item.place}</span>
                      </div>
                      <em>
                        {item.period} · {item.status}
                      </em>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal className="panel">
              <div className="panel-title">
                <ShieldCheck aria-hidden="true" />
                <h3>{content.education.certificationsTitle}</h3>
              </div>
              <div className="cert-grid">
                {content.education.certifications.map((cert) => {
                  const CertIcon = cert.icon;

                  return (
                    <article className={`cert-card cert-${cert.tone}`} key={cert.name}>
                      <span className="cert-logo">
                        <CertIcon aria-hidden="true" />
                      </span>
                      <div>
                        <h4>{cert.name}</h4>
                        <strong>{cert.detail}</strong>
                        <p>{cert.focus}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </section>

        <section className="section section-raised" id="stack">
          <div className="section-head">
            <span className="eyebrow">{content.stack.eyebrow}</span>
            <h2>{content.stack.title}</h2>
            <p>{content.stack.intro}</p>
          </div>

          <div className="skill-grid">
            {content.stack.groups.map((group) => (
              <Reveal as="article" className={`skill-card tone-${group.tone}`} key={group.title}>
                <div className="skill-card-head">
                  <SkillIcon tone={group.tone} />
                  <h3>{group.title}</h3>
                </div>
                <p>{group.text}</p>
                <TagList tags={group.tags} variant="tone" />
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section" id="talks">
          <div className="section-head">
            <span className="eyebrow">{content.research.talksEyebrow}</span>
            <h2>{content.research.talksTitle}</h2>
            <p>{content.research.talksIntro}</p>
          </div>

          {featuredTalk ? (
            <div className="talks-now">
              <Reveal as="article" className="talk-feature">
                <a className="talk-feature-media" href={`/charlas/${featuredTalk.id}`} tabIndex={-1} aria-hidden="true">
                  {talkMedia[featuredTalk.id]?.still ? (
                    <img src={talkMedia[featuredTalk.id]?.still} alt="" loading="lazy" decoding="async" />
                  ) : null}
                </a>
                <div className="talk-feature-body">
                  <div className="recognition-meta">
                    <span>{[featuredTalk.event, featuredTalk.track].filter(Boolean).join(' · ')}</span>
                    <strong>{content.research.nextTalkLabel}</strong>
                  </div>
                  <h3>
                    <a href={`/charlas/${featuredTalk.id}`}>{featuredTalk.title[language]}</a>
                  </h3>
                  <p className="talk-when">{talkWhen(featuredTalk)}</p>
                  {featuredTalk.note ? <p className="talk-note">{featuredTalk.note[language]}</p> : null}
                  <TalkChips talk={featuredTalk} labels={talkLabels} showStatus />
                  {featuredTalk.url ? (
                    <a className="recognition-link" href={featuredTalk.url} target="_blank" rel="noopener noreferrer">
                      {content.research.openTalkLabel}
                      <ExternalLink aria-hidden="true" />
                    </a>
                  ) : null}
                </div>
              </Reveal>

              {moreUpcomingTalks.length > 0 ? (
                <div className="talks-upcoming">
                  <h3 className="talks-sub">{content.research.upcomingTalksLabel}</h3>
                  {moreUpcomingTalks.map((talk) => (
                    <Reveal as="article" className="talk-row" key={talk.id}>
                      <TalkThumb talk={talk} />
                      <div>
                        <span className="talk-row-meta">{[talk.event, talk.track].filter(Boolean).join(' · ')}</span>
                        <h4>
                          <a href={`/charlas/${talk.id}`}>{talk.title[language]}</a>
                        </h4>
                        <p className="talk-when">{talkWhen(talk)}</p>
                        <TalkChips talk={talk} labels={talkLabels} showStatus />
                      </div>
                    </Reveal>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          {highlightedPastTalks.length > 0 ? (
            <>
              <h3 className="talks-sub">{content.research.previousTalksLabel}</h3>
              <div className="talks-past">
                {highlightedPastTalks.map((talk) => (
                  <Reveal as="article" className={`talk-row is-past${talk.recognition ? ' has-award' : ''}`} key={talk.id}>
                    <TalkThumb talk={talk} />
                    <div>
                      <span className="talk-row-meta">
                        {talk.datePrecision === 'year'
                          ? talk.event
                          : `${talk.event} · ${formatTalkDate(talk, language, currentYear)}`}
                      </span>
                      <h4>
                        <a href={`/charlas/${talk.id}`}>{talk.title[language]}</a>
                      </h4>
                      {talk.recognition ? (
                        <p className="recognition-award">
                          <Award aria-hidden="true" />
                          {talk.recognition[language]}
                        </p>
                      ) : null}
                      {talk.note ? <p className="talk-note">{talk.note[language]}</p> : null}
                    </div>
                  </Reveal>
                ))}
              </div>
            </>
          ) : null}

          <div className="talks-page-links">
            <a className="talks-page-link is-hub" href="/charlas">
              <Presentation aria-hidden="true" />
              {content.research.hubLabel}
              <ArrowRight aria-hidden="true" />
            </a>
            <a className="talks-page-link" href="/eventos">
              <Calendar aria-hidden="true" />
              {content.research.allTalksLabel}
              <ArrowRight aria-hidden="true" />
            </a>
          </div>
        </section>

        <section className="section" id="research">
          <div className="section-head-row">
            <div className="section-head compact">
              <span className="eyebrow">{content.research.eyebrow}</span>
              <h2>{content.research.title}</h2>
            </div>
            <a
              className="github-profile-link"
              href="https://github.com/ValentinTorassa"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github aria-hidden="true" />
              {content.research.githubProfileLabel}
              <ExternalLink aria-hidden="true" />
            </a>
          </div>

            <Reveal className="repo-grid">
                {content.research.repos.map((repo) => {
                  if (repo.featured && repo.previewImage && repo.siteHref) {
                    return (
                      <article className={`repo-unfurl-card repo-${repo.tone}`} key={repo.name}>
                        <a
                          className="repo-unfurl-media"
                          href={repo.siteHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={content.research.openProjectLabel}
                        >
                          <img
                            src={repo.previewImage}
                            alt=""
                            width="2212"
                            height="1092"
                            loading="lazy"
                            decoding="async"
                          />
                        </a>
                        <div className="repo-unfurl-copy">
                          <div className="repo-unfurl-eyebrow">
                            <strong>{content.research.featuredLabel}</strong>
                            <span className="repo-kicker">
                              <i style={{ backgroundColor: repo.languageColor }} />
                              {repo.language}
                            </span>
                          </div>
                          <h4>{repo.name}</h4>
                          <p>{repo.description}</p>
                          <div className="repo-unfurl-links">
                            <a href={repo.siteHref} target="_blank" rel="noopener noreferrer">
                              <span>securitylabs.valentorassa.com</span>
                              <ExternalLink aria-hidden="true" />
                            </a>
                            <a href={repo.href} target="_blank" rel="noopener noreferrer">
                              <Github aria-hidden="true" />
                              <span>{content.research.openRepoLabel}</span>
                            </a>
                          </div>
                        </div>
                      </article>
                    );
                  }

                  const stats = liveRepoStats[repo.name] ?? {
                    stars: repo.stars,
                    forks: repo.forks,
                    updatedAt: repo.updatedAt,
                  };

                  return (
                    <article
                      className={`repo-card repo-${repo.tone}`}
                      key={repo.name}
                    >
                      <div className="repo-card-body">
                        <div className="repo-card-head">
                          <div>
                            <span className="repo-kicker">
                              <i style={{ backgroundColor: repo.languageColor }} />
                              {repo.language}
                            </span>
                            <h4>{repo.name}</h4>
                          </div>
                          <a
                            href={repo.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${content.research.openRepoLabel}: ${repo.name}`}
                            title={content.research.openRepoLabel}
                          >
                            <ExternalLink aria-hidden="true" />
                          </a>
                        </div>
                        <p>{repo.description}</p>
                        <TagList tags={repo.tags} />
                        <div className="repo-card-foot">
                        <div className="repo-meta">
                          <span title={content.research.starsLabel}>
                            <Star aria-hidden="true" />
                            {stats.stars}
                          </span>
                          <span title={content.research.forksLabel}>
                            <GitFork aria-hidden="true" />
                            {stats.forks}
                          </span>
                          <span>
                            <Calendar aria-hidden="true" />
                            {content.research.updatedLabel} {formatUpdatedAt(stats.updatedAt)}
                          </span>
                        </div>
                        <button
                          className="repo-details-trigger"
                          type="button"
                          onClick={(event) => {
                            projectTriggerRef.current = event.currentTarget;
                            setSelectedRepoName(repo.name);
                          }}
                        >
                          <span>{content.research.projectDetailsLabel}</span>
                          <ChevronRight aria-hidden="true" />
                        </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
            </Reveal>
        </section>

        <section className="section contact-block" id="contact">
          <Reveal className="contact-card">
          <div className="contact-copy">
            <span className="eyebrow">{content.contact.eyebrow}</span>
            <h2>{content.contact.title}</h2>
            <p>{content.contact.text}</p>
            <div className="contact-presence" aria-label={content.contact.timezone}>
              <span className="availability-indicator">
                <i aria-hidden="true" />
                {content.contact.availability}
              </span>
              <span>
                <Clock3 aria-hidden="true" />
                {content.contact.timezone}
              </span>
            </div>
          </div>
          <div className="contact-side">
          <div className="contact-actions">
            <a className="btn btn-primary" href={`mailto:${contactEmail}`}>
              <Mail aria-hidden="true" />
              {content.contact.emailLabel}
            </a>
            <button className="btn btn-secondary copy-email" type="button" onClick={copyEmail}>
              {emailCopied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
              <span aria-live="polite">
                {emailCopied ? content.contact.copiedEmailLabel : content.contact.copyEmailLabel}
              </span>
            </button>
          </div>

          <div className="contact-networks">
            <nav className="contact-network-links" aria-label={content.contact.socialLabel}>
              {contactSocialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-network={link.name.toLowerCase()}
                >
                  <SocialIcon link={link} />
                  <span>{link.name === 'YouTube' ? content.contact.youtubeLabel : link.name}</span>
                </a>
              ))}
            </nav>
          </div>
          </div>
          </Reveal>
        </section>
      </main>

      <SiteFooter backToTopLabel={content.footer.backToTopLabel} />

      {selectedRepo ? (
        <ProjectDrawer
          repo={selectedRepo}
          labels={{
            close: content.research.closeProjectLabel,
            problem: content.research.problemLabel,
            architecture: content.research.architectureLabel,
            security: content.research.securityLabel,
            visit: content.research.visitProjectLabel,
            repository: content.research.openRepoLabel,
          }}
          onClose={closeProjectDrawer}
          returnFocusTarget={projectTriggerRef.current}
        />
      ) : null}
    </div>
  );
}

type ProjectDrawerProps = {
  repo: FeaturedRepo;
  labels: {
    close: string;
    problem: string;
    architecture: string;
    security: string;
    visit: string;
    repository: string;
  };
  onClose: () => void;
  returnFocusTarget: HTMLButtonElement | null;
};

function ProjectDrawer({ repo, labels, onClose, returnFocusTarget }: ProjectDrawerProps) {
  const panelRef = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const focusFrame = window.requestAnimationFrame(() => closeRef.current?.focus());
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) return;

      const focusable = [...panelRef.current.querySelectorAll<HTMLElement>(
        'button, a[href], [tabindex]:not([tabindex="-1"])',
      )].filter((element) => !element.hasAttribute('disabled'));
      const first = focusable[0];
      const last = focusable.at(-1);

      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      returnFocusTarget?.focus();
    };
  }, [onClose, returnFocusTarget]);

  return (
    <div className="project-drawer-layer">
      <button
        className="project-drawer-backdrop"
        type="button"
        onClick={onClose}
        aria-label={labels.close}
        tabIndex={-1}
      />
      <aside
        className={`project-drawer repo-${repo.tone}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-drawer-title"
        ref={panelRef}
      >
        <div className="project-drawer-head">
          <span className="repo-kicker">
            <i style={{ backgroundColor: repo.languageColor }} />
            {repo.language}
          </span>
          <button ref={closeRef} type="button" onClick={onClose} aria-label={labels.close}>
            <X aria-hidden="true" />
          </button>
        </div>

        <div className="project-drawer-intro">
          <p>./project</p>
          <h2 id="project-drawer-title">{repo.name}</h2>
          <p>{repo.description}</p>
          <TagList tags={repo.tags} />
        </div>

        <div className="project-drawer-details">
          <article>
            <span>01 / {labels.problem}</span>
            <p>{repo.caseStudy.problem}</p>
          </article>
          <article>
            <span>02 / {labels.architecture}</span>
            <p>{repo.caseStudy.architecture}</p>
          </article>
          <article>
            <span>03 / {labels.security}</span>
            <p>{repo.caseStudy.security}</p>
          </article>
        </div>

        <div className="project-drawer-actions">
          {repo.siteHref ? (
            <a href={repo.siteHref} target="_blank" rel="noopener noreferrer">
              {labels.visit}
              <ExternalLink aria-hidden="true" />
            </a>
          ) : null}
          <a href={repo.href} target="_blank" rel="noopener noreferrer">
            <Github aria-hidden="true" />
            {labels.repository}
          </a>
        </div>
      </aside>
    </div>
  );
}

type TerminalLine = {
  prompt: string;
  command: string;
  output: string;
};

type RevealProps = HTMLAttributes<HTMLElement> & {
  as?: 'div' | 'article';
  children: ReactNode;
};

function PortraitImage() {
  return (
    <picture className="portrait-picture">
      <source type="image/avif" srcSet={portraitAvifSrcSet} sizes={portraitSizes} />
      <source type="image/webp" srcSet={portraitWebpSrcSet} sizes={portraitSizes} />
      <img
        className="portrait"
        src={portraitFallback}
        alt="Valentin Torassa Colombero"
        width={172}
        height={172}
        decoding="async"
        fetchPriority="high"
      />
    </picture>
  );
}

function Reveal({ as = 'div', className, children, ...props }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const revealClassName = ['reveal-item', isVisible ? 'is-visible' : '', className].filter(Boolean).join(' ');

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return undefined;
    }

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px 60px 0px' },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  if (as === 'article') {
    return (
      <article ref={ref as Ref<HTMLElement>} className={revealClassName} {...props}>
        {children}
      </article>
    );
  }

  return (
    <div ref={ref as Ref<HTMLDivElement>} className={revealClassName} {...(props as HTMLAttributes<HTMLDivElement>)}>
      {children}
    </div>
  );
}

type SceneQuality = 'full' | 'reduced';

function getScenePreference(): { enabled: boolean; quality: SceneQuality } {
  const navigatorWithHints = navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
    deviceMemory?: number;
  };
  const connection = navigatorWithHints.connection;
  const slowConnection = connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g';
  const constrainedDevice = (
    (navigatorWithHints.deviceMemory !== undefined && navigatorWithHints.deviceMemory <= 4)
    || navigator.hardwareConcurrency <= 4
    || connection?.effectiveType === '3g'
    || window.matchMedia('(max-width: 700px)').matches
  );

  return {
    enabled: !connection?.saveData && !slowConnection,
    quality: constrainedDevice ? 'reduced' : 'full',
  };
}

/** The icons the backdrop draws with dots, read from this hidden markup. */
const BACKDROP_ICONS = [ShieldCheck, Lock, Terminal, Cloud];

function HeroScene() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const iconsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;

    if (!container) {
      return undefined;
    }

    const scenePreference = getScenePreference();

    if (!scenePreference.enabled) {
      return undefined;
    }

    let disposeScene: (() => void) | undefined;
    let isDisposed = false;
    let idleHandle: number | undefined;
    let timeoutHandle: ReturnType<typeof globalThis.setTimeout> | undefined;
    let visibilityObserver: IntersectionObserver | undefined;
    let hasScheduledScene = false;

    const startScene = () => {
      const iconMarkup = [...(iconsRef.current?.querySelectorAll('svg') ?? [])].map((icon) => icon.outerHTML);
      void Promise.all([import('./threeRuntime'), import('./heroScene')])
        .then(async ([THREE, { setupHeroScene }]) => {
          if (isDisposed || !container.isConnected) return;
          const dispose = await setupHeroScene(THREE, container, scenePreference.quality, iconMarkup);
          if (isDisposed) dispose();
          else disposeScene = dispose;
        })
        .catch(() => {
          container.classList.add('is-unavailable');
        });
    };

    const scheduleScene = () => {
      if (hasScheduledScene) return;
      hasScheduledScene = true;

      if (typeof window.requestIdleCallback === 'function') {
        idleHandle = window.requestIdleCallback(startScene, { timeout: 1200 });
      } else {
        timeoutHandle = globalThis.setTimeout(startScene, 120);
      }
    };

    const heroContent = container.parentElement?.querySelector('.hero-inner') ?? container;

    if ('IntersectionObserver' in window) {
      visibilityObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            visibilityObserver?.disconnect();
            scheduleScene();
          }
        },
        { threshold: 0.12 },
      );
      visibilityObserver.observe(heroContent);
    } else {
      scheduleScene();
    }

    return () => {
      isDisposed = true;
      visibilityObserver?.disconnect();

      if (idleHandle !== undefined) {
        window.cancelIdleCallback(idleHandle);
      }

      if (timeoutHandle !== undefined) {
        globalThis.clearTimeout(timeoutHandle);
      }

      disposeScene?.();
    };
  }, []);

  return (
    <>
      <div className="hero-scene" ref={mountRef} aria-hidden="true" />
      <div hidden ref={iconsRef}>
        {BACKDROP_ICONS.map((Icon, index) => (
          <Icon key={index} />
        ))}
      </div>
    </>
  );
}

function TerminalCard({ title, lines }: { title: string; lines: TerminalLine[] }) {
  return (
    <div className="terminal-card">
      <div className="terminal-bar">
        <span className="dot-red" />
        <span className="dot-yellow" />
        <span className="dot-green" />
        <span>{title}</span>
      </div>
      <div className="terminal-body">
        {lines.map((line) => (
          <div className="terminal-row" key={line.command}>
            <div>
              <span className="prompt">{line.prompt}</span> <span className="command">{line.command}</span>
            </div>
            <p>{line.output}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const FACT_ICONS: Record<string, typeof Cloud> = { sec: ShieldCheck, arch: Server, ops: Wrench };

function FactIcon({ factKey }: { factKey: string }) {
  const Icon = FACT_ICONS[factKey] ?? Terminal;
  return (
    <span className="fact-icon" aria-hidden="true">
      <Icon />
    </span>
  );
}

const SKILL_ICONS: Record<string, typeof Cloud> = { cloud: Cloud, compliance: ClipboardCheck, backend: Server, systems: Network };

function SkillIcon({ tone }: { tone: string }) {
  const Icon = SKILL_ICONS[tone] ?? Terminal;
  return (
    <span className="skill-icon" aria-hidden="true">
      <Icon />
    </span>
  );
}

/** The talk's Tux, cropped for the hub's cards; a lettered tile when the talk has none. */
function TalkThumb({ talk }: { talk: Talk }) {
  const thumb = talkMedia[talk.id]?.thumb;
  return (
    <span className="talk-thumb" aria-hidden="true">
      {thumb ? <img src={thumb} alt="" loading="lazy" decoding="async" /> : <em>{talk.event.slice(0, 3).toUpperCase()}</em>}
    </span>
  );
}

function TagList({ tags, variant }: { tags: StackTag[]; variant?: 'colorful' | 'tone' }) {
  return (
    <div className={`tag-list${variant ? ` ${variant}` : ''}`}>
      {tags.map((tag, index) => {
        const item = typeof tag === 'string' ? { label: tag } : tag;
        const previous = index > 0 ? tags[index - 1] : undefined;
        const repeats = variant === 'tone' && typeof previous === 'object' && previous.icon === item.icon;

        const Icon = repeats ? undefined : item.icon;

        return (
          <span key={item.label}>
            {Icon ? <Icon className="tag-logo" aria-hidden="true" /> : null}
            {item.label}
          </span>
        );
      })}
    </div>
  );
}

export default App;
