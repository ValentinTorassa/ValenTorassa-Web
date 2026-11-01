// The heavy talk files that the site serves from the separate media project
// (media-site/), so they are not uploaded again with every deploy of the site.
// They stay in public/ so `npm run dev`, `vite preview` and the e2e tests keep
// serving them locally; vercel.json proxies their URLs to the media project.
export const offloaded = [
  { dir: 'charlas', match: (rel) => /^[^/]+\/(reel\.mp4|slides\.html)$/.test(rel) },
  { dir: 'og-charlas', match: (rel) => /^[^/]+\.png$/.test(rel) },
];
