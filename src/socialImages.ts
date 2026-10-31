/**
 * Share images (1200×630) in public/. A new design gets a new file name, so
 * networks that cache the old image by URL pick the new one up.
 */
export const socialImages = {
  home: '/og-valentin-torassa-2026-10.jpg',
  charlas: '/og-charlas-2026-10.jpg',
  eventos: '/og-eventos-2026-10.jpg',
  libro: '/og-libro.png',
  /** Drawn by scripts/generate-links-og.mjs from scripts/links-og/card.html. */
  links: '/og-links-2026-10.jpg',
  /** Drawn by scripts/generate-talk-og.py. The PNG twins stay for the public decks, which point at them. */
  talk: (id: string) => `/og-charlas/${id}.jpg`,
} as const;

export const SOCIAL_IMAGE_SIZE = { width: 1200, height: 630 } as const;
