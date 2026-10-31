import { useEffect, useState, type ReactNode } from 'react';
import coverFallback from './assets/libro-cover-540.jpg';
import coverWebp360 from './assets/libro-cover-360.webp';
import coverWebp540 from './assets/libro-cover-540.webp';
import { ARGENTINA_TIME_ZONE, splitTalks } from './eventSchedule';
import { talks, type Talk } from './events';
import {
  audience,
  blogUrl,
  comandleStatsApi,
  comandleUrl,
  discordUrl,
  labsUrl,
  linksByLanguage,
  marginCode,
  outboundRef,
  profiles,
  secretShareUrl,
  youtubeUrl,
} from './linksContent';
import { counterpartPath, localePath, useToday } from './site';
import type { Language } from './siteContent';

type ComandleStats = {
  since: string;
  total: number;
  today: { date: string; played: number };
  yesterday: { date: string; played: number };
};

const isCount = (n: unknown): n is number => typeof n === 'number' && Number.isSafeInteger(n) && n >= 0;
const isDay = (d: unknown): d is string => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d);

/** A broken or partial answer is shown as "did not load", never as zero games. */
function validStats(data: unknown): ComandleStats | null {
  const d = data as Partial<ComandleStats> | null;
  if (!d || !isCount(d.total) || !isDay(d.since)) return null;
  if (!d.today || !isCount(d.today.played) || !isDay(d.today.date)) return null;
  if (!d.yesterday || !isCount(d.yesterday.played) || !isDay(d.yesterday.date)) return null;
  return d as ComandleStats;
}

/** Live comandle counts: undefined while loading, null if they did not load. */
function useComandleStats() {
  const [stats, setStats] = useState<ComandleStats | null | undefined>(undefined);
  useEffect(() => {
    const controller = new AbortController();
    fetch(comandleStatsApi, { signal: controller.signal, credentials: 'omit' })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => setStats(validStats(data)))
      .catch(() => {
        if (!controller.signal.aborted) setStats(null);
      });
    return () => controller.abort();
  }, []);
  return stats;
}

/** The bio's tag, carried on to the destinations that count it. Stable on the server render. */
function useOutboundRef() {
  const [ref, setRef] = useState('links');
  useEffect(() => setRef(outboundRef(window.location.search)), []);
  return ref;
}

const withRef = (url: string, ref: string) => `${url}${url.includes('?') ? '&' : '?'}ref=${encodeURIComponent(ref)}`;

const daysBetween = (from: string, to: string) =>
  Math.round((Date.parse(`${to}T12:00:00Z`) - Date.parse(`${from}T12:00:00Z`)) / 86_400_000) + 1;

const locale = (language: Language) => (language === 'es' ? 'es-AR' : 'en-US');

