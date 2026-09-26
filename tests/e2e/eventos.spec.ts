import { expect, test, type Page } from '@playwright/test';

/**
 * /eventos reads the talks from src/events.ts and splits them into upcoming
 * and past by today's date in Argentina, so each test pins the clock.
 * 2026-09-24 12:00 in Argentina (UTC-3).
 */
const BEFORE_THE_TALKS = new Date('2026-09-24T15:00:00Z');

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
}

test.describe('/eventos', () => {
  test('renders the heading and upcoming talks, and fits the viewport', async ({ page }) => {
    await page.clock.setFixedTime(BEFORE_THE_TALKS);
    await page.goto('/eventos?lang=es');

    await expect(page.getByRole('heading', { level: 1, name: 'Eventos y charlas' })).toBeVisible();

    const upcoming = page.locator('#proximas');
    await expect(upcoming.getByRole('heading', { level: 2, name: 'Próximas' })).toBeVisible();
    await expect(upcoming.locator('.talk-card').first()).toBeVisible();
    await expect(upcoming.locator('#hacking-day-2026')).toContainText('Firewall para agentes de IA');
    await expect(upcoming.locator('#joven-argentina-fnga-2026')).toContainText('Por invitación');
    await expect(page.locator('#pasadas #debconf26')).toBeVisible();

    expect(await horizontalOverflow(page), 'horizontal overflow').toBeLessThanOrEqual(1);
  });

  test('moves a talk to past once its day is over in Argentina', async ({ page }) => {
    test.skip(test.info().project.name !== 'desktop', 'viewport independent; run once');

    // 2026-10-02 23:30 in Argentina: already Oct 3 in UTC, Hacking Day is still today.
    await page.clock.setFixedTime(new Date('2026-10-03T02:30:00Z'));
    await page.goto('/eventos?lang=es');
    await expect(page.locator('#proximas #hacking-day-2026')).toBeVisible();

    // 2026-10-03 00:30 in Argentina: Hacking Day is past, CACIC 2026 still upcoming.
    await page.clock.setFixedTime(new Date('2026-10-03T03:30:00Z'));
    await page.reload();
    await expect(page.locator('#pasadas #hacking-day-2026')).toBeVisible();
    await expect(page.locator('#proximas #cacic-2026-podman')).toBeVisible();
  });

  test('shows the slides link only from the talk\'s day on', async ({ page }) => {
    test.skip(test.info().project.name !== 'desktop', 'viewport independent; run once');

    const slides = page.locator('#hacking-day-2026 .talk-links a', { hasText: 'Slides' });

    await page.clock.setFixedTime(BEFORE_THE_TALKS);
    await page.goto('/eventos?lang=es');
    await expect(page.locator('#hacking-day-2026')).toBeVisible();
    await expect(slides).toHaveCount(0);

    // 2026-10-02 09:00 in Argentina: the day of Hacking Day.
    await page.clock.setFixedTime(new Date('2026-10-02T12:00:00Z'));
    await page.reload();
    await expect(slides).toHaveCount(1);
    // The deck is hosted in /charlas, animations and all, so the link goes there, not to the PDF.
    await expect(slides).toHaveAttribute('href', '/charlas/hacking-day-2026');
  });

  test('switches language with the header toggle', async ({ page }) => {
    test.skip(test.info().project.name !== 'desktop', 'viewport independent; run once');

    await page.clock.setFixedTime(BEFORE_THE_TALKS);
    await page.goto('/eventos?lang=es');
    await page.locator('.language-toggle').click();

    await expect(page.getByRole('heading', { level: 1, name: 'Events and talks' })).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page).toHaveTitle('Events and talks · Valentín Torassa');
  });

  test('the home speaking panel links here', async ({ page }) => {
    test.skip(test.info().project.name !== 'desktop', 'viewport independent; run once');

    await page.clock.setFixedTime(BEFORE_THE_TALKS);
    await page.goto('/?lang=es');
    const link = page.locator('#talks a[href="/eventos"]');
    await expect(link).toHaveText('Ver todas las charlas');

    await link.click();
    await expect(page).toHaveURL(/\/eventos$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Eventos y charlas' })).toBeVisible();
  });
});
