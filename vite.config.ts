import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Multi-page build: each HTML entry becomes its own page in dist/. With
// vercel.json `cleanUrls`, dist/eventos.html is served at /eventos (and
// /eventos.html redirects there), like public/privacy.html at /privacy.
export default defineConfig({
  plugins: [react()],
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
