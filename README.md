# ValenTorassa Web

Personal CV site for Valentin Torassa Colombero, focused on cybersecurity, compliance, cloud, Linux, networks, backend work, research and teaching.

The app is a Vite + React + TypeScript project located at the repository root.

## Stack

- React 19
- TypeScript
- Vite
- TailwindCSS
- Framer Motion
- Lucide React

## Development

```bash
npm install
npm run dev
```

## Checks

```bash
npm run lint
npm run build
```

## Production Build

```bash
npm run build
npm run preview
```

Every page is in Spanish at the root and in English under `/en/`, with the same slugs (`/charlas/debconf26`, `/en/charlas/debconf26`). The path alone decides the language: no `?lang`, saved choice or browser setting changes the content, and the ES/EN toggle is a link to the other version. Old `?lang=en` links get a 308 to `/en/...` and `www.valentorassa.com` one to the apex (`vercel.json`).

The build renders every page to HTML, so crawlers and AI fetchers read the content without running JavaScript; the browser then hydrates it. After the client build, `vite.config.ts` builds `src/entry-server.tsx` for Node and writes, for both languages, the home page, `/charlas`, one page per talk and standalone paper (`dist/charlas/<id>.html`, `dist/en/charlas/<id>.html`), `/eventos`, `/libro` and `/speaker-kit`, each with its own title, description, canonical, hreflang, Open Graph and JSON-LD (`src/seo.ts`). It also writes `dist/sitemap.xml` (both languages, hreflang alternates, `lastmod` from talk dates and, when the build has the full git history, the last commit to each page's sources), `dist/llms.txt` and `dist/404.html`. Pages that depend on the date (upcoming and past talks) render with the build day and update in the browser right after loading, so a redeploy refreshes what crawlers see.

Each talk and paper has its own 1200×630 social card in `public/og-charlas/`: a JPEG for the pages and a PNG for the public decks. After adding a talk or changing its title, run `npm run build:talks` (requires Python Pillow). It writes the talk catalog, draws the cards from it, then builds the site once. Commit any changed cards with the event edit. A new share image for the home, /charlas or /eventos gets a new file name (`src/socialImages.ts`), so networks that cache images by URL pick it up.

`/speaker-kit` (`speaker-kit.html`, `src/SpeakerKitPage.tsx`) is the page for event organizers: bios, headshot, topics, talks, practical details and an invitation form that drafts a `mailto:` in the browser, with no backend. Its copy lives in `src/speakerKitContent.ts`; topics point at talk ids, and the talk lists come from `src/events.ts`, so a new talk shows up there without editing the kit.

`/libro` (`libro.html`, `src/LibroPage.tsx`) is the page for the upcoming book. Its copy lives in `src/libroContent.ts`. The approved 15-page chapter sample is freely readable at `/libro/muestra-capitulo-1.pdf`, with an exact opening-page capture at `/libro/muestra/page-02.png`. Joining the waitlist is optional. The waitlist section links to the form on `vtsecurity.com.ar/libro`, preserving a valid incoming `?ref=` campaign tag (letters, numbers, hyphens and underscores, up to 80 characters), including through the language toggle. Without a valid tag it uses `web-libro`. The form has the anti-bot check, counts sign-ups per ref and adds them to the listmonk list «Libro: lista de espera» (double opt-in); nothing on this site posts to listmonk or stores emails. Vercel events `book_sample_click` and `book_waitlist_click` include `ref`, `language` and `placement`; these count clicks, not completed downloads, readings or confirmed subscriptions. The book QR at the end of the JCC 2026 public deck points there too, with `?ref=jcc-qr`. The cover ships as responsive AVIF/WebP in `src/assets/libro-cover-*`, and `public/og-libro.png` is its 1200×630 social card. The page is linked from the home talks section but not from the main menu.

Public decks in `public/charlas/<id>/slides.html` carry a canonical URL and a link back to the talk. `VT-Knowledge-Engine-Brain/events/charlas-2026-decks/hub/public_decks.py` adds those when creating the public copies. Its `--decorate-existing <public/charlas>` mode updates already published copies.

## Verificación de regresiones - 2026-09-14

```bash
npm ci
npm run lint
npm run build
```

GitHub Actions ejecuta los comandos existentes en cada PR y push a main/master. Los hechos públicos se revisan junto al perfil y sus fuentes en Brain; no actualizar cifras de memoria.

## License

The source code is licensed under the [Apache License 2.0](LICENSE).

The content is not: the CV text, photos, logos and other personal material in this
repository are © Valentín Torassa Colombero, all rights reserved.
