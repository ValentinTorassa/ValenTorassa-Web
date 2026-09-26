import { expect, test } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

test('each talk has crawlable metadata and its own social image', () => {
  test.skip(test.info().project.name !== 'desktop', 'build artifact check; run once');
  const root = process.cwd();
  const manifest = JSON.parse(readFileSync(path.join(root, 'dist/talk-seo.json'), 'utf8')) as Array<{ id: string; title: { es: string } }>;
  const sitemap = readFileSync(path.join(root, 'dist/sitemap.xml'), 'utf8');
  expect(manifest.length).toBeGreaterThan(15);
  for (const { id, title } of manifest) {
    const html = readFileSync(path.join(root, `dist/charlas/${id}.html`), 'utf8');
    const url = `https://valentorassa.com/charlas/${id}`;
    expect(html).toContain(`<title>${title.es.replaceAll('&', '&amp;')} · Valentín Torassa</title>`);
    expect(html).toContain(`<link rel="canonical" href="${url}"`);
    expect(html).toContain(`<meta property="og:url" content="${url}"`);
    expect(html).toContain(`<meta property="og:image" content="https://valentorassa.com/og-charlas/${id}.png"`);
    expect(sitemap).toContain(`<loc>${url}</loc>`);
    const image = readFileSync(path.join(root, `dist/og-charlas/${id}.png`));
    expect(image.subarray(16, 24).readUInt32BE(0)).toBe(1200);
    expect(image.subarray(16, 24).readUInt32BE(4)).toBe(630);
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
  }
});

test('the back link on a deck returns to its talk', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'browser interaction; run once');
  await page.goto('/charlas/hacking-day-2026/slides');
  await page.getByRole('link', { name: 'Volver a la charla' }).click();
  await expect(page).toHaveURL(/\/charlas\/hacking-day-2026$/);
  await expect(page.locator('#card-hacking-day-2026')).toHaveAttribute('aria-selected', 'true');
});
