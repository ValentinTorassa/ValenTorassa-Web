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
  officialLabel: string;
  hintOpen: string;
  hintMove: string;
  hintYear: string;
  moveControlsLabel: string;
  previousLabel: string;
  nextLabel: string;
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
    officialLabel: 'Página oficial',
    hintOpen: 'abrir',
    hintMove: 'elegir',
    hintYear: 'año',
    moveControlsLabel: 'Navegar charlas',
    previousLabel: 'Charla anterior',
    nextLabel: 'Charla siguiente',
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
    officialLabel: 'Official page',
    hintOpen: 'open',
    hintMove: 'pick',
    hintYear: 'year',
    moveControlsLabel: 'Browse talks',
    previousLabel: 'Previous talk',
    nextLabel: 'Next talk',
    yearLabel: (year) => `Go to ${year}`,
  },
};
