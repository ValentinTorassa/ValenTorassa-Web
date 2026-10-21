import portrait from './assets/portrait-dark.png';
import { charlasPageByLanguage } from './charlasContent';
import { splitTalks } from './eventSchedule';
import { talks, type Talk } from './events';
import { eventsPageByLanguage } from './eventsContent';
import { contentByLanguage } from './homeContent';
import { book, libroByLanguage } from './libroContent';
import { paperOfTalk, papers, type Paper } from './research';
import { absoluteUrl, SITE_ORIGIN } from './site';
import type { Language } from './siteContent';
import { socialImages, SOCIAL_IMAGE_SIZE } from './socialImages';
import { speakerKitByLanguage } from './speakerKitContent';
import { talkPageMeta, talkPages } from './talkSeo';

/**
 * Every page the build renders, with its head: title, description, canonical,
 * hreflang, Open Graph, Twitter and JSON-LD. One list feeds the prerender, the
 * sitemap and llms.txt.
 */
export type PageKey = 'home' | 'charlas' | 'talk' | 'eventos' | 'libro' | 'speaker-kit';

export type Route = {
  page: PageKey;
  language: Language;
  /** The Spanish path; English adds /en in front (see localePath). */
  path: string;
  talkId?: string;
};

const spanishRoutes: Array<Omit<Route, 'language'>> = [
  { page: 'home', path: '/' },
  { page: 'charlas', path: '/charlas' },
  ...talkPages.map((page) => ({ page: 'talk' as const, path: `/charlas/${page.id}`, talkId: page.id })),
  { page: 'eventos', path: '/eventos' },
  { page: 'libro', path: '/libro' },
  { page: 'speaker-kit', path: '/speaker-kit' },
];

export const routes: Route[] = (['es', 'en'] as const).flatMap((language) =>
  spanishRoutes.map((route) => ({ ...route, language })),
);

export const routeUrl = (route: Route) => absoluteUrl(route.language, route.path);

// ── identity (shared spec: the full Person lives only on the home page) ─────

const PERSON_ID = `${SITE_ORIGIN}/#person`;
const WEBSITE_ID = `${SITE_ORIGIN}/#website`;
const NAME = 'Valentín Torassa Colombero';

/** How every page other than home refers to the person. */
export const personRef = { '@type': 'Person', '@id': PERSON_ID, name: NAME, url: `${SITE_ORIGIN}/` };

const person = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: NAME,
  alternateName: ['Valen Torassa', 'Valentin Torassa', 'Valentín Torassa'],
  url: `${SITE_ORIGIN}/`,
  image: `${SITE_ORIGIN}${portrait}`,
  jobTitle: ['Cybersecurity Engineer', 'Backend Engineer'],
  worksFor: { '@type': 'Organization', name: 'Teramot' },
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'Universidad Abierta Interamericana' },
  homeLocation: { '@type': 'Place', name: 'Rosario, Santa Fe, Argentina' },
  nationality: { '@type': 'Country', name: 'Argentina' },
  knowsLanguage: ['es', 'en'],
  knowsAbout: [
    'Cloud security',
    'Go backend architecture',
    'Linux',
    'Computer networks',
    'SOC 2',
    'ISO/IEC 27001',
    'Artificial intelligence infrastructure',
  ],
  founder: { '@id': 'https://vtsecurity.com.ar/#organization' },
  sameAs: [
    'https://www.wikidata.org/wiki/Q141749900',
    'https://orcid.org/0009-0005-7980-4128',
    'https://github.com/ValentinTorassa',
    'https://www.linkedin.com/in/valetorassa/',
    'https://www.youtube.com/@vtcibersecurity',
    'https://x.com/ValenSecurity',
    'https://bsky.app/profile/vtsecurity.bsky.social',
    'https://www.threads.com/@vt_security_',
    'https://www.instagram.com/vtsecurity/',
    'https://www.facebook.com/vtsecurity',
    'https://dev.to/vtsecurity',
    'https://www.tiktok.com/@vtsecurity',
    'https://vtsecurity.com.ar/',
    'https://securitylabs.valentorassa.com/',
    'https://es.everybodywiki.com/Valent%C3%ADn_Torassa_Colombero',
  ],
};

const website = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: `${SITE_ORIGIN}/`,
  name: NAME,
  inLanguage: ['es', 'en'],
  author: { '@id': PERSON_ID },
};

// ── talks as schema.org Events ──────────────────────────────────────────────

/** Talks are scheduled in Argentina time (UTC-3, no daylight saving). */
function isoDate(date: string, precision?: Talk['datePrecision'], time?: string) {
  if (precision === 'year') return date.slice(0, 4);
  if (precision === 'month') return date.slice(0, 7);
  return time ? `${date}T${time}:00-03:00` : date;
}

