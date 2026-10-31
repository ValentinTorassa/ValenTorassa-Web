import { readFileSync } from 'node:fs';
import path from 'node:path';
import { expect, test, type APIRequestContext } from '@playwright/test';

/**
 * What crawlers and AI fetchers get without running JavaScript: every page is
 * HTML from the build (src/entry-server.tsx), Spanish at / and English under
 * /en/, each with its own head, hreflang and JSON-LD; plus the sitemap,
 * llms.txt and the 404 page. In the browser, the client hydrates that HTML.
 */
const root = process.cwd();
const ORIGIN = 'https://valentorassa.com';
const once = () => test.skip(test.info().project.name !== 'desktop', 'build output check; run once');

const sitemap = () => readFileSync(path.join(root, 'dist/sitemap.xml'), 'utf8');
const sitemapPaths = () => [...sitemap().matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);

async function rawHtml(request: APIRequestContext, pathname: string) {
  const response = await request.get(pathname);
  expect(response.status(), pathname).toBe(200);
  return response.text();
}

const attribute = (html: string, pattern: RegExp) => pattern.exec(html)?.[1];
// Los títulos de estas páginas son texto plano; la prueba falla si eso cambia.
const h1Text = (html: string) => /<h1[^>]*>([^<]*)<\/h1>/.exec(html)?.[1];
const jsonLd = (html: string) =>
  [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));

test.describe('HTML without JavaScript', () => {
  const pages = [
    { path: '/', lang: 'es', h1: 'Valentín Torassa Colombero', title: 'Valentín Torassa Colombero · Ciberseguridad y Backend', text: 'Diseño sistemas, creo herramientas para Linux' },
    { path: '/en/', lang: 'en', h1: 'Valentín Torassa Colombero', title: 'Valentin Torassa Colombero · Cybersecurity &amp; Backend', text: 'I design systems, build tools for Linux' },
    { path: '/libro', lang: 'es', h1: 'No podés defender lo que no entendés', title: 'No podés defender lo que no entendés · Valentín Torassa', text: 'Anotate en la lista de espera' },
    { path: '/en/libro', lang: 'en', h1: 'No podés defender lo que no entendés', title: 'No podés defender lo que no entendés · Valentín Torassa', text: 'The book is in Spanish.' },
    { path: '/charlas/jcc-2026', lang: 'es', h1: 'El problema no es el prompt: seguridad real en aplicaciones con IA', title: 'El problema no es el prompt: seguridad real en aplicaciones con IA · Valentín Torassa', text: 'FCEIA, UNR' },
    { path: '/en/charlas/jcc-2026', lang: 'en', h1: 'The problem is not the prompt: real security in AI applications', title: 'The problem is not the prompt: real security in AI applications · Valentín Torassa', text: 'Official page' },
    { path: '/charlas', lang: 'es', h1: 'Charlas', title: 'Charlas · Valentín Torassa', text: 'Elegí una charla' },
    { path: '/eventos', lang: 'es', h1: 'Eventos y charlas', title: 'Eventos y charlas · Valentín Torassa', text: 'Horarios de Argentina (UTC-3)' },
    { path: '/en/speaker-kit', lang: 'en', h1: 'Speaker kit', title: 'Speaker kit · Valentín Torassa', text: 'Practical details' },
  ];

  for (const expected of pages) {
    test(`${expected.path} has its content, title, language and URLs in the HTML`, async ({ request }) => {
      once();
      const html = await rawHtml(request, expected.path);
      const url = `${ORIGIN}${expected.path}`;
      const spanish = `${ORIGIN}${expected.path.replace(/^\/en(\/|$)/, '/')}`;
      const english = `${ORIGIN}${expected.path === '/' ? '/en/' : expected.path.startsWith('/en/') ? expected.path : `/en${expected.path}`}`;

      expect(attribute(html, /<html lang="([a-z]+)"/)).toBe(expected.lang);
      expect(h1Text(html)).toBe(expected.h1);
      expect(html.match(/<h1[\s>]/g)).toHaveLength(1);
      expect(html).toContain(`<title>${expected.title}</title>`);
      expect(html).toContain(expected.text);
      expect(attribute(html, /<link rel="canonical" href="([^"]+)"/)).toBe(url);
      expect(attribute(html, /<link rel="alternate" hreflang="es" href="([^"]+)"/)).toBe(spanish);
      expect(attribute(html, /<link rel="alternate" hreflang="en" href="([^"]+)"/)).toBe(english);
      expect(attribute(html, /<link rel="alternate" hreflang="x-default" href="([^"]+)"/)).toBe(spanish);
      expect(attribute(html, /<meta property="og:url" content="([^"]+)"/)).toBe(url);
      expect(attribute(html, /<meta property="og:locale" content="([^"]+)"/)).toBe(expected.lang === 'es' ? 'es_AR' : 'en_US');
      expect(html).not.toMatch(/[?&]lang=/);
    });
  }

  test('every page in the sitemap is real HTML with a self canonical and JSON-LD that parses', async ({ request }) => {
    once();
    const paths = sitemapPaths();
    expect(paths.length).toBeGreaterThanOrEqual(50);
    for (const pathname of paths) {
      const html = await rawHtml(request, pathname);
      expect(attribute(html, /<link rel="canonical" href="([^"]+)"/), pathname).toBe(`${ORIGIN}${pathname}`);
      expect(attribute(html, /<html lang="([a-z]+)"/), pathname).toBe(pathname.startsWith('/en/') ? 'en' : 'es');
      expect(h1Text(html)?.trim(), `${pathname}: h1`).toBeTruthy();
      const blocks = jsonLd(html);
      expect(blocks.length, `${pathname}: JSON-LD`).toBe(1);
      expect(blocks[0]['@context']).toBe('https://schema.org');
    }
  });
});

