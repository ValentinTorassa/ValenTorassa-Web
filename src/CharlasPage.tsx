import { useCallback, useEffect, useRef, useState, type ComponentType } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Castle,
  Code2,
  FileDown,
  Flame,
  GitBranch,
  GitPullRequest,
  GraduationCap,
  KeyRound,
  Layers,
  Link,
  Lock,
  MessageSquare,
  Shield,
  Terminal,
  Users,
  Webhook,
  Workflow,
  type LucideProps,
} from 'lucide-react';
import { charlasPageByLanguage, contentByLanguage, type Language } from './content';
import { talks, type Talk } from './events';
import { formatTalkDate, formatTalkPlace, formatTalkTime, isPastTalk, slidesAvailable, todayInArgentina } from './eventSchedule';
import type { HubScene } from './hubScene';
import { paperMedia, paperOfTalk, papers, type Paper } from './research';
import { getInitialLanguage, setMetaContent } from './site';
import { SiteHeader } from './siteChrome';
import { talkMedia, type TalkIcon, type TalkMedia } from './talkMedia';
import { SITE_ORIGIN, talkPageMeta } from './talkSeo';

const ICONS: Record<TalkIcon, ComponentType<LucideProps>> = {
  terminal: Terminal, lock: Lock, shield: Shield, 'pull-request': GitPullRequest, key: KeyRound, castle: Castle,
  webhook: Webhook, flame: Flame, branch: GitBranch, chat: MessageSquare, workflow: Workflow, layers: Layers,
  link: Link, users: Users, cap: GraduationCap, book: BookOpen,
};

/** A card in the hub: a talk (with the paper it presented, if any) or a paper of its own. */
type Entry = Talk & { kind: 'talk' | Paper['kind']; paper?: Paper };

const paperEntry = (paper: Paper): Entry => ({
  id: paper.id,
  date: paper.date,
  datePrecision: paper.datePrecision,
  event: paper.venue,
  track: paper.track,
  city: paper.city,
  title: paper.title,
  status: 'confirmed',
  kind: paper.kind,
  paper,
});

/** Oldest to newest, like a row of saves: the selector opens on the next talk. */
const roster: Entry[] = [
  ...talks.map((talk): Entry => ({ ...talk, kind: 'talk', paper: paperOfTalk(talk.id) })),
  ...papers.filter((paper) => !paper.talk).map(paperEntry),
].sort((a, b) => `${a.date} ${a.time ?? ''}`.localeCompare(`${b.date} ${b.time ?? ''}`));

const yearOf = (entry: Entry) => entry.date.slice(0, 4);
/** Index of the first entry of each year: the cuts in the selector row, and where ↑ ↓ jump. */
const yearStarts = roster.flatMap((entry, index) => (index === 0 || yearOf(roster[index - 1]) !== yearOf(entry) ? [index] : []));

const mediaOf = (entry: Entry): TalkMedia =>
  entry.kind === 'talk' ? talkMedia[entry.id] ?? {} : entry.paper ? paperMedia(entry.paper) : {};

const iconOf = (entry: Entry): TalkIcon => mediaOf(entry).icon ?? 'layers';

/**
 * What Enter and the main button open: from the talk's day on, the hosted deck
 * (or the PDF when there is none); otherwise the paper, if the entry has one.
 */
function openUrlOf(entry: Entry, today: string): string | undefined {
  const slides = entry.date <= today ? mediaOf(entry).deck ?? (slidesAvailable(entry, today) ? entry.slidesUrl : undefined) : undefined;
  return slides ?? entry.paper?.url;
}

/** `/charlas/<id>` has its own static HTML, with hash and query links kept for compatibility. */
function idFromLocation(): string | null {
  const path = /^\/charlas\/([^/]+)\/?$/.exec(window.location.pathname);
  if (path) return decodeURIComponent(path[1]);
  if (window.location.hash.length > 1) return decodeURIComponent(window.location.hash.slice(1));
  return new URLSearchParams(window.location.search).get('c');
}

function writeLocation(id: string) {
  const { pathname, search } = window.location;
  // Vite dev uses charlas.html; production and preview have a static page for every id.
  const url = pathname.startsWith('/charlas') && !pathname.endsWith('.html')
    ? `/charlas/${encodeURIComponent(id)}${search}`
    : `${pathname}${search}#${encodeURIComponent(id)}`;
  window.history.replaceState(null, '', url);
}

