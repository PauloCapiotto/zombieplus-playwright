import { expect } from '@playwright/test';
import { Dropdown } from './components/Dropdown.js';

/**
 * Page Object para as páginas de Filmes (/admin/movies)
 * Responsabilidade: encapsular todas as interações e asserções da seção de filmes
 */
export class MoviesPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Componentes reutilizáveis
    this.companyDropdown = new Dropdown(page, '#select_company_id');
    this.yearDropdown = new Dropdown(page, '#select_year');

    // Locators do formulário de cadastro
    this.titleInput = page.getByLabel('Titulo do filme');
    this.overviewInput = page.getByLabel('Sinopse');
    this.coverInput = page.locator('#cover');
    this.featuredToggle = page.locator('label', { hasText: 'Destaque' });
    this.submitButton = page.getByRole('button', { name: 'Cadastrar' });
    this.backButton = page.getByRole('link', { name: 'Voltar' });

    // Locators da listagem
    this.searchInput = page.getByPlaceholder('Busque pelo nome');
    this.searchButton = page.locator('form button[type="submit"]');
    this.tableRows = page.getByRole('rowgroup').getByRole('row');
    this.addButton = page.locator('a[href$="register"]');

    // Locators de validação
    this.alertMessages = page.locator('.alert');
  }

  // ─── Navigation ──────────────────────────────────────────────────────────────

  /**
   * Navega diretamente para a listagem de filmes
   */
  async goToList() {
    await this.page.goto('/admin/movies');
  }

  /**
   * Navega diretamente para o formulário de cadastro
   */
  async goToRegister() {
    await this.page.goto('/admin/movies/register');
  }

  /**
   * Navega para o formulário de cadastro clicando no ícone de adicionar
   * Requer estar na listagem (/admin/movies)
   */
  async goToRegisterViaButton() {
    await this.addButton.click();
  }

  // ─── Actions do formulário ────────────────────────────────────────────────────

  /**
   * Preenche o campo Título do filme
   * @param {string} title
   */
  async fillTitle(title) {
    await this.titleInput.fill(title);
  }

  /**
   * Preenche o campo Sinopse
   * @param {string} overview
   */
  async fillOverview(overview) {
    await this.overviewInput.fill(overview);
  }

  /**
   * Seleciona a distribuidora no dropdown
   * @param {string} company
   */
  async selectCompany(company) {
    await this.companyDropdown.selectOption(company);
  }

  /**
   * Seleciona o ano de lançamento no dropdown
   * @param {string | number} year
   */
  async selectYear(year) {
    await this.yearDropdown.selectOption(String(year));
  }

  /**
   * Faz upload do arquivo de poster
   * @param {string} coverPath - caminho relativo a partir da raiz do projeto
   */
  async uploadCover(coverPath) {
    await this.coverInput.setInputFiles(coverPath);
  }

  /**
   * Ativa o toggle de "Conteúdo destaque"
   */
  async toggleFeatured() {
    await this.featuredToggle.click();
  }

  /**
   * Clica no botão Cadastrar
   */
  async submit() {
    await this.submitButton.click();
  }

  /**
   * Clica no botão Voltar
   */
  async goBack() {
    await this.backButton.click();
  }

  /**
   * Fluxo completo de cadastro de filme
   * Navega para o formulário, preenche todos os campos e submete
   * @param {{ title: string, overview: string, company: string, release_year: string | number, cover?: string, featured?: boolean }} movie
   */
  async create(movie) {
    await this.goToRegister();
    await this.fillTitle(movie.title);
    await this.fillOverview(movie.overview);
    await this.selectCompany(movie.company);
    await this.selectYear(movie.release_year);

    if (movie.cover) {
      await this.uploadCover(`tests/support/fixtures/${movie.cover}`);
    }

    if (movie.featured) {
      await this.toggleFeatured();
    }

    await this.submit();
  }

  // ─── Actions da listagem ──────────────────────────────────────────────────────

  /**
   * Remove um filme pelo título
   * Clica no botão de exclusão da linha e confirma
   * @param {string} title
   */
  async remove(title) {
    await this.page.getByRole('row', { name: title }).getByRole('button').click();
    await this.page.locator('.confirm-removal').click();
  }

  /**
   * Busca filmes pelo nome
   * @param {string} term
   */
  async search(term) {
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }

  // ─── Assertions ──────────────────────────────────────────────────────────────

  /**
   * Verifica mensagens de alerta de validação do formulário
   * @param {string | string[]} messages
   */
  async expectAlertMessages(messages) {
    await expect(this.alertMessages).toHaveText(messages);
  }

  /**
   * Verifica o resultado de uma busca
   * @param {string[]} titles - títulos esperados nas linhas da tabela
   */
  async expectSearchResults(titles) {
    await expect(this.tableRows).toHaveCount(titles.length);
    for (const title of titles) {
      await expect(this.page.getByRole('row', { name: title })).toBeVisible();
    }
  }

  /**
   * Verifica que a URL está na listagem de filmes
   */
  async expectOnList() {
    await expect(this.page).toHaveURL(/.*admin\/movies$/);
  }

  /**
   * Verifica que a URL está no formulário de cadastro
   */
  async expectOnRegister() {
    await expect(this.page).toHaveURL(/.*admin\/movies\/register/);
  }
}