test.describe('structured data', () => {
  const person = { '@type': 'Person', '@id': `${ORIGIN}/#person`, name: 'Valentín Torassa Colombero', url: `${ORIGIN}/` };

  test('the home page carries the full Person, its profile page and the public projects, in both languages', async ({ request }) => {
    once();
    for (const pathname of ['/', '/en/']) {
      const [data] = jsonLd(await rawHtml(request, pathname));
      const graph = data['@graph'] as Array<Record<string, unknown>>;
      const node = (type: string) => graph.filter((item) => item['@type'] === type);
      const [profile] = node('ProfilePage');
      expect(profile).toMatchObject({ url: `${ORIGIN}${pathname}`, mainEntity: { '@id': `${ORIGIN}/#person` } });
      const [full] = node('Person');
      expect(full).toMatchObject({ ...person, jobTitle: ['Cybersecurity Engineer', 'Backend Engineer'], worksFor: { name: 'Teramot' } });
      expect(full.sameAs).toEqual(expect.arrayContaining([
        'https://www.wikidata.org/wiki/Q141749900',
        'https://bsky.app/profile/vtsecurity.bsky.social',
        'https://www.threads.com/@vt_security_',
        'https://www.facebook.com/vtsecurity',
        'https://dev.to/vtsecurity',
        'https://es.everybodywiki.com/Valent%C3%ADn_Torassa_Colombero',
      ]));
      const image = new URL(full.image as string);
      expect((await request.get(image.pathname)).ok(), 'Person image exists').toBe(true);
      expect(node('WebSite')).toHaveLength(1);
      // The eight public repositories the page shows; the private work has no code to point at.
      expect(node('SoftwareSourceCode').map((item) => item.name)).toEqual(['Open-Security-Labs', 'VT-Agent-Firewall', 'comandle', 'VT-Security-Fixes', 'VT-SecretShare', 'pluma', 'VT-Ragnaros', 'VT-Lens']);
    }
  });

  test('a talk page is an Event performed by the person', async ({ request }) => {
    once();
    const [event] = jsonLd(await rawHtml(request, '/charlas/hacking-day-2026'));
    expect(event).toMatchObject({
      '@type': 'Event',
      name: 'Firewall para agentes de IA: prompt injection en vivo',
      url: `${ORIGIN}/charlas/hacking-day-2026`,
      startDate: '2026-10-02T11:15:00-03:00',
      endDate: '2026-10-02T12:00:00-03:00',
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: { '@type': 'Place', name: 'Auditorio Principal', address: { addressLocality: 'Paraná, Entre Ríos' } },
      performer: person,
      image: `${ORIGIN}/og-charlas/hacking-day-2026.jpg`,
    });
    const [paper] = jsonLd(await rawHtml(request, '/en/charlas/wicc-2025-scada'));
    expect(paper).toMatchObject({ '@type': 'Event', startDate: '2025-04-10', workFeatured: { '@type': 'ScholarlyArticle', url: 'https://sedici.unlp.edu.ar/handle/10915/183861' } });
  });

  test('/eventos links to presentation pages and /libro is a Book by the person', async ({ request }) => {
    once();
    const [list] = jsonLd(await rawHtml(request, '/eventos'));
    expect(list['@type']).toBe('ItemList');
    expect(list.itemListElement.length).toBe(list.numberOfItems);
    expect(list.itemListElement.length).toBeGreaterThan(15);
    for (const item of list.itemListElement) {
      expect(item.item['@type']).toBe('WebPage');
      expect(item.item.url).toMatch(/^https:\/\/valentorassa\.com\/charlas\//);
      expect(item.item.name).toBeTruthy();
    }

    const [book] = jsonLd(await rawHtml(request, '/en/libro'));
    expect(book).toMatchObject({ '@type': 'Book', inLanguage: 'es', author: person, url: `${ORIGIN}/libro` });
  });

  test('every published Event has a known day and location, including nested objects', async ({ request }) => {
    once();
    let eventCount = 0;
    let workCount = 0;
    const visit = (value: unknown, pathname: string) => {
      if (!value || typeof value !== 'object') return;
      if (Array.isArray(value)) { value.forEach((item) => visit(item, pathname)); return; }
      const item = value as Record<string, unknown>;
      if (item['@type'] === 'Event') {
        eventCount++;
        expect(item.startDate, pathname).toMatch(/^\d{4}-\d{2}-\d{2}(?:T|$)/);
        const location = item.location as Record<string, unknown>;
        expect(location, pathname).toBeTruthy();
        if (location['@type'] === 'VirtualLocation') expect(location.url, pathname).toMatch(/^https:\/\//);
        else expect(location).toMatchObject({ '@type': 'Place', name: expect.any(String), address: { '@type': 'PostalAddress' } });
      }
      if (item['@type'] === 'CreativeWork') {
        workCount++;
        expect(item).not.toHaveProperty('startDate');
        expect(item).not.toHaveProperty('superEvent');
      }
      Object.values(item).forEach((child) => visit(child, pathname));
    };
    for (const pathname of sitemapPaths()) visit(jsonLd(await rawHtml(request, pathname)), pathname);
    expect(eventCount).toBeGreaterThan(0);
    expect(workCount).toBeGreaterThan(0);
  });
});

test.describe('hydration', () => {
  const pages = ['/', '/en/', '/charlas', '/charlas/jcc-2026', '/en/charlas/debconf26', '/eventos', '/en/eventos', '/libro', '/speaker-kit', '/en/speaker-kit'];

  // The HTML is rendered on build day; a visitor on another day must still hydrate cleanly.
  for (const day of ['build day', '2027-03-01T15:00:00Z']) {
    test(`pages hydrate without warnings (${day})`, async ({ page }) => {
      once();
      if (day !== 'build day') await page.clock.setFixedTime(new Date(day));
      const problems: string[] = [];
      page.on('console', (message) => {
        if (message.type() === 'error' || /hydrat|did not match|mismatch/i.test(message.text())) problems.push(`${page.url()}: ${message.text()}`);
      });
      page.on('pageerror', (error) => problems.push(`${page.url()}: ${error.message}`));
      for (const pathname of pages) {
        await page.goto(pathname, { waitUntil: 'networkidle' });
        await expect(page.locator('h1').first()).toBeVisible();
      }
      expect(problems).toEqual([]);
    });
  }

  test('the path decides the language, never the browser or a saved choice', async ({ browser }) => {
    once();
    const context = await browser.newContext({ locale: 'en-US' });
    await context.addInitScript(() => window.localStorage.setItem('vt-language', 'en'));
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await expect(page.locator('.hero-statement')).toContainText('Diseño sistemas');
    // An old ?lang= link (Vercel redirects ?lang=en; locally nothing does) shows the path's language and drops the parameter.
    await page.goto('/charlas?lang=en');
    await expect(page.locator('.hub-title')).toHaveText('Charlas');
    await expect(page).toHaveURL(/\/charlas$/);
    await page.goto('/en/charlas/jcc-2026');
    await expect(page.locator('h1')).toHaveText('The problem is not the prompt: real security in AI applications');
    await expect(page.locator('.language-toggle')).toHaveAttribute('href', '/charlas/jcc-2026');
    await context.close();
  });
});

test.describe('site files', () => {
  test('sitemap lists both languages with hreflang alternates and no ?lang URLs', () => {
    once();
    const xml = sitemap();
    expect(xml).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"');
    expect(xml).not.toContain('?lang=');
    const entries = xml.split('<url>').slice(1);
    for (const entry of entries) {
      const loc = /<loc>([^<]+)<\/loc>/.exec(entry)![1];
      const spanish = loc.replace(`${ORIGIN}/en/`, `${ORIGIN}/`);
      const english = spanish === `${ORIGIN}/` ? `${ORIGIN}/en/` : spanish.replace(`${ORIGIN}/`, `${ORIGIN}/en/`);
      expect(entry).toContain(`<xhtml:link rel="alternate" hreflang="es" href="${spanish}"/>`);
      expect(entry).toContain(`<xhtml:link rel="alternate" hreflang="en" href="${english}"/>`);
      expect(entry).toContain(`<xhtml:link rel="alternate" hreflang="x-default" href="${spanish}"/>`);
      const lastmod = /<lastmod>([^<]+)<\/lastmod>/.exec(entry)?.[1];
      if (lastmod) expect(lastmod).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
    expect(entries.filter((entry) => entry.includes('<lastmod>')).length).toBeGreaterThan(entries.length / 2);
    expect(readFileSync(path.join(root, 'public/robots.txt'), 'utf8')).toContain('Sitemap: https://valentorassa.com/sitemap.xml');
  });

  test('llms.txt says who this is and links the key pages, Spanish first', async ({ request }) => {
    once();
    const response = await request.get('/llms.txt');
    expect(response.ok()).toBe(true);
    const text = await response.text();
    expect(text.startsWith('# Valentín Torassa Colombero\n\n> ')).toBe(true);
    for (const heading of ['## Páginas', '## Charlas y papers', '## Otros sitios', '## Contacto', '## English']) expect(text).toContain(heading);
    for (const url of [`${ORIGIN}/charlas`, `${ORIGIN}/libro`, `${ORIGIN}/speaker-kit`, `${ORIGIN}/eventos`, `${ORIGIN}/charlas/debconf26`, `${ORIGIN}/en/`, 'https://vtsecurity.com.ar/', 'https://securitylabs.valentorassa.com/', 'https://github.com/ValentinTorassa']) {
      expect(text).toContain(`](${url})`);
    }
    expect(text.indexOf('## English')).toBeGreaterThan(text.indexOf('## Contacto'));
  });

  test('unknown paths get the branded 404 page, not indexed', async ({ request, page }) => {
    once();
    const response = await request.get('/no-existe/esta-pagina');
    expect(response.status()).toBe(404);
    const html = await response.text();
    expect(html).toContain('<meta name="robots" content="noindex" />');
    expect(h1Text(html)).toBe('Esta página no existe');
    expect(html).toContain('href="/en/"');
    await page.goto('/no-existe');
    await expect(page.getByRole('link', { name: 'Charlas' })).toHaveAttribute('href', '/charlas');
    // The site's stylesheet is there: the graphite background and the display face.
    expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe('rgb(11, 12, 14)');
    expect(await page.locator('h1').evaluate((h1) => getComputedStyle(h1).fontFamily)).toContain('IBM Plex Sans');
  });

  test('share images are the new files, 1200×630 and under 300 KB', async ({ request }) => {
    once();
    for (const pathname of ['/', '/charlas', '/eventos']) {
      const html = await rawHtml(request, pathname);
      const image = attribute(html, /<meta property="og:image" content="([^"]+)"/)!;
      expect(image).toMatch(/-2026-10\.jpg$/);
      expect(attribute(html, /<meta name="twitter:image" content="([^"]+)"/)).toBe(image);
      const file = await request.get(new URL(image).pathname);
      expect(file.ok(), image).toBe(true);
      expect((await file.body()).length, image).toBeLessThan(300 * 1024);
    }
  });
});

test('Bluesky, Threads, Facebook and DEV are with the other profiles, but the phone menu row stays as it was', async ({ page }) => {
  once();
  const profiles = [
    ['Bluesky', 'https://bsky.app/profile/vtsecurity.bsky.social'],
    ['Threads', 'https://www.threads.com/@vt_security_'],
    ['Facebook', 'https://www.facebook.com/vtsecurity'],
    ['DEV', 'https://dev.to/vtsecurity'],
  ];
  await page.goto('/');
  for (const [name, href] of profiles) {
    await expect(page.locator(`.contact-network-links a[href="${href}"]`)).toHaveText(name);
  }
  await page.goto('/speaker-kit');
  for (const [name, href] of profiles) {
    await expect(page.locator('.kit-profiles a', { hasText: name })).toHaveAttribute('href', href);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.locator('.mobile-menu-toggle').click();
  await expect(page.locator('.mobile-nav-social a')).toHaveCount(8);
});
