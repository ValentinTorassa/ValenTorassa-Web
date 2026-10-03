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

The build writes one HTML file per talk and standalone paper to `dist/charlas/<id>.html`, plus `dist/sitemap.xml`. Each entry has its own 1200×630 social card in `public/og-charlas/`. After adding a talk or changing its title, run `npm run build:talks` (requires Python Pillow). It writes the talk catalog, draws the cards from it, then builds the site once. Commit any changed cards with the event edit.

`/speaker-kit` (`speaker-kit.html`, `src/SpeakerKitPage.tsx`) is the page for event organizers: bios, headshot, topics, talks, practical details and an invitation form that drafts a `mailto:` in the browser, with no backend. Its copy lives in `src/speakerKitContent.ts`; topics point at talk ids, and the talk lists come from `src/events.ts`, so a new talk shows up there without editing the kit.

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
