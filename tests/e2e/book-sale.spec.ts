import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { expect, test, type Page } from '@playwright/test';

/**
 * The book's sale state (`bookSale` in src/bookSale.ts) is one object that
 * launch day flips from 'preparacion' to 'venta'. The rest of the suite checks
 * the build as it ships; these tests render the same pages through
 * src/entry-server.tsx with that object replaced, so the sale version is
 * checked before anyone flips it.
 */
const root = process.cwd();
const DEFAULT_CONFIG = "export const bookSale: BookSale = { status: 'preparacion' };";
const BUY_URL = 'https://tienda.example/no-podes-defender';
const once = () => test.skip(test.info().project.name !== 'desktop', 'renders in Node; run once');

type Route = { page: string; language: 'es' | 'en'; path: string };
type Rendered = { head: string; html: string };
type EntryServer = {
  routes: Route[];
  todayInArgentina(): string;
  renderRoute(route: Route, today: string): Rendered;
};

/** Renders `pages` with `bookSale` set to `sale`, as the build would after that edit. */
async function renderWithSale(sale: Record<string, string>, pages: Array<Pick<Route, 'page' | 'language'>>) {
  const { createServer } = await import('vite');
  const { default: react } = await import('@vitejs/plugin-react');
  const cacheDir = mkdtempSync(path.join(tmpdir(), 'book-sale-'));
  let replaced = false;
  const server = await createServer({
    configFile: false,
    root,
    cacheDir,
    // Errors still reject ssrLoadModule; the bad-price test expects one.
    logLevel: 'silent',
    appType: 'custom',
    server: { middlewareMode: true, hmr: false, watch: null },
    optimizeDeps: { noDiscovery: true, include: [] },
    plugins: [
      react(),
      {
        name: 'book-sale-fixture',
        enforce: 'pre',
        transform(code, id) {
          if (!id.endsWith('/src/bookSale.ts')) return undefined;
          replaced = code.includes(DEFAULT_CONFIG);
          return code.replace(DEFAULT_CONFIG, `export const bookSale: BookSale = ${JSON.stringify(sale)};`);
        },
      },
    ],
  });
  try {
    const entry = (await server.ssrLoadModule('/src/entry-server.tsx')) as EntryServer;
    // If the default line changes, update DEFAULT_CONFIG rather than test the shipped state twice.
    expect(replaced, 'src/bookSale.ts still has the default config line').toBe(true);
    const today = entry.todayInArgentina();
    return pages.map(({ page, language }) => {
      const route = entry.routes.find((item) => item.page === page && item.language === language);
      if (!route) throw new Error(`No route for ${page} (${language})`);
      return entry.renderRoute(route, today);
    });
  } finally {
    await server.close();
    rmSync(cacheDir, { recursive: true, force: true });
  }
}

const jsonLd = (head: string) =>
  [...head.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
const description = (head: string) => /<meta name="description" content="([^"]*)"/.exec(head)?.[1];

/** The rendered markup in a page, with nothing loaded from the network. */
async function show(page: Page, html: string) {
  await page.route('**/*', (route) => route.abort());
  await page.setContent(html);
}

