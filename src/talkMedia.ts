import type { Talk } from './events';

/**
 * What /charlas shows for each talk, keyed by the talk's id in events.ts.
 *
 * - still + thumb: 16:9 crops of the Tux of the talk's announcement (every
 *   talk has its own style), framed on the Tux: still fills the screen before
 *   the day, thumb is the "character" in the selector.
 * - reel + poster: a short muted loop of the deck (its animations, or a
 *   crossfade of a few slides for a static deck). Like the slides link, it is
 *   shown from the talk's day on, so the page never gives the talk away early.
 * - cover: a still of the deck for past talks that have no Tux.
 * - page: the first page of the talk's paper (src/research.ts), shown on the
 *   screen of a past talk that has no deck.
 * - slides: how many slides the deck has, shown in the stats.
 * - code: the repository the talk is built on.
 * - icon: the lucide icon the background dots draw for the talk.
 * - deck: public/charlas/<id>/slides.html, the deck as presented, animations and
 *   all, with the speaker notes taken out. Enter on /charlas opens it, from the
 *   talk's day on; the PDF in Drive stays as the download.
 *
 * Files live in public/charlas/<id>/. A talk missing here still appears, with
 * an icon made from its event name.
 */
export type TalkIcon =
  | 'terminal' | 'lock' | 'shield' | 'pull-request' | 'key' | 'castle' | 'webhook' | 'flame'
  | 'branch' | 'chat' | 'workflow' | 'layers' | 'link' | 'users' | 'cap' | 'book';

export type TalkMedia = {
  /** The shape the dots draw behind the screen. */
  icon?: TalkIcon;
  still?: string;
  thumb?: string;
  reel?: string;
  poster?: string;
  cover?: string;
  page?: string;
  slides?: number;
  code?: string;
  /** The deck itself, hosted here with its animations and without speaker notes. */
  deck?: string;
};

const base = (id: string) => `/charlas/${id}`;
const firewall = 'https://github.com/ValentinTorassa/VT-Agent-Firewall';

