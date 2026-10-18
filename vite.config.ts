import { fileURLToPath, pathToFileURL } from 'node:url'
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { build, defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const root = fileURLToPath(new URL('.', import.meta.url))
const dist = path.join(root, 'dist')
const ssrOut = path.join(root, 'dist-ssr')

/** Files whose last commit dates a page's lastmod in the sitemap, next to its content date. */
const pageSources: Record<string, string[]> = {
  home: ['src/homeContent.ts', 'src/App.tsx', 'src/siteContent.ts'],
  charlas: ['src/charlasContent.ts', 'src/CharlasPage.tsx', 'src/events.ts', 'src/research.ts', 'src/talkMedia.ts'],
  eventos: ['src/eventsContent.ts', 'src/EventosPage.tsx', 'src/events.ts'],
  libro: ['src/libroContent.ts', 'src/LibroPage.tsx', 'public/og-libro.png'],
  'speaker-kit': ['src/speakerKitContent.ts', 'src/SpeakerKitPage.tsx'],
}

const git = (args: string[]) => execFileSync('git', args, { cwd: root, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()

/**
 * Whether the build can date files by their commits. A shallow clone (CI, and
 * Vercel when it has a .git at all) would date every file at its oldest commit,
 * so only a full history counts.
 */
function hasFullHistory() {
  try {
    return git(['rev-parse', '--is-shallow-repository']) === 'false'
  } catch {
    return false
  }
}

/** Day of the last commit touching `files`. */
function committedOn(files: string[]) {
  try {
    return git(['log', '-1', '--format=%cs', '--', ...files]) || undefined
  } catch {
    return undefined
  }
}

/** What src/entry-server.tsx exports, as the build uses it. */
type Route = { page: string; language: string; path: string; talkId?: string }
type EntryServer = {
  todayInArgentina(): string
  talkPages: Array<{ id: string }>
  socialImages: { talk(id: string): string }
  routes: Route[]
  renderRoute(route: Route, today: string): { file: string; template: string; lang: string; head: string; html: string }
  renderNotFound(): string
  sitemapXml(today: string, committedOn: Record<string, string | undefined>): string
  llmsTxt(today: string): string
}

/**
 * Static pages: after the client build, renders every page in both languages
 * to HTML (Spanish at /, English under /en/), each with its own head, and
 * writes the 404 page, sitemap.xml and llms.txt. The client then hydrates.
 */
function staticPagesPlugin(): Plugin {
  let isBuild = false
  return {
    name: 'static-pages',
    configResolved(config) {
      isBuild = config.command === 'build' && !config.build.ssr
    },
    // `vite preview` like Vercel: /en serves en/index.html and a path with no
    // page gets 404.html with status 404, instead of the home page.
    configurePreviewServer(server) {
      const out = path.resolve(server.config.root, server.config.build.outDir)
      const isFile = (file: string) => existsSync(file) && statSync(file).isFile()
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'GET' && req.method !== 'HEAD') return next()
        const url = new URL(req.url ?? '/', 'http://preview')
        let pathname: string
        try {
          pathname = decodeURIComponent(url.pathname)
        } catch {
          return next()
        }
        const file = path.join(out, pathname)
        if (!file.startsWith(out)) return next()
        if (isFile(file) || isFile(`${file}.html`)) return next()
        if (isFile(path.join(file, 'index.html'))) {
          if (!pathname.endsWith('/')) req.url = `${url.pathname}/index.html${url.search}`
          return next()
        }
        const notFound = path.join(out, '404.html')
        if (!isFile(notFound)) return next()
        res.statusCode = 404
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.end(req.method === 'HEAD' ? undefined : readFileSync(notFound))
      })
    },
    async closeBundle() {
      if (!isBuild) return

      // The same source, built for Node: renders the pages with the client's asset URLs.
      await build({
        configFile: false,
        root,
        logLevel: 'warn',
        plugins: [react()],
        build: {
          ssr: 'src/entry-server.tsx',
          outDir: ssrOut,
          emptyOutDir: true,
          rollupOptions: { output: { entryFileNames: 'entry-server.js' } },
        },
      })
      const server: EntryServer = await import(`${pathToFileURL(path.join(ssrOut, 'entry-server.js')).href}?t=${Date.now()}`)
      const today = server.todayInArgentina()

      for (const page of server.talkPages) {
        try {
          await access(path.join(root, 'public', server.socialImages.talk(page.id)))
        } catch {
          throw new Error(`Missing social image for ${page.id}. Run npm run build:talks to draw it.`)
        }
      }
      await writeFile(path.join(dist, 'talk-seo.json'), JSON.stringify(server.talkPages, null, 2))

      // Read every template before writing: index.html and charlas.html are also pages.
      const pages = server.routes.map((route) => server.renderRoute(route, today))
      const templates = new Map<string, string>()
      for (const { template } of pages) {
        if (!templates.has(template)) templates.set(template, await readFile(path.join(dist, template), 'utf8'))
      }

      for (const page of pages) {
        let html = templates.get(page.template)!
        const replace = (pattern: RegExp, value: string) => {
          if (!pattern.test(html)) throw new Error(`${page.template}: no match for ${pattern}`)
          html = html.replace(pattern, () => value)
        }
        replace(/<html lang="es"/, `<html lang="${page.lang}" data-rendered-on="${today}"`)
        replace(/<!-- The build replaces this title[^>]*-->\s*<title>[^<]*<\/title>/, page.head)
        replace(/<div id="root"><\/div>/, `<div id="root">${page.html}</div>`)
        const file = path.join(dist, page.file)
        await mkdir(path.dirname(file), { recursive: true })
        await writeFile(file, html)
      }

      const notFound = await readFile(path.join(dist, '404.html'), 'utf8')
      if (!notFound.includes('<div id="root"></div>')) throw new Error('404.html: no root to render into')
      await writeFile(path.join(dist, '404.html'), notFound.replace('<div id="root"></div>', () => `<div id="root">${server.renderNotFound()}</div>`))

      // CreatorStack pages exist for Google's OAuth review: reachable, but noindex and left out of the sitemap.
      const commits: Record<string, string | undefined> = {}
      if (hasFullHistory()) {
        for (const [page, files] of Object.entries(pageSources)) commits[page] = committedOn(files)
        for (const page of server.talkPages) {
          commits[`talk:${page.id}`] = committedOn([`public/charlas/${page.id}`, `public/og-charlas/${page.id}.png`])
        }
      }
      await writeFile(path.join(dist, 'sitemap.xml'), server.sitemapXml(today, commits))
      await writeFile(path.join(dist, 'llms.txt'), server.llmsTxt(today))
    },
  }
}

// https://vite.dev/config/
// Multi-page build: each HTML entry becomes its own page in dist/. With
// vercel.json `cleanUrls`, dist/eventos.html is served at /eventos (and
// /eventos.html redirects there), like public/privacy.html at /privacy.
export default defineConfig({
  plugins: [react(), staticPagesPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        eventos: fileURLToPath(new URL('./eventos.html', import.meta.url)),
        charlas: fileURLToPath(new URL('./charlas.html', import.meta.url)),
        'speaker-kit': fileURLToPath(new URL('./speaker-kit.html', import.meta.url)),
        libro: fileURLToPath(new URL('./libro.html', import.meta.url)),
        'not-found': fileURLToPath(new URL('./404.html', import.meta.url)),
      },
    },
  },
})
