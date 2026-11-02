import { expect, test } from '@playwright/test';
import { talks } from '../../src/events';
import { linksAnalyticsUrl } from '../../src/linksAnalytics';

/** Noon in Argentina on the day after the last talk in src/events.ts, when none is coming. */
function afterTheLastTalk() {
  const last = talks.map((talk) => talk.endDate ?? talk.date).sort().at(-1)!;
  const day = new Date(`${last}T15:00:00Z`);
  day.setUTCDate(day.getUTCDate() + 1);
  return day;
}

/**
 * The links page is where the social bios point. A bio adds its tag (?ref=ig)
 * and the page carries it on to the destinations that count visits by ref.
 * Production serves it at https://links.vtsecurity.com.ar/ (docs/links-domain.md),
 * so links into the site are absolute; the preview serves it at /links.
 */
test.describe('links page', () => {
  test('opens with the neofetch and carries the bio tag to comandle and the book', async ({ page }) => {
    await page.goto('/links?ref=ig');
    await expect(page.locator('h1')).toHaveText('Links de Valentín Torassa');
    await expect(page.locator('.hero-terminal')).toContainText('valen@vt');
    await expect(page.locator('.w-comandle')).toHaveAttribute('href', 'https://comandle.valentorassa.com/?ref=links-ig');
    await expect(page.locator('.w-book')).toHaveAttribute('href', 'https://valentorassa.com/libro?ref=links-ig');
  });

  test('carries the bio tag to Apuntes, whose sign-ups keep any ref', async ({ page }) => {
    await page.goto('/links?ref=ig');
    await expect(page.locator('.w-apuntes')).toHaveAttribute('href', 'https://vtsecurity.com.ar/apuntes?ref=links-ig');
    await expect(page.locator('.w-apuntes')).toContainText('Un mail cada dos semanas');
    await page.goto('/links');
    await expect(page.locator('.w-apuntes')).toHaveAttribute('href', 'https://vtsecurity.com.ar/apuntes?ref=links');
  });

  test('gives the book the same status as /libro', async ({ page }) => {
    await page.goto('/links');
    await expect(page.locator('.hero-terminal')).toContainText('Libro: en preparación · cap. 1 gratis');
    await page.goto('/en/links');
    await expect(page.locator('.hero-terminal')).toContainText('Book: in progress · ch. 1 free');
  });

  test('shows the next talk while one is coming', async ({ page }) => {
    await page.clock.setFixedTime(new Date('2026-11-02T15:00:00Z'));
    await page.goto('/links');
    await expect(page.locator('.w-talk')).toHaveAttribute('href', 'https://valentorassa.com/charlas/rossec-2026');
    await expect(page.locator('.w-talk')).toContainText('ROS:SEC 2026');
    await expect(page.locator('.w-invite')).toHaveCount(0);
  });

  test('invites organizers to the speaker kit once no talk is coming', async ({ page }) => {
    await page.clock.setFixedTime(afterTheLastTalk());
    await page.goto('/links');
    await expect(page.locator('.w-talk')).toHaveAttribute('href', 'https://valentorassa.com/speaker-kit');
    await expect(page.locator('.w-talk')).toContainText('Invitame a tu evento');
    await expect(page.locator('.hero-terminal')).toContainText('Charla: sin fecha');
    await page.goto('/en/links');
    await expect(page.locator('.w-talk')).toHaveAttribute('href', 'https://valentorassa.com/en/speaker-kit');
    await expect(page.locator('.w-talk')).toContainText('Invite me to your event');
  });

  test('lists Facebook and Mastodon with the other profiles', async ({ page }) => {
    await page.goto('/links');
    const list = page.locator('.profile-list');
    await expect(list.locator('a[href="https://www.facebook.com/vtsecurity"]')).toContainText('Facebook');
    await expect(list.locator('a[href="https://infosec.exchange/@vtsecurity"]')).toContainText('@vtsecurity@infosec.exchange');
  });

  test('keeps the network refs that AutoMediaPoster adds to its posts', async ({ page }) => {
    await page.goto('/links?ref=threads');
    await expect(page.locator('.w-comandle')).toHaveAttribute('href', 'https://comandle.valentorassa.com/?ref=links-threads');
  });

  test('an unknown tag falls back to plain "links"', async ({ page }) => {
    await page.goto('/links?ref=<script>');
    await expect(page.locator('.w-comandle')).toHaveAttribute('href', 'https://comandle.valentorassa.com/?ref=links');
  });

  test('shows "did not load" instead of zero games when the counter fails', async ({ page }) => {
    await page.route('https://vtsecurity.com.ar/api/comandle', (route) => route.fulfill({ status: 503, body: '' }));
    await page.goto('/links');
    await expect(page.locator('.counts-off')).toBeVisible();
    await expect(page.locator('.hero-terminal')).toContainText('el comando del día');
  });

  test('closes with the numbers, after the profiles', async ({ page }) => {
    await page.goto('/links');
    await expect(page.locator('main > section').last()).toHaveClass('numbers');
    await expect(page.locator('.numbers')).toContainText('42 mil suscriptores.');
    await expect(page.locator('.numbers')).toContainText('579 videos.');
  });

  test('points search engines at its own host', async ({ page }) => {
    await page.goto('/en/links');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://links.vtsecurity.com.ar/en');
    await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveAttribute('href', 'https://links.vtsecurity.com.ar/');
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://valentorassa.com/og-links-2026-10.jpg');
    const card = await page.request.get('/og-links-2026-10.jpg');
    expect(card.ok()).toBe(true);
  });

  test('the English page links back to Spanish', async ({ page }) => {
    await page.goto('/en/links');
    await expect(page.locator('h1')).toHaveText("Valentín Torassa's links");
    await expect(page.locator('a[hreflang="es"]')).toHaveAttribute('href', 'https://links.vtsecurity.com.ar/');
  });

  test('reports its visits to analytics as /links, with the bio tag as the source', () => {
    const host = 'https://links.vtsecurity.com.ar';
    expect(linksAnalyticsUrl(`${host}/?ref=IG`)).toBe(`${host}/links?utm_source=ig`);
    expect(linksAnalyticsUrl(`${host}/en?ref=yt-short`)).toBe(`${host}/en/links?utm_source=yt-short`);
    expect(linksAnalyticsUrl(`${host}/en/`)).toBe(`${host}/en/links`);
    expect(linksAnalyticsUrl(`${host}/?ref=<script>&email=a@b.c`)).toBe(`${host}/links`);
    expect(linksAnalyticsUrl(`${host}/?utm_source=newsletter&ref=ig`)).toBe(`${host}/links?utm_source=newsletter`);
  });
});
