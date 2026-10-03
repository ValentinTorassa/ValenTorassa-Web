import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { ArrowRight, ArrowUpRight, Award, Check, Copy, Download, Languages, Mail, MicVocal } from 'lucide-react';
import headshotPng from './assets/portrait-dark.png';
import headshotFallback from './assets/portrait-dark-384.png';
import headshotAvif256 from './assets/portrait-dark-256.avif';
import headshotAvif384 from './assets/portrait-dark-384.avif';
import headshotAvif512 from './assets/portrait-dark-512.avif';
import headshotWebp256 from './assets/portrait-dark-256.webp';
import headshotWebp384 from './assets/portrait-dark-384.webp';
import headshotWebp512 from './assets/portrait-dark-512.webp';
import { talks, type Talk, type TalkMode } from './events';
import { talkLabelsByLanguage } from './eventsContent';
import { formatTalkDate, formatTalkPlace, splitTalks, todayInArgentina } from './eventSchedule';
import { papers } from './research';
import { getInitialLanguage, setMetaContent } from './site';
import { contactEmail, siteChromeByLanguage, socialLinks, type Language } from './siteContent';
import { SiteFooter, SiteHeader, SocialIcon } from './siteChrome';
import {
  inviteDurations,
  inviteFormats,
  inviteModes,
  speakerKitByLanguage,
  topicOrder,
  topicTalkIds,
  type InviteDuration,
  type InviteFormat,
  type TopicId,
} from './speakerKitContent';

const locales: Record<Language, string> = { es: 'es-AR', en: 'en-US' };
const talkById = new Map(talks.map((talk) => [talk.id, talk]));
/** Papers and posters with a card of their own in /charlas; the rest hang from a talk. */
const standalonePapers = papers.filter((paper) => !paper.talk).length;
const programProfiles = socialLinks.filter((link) => link.name !== 'Email');
const headshotAvif = `${headshotAvif256} 256w, ${headshotAvif384} 384w, ${headshotAvif512} 512w`;
const headshotWebp = `${headshotWebp256} 256w, ${headshotWebp384} 384w, ${headshotWebp512} 512w`;
const headshotFileName = 'valentin-torassa-colombero.png';

type InviteFields = {
  event: string;
  eventUrl: string;
  date: string;
  city: string;
  mode: TalkMode;
  format: InviteFormat;
  duration: InviteDuration;
  topic: TopicId | 'other';
  audience: string;
  name: string;
  email: string;
  org: string;
  message: string;
};

const emptyInvite: InviteFields = {
  event: '',
  eventUrl: '',
  date: '',
  city: '',
  mode: 'presencial',
  format: 'talk',
  duration: '45',
  topic: 'other',
  audience: '',
  name: '',
  email: '',
  org: '',
  message: '',
};

const wordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

/** "14 de noviembre de 2026" / "November 14, 2026" from the date input's YYYY-MM-DD. */
function formatInviteDate(isoDate: string, language: Language) {
  const [year, month, day] = isoDate.split('-').map(Number);
  if (!year || !month || !day) return isoDate;
  return new Intl.DateTimeFormat(locales[language], { dateStyle: 'long', timeZone: 'UTC' })
    .format(new Date(Date.UTC(year, month - 1, day, 12)));
}

/** The request as an email: subject plus a plain-text body, one field per line. */
function draftInvitation(fields: InviteFields, language: Language) {
  const { invite, topics } = speakerKitByLanguage[language];
  const { labels } = invite.mail;
  const value = (text: string) => text.trim();
  const date = fields.date ? formatInviteDate(fields.date, language) : '';
  const mode = talkLabelsByLanguage[language].mode[fields.mode];
  const topic = fields.topic === 'other' ? invite.otherTopic : topics.items[fields.topic].title;
  const line = (label: string, text: string) => (text ? [`${label}: ${text}`] : []);
  const message = value(fields.message);

  const body = [
    invite.mail.greeting,
    '',
    invite.mail.opening,
    '',
    ...line(labels.event, value(fields.event)),
    ...line(labels.site, value(fields.eventUrl)),
    ...line(labels.date, date),
    ...line(labels.place, [value(fields.city), mode].filter(Boolean).join(' · ')),
    ...line(labels.format, invite.formats[fields.format]),
    ...line(labels.duration, invite.durations[fields.duration]),
    ...line(labels.topic, topic),
    ...line(labels.audience, value(fields.audience)),
    '',
    ...line(labels.contact, value(fields.name)),
    ...line(labels.org, value(fields.org)),
    ...line(labels.email, value(fields.email)),
    ...(message ? ['', `${labels.message}:`, message] : []),
    '',
    invite.mail.closing,
    value(fields.name),
  ].join('\n');

  return { subject: invite.mail.subject(value(fields.event), date), body };
}

