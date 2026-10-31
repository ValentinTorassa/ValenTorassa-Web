import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { expect, test, type Page } from '@playwright/test';

/**
 * Routes of the site, discovered from the source:
 * - Every page exists in Spanish at the root and in English under /en/, with
 *   the same slugs. The path alone decides the language (src/site.ts); old
 *   `?lang=` links still load (Vercel sends ?lang=en to /en/..., see vercel.json).
 * - The build renders each page to HTML (src/entry-server.tsx, vite.config.ts)
 *   and the client hydrates it. In-page navigation is hash anchors (#profile...).
 * - index.html (src/main.tsx -> src/App.tsx) is the home page: dist/index.html
 *   and dist/en/index.html.
 * - eventos.html (src/eventos.tsx) is /eventos and /en/eventos.
 * - charlas.html (src/charlas.tsx) is /charlas; the build also writes
 *   dist/charlas/<id>.html (and dist/en/charlas/<id>.html) for every talk and paper.
 * - speaker-kit.html (src/speakerKit.tsx) is /speaker-kit, the page for event organizers.
 * - libro.html (src/libro.tsx) is /libro: the upcoming book and its waitlist form.
 * - links.html (src/links.tsx) is /links: the page every social bio points to.
 *   Production serves it at https://links.vtsecurity.com.ar/ and leaves it out
 *   of this site's sitemap (docs/links-domain.md).
 * - public/*.html are standalone static pages. vercel.json sets cleanUrls, so
 *   production serves them without the .html suffix; `vite preview` does the same.
 * - 404.html is served for any other path, with status 404.
 * - the build sitemap lists every page in both languages; noindex static pages
 *   (the CreatorStack OAuth pages) are reachable but left out.
 */
const ROUTES = [
  { path: '/', name: 'home' },
  { path: '/en/', name: 'home-en' },
  { path: '/?lang=es', name: 'home-legacy-lang' },
  { path: '/eventos', name: 'eventos' },
  { path: '/en/eventos', name: 'eventos-en' },
  { path: '/charlas', name: 'charlas' },
  { path: '/en/charlas', name: 'charlas-en' },
  { path: '/charlas/hacking-day-2026', name: 'talk-hacking-day' },
  { path: '/en/charlas/hacking-day-2026', name: 'talk-hacking-day-en' },
  { path: '/speaker-kit', name: 'speaker-kit' },
  { path: '/en/speaker-kit', name: 'speaker-kit-en' },
  { path: '/libro', name: 'libro' },
  { path: '/en/libro', name: 'libro-en' },
  { path: '/links', name: 'links' },
  { path: '/en/links', name: 'links-en' },
  { path: '/privacy', name: 'privacy' },
  { path: '/linkedin-privacy', name: 'linkedin-privacy' },
  { path: '/creatorstack', name: 'creatorstack' },
  { path: '/creatorstack-privacy', name: 'creatorstack-privacy' },
] as const;

/** Hosts that point back at this site (static pages link to the canonical domain). */
const SITE_HOSTS = new Set(['valentorassa.com', 'www.valentorassa.com']);

/**
 * Console errors that genuinely cannot work in a local `vite preview` run.
 * Each entry must say why. The site currently loads no Vercel Analytics/Speed
 * Insights script, so nothing is allowlisted yet; add entries here (e.g.
 * /\/_vercel\/insights\//, which only exists on Vercel) if that changes.
 */
const CONSOLE_ERROR_ALLOWLIST: Array<{ pattern: RegExp; reason: string }> = [];

const repoRoot = process.cwd();

async function scrollThrough(page: Page) {
  // Scroll the whole page so whileInView animations and lazy images settle
  // before measuring overflow and taking the full-page screenshot.
  await page.evaluate(async () => {
    const step = Math.max(200, Math.floor(window.innerHeight * 0.8));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
    window.scrollTo(0, document.documentElement.scrollHeight);
    await new Promise((resolve) => setTimeout(resolve, 300));
    window.scrollTo(0, 0);
    await new Promise((resolve) => setTimeout(resolve, 300));
  });
}

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
}

