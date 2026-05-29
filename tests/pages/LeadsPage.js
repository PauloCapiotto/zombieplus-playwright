import { expect } from '@playwright/test';

/**
 * Page Object para a página pública de Leads (/)
 * Responsabilidade: encapsular todas as interações e asserções da fila de espera
 */
export class LeadsPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Locators
    this.openModalButton = page.getByRole('button', { name: /Aperte o play/ });
    this.modal = page.getByTestId('modal');
    this.modalHeading = page.getByTestId('modal').getByRole('heading');
    this.nameInput = page.getByPlaceholder('Informe seu nome');
    this.emailInput = page.getByPlaceholder('Informe seu email');
    this.submitButton = page.getByTestId('modal').getByText('Quero entrar na fila!');
    this.alertMessages = page.locator('.alert');
  }

  // ─── Navigation ──────────────────────────────────────────────────────────────

  /**
   * Navega para a página pública da aplicação
   */
  async visit() {
    await this.page.goto('/');
  }

  // ─── Actions ─────────────────────────────────────────────────────────────────

  /**
   * Abre o modal da fila de espera
   */
  async openModal() {
    await this.openModalButton.click();
    await expect(this.modalHeading).toHaveText('Fila de espera');
  }

  /**
   * Preenche e submete o formulário da fila de espera
   * @param {string} name
   * @param {string} email
   */
  async submitForm(name, email) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.submitButton.click();
  }

  // ─── Assertions ──────────────────────────────────────────────────────────────

  /**
   * Verifica mensagem(ns) de alerta de validação do formulário
   * @param {string | string[]} messages
   */
  async expectAlert(messages) {
    await expect(this.alertMessages).toHaveText(messages);
  }

  /**
   * Verifica que o modal está visível
   */
  async expectModalVisible() {
    await expect(this.modal).toBeVisible();
  }
}