function scholarlyArticle(paper: Paper) {
  return {
    '@type': 'ScholarlyArticle',
    name: paper.title.es,
    url: paper.url,
    author: paper.authors.map((author) => (author === NAME ? personRef : { '@type': 'Person', name: author })),
  };
}

function place(name: string | undefined, city: string | undefined) {
  if (!name && !city) return undefined;
  return {
    '@type': 'Place',
    name: name ?? city,
    address: { '@type': 'PostalAddress', ...(city ? { addressLocality: city } : {}), addressCountry: 'AR' },
  };
}

const attendance = {
  presencial: 'https://schema.org/OfflineEventAttendanceMode',
  virtual: 'https://schema.org/OnlineEventAttendanceMode',
} as const;

/** A dated, located presentation is an Event; incomplete records remain CreativeWorks. */
export function talkEvent(id: string, language: Language) {
  const meta = talkPageMeta(id, language);
  if (!meta) throw new Error(`Unknown talk ${id}`);
  const talk = talks.find((item) => item.id === id);
  const paper = talk ? paperOfTalk(talk.id) : papers.find((item) => item.id === id);
  const common = {
    '@id': `${meta.url}#event`,
    url: meta.url,
    description: meta.description,
    image: meta.image,
    // The speaker kit: talks are given in Spanish.
    inLanguage: 'es',
  };

  if (talk) {
    const location = talk.mode === 'virtual'
      ? talk.url ? { '@type': 'VirtualLocation', url: talk.url } : undefined
      : place(talk.place?.[language], talk.city);
    // A placeholder first-of-month/year is not the presentation's actual day.
    // Do not invent dates or venues to qualify for Google's Event results.
    if (talk.datePrecision || !location) {
      return {
        ...common,
        '@type': 'CreativeWork',
        name: talk.title[language],
        creator: personRef,
        ...(paper ? { citation: scholarlyArticle(paper) } : {}),
      };
    }
    return {
      ...common,
      '@type': 'Event',
      name: talk.title[language],
      performer: personRef,
      startDate: isoDate(talk.date, talk.datePrecision, talk.time),
      ...(talk.endTime
        ? { endDate: isoDate(talk.endDate ?? talk.date, undefined, talk.endTime) }
        : talk.endDate ? { endDate: talk.endDate } : {}),
      ...(talk.status === 'tentative' ? {} : { eventStatus: 'https://schema.org/EventScheduled' }),
      ...(talk.mode ? { eventAttendanceMode: attendance[talk.mode] } : {}),
      location,
      ...(paper ? { workFeatured: scholarlyArticle(paper) } : {}),
    };
  }

  if (!paper) throw new Error(`No talk or paper ${id}`);
  const location = place(undefined, paper.city);
  if (paper.datePrecision || !location) {
    return {
      ...common,
      '@type': 'CreativeWork',
      name: paper.title[language],
      creator: personRef,
      citation: scholarlyArticle(paper),
    };
  }
  return {
    ...common,
    '@type': 'Event',
    name: paper.title[language],
    performer: personRef,
    startDate: isoDate(paper.date, paper.datePrecision),
    eventStatus: 'https://schema.org/EventScheduled',
    location,
    workFeatured: scholarlyArticle(paper),
  };
}

// ── per-page head ───────────────────────────────────────────────────────────

export type PageHead = {
  title: string;
  description: string;
  url: string;
  alternates: Record<Language, string>;
  image: string;
  imageAlt: string;
  locale: 'es_AR' | 'en_US';
  jsonLd: object;
};

const locales = { es: 'es_AR', en: 'en_US' } as const;