export const talkMedia: Record<string, TalkMedia> = {
  'uai-clase-invitada-2026-09': {
    deck: `${base('uai-clase-invitada-2026-09')}/slides`,
    icon: 'terminal',
    still: `${base('uai-clase-invitada-2026-09')}/still.webp`,
    thumb: `${base('uai-clase-invitada-2026-09')}/thumb.webp`,
    reel: `${base('uai-clase-invitada-2026-09')}/reel.mp4`,
    poster: `${base('uai-clase-invitada-2026-09')}/poster.webp`,
    slides: 12,
  },
  'joven-argentina-fnga-2026': {
    icon: 'lock',
    still: `${base('joven-argentina-fnga-2026')}/still.webp`,
    thumb: `${base('joven-argentina-fnga-2026')}/thumb.webp`,
    reel: `${base('joven-argentina-fnga-2026')}/reel.mp4`,
    poster: `${base('joven-argentina-fnga-2026')}/poster.webp`,
    deck: `${base('joven-argentina-fnga-2026')}/slides`,
    slides: 7,
  },
  'hacking-day-2026': {
    deck: `${base('hacking-day-2026')}/slides`,
    icon: 'shield',
    still: `${base('hacking-day-2026')}/still.webp`,
    thumb: `${base('hacking-day-2026')}/thumb.webp`,
    reel: `${base('hacking-day-2026')}/reel.mp4`,
    poster: `${base('hacking-day-2026')}/poster.webp`,
    slides: 13,
    code: firewall,
  },
  'cacic-2026-podman': {
    deck: `${base('cacic-2026-podman')}/slides`,
    icon: 'pull-request',
    still: `${base('cacic-2026-podman')}/still.webp`,
    thumb: `${base('cacic-2026-podman')}/thumb.webp`,
    reel: `${base('cacic-2026-podman')}/reel.mp4`,
    poster: `${base('cacic-2026-podman')}/poster.webp`,
    slides: 12,
  },
  'ekoparty-2026-owasp-village': {
    deck: `${base('ekoparty-2026-owasp-village')}/slides`,
    icon: 'key',
    still: `${base('ekoparty-2026-owasp-village')}/still.webp`,
    thumb: `${base('ekoparty-2026-owasp-village')}/thumb.webp`,
    reel: `${base('ekoparty-2026-owasp-village')}/reel.mp4`,
    poster: `${base('ekoparty-2026-owasp-village')}/poster.webp`,
    slides: 14,
    code: firewall,
  },
  'ekoparty-2026-ai-resilience-hub': {
    deck: `${base('ekoparty-2026-ai-resilience-hub')}/slides`,
    icon: 'castle',
    still: `${base('ekoparty-2026-ai-resilience-hub')}/still.webp`,
    thumb: `${base('ekoparty-2026-ai-resilience-hub')}/thumb.webp`,
    reel: `${base('ekoparty-2026-ai-resilience-hub')}/reel.mp4`,
    poster: `${base('ekoparty-2026-ai-resilience-hub')}/poster.webp`,
    slides: 14,
    code: firewall,
  },
  'ekoparty-2026-cyberfinance': {
    icon: 'webhook',
    still: `${base('ekoparty-2026-cyberfinance')}/still.webp`,
    thumb: `${base('ekoparty-2026-cyberfinance')}/thumb.webp`,
    reel: `${base('ekoparty-2026-cyberfinance')}/reel.mp4`,
    poster: `${base('ekoparty-2026-cyberfinance')}/poster.webp`,
    deck: `${base('ekoparty-2026-cyberfinance')}/slides`,
    slides: 14,
  },
  'ekoparty-2026-bluespace': {
    deck: `${base('ekoparty-2026-bluespace')}/slides`,
    icon: 'flame',
    still: `${base('ekoparty-2026-bluespace')}/still.webp`,
    thumb: `${base('ekoparty-2026-bluespace')}/thumb.webp`,
    reel: `${base('ekoparty-2026-bluespace')}/reel.mp4`,
    poster: `${base('ekoparty-2026-bluespace')}/poster.webp`,
    slides: 15,
  },
  'ekoparty-2026-devsecops-space': {
    icon: 'branch',
    still: `${base('ekoparty-2026-devsecops-space')}/still.webp`,
    thumb: `${base('ekoparty-2026-devsecops-space')}/thumb.webp`,
  },
  'jcc-2026': {
    icon: 'chat',
    still: `${base('jcc-2026')}/still.webp`,
    thumb: `${base('jcc-2026')}/thumb.webp`,
  },
  'uai-webinar-2026-08': {
    deck: `${base('uai-webinar-2026-08')}/slides`,
    icon: 'workflow',
    still: `${base('uai-webinar-2026-08')}/still.webp`,
    thumb: `${base('uai-webinar-2026-08')}/thumb.webp`,
    cover: `${base('uai-webinar-2026-08')}/poster.webp`,
    slides: 27,
  },
  debconf26: {
    deck: `${base('debconf26')}/slides`,
    icon: 'layers',
    still: `${base('debconf26')}/still.webp`,
    thumb: `${base('debconf26')}/thumb.webp`,
    cover: `${base('debconf26')}/poster.webp`,
  },
  'vincular-inteligente-2026': {
    icon: 'link',
    still: `${base('vincular-inteligente-2026')}/still.webp`,
    thumb: `${base('vincular-inteligente-2026')}/thumb.webp`,
  },
  'cybersectuc-meetup-3': {
    icon: 'users',
    still: `${base('cybersectuc-meetup-3')}/still.webp`,
    thumb: `${base('cybersectuc-meetup-3')}/thumb.webp`,
  },
  'cacic-2024': {
    icon: 'cap',
    still: `${base('cacic-2024')}/still.webp`,
    thumb: `${base('cacic-2024')}/thumb.webp`,
    page: `${base('cacic-2024')}/paper.webp`,
  },
  'sacs-jaiio-2024': {
    icon: 'book',
    still: `${base('sacs-jaiio-2024')}/still.webp`,
    thumb: `${base('sacs-jaiio-2024')}/thumb.webp`,
    page: `${base('sacs-jaiio-2024')}/paper.webp`,
  },
};

/**
 * Where a talk's "Slides" link points from its day on: the talk in /charlas when
 * the deck is hosted there (with its animations), else the PDF in Drive.
 */
export function slidesHref(talk: Talk, today: string): string | undefined {
  if (talk.date > today) return undefined;
  return talkMedia[talk.id]?.deck ? `/charlas/${talk.id}` : talk.slidesUrl;
}
