import { readFileSync } from 'node:fs';
import path from 'node:path';
import { expect, test } from '@playwright/test';

/**
 * /libro is the page for the upcoming book (src/LibroPage.tsx). Its waitlist
 * section links to the form on vtsecurity.com.ar/libro, which has the anti-bot
 * check and counts sign-ups per ?ref=; nothing here posts to listmonk.
 */
const WAITLIST = 'https://vtsecurity.com.ar/libro?ref=web-libro';
const desktopOnly = () => test.skip(test.info().project.name !== 'desktop', 'viewport independent; run once');

test.describe('/libro', () => {
  test('shows the book, its contents and the waitlist, and fits the viewport', async ({ page }) => {
    await page.goto('/libro?lang=es');

    await expect(page.getByRole('heading', { level: 1, name: 'No podés defender lo que no entendés' })).toBeVisible();
    await expect(page.locator('.book-subtitle')).toHaveText('Linux, las abstracciones que fallan y el camino a la ciberseguridad');
    await expect(page.locator('.book-hero .eyebrow')).toHaveText('Libro · en preparación');
    const cover = page.locator('.book-cover img');
    await expect(cover).toHaveAttribute('alt', 'Tapa de No podés defender lo que no entendés: un iceberg con capas, cada una con un objeto');
    await expect.poll(() => cover.evaluate((img) => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);

    await expect(page.locator('#contenido .book-features li')).toHaveCount(4);
    await expect(page.locator('#indice .book-badge')).toHaveText('Índice provisorio');
    await expect(page.locator('#indice .book-toc-part li')).toHaveCount(12);
    await expect(page.locator('#indice .book-toc-part h3')).toHaveText(['Parte I. El mapa', 'Parte II. Las fugas', 'Parte III. La evidencia']);
    await expect(page.locator('#autor a[href="/charlas/debconf26"]')).toBeVisible();
    await expect(page.locator('#autor a[href="https://www.youtube.com/@vtcibersecurity"]')).toBeVisible();

    // The call to action near the top leads to the waitlist.
    await expect(page.locator('.book-hero-actions a[href="#lista"]')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  });

  test('the waitlist links to the form on vtsecurity.com.ar with its own ref', async ({ page }) => {
    desktopOnly();
    await page.goto('/libro?lang=es');

    const cta = page.locator('#lista').getByRole('link', { name: 'Anotarme en VT Security' });
    await expect(cta).toHaveAttribute('href', WAITLIST);
    await expect(cta).toHaveAttribute('target', '_blank');
    await expect(cta).toHaveAttribute('rel', /noopener/);
    await expect(page.locator('#lista')).toContainText('Te podés dar de baja con un clic desde cualquier mail.');

    // The mailing list is only reached through that form, never posted to from here.
    await expect(page.locator('form')).toHaveCount(0);
    for (const file of ['dist/libro.html', 'dist/en/libro.html']) {
      expect(readFileSync(path.join(process.cwd(), file), 'utf8'), file).not.toMatch(/news\.valentorassa\.com|subscription\/form/);
    }
  });

  test('has no horizontal overflow at 375 px', async ({ page }) => {
    desktopOnly();
    await page.setViewportSize({ width: 375, height: 812 });
    for (const lang of ['es', 'en']) {
      await page.goto(lang === 'es' ? '/libro' : '/en/libro');
      await page.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += 400) {
          window.scrollTo(0, y);
          await new Promise((resolve) => setTimeout(resolve, 30));
        }
      });
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth), lang).toBeLessThanOrEqual(1);
    }
  });

  test('keeps the public copy rules and says in English that the book is in Spanish', async ({ page }) => {
    desktopOnly();
    for (const lang of ['es', 'en']) {
      await page.goto(lang === 'es' ? '/libro' : '/en/libro');
      const text = await page.locator('main').innerText();
      expect(text, `${lang}: em or en dashes`).not.toMatch(/[—–]/);
      expect(text, `${lang}: exclamation marks`).not.toMatch(/[!¡]/);
      expect(text, `${lang}: AI as a method`).not.toMatch(/\b(IA|AI)\b|inteligencia artificial|artificial intelligence/i);
      expect(text, `${lang}: commercial details`).not.toMatch(/ISBN|editorial|imprenta|publisher|preventa|presale|páginas|pages/i);
    }

    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('.book-language-note')).toContainText('The book is in Spanish.');
    await expect(page.locator('h1')).toHaveAttribute('lang', 'es');
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'en_US');
    await expect(page.locator('#lista').getByRole('link', { name: 'Join on VT Security' })).toHaveAttribute('href', WAITLIST);

    await page.locator('.language-toggle').click();
    await expect(page).toHaveURL(/\/libro$/);
    await expect(page.locator('.book-language-note')).toHaveCount(0);
    await expect(page.locator('#lista h2')).toHaveText('Anotate en la lista de espera');
  });

  test('describes itself as a Book in JSON-LD', async ({ page }) => {
    desktopOnly();
    await page.goto('/libro');
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(blocks).toHaveLength(1);
    const data = JSON.parse(blocks[0]);
    expect(data).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'Book',
      name: 'No podés defender lo que no entendés',
      alternativeHeadline: 'Linux, las abstracciones que fallan y el camino a la ciberseguridad',
      inLanguage: 'es',
      author: { '@type': 'Person', '@id': 'https://valentorassa.com/#person', name: 'Valentín Torassa Colombero' },
      image: 'https://valentorassa.com/og-libro.png',
      url: 'https://valentorassa.com/libro',
      isPartOf: { '@id': 'https://valentorassa.com/#website' },
    });
    for (const key of ['isbn', 'datePublished', 'offers', 'price', 'publisher', 'numberOfPages']) expect(data, key).not.toHaveProperty(key);
  });

  test('has its own crawlable metadata, social image and sitemap entry', () => {
    desktopOnly();
    const root = process.cwd();
    const html = readFileSync(path.join(root, 'dist/libro.html'), 'utf8');
    const url = 'https://valentorassa.com/libro';
    expect(html).toContain('<title>No podés defender lo que no entendés · Valentín Torassa</title>');
    expect(html).toContain(`<link rel="canonical" href="${url}"`);
    expect(html).toContain(`<meta property="og:url" content="${url}"`);
    expect(html).toContain('<meta property="og:image" content="https://valentorassa.com/og-libro.png"');
    expect(html).toContain('<meta name="robots" content="index, follow"');
    const image = readFileSync(path.join(root, 'dist/og-libro.png'));
    expect(image.readUInt32BE(16)).toBe(1200);
    expect(image.readUInt32BE(20)).toBe(630);
    expect(readFileSync(path.join(root, 'dist/sitemap.xml'), 'utf8')).toContain(`<loc>${url}</loc>`);
  });

  test('the home page links here but the main menu does not', async ({ page }) => {
    desktopOnly();
    await page.goto('/?lang=es');
    await expect(page.locator('#talks a[href="/libro"]')).toHaveText('El libro, en preparación');
    await expect(page.locator('.nav-links a[href="/libro"]')).toHaveCount(0);
    await page.goto('/libro?lang=es');
    await expect(page.locator('.nav-links a[href="/libro"]')).toHaveCount(0);
    await expect(page.locator('.nav-links a[aria-current="page"]')).toHaveCount(0);
  });
});
