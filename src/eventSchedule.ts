import type { Language } from './siteContent';
import type { Talk } from './events';

/** Talks are scheduled, and move to "past", in Argentina time. */
export const ARGENTINA_TIME_ZONE = 'America/Argentina/Buenos_Aires';

// Short day and month names are spelled out here instead of asked from Intl: ICU versions
// disagree (Node 26 says "sep" for es-AR, Chrome 157 "sept"), and a page rendered with one
// and hydrated with the other throws React error #418.
const shortNames: Record<Language, { weekdays: string[]; months: string[] }> = {
  es: {
    weekdays: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
    months: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sept', 'oct', 'nov', 'dic'],
  },
  en: {
    weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
};

/** Today's date in Argentina as ISO `YYYY-MM-DD`. */
export function todayInArgentina(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: ARGENTINA_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? '';

  return `${get('year')}-${get('month')}-${get('day')}`;
}

function parseDay(isoDate: string) {
  const [year, month, day] = isoDate.split('-').map(Number);
  // Noon UTC keeps the calendar day stable whatever the formatter's offset.
  return new Date(Date.UTC(year, month - 1, day, 12));
}

/** Last calendar day the talk can take place on, as ISO `YYYY-MM-DD`. */
function lastDay(talk: Talk) {
  const end = talk.endDate ?? talk.date;
  const [year, month] = end.split('-').map(Number);

  if (talk.datePrecision === 'year') return `${year}-12-31`;
  if (talk.datePrecision === 'month') {
    const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
    return `${end.slice(0, 7)}-${String(days).padStart(2, '0')}`;
  }

  return end;
}

/**
 * The release date controls when a slide link appears in the site UI. Deck files copied
 * to public/ are reachable by direct URL before that date; this is not access control.
 */
export function slidesReleased(talk: Talk, today: string): boolean {
  return (talk.slidesReleaseDate ?? talk.date) <= today;
}

export function slidesAvailable(talk: Talk, today: string): boolean {
  return Boolean(talk.slidesUrl) && slidesReleased(talk, today);
}

/** A talk is past once its last day is before `today` (Argentina). */
export function isPastTalk(talk: Talk, today: string) {
  return lastDay(talk) < today;
}

function sortKey(talk: Talk) {
  // A multi-day slot with no fixed time yet sorts after the scheduled talks of
  // those days, so a block like Ekoparty reads fixed slots first.
  const day = !talk.time && talk.endDate ? talk.endDate : talk.date;
  return `${day} ${talk.time ?? '99:99'}`;
}

/** Upcoming talks soonest first, past talks most recent first. */
export function splitTalks(list: Talk[], today: string) {
  const upcoming = list
    .filter((talk) => !isPastTalk(talk, today))
    .sort((a, b) => sortKey(a).localeCompare(sortKey(b)));
  const past = list
    .filter((talk) => isPastTalk(talk, today))
    .sort((a, b) => sortKey(b).localeCompare(sortKey(a)));

  return { upcoming, past };
}

export type TalkRun = { event: string; talks: Talk[] };

/** Groups consecutive talks of the same event, e.g. the Ekoparty days. */
export function groupConsecutiveByEvent(list: Talk[]): TalkRun[] {
  const runs: TalkRun[] = [];

  list.forEach((talk) => {
    const last = runs.at(-1);
    if (last && last.event === talk.event) last.talks.push(talk);
    else runs.push({ event: talk.event, talks: [talk] });
  });

  return runs;
}

const weekday = (date: Date, language: Language) => shortNames[language].weekdays[date.getUTCDay()];
const monthName = (date: Date, language: Language) => shortNames[language].months[date.getUTCMonth()];

/** A day for the /links lines: "vie, 6 nov 2026" or "Fri, Nov 6, 2026"; the year only when asked. */
export function formatShortDay(isoDate: string, language: Language, withYear = false): string {
  const date = parseDay(isoDate);
  const day = date.getUTCDate();
  const year = withYear ? `${language === 'es' ? ' ' : ', '}${date.getUTCFullYear()}` : '';

  return language === 'es'
    ? `${weekday(date, language)}, ${day} ${monthName(date, language)}${year}`
    : `${weekday(date, language)}, ${monthName(date, language)} ${day}${year}`;
}

/** Pieces for the calendar-style date badge on /eventos. */
export type TalkDateParts = {
  top?: string;
  main: string;
  bottom?: string;
};

export function talkDateParts(talk: Talk, language: Language, currentYear: string): TalkDateParts {
  const start = parseDay(talk.date);
  const year = talk.date.slice(0, 4);
  const withYear = (text: string) => (year === currentYear ? text : `${text} ${year}`);

  if (talk.datePrecision === 'year') return { main: year };
  if (talk.datePrecision === 'month') return { main: monthName(start, language), bottom: year };

  if (talk.endDate && talk.endDate !== talk.date) {
    const end = parseDay(talk.endDate);
    const sameMonth = talk.date.slice(0, 7) === talk.endDate.slice(0, 7);

    return {
      top: `${weekday(start, language)}-${weekday(end, language)}`,
      main: `${start.getUTCDate()}-${end.getUTCDate()}`,
      bottom: withYear(sameMonth
        ? monthName(start, language)
        : `${monthName(start, language)}-${monthName(end, language)}`),
    };
  }

  return {
    top: weekday(start, language),
    main: String(start.getUTCDate()),
    bottom: withYear(monthName(start, language)),
  };
}

/** One-line date, e.g. "vie 2 oct" / "Fri Oct 2", "7-9 oct" / "Oct 7-9", "may 2026". */
export function formatTalkDate(talk: Talk, language: Language, currentYear: string): string {
  const start = parseDay(talk.date);
  const year = talk.date.slice(0, 4);
  const month = monthName(start, language);
  const yearSuffix = year === currentYear ? '' : language === 'es' ? ` ${year}` : `, ${year}`;

  if (talk.datePrecision === 'year') return year;
  if (talk.datePrecision === 'month') return `${month} ${year}`;

  if (talk.endDate && talk.endDate !== talk.date) {
    const end = parseDay(talk.endDate);
    const endMonth = monthName(end, language);
    const days = month === endMonth
      ? `${start.getUTCDate()}-${end.getUTCDate()}`
      : null;

    if (language === 'es') {
      return `${days ? `${days} ${month}` : `${start.getUTCDate()} ${month} - ${end.getUTCDate()} ${endMonth}`}${yearSuffix}`;
    }

    return `${days ? `${month} ${days}` : `${month} ${start.getUTCDate()} - ${endMonth} ${end.getUTCDate()}`}${yearSuffix}`;
  }

  const day = start.getUTCDate();
  return language === 'es'
    ? `${weekday(start, language)} ${day} ${month}${yearSuffix}`
    : `${weekday(start, language)} ${month} ${day}${yearSuffix}`;
}

/** "11:15-12:00", "18:30" or an empty string when the time is not set. */
export function formatTalkTime(talk: Talk): string {
  if (!talk.time) return '';
  return talk.endTime ? `${talk.time}-${talk.endTime}` : talk.time;
}

/** Venue and city without repeating one inside the other (or the event name). */
export function formatTalkPlace(talk: Talk, language: Language): string {
  const place = talk.place?.[language];
  const parts: string[] = [];

  if (place && place !== talk.event) parts.push(place);
  if (talk.city && !(place ?? '').includes(talk.city)) parts.push(talk.city);

  return parts.join(', ');
}
