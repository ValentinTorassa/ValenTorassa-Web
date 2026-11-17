import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { expect, test, type Page } from '@playwright/test';

/**
 * Routes of the site, discovered from the source:
 * - Every page exists in Spanish at the root and in English under /en/, with
 *   the same slugs. The path alone decides the language (src/site.ts); old
 *   `?lang=` links still load (Vercel sends ?lang=en to /en/..., see vercel.json).
 * - The build renders each page to HTML (src/entry-server.tsx, vite.config.ts)
 *   and the client hydrates it. In-page navigation is hash anchors (#experience...).
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
  { path: '/creatorstack-terms', name: 'creatorstack-terms' },
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

/**
 * Security headers, set in vercel.json. `vite preview` applies that file's
 * headers like Vercel does (vite.config.ts), so these checks see what
 * production sends:
 * - site pages (every page the build renders, the 404 page and public/*.html)
 *   get the strict CSP: scripts only from this origin, plus one hashed inline
 *   event handler (the Google Fonts swap in the HTML templates);
 * - talk decks (/charlas/<id>/slides) and /experiencia are self-contained pages
 *   that run their own inline scripts: their CSP only blocks plugins, <base>,
 *   foreign form targets and framing;
 * - PDFs get frame-ancestors only, so no built-in PDF viewer is affected;
 * - /p/* is proxied to another project whose page frames its own deck, so it
 *   may be framed by this origin only.
 */
type ResponseHeaders = Record<string, string>;

function cspDirectives(policy: string) {
  const directives = new Map<string, string[]>();
  for (const part of policy.split(';')) {
    const [name, ...sources] = part.trim().split(/\s+/);
    if (name) directives.set(name.toLowerCase(), sources);
  }
  return directives;
}

function expectBaseSecurityHeaders(headers: ResponseHeaders, where: string) {
  expect.soft(headers['x-content-type-options'], `${where}: X-Content-Type-Options`).toBe('nosniff');
  const maxAge = Number(/max-age=(\d+)/.exec(headers['strict-transport-security'] ?? '')?.[1] ?? 0);
  expect.soft(maxAge, `${where}: Strict-Transport-Security max-age`).toBeGreaterThanOrEqual(31536000);
  const permissions = headers['permissions-policy'] ?? '';
  for (const feature of ['camera', 'microphone', 'geolocation', 'payment', 'usb']) {
    expect.soft(permissions, `${where}: Permissions-Policy denies ${feature}`).toContain(`${feature}=()`);
  }
}

function expectSitePolicy(headers: ResponseHeaders, where: string) {
  expectBaseSecurityHeaders(headers, where);
  expect.soft(headers['x-frame-options'], `${where}: X-Frame-Options`).toBe('DENY');
  expect.soft(headers['referrer-policy'], `${where}: Referrer-Policy`).toBe('strict-origin-when-cross-origin');
  expect.soft(headers['content-security-policy-report-only'], `${where}: no report-only CSP`).toBeUndefined();

  const csp = cspDirectives(headers['content-security-policy'] ?? '');
  expect.soft(csp.get('default-src'), `${where}: CSP default-src`).toEqual(["'self'"]);
  expect.soft(csp.get('object-src'), `${where}: CSP object-src`).toEqual(["'none'"]);
  expect.soft(csp.get('frame-ancestors'), `${where}: CSP frame-ancestors`).toEqual(["'none'"]);
  expect.soft(csp.get('base-uri'), `${where}: CSP base-uri`).toEqual(["'self'"]);
  expect.soft(csp.get('form-action'), `${where}: CSP form-action`).toEqual(["'self'"]);
  const scripts = csp.get('script-src') ?? [];
  expect.soft(scripts, `${where}: CSP script-src`).toContain("'self'");
  for (const source of scripts) {
    expect.soft(source, `${where}: script-src allows only this origin and hashes`).toMatch(/^('self'|'unsafe-hashes'|'sha256-[A-Za-z0-9+/]+=*')$/);
  }
}