function formatDay(day: string, language: Language) {
  return new Intl.DateTimeFormat(locale(language), {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${day}T12:00:00Z`));
}

function formatTalkDay(talk: Talk, language: Language) {
  const day = new Intl.DateTimeFormat(locale(language), { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' }).format(
    new Date(`${talk.date}T12:00:00Z`),
  );
  return talk.time ? `${day} · ${talk.time}` : day;
}

/** Next public talk; a closed one only when nothing else is coming. */
function nextTalk(today: string) {
  const { upcoming } = splitTalks(talks, today);
  return upcoming.find((talk) => talk.status !== 'closed') ?? upcoming[0];
}

function Window({
  title,
  href,
  external = true,
  className = '',
  children,
}: {
  title: string;
  href?: string;
  external?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const body = (
    <>
      <span className="win-bar" aria-hidden="true">
        <span>{title}</span>
        <span className="win-bar-dots">▪▪▪</span>
      </span>
      <span className="win-body">{children}</span>
    </>
  );
  if (!href) return <div className={`win ${className}`}>{body}</div>;
  return (
    <a className={`win win-link ${className}`} href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {body}
    </a>
  );
}

function Corners() {
  return (
    <span className="corners" aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}

/** Rosario's clock. The server renders the day only, so hydration matches. */
function Clock({ language, title, place }: { language: Language; title: string; place: string }) {
  const today = useToday();
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const time = now
    ? new Intl.DateTimeFormat(locale(language), {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: ARGENTINA_TIME_ZONE,
      }).format(now)
    : '--:--:--';
  return (
    <Window title={title} className="win-clock">
      <span className="pixel-text">{formatDay(today, language)}</span>
      <span className="pixel-text clock-time">{time}</span>
      <span className="pixel-text clock-place">{place}</span>
    </Window>
  );
}

const SIZE = 6;
const gliderStart = [1, 8, 12, 13, 14];

function lifeStep(cells: Set<number>) {
  const next = new Set<number>();
  for (let i = 0; i < SIZE * SIZE; i += 1) {
    const x = i % SIZE;
    const y = Math.floor(i / SIZE);
    let around = 0;
    for (let dy = -1; dy <= 1; dy += 1) {
      for (let dx = -1; dx <= 1; dx += 1) {
        if (dx || dy) around += cells.has(((y + dy + SIZE) % SIZE) * SIZE + ((x + dx + SIZE) % SIZE)) ? 1 : 0;
      }
    }
    if (around === 3 || (around === 2 && cells.has(i))) next.add(i);
  }
  return next;
}

/** A glider on a small torus. Still when the visitor prefers reduced motion. */
function Glider({ title, caption }: { title: string; caption: string }) {
  const [cells, setCells] = useState(() => new Set(gliderStart));
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => setCells((current) => lifeStep(current)), 650);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <Window title={title} className="win-glider">
      <span className="life" aria-hidden="true">
        {Array.from({ length: SIZE * SIZE }, (_, i) => (
          <span key={i} className={cells.has(i) ? 'alive' : undefined} />
        ))}
      </span>
      <span className="pixel-text">{caption}</span>
    </Window>
  );
}

function LinksPage({ language }: { language: Language }) {
  const copy = linksByLanguage[language];
  const today = useToday();
  const stats = useComandleStats();
  const ref = useOutboundRef();
  const number = new Intl.NumberFormat(locale(language));
  const talk = nextTalk(today);
  const languageHref = counterpartPath(localePath(language, '/links'));

  const comandleHref = withRef(comandleUrl, ref);
  const bookHref = withRef(localePath(language, '/libro'), ref);

  return (
    <div className="links-page">
      <header className="topbar">
        <a className="chip" href={copy.topBar.homeHref}>
          {copy.topBar.home}
        </a>
        <nav className="topbar-right" aria-label={copy.profilesLabel}>
          <a className="chip" href={youtubeUrl} target="_blank" rel="noopener noreferrer">
            YouTube
          </a>
          <a className="chip chip-dark" href={languageHref} hrefLang={language === 'es' ? 'en' : 'es'} aria-label={copy.topBar.languageLabel}>
            {copy.topBar.language}
          </a>
        </nav>
      </header>

      <main>
        <section className="sky">
          <div className="news win">
            <span className="win-bar">
              <span>
                {formatDay(today, language)} ▪ {copy.news.label}
              </span>
            </span>
            <span className="win-body news-body">
              <span className="pixel-text">{copy.news.body}</span>
              <a className="pixel-text news-cta" href={bookHref}>
                {copy.news.cta}
              </a>
            </span>
          </div>

          <p className="leader">
            <span>{copy.leader.left}</span>
            <span className="leader-dots" aria-hidden="true" />
            <span>{copy.leader.right}</span>
          </p>

          <h1 className="mega">{copy.title}</h1>
          <p className="subtitle">{copy.subtitle}</p>

          <div className="mega-ctas">
            <a href={youtubeUrl} target="_blank" rel="noopener noreferrer">
              {copy.ctas.youtube}
            </a>
            <a href={bookHref}>{copy.ctas.book}</a>
          </div>

          <span className="margin-code" aria-hidden="true">
            {marginCode}
          </span>
        </section>

        <div className="glyph-row" aria-hidden="true">
          <span>∵ ⩆</span>
          <span>⩆ ∵</span>
        </div>

        <section className="desk" aria-label={copy.desktopLabel}>
          <span className="desk-label pixel-text" aria-hidden="true">
            {copy.desktopLabel}
          </span>

          <div className="desk-grid">
            <Window title={copy.youtube.title} href={youtubeUrl} className="w-youtube">
              <span className="win-name">{copy.youtube.name}</span>
              <span className="tag">{copy.youtube.stats(audience.youtube, audience.youtubeVideos)}</span>
              <span className="win-text">{copy.youtube.body}</span>
              <span className="win-cta">{copy.youtube.cta} →</span>
            </Window>

            <Window title={copy.book.title} href={bookHref} external={false} className="w-book">
              <picture className="book-cover">
                <source type="image/webp" srcSet={`${coverWebp360} 360w, ${coverWebp540} 540w`} sizes="140px" />
                <img src={coverFallback} alt={copy.book.coverAlt} width={540} height={720} loading="lazy" decoding="async" />
              </picture>
              <span className="book-copy">
                <span className="win-name">{copy.book.name}</span>
                <span className="win-text">{copy.book.body}</span>
                <span className="tag">{copy.book.meta}</span>
                <span className="win-cta">{copy.book.cta} →</span>
              </span>
            </Window>

            <Window title={copy.comandle.title} href={comandleHref} className="w-comandle">
              <span className="tiles" aria-hidden="true">
                <span className="tile tile-hit">c</span>
                <span className="tile tile-near">h</span>
                <span className="tile">m</span>
                <span className="tile tile-hit">o</span>
                <span className="tile tile-hit">d</span>
              </span>
              <span className="win-text">{copy.comandle.body}</span>
              {stats ? (
                <span className="counts">
                  <span>
                    <b>{number.format(stats.today.played)}</b> {copy.comandle.today}
                  </span>
                  <span>
                    <b>{number.format(stats.yesterday.played)}</b> {copy.comandle.yesterday}
                  </span>
                  <span>
                    <b>{number.format(stats.total)}</b> {copy.comandle.total}
                  </span>
                </span>
              ) : stats === null ? (
                <span className="counts counts-off">{copy.comandle.offline}</span>
              ) : (
                <span className="counts counts-wait" aria-hidden="true">
                  ░░░ ░░░ ░░░
                </span>
              )}
              <span className="win-cta">{copy.comandle.cta} →</span>
            </Window>

            {talk ? (
              <Window title={copy.talk.title} href={localePath(language, `/charlas/${talk.id}`)} external={false} className="w-talk">
                <span className="pixel-text talk-when">{formatTalkDay(talk, language)}</span>
                <span className="win-name">{talk.title[language]}</span>
                <span className="win-text">
                  {copy.talk.at([talk.event, talk.city].filter(Boolean).join(', '))}
                  {talk.status === 'closed' ? ` ${copy.talk.closed}` : ''}
                </span>
                <span className="win-cta">{copy.talk.cta} →</span>
              </Window>
            ) : (
              <Window title={copy.talk.title} href={localePath(language, '/eventos')} external={false} className="w-talk">
                <span className="win-text">{copy.talk.empty}</span>
              </Window>
            )}

            <Window title={copy.labs.title} href={labsUrl} className="w-labs">
              <span className="win-name">{copy.labs.name}</span>
              <span className="win-text">{copy.labs.body}</span>
              <span className="win-cta">{copy.labs.cta} →</span>
            </Window>

            <Clock language={language} title={copy.clock.title} place={copy.clock.place} />

            <Window title={copy.blog.title} href={blogUrl} className="w-blog">
              <span className="win-name">{copy.blog.name}</span>
              <span className="win-text">{copy.blog.body}</span>
              <span className="win-cta">{copy.blog.cta} →</span>
            </Window>

            <Window title={copy.discord.title} href={discordUrl} className="w-discord">
              <span className="win-name">{copy.discord.name}</span>
              <span className="win-text">{copy.discord.body(`+${number.format(audience.discord)}`)}</span>
              <span className="win-cta">{copy.discord.cta} →</span>
            </Window>

            <Window title={copy.secretShare.title} href={secretShareUrl} className="w-secret">
              <span className="win-name">{copy.secretShare.name}</span>
              <span className="win-text">{copy.secretShare.body}</span>
              <span className="win-cta">{copy.secretShare.cta} →</span>
            </Window>

            <Glider title={copy.glider.title} caption={copy.glider.caption} />
          </div>
        </section>

        <section className="numbers">
          <div className="framed">
            <Corners />
            {stats ? (
              <>
                <p className="mega mega-number">{copy.bigNumber.played(number.format(stats.total))}</p>
                <p className="mega mega-number">{copy.bigNumber.days(daysBetween(stats.since, stats.today.date))}</p>
                <p className="footnote">
                  {copy.bigNumber.playedNote}{' '}
                  <a href={comandleHref} target="_blank" rel="noopener noreferrer">
                    (comandle)
                  </a>
                </p>
              </>
            ) : (
              <>
                <p className="mega mega-number">{copy.bigNumber.fallback}</p>
                <p className="footnote">{copy.bigNumber.fallbackNote(formatDay(audience.asOf, language))}</p>
              </>
            )}
          </div>

          <ul className="stat-row">
            {copy.stats.map((stat) => (
              <li key={stat.label}>
                <span className="stat-value">{stat.value(audience)}</span>
                <span className="stat-label">{stat.label}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="profiles">
          <div className="profiles-head">
            <span className="label">{copy.profilesLabel}</span>
            <h2>{copy.profilesTitle}</h2>
          </div>
          <ul className="profile-list">
            {profiles.map((profile) => (
              <li key={profile.name}>
                <a href={profile.href} target="_blank" rel="noopener noreferrer">
                  <span className="label">{profile.name}</span>
                  <span className="profile-handle">{profile.handle}</span>
                  <span className="profile-arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

      </main>

      <footer className="links-footer">
        <Window title="VT Security">
          <span className="pixel-text">{copy.footer.version}</span>
          <span className="pixel-text">{copy.footer.rights}</span>
          <span className="pixel-text">{copy.footer.made}</span>
        </Window>
        <a className="footer-site" href={copy.topBar.homeHref}>
          {copy.footer.site}
        </a>
      </footer>
    </div>
  );
}

export default LinksPage;
