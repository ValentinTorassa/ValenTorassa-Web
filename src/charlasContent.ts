import { siteNav, type Language, type NavItem } from './siteContent';

type CharlasPageContent = {
  documentTitle: string;
  navItems: NavItem[];
  seo: {
    description: string;
    locale: 'es_AR' | 'en_US';
  };
  section: string;
  title: string;
  eventsLabel: string;
  /** Link to /speaker-kit, the page for event organizers. */
  speakerKitLabel: string;
  homeLabel: string;
  languageLabel: string;
  listLabel: string;
  upcoming: string;
  slides: (count: number) => string;
  openLabel: string;
  slidesOn: (date: string) => string;
  noSlides: string;
  /** Opens a paper (src/research.ts) when there is no deck. */
  paperLabel: string;
  kinds: { paper: string; poster: string };
  coauthors: (names: string[]) => string;
  codeLabel: string;
  checklistLabel: string;
  /** Apuntes, the newsletter on vtsecurity.com.ar: each talk links it with its own ?ref=. */
  apuntesLead: string;
  apuntesLabel: string;
  officialLabel: string;
  hintOpen: string;
  hintMove: string;
  hintYear: string;
  moveControlsLabel: string;
  previousLabel: string;
  nextLabel: string;
  /** The talk's reel loops on the stage; this button stops and restarts it. */
  pauseReelLabel: string;
  playReelLabel: string;
  yearLabel: (year: string) => string;
};

const list = (names: string[], and: string) =>
  names.length > 1 ? `${names.slice(0, -1).join(', ')} ${and} ${names[names.length - 1]}` : names.join('');

export const charlasPageByLanguage: Record<Language, CharlasPageContent> = {
  es: {
    documentTitle: 'Charlas · Valentín Torassa',
    navItems: siteNav('charlas', 'es'),
    seo: {
      description: 'Las charlas y los papers de Valentín Torassa Colombero en un solo lugar: elegí uno para ver de qué trata, cuándo y dónde fue, y abrir sus slides o el paper.',
      locale: 'es_AR',
    },
    section: 'charlas',
    title: 'Charlas',
    eventsLabel: 'Ver agenda y próximas fechas',
    speakerKitLabel: 'Invitarme a tu evento',
    homeLabel: 'Inicio',
    languageLabel: 'Cambiar idioma',
    listLabel: 'Elegí una charla',
    upcoming: 'Próxima',
    slides: (count) => `${count} slides`,
    openLabel: 'Ver slides',
    slidesOn: (date) => `Slides el ${date}`,
    noSlides: 'Sin slides públicas',
    paperLabel: 'Leer el paper',
    kinds: { paper: 'Paper', poster: 'Póster' },
    coauthors: (names) => `Con ${list(names, 'y')}`,
    codeLabel: 'Código',
    checklistLabel: 'Checklist',
    apuntesLead: 'Las slides de cada charla y lo que voy aprendiendo, cada quince días por mail.',
    apuntesLabel: 'Suscribirme a Apuntes',
    officialLabel: 'Página oficial',
    hintOpen: 'abrir',
    hintMove: 'elegir',
    hintYear: 'año',
    moveControlsLabel: 'Navegar charlas',
    previousLabel: 'Charla anterior',
    nextLabel: 'Charla siguiente',
    pauseReelLabel: 'Pausar video',
    playReelLabel: 'Reproducir video',
    yearLabel: (year) => `Ir a ${year}`,
  },
  en: {
    documentTitle: 'Talks · Valentín Torassa',
    navItems: siteNav('charlas', 'en'),
    seo: {
      description: 'Talks and papers by Valentin Torassa Colombero in one place: pick one to see what it is about, when and where it was, and open its slides or the paper.',
      locale: 'en_US',
    },
    section: 'talks',
    title: 'Talks',
    eventsLabel: 'See events and upcoming dates',
    speakerKitLabel: 'Invite me to your event',
    homeLabel: 'Home',
    languageLabel: 'Change language',
    listLabel: 'Pick a talk',
    upcoming: 'Upcoming',
    slides: (count) => `${count} slides`,
    openLabel: 'Open slides',
    slidesOn: (date) => `Slides on ${date}`,
    noSlides: 'No public slides',
    paperLabel: 'Read the paper',
    kinds: { paper: 'Paper', poster: 'Poster' },
    coauthors: (names) => `With ${list(names, 'and')}`,
    codeLabel: 'Code',
    checklistLabel: 'Checklist',
    apuntesLead: 'Talk slides and what I am learning, every two weeks by email (in Spanish).',
    apuntesLabel: 'Subscribe to Apuntes',
    officialLabel: 'Official page',
    hintOpen: 'open',
    hintMove: 'pick',
    hintYear: 'year',
    moveControlsLabel: 'Browse talks',
    previousLabel: 'Previous talk',
    nextLabel: 'Next talk',
    pauseReelLabel: 'Pause video',
    playReelLabel: 'Play video',
    yearLabel: (year) => `Go to ${year}`,
  },
};
