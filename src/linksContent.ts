import type { Language } from './siteContent';

/**
 * The links page: the one link every social bio points to. The bio adds its
 * own tag (?ref=ig) and every outbound link carries it on as ref=links-ig, so
 * the destination can tell which network the visit came from.
 */

/** Tags the bios use. Anything else counts as "links" alone. */
export const bioRefs = ['ig', 'tt', 'x', 'th', 'yt', 'li', 'bs', 'fb', 'md', 'dc', 'gh', 'wa'] as const;

export function outboundRef(search: string): string {
  const ref = new URLSearchParams(search).get('ref')?.toLowerCase();
  return ref && (bioRefs as readonly string[]).includes(ref) ? `links-${ref}` : 'links';
}

/**
 * The page lives on its own host. Vercel serves it at the root of that host
 * with a project routing rule (docs/links-domain.md); the site's own /links
 * paths redirect there (vercel.json).
 */
export const LINKS_ORIGIN = 'https://links.vtsecurity.com.ar';
export const linksPageUrl = (language: Language) => (language === 'es' ? `${LINKS_ORIGIN}/` : `${LINKS_ORIGIN}/en`);

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

type Fact = { key: string; value: string };

export type LinksCopy = {
  documentTitle: string;
  /** The page's h1, for screen readers: the terminal stands in for a headline. */
  heading: string;
  seo: { description: string; imageAlt: string };
  topBar: { home: string; language: string; languageLabel: string };
  news: { label: string; body: string; cta: string };
  leader: { left: string; right: string };
  ctas: { youtube: string; book: string };
  /** The neofetch in the hero: one line per fact, some of them links. */
  terminal: {
    title: string;
    role: Fact;
    base: Fact;
    channel: string;
    book: Fact;
    comandle: { key: string; live: (total: string) => string; idle: string };
    talk: { key: string; none: string };
    community: { key: string; value: (members: string) => string };
    shell: Fact;
  };
  desktopLabel: string;
  youtube: { title: string; name: string; stats: (subs: number, videos: string) => string; body: string; cta: string };
  book: { title: string; name: string; body: string; meta: string; cta: string; coverAlt: string };
  comandle: { title: string; body: string; today: string; yesterday: string; total: string; cta: string; offline: string };
  talk: { title: string; at: (place: string) => string; empty: string; cta: string; closed: string };
  labs: { title: string; name: string; body: string; cta: string };
  blog: { title: string; name: string; body: string; cta: string };
  discord: { title: string; name: string; body: (members: string) => string; cta: string };
  secretShare: { title: string; name: string; body: string; cta: string };
  clock: { title: string; place: string };
  glider: { title: string; caption: string };
  profilesTitle: string;
  profilesLabel: string;
  numbers: { subscribers: (subs: number) => string; videos: (videos: string) => string; note: (date: string) => string };
  stats: Array<{ value: (a: typeof audience, number: Intl.NumberFormat) => string; label: string }>;
  footer: { version: string; rights: string; made: string; site: string };
};

