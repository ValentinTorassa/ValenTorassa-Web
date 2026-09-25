import { ArrowUpRight, Award, Clock3, MapPin, Presentation } from 'lucide-react';
import type { Language, TalkLabels } from './content';
import type { Talk } from './events';
import {
  formatTalkPlace,
  formatTalkTime,
  groupConsecutiveByEvent,
  talkDateParts,
  todayInArgentina,
} from './eventSchedule';
import { slidesHref } from './talkMedia';

type TalkChipsProps = {
  talk: Talk;
  labels: TalkLabels;
  /** Past talks only show how they were given, not their booking status. */
  showStatus: boolean;
};

export function TalkChips({ talk, labels, showStatus }: TalkChipsProps) {
  if (!showStatus && !talk.mode) return null;

  return (
    <div className="talk-chips">
      {showStatus ? (
        <span className={`talk-chip chip-${talk.status}`}>{labels.status[talk.status]}</span>
      ) : null}
      {talk.mode ? <span className={`talk-chip chip-${talk.mode}`}>{labels.mode[talk.mode]}</span> : null}
    </div>
  );
}

type TalkListProps = {
  talks: Talk[];
  language: Language;
  labels: TalkLabels;
  currentYear: string;
  isPast: boolean;
};

/** Talks in order, with consecutive talks at the same event shown as one block. */
export function TalkList({ talks, language, labels, currentYear, isPast }: TalkListProps) {
  return (
    <ol className="talk-list">
      {groupConsecutiveByEvent(talks).map((run) => {
        if (run.talks.length === 1) {
          const [talk] = run.talks;

          return (
            <li key={talk.id}>
              <TalkCard talk={talk} language={language} labels={labels} currentYear={currentYear} isPast={isPast} />
            </li>
          );
        }

        const first = run.talks[0];
        const cities = [...new Set(run.talks.map((talk) => talk.city).filter(Boolean))];
        const days = [...new Set(run.talks.flatMap((talk) => [talk.date, talk.endDate ?? talk.date]))].sort();
        const span: Talk = { ...first, date: days[0], endDate: days.at(-1), datePrecision: undefined };
        const dateParts = talkDateParts(span, language, currentYear);
        const count = run.talks.length;
        const groupId = `${first.id}-group`;

        return (
          <li key={groupId} className="talk-group">
            <div className="talk-group-head">
              <h3 id={groupId}>{run.event}</h3>
              <p>
                {[
                  [dateParts.main, dateParts.bottom].filter(Boolean).join(' '),
                  cities.length === 1 ? cities[0] : '',
                  `${count} ${count === 1 ? labels.talkCount.one : labels.talkCount.other}`,
                ].filter(Boolean).join(' · ')}
              </p>
            </div>
            <ol className="talk-list">
              {run.talks.map((talk) => (
                <li key={talk.id}>
                  <TalkCard
                    talk={talk}
                    language={language}
                    labels={labels}
                    currentYear={currentYear}
                    isPast={isPast}
                    inGroup
                  />
                </li>
              ))}
            </ol>
          </li>
        );
      })}
    </ol>
  );
}

type TalkCardProps = {
  talk: Talk;
  language: Language;
  labels: TalkLabels;
  currentYear: string;
  isPast: boolean;
  inGroup?: boolean;
};

function TalkCard({ talk, language, labels, currentYear, isPast, inGroup = false }: TalkCardProps) {
  const dateParts = talkDateParts(talk, language, currentYear);
  const time = formatTalkTime(talk);
  const place = formatTalkPlace(talk, language);
  const kicker = inGroup ? talk.track : [talk.event, talk.track].filter(Boolean).join(' · ');
  const Title = inGroup ? 'h4' : 'h3';
  const slidesUrl = slidesHref(talk, todayInArgentina());
  const slidesOutside = slidesUrl?.startsWith('http');

  return (
    <article className={`talk-card status-${talk.status}`} id={talk.id}>
      <time className="talk-date" dateTime={talk.date}>
        {dateParts.top ? <span>{dateParts.top}</span> : null}
        <strong>{dateParts.main}</strong>
        {dateParts.bottom ? <span className="talk-date-bottom">{dateParts.bottom}</span> : null}
      </time>

      <div className="talk-body">
        {kicker ? <p className="talk-kicker">{kicker}</p> : null}
        <Title className="talk-title">{talk.title[language]}</Title>

        {time || place ? (
          <ul className="talk-meta">
            {time ? (
              <li>
                <Clock3 aria-hidden="true" />
                {time}
              </li>
            ) : null}
            {place ? (
              <li>
                <MapPin aria-hidden="true" />
                {place}
              </li>
            ) : null}
          </ul>
        ) : null}

        {talk.note ? <p className="talk-note">{talk.note[language]}</p> : null}

        {talk.recognition ? (
          <p className="talk-recognition">
            <Award aria-hidden="true" />
            {talk.recognition[language]}
          </p>
        ) : null}

        <div className="talk-footer">
          <TalkChips talk={talk} labels={labels} showStatus={!isPast} />
          {talk.url || slidesUrl ? (
            <div className="talk-links">
              {talk.url ? (
                <a href={talk.url} target="_blank" rel="noopener noreferrer">
                  {labels.officialLinkLabel}
                  <ArrowUpRight aria-hidden="true" />
                </a>
              ) : null}
              {slidesUrl ? (
                <a href={slidesUrl} {...(slidesOutside ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                  <Presentation aria-hidden="true" />
                  {labels.slidesLabel}
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