/** Records every CSP violation in the page, reported or blocked, for cspViolations(). */
async function watchCspViolations(page: Page) {
  await page.addInitScript(() => {
    const seen: string[] = [];
    (window as unknown as { __cspViolations: string[] }).__cspViolations = seen;
    document.addEventListener('securitypolicyviolation', (event) => {
      seen.push(`${event.disposition} ${event.effectiveDirective}: ${event.blockedURI || '-'} (${event.sourceFile || '-'}:${event.lineNumber})`);
    });
  });
}

function cspViolations(page: Page) {
  return page.evaluate(() => (window as unknown as { __cspViolations?: string[] }).__cspViolations ?? []);
}

/** The Google Fonts stylesheet loads as a preload that its hashed onload handler turns into a stylesheet. */
function pendingFontPreloads(page: Page) {
  return page.locator('link[rel="preload"][as="style"][href*="fonts.googleapis.com"]').count();
}

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

      await watchCspViolations(page);

      const response = await page.goto(route.path, { waitUntil: 'load' });
      expect(response, 'navigation response').not.toBeNull();
      expect(response!.ok(), `HTTP ${response!.status()}`).toBe(true);
      expectSitePolicy(response!.headers(), route.path);
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

      expect.soft(await cspViolations(page), 'CSP violations').toEqual([]);
      expect.soft(await pendingFontPreloads(page), 'Google Fonts preload never became a stylesheet').toBe(0);
      expect.soft(pageErrors, 'uncaught page errors').toEqual([]);
      expect.soft(consoleErrors, 'console errors').toEqual([]);
    });
  });
}