export function pageHead(route: Route, today: string): PageHead {
  const { language } = route;
  const url = routeUrl(route);
  const base = {
    url,
    alternates: { es: absoluteUrl('es', route.path), en: absoluteUrl('en', route.path) },
    locale: locales[language],
  };
  const websiteRef = { '@id': WEBSITE_ID };

  switch (route.page) {
    case 'home': {
      const content = contentByLanguage[language];
      return {
        ...base,
        title: content.documentTitle,
        description: content.seo.description,
        image: `${SITE_ORIGIN}${socialImages.home}`,
        imageAlt: content.documentTitle,
        jsonLd: {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'ProfilePage',
              '@id': `${url}#page`,
              url,
              name: content.documentTitle,
              inLanguage: language,
              isPartOf: websiteRef,
              mainEntity: { '@id': PERSON_ID },
            },
            person,
            website,
            // Only the projects the page shows with a public repository.
            ...content.research.repos.map((repo) => ({
              '@type': 'SoftwareSourceCode',
              '@id': repo.href,
              name: repo.name,
              description: repo.description,
              codeRepository: repo.href,
              programmingLanguage: repo.language,
              ...(repo.siteHref ? { url: repo.siteHref } : {}),
              author: { '@id': PERSON_ID },
            })),
          ],
        },
      };
    }
    case 'charlas': {
      const copy = charlasPageByLanguage[language];
      return {
        ...base,
        title: copy.documentTitle,
        description: copy.seo.description,
        image: `${SITE_ORIGIN}${socialImages.charlas}`,
        imageAlt: copy.socialImageAlt,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          '@id': `${url}#page`,
          url,
          name: copy.documentTitle,
          inLanguage: language,
          isPartOf: websiteRef,
          author: personRef,
        },
      };
    }
    case 'talk': {
      const meta = talkPageMeta(route.talkId!, language)!;
      return {
        ...base,
        title: meta.title,
        description: meta.description,
        image: meta.image,
        imageAlt: meta.imageAlt,
        jsonLd: { '@context': 'https://schema.org', ...talkEvent(route.talkId!, language) },
      };
    }
    case 'eventos': {
      const copy = eventsPageByLanguage[language];
      const { upcoming, past } = splitTalks(talks, today);
      return {
        ...base,
        title: copy.documentTitle,
        description: copy.seo.description,
        image: `${SITE_ORIGIN}${socialImages.eventos}`,
        imageAlt: copy.socialImageAlt,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          '@id': `${url}#talks`,
          name: copy.title,
          url,
          numberOfItems: upcoming.length + past.length,
          itemListElement: [...upcoming, ...past].map((talk, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            // Rich Event data belongs on the presentation's own page.
            item: {
              '@type': 'WebPage',
              url: talkPageMeta(talk.id, language)!.url,
              name: talk.title[language],
            },
          })),
        },
      };
    }
    case 'libro': {
      const page = libroByLanguage[language];
      return {
        ...base,
        title: page.documentTitle,
        description: page.seo.description,
        image: `${SITE_ORIGIN}${socialImages.libro}`,
        imageAlt: page.coverAlt,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'Book',
          '@id': `${SITE_ORIGIN}/libro#book`,
          name: book.title,
          alternativeHeadline: book.subtitle,
          inLanguage: 'es',
          author: personRef,
          image: `${SITE_ORIGIN}${socialImages.libro}`,
          url: `${SITE_ORIGIN}/libro`,
          isPartOf: websiteRef,
        },
      };
    }
    case 'speaker-kit': {
      const kit = speakerKitByLanguage[language];
      return {
        ...base,
        title: kit.documentTitle,
        description: kit.seo.description,
        image: `${SITE_ORIGIN}${socialImages.home}`,
        imageAlt: contentByLanguage[language].documentTitle,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          '@id': `${url}#page`,
          url,
          name: kit.documentTitle,
          inLanguage: language,
          isPartOf: websiteRef,
          mainEntity: personRef,
        },
      };
    }
  }
}

const escapeHtml = (value: string) =>
  value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

/** JSON inside <script>: `<` is escaped so no string can close the tag. */
const scriptJson = (value: object) => JSON.stringify(value, null, 2).replaceAll('<', '\\u003c');

/** The head tags of a page, for the prerender to put in its HTML. */
export function headHtml(head: PageHead): string {
  const meta = (attribute: 'name' | 'property', key: string, value: string | number) =>
    `<meta ${attribute}="${key}" content="${escapeHtml(String(value))}" />`;
  const otherLocale = head.locale === 'es_AR' ? 'en_US' : 'es_AR';
  return [
    `<title>${escapeHtml(head.title)}</title>`,
    meta('name', 'description', head.description),
    `<link rel="canonical" href="${head.url}" />`,
    `<link rel="alternate" hreflang="es" href="${head.alternates.es}" />`,
    `<link rel="alternate" hreflang="en" href="${head.alternates.en}" />`,
    `<link rel="alternate" hreflang="x-default" href="${head.alternates.es}" />`,
    meta('property', 'og:type', 'website'),
    meta('property', 'og:site_name', NAME),
    meta('property', 'og:title', head.title),
    meta('property', 'og:description', head.description),
    meta('property', 'og:url', head.url),
    meta('property', 'og:image', head.image),
    meta('property', 'og:image:width', SOCIAL_IMAGE_SIZE.width),
    meta('property', 'og:image:height', SOCIAL_IMAGE_SIZE.height),
    meta('property', 'og:image:alt', head.imageAlt),
    meta('property', 'og:locale', head.locale),
    meta('property', 'og:locale:alternate', otherLocale),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:title', head.title),
    meta('name', 'twitter:description', head.description),
    meta('name', 'twitter:image', head.image),
    meta('name', 'twitter:image:alt', head.imageAlt),
    `<script type="application/ld+json">\n${scriptJson(head.jsonLd)}\n    </script>`,
  ].join('\n    ');
}