function mailtoHref(subject: string, body: string) {
  // RFC 6068: line breaks in a mailto body are CRLF.
  return `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.replaceAll('\n', '\r\n'))}`;
}

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof globalThis.setTimeout> | undefined>(undefined);

  useEffect(() => () => globalThis.clearTimeout(timer.current), []);

  const copy = async (key: string, text: string) => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(text);
      ok = true;
    } catch {
      const target = document.createElement('textarea');
      target.value = text;
      target.setAttribute('readonly', '');
      target.style.position = 'fixed';
      target.style.opacity = '0';
      document.body.appendChild(target);
      target.select();
      ok = document.execCommand('copy');
      target.remove();
    }
    if (!ok) return;
    setCopied(key);
    globalThis.clearTimeout(timer.current);
    timer.current = globalThis.setTimeout(() => setCopied(null), 2200);
  };

  return { copied, copy };
}

type SectionProps = { id: string; eyebrow: string; title: string; intro: string; children: ReactNode };

function KitSection({ id, eyebrow, title, intro, children }: SectionProps) {
  return (
    <section className="kit-section" id={id} aria-labelledby={`${id}-title`}>
      <div className="kit-section-head">
        <span className="eyebrow">{eyebrow}</span>
        <h2 id={`${id}-title`}>{title}</h2>
        <p>{intro}</p>
      </div>
      {children}
    </section>
  );
}

type TalkRowsProps = { list: Talk[]; language: Language; currentYear: string };

