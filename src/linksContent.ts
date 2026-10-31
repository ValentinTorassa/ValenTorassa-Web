import type { Language } from './siteContent';

/**
 * /links: the one link every social bio points to. The bio adds its own tag
 * (/links?ref=ig) and every outbound link carries it on as ref=links-ig, so the
 * destination can tell which network the visit came from.
 */

/** Tags the bios use. Anything else counts as "links" alone. */
export const bioRefs = ['ig', 'tt', 'x', 'th', 'yt', 'li', 'bs', 'fb', 'md', 'dc', 'gh', 'wa'] as const;

export function outboundRef(search: string): string {
  const ref = new URLSearchParams(search).get('ref')?.toLowerCase();
  return ref && (bioRefs as readonly string[]).includes(ref) ? `links-${ref}` : 'links';
}

export const comandleUrl = 'https://comandle.valentorassa.com/';
export const comandleStatsApi = 'https://vtsecurity.com.ar/api/comandle';
export const youtubeUrl = 'https://www.youtube.com/@vtcibersecurity';
export const labsUrl = 'https://securitylabs.valentorassa.com/';
export const blogUrl = 'https://vtsecurity.com.ar';
export const discordUrl = 'https://discord.com/invite/z6cr5JF6bJ';
export const secretShareUrl = 'https://secretshare.valentorassa.com/';

/** Base64 of the book's title, printed sideways in the hero margin. */
export const marginCode = 'Tm8gcG9kw6lzIGRlZmVuZGVyIGxvIHF1ZSBubyBlbnRlbmTDqXMu';

/**
 * Audience counts shown as round numbers. They come from the daily audience
 * capture (VT-Content-Data-Lab, audience_daily_<date>.json); update them by
 * hand with `asOf`. YouTube's API already rounds subscribers to 3 digits.
 */
export const audience = {
  asOf: '2026-10-30',
  youtube: 42,
  youtubeVideos: 579,
  instagram: 14,
  tiktok: 11,
  discord: 2200,
} as const;

/** Profiles in the closing list, in the order people look for them. */
export const profiles = [
  { name: 'YouTube', handle: '@vtcibersecurity', href: youtubeUrl },
  { name: 'Instagram', handle: '@vtsecurity', href: 'https://www.instagram.com/vtsecurity/' },
  { name: 'TikTok', handle: '@vtsecurity', href: 'https://www.tiktok.com/@vtsecurity' },
  { name: 'LinkedIn', handle: 'in/valetorassa', href: 'https://www.linkedin.com/in/valetorassa/' },
  { name: 'X', handle: '@ValenSecurity', href: 'https://x.com/ValenSecurity' },
  { name: 'GitHub', handle: 'ValentinTorassa', href: 'https://github.com/ValentinTorassa' },
  { name: 'Discord', handle: 'DedSec', href: discordUrl },
  { name: 'Bluesky', handle: '@vtsecurity.bsky.social', href: 'https://bsky.app/profile/vtsecurity.bsky.social' },
  { name: 'Threads', handle: '@vt_security_', href: 'https://www.threads.com/@vt_security_' },
] as const;

type LinksCopy = {
  documentTitle: string;
  seo: { description: string };
  topBar: { home: string; homeHref: string; language: string; languageLabel: string };
  news: { label: string; withCount: (total: string) => string; withoutCount: string; cta: string };
  leader: { left: string; right: string };
  title: string;
  ctas: { comandle: string; youtube: string };
  desktopLabel: string;
  comandle: { title: string; body: string; today: string; yesterday: string; total: string; cta: string; offline: string };
  youtube: { title: string; name: string; stats: (subs: number, videos: number) => string; body: string; cta: string };
  book: { title: string; name: string; body: string; meta: string; cta: string; coverAlt: string };
  talk: { title: string; empty: string; cta: string; closed: string };
  labs: { title: string; name: string; body: string; cta: string };
  blog: { title: string; name: string; body: string; cta: string };
  discord: { title: string; name: string; body: (members: string) => string; cta: string };
  secretShare: { title: string; name: string; body: string; cta: string };
  clock: { title: string; place: string };
  glider: { title: string; caption: string };
  bigNumber: {
    played: (total: string) => string;
    days: (days: number) => string;
    playedNote: string;
    fallback: string;
    fallbackNote: (date: string) => string;
  };
  stats: Array<{ value: (a: typeof audience) => string; label: string }>;
  profilesTitle: string;
  profilesLabel: string;
  footer: { version: string; rights: string; made: string; site: string };
};

