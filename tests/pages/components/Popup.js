import { expect } from '@playwright/test';

/**
 * Componente reutilizável para o popup/dialog SweetAlert2
 * Utilizado em toda a aplicação para feedbacks de sucesso, erro e atenção
 */
export class Popup {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.container = page.locator('.swal2-html-container');
    this.title = page.locator('.swal2-title');
    this.confirmButton = page.locator('.swal2-confirm');
  }

  // ─── Assertions ──────────────────────────────────────────────────────────────

  /**
   * Verifica o texto do corpo do popup
   * @param {string} message
   */
  async expectText(message) {
    await expect(this.container).toHaveText(message);
  }

  /**
   * Verifica o título do popup
   * @param {string} title
   */
  async expectTitle(title) {
    await expect(this.title).toHaveText(title);
  }

  /**
   * Verifica se o popup está visível
   */
  async expectVisible() {
    await expect(this.container).toBeVisible();
  }

  // ─── Actions ─────────────────────────────────────────────────────────────────

  /**
   * Clica no botão de confirmação do popup (Ok)
   */
  async confirm() {
    await this.confirmButton.click();
    await expect(this.container).not.toBeVisible();
  }
}
