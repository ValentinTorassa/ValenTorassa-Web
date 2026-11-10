import type { Language } from './siteContent';

/**
 * Whether the book is on sale: the one edit for launch day.
 *
 * - `status: 'preparacion'` is the site as it was before the sale: /libro
 *   has the waitlist and the other pages say the book is in preparation.
 * - `status: 'venta'` with a `buyUrl`: /libro shows the price and a Comprar
 *   button where the waitlist was (the free chapter stays), its Book JSON-LD
 *   gets an Offer, and the home description, the speaker-kit bios and the
 *   links page stop saying the book is in preparation. Without `buyUrl` nothing
 *   changes yet.
 *
 * `price` is in Argentine pesos, whole pesos: '25000' or '25.000'. Anything
 * else fails the build rather than publish a wrong price. Pluma
 * (vtsecurity.com.ar/libro) uses the same three fields.
 */
export type BookSale = {
  status: 'preparacion' | 'venta';
  price?: string;
  buyUrl?: string;
};

export const bookSale: BookSale = { status: 'preparacion' };

/** The sale as the pages show it: null until `bookSale` is 'venta' with a buyUrl. */
export type BookOffer = { buyUrl: string; price?: number };

export function bookOffer(sale: BookSale = bookSale): BookOffer | null {
  if (sale.status !== 'venta' || !sale.buyUrl) return null;
  const price = sale.price?.trim().replace(/^\$\s*/, '');
  if (!price) return { buyUrl: sale.buyUrl };
  if (!/^(\d+|\d{1,3}(\.\d{3})+)$/.test(price)) {
    throw new Error(`bookSale.price must be whole pesos, like '25000' or '25.000' (got '${sale.price}')`);
  }
  return { buyUrl: sale.buyUrl, price: Number(price.replaceAll('.', '')) };
}

/** `$25.000` on the Spanish pages, `ARS 25,000` on the English ones. */
export function formatBookPrice(price: number, language: Language) {
  const grouped = String(price).replace(/\B(?=(\d{3})+(?!\d))/g, language === 'es' ? '.' : ',');
  return language === 'es' ? `$${grouped}` : `ARS ${grouped}`;
}

const onSale = bookOffer() !== null;

/**
 * Where the book stands, in the words every page uses: the /libro eyebrow and
 * the book line in the links page's terminal. It follows `bookSale`.
 */
export const bookStatus: Record<Language, string> = onSale
  ? { es: 'a la venta', en: 'on sale' }
  : { es: 'en preparación', en: 'in progress' };

/**
 * How the home description and the speaker-kit bios (short and long) speak
 * of the book, so they match the sale state: being written, then published.
 */
export const bookMention = {
  homeDescription: onSale
    ? { es: 'y un libro sobre Linux y ciberseguridad', en: 'and a book on Linux and security' }
    : { es: 'y un libro en preparación', en: 'and an upcoming book' },
  bioVerb: onSale ? { es: 'publicó', en: 'published' } : { es: 'está escribiendo', en: 'is writing' },
} satisfies Record<string, Record<Language, string>>;
