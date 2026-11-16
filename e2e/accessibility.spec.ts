import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const THEMES = ['light', 'coffee', 'dark'] as const;

for (const theme of THEMES) {
  test(`has no WCAG 2.1 AA violations in the ${theme} theme`, async ({ page }) => {
    await page.addInitScript((t) => localStorage.setItem('09labs-theme', JSON.stringify(t)), theme);
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
  });
}
