// Keep these tags aligned with Pluma's BOOK_REFS. No free-form query data is sent.
const refs = new Set([
  'directo', 'otro', 'web-libro', 'jcc-qr', 'labs-cap1', 'apuntes-3',
  'muestra-linkedin', 'muestra-instagram', 'muestra-instagram-stories', 'muestra-youtube', 'muestra-x',
  'muestra-bluesky', 'muestra-threads', 'muestra-facebook', 'muestra-discord',
  'muestra-mastodon', 'muestra-whatsapp', 'muestra-apuntes', 'muestra-ejemplos',
  'muestra-pdf',
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
