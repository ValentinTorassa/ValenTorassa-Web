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

The build writes one HTML file per talk and standalone paper to `dist/charlas/<id>.html`, plus `dist/sitemap.xml`. Each entry has its own 1200×630 social card in `public/og-charlas/`. After adding a talk or changing its title, run `npm run build`, `python3 scripts/generate-talk-og.py` (requires Pillow), and `npm run build` again. The first build may report a missing card; it still writes the manifest that the image script reads.

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
