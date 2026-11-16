import { test, expect } from '@playwright/test';

test('runs user code in the sandbox and shows its output', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /sandbox/i }).first().click();

  const scratchpad = page.getByLabel('Live Scratchpad');
  await scratchpad.fill('console.log("hello", 1 + 1);');
  await page.getByRole('button', { name: /run/i }).click();

  await expect(page.getByLabel('Console Output')).toHaveValue('hello 2');
});

test('reports a thrown error instead of breaking the page', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /sandbox/i }).first().click();

  await page.getByLabel('Live Scratchpad').fill('throw new Error("boom")');
  await page.getByRole('button', { name: /run/i }).click();

  await expect(page.getByLabel('Console Output')).toHaveValue('Error: boom');
});
