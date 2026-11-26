import { mastodonUrl, type Language } from './siteContent';

/**
 * The links page: the one link every social bio points to. The bio adds its
 * own tag (?ref=ig) and every outbound link carries it on as ref=links-ig, so
 * the destination can tell which network the visit came from.
 */

/**
 * Tags the page accepts; anything else counts as "links" alone. The short ones
 * are for the bios. The long ones are what AutoMediaPoster, StudioOS and the
 * launches add to a post's own links (NETWORK_REFS in VT-CreatorStack's
 * publishing-core, approved 29/10/2026), so a post that links here keeps its
 * network too.
 */
export const bioRefs = [
  'ig', 'tt', 'x', 'th', 'yt', 'li', 'bs', 'fb', 'md', 'dc', 'gh', 'wa',
  'tiktok', 'threads', 'bluesky', 'mastodon', 'linkedin', 'yt-short', 'yt-desc', 'whatsapp', 'discord',
] as const;

export function outboundRef(search: string): string {
  const ref = new URLSearchParams(search).get('ref')?.toLowerCase();
  return ref && (bioRefs as readonly string[]).includes(ref) ? `links-${ref}` : 'links';
}

// The page's address lives in siteContent, next to the header links that point at it.
export { LINKS_ORIGIN, linksPageUrl } from './siteContent';

export const comandleUrl = 'https://comandle.valentorassa.com/';
export const comandleStatsApi = 'https://vtsecurity.com.ar/api/comandle';
export const youtubeUrl = 'https://www.youtube.com/@vtcibersecurity';
/** whoami, the podcast: its show page on Spotify. */
export const podcastUrl = 'https://open.spotify.com/show/5DNWy8GNFjWiw9amRJMwrl';
export const labsUrl = 'https://securitylabs.valentorassa.com/';
export const blogUrl = 'https://vtsecurity.com.ar';
export const discordUrl = 'https://discord.com/invite/z6cr5JF6bJ';
export const secretShareUrl = 'https://secretshare.valentorassa.com/';
/** Apuntes, the newsletter (pluma). Sign-ups keep any ?ref= of up to 48 letters, digits and hyphens, so links-<tag> counts as is. */
export const apuntesUrl = 'https://vtsecurity.com.ar/apuntes';

/**
 * Audience counts come from the daily audience
 * capture (VT-Content-Data-Lab, audience_daily_<date>.json); update them by
 * hand with `asOf`. YouTube's API already rounds subscribers to 3 digits.
 */
export const audience = {
  asOf: '2026-11-26',
  youtube: 44,
  youtubeVideos: 623,
  instagram: 16,
  tiktok: 12_317,
  facebook: 9_116,
  /** In thousands, one decimal, rounded down. */
  x: 6.9,
  discord: 2300,
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
  { name: 'Facebook', handle: '@vtsecurity', href: 'https://www.facebook.com/vtsecurity' },
  { name: 'Mastodon', handle: '@vtsecurity@infosec.exchange', href: mastodonUrl },
] as const;

