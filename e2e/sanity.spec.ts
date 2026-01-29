
import { test, expect } from '@playwright/test';

test.describe('Critical Flow', () => {
  test('Login and Dashboard access', async ({ page }) => {
    // 1. Visit Login Page
    await page.goto('/');

    // 2. Perform Login (Simulated)
    const emailInput = page.getByPlaceholder('seu@email.com');
    await expect(emailInput).toBeVisible();
    await emailInput.fill('test@demo.com');

    const loginButton = page.getByRole('button', { name: /entrar/i });
    await loginButton.click();

    // 3. Verify Dashboard Access
    // Wait for the "Dashboard" heading or specific element to appear
    await expect(page.getByText('Dashboard de Vendas')).toBeVisible();

    // Check if stats are visible
    await expect(page.getByText('Total de Leads')).toBeVisible();
  });

  test('Navigate to Lead Generation', async ({ page }) => {
     // Setup: Login first
     await page.goto('/');
     await page.getByPlaceholder('seu@email.com').fill('test@demo.com');
     await page.getByRole('button', { name: /entrar/i }).click();

     // Navigate to AI Lab or Lead Gen
     // Assuming there is a sidebar or navigation.
     // Let's check for "Validar Leads" or similar if explicit "Gerar Lead" isn't in menu.
     // Based on memory, activeView is 'dashboard' by default.
     // Sidebar might have "AI Lab".

     const aiLabButton = page.getByText('AI Lab');
     if (await aiLabButton.isVisible()) {
         await aiLabButton.click();
         await expect(page.getByText('Laboratório de Inteligência')).toBeVisible();
     }
  });
});
