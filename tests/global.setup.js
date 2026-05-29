import { test as setup, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Caminho onde o estado de autenticação será salvo
 * Reutilizado por todos os testes E2E (exceto login.spec.js)
 */
const AUTH_FILE = path.join(__dirname, 'support/fixtures/auth.json');

/**
 * Setup global: realiza o login como administrador e salva o estado da sessão.
 *
 * Executado UMA vez antes de todos os testes do projeto 'chromium'.
 * O storageState salvo em auth.json é injetado via playwright.config.js (storageState).
 *
 * Benefícios:
 * - Elimina login repetitivo nos testes de movies/leads
 * - Reduz tempo total de execução
 * - Facilita paralelismo no CI/CD
 */
setup('autenticar como administrador', async ({ page }) => {
  const email = process.env.ADMIN_EMAIL ?? 'admin@zombieplus.com';
  const password = process.env.ADMIN_PASSWORD ?? 'pwd123';

  await page.goto('/admin/login');

  await page.getByPlaceholder('E-mail').fill(email);
  await page.getByPlaceholder('Senha').fill(password);
  await page.getByText('Entrar').click();

  // Aguarda o redirecionamento para o painel (web-first assertion)
  await expect(page).toHaveURL(/.*admin\/movies/);
  await expect(page.locator('.logged-user')).toBeVisible();

  // Salva cookies e localStorage para reutilização nos testes
  await page.context().storageState({ path: AUTH_FILE });
});