export type LinksCopy = {
  documentTitle: string;
  /** The page's h1, for screen readers: the desk of links stands in for a headline. */
  heading: string;
  seo: { description: string; imageAlt: string };
  topBar: { home: string; language: string; languageLabel: string };
  desktopLabel: string;
  /** `short` is the one line a small window shows on a phone, where the body does not fit. */
  youtube: { title: string; name: string; stats: (subs: number, videos: string) => string; short: (subs: number, videos: string) => string; body: string; cta: string };
  book: { title: string; name: string; body: string; meta: string; cta: string; coverAlt: string };
  podcast: { title: string; name: string; short: string; body: string; cta: string; coverAlt: string };
  comandle: { title: string; body: string; played: (total: string) => string; today: string; yesterday: string; total: string; cta: string; offline: string };
  talk: { title: string; at: (place: string) => string; cta: string; closed: string };
  /** In the talk's place when no talk is coming: the speaker kit, for organizers. */
  invite: { title: string; name: string; body: string; cta: string };
  labs: { title: string; name: string; short: string; body: string; cta: string };
  blog: { title: string; name: string; short: string; body: string; cta: string };
  apuntes: { title: string; name: string; short: string; body: string; cta: string };
  discord: { title: string; name: string; short: (members: string) => string; body: (members: string) => string; cta: string };
  secretShare: { title: string; name: string; short: string; body: string; cta: string };
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
      imageAlt: 'Ventanas del libro, el podcast whoami, el canal, comandle, los labs y el blog sobre un tablero amarillo: links.vtsecurity.com.ar.',
    },
    topBar: { home: 'Valentín Torassa', language: 'EN', languageLabel: 'Ver en inglés' },
    desktopLabel: 'PROD 1.2',
    youtube: {
      title: 'canal.mp4',
      name: 'VT Security',
      stats: (subs, videos) => `${subs} mil suscriptores · ${videos} videos`,
      short: (subs, videos) => `${subs} mil · ${videos} videos`,
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
    podcast: {
      title: 'whoami.mp3',
      name: 'whoami',
      short: 'El podcast: la gente detrás de la seguridad.',
      body: 'El podcast de VT Security. Charlo con la gente detrás de la seguridad: cómo llegó y qué hace todos los días.',
      cta: 'Escuchar en Spotify',
      coverAlt: 'El pingüino de whoami, con capucha negra, delante de un disco rojo sobre papel blanco.',
    },
    comandle: {
      title: 'comandle.sh',
      body: 'Un comando por día, seis intentos. Al final te lo explico.',
      played: (total) => `${total} partidas`,
      today: 'hoy',
      yesterday: 'ayer',
      total: 'total',
      cta: 'Jugar el de hoy',
      offline: 'Las partidas en vivo no cargaron; el juego anda igual.',
    },
    talk: {
      title: 'charla.ics',
      at: (place) => `Doy esta charla en ${place}.`,
      cta: 'Ver la charla',
      closed: 'Es cerrada.',
    },
    invite: {
      title: 'speaker-kit/',
      name: 'Invitame a tu evento',
      body: 'Todavía no anuncié la próxima charla. Si organizás un evento, acá están la bio, la foto y los temas.',
      cta: 'Ver el kit',
    },
    labs: {
      title: 'labs/',
      name: 'Open Security Labs',
      short: 'Practicá como en producción',
      body: 'Practicás en tu máquina como si fuera producción y te quedás con la evidencia.',
      cta: 'Empezar un lab',
    },
    blog: { title: 'notas.md', name: 'Blog', short: 'Fallas reales y sus comandos', body: 'Fallas reales, diagramas y los comandos exactos.', cta: 'Leer' },
    apuntes: {
      title: 'apuntes.eml',
      name: 'Apuntes',
      short: 'Un mail cada dos semanas',
      body: 'Un mail cada dos semanas sobre sistemas, código y seguridad.',
      cta: 'Anotarme',
    },
    discord: {
      title: 'dedsec.chat',
      name: 'DedSec',
      short: (members) => `${members} en Discord`,
      body: (members) => `${members} personas preguntando lo que no sale en los tutoriales.`,
      cta: 'Entrar',
    },
    secretShare: {
      title: 'secreto.bin',
      name: 'VT-SecretShare',
      short: 'Se borra al leerla',
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
      { value: (a, number) => number.format(a.tiktok), label: 'Seguidores en TikTok.' },
      { value: (a, number) => number.format(a.facebook), label: 'Seguidores en Facebook.' },
      { value: (a, number) => `${number.format(a.x)} mil`, label: 'Seguidores en X.' },
      { value: (a, number) => `+${number.format(a.discord)}`, label: 'Personas en Discord.' },
    ],
    footer: { version: 'Versión 1.2', rights: '©2026 Valentín Torassa Colombero.', made: 'Hecho en Rosario.', site: 'valentorassa.com' },
  },
  en: {
    documentTitle: 'Links · Valentín Torassa',
    heading: "Valentín Torassa's links",
    seo: {
      description:
        'Everything from Valentín Torassa in one place: the VT Security channel, his book, comandle, the next talk, Open Security Labs, the blog and his profiles.',
      imageAlt: 'Windows for the book, the whoami podcast, the channel, comandle, the labs and the blog on a yellow board: links.vtsecurity.com.ar.',
    },
    topBar: { home: 'Valentín Torassa', language: 'ES', languageLabel: 'Ver en español' },
    desktopLabel: 'PROD 1.2',
    youtube: {
      title: 'channel.mp4',
      name: 'VT Security',
      stats: (subs, videos) => `${subs}K subscribers · ${videos} videos`,
      short: (subs, videos) => `${subs}K · ${videos} videos`,
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
    podcast: {
      title: 'whoami.mp3',
      name: 'whoami',
      short: 'The podcast: the people behind security.',
      body: 'The VT Security podcast. I talk with the people behind security: how they got there and what they do every day. In Spanish.',
      cta: 'Listen on Spotify',
      coverAlt: 'The whoami penguin in a black hoodie, in front of a red disc on white paper.',
    },
    comandle: {
      title: 'comandle.sh',
      body: 'One command a day, six tries. Then I explain it. In Spanish.',
      played: (total) => `${total} games`,
      today: 'today',
      yesterday: 'yesterday',
      total: 'total',
      cta: "Play today's",
      offline: 'Live counts did not load; the game works anyway.',
    },
    talk: {
      title: 'talk.ics',
      at: (place) => `I'm giving this talk at ${place}.`,
      cta: 'See the talk',
      closed: 'Closed to the public.',
    },
    invite: {
      title: 'speaker-kit/',
      name: 'Invite me to your event',
      body: "I haven't announced my next talk yet. If you run an event, the bio, headshot and topics are here.",
      cta: 'See the kit',
    },
    labs: {
      title: 'labs/',
      name: 'Open Security Labs',
      short: 'Practice like production',
      body: 'You practice on your own machine as if it were production, and you keep the evidence.',
      cta: 'Start a lab',
    },
    blog: { title: 'notes.md', name: 'Blog', short: 'Real failures, exact commands', body: 'Real failures, diagrams and the exact commands. In Spanish.', cta: 'Read' },
    apuntes: {
      title: 'apuntes.eml',
      name: 'Apuntes',
      short: 'An email every two weeks',
      body: 'An email every two weeks on systems, code and security. In Spanish.',
      cta: 'Subscribe',
    },
    discord: {
      title: 'dedsec.chat',
      name: 'DedSec',
      short: (members) => `${members} on Discord`,
      body: (members) => `${members} people asking what the tutorials leave out.`,
      cta: 'Join',
    },
    secretShare: {
      title: 'secret.bin',
      name: 'VT-SecretShare',
      short: 'Deleted once it is read',
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
      { value: (a, number) => number.format(a.tiktok), label: 'Followers on TikTok.' },
      { value: (a, number) => number.format(a.facebook), label: 'Followers on Facebook.' },
      { value: (a, number) => `${number.format(a.x)}K`, label: 'Followers on X.' },
      { value: (a, number) => `+${number.format(a.discord)}`, label: 'People on Discord.' },
    ],
    footer: { version: 'Version 1.2', rights: '©2026 Valentín Torassa Colombero.', made: 'Made in Rosario.', site: 'valentorassa.com' },
  },
};
