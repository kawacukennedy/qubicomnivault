import { test, expect } from '@playwright/test';

test('landing page loads', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page).toHaveTitle(/Qubic OmniVault/);
});

test('navigate to dashboard', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.click('text=Dashboard');
  await expect(page).toHaveURL(/\/app$/);
});