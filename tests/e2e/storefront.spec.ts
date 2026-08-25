import { test, expect } from '@playwright/test';

test.describe('Storefront E2E Tests', () => {
  test('should load homepage and display hero title', async ({ page }) => {
    await page.goto('/');
    
    // Check that title or logo is present
    await expect(page).toHaveTitle(/Ronica/i);
  });

  test('should navigate to products page', async ({ page }) => {
    await page.goto('/shop/products');
    
    // Verify products page response
    await expect(page).toHaveURL(/\/shop\/products/);
  });
});
