import type { IconType } from 'react-icons';
import { FaEnvelope, FaLinkedinIn, FaPenNib } from 'react-icons/fa6';
import { SiGithub, SiInstagram, SiTiktok, SiX, SiYoutube } from 'react-icons/si';

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
};

/**
 * `current` marks the page the menu is on (aria-current="page"); `section` is the id of the
 * home section that lights the item up when the link itself goes elsewhere.
 */
export type NavItem = { label: string; href: string; current?: boolean; section?: string };

export type SitePage = 'home' | 'eventos' | 'charlas' | 'speaker-kit';

const navLabels: Record<Language, Record<'profile' | 'experience' | 'projects' | 'talks' | 'agenda' | 'contact', string>> = {
  es: { profile: 'Perfil', experience: 'Experiencia', projects: 'Proyectos', talks: 'Charlas', agenda: 'Agenda', contact: 'Contacto' },
  en: { profile: 'Profile', experience: 'Experience', projects: 'Projects', talks: 'Talks', agenda: 'Events', contact: 'Contact' },
};

/**
 * One menu for every page, same items in the same order. On the home page the
 * sections are anchors; on the others they point back to the home page.
 */
export function siteNav(page: SitePage, language: Language): NavItem[] {
  const home = page === 'home' ? '' : '/';
  const label = navLabels[language];
  return [
    { label: label.profile, href: `${home}#profile` },
    { label: label.experience, href: `${home}#experience` },
    { label: label.projects, href: `${home}#research` },
    { label: label.talks, href: '/charlas', current: page === 'charlas', section: page === 'home' ? 'talks' : undefined },
    { label: label.agenda, href: '/eventos', current: page === 'eventos' },
    { label: label.contact, href: `${home}#contact` },
  ];
}

export const contactEmail = 'valentin.torassa.colombero@gmail.com';

export const socialLinks: SocialLink[] = [
  {
    name: 'Blog',
    href: 'https://vtsecurity.com.ar',
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
    name: 'Email',
    href: `mailto:${contactEmail}`,
    icon: FaEnvelope,
  },
];

/** The same three primary profiles appear in the desktop bar on every page. */
const headerSocialNames = ['GitHub', 'LinkedIn', 'YouTube'];
export const headerSocialLinks = socialLinks.filter((link) => headerSocialNames.includes(link.name));

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
    },
    footer: {
      tagline: 'Security · systems · open source',
      backToTopLabel: 'Back to top',
      location: 'Rosario · UTC-3',
    },
  },
} satisfies Record<Language, { header: HeaderLabels; footer: { tagline: string; backToTopLabel: string; location: string } }>;