test.describe('security headers', () => {
  test('the 404 page gets the site policy and loads without CSP violations', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (message) => {
      // The 404 status of the page itself is logged as a failed resource.
      if (message.type() === 'error' && !/status of 404/.test(message.text())) consoleErrors.push(message.text());
    });
    await watchCspViolations(page);

    const response = await page.goto('/no-such-page', { waitUntil: 'load' });
    expect(response!.status()).toBe(404);
    expectSitePolicy(response!.headers(), '/no-such-page');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1').first()).toBeVisible();

    expect.soft(await cspViolations(page), 'CSP violations').toEqual([]);
    expect.soft(await pendingFontPreloads(page), 'Google Fonts preload never became a stylesheet').toBe(0);
    expect.soft(consoleErrors, 'console errors').toEqual([]);
  });

  test('every built page under the site policy runs no inline script the policy does not list', async ({ page, request }) => {
    test.skip(test.info().project.name !== 'desktop', 'viewport independent; run once');
    const dist = path.join(repoRoot, 'dist');
    const pages = readdirSync(dist, { recursive: true, encoding: 'utf8' }).filter((file) => file.endsWith('.html'));
    expect(pages.length).toBeGreaterThan(0);

    const hash = (value: string) => `'sha256-${createHash('sha256').update(value).digest('base64')}'`;
    const problems: string[] = [];
    let strict = 0;

    for (const file of pages) {
      const urlPath = `/${file.split(path.sep).join('/')}`.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
      const pathToGet = urlPath === '/404' ? '/no-such-page' : urlPath;
      const headers = (await request.get(pathToGet)).headers();
      const policy = headers['content-security-policy'];
      expect.soft(policy, `${pathToGet}: Content-Security-Policy`).toBeTruthy();
      const scripts = cspDirectives(policy ?? '').get('script-src');
      if (!scripts) continue; // a deck or /experiencia: no script policy
      strict += 1;
      expectSitePolicy(headers, pathToGet);

      // Parsed by the browser (DOMParser runs nothing), so entities and quoting
      // come out exactly as the browser hashes them.
      const inline = await page.evaluate((html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const scripts = [...doc.querySelectorAll('script:not([src])')]
          .filter((script) => ['', 'module', 'text/javascript'].includes((script.getAttribute('type') ?? '').toLowerCase())) // JSON-LD never runs
          .map((script) => script.textContent ?? '')
          .filter((text) => text.trim());
        const handlers: Array<[string, string]> = [];
        const javascriptUrls: string[] = [];
        for (const element of doc.querySelectorAll('*')) {
          for (const { name, value } of element.attributes) {
            if (/^on/i.test(name)) handlers.push([name, value]);
            if (/^(href|src|action|formaction)$/i.test(name) && /^\s*javascript:/i.test(value)) javascriptUrls.push(`<${element.localName} ${name}>`);
          }
        }
        return { scripts, handlers, javascriptUrls };
      }, readFileSync(path.join(dist, file), 'utf8'));

      for (const script of inline.scripts) {
        if (!scripts.includes(hash(script))) problems.push(`${file}: inline <script> (add ${hash(script)} to script-src in vercel.json)`);
      }
      for (const [name, handler] of inline.handlers) {
        if (!scripts.includes("'unsafe-hashes'") || !scripts.includes(hash(handler))) {
          problems.push(`${file}: ${name} handler "${handler}" (add 'unsafe-hashes' and ${hash(handler)} to script-src in vercel.json)`);
        }
      }
      for (const url of inline.javascriptUrls) problems.push(`${file}: javascript: URL in ${url}`);
    }
    expect(strict, 'pages checked under the site policy').toBeGreaterThan(50);
    expect(problems).toEqual([]);
  });

  test('decks, /experiencia, PDFs and /p get their own policies', async ({ request }) => {
    test.skip(test.info().project.name !== 'desktop', 'viewport independent; run once');
    const groups = [
      { paths: ['/charlas/hacking-day-2026/slides', '/experiencia', '/experiencia/'], frame: 'DENY', csp: "object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'" },
      { paths: ['/libro/muestra-capitulo-1.pdf'], frame: 'DENY', csp: "frame-ancestors 'none'" },
      // Proxied to valentorassa-preview on Vercel; the local preview answers 404 but sends the same headers.
      { paths: ['/p/any-page', '/p'], frame: 'SAMEORIGIN', csp: "object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'" },
    ];
    for (const group of groups) {
      for (const urlPath of group.paths) {
        const headers = (await request.get(urlPath)).headers();
        expectBaseSecurityHeaders(headers, urlPath);
        expect.soft(headers['x-frame-options'], `${urlPath}: X-Frame-Options`).toBe(group.frame);
        expect.soft(headers['content-security-policy'], `${urlPath}: Content-Security-Policy`).toBe(group.csp);
      }
    }
  });

  test('every talk deck and /experiencia load without CSP violations', async ({ page }) => {
    test.skip(test.info().project.name !== 'desktop', 'viewport independent; run once');
    test.setTimeout(120_000);
    const decks = readdirSync(path.join(repoRoot, 'public', 'charlas'))
      .filter((id) => existsSync(path.join(repoRoot, 'public', 'charlas', id, 'slides.html')))
      .map((id) => `/charlas/${id}/slides`);
    expect(decks.length).toBeGreaterThan(0);
    await watchCspViolations(page);
    for (const urlPath of [...decks, '/experiencia']) {
      const response = await page.goto(urlPath, { waitUntil: 'load' });
      expect(response!.ok(), `${urlPath}: HTTP ${response!.status()}`).toBe(true);
      await page.waitForTimeout(300);
      expect.soft(await cspViolations(page), `${urlPath}: CSP violations`).toEqual([]);
    }
  });
});

test('home leads to nine selected projects and the private dashboard without a GitHub API request', async ({ page }) => {
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
    'blackice',
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
    await expect(card.getByRole('button')).toHaveCount(0);

    const text = await card.innerText();
    expect(text, `${lang}: em or en dashes`).not.toMatch(/[—–]/);
    expect(text, `${lang}: never presented as open source`).not.toMatch(/open source|código abierto/i);
  }
});

test('project cards link the live site and the repository, with no case-study panel', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'viewport independent; run once');

  await page.goto('/');
  const card = page.locator('#research .repo-card').filter({ hasText: 'VT-SecretShare' });
  await expect(card.locator('a[href="https://secretshare.valentorassa.com"]')).toHaveText('secretshare.valentorassa.com');
  await expect(card.locator('a[href="https://github.com/ValentinTorassa/VT-SecretShare"]')).toHaveText('Repositorio');
  await expect(page.locator('#research button')).toHaveCount(0);
  await expect(page.locator('#research')).not.toContainText(/Evidencia|Explorar proyecto/);
});
