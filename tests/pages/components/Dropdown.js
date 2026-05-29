import { expect } from '@playwright/test';

/**
 * Componente reutilizável para dropdowns React Select
 * Encapsula a lógica de interação com dropdowns de busca (select com search)
 */
export class Dropdown {
  /**
   * @param {import('@playwright/test').Page} page
   * @param {string} wrapperId - seletor CSS do wrapper do dropdown (ex: '#select_company_id')
   */
  constructor(page, wrapperId) {
    this.page = page;
    this.wrapperId = wrapperId;
    this.indicator = page.locator(`${wrapperId} .react-select__dropdown-indicator`);
    this.searchInput = page.locator(`${wrapperId} .react-select__input-container input`);
    this.options = page.locator('.react-select__option');
    this.singleValue = page.locator(`${wrapperId} .react-select__single-value`);
    this.placeholder = page.locator(`${wrapperId} .react-select__placeholder`);
    this.noOptionsMessage = page.locator('.react-select__menu-notice--no-options');
  }

  // ─── Actions ─────────────────────────────────────────────────────────────────

  /**
   * Abre o dropdown clicando no indicador
   */
  async open() {
    await this.indicator.click();
  }

  /**
   * Digita um termo de busca no campo de pesquisa do dropdown
   * @param {string} term
   */
  async search(term) {
    await this.searchInput.fill(term);
  }

  /**
   * Seleciona uma opção pelo texto visível
   * Abre o dropdown e clica na opção correspondente
   * @param {string} optionText
   */
  async selectOption(optionText) {
    await this.open();
    await this.options.filter({ hasText: optionText }).click();
  }

  /**
   * Limpa o campo de busca e digita um novo termo
   * @param {string} term
   */
  async clearAndSearch(term) {
    await this.searchInput.clear();
    await this.searchInput.fill(term);
  }

  // ─── Assertions ──────────────────────────────────────────────────────────────

  /**
   * Verifica se o valor selecionado está correto
   * @param {string} value
   */
  async expectSelectedValue(value) {
    await expect(this.singleValue).toHaveText(value);
  }

  /**
   * Verifica a quantidade de opções visíveis no dropdown
   * @param {number} count
   */
  async expectOptionsCount(count) {
    await expect(this.options).toHaveCount(count);
  }

  /**
   * Verifica se a mensagem "Nenhum registro encontrado" está visível
   */
  async expectNoOptions() {
    await expect(this.noOptionsMessage).toBeVisible();
  }

  /**
   * Verifica se o placeholder padrão está exibido (nenhuma opção selecionada)
   * @param {string} [text='Selecione...']
   */
  async expectPlaceholder(text = 'Selecione...') {
    await expect(this.placeholder).toHaveText(text);
  }
}
