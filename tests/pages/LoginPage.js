import { expect } from '@playwright/test';

/**
 * Page Object para a página de Login (/admin/login)
 * Responsabilidade: encapsular todas as interações e asserções da tela de login
 */
export class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Locators
    this.emailInput = page.getByPlaceholder('E-mail');
    this.passwordInput = page.getByPlaceholder('Senha');
    this.submitButton = page.getByText('Entrar');
    this.loginForm = page.locator('.login-form');
    this.loggedUser = page.locator('.logged-user');
    this.alertMessages = page.locator('span[class$="alert"]');
  }

  // ─── Navigation ──────────────────────────────────────────────────────────────

  /**
   * Navega para a página de login
   */
  async visit() {
    await this.page.goto('/admin/login');
    await expect(this.loginForm).toBeVisible();
  }

  // ─── Actions ─────────────────────────────────────────────────────────────────

  /**
   * Preenche o formulário e submete
   * @param {string} email
   * @param {string} password
   */
  async submitLogin(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  // ─── Assertions ──────────────────────────────────────────────────────────────

  /**
   * Verifica que o usuário está autenticado e redirecionado para o painel
   * @param {string} username - nome exibido no painel após login
   */
  async expectLoggedIn(username) {
    await expect(this.page).toHaveURL(/.*admin/);
    await expect(this.loggedUser).toHaveText(`Olá, ${username}`);
  }

  /**
   * Verifica mensagem(ns) de alerta de validação do formulário
   * @param {string | string[]} messages - texto único ou array de textos
   */
  async expectAlert(messages) {
    await expect(this.alertMessages).toHaveText(messages);
  }
}