const number = (language: Language) => new Intl.NumberFormat(language === 'es' ? 'es-AR' : 'en-US');

export const linksByLanguage: Record<Language, LinksCopy> = {
  es: {
    documentTitle: 'Links · Valentín Torassa',
    seo: {
      description:
        'Todo lo de Valentín Torassa en un solo lugar: comandle, el canal VT Security, el libro, la próxima charla, Open Security Labs, el blog y sus redes.',
    },
    topBar: { home: 'Valentín Torassa', homeHref: '/', language: 'EN', languageLabel: 'Ver en inglés' },
    news: {
      label: 'VT News',
      withCount: (total) => `Armé un Wordle de comandos de Linux. Ya van ${total} partidas.`,
      withoutCount: 'Armé un Wordle de comandos de Linux. Hay uno nuevo cada día.',
      cta: 'Jugar el de hoy',
    },
    leader: { left: 'VT Security', right: 'Linux, sistemas y seguridad' },
    title: 'Todo lo que hago, acá.',
    ctas: { comandle: 'Jugar comandle', youtube: 'Ver el canal' },
    desktopLabel: 'VT.OS 1.1',
    comandle: {
      title: 'comandle 1.1',
      body: 'El Wordle de los comandos de Linux y seguridad. Seis intentos, uno nuevo por día.',
      today: 'hoy',
      yesterday: 'ayer',
      total: 'total',
      cta: 'Jugar el de hoy',
      offline: 'Partidas en vivo: no cargaron, el juego anda igual.',
    },
    youtube: {
      title: 'YouTube.app',
      name: 'VT Security',
      stats: (subs, videos) => `${subs} mil suscriptores · ${number('es').format(videos)} videos`,
      body: 'Linux, redes, cloud y ciberseguridad en español, con los comandos que uso de verdad.',
      cta: 'Ver el canal',
    },
    book: {
      title: 'libro.pdf',
      name: 'No podés defender lo que no entendés',
      body: 'Mi libro sobre Linux, las abstracciones que fallan y el camino a la ciberseguridad.',
      meta: 'Capítulo 1 gratis · PDF · sin registro',
      cta: 'Leer el capítulo',
      coverAlt: 'Tapa del libro No podés defender lo que no entendés: Tux en un bote alumbra un iceberg hecho de capas del sistema.',
    },
    talk: { title: 'charla.ics', empty: 'Sin fechas anunciadas. La agenda completa está en /eventos.', cta: 'Ver la charla', closed: 'cerrada' },
    labs: {
      title: 'labs.sh',
      name: 'Open Security Labs',
      body: 'Labs gratis de Linux, redes, backend y cloud. Corrés los comandos y dejás evidencia. Sin cuenta.',
      cta: 'Empezar un lab',
    },
    blog: {
      title: 'blog.txt',
      name: 'Blog',
      body: 'Notas largas con los diagramas y los comandos exactos.',
      cta: 'Leer',
    },
    discord: {
      title: 'discord.exe',
      name: 'DedSec',
      body: (members) => `La comunidad del canal: ${members} personas hablando de seguridad.`,
      cta: 'Entrar',
    },
    secretShare: {
      title: 'secretshare.bin',
      name: 'VT-SecretShare',
      body: 'Mandá una clave que se lee una vez y se autodestruye.',
      cta: 'Probarlo',
    },
    clock: { title: 'Clock Tool 1.1', place: 'Rosario, AR' },
    glider: { title: 'Glider 1.1', caption: 'Game of Life' },
    bigNumber: {
      played: (total) => `${total} partidas.`,
      days: (days) => (days === 1 ? 'En 1 día.' : `En ${days} días.`),
      playedNote: '*Partidas de comandle desde el lanzamiento, en vivo.',
      fallback: '42 mil suscriptores.',
      fallbackNote: (date) => `*VT Security en YouTube, al ${date}.`,
    },
    stats: [
      { value: (a) => `${a.youtube} mil`, label: 'Suscriptores en YouTube.' },
      { value: (a) => `${a.instagram} mil`, label: 'Seguidores en Instagram.' },
      { value: (a) => number('es').format(a.youtubeVideos), label: 'Videos publicados.' },
    ],
    profilesTitle: 'Seguime donde estés.',
    profilesLabel: 'Redes',
    footer: { version: 'Versión 1.1', rights: '©2026 Valentín Torassa Colombero.', made: 'Hecho en Rosario.', site: 'valentorassa.com' },
  },
  en: {
    documentTitle: 'Links · Valentín Torassa',
    seo: {
      description:
        'Everything from Valentín Torassa in one place: comandle, the VT Security channel, the book, the next talk, Open Security Labs, the blog and his profiles.',
    },
    topBar: { home: 'Valentín Torassa', homeHref: '/en/', language: 'ES', languageLabel: 'Ver en español' },
    news: {
      label: 'VT News',
      withCount: (total) => `I built a Wordle of Linux commands. ${total} games played so far.`,
      withoutCount: 'I built a Wordle of Linux commands. A new one every day.',
      cta: "Play today's",
    },
    leader: { left: 'VT Security', right: 'Linux, systems and security' },
    title: 'Everything I make, right here.',
    ctas: { comandle: 'Play comandle', youtube: 'Watch the channel' },
    desktopLabel: 'VT.OS 1.1',
    comandle: {
      title: 'comandle 1.1',
      body: 'Wordle for Linux and security commands. Six tries, a new one every day. In Spanish.',
      today: 'today',
      yesterday: 'yesterday',
      total: 'total',
      cta: "Play today's",
      offline: 'Live counts did not load; the game works anyway.',
    },
    youtube: {
      title: 'YouTube.app',
      name: 'VT Security',
      stats: (subs, videos) => `${subs}K subscribers · ${number('en').format(videos)} videos`,
      body: 'Linux, networking, cloud and cybersecurity in Spanish, with the commands I actually use.',
      cta: 'Watch the channel',
    },
    book: {
      title: 'libro.pdf',
      name: 'No podés defender lo que no entendés',
      body: 'My book on Linux, the abstractions that fail, and the road to cybersecurity. In Spanish.',
      meta: 'Chapter 1 free · PDF · no sign-up',
      cta: 'Read the chapter',
      coverAlt: 'Cover of the book No podés defender lo que no entendés: Tux in a boat lights up an iceberg made of system layers.',
    },
    talk: { title: 'charla.ics', empty: 'No dates announced. The full schedule is on /eventos.', cta: 'See the talk', closed: 'closed' },
    labs: {
      title: 'labs.sh',
      name: 'Open Security Labs',
      body: 'Free labs on Linux, networking, backend and cloud. You run the commands and keep the evidence. No account.',
      cta: 'Start a lab',
    },
    blog: {
      title: 'blog.txt',
      name: 'Blog',
      body: 'Long-form notes with the diagrams and the exact commands. In Spanish.',
      cta: 'Read',
    },
    discord: {
      title: 'discord.exe',
      name: 'DedSec',
      body: (members) => `The channel's community: ${members} people talking security.`,
      cta: 'Join',
    },
    secretShare: {
      title: 'secretshare.bin',
      name: 'VT-SecretShare',
      body: 'Send a secret that can be read once and then destroys itself.',
      cta: 'Try it',
    },
    clock: { title: 'Clock Tool 1.1', place: 'Rosario, AR' },
    glider: { title: 'Glider 1.1', caption: 'Game of Life' },
    bigNumber: {
      played: (total) => `${total} games.`,
      days: (days) => (days === 1 ? 'In 1 day.' : `In ${days} days.`),
      playedNote: '*comandle games since launch, live.',
      fallback: '42K subscribers.',
      fallbackNote: (date) => `*VT Security on YouTube, as of ${date}.`,
    },
    stats: [
      { value: (a) => `${a.youtube}K`, label: 'Subscribers on YouTube.' },
      { value: (a) => `${a.instagram}K`, label: 'Followers on Instagram.' },
      { value: (a) => number('en').format(a.youtubeVideos), label: 'Videos published.' },
    ],
    profilesTitle: 'Find me anywhere.',
    profilesLabel: 'Profiles',
    footer: { version: 'Version 1.1', rights: '©2026 Valentín Torassa Colombero.', made: 'Made in Rosario.', site: 'valentorassa.com' },
  },
};
