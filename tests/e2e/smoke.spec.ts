import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { expect, test, type Page } from '@playwright/test';

/**
 * Routes of the site, discovered from the source:
 * - The React app (src/main.tsx -> src/App.tsx) has no router: it is one page
 *   whose only "route" state is the `?lang=es|en` query param read in
 *   getInitialLanguage(). Without it the language comes from localStorage or
 *   the browser. In-page navigation is hash anchors (#profile, #experience...).
 * - eventos.html is a second Vite entry (src/eventos.tsx), built to
 *   dist/eventos.html and served at /eventos. It reads `?lang=` the same way.
 * - public/*.html are standalone static pages. vercel.json sets cleanUrls, so
 *   production serves them without the .html suffix; `vite preview` does the same.
 * - charlas.html is a third entry (src/charlas.tsx), served at /charlas; vercel.json
 *   rewrites /charlas/<talk id> to it, and the page reads the id from the path.
 * - public/sitemap.xml lists /, /?lang=es, /?lang=en, /eventos and /charlas.
 */
const ROUTES = [
  { path: '/', name: 'home' },
  { path: '/?lang=es', name: 'home-es' },
  { path: '/?lang=en', name: 'home-en' },
  { path: '/eventos', name: 'eventos' },
  { path: '/charlas', name: 'charlas' },
  { path: '/privacy', name: 'privacy' },
  { path: '/linkedin-privacy', name: 'linkedin-privacy' },
] as const;

/** Hosts that point back at this site (static pages link to the canonical domain). */
const SITE_HOSTS = new Set(['valentorassa.com', 'www.valentorassa.com']);

/** vercel.json rewrites (/charlas/<id> -> /charlas), applied here because `vite preview` does not know them. */
const REWRITES = (JSON.parse(readFileSync('vercel.json', 'utf8')).rewrites ?? []).map(
  ({ source, destination }: { source: string; destination: string }) =>
    [new RegExp(`^${source.replace(/:\w+/g, '[^/]+')}$`), destination] as const,
);
const rewrite = (pathname: string) => REWRITES.find(([pattern]) => pattern.test(pathname))?.[1] ?? pathname;

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
  test('every static page and sitemap entry is in ROUTES', () => {
    test.skip(test.info().project.name !== 'desktop', 'viewport independent; run once');
    const covered = new Set<string>(ROUTES.map((route) => route.path));

    const staticPages = readdirSync(path.join(repoRoot, 'public'))
      .filter((file) => file.endsWith('.html'))
      .map((file) => `/${file.replace(/\.html$/, '')}`);
    for (const page of staticPages) expect(covered, `public page ${page}`).toContain(page);

    const sitemap = readFileSync(path.join(repoRoot, 'public/sitemap.xml'), 'utf8');
    const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => {
      const url = new URL(match[1]);
      return `${url.pathname}${url.search}`;
    });
    expect(locs.length).toBeGreaterThan(0);
    for (const loc of locs) expect(covered, `sitemap entry ${loc}`).toContain(loc);
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
      // same-site links must resolve to a real page. `vite preview` falls back
      // to index.html for unknown paths, but Vercel (no rewrites in vercel.json)
      // returns 404, so a non-root path that serves the home page counts as broken.
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

        const localPath = `${rewrite(url.pathname)}${url.search}`;
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
