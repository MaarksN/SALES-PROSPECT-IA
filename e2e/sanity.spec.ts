import { test, expect } from "@playwright/test";

test.describe("Smoke Test - Fluxo Crítico", () => {
  test("deve carregar a página de login e permitir acesso", async ({ page }) => {
    // 1. Acessa a Home (Redireciona para Login se não autenticado)
    await page.goto("/");

    // 2. Verifica elementos de Login
    await expect(page.getByText("Sales Prospector v2")).toBeVisible();
    await expect(page.getByPlaceholder("voce@empresa.com")).toBeVisible();

    // 3. Simula Login (O componente Login.tsx tem um mock que aceita qualquer coisa)
    await page.getByPlaceholder("voce@empresa.com").fill("test@user.com");
    await page.getByPlaceholder("••••••••").fill("123456");
    await page.getByRole("button", { name: "Acessar Plataforma" }).click();

    // 4. Verifica redirecionamento para Dashboard
    // Aguarda o toast de sucesso ou a navegação
    await expect(page.getByText("Visão Geral")).toBeVisible({ timeout: 10000 });

    // 5. Verifica se os créditos foram carregados
    await expect(page.getByText("Créditos")).toBeVisible();
  });
});