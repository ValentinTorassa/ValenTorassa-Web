import type { TalkMode, TalkStatus } from './events';
import { siteNav, type Language, type NavItem } from './siteContent';

export type TalkLabels = {
  status: Record<TalkStatus, string>;
  mode: Record<TalkMode, string>;
  officialLinkLabel: string;
  slidesLabel: string;
  talkCount: { one: string; other: string };
};

/** Chips and links shared by /eventos and the home speaking panel. */
export const talkLabelsByLanguage: Record<Language, TalkLabels> = {
  es: {
    status: {
      confirmed: 'Confirmado',
      tentative: 'Tentativo',
      tbd: 'Horario a confirmar',
      closed: 'Por invitación',
    },
    mode: {
      presencial: 'Presencial',
      virtual: 'Virtual',
    },
    officialLinkLabel: 'Página oficial',
    slidesLabel: 'Slides',
    talkCount: { one: 'charla', other: 'charlas' },
  },
  en: {
    status: {
      confirmed: 'Confirmed',
      tentative: 'Tentative',
      tbd: 'Time TBC',
      closed: 'Invite only',
    },
    mode: {
      presencial: 'In person',
      virtual: 'Online',
    },
    officialLinkLabel: 'Official page',
    slidesLabel: 'Slides',
    talkCount: { one: 'talk', other: 'talks' },
  },
};

type EventsPageContent = {
  documentTitle: string;
  seo: {
    description: string;
    locale: 'es_AR' | 'en_US';
  };
  navItems: NavItem[];
  eyebrow: string;
  title: string;
  intro: string;
  timezoneNote: string;
  archiveLabel: string;
  upcomingTitle: string;
  pastTitle: string;
  emptyUpcoming: string;
  emptyPast: string;
};

export const eventsPageByLanguage: Record<Language, EventsPageContent> = {
  es: {
    documentTitle: 'Eventos y charlas · Valentín Torassa',
    seo: {
      description: 'Charlas, clases y presentaciones de Valentín Torassa Colombero sobre ciberseguridad, backend y agentes de IA: próximas fechas y charlas anteriores.',
      locale: 'es_AR',
    },
    navItems: siteNav('eventos', 'es'),
    eyebrow: '// eventos',
    title: 'Eventos y charlas',
    intro: 'Dónde me vas a ver: charlas, clases y presentaciones de papers, con fecha, lugar y estado de cada una.',
    timezoneNote: 'Horarios de Argentina (UTC-3)',
    archiveLabel: 'Explorar las charlas, slides y papers',
    upcomingTitle: 'Próximas',
    pastTitle: 'Pasadas',
    emptyUpcoming: 'No hay charlas anunciadas por ahora.',
    emptyPast: 'Todavía no hay charlas pasadas cargadas.',
  },
  en: {
    documentTitle: 'Events and talks · Valentín Torassa',
    seo: {
      description: 'Talks, classes, and paper presentations by Valentin Torassa Colombero on cybersecurity, backend systems, and AI agents: upcoming dates and past talks.',
      locale: 'en_US',
    },
    navItems: siteNav('eventos', 'en'),
    eyebrow: '// events',
    title: 'Events and talks',
    intro: 'Where to catch me: talks, classes, and paper presentations, each with its date, venue, and status.',
    timezoneNote: 'Times are Argentina time (UTC-3)',
    archiveLabel: 'Browse talks, slides, and papers',
    upcomingTitle: 'Upcoming',
    pastTitle: 'Past',
    emptyUpcoming: 'No talks announced right now.',
    emptyPast: 'No past talks listed yet.',
  },
};
