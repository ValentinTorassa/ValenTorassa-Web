import { expect, test } from '@playwright/test';

const pages = ['/', '/eventos', '/charlas', '/speaker-kit', '/libro'];
const spanish = ['Perfil', 'Experiencia', 'Proyectos', 'Charlas', 'Agenda', 'Libro', 'Contacto'];
const english = ['Profile', 'Experience', 'Projects', 'Talks', 'Events', 'Book', 'Contact'];

test('the same navigation works across every page', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'shared navigation; run once');
  for (const path of pages) {
    await page.goto(path);
    await expect(page.locator('.nav-links a')).toHaveText(spanish);
    // Only the three primary profiles sit in the desktop header.
    await expect(page.locator('.social-actions a')).toHaveCount(3);
    expect(await page.locator('.social-actions a').evaluateAll((links) => links.map((link) => link.getAttribute('aria-label'))))
      .toEqual(['GitHub', 'LinkedIn', 'YouTube']);
    if (path === '/charlas') await expect(page.locator('.nav-links a[href="/charlas"]')).toHaveAttribute('aria-current', 'page');
    if (path === '/eventos') await expect(page.locator('.nav-links a[href="/eventos"]')).toHaveAttribute('aria-current', 'page');
    if (path === '/libro') await expect(page.locator('.nav-links a[href="/libro"]')).toHaveAttribute('aria-current', 'page');
  }

  // The toggle is a link to the same page in the other language.
  await expect(page.getByRole('link', { name: /idioma/i })).toHaveAttribute('href', '/en/libro');
  await page.getByRole('link', { name: /idioma/i }).click();
  await expect(page).toHaveURL(/\/en\/libro$/);
  await expect(page.locator('.nav-links a')).toHaveText(english);
  expect(await page.locator('.nav-links a').evaluateAll((links) => links.map((link) => link.getAttribute('href'))))
    .toEqual(['/en/#profile', '/en/#experience', '/en/#research', '/en/charlas', '/en/eventos', '/en/libro', '/en/#contact']);
  await expect(page.locator('.social-actions a')).toHaveCount(3);
  expect(await page.evaluate(() => localStorage.getItem('vt-language'))).toBe('en');

  // The choice is remembered but never redirects: a Spanish URL stays Spanish.
  await page.goto('/charlas');
  await expect(page).toHaveURL(/\/charlas$/);
  await expect(page.locator('.nav-links a')).toHaveText(spanish);
  await page.goto('/en/charlas');
  await expect(page.locator('.nav-links a')).toHaveText(english);
});

test('the phone menu is usable at 390 px on every page', async ({ page }) => {
  test.skip(test.info().project.name !== 'mobile', 'phone viewport; run once');
  for (const path of pages) {
    await page.goto(path);
    if (process.env.CAPTURE_MOBILE) {
      await page.waitForTimeout(900);
      await page.screenshot({ path: `/tmp/valentorassa-${path === '/' ? 'home' : path.slice(1)}-390.png` });
    }
    const menu = page.locator('.mobile-menu-toggle');
    await expect(menu).toBeVisible();
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await menu.click();
    if (process.env.CAPTURE_MOBILE && path === '/') {
      await page.waitForTimeout(350);
      await page.screenshot({ path: '/tmp/valentorassa-menu-390.png' });
    }
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('.mobile-nav-panel nav a')).toHaveText(spanish.map((label, index) => `${String(index + 1).padStart(2, '0')}${label}`));
    const socialTops = await page.locator('.mobile-nav-social a').evaluateAll((links) => links.map((link) => link.getBoundingClientRect().top));
    expect(Math.max(...socialTops) - Math.min(...socialTops), `${path}: social icons on one row`).toBeLessThan(1);
    await expect(page.locator('.mobile-nav-panel nav a[href="/libro"]')).toBeVisible();
    for (const control of [menu, page.locator('.language-toggle'), ...await page.locator('.mobile-nav-panel nav a').all()]) {
      const box = await control.boundingBox();
      expect(box?.width, `${path}: touch width`).toBeGreaterThanOrEqual(44);
      expect(box?.height, `${path}: touch height`).toBeGreaterThanOrEqual(44);
    }
    await page.keyboard.press('Escape');
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
  }

  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/charlas');
  await expect(page.locator('.mobile-menu-toggle')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
});
