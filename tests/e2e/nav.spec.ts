import { expect, test } from '@playwright/test';

const pages = ['/', '/eventos', '/charlas'];
const spanish = ['Perfil', 'Experiencia', 'Proyectos', 'Charlas', 'Agenda', 'Contacto'];
const english = ['Profile', 'Experience', 'Projects', 'Talks', 'Events', 'Contact'];

test('the same navigation works across the three pages', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'shared navigation; run once');
  for (const path of pages) {
    await page.goto(`${path}?lang=es`);
    await expect(page.locator('.nav-links a')).toHaveText(spanish);
    if (path === '/charlas') await expect(page.locator('.nav-links a[href="/charlas"]')).toHaveAttribute('aria-current', 'page');
    if (path === '/eventos') await expect(page.locator('.nav-links a[href="/eventos"]')).toHaveAttribute('aria-current', 'page');
  }

  await page.getByRole('button', { name: /idioma/i }).click();
  await expect(page.locator('.nav-links a')).toHaveText(english);
  await page.goto('/charlas');
  await expect(page.locator('.nav-links a')).toHaveText(english);
  expect(await page.evaluate(() => localStorage.getItem('vt-language'))).toBe('en');
});

test('the phone menu is usable at 390 px on every page', async ({ page }) => {
  test.skip(test.info().project.name !== 'mobile', 'phone viewport; run once');
  for (const path of pages) {
    await page.goto(`${path}?lang=es`);
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
  await page.goto('/charlas?lang=es');
  await expect(page.locator('.mobile-menu-toggle')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
});
