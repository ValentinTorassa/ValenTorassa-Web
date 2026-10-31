import type { IconType } from 'react-icons';
import { FaBookOpen, FaEnvelope, FaLink, FaLinkedinIn, FaPenNib } from 'react-icons/fa6';
import { SiBluesky, SiDevdotto, SiFacebook, SiGithub, SiInstagram, SiOrcid, SiThreads, SiTiktok, SiX, SiYoutube } from 'react-icons/si';
import { localePath } from './site';

export type Language = 'es' | 'en';

export type SocialLink = {
  name: string;
  href: string;
  icon: IconType;
};

export type HeaderLabels = {
  homeLabel: string;
  navLabel: string;
  languageLabel: string;
  spanishLabel: string;
  englishLabel: string;
  menuLabel: string;
  closeMenuLabel: string;
  /** Link to /libro in the phone menu, under the profile icons. */
  bookLabel: string;
};

/**
 * `current` marks the page the menu is on (aria-current="page"); `section` is the id of the
 * home section that lights the item up when the link itself goes elsewhere.
 */
export type NavItem = { label: string; href: string; current?: boolean; section?: string };

export type SitePage = 'home' | 'eventos' | 'charlas' | 'speaker-kit' | 'libro';

const navLabels: Record<Language, Record<'profile' | 'experience' | 'projects' | 'talks' | 'agenda' | 'contact', string>> = {
  es: { profile: 'Perfil', experience: 'Experiencia', projects: 'Proyectos', talks: 'Charlas', agenda: 'Agenda', contact: 'Contacto' },
  en: { profile: 'Profile', experience: 'Experience', projects: 'Projects', talks: 'Talks', agenda: 'Events', contact: 'Contact' },
};

export const blogUrl = 'https://vtsecurity.com.ar';

/**
 * One menu for every page, same items in the same order. On the home page the
 * sections are anchors; on the others they point back to the home page of the
 * same language (/ or /en/).
 */
export function siteNav(page: SitePage, language: Language): NavItem[] {
  const home = page === 'home' ? '' : localePath(language, '/');
  const label = navLabels[language];
  return [
    { label: label.profile, href: `${home}#profile` },
    { label: label.experience, href: `${home}#experience` },
    { label: label.projects, href: `${home}#research` },
    { label: label.talks, href: localePath(language, '/charlas'), current: page === 'charlas', section: page === 'home' ? 'talks' : undefined },
    { label: label.agenda, href: localePath(language, '/eventos'), current: page === 'eventos' },
    { label: label.contact, href: `${home}#contact` },
  ];
}

export const contactEmail = 'valentin.torassa.colombero@gmail.com';

/** The full-size headshot: the speaker kit download and the Person image. A fixed URL in public/, so it never depends on a page importing it. */
export const headshotPath = '/valentin-torassa-colombero.jpg';

export const socialLinks: SocialLink[] = [
  {
    name: 'Blog',
    href: blogUrl,
    icon: FaPenNib,
  },
  {
    name: 'GitHub',
    href: 'https://github.com/ValentinTorassa',
    icon: SiGithub,
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/valetorassa/',
    icon: FaLinkedinIn,
  },
  {
    name: 'ORCID',
    href: 'https://orcid.org/0009-0005-7980-4128',
    icon: SiOrcid,
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@vtcibersecurity',
    icon: SiYoutube,
  },
  {
    name: 'TikTok',
    href: 'https://tiktok.com/@vtsecurity',
    icon: SiTiktok,
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/vtsecurity',
    icon: SiInstagram,
  },
  {
    name: 'X',
    href: 'https://x.com/ValenSecurity',
    icon: SiX,
  },
  {
    name: 'Bluesky',
    href: 'https://bsky.app/profile/vtsecurity.bsky.social',
    icon: SiBluesky,
  },
  {
    name: 'Threads',
    href: 'https://www.threads.com/@vt_security_',
    icon: SiThreads,
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/vtsecurity',
    icon: SiFacebook,
  },
  {
    name: 'DEV',
    href: 'https://dev.to/vtsecurity',
    icon: SiDevdotto,
  },
  {
    name: 'Email',
    href: `mailto:${contactEmail}`,
    icon: FaEnvelope,
  },
];

/**
 * The links page lives on its own host. Vercel serves it at the root of that
 * host with a project routing rule (docs/links-domain.md); the site's own
 * /links paths redirect there (vercel.json).
 */
export const LINKS_ORIGIN = 'https://links.vtsecurity.com.ar';
export const linksPageUrl = (language: Language) => (language === 'es' ? `${LINKS_ORIGIN}/` : `${LINKS_ORIGIN}/en`);

/** The links page (the one every social bio points to), in the page's language. */
export const linksPageLink = (language: Language): SocialLink => ({ name: 'Links', href: linksPageUrl(language), icon: FaLink });

/** The book page on this site; it sits next to the blog icon in every header. */
export const bookLink: SocialLink = { name: 'Libro', href: '/libro', icon: FaBookOpen };

/** The blog, the book and the primary profiles appear together on the right of every desktop header. */
const headerSocialNames = ['GitHub', 'LinkedIn', 'YouTube', 'Blog'];
export const headerSocialLinks = [
  ...headerSocialNames.flatMap((name) => socialLinks.filter((link) => link.name === name)),
  bookLink,
];

/** Site pages (like /libro) open in the same tab; profiles and the blog open in a new one. */
export const isExternalLink = (link: SocialLink) => !link.href.startsWith('/');
export const linkTargetProps = (link: SocialLink) =>
  isExternalLink(link) ? { target: '_blank', rel: 'noopener noreferrer' } : {};

export const siteChromeByLanguage = {
  es: {
    header: {
      homeLabel: 'Ir al inicio',
      navLabel: 'Secciones principales',
      languageLabel: 'Cambiar idioma',
      spanishLabel: 'Español de Argentina',
      englishLabel: 'Inglés de Estados Unidos',
      menuLabel: 'Abrir navegación',
      closeMenuLabel: 'Cerrar navegación',
      bookLabel: 'El libro, en preparación',
    },
    footer: {
      tagline: 'Seguridad · sistemas · open source',
      backToTopLabel: 'Volver arriba',
      location: 'Rosario · UTC-3',
    },
  },
  en: {
    header: {
      homeLabel: 'Go to the top',
      navLabel: 'Main sections',
      languageLabel: 'Change language',
      spanishLabel: 'Argentinian Spanish',
      englishLabel: 'United States English',
      menuLabel: 'Open navigation',
      closeMenuLabel: 'Close navigation',
      bookLabel: 'The upcoming book',
    },
    footer: {
      tagline: 'Security · systems · open source',
      backToTopLabel: 'Back to top',
      location: 'Rosario · UTC-3',
    },
  },
} satisfies Record<Language, { header: HeaderLabels; footer: { tagline: string; backToTopLabel: string; location: string } }>;
