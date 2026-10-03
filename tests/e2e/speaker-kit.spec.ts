import { readFileSync } from 'node:fs';
import path from 'node:path';
import { expect, test } from '@playwright/test';

/**
 * /speaker-kit is the page for event organizers (src/SpeakerKitPage.tsx). Its
 * talks come from src/events.ts and split into upcoming and past by today's
 * date in Argentina, so the tests pin the clock.
 */
const HACKING_DAY = new Date('2026-10-02T15:00:00Z');
const DAY_AFTER_HACKING_DAY = new Date('2026-10-03T15:00:00Z');
const desktopOnly = () => test.skip(test.info().project.name !== 'desktop', 'viewport independent; run once');

test.describe('/speaker-kit', () => {
  test('has the bios, headshot, topics, talks, details and invitation, and fits the viewport', async ({ page }) => {
    await page.clock.setFixedTime(DAY_AFTER_HACKING_DAY);
    await page.goto('/speaker-kit?lang=es');

    await expect(page.getByRole('heading', { level: 1, name: 'Kit para organizadores' })).toBeVisible();
    for (const id of ['bio', 'temas', 'charlas', 'datos', 'invitar']) {
      await expect(page.locator(`#${id} h2`)).toBeVisible();
    }
    await expect(page.locator('#bio .kit-bio')).toHaveCount(2);
    await expect(page.locator('#foto img')).toBeVisible();
    await expect.poll(() => page.locator('#foto img').evaluate((img) => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    await expect(page.locator('#datos .kit-facts > div')).toHaveCount(8);

    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  });

  test('keeps the public copy rules in both languages', async ({ page }) => {
    desktopOnly();
    await page.clock.setFixedTime(DAY_AFTER_HACKING_DAY);

    for (const lang of ['es', 'en']) {
      await page.goto(`/speaker-kit?lang=${lang}`);
      const text = await page.locator('main').innerText();
      expect(text, `${lang}: em or en dashes`).not.toMatch(/[—–]/);
      expect(text, `${lang}: degree still in progress`).not.toMatch(/graduad|egresad|graduate|alumn/i);
      expect(text, `${lang}: no job-search signals`).not.toMatch(/open to work|hiring|busco trabajo|disponible para trabajar|available for (work|hire)/i);
      await expect(page.locator('#bio .kit-bio').first()).toContainText(lang === 'es' ? 'último año' : 'final year');
    }
  });

  test('every topic links its talks from the events list', async ({ page }) => {
    desktopOnly();
    await page.goto('/speaker-kit?lang=es');

    const topics = page.locator('#temas .kit-topic');
    await expect(topics).toHaveCount(6);
    for (const topic of await topics.all()) {
      const hrefs = await topic.locator('li a').evaluateAll((links) => links.map((link) => link.getAttribute('href')));
      expect(hrefs.length, await topic.locator('h3').innerText()).toBeGreaterThan(0);
      for (const href of hrefs) expect(href).toMatch(/^\/charlas\/[a-z0-9-]+$/);
    }
    await expect(page.locator('#tema-linux')).toContainText('Abstraction Leaks');
  });

  test('past and upcoming talks follow the date in Argentina', async ({ page }) => {
    desktopOnly();

    await page.clock.setFixedTime(HACKING_DAY);
    await page.goto('/speaker-kit?lang=es');
    await expect(page.locator('#charlas-proximas')).toContainText('Firewall para agentes de IA');

    await page.clock.setFixedTime(DAY_AFTER_HACKING_DAY);
    await page.reload();
    const past = page.locator('#charlas-anteriores');
    await expect(past).toContainText('Firewall para agentes de IA');
    await expect(past).toContainText('Mejor Exposición');
    await expect(past).toContainText('Expositor Distinguido en Seguridad Informática');
    await expect(page.locator('#charlas-proximas')).toContainText('JCC 2026');
    await expect(past.locator('a[href="/charlas/debconf26"]')).toHaveCount(1);
  });

  test('the headshot downloads as a 720 px PNG', async ({ page }) => {
    desktopOnly();
    await page.goto('/speaker-kit?lang=es');

    const link = page.locator('#foto a[download]');
    await expect(link).toHaveAttribute('download', 'valentin-torassa-colombero.png');
    const response = await page.request.get((await link.getAttribute('href'))!);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image/png');
    const png = await response.body();
    expect(png.readUInt32BE(16)).toBe(720);
    expect(png.readUInt32BE(20)).toBe(720);
  });

  test('copies the short bio', async ({ page, context }) => {
    desktopOnly();
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/speaker-kit?lang=es');

    const card = page.locator('#bio .kit-bio').first();
    await card.getByRole('button', { name: 'Copiar' }).click();
    await expect(card.getByRole('button', { name: 'Copiada' })).toBeVisible();
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toBe(await card.locator('p').innerText());
  });

  test('the invitation form drafts an email with every field, without a server', async ({ page }) => {
    desktopOnly();
    const posts: string[] = [];
    page.on('request', (request) => {
      if (request.method() !== 'GET') posts.push(request.url());
    });
    await page.goto('/speaker-kit?lang=es');

    const form = page.locator('#invitar form');
    const field = (name: string) => form.getByRole('textbox', { name, exact: true });
    const choice = (name: string) => form.getByRole('combobox', { name, exact: true });
    await form.getByRole('button', { name: 'Armar el mail' }).click();
    await expect(page.locator('.kit-draft')).toHaveCount(0);

    await field('Evento').fill('Jornadas de Prueba');
    await field('Fecha').fill('2026-11-14');
    await field('Sitio del evento').fill('https://example.org/jornadas');
    await field('Ciudad').fill('Córdoba');
    await form.getByRole('radio', { name: 'Virtual' }).check();
    await choice('Formato').selectOption('demo');
    await choice('Duración').selectOption('60');
    await choice('Tema').selectOption('agents');
    await field('Público').fill('200 estudiantes y profesionales');
    await field('Tu nombre').fill('Ana Pérez');
    await field('Tu email').fill('ana@example.org');
    await field('Organización').fill('Universidad de Prueba');
    await field('Mensaje').fill('Sería el sábado a la tarde.');
    await form.getByRole('button', { name: 'Armar el mail' }).click();

    const draft = page.locator('.kit-draft');
    await expect(draft).toBeVisible();
    await expect(draft).toBeFocused();
    const href = await draft.locator('a.kit-mailto').getAttribute('href');
    expect(href).toMatch(/^mailto:valentin\.torassa\.colombero@gmail\.com\?/);
    const params = new URLSearchParams(href!.split('?')[1]);
    expect(params.get('subject')).toBe('Invitación a dar una charla: Jornadas de Prueba (14 de noviembre de 2026)');
    const body = params.get('body')!;
    expect(body).toContain('\r\n');
    for (const line of [
      'Evento: Jornadas de Prueba',
      'Sitio: https://example.org/jornadas',
      'Fecha: 14 de noviembre de 2026',
      'Lugar: Córdoba · Virtual',
      'Formato: Charla con demo en vivo',
      'Duración: 60 minutos',
      'Tema: Seguridad en agentes de IA',
      'Público: 200 estudiantes y profesionales',
      'Contacto: Ana Pérez',
      'Organización: Universidad de Prueba',
      'Email: ana@example.org',
      'Sería el sábado a la tarde.',
    ]) {
      expect(body).toContain(line);
    }
    await expect(draft.locator('.kit-draft-text')).toContainText('Tema: Seguridad en agentes de IA');

    // The draft follows the language toggle.
    await page.locator('.language-toggle').click();
    await expect(draft.locator('.kit-draft-text')).toContainText('Speaking invitation: Jornadas de Prueba (November 14, 2026)');
    await expect(draft.locator('.kit-draft-text')).toContainText('Topic: AI agent security');
    expect(posts).toEqual([]);
  });

  test('switches language with the header toggle and the bio button', async ({ page }) => {
    desktopOnly();
    await page.goto('/speaker-kit?lang=es');

    await page.getByRole('button', { name: 'Ver la bio en inglés' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Speaker kit' })).toBeVisible();
    await expect(page).toHaveTitle('Speaker kit · Valentín Torassa');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'en_US');

    await page.locator('.language-toggle').click();
    await expect(page.getByRole('heading', { level: 1, name: 'Kit para organizadores' })).toBeVisible();
  });

  test('the home page, /charlas and /eventos link here', async ({ page }) => {
    desktopOnly();
    await page.clock.setFixedTime(DAY_AFTER_HACKING_DAY);

    await page.goto('/?lang=es');
    await expect(page.locator('#talks a[href="/speaker-kit"]')).toHaveText('Invitarme a tu evento');
    await page.goto('/charlas?lang=es');
    await expect(page.locator('.hub-link[href="/speaker-kit"]')).toHaveText('Invitarme a tu evento');
    await page.goto('/eventos?lang=es');
    await page.locator('.events-hero a[href="/speaker-kit"]').click();
    await expect(page).toHaveURL(/\/speaker-kit$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Kit para organizadores' })).toBeVisible();
  });

  test('has its own crawlable metadata and a sitemap entry', () => {
    desktopOnly();
    const root = process.cwd();
    const html = readFileSync(path.join(root, 'dist/speaker-kit.html'), 'utf8');
    const url = 'https://valentorassa.com/speaker-kit';
    expect(html).toContain('<title>Kit para organizadores · Valentín Torassa</title>');
    expect(html).toContain(`<link rel="canonical" href="${url}"`);
    expect(html).toContain(`<meta property="og:url" content="${url}"`);
    expect(html).toContain('<meta name="robots" content="index, follow"');
    expect(html).toContain('"@type": "ProfilePage"');
    expect(readFileSync(path.join(root, 'dist/sitemap.xml'), 'utf8')).toContain(`<loc>${url}</loc>`);
  });
});