test.describe('route coverage', () => {
  test('every static page is covered and every sitemap entry has an HTML file', () => {
    test.skip(test.info().project.name !== 'desktop', 'viewport independent; run once');
    const covered = new Set<string>(ROUTES.map((route) => route.path));

    const staticPages = readdirSync(path.join(repoRoot, 'public'))
      .filter((file) => file.endsWith('.html'))
      .map((file) => `/${file.replace(/\.html$/, '')}`);
    for (const page of staticPages) expect(covered, `public page ${page}`).toContain(page);

    const sitemap = readFileSync(path.join(repoRoot, 'dist/sitemap.xml'), 'utf8');
    const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => {
      const url = new URL(match[1]);
      return `${url.pathname}${url.search}`;
    });
    expect(locs.length).toBeGreaterThan(0);
    const noindex = readdirSync(path.join(repoRoot, 'public'))
      .filter((file) => file.endsWith('.html'))
      .filter((file) => /<meta name="robots" content="[^"]*noindex/.test(readFileSync(path.join(repoRoot, 'public', file), 'utf8')))
      .map((file) => `/${file.replace(/\.html$/, '')}`);
    for (const page of noindex) expect(locs, `noindex page ${page} is not in the sitemap`).not.toContain(page);
    for (const loc of locs) {
      expect(loc, `sitemap entry ${loc}`).toMatch(/^(\/en)?(\/|\/(charlas|eventos|libro|speaker-kit)|\/charlas\/[a-z0-9-]+)$/);
      const file = loc.endsWith('/') ? `${loc}index.html` : `${loc}.html`;
      expect(existsSync(path.join(repoRoot, 'dist', file.slice(1))), `built page ${loc}`).toBe(true);
    }
  });
});

