# Links page: links.vtsecurity.com.ar

The page every social bio points to (`links.html`, `src/LinksPage.tsx`). It is
built with the rest of the site but served from its own host:

| URL | What it does |
| --- | --- |
| `https://links.vtsecurity.com.ar/` | the page, in Spanish |
| `https://links.vtsecurity.com.ar/en` | the page, in English |
| `https://links.valentorassa.com/*` | domain redirect (308) to `links.vtsecurity.com.ar` |
| `https://valentorassa.com/links`, `/en/links` | redirect to the host above (`vercel.json`) |

Bios link to `https://links.vtsecurity.com.ar/?ref=<tag>`. The tags are the
`bioRefs` in `src/linksContent.ts` (`ig`, `tt`, `x`, `th`, `bs`, ...); every
outbound link carries the tag on as `ref=links-<tag>`.

## Why a project routing rule

Vercel serves a file that exists before it applies a `vercel.json` rewrite, so
a rewrite cannot replace `dist/index.html` at `/` for one host. Project-level
routing rules run at the CDN before the deployment's own routes, so two rules
on the `pagina-cv-web` project do it, with no code running on requests:

```sh
vercel routes add "links host (es)" \
  --src "/" --src-syntax equals \
  --has "host:links.vtsecurity.com.ar" \
  --action rewrite --dest "/links" --yes
vercel routes add "links host (en)" \
  --src "^/en/?$" \
  --has "host:links.vtsecurity.com.ar" \
  --action rewrite --dest "/en/links" --yes
vercel routes list --diff
vercel routes publish --yes
```

The rules live in the Vercel project, not in this repo: `vercel routes list`
shows them. The `vercel.json` redirects from `/links` only match the
`valentorassa.com` host; on the links host they would loop with these rewrites.

## DNS and domains

Both zones are on Cloudflare. `links` in each zone is a DNS-only CNAME to
`cname.vercel-dns.com`. Until 30/10/2026 those names belonged to the private
homelab hub, which moved to `hub.*` (SelfHost-Server-Config, `links/README.md`).

On the Vercel project: `links.vtsecurity.com.ar` serves the deployment, and
`links.valentorassa.com` redirects to it.

## Canonical and sitemap

`src/seo.ts` gives the page its own canonical and hreflang URLs on the links
host, and `src/siteFiles.ts` leaves it out of this site's sitemap. Links from the
page into the site are absolute (`https://valentorassa.com/...`).

## Checks after a change

```sh
curl -sI https://links.vtsecurity.com.ar/ | head -1                # 200
curl -s https://links.vtsecurity.com.ar/ | grep -o '<link rel="canonical"[^>]*>'
curl -sI https://links.vtsecurity.com.ar/en | head -1              # 200
curl -sI 'https://valentorassa.com/links?ref=ig' | grep -i location # links host, ref kept
curl -sI https://links.valentorassa.com/ | grep -i location         # links.vtsecurity.com.ar
curl -sI https://valentorassa.com/ | head -1                       # home untouched
```
