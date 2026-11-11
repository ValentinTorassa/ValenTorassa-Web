# preview-site

Pages shared by link before they are public. They are served by the separate Vercel project
`valentorassa-preview`, deployed by hand, and valentorassa.com proxies `/p/:path*` to it
(`../vercel.json`). Every `/p` response carries `X-Robots-Tag: noindex`, and nothing on the site,
the sitemap or the menu links to them.

Only the source lives here. Each page's slug and media (videos, posters, decks) stay in a local
folder outside the repo, so the link stays unlisted even though this repo is public.

## tfi

The page for the professors of the final engineering project at UAI (blackice). The link is
`https://valentorassa.com/p/<slug>`, without a trailing slash: `/p/:path*` does not match one.

- `tfi/pagina.src.html`: the page. `__SLUG__` and `/*__PIXEL__*/` are filled in by the build.
- `tfi/pixel.css`: Geist Pixel (SIL Open Font License), inlined into the page.
- `tfi/build.py`: copies the media from the local delivery folder, strips the speaker notes
  from the deck and writes the static project to that folder's `web-privada/deploy/`.

```bash
python3 preview-site/tfi/build.py "<delivery folder>"
cd "<delivery folder>/web-privada/deploy" && vercel deploy --prod --yes
```

`vercel deploy` from a fresh link can leave a `.env.local` in `deploy/`; delete it (the
`.vercelignore` the build writes keeps it out of the upload anyway).
