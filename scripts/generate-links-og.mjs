// Draws the links page's share card (scripts/links-og/card.html) into
// public/. Run after changing the card or the page's look:
//   node scripts/generate-links-og.mjs
// It loads Google Fonts, so it needs the network. PLAYWRIGHT_CHROME_PATH picks
// the browser, as in playwright.config.ts.
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { chromium } from '@playwright/test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'public', 'og-links-2026-10.jpg');

const browser = await chromium.launch(
  process.env.PLAYWRIGHT_CHROME_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROME_PATH } : {},
);
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto(`file://${path.join(root, 'scripts', 'links-og', 'card.html')}`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: out, type: 'jpeg', quality: 90 });
await browser.close();
console.log(`wrote ${path.relative(root, out)}`);