export const linksByLanguage: Record<Language, LinksCopy> = {
  es: {
    documentTitle: 'Links · Valentín Torassa',
    heading: 'Links de Valentín Torassa',
    seo: {
      description:
        'Todo lo de Valentín Torassa en un solo lugar: el canal VT Security, su libro, comandle, la próxima charla, Open Security Labs, el blog y sus redes.',
      imageAlt: 'Una terminal corre neofetch junto a Tux, al lado de ventanas del canal, el libro y comandle sobre un fondo amarillo: links.vtsecurity.com.ar.',
    },
    topBar: { home: 'Valentín Torassa', language: 'EN', languageLabel: 'Ver en inglés' },
    news: {
      label: 'Libro',
      body: 'Escribí sobre lo que pasa cuando el tablero está en verde y el sistema igual no funciona. El capítulo 1 es gratis.',
      cta: 'Leer el capítulo 1',
    },
    leader: { left: 'VT Security', right: 'del código a producción' },
    ctas: { youtube: 'Ver el canal', book: 'Leer el capítulo 1' },
    terminal: {
      title: 'valen@vt: ~',
      role: { key: 'Rol', value: 'ciberseguridad + backend' },
      base: { key: 'Base', value: 'Rosario, AR' },
      channel: 'Canal',
      book: { key: 'Libro', value: 'en beta · cap. 1 gratis' },
      comandle: { key: 'comandle', live: (total) => `${total} partidas (en vivo)`, idle: 'el comando del día' },
      talk: { key: 'Charla', none: 'sin fecha' },
      community: { key: 'Comunidad', value: (members) => `${members} en Discord` },
      shell: { key: 'Shell', value: 'español, con voseo' },
    },
    desktopLabel: 'PROD 1.1',
    youtube: {
      title: 'canal.mp4',
      name: 'VT Security',
      stats: (subs, videos) => `${subs} mil suscriptores · ${videos} videos`,
      body: 'Videos sobre lo que no ves en localhost: redes, permisos, colas, cloud y seguridad.',
      cta: 'Ver el canal',
    },
    book: {
      title: 'libro.pdf',
      name: 'No podés defender lo que no entendés',
      body: 'Linux desde las capas que fallan: cada abstracción y lo que esconde.',
      meta: 'Capítulo 1 gratis · PDF · sin registro',
      cta: 'Leer el capítulo',
      coverAlt: 'Tapa del libro No podés defender lo que no entendés: Tux en un bote alumbra un iceberg hecho de capas del sistema.',
    },
    comandle: {
      title: 'comandle.sh',
      body: 'Un comando por día, seis intentos. Al final te lo explico.',
      today: 'hoy',
      yesterday: 'ayer',
      total: 'total',
      cta: 'Jugar el de hoy',
      offline: 'Las partidas en vivo no cargaron; el juego anda igual.',
    },
    talk: {
      title: 'charla.ics',
      at: (place) => `Doy esta charla en ${place}.`,
      empty: 'Todavía no anuncié la próxima. La agenda completa está en /eventos.',
      cta: 'Ver la charla',
      closed: 'Es cerrada.',
    },
    labs: {
      title: 'labs/',
      name: 'Open Security Labs',
      body: 'Practicás en tu máquina como si fuera producción y te quedás con la evidencia.',
      cta: 'Empezar un lab',
    },
    blog: { title: 'notas.md', name: 'Blog', body: 'Fallas reales, diagramas y los comandos exactos.', cta: 'Leer' },
    discord: {
      title: 'dedsec.chat',
      name: 'DedSec',
      body: (members) => `${members} personas preguntando lo que no sale en los tutoriales.`,
      cta: 'Entrar',
    },
    secretShare: {
      title: 'secreto.bin',
      name: 'VT-SecretShare',
      body: 'Se cifra en tu navegador y se borra apenas alguien la lee.',
      cta: 'Probarlo',
    },
    clock: { title: 'uptime', place: 'Rosario, AR' },
    glider: { title: 'cron.life', caption: 'Game of Life' },
    profilesTitle: 'Seguime en producción.',
    profilesLabel: 'Redes',
    numbers: {
      subscribers: (subs) => `${subs} mil suscriptores.`,
      videos: (videos) => `${videos} videos.`,
      note: (date) => `*VT Security en YouTube, al ${date}.`,
    },
    stats: [
      { value: (a) => `${a.instagram} mil`, label: 'Seguidores en Instagram.' },
      { value: (a) => `${a.tiktok} mil`, label: 'Seguidores en TikTok.' },
      { value: (a, number) => `+${number.format(a.discord)}`, label: 'Personas en Discord.' },
    ],
    footer: { version: 'Versión 1.1', rights: '©2026 Valentín Torassa Colombero.', made: 'Hecho en Rosario.', site: 'valentorassa.com' },
  },
  en: {
    documentTitle: 'Links · Valentín Torassa',
    heading: "Valentín Torassa's links",
    seo: {
      description:
        'Everything from Valentín Torassa in one place: the VT Security channel, his book, comandle, the next talk, Open Security Labs, the blog and his profiles.',
      imageAlt: 'A terminal runs neofetch next to Tux, beside windows for the channel, the book and comandle on a yellow background: links.vtsecurity.com.ar.',
    },
    topBar: { home: 'Valentín Torassa', language: 'ES', languageLabel: 'Ver en español' },
    news: {
      label: 'Book',
      body: "I wrote about what happens when the dashboard is green and the system still doesn't work. Chapter 1 is free, in Spanish.",
      cta: 'Read chapter 1',
    },
    leader: { left: 'VT Security', right: 'from code to production' },
    ctas: { youtube: 'Watch the channel', book: 'Read chapter 1' },
    terminal: {
      title: 'valen@vt: ~',
      role: { key: 'Role', value: 'cybersecurity + backend' },
      base: { key: 'Base', value: 'Rosario, AR' },
      channel: 'Channel',
      book: { key: 'Book', value: 'in beta · ch. 1 free' },
      comandle: { key: 'comandle', live: (total) => `${total} games (live)`, idle: 'command of the day' },
      talk: { key: 'Talk', none: 'none scheduled' },
      community: { key: 'Community', value: (members) => `${members} on Discord` },
      shell: { key: 'Shell', value: 'Spanish, Rioplatense' },
    },
    desktopLabel: 'PROD 1.1',
    youtube: {
      title: 'channel.mp4',
      name: 'VT Security',
      stats: (subs, videos) => `${subs}K subscribers · ${videos} videos`,
      body: "Videos on what you don't see on localhost: networking, permissions, queues, cloud and security. In Spanish.",
      cta: 'Watch the channel',
    },
    book: {
      title: 'book.pdf',
      name: 'No podés defender lo que no entendés',
      body: 'Linux through the layers that fail: every abstraction and what it hides. In Spanish.',
      meta: 'Chapter 1 free · PDF · no sign-up',
      cta: 'Read the chapter',
      coverAlt: 'Cover of the book No podés defender lo que no entendés: Tux in a boat lights up an iceberg made of system layers.',
    },
    comandle: {
      title: 'comandle.sh',
      body: 'One command a day, six tries. Then I explain it. In Spanish.',
      today: 'today',
      yesterday: 'yesterday',
      total: 'total',
      cta: "Play today's",
      offline: 'Live counts did not load; the game works anyway.',
    },
    talk: {
      title: 'talk.ics',
      at: (place) => `I'm giving this talk at ${place}.`,
      empty: 'No next talk announced yet. The full schedule is on /eventos.',
      cta: 'See the talk',
      closed: 'Closed to the public.',
    },
    labs: {
      title: 'labs/',
      name: 'Open Security Labs',
      body: 'You practice on your own machine as if it were production, and you keep the evidence.',
      cta: 'Start a lab',
    },
    blog: { title: 'notes.md', name: 'Blog', body: 'Real failures, diagrams and the exact commands. In Spanish.', cta: 'Read' },
    discord: {
      title: 'dedsec.chat',
      name: 'DedSec',
      body: (members) => `${members} people asking what the tutorials leave out.`,
      cta: 'Join',
    },
    secretShare: {
      title: 'secret.bin',
      name: 'VT-SecretShare',
      body: 'Encrypted in your browser and deleted as soon as someone reads it.',
      cta: 'Try it',
    },
    clock: { title: 'uptime', place: 'Rosario, AR' },
    glider: { title: 'cron.life', caption: 'Game of Life' },
    profilesTitle: 'Follow me in production.',
    profilesLabel: 'Profiles',
    numbers: {
      subscribers: (subs) => `${subs}K subscribers.`,
      videos: (videos) => `${videos} videos.`,
      note: (date) => `*VT Security on YouTube, as of ${date}.`,
    },
    stats: [
      { value: (a) => `${a.instagram}K`, label: 'Followers on Instagram.' },
      { value: (a) => `${a.tiktok}K`, label: 'Followers on TikTok.' },
      { value: (a, number) => `+${number.format(a.discord)}`, label: 'People on Discord.' },
    ],
    footer: { version: 'Version 1.1', rights: '©2026 Valentín Torassa Colombero.', made: 'Made in Rosario.', site: 'valentorassa.com' },
  },
};