function TalkRows({ list, language, currentYear }: TalkRowsProps) {
  return (
    <ol className="kit-talk-list">
      {list.map((talk) => {
        const place = formatTalkPlace(talk, language);
        return (
          <li key={talk.id} className="kit-talk-row">
            <time dateTime={talk.date}>{formatTalkDate(talk, language, currentYear)}</time>
            <div>
              <p className="kit-talk-event">{[talk.event, talk.track].filter(Boolean).join(' · ')}</p>
              <a className="kit-talk-title" href={`/charlas/${talk.id}`}>{talk.title[language]}</a>
              {place ? <p className="kit-talk-place">{place}</p> : null}
              {talk.recognition ? (
                <p className="kit-talk-award">
                  <Award aria-hidden="true" />
                  {talk.recognition[language]}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function SpeakerKitPage() {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const [fields, setFields] = useState<InviteFields>(emptyInvite);
  const [drafted, setDrafted] = useState(false);
  const draftRef = useRef<HTMLDivElement | null>(null);
  const { copied, copy } = useCopy();
  const kit = speakerKitByLanguage[language];
  const siteContent = siteChromeByLanguage[language];
  const modeLabels = talkLabelsByLanguage[language].mode;
  const today = todayInArgentina();
  const currentYear = today.slice(0, 4);
  const { upcoming, past } = splitTalks(talks, today);
  const longBio = kit.bio.long.join('\n\n');
  const draft = draftInvitation(fields, language);
  const otherLanguage: Language = language === 'es' ? 'en' : 'es';

  useEffect(() => {
    // The canonical stays https://valentorassa.com/speaker-kit in both languages.
    document.documentElement.lang = language;
    document.title = kit.documentTitle;
    window.localStorage.setItem('vt-language', language);
    setMetaContent('meta[name="description"]', kit.seo.description);
    setMetaContent('meta[property="og:title"]', kit.documentTitle);
    setMetaContent('meta[property="og:description"]', kit.seo.description);
    setMetaContent('meta[property="og:locale"]', kit.seo.locale);
    setMetaContent('meta[name="twitter:title"]', kit.documentTitle);
    setMetaContent('meta[name="twitter:description"]', kit.seo.description);
  }, [kit.documentTitle, kit.seo.description, kit.seo.locale, language]);

  const update = <K extends keyof InviteFields>(key: K, value: InviteFields[K]) =>
    setFields((current) => ({ ...current, [key]: value }));

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDrafted(true);
    window.requestAnimationFrame(() => {
      draftRef.current?.scrollIntoView({ block: 'nearest' });
      draftRef.current?.focus({ preventScroll: true });
    });
  };

  const { fields: labels } = kit.invite;

  return (
    <div className="site-shell">
      <SiteHeader
        language={language}
        onToggleLanguage={() => setLanguage(otherLanguage)}
        labels={siteContent.header}
        navItems={kit.navItems}
        brandHref="/"
        meta={siteContent.footer}
      />

      <main className="kit-page">
        <header className="kit-hero" id="top">
          <div className="kit-hero-text">
            <span className="eyebrow">{kit.eyebrow}</span>
            <h1>{kit.title}</h1>
            <p>{kit.intro}</p>
            <div className="kit-hero-actions">
              <a className="btn btn-primary" href="#invitar">
                <MicVocal aria-hidden="true" />
                {kit.inviteCta}
              </a>
            </div>
            <nav className="kit-jump" aria-label={kit.jumpLabel}>
              {(Object.keys(kit.jump) as Array<keyof typeof kit.jump>).map((id) => (
                <a key={id} href={`#${id}`}>{kit.jump[id]}</a>
              ))}
            </nav>
          </div>

          <figure className="kit-photo" id="foto">
            <picture>
              <source type="image/avif" srcSet={headshotAvif} sizes="(min-width: 900px) 320px, 240px" />
              <source type="image/webp" srcSet={headshotWebp} sizes="(min-width: 900px) 320px, 240px" />
              <img src={headshotFallback} alt={kit.photo.alt} width={384} height={384} decoding="async" />
            </picture>
            <figcaption>
              <a href={headshotPng} download={headshotFileName}>
                <Download aria-hidden="true" />
                {kit.photo.download}
              </a>
              <span>{kit.photo.caption}</span>
            </figcaption>
          </figure>
        </header>

        <KitSection id="bio" eyebrow={kit.bio.eyebrow} title={kit.bio.title} intro={kit.bio.intro}>
          <div className="kit-bio-grid">
            <article className="kit-card kit-bio" aria-labelledby="bio-short-title">
              <div className="kit-card-head">
                <h3 id="bio-short-title">{kit.bio.shortLabel}</h3>
                <span>{kit.bio.words(wordCount(kit.bio.short))}</span>
              </div>
              <p>{kit.bio.short}</p>
              <CopyButton
                done={copied === 'bio-short'}
                label={kit.bio.copy}
                doneLabel={kit.bio.copied}
                onClick={() => copy('bio-short', kit.bio.short)}
              />
            </article>

            <article className="kit-card kit-bio is-long" aria-labelledby="bio-long-title">
              <div className="kit-card-head">
                <h3 id="bio-long-title">{kit.bio.longLabel}</h3>
                <span>{kit.bio.words(wordCount(longBio))}</span>
              </div>
              {kit.bio.long.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <CopyButton
                done={copied === 'bio-long'}
                label={kit.bio.copy}
                doneLabel={kit.bio.copied}
                onClick={() => copy('bio-long', longBio)}
              />
            </article>

            <aside className="kit-card kit-program" aria-labelledby="bio-program-title">
              <h3 id="bio-program-title">{kit.bio.program.title}</h3>
              <p className="kit-program-name">Valentín Torassa Colombero</p>
              <p>{kit.bio.program.role}</p>
              <p>{kit.bio.program.place}</p>
              <p className="kit-program-label">{kit.bio.program.profiles}</p>
              <ul className="kit-profiles">
                {programProfiles.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} target="_blank" rel="noopener noreferrer">
                      <SocialIcon link={link} />
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
              <button type="button" className="kit-text-button" onClick={() => setLanguage(otherLanguage)}>
                <Languages aria-hidden="true" />
                {kit.bio.otherLanguage}
              </button>
            </aside>
          </div>
        </KitSection>

        <KitSection id="temas" eyebrow={kit.topics.eyebrow} title={kit.topics.title} intro={kit.topics.intro}>
          <ul className="kit-topics">
            {topicOrder.map((id) => {
              const topic = kit.topics.items[id];
              const backing = topicTalkIds[id].map((talkId) => talkById.get(talkId)).filter((talk): talk is Talk => Boolean(talk));
              return (
                <li key={id} className="kit-card kit-topic" id={`tema-${id}`}>
                  <h3>{topic.title}</h3>
                  <p>{topic.text}</p>
                  <p className="kit-program-label">{kit.topics.talksLabel}</p>
                  <ul>
                    {backing.map((talk) => (
                      <li key={talk.id}>
                        <a href={`/charlas/${talk.id}`}>{talk.title[language]}</a>
                        <span>{talk.event}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        </KitSection>

        <KitSection id="charlas" eyebrow={kit.talks.eyebrow} title={kit.talks.title} intro={kit.talks.intro}>
          <div className="kit-talks">
            <div className="kit-talks-column" id="charlas-proximas">
              <div className="events-section-head">
                <h3>{kit.talks.upcomingTitle}</h3>
                <span className="events-count">{upcoming.length}</span>
              </div>
              {upcoming.length > 0 ? (
                <TalkRows list={upcoming} language={language} currentYear={currentYear} />
              ) : (
                <p className="events-empty">{kit.talks.emptyUpcoming}</p>
              )}
            </div>
            <div className="kit-talks-column is-past" id="charlas-anteriores">
              <div className="events-section-head">
                <h3>{kit.talks.pastTitle}</h3>
                <span className="events-count">{past.length}</span>
              </div>
              <TalkRows list={past} language={language} currentYear={currentYear} />
            </div>
          </div>
          <p className="kit-talks-more">
            {kit.talks.papers(standalonePapers)}{' '}
            <a href="/charlas">
              {kit.talks.hubLink}
              <ArrowRight aria-hidden="true" />
            </a>
            <a href="/eventos">
              {kit.talks.agendaLink}
              <ArrowRight aria-hidden="true" />
            </a>
          </p>
        </KitSection>

        <KitSection id="datos" eyebrow={kit.practical.eyebrow} title={kit.practical.title} intro={kit.practical.intro}>
          <dl className="kit-facts">
            {kit.practical.items.map((item) => (
              <div key={item.key} className="kit-card">
                <dt>{item.label}</dt>
                <dd>{item.text}</dd>
              </div>
            ))}
          </dl>
        </KitSection>

        <KitSection id="invitar" eyebrow={kit.invite.eyebrow} title={kit.invite.title} intro={kit.invite.intro}>
          <form className="kit-card kit-form" onSubmit={onSubmit}>
            <label className="kit-field is-wide">
              <span>{labels.event} <i className="kit-required" aria-hidden="true">*</i></span>
              <input
                name="event"
                required
                value={fields.event}
                placeholder={labels.eventPlaceholder}
                onChange={(event) => update('event', event.target.value)}
              />
            </label>
            <label className="kit-field">
              <span>{labels.date} <i className="kit-required" aria-hidden="true">*</i></span>
              <input name="date" type="date" required value={fields.date} onChange={(event) => update('date', event.target.value)} />
            </label>
            <label className="kit-field">
              <span>{labels.eventUrl}</span>
              <input
                name="eventUrl"
                type="url"
                inputMode="url"
                placeholder="https://"
                value={fields.eventUrl}
                onChange={(event) => update('eventUrl', event.target.value)}
              />
            </label>
            <label className="kit-field">
              <span>{labels.city}</span>
              <input name="city" value={fields.city} onChange={(event) => update('city', event.target.value)} />
            </label>
            <fieldset className="kit-field kit-choice">
              <legend>{labels.mode}</legend>
              {inviteModes.map((mode) => (
                <label key={mode}>
                  <input
                    type="radio"
                    name="mode"
                    value={mode}
                    checked={fields.mode === mode}
                    onChange={() => update('mode', mode)}
                  />
                  {modeLabels[mode]}
                </label>
              ))}
            </fieldset>
            <label className="kit-field">
              <span>{labels.format}</span>
              <select name="format" value={fields.format} onChange={(event) => update('format', event.target.value as InviteFormat)}>
                {inviteFormats.map((format) => <option key={format} value={format}>{kit.invite.formats[format]}</option>)}
              </select>
            </label>
            <label className="kit-field">
              <span>{labels.duration}</span>
              <select name="duration" value={fields.duration} onChange={(event) => update('duration', event.target.value as InviteDuration)}>
                {inviteDurations.map((duration) => <option key={duration} value={duration}>{kit.invite.durations[duration]}</option>)}
              </select>
            </label>
            <label className="kit-field is-wide">
              <span>{labels.topic}</span>
              <select name="topic" value={fields.topic} onChange={(event) => update('topic', event.target.value as TopicId | 'other')}>
                {topicOrder.map((id) => <option key={id} value={id}>{kit.topics.items[id].title}</option>)}
                <option value="other">{kit.invite.otherTopic}</option>
              </select>
            </label>
            <label className="kit-field is-wide">
              <span>{labels.audience} <i className="kit-required" aria-hidden="true">*</i></span>
              <input
                name="audience"
                required
                value={fields.audience}
                placeholder={labels.audiencePlaceholder}
                onChange={(event) => update('audience', event.target.value)}
              />
            </label>
            <label className="kit-field">
              <span>{labels.name} <i className="kit-required" aria-hidden="true">*</i></span>
              <input name="name" required autoComplete="name" value={fields.name} onChange={(event) => update('name', event.target.value)} />
            </label>
            <label className="kit-field">
              <span>{labels.email} <i className="kit-required" aria-hidden="true">*</i></span>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                value={fields.email}
                onChange={(event) => update('email', event.target.value)}
              />
            </label>
            <label className="kit-field is-wide">
              <span>{labels.org}</span>
              <input
                name="org"
                autoComplete="organization"
                value={fields.org}
                placeholder={labels.orgPlaceholder}
                onChange={(event) => update('org', event.target.value)}
              />
            </label>
            <label className="kit-field is-wide">
              <span>{labels.message}</span>
              <textarea
                name="message"
                rows={4}
                value={fields.message}
                placeholder={labels.messagePlaceholder}
                onChange={(event) => update('message', event.target.value)}
              />
            </label>
            <div className="kit-form-footer is-wide">
              <p>{kit.invite.requiredNote} {kit.invite.privacy}</p>
              <button type="submit" className="btn btn-primary">
                <Mail aria-hidden="true" />
                {kit.invite.submit}
              </button>
            </div>
          </form>

          {drafted ? (
            <div className="kit-card kit-draft" ref={draftRef} tabIndex={-1} aria-labelledby="invitar-draft-title">
              <h3 id="invitar-draft-title">{kit.invite.draftTitle}</h3>
              <p>{kit.invite.draftLead}</p>
              <pre className="kit-draft-text">
                <strong>{draft.subject}</strong>
                {'\n\n'}
                {draft.body}
              </pre>
              <div className="kit-draft-actions">
                <a className="btn btn-primary kit-mailto" href={mailtoHref(draft.subject, draft.body)}>
                  <ArrowUpRight aria-hidden="true" />
                  {kit.invite.openMail}
                </a>
                <CopyButton
                  done={copied === 'draft'}
                  label={kit.invite.copyDraft}
                  doneLabel={kit.invite.copiedDraft}
                  onClick={() => copy('draft', `${draft.subject}\n\n${draft.body}`)}
                />
              </div>
              <p className="kit-draft-fallback">
                {kit.invite.fallbackBefore} <a href={`mailto:${contactEmail}`}>{contactEmail}</a>{kit.invite.fallbackAfter}
              </p>
            </div>
          ) : null}
        </KitSection>
      </main>

      <SiteFooter backToTopLabel={siteContent.footer.backToTopLabel} />
    </div>
  );
}

type CopyButtonProps = { done: boolean; label: string; doneLabel: string; onClick: () => void };

function CopyButton({ done, label, doneLabel, onClick }: CopyButtonProps) {
  return (
    <button type="button" className="btn btn-secondary kit-copy" onClick={onClick}>
      {done ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
      <span aria-live="polite">{done ? doneLabel : label}</span>
    </button>
  );
}

export default SpeakerKitPage;
