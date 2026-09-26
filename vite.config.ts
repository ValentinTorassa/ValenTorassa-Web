import { fileURLToPath } from 'node:url'
import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { talkPages, talkPageMeta } from './src/talkSeo'

const dist = fileURLToPath(new URL('./dist', import.meta.url))
const socialImages = fileURLToPath(new URL('./public/og-charlas', import.meta.url))
const escapeHtml = (value: string) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

function setTag(html: string, selector: string, value: string) {
  const pattern = new RegExp(`(<meta ${selector} content=")[^"]*(")`)
  if (!pattern.test(html)) throw new Error(`Missing metadata tag: ${selector}`)
  return html.replace(pattern, (_match, before: string, after: string) => `${before}${escapeHtml(value)}${after}`)
}

function talkPagesPlugin() {
  return {
    name: 'static-talk-pages',
    async closeBundle() {
      await writeFile(path.join(dist, 'talk-seo.json'), JSON.stringify(talkPages, null, 2))
      const template = await readFile(path.join(dist, 'charlas.html'), 'utf8')
      const talkDir = path.join(dist, 'charlas')
      await mkdir(talkDir, { recursive: true })
      for (const page of talkPages) {
        try {
          await access(path.join(socialImages, `${page.id}.png`))
        } catch {
          throw new Error(`Missing social image for ${page.id}. Run python3 scripts/generate-talk-og.py after this build.`)
        }
        const meta = talkPageMeta(page.id)!
        let html = template.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(meta.title)}</title>`)
        html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${meta.url}$2`)
        for (const [kind, key, value] of [
          ['name', 'description', meta.description],
          ['property', 'og:title', meta.title],
          ['property', 'og:description', meta.description],
          ['property', 'og:url', meta.url],
          ['property', 'og:image', meta.image],
          ['property', 'og:image:alt', meta.imageAlt],
          ['name', 'twitter:title', meta.title],
          ['name', 'twitter:description', meta.description],
          ['name', 'twitter:image', meta.image],
          ['name', 'twitter:image:alt', meta.imageAlt],
        ] as const) {
          html = setTag(html, `${kind}="${key}"`, value)
        }
        await writeFile(path.join(talkDir, `${page.id}.html`), html)
      }

      const staticUrls = ['/', '/?lang=es', '/?lang=en', '/eventos', '/charlas']
      const urls = [...staticUrls, ...talkPages.map((page) => `/charlas/${page.id}`)]
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>https://valentorassa.com${url.replaceAll('&', '&amp;')}</loc></url>`).join('\n')}\n</urlset>\n`
      await writeFile(path.join(dist, 'sitemap.xml'), sitemap)
    },
  }
}

// https://vite.dev/config/
// Multi-page build: each HTML entry becomes its own page in dist/. With
// vercel.json `cleanUrls`, dist/eventos.html is served at /eventos (and
// /eventos.html redirects there), like public/privacy.html at /privacy.
export default defineConfig({
  plugins: [react(), talkPagesPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        eventos: fileURLToPath(new URL('./eventos.html', import.meta.url)),
        charlas: fileURLToPath(new URL('./charlas.html', import.meta.url)),
      },
    },
  },
})
