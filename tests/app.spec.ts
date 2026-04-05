import { test, expect } from '@playwright/test';

test.describe('Zenco App E2E', () => {
  test('Dashboard loads and navigates correctly', async ({ page }) => {
    // Navigate to the app. Since Vite usually runs on 5173:
    await page.goto('http://localhost:5173/');

    // Ensure the title rendering (Ana logo)
    await expect(page.locator('text=Hola, Ana 👋')).toBeVisible();

    // Navigate to Garments
    await page.click('text=Prendas y Órdenes');
    
    // Ensure that Garments view opened
    await expect(page.locator('text=Gestión de Prendas')).toBeVisible();
    await expect(page.locator('text=Registrar Ingreso')).toBeVisible();

    // Test the search filter
    await page.fill('input[placeholder*="Buscar"]', 'María');
    await expect(page.locator('text=María G.')).toBeVisible();
  });
});
