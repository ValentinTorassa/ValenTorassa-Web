import { expect, test } from '@playwright/test';

/**
 * /links is where the social bios point. A bio adds its tag (?ref=ig) and the
 * page carries it on to the destinations that count visits by ref.
 */
test.describe('links page', () => {
  test('carries the bio tag to comandle and the book', async ({ page }) => {
    await page.goto('/links?ref=ig');
    await expect(page.locator('h1')).toHaveText('Todo lo que hago, acá.');
    await expect(page.locator('.w-comandle')).toHaveAttribute('href', 'https://comandle.valentorassa.com/?ref=links-ig');
    await expect(page.locator('.w-book')).toHaveAttribute('href', '/libro?ref=links-ig');
  });

  test('an unknown tag falls back to plain "links"', async ({ page }) => {
    await page.goto('/links?ref=<script>');
    await expect(page.locator('.w-comandle')).toHaveAttribute('href', 'https://comandle.valentorassa.com/?ref=links');
  });

  test('shows "did not load" instead of zero games when the counter fails', async ({ page }) => {
    await page.route('https://vtsecurity.com.ar/api/comandle', (route) => route.fulfill({ status: 503, body: '' }));
    await page.goto('/links');
    await expect(page.locator('.counts-off')).toBeVisible();
    await expect(page.locator('.numbers')).toContainText('42 mil suscriptores.');
  });

  test('the English page links back to Spanish', async ({ page }) => {
    await page.goto('/en/links');
    await expect(page.locator('h1')).toHaveText('Everything I make, right here.');
    await expect(page.locator('a[hreflang="es"]')).toHaveAttribute('href', '/links');
  });
});
