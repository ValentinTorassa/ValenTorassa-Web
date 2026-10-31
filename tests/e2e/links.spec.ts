import { expect, test } from '@playwright/test';

/**
 * The links page is where the social bios point. A bio adds its tag (?ref=ig)
 * and the page carries it on to the destinations that count visits by ref.
 * Production serves it at https://links.vtsecurity.com.ar/ (docs/links-domain.md),
 * so links into the site are absolute; the preview serves it at /links.
 */
test.describe('links page', () => {
  test('opens with the neofetch and carries the bio tag to comandle and the book', async ({ page }) => {
    await page.goto('/links?ref=ig');
    await expect(page.locator('h1')).toHaveText('Links de Valentín Torassa');
    await expect(page.locator('.hero-terminal')).toContainText('valen@vt');
    await expect(page.locator('.w-comandle')).toHaveAttribute('href', 'https://comandle.valentorassa.com/?ref=links-ig');
    await expect(page.locator('.w-book')).toHaveAttribute('href', 'https://valentorassa.com/libro?ref=links-ig');
  });

  test('an unknown tag falls back to plain "links"', async ({ page }) => {
    await page.goto('/links?ref=<script>');
    await expect(page.locator('.w-comandle')).toHaveAttribute('href', 'https://comandle.valentorassa.com/?ref=links');
  });

  test('shows "did not load" instead of zero games when the counter fails', async ({ page }) => {
    await page.route('https://vtsecurity.com.ar/api/comandle', (route) => route.fulfill({ status: 503, body: '' }));
    await page.goto('/links');
    await expect(page.locator('.counts-off')).toBeVisible();
    await expect(page.locator('.hero-terminal')).toContainText('el comando del día');
  });

  test('closes with the numbers, after the profiles', async ({ page }) => {
    await page.goto('/links');
    await expect(page.locator('main > section').last()).toHaveClass('numbers');
    await expect(page.locator('.numbers')).toContainText('42 mil suscriptores.');
    await expect(page.locator('.numbers')).toContainText('579 videos.');
  });

  test('points search engines at its own host', async ({ page }) => {
    await page.goto('/en/links');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://links.vtsecurity.com.ar/en');
    await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveAttribute('href', 'https://links.vtsecurity.com.ar/');
  });

  test('the English page links back to Spanish', async ({ page }) => {
    await page.goto('/en/links');
    await expect(page.locator('h1')).toHaveText("Valentín Torassa's links");
    await expect(page.locator('a[hreflang="es"]')).toHaveAttribute('href', 'https://links.vtsecurity.com.ar/');
  });
});