function defaultIndex(today: string) {
  const byUrl = roster.findIndex((talk) => talk.id === idFromLocation());
  if (byUrl >= 0) return byUrl;
  const next = roster.findIndex((talk) => !isPastTalk(talk, today));
  return next >= 0 ? next : roster.length - 1;
}

/** Letters for talks with no picture, like a save file with a default icon. */
function glyph(talk: Talk) {
  const words = talk.event.replace(/[^\p{L}\p{N} ]/gu, ' ').split(/\s+/).filter((word) => word && !/^\d+$/.test(word));
  const letters = words.length === 1 ? words[0].slice(0, 3) : words.map((word) => word[0]).join('');
  return (letters || talk.event).slice(0, 3).toUpperCase();
}

const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
const pad = (value: number) => String(value).padStart(2, '0');

function CharlasPage() {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const copy = charlasPageByLanguage[language];
  const siteContent = contentByLanguage[language];
  const today = todayInArgentina();
  const currentYear = today.slice(0, 4);
  const [selected, setSelected] = useState(() => defaultIndex(today));
  const selectedRef = useRef(selected);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const iconsRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<HubScene | null>(null);
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const talk = roster[selected];
  const media = mediaOf(talk);
  const dayHasCome = talk.date <= today;
  const slidesUrl = slidesAvailable(talk, today) ? talk.slidesUrl : undefined;
  // The hosted deck (with its animations) opens first; the Drive PDF stays as the download.
  const deckUrl = dayHasCome ? media.deck ?? slidesUrl : undefined;
  const openUrl = openUrlOf(talk, today);
  const hasSlides = Boolean(media.deck || talk.slidesUrl);
  const coauthors = talk.kind !== 'talk' && talk.paper ? talk.paper.authors.slice(1) : [];
  const showReel = Boolean(media.reel) && dayHasCome && !reducedMotion();
  const date = formatTalkDate(talk, language, currentYear);
  const meta = [
    formatTalkPlace(talk, language) || talk.city,
    [date, formatTalkTime(talk)].filter(Boolean).join(', '),
    media.slides ? copy.slides(media.slides) : '',
    talk.track ?? '',
    coauthors.length ? copy.coauthors(coauthors) : '',
  ].filter(Boolean);

  useEffect(() => {
    const entryMeta = idFromLocation() ? talkPageMeta(talk.id, language) : undefined;
    const title = entryMeta?.title ?? copy.documentTitle;
    const description = entryMeta?.description ?? copy.seo.description;
    document.documentElement.lang = language;
    document.title = title;
    window.localStorage.setItem('vt-language', language);
    setMetaContent('meta[name="description"]', description);
    setMetaContent('meta[property="og:title"]', title);
    setMetaContent('meta[property="og:description"]', description);
    setMetaContent('meta[property="og:locale"]', copy.seo.locale);
    setMetaContent('meta[name="twitter:title"]', title);
    setMetaContent('meta[name="twitter:description"]', description);
    const url = entryMeta?.url ?? `${SITE_ORIGIN}/charlas`;
    const image = entryMeta?.image ?? `${SITE_ORIGIN}/og-charlas.png`;
    const imageAlt = entryMeta?.imageAlt ?? 'Charlas de Valentín Torassa Colombero';
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', url);
    setMetaContent('meta[property="og:url"]', url);
    setMetaContent('meta[property="og:image"]', image);
    setMetaContent('meta[property="og:image:alt"]', imageAlt);
    setMetaContent('meta[name="twitter:image"]', image);
    setMetaContent('meta[name="twitter:image:alt"]', imageAlt);
  }, [copy.documentTitle, copy.seo.description, copy.seo.locale, language, talk.id]);

  const iconMarkup = (index: number) =>
    iconsRef.current?.querySelector(`[data-icon="${iconOf(roster[index])}"]`)?.outerHTML;

  // The 3D backdrop loads after the page is on screen, and only on this page.
  useEffect(() => {
    let cancelled = false;
    let scene: HubScene | null = null;
    void import('./hubScene').then(async ({ createHubScene }) => {
      if (cancelled || !canvasRef.current) return;
      scene = await createHubScene(canvasRef.current, reducedMotion());
      if (cancelled) {
        scene?.dispose();
        return;
      }
      sceneRef.current = scene;
      const svg = iconMarkup(selectedRef.current);
      if (scene && svg) scene.setIcon(svg);
    });
    return () => {
      cancelled = true;
      scene?.dispose();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    selectedRef.current = selected;
    const svg = iconMarkup(selected);
    if (sceneRef.current && svg) sceneRef.current.setIcon(svg);
    // Center the card inside the selector row only: scrollIntoView would also scroll the page.
    const card = cardRefs.current[selected];
    const row = card?.closest<HTMLElement>('.hub-deck-row');
    if (card && row) {
      row.scrollTo({ left: card.offsetLeft - (row.clientWidth - card.clientWidth) / 2, behavior: reducedMotion() ? 'auto' : 'smooth' });
    }
  }, [selected]);

  const select = useCallback((index: number, focus = false) => {
    const next = Math.max(0, Math.min(roster.length - 1, index));
    setSelected(next);
    writeLocation(roster[next].id);
    if (focus) cardRefs.current[next]?.focus({ preventScroll: true });
  }, []);

  // A link to #<id> on this page, or back/forward, changes the talk without a reload.
  useEffect(() => {
    const follow = () => {
      const index = roster.findIndex((item) => item.id === idFromLocation());
      if (index >= 0) setSelected(index);
    };
    window.addEventListener('hashchange', follow);
    window.addEventListener('popstate', follow);
    return () => {
      window.removeEventListener('hashchange', follow);
      window.removeEventListener('popstate', follow);
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea')) return;
      const onCard = target?.classList.contains('deck-card') ?? false;

      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        select(selectedRef.current + (event.key === 'ArrowRight' ? 1 : -1), onCard);
      } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        // A year at a time: ↓ to the first entry of the next year, ↑ to that of this one or the one before.
        event.preventDefault();
        const current = selectedRef.current;
        const next = event.key === 'ArrowDown'
          ? yearStarts.find((start) => start > current)
          : [...yearStarts].reverse().find((start) => start < current);
        if (next !== undefined) select(next, onCard);
      } else if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault();
        select(event.key === 'Home' ? 0 : roster.length - 1, onCard);
      } else if (event.key === 'Enter' && (onCard || !target?.closest('a, button'))) {
        const open = openUrlOf(roster[selectedRef.current], todayInArgentina());
        if (open) {
          event.preventDefault();
          if (open.startsWith('/')) window.location.assign(open);
          else window.open(open, '_blank', 'noopener');
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [select]);

  return (
    <div className="hub">
      <canvas className="hub-canvas" ref={canvasRef} aria-hidden="true" />

      <SiteHeader
        language={language}
        onToggleLanguage={() => setLanguage((current) => (current === 'es' ? 'en' : 'es'))}
        labels={siteContent.header}
        navItems={copy.navItems}
        brandHref="/"
        meta={siteContent.footer}
        variant="inline"
      />

      <main className="hub-main">
        <section className="hub-info" aria-live="polite">
          <p className="hub-count">
            <i aria-hidden="true" />
            {pad(selected + 1)} / {pad(roster.length)}
            {talk.kind !== 'talk' ? (
              <span className="hub-soon is-paper">{copy.kinds[talk.kind]}</span>
            ) : !isPastTalk(talk, today) ? (
              <span className="hub-soon">{copy.upcoming}</span>
            ) : null}
          </p>
          <h1>{copy.title}</h1>
          <h2 className={`hub-name${talk.title[language].length > 90 ? ' is-long' : ''}`} key={talk.id}>
            {talk.title[language]}
          </h2>
          <p className="hub-meta">{meta.join(' · ')}</p>
          {talk.recognition ? <p className="hub-note">{talk.recognition[language]}</p> : null}

          <div className="hub-actions">
            {openUrl ? (
              <a
                className="hub-open"
                href={openUrl}
                {...(openUrl.startsWith('/') ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
              >
                {deckUrl ? copy.openLabel : copy.paperLabel}
                <ArrowRight aria-hidden="true" />
              </a>
            ) : (
              <span className="hub-open is-off">{hasSlides ? copy.slidesOn(date) : copy.noSlides}</span>
            )}
            {slidesUrl && media.deck ? (
              <a className="hub-link" href={slidesUrl} target="_blank" rel="noopener noreferrer">
                <FileDown aria-hidden="true" />
                PDF
              </a>
            ) : null}
            {deckUrl && talk.paper ? (
              <a className="hub-link" href={talk.paper.url} target="_blank" rel="noopener noreferrer">
                <BookOpen aria-hidden="true" />
                {copy.kinds[talk.paper.kind]}
              </a>
            ) : null}
            {media.code && dayHasCome ? (
              <a className="hub-link" href={media.code} target="_blank" rel="noopener noreferrer">
                <Code2 aria-hidden="true" />
                {copy.codeLabel}
              </a>
            ) : null}
            {talk.url ? (
              <a className="hub-link" href={talk.url} target="_blank" rel="noopener noreferrer">
                {copy.officialLabel}
                <ArrowUpRight aria-hidden="true" />
              </a>
            ) : null}
          </div>
          <p className="hub-hint">
            <kbd>Enter</kbd> {copy.hintOpen}
            <kbd>←</kbd>
            <kbd>→</kbd> {copy.hintMove}
            <kbd>↑</kbd>
            <kbd>↓</kbd> {copy.hintYear}
          </p>
        </section>

        <div className="hub-stage" aria-hidden="true">
          <div className="hub-screen" key={talk.id}>
            {showReel ? (
              <video src={media.reel} poster={media.poster} autoPlay muted loop playsInline />
            ) : dayHasCome && media.poster ? (
              <img src={media.poster} alt="" />
            ) : dayHasCome && media.page ? (
              <img src={media.page} alt="" />
            ) : media.still ? (
              <img src={media.still} alt="" />
            ) : media.cover ? (
              <img src={media.cover} alt="" />
            ) : (
              <div className="hub-titlecard">
                <span>{[talk.event, talk.track].filter(Boolean).join(' · ')}</span>
                <strong>{talk.title[language]}</strong>
                <em>{glyph(talk)}</em>
              </div>
            )}
            <span className="hub-corner tl" />
            <span className="hub-corner br" />
            {media.slides ? <span className="hub-screen-count">01 / {pad(media.slides)}</span> : null}
          </div>
        </div>
      </main>

      <nav className="hub-deck" aria-label={copy.listLabel}>
        <div className="hub-deck-row" role="listbox" aria-label={copy.listLabel} aria-activedescendant={`card-${talk.id}`}>
          {yearStarts.map((start, group) => {
            const end = yearStarts[group + 1] ?? roster.length;
            const year = yearOf(roster[start]);
            // Each year opens with a cut: the year, big, that stays at the left while its entries
            // scroll past and jumps to the first of them when clicked.
            return (
              <div key={year} className="deck-group" role="group" aria-label={year}>
                <button
                  type="button"
                  tabIndex={-1}
                  className={`deck-year${year === yearOf(talk) ? ' is-current' : ''}`}
                  aria-label={copy.yearLabel(year)}
                  onClick={() => select(start)}
                >
                  {year}
                </button>
                {roster.slice(start, end).map((item, offset) => {
                  const index = start + offset;
                  const itemMedia = mediaOf(item);
                  const picture = itemMedia.thumb ?? itemMedia.cover;
                  const isSelected = index === selected;
                  return (
                    <button
                      key={item.id}
                      ref={(element) => {
                        cardRefs.current[index] = element;
                      }}
                      id={`card-${item.id}`}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      tabIndex={isSelected ? 0 : -1}
                      className={`deck-card${isSelected ? ' is-selected' : ''}`}
                      onClick={() => select(index)}
                    >
                      <span className="deck-thumb">
                        {picture ? (
                          <img src={picture} alt="" loading="lazy" decoding="async" />
                        ) : (
                          <em>{glyph(item)}</em>
                        )}
                      </span>
                      <span className="deck-label">
                        {item.kind !== 'talk' ? `${copy.kinds[item.kind]} · ${item.event}` : item.track ?? item.event}
                      </span>
                      <span className="deck-date">{formatTalkDate(item, language, year)}</span>
                      <span className="sr-only">{item.title[language]}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </nav>

      <div hidden ref={iconsRef}>
        {Object.entries(ICONS).map(([key, Icon]) => (
          <Icon key={key} data-icon={key} />
        ))}
      </div>
    </div>
  );
}

export default CharlasPage;
