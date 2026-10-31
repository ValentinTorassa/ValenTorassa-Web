import { charlasPageByLanguage } from './charlasContent';
import { isPastTalk } from './eventSchedule';
import { talks, type Talk } from './events';
import { eventsPageByLanguage } from './eventsContent';
import { contentByLanguage } from './homeContent';
import { book, libroByLanguage } from './libroContent';
import { papers } from './research';
import { pageHead, routes, routeUrl, type PageKey, type Route } from './seo';
import { absoluteUrl } from './site';
import { contactEmail, socialLinks, type Language } from './siteContent';
import { speakerKitByLanguage } from './speakerKitContent';
import { talkPageMeta, talkPages } from './talkSeo';

/**
 * The last day a talk's page changed on its own: slides released, the talk day
 * and its last day, whichever already happened.
 */
function talkDates(talk: Talk, today: string) {
  return [talk.slidesReleaseDate, talk.date, talk.endDate].filter((date): date is string => Boolean(date) && date! <= today);
}

const latest = (dates: Array<string | undefined>) =>
  dates.filter((date): date is string => Boolean(date)).sort().at(-1);

/** Content date of a page: talks move from upcoming to past on their own, so pages listing them change with them. */
function contentDate(route: Route, today: string): string | undefined {
  if (route.page === 'libro') return undefined;
  if (route.page === 'talk') {
    const talk = talks.find((item) => item.id === route.talkId);
    if (talk) return latest(talkDates(talk, today));
    const paper = papers.find((item) => item.id === route.talkId);
    return paper && paper.date <= today ? paper.date : undefined;
  }
  return latest(talks.flatMap((talk) => talkDates(talk, today)));
}

/**
 * sitemap.xml: every page in both languages with its hreflang alternates,
 * except the links page, which lives on its own host (linksContent.ts). lastmod
 * is the later of the page's content date and the last commit to its sources
 * (when the build has git history); a page with neither has no lastmod.
 * `committedOn` is keyed by page (`home`, `libro`...) and `talk:<id>`.
 */
export function sitemapXml(today: string, committedOn: Record<string, string | undefined>) {
  const entries = routes.filter((route) => route.page !== 'links').map((route) => {
    const alternates = {
      es: absoluteUrl('es', route.path),
      en: absoluteUrl('en', route.path),
    };
    const lastmod = latest([contentDate(route, today), committedOn[route.page === 'talk' ? `talk:${route.talkId}` : route.page]]);
    return [
      '  <url>',
      `    <loc>${routeUrl(route)}</loc>`,
      ...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []),
      `    <xhtml:link rel="alternate" hreflang="es" href="${alternates.es}"/>`,
      `    <xhtml:link rel="alternate" hreflang="en" href="${alternates.en}"/>`,
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${alternates.es}"/>`,
      '  </url>',
    ].join('\n');
  });
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...entries,
    '</urlset>',
    '',
  ].join('\n');
}

const link = (label: string, url: string, note?: string) => `- [${label}](${url})${note ? `: ${note}` : ''}`;

/** `YYYY-MM-DD`, or `YYYY-MM` / `YYYY` when only that much of the date is on record. */
const shownDate = (date: string, precision?: Talk['datePrecision']) =>
  precision === 'year' ? date.slice(0, 4) : precision === 'month' ? date.slice(0, 7) : date;

function talkLines(language: Language, today: string) {
  const entries = talkPages
    .map((page) => {
      const talk = talks.find((item) => item.id === page.id);
      const paper = papers.find((item) => item.id === page.id);
      const date = shownDate(page.date, talk?.datePrecision ?? paper?.datePrecision);
      const meta = talkPageMeta(page.id, language)!;
      const upcoming = talk && !isPastTalk(talk, today);
      const when = [page.event, date, upcoming ? (language === 'es' ? 'próxima' : 'upcoming') : ''].filter(Boolean).join(', ');
      const note = talk?.note?.[language];
      return { date: page.date, line: link(page.title[language], meta.url, note ? `${when}. ${note}` : when) };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
  return entries.map((entry) => entry.line);
}

/** /llms.txt (llmstxt.org): who Valentín is and where things are, Spanish first. */
export function llmsTxt(today: string) {
  const home = { es: contentByLanguage.es, en: contentByLanguage.en };
  const pages = (language: Language) => {
    const url = (path: string) => absoluteUrl(language, path);
    const head = (page: PageKey, path: string) => pageHead({ page, language, path }, today).description;
    return [
      link(home[language].documentTitle, url('/'), head('home', '/')),
      link(charlasPageByLanguage[language].title, url('/charlas'), head('charlas', '/charlas')),
      link(eventsPageByLanguage[language].title, url('/eventos'), head('eventos', '/eventos')),
      link(`${language === 'es' ? 'Libro' : 'Book'}: ${book.title}`, url('/libro'), libroByLanguage[language].seo.description),
      link(speakerKitByLanguage[language].title, url('/speaker-kit'), head('speaker-kit', '/speaker-kit')),
    ];
  };
  const labs = home.es.research.repos.find((repo) => repo.siteHref?.includes('securitylabs'));
  const labsEn = home.en.research.repos.find((repo) => repo.siteHref?.includes('securitylabs'));
  const profiles = socialLinks.filter((profile) => !['Email', 'Blog'].includes(profile.name));

  return [
    '# Valentín Torassa Colombero',
    '',
    `> ${home.es.seo.description}`,
    '',
    speakerKitByLanguage.es.bio.short,
    '',
    'El sitio está en español en https://valentorassa.com/ y en inglés bajo https://valentorassa.com/en/, con las mismas rutas.',
    '',
    '## Páginas',
    '',
    ...pages('es'),
    '',
    '## Charlas y papers',
    '',
    ...talkLines('es', today),
    '',
    '## Otros sitios',
    '',
    link('VT Security', 'https://vtsecurity.com.ar/', 'blog y canal en español sobre ciberseguridad, Linux y sistemas'),
    ...(labs ? [link('Open Security Labs', 'https://securitylabs.valentorassa.com/', labs.description)] : []),
    link('GitHub', 'https://github.com/ValentinTorassa', 'repositorios públicos'),
    '',
    '## Contacto',
    '',
    link('Email', `mailto:${contactEmail}`),
    ...profiles.map((profile) => link(profile.name, profile.href)),
    '',
    '## English',
    '',
    `> ${home.en.seo.description}`,
    '',
    speakerKitByLanguage.en.bio.short,
    '',
    ...pages('en'),
    link('VT Security', 'https://vtsecurity.com.ar/', 'Spanish-language blog and channel on cybersecurity, Linux, and systems'),
    ...(labsEn ? [link('Open Security Labs', 'https://securitylabs.valentorassa.com/', labsEn.description)] : []),
    '',
    '## Talks and papers (English pages)',
    '',
    ...talkLines('en', today),
    '',
  ].join('\n');
}
