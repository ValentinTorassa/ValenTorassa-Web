import { talks } from './events';
import { papers } from './research';

export const SITE_ORIGIN = 'https://valentorassa.com';

export const talkPages = [
  ...talks.map((talk) => ({
    id: talk.id,
    title: talk.title,
    description: {
      es: [talk.note?.es, talk.event, talk.track].filter(Boolean).join(' · ') || `${talk.title.es} · ${talk.event}`,
      en: [talk.note?.en, talk.event, talk.track].filter(Boolean).join(' · ') || `${talk.title.en} · ${talk.event}`,
    },
    event: talk.event,
    date: talk.date,
  })),
  ...papers.filter((paper) => !paper.talk).map((paper) => ({
    id: paper.id,
    title: paper.title,
    description: {
      es: `${paper.kind === 'poster' ? 'Póster' : 'Paper'} presentado en ${paper.venue}. Investigación de Valentín Torassa Colombero y coautores.`,
      en: `${paper.kind === 'poster' ? 'Poster' : 'Paper'} presented at ${paper.venue}. Research by Valentín Torassa Colombero and coauthors.`,
    },
    event: paper.venue,
    date: paper.date,
  })),
];

export const talkPageById = new Map(talkPages.map((page) => [page.id, page]));

export function talkPageMeta(id: string, language: 'es' | 'en' = 'es') {
  const page = talkPageById.get(id);
  if (!page) return undefined;
  const url = `${SITE_ORIGIN}/charlas/${page.id}`;
  return {
    title: `${page.title[language]} · Valentín Torassa`,
    description: page.description[language],
    url,
    image: `${SITE_ORIGIN}/og-charlas/${page.id}.png`,
    imageAlt: `${page.title[language]} · ${page.event}`,
  };
}