test.describe('book sale state', () => {
  test('on sale, /libro shows the price and Comprar where the waitlist was, and offers the book', async ({ page }) => {
    once();
    const [libroEs, libroEn] = await renderWithSale(
      { status: 'venta', price: '25.000', buyUrl: BUY_URL },
      [{ page: 'libro', language: 'es' }, { page: 'libro', language: 'en' }],
    );

    await show(page, libroEs.html);
    await expect(page.locator('.book-hero .eyebrow')).toHaveText('Libro · a la venta');
    const heroActions = page.locator('.book-hero-actions a');
    await expect(heroActions).toHaveText(['Comprar · $25.000', 'Leer el capítulo gratis', 'Ver el índice']);
    await expect(heroActions.first()).toHaveAttribute('href', BUY_URL);
    await expect(heroActions.first()).toHaveClass(/btn-primary/);
    await expect(heroActions.nth(1)).toHaveAttribute('href', '/libro/muestra-capitulo-1.pdf');
    await expect(page.locator('#lista')).toHaveCount(0);
    await expect(page.locator('a[href="#lista"]')).toHaveCount(0);
    await expect(page.locator('#muestra')).not.toContainText('sin anotarte');

    const buy = page.locator('#comprar');
    await expect(buy.locator('h2')).toHaveText('Comprar el libro');
    await expect(buy.locator('.book-price')).toHaveText('Precio$25.000');
    await expect(buy.getByRole('link', { name: 'Comprar' })).toHaveAttribute('href', BUY_URL);
    await expect(buy.getByRole('link', { name: 'Leer el capítulo 1 gratis' })).toHaveAttribute('href', '/libro/muestra-capitulo-1.pdf');

    const [book] = jsonLd(libroEs.head);
    expect(book['@type']).toBe('Book');
    expect(book.isbn).toBe('9786310192888');
    expect(book.offers).toEqual({
      '@type': 'Offer',
      url: BUY_URL,
      price: '25000',
      priceCurrency: 'ARS',
      availability: 'https://schema.org/InStock',
    });

    await show(page, libroEn.html);
    await expect(page.locator('.book-hero .eyebrow')).toHaveText('Book · on sale');
    await expect(page.locator('.book-hero-actions a').first()).toHaveText('Buy · ARS 25,000');
    await expect(page.locator('#comprar .book-price')).toHaveText('PriceARS 25,000');
    expect(jsonLd(libroEn.head)[0].offers.price).toBe('25000');
  });

  test('on sale, home, speaker kit and links stop saying the book is in preparation', async () => {
    once();
    const [homeEs, homeEn, kitEs, kitEn, linksEs, linksEn] = await renderWithSale(
      { status: 'venta', price: '25000', buyUrl: BUY_URL },
      [
        { page: 'home', language: 'es' },
        { page: 'home', language: 'en' },
        { page: 'speaker-kit', language: 'es' },
        { page: 'speaker-kit', language: 'en' },
        { page: 'links', language: 'es' },
        { page: 'links', language: 'en' },
      ],
    );

    expect(description(homeEs.head)).toMatch(/proyectos open source y un libro sobre Linux y ciberseguridad\.$/);
    expect(description(homeEn.head)).toMatch(/open source projects, and a book on Linux and security\.$/);
    expect(kitEs.html).toContain('y publicó «No podés defender lo que no entendés», un libro sobre Linux');
    expect(kitEn.html).toContain('and published “No podés defender lo que no entendés”, a book on Linux');
    expect(kitEs.html).toContain('en YouTube, y publicó un libro sobre Linux y ciberseguridad.');
    expect(kitEn.html).toContain('on YouTube, and published a book on Linux and cybersecurity.');
    expect(linksEs.html).toContain('a la venta · cap. 1 gratis');
    expect(linksEn.html).toContain('on sale · ch. 1 free');
    for (const rendered of [homeEs, homeEn, kitEs, kitEn, linksEs, linksEn]) {
      expect(rendered.head + rendered.html).not.toMatch(/en preparación|está escribiendo|upcoming book|is writing|in progress · ch\. 1/);
    }
  });

  test('on sale without a price, Comprar shows alone and the offer has no price', async ({ page }) => {
    once();
    const [libro] = await renderWithSale({ status: 'venta', buyUrl: BUY_URL }, [{ page: 'libro', language: 'es' }]);

    await show(page, libro.html);
    await expect(page.locator('.book-hero-actions a').first()).toHaveText('Comprar');
    await expect(page.locator('#comprar .book-price')).toHaveCount(0);
    expect(jsonLd(libro.head)[0].offers).toEqual({ '@type': 'Offer', url: BUY_URL, availability: 'https://schema.org/InStock' });
  });

  test("'venta' without a buyUrl keeps the site as in preparation", async ({ page }) => {
    once();
    const [libro, kit] = await renderWithSale(
      { status: 'venta', price: '25000' },
      [{ page: 'libro', language: 'es' }, { page: 'speaker-kit', language: 'es' }],
    );

    await show(page, libro.html);
    await expect(page.locator('.book-hero .eyebrow')).toHaveText('Libro · en preparación');
    await expect(page.locator('#lista h2')).toHaveText('Anotate en la lista de espera');
    await expect(page.locator('#comprar')).toHaveCount(0);
    expect(jsonLd(libro.head)[0].offers).toBeUndefined();
    expect(kit.html).toContain('y está escribiendo «No podés defender lo que no entendés»');
  });

  test('a price that is not whole pesos fails the build instead of shipping', async () => {
    once();
    await expect(
      renderWithSale({ status: 'venta', price: '25.000,50', buyUrl: BUY_URL }, [{ page: 'libro', language: 'es' }]),
    ).rejects.toThrow(/whole pesos/);
  });
});
