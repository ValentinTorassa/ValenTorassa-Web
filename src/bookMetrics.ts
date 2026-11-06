// Keep these tags aligned with Pluma's BOOK_REFS. No free-form query data is sent.
const refs = new Set([
  'directo', 'otro', 'web-libro', 'jcc-qr', 'labs-cap1', 'apuntes-3',
  'muestra-linkedin', 'muestra-instagram', 'muestra-instagram-stories', 'muestra-youtube', 'muestra-x',
  'muestra-bluesky', 'muestra-threads', 'muestra-facebook', 'muestra-discord',
  'muestra-mastodon', 'muestra-whatsapp', 'muestra-apuntes', 'muestra-ejemplos',
  'muestra-pdf',
  // links.vtsecurity.com.ar passes its own ?ref= on as links-<ref> (bioRefs in linksContent.ts).
  'links', 'links-ig', 'links-tt', 'links-x', 'links-th', 'links-yt', 'links-li', 'links-bs', 'links-fb',
  'links-md', 'links-dc', 'links-gh', 'links-wa', 'links-tiktok', 'links-threads', 'links-bluesky',
  'links-mastodon', 'links-linkedin', 'links-yt-short', 'links-yt-desc', 'links-whatsapp', 'links-discord',
  // comandle.valentorassa.com links the book from a command's card with ?ref=comandle.
  'comandle',
  // Press emails and WhatsApps for the 10/11/2026 launch: prensa-<outlet>, -wa when sent by WhatsApp.
  'prensa-elciudadano', 'prensa-eltres-wa', 'prensa-lacapital', 'prensa-lacapital-pardo', 'prensa-lra5',
  'prensa-lt8-ameriso', 'prensa-lt8-wa', 'prensa-r3-de12a14', 'prensa-r3-editor', 'prensa-r3-redaccion',
  'prensa-radio2-wa', 'prensa-radiounr', 'prensa-rosario12', 'prensa-uai', 'prensa-unr',
]);

/** An aggregate click, not a completed download, reader or subscription. */
export function countBookClick(event: 'pdf' | 'lista', referral: string) {
  const ref = referral.trim().toLowerCase();
  // A simple CORS request keeps the destination independent from the metric.
  void fetch('https://vtsecurity.com.ar/api/book-click', {
    method: 'POST',
    credentials: 'omit',
    mode: 'cors',
    keepalive: true,
    headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
    body: JSON.stringify({ event, ref: refs.has(ref) ? ref : 'otro' }),
  }).catch(() => undefined);
}