for (const route of ROUTES) {
  test.describe(`${route.name} (${route.path})`, () => {
    test('loads cleanly, fits the viewport and has working internal links', async ({ page, request }, testInfo) => {
      const pageErrors: string[] = [];
      const consoleErrors: string[] = [];
      page.on('pageerror', (error) => pageErrors.push(error.stack ?? error.message));
      page.on('console', (message) => {
        if (message.type() !== 'error') return;
        const text = `${message.text()} (${message.location().url})`;
        if (CONSOLE_ERROR_ALLOWLIST.some((entry) => entry.pattern.test(text))) return;
        consoleErrors.push(text);
      });

      const response = await page.goto(route.path, { waitUntil: 'load' });
      expect(response, 'navigation response').not.toBeNull();
      expect(response!.ok(), `HTTP ${response!.status()}`).toBe(true);
      await page.waitForLoadState('networkidle');

      // Main landmark and heading.
      await expect(page.locator('main').first()).toBeVisible();
      await expect(page.locator('h1').first()).toBeVisible();

      // Horizontal overflow, at first paint and after scrolling the page.
      const atLoad = await horizontalOverflow(page);
      await scrollThrough(page);
      const afterScroll = await horizontalOverflow(page);

      // Full-page screenshot for review before asserting, so a failing route
      // still leaves one (test-results/ is not committed; CI uploads it).
      const screenshotPath = path.join(repoRoot, 'test-results', 'screenshots', testInfo.project.name, `${route.name}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      await testInfo.attach(`${route.name}-${testInfo.project.name}`, { path: screenshotPath, contentType: 'image/png' });

      expect.soft(atLoad.scrollWidth, 'horizontal overflow at load').toBeLessThanOrEqual(atLoad.clientWidth + 1);
      expect.soft(afterScroll.scrollWidth, 'horizontal overflow after scrolling').toBeLessThanOrEqual(
        afterScroll.clientWidth + 1,
      );

      // Internal links: hash anchors must hit an element on the page; other
      // same-site links must resolve to a real page. Like Vercel, the preview
      // answers unknown paths with 404.html (vite.config.ts); a non-root path
      // that serves the home page would count as broken too.
      const links = await page.$$eval('a[href]', (anchors) =>
        anchors.map((anchor) => ({ raw: anchor.getAttribute('href') ?? '', href: (anchor as HTMLAnchorElement).href })),
      );
      const current = new URL(page.url());
      const homeBody = await (await request.get('/')).text();
      const brokenLinks: string[] = [];
      const checkedPaths = new Map<string, boolean>();

      for (const link of links) {
        const url = new URL(link.href);
        if (!/^https?:$/.test(url.protocol)) continue; // mailto:, tel:, ...
        if (url.origin !== current.origin && !SITE_HOSTS.has(url.hostname)) continue; // external

        if (url.origin === current.origin && url.pathname === current.pathname && url.hash) {
          const id = decodeURIComponent(url.hash.slice(1));
          const exists = await page.evaluate((target) => document.getElementById(target) !== null, id);
          if (!exists) brokenLinks.push(`${link.raw} -> no element with id "${id}"`);
          continue;
        }

        const localPath = `${url.pathname}${url.search}`;
        if (!checkedPaths.has(localPath)) {
          const res = await request.get(localPath);
          const body = res.ok() ? await res.text() : '';
          const spaFallback = url.pathname !== '/' && body === homeBody;
          checkedPaths.set(localPath, res.ok() && !spaFallback);
        }
        if (!checkedPaths.get(localPath)) brokenLinks.push(`${link.raw} -> ${localPath} does not resolve`);
      }
      expect.soft(brokenLinks, 'broken internal links').toEqual([]);

      expect.soft(pageErrors, 'uncaught page errors').toEqual([]);
      expect.soft(consoleErrors, 'console errors').toEqual([]);
    });
  });
}

test('home leads to eight selected projects and the private case study without a GitHub API request', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'viewport independent; run once');

  const apiRequests: string[] = [];
  page.on('request', (request) => {
    if (request.url().startsWith('https://api.github.com/')) apiRequests.push(request.url());
  });
  await page.goto('/en/');

  await expect(page.locator('.hero-avatar')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Explore projects' })).toHaveAttribute('href', '#research');
  await expect(page.getByRole('link', { name: 'Read the blog' })).toHaveAttribute('href', 'https://vtsecurity.com.ar');
  await expect(page.locator('#research h4')).toHaveText([
    'Open-Security-Labs',
    'VT-Agent-Firewall',
    'comandle',
    'VT-Security-Fixes',
    'VT-SecretShare',
    'pluma',
    'VT-Ragnaros',
    'VT-Lens',
    'VT-Radar',
  ]);
  const projectVisuals = page.locator('#research .repo-card-media img');
  await expect(projectVisuals).toHaveCount(8);
  await expect(page.locator('#research .repo-card-media-label')).toHaveCount(0);
  for (const visual of await projectVisuals.all()) {
    await visual.scrollIntoViewIfNeeded();
    await expect.poll(() => visual.evaluate((img) => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  }
  expect(apiRequests).toEqual([]);
});

test('private work shows its synthetic preview without a public link', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'viewport independent; run once');

  for (const lang of ['es', 'en'] as const) {
    await page.goto(lang === 'es' ? '/' : '/en/');
    const label = lang === 'es' ? 'Acceso privado' : 'Private access';
    const card = page.locator('#research .repo-card.is-private');

    await expect(card).toHaveCount(1);
    await expect(card.locator('.repo-private-badge')).toHaveText(label);
    await expect(card.locator('a')).toHaveCount(0);
    await expect(card.locator('img')).toHaveCount(1);
    await expect(card.locator('img')).toHaveAttribute('alt', /synthetic|sintéticas/);
    await expect(card).toContainText(lang === 'es' ? 'Tablero de solo lectura' : 'Read-only dashboard');

    await card.getByRole('button').click();
    const drawer = page.getByRole('dialog');
    await expect(drawer.locator('.project-drawer-details article')).toHaveCount(3);
    await expect(drawer.locator('.repo-private-badge')).toHaveText(label);
    await expect(drawer.locator('a')).toHaveCount(0);

    const text = `${await card.innerText()}\n${await drawer.innerText()}`;
    expect(text, `${lang}: em or en dashes`).not.toMatch(/[—–]/);
    expect(text, `${lang}: never presented as open source`).not.toMatch(/open source|código abierto/i);
    await page.keyboard.press('Escape');
    await expect(drawer).toHaveCount(0);
  }
});
