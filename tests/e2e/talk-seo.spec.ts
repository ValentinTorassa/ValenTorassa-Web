import { expect, test } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

/** Width and height from a JPEG's start-of-frame segment. */
function jpegSize(image: Buffer) {
  let offset = 2;
  while (offset < image.length) {
    const marker = image[offset + 1];
    const length = image.readUInt16BE(offset + 2);
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { height: image.readUInt16BE(offset + 5), width: image.readUInt16BE(offset + 7) };
    }
    offset += 2 + length;
  }
  throw new Error('no SOF segment');
}

const escape = (text: string) => text.replaceAll('&', '&amp;');
const literal = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

test('each talk has crawlable metadata and its own social image, in both languages', () => {
  test.skip(test.info().project.name !== 'desktop', 'build artifact check; run once');
  const root = process.cwd();
  const manifest = JSON.parse(readFileSync(path.join(root, 'dist/talk-seo.json'), 'utf8')) as Array<{ id: string; title: { es: string; en: string } }>;
  const sitemap = readFileSync(path.join(root, 'dist/sitemap.xml'), 'utf8');
  expect(manifest.length).toBeGreaterThan(15);
  for (const { id, title } of manifest) {
    const es = `https://valentorassa.com/charlas/${id}`;
    const en = `https://valentorassa.com/en/charlas/${id}`;
    for (const [language, file, url] of [['es', `dist/charlas/${id}.html`, es], ['en', `dist/en/charlas/${id}.html`, en]] as const) {
      const html = readFileSync(path.join(root, file), 'utf8');
      expect(html).toContain(`<html lang="${language}"`);
      expect(html).toContain(`<title>${escape(title[language])} · Valentín Torassa</title>`);
      // The talk's title is the page's only h1, in the HTML itself.
      expect(html.match(/<h1[\s>]/g), `${file}: one h1`).toHaveLength(1);
      expect(html).toMatch(new RegExp(`<h1 class="hub-name[^"]*">${literal(escape(title[language]))}</h1>`));
      expect(html).toContain(`<link rel="canonical" href="${url}"`);
      expect(html).toContain(`<link rel="alternate" hreflang="es" href="${es}"`);
      expect(html).toContain(`<link rel="alternate" hreflang="en" href="${en}"`);
      expect(html).toContain(`<link rel="alternate" hreflang="x-default" href="${es}"`);
      expect(html).toContain(`<meta property="og:url" content="${url}"`);
      expect(html).toContain(`<meta property="og:image" content="https://valentorassa.com/og-charlas/${id}.jpg"`);
      expect(sitemap).toContain(`<loc>${url}</loc>`);
    }
    const image = readFileSync(path.join(root, `dist/og-charlas/${id}.jpg`));
    expect(jpegSize(image)).toEqual({ width: 1200, height: 630 });
    expect(image.length, `${id}.jpg size`).toBeLessThan(300 * 1024);
  }
  expect(manifest.some(({ id }) => id === 'nope')).toBe(false);
});

test('public decks link back to their talk and identify themselves to sharing bots', () => {
  test.skip(test.info().project.name !== 'desktop', 'build artifact check; run once');
  const root = path.join(process.cwd(), 'dist/charlas');
  const decks = readdirSync(root).filter((id) => {
    try { readFileSync(path.join(root, id, 'slides.html')); return true; } catch { return false; }
  });
  expect(decks.length).toBeGreaterThan(10);
  for (const id of decks) {
    const html = readFileSync(path.join(root, id, 'slides.html'), 'utf8');
    expect(html, id).toContain(`<link rel="canonical" href="https://valentorassa.com/charlas/${id}/slides">`);
    expect(html, id).toContain(`href="/charlas/${id}">← Volver a la charla</a>`);
    expect(html, id).toContain(`content="https://valentorassa.com/og-charlas/${id}.png"`);
    // Opened offline, the browser only honours a charset declared in the first 1024 bytes.
    const charset = Buffer.from(html, 'utf8').indexOf('<meta charset=');
    expect(charset, `${id}: <meta charset> position`).toBeGreaterThanOrEqual(0);
    expect(charset, `${id}: <meta charset> position`).toBeLessThan(1024);
  }
});

test('the back link on a deck returns to its talk', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'browser interaction; run once');
  await page.goto('/charlas/hacking-day-2026/slides');
  await page.getByRole('link', { name: 'Volver a la charla' }).click();
  await expect(page).toHaveURL(/\/charlas\/hacking-day-2026$/);
  await expect(page.locator('#card-hacking-day-2026')).toHaveAttribute('aria-selected', 'true');
});
