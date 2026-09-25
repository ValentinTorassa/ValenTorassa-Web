import { expect, test } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

/**
 * /charlas lists every talk in src/events.ts on a 3D stage with a selector
 * below. The selected talk comes from the URL (/charlas/<id> in production,
 * #<id> or ?c=<id> anywhere) and, like /eventos, the deck and its preview only
 * open from the talk's day on in Argentina, so each test pins the date. Papers
 * (src/research.ts) open from the button too, and those without a talk get a card.
 */
const BEFORE_EKOPARTY = new Date('2026-09-25T15:00:00Z');
const OWASP_DAY = new Date('2026-10-07T15:00:00Z');

test.describe('/charlas', () => {
  test('shows every talk and opens the one in the URL', async ({ page }) => {
    await page.clock.setFixedTime(BEFORE_EKOPARTY);
    await page.goto('/charlas?lang=es#hacking-day-2026');

    await expect(page.getByRole('heading', { level: 1, name: 'Charlas' })).toBeVisible();
    expect(await page.getByRole('option').count()).toBeGreaterThan(10);
    await expect(page.locator('#card-hacking-day-2026')).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('.hub-name')).toHaveText('Firewall para agentes de IA: prompt injection en vivo');
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  });

  test('opens the deck and its preview only from the talk\'s day on', async ({ page }) => {
    test.skip(test.info().project.name !== 'desktop', 'viewport independent; run once');

    await page.clock.setFixedTime(BEFORE_EKOPARTY);
    await page.goto('/charlas?lang=es#ekoparty-2026-owasp-village');
    await expect(page.locator('.hub-name')).toContainText('Dónde se rompe OAuth');
    await expect(page.locator('a.hub-open')).toHaveCount(0);
    await expect(page.locator('.hub-open.is-off')).toContainText('Slides el');
    await expect(page.locator('.hub-screen video')).toHaveCount(0);
    await expect(page.locator('.hub-link', { hasText: 'Código' })).toHaveCount(0);

    await page.clock.setFixedTime(OWASP_DAY);
    await page.reload();
    await expect(page.locator('a.hub-open')).toHaveAttribute('href', '/charlas/ekoparty-2026-owasp-village/slides');
    await expect(page.locator('.hub-link', { hasText: 'PDF' })).toHaveAttribute('href', /drive\.google\.com/);
    await expect(page.locator('.hub-screen video')).toHaveAttribute('src', '/charlas/ekoparty-2026-owasp-village/reel.mp4');
    await expect(page.locator('.hub-link', { hasText: 'Código' })).toHaveAttribute('href', /VT-Agent-Firewall/);
  });

  test('Enter opens the hosted deck, with its animations', async ({ page }) => {
    test.skip(test.info().project.name !== 'desktop', 'viewport independent; run once');

    await page.clock.setFixedTime(OWASP_DAY);
    await page.goto('/charlas?lang=es#ekoparty-2026-owasp-village');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/charlas\/ekoparty-2026-owasp-village\/slides/);
    await expect(page.locator('section.slide').first()).toBeAttached();
  });

  test('moves with the arrow keys and keeps the choice in the URL', async ({ page }) => {
    test.skip(test.info().project.name !== 'desktop', 'viewport independent; run once');

    await page.clock.setFixedTime(BEFORE_EKOPARTY);
    await page.goto('/charlas?lang=es#hacking-day-2026');
    await page.keyboard.press('ArrowRight');

    const selected = page.locator('.deck-card[aria-selected="true"]');
    await expect(selected).not.toHaveId('card-hacking-day-2026');
    const id = (await selected.getAttribute('id'))!.replace('card-', '');
    await expect(page).toHaveURL(new RegExp(`/charlas/${id}`));
  });

  test('the selector is cut by year: a click on a year or ↑ ↓ jump between years', async ({ page }) => {
    test.skip(test.info().project.name !== 'desktop', 'viewport independent; run once');

    await page.clock.setFixedTime(BEFORE_EKOPARTY);
    await page.goto('/charlas?lang=es#cacic-2024');
    const years = await page.locator('.deck-year').allInnerTexts();
    expect(years).toEqual([...years].sort());
    expect(years.length).toBeGreaterThanOrEqual(3);
    await expect(page.locator('.deck-year.is-current')).toHaveText('2024');

    await page.keyboard.press('ArrowDown');
    await expect(page.locator('.deck-year.is-current')).toHaveText('2025');
    await expect(page.locator('.deck-group[aria-label="2025"] .deck-card').first()).toHaveAttribute('aria-selected', 'true');

    await page.keyboard.press('ArrowUp');
    await expect(page.locator('.deck-group[aria-label="2024"] .deck-card').first()).toHaveAttribute('aria-selected', 'true');

    await page.locator('.deck-year', { hasText: '2026' }).click();
    await expect(page.locator('.deck-year.is-current')).toHaveText('2026');
    await expect(page.locator('.deck-group[aria-label="2026"] .deck-card').first()).toHaveAttribute('aria-selected', 'true');
  });

  test('clicking a talk selects it', async ({ page }) => {
    await page.clock.setFixedTime(BEFORE_EKOPARTY);
    await page.goto('/charlas?lang=es');
    await page.locator('#card-debconf26').click();
    await expect(page.locator('#card-debconf26')).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('.hub-name')).toContainText('Abstraction Leaks');
  });

  test('a talk with no slides opens its paper', async ({ page }) => {
    test.skip(test.info().project.name !== 'desktop', 'viewport independent; run once');

    await page.clock.setFixedTime(BEFORE_EKOPARTY);
    await page.goto('/charlas?lang=es#sacs-jaiio-2024');
    await expect(page.locator('a.hub-open')).toHaveText(/Leer el paper/);
    await expect(page.locator('a.hub-open')).toHaveAttribute('href', 'https://revistas.unlp.edu.ar/JAIIO/article/view/17896');
    await expect(page.locator('.hub-screen img')).toHaveAttribute('src', '/charlas/sacs-jaiio-2024/paper.webp');
  });

  test('papers of their own have a card, with the paper as the picture', async ({ page }) => {
    await page.clock.setFixedTime(BEFORE_EKOPARTY);
    await page.goto('/charlas?lang=es');
    await page.locator('#card-wicc-2025-scada').click();
    await expect(page.locator('.hub-name')).toContainText('Dockerización de servidores SCADA');
    await expect(page.locator('.hub-soon.is-paper')).toHaveText('Póster');
    await expect(page.locator('.hub-meta')).toContainText('Con Santiago Roatta y María Eugenia Casco');
    await expect(page.locator('a.hub-open')).toHaveAttribute('href', 'https://sedici.unlp.edu.ar/handle/10915/183861');
    await expect(page.locator('.hub-screen img')).toHaveAttribute('src', '/charlas/wicc-2025-scada/still.webp');
  });

  test('the landing page and /eventos link here', async ({ page }) => {
    test.skip(test.info().project.name !== 'desktop', 'viewport independent; run once');

    await page.clock.setFixedTime(BEFORE_EKOPARTY);
    await page.goto('/?lang=es');
    await expect(page.locator('a.talks-page-link[href="/charlas"]')).toHaveCount(1);
    await page.goto('/eventos?lang=es');
    await page.getByRole('link', { name: 'Charlas', exact: true }).first().click();
    await expect(page).toHaveURL(/\/charlas/);
    await expect(page.getByRole('heading', { level: 1, name: 'Charlas' })).toBeVisible();
  });
});

test('the public decks carry no speaker notes', () => {
  test.skip(test.info().project.name !== 'desktop', 'file check; run once');

  const root = path.join(process.cwd(), 'public/charlas');
  const decks = readdirSync(root).filter((id) => {
    try {
      readFileSync(path.join(root, id, 'slides.html'));
      return true;
    } catch {
      return false;
    }
  });
  expect(decks.length).toBeGreaterThan(5);
  for (const id of decks) {
    const html = readFileSync(path.join(root, id, 'slides.html'), 'utf8');
    expect(html, `${id}: notes in the scene data`).not.toMatch(/notes\s*:\s*'[^']/);
    expect(html, `${id}: notes in data-notes`).not.toMatch(/data-notes="[^"]/);
  }
});
