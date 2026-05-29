import { test as base, expect } from '@playwright/test';

import { LoginPage } from '../pages/LoginPage.js';
import { MoviesPage } from '../pages/MoviesPage.js';
import { LeadsPage } from '../pages/LeadsPage.js';
import { Popup } from '../pages/components/Popup.js';
import { Api } from '../support/api/index.js';

const API_BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:3333';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'admin@zombieplus.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'pwd123';

/**
 * Fixtures customizados do projeto ZombiePlus
 *
 * A autenticação do app usa sessionStorage (não cookies/localStorage),
 * por isso não pode ser capturada via storageState padrão do Playwright.
 * Em vez disso, injetamos o token via addInitScript antes de cada page.goto().
 *
 * @example
 * import { test, expect } from '../fixtures';
 * test('meu teste', async ({ moviesPage, popup }) => { ... });
 */
export const test = base.extend({

  /**
   * Sobrescreve o fixture `page` padrão para injetar autenticação admin via sessionStorage
   * quando o teste precisa de acesso às páginas de admin.
   *
   * Detecta automaticamente se o teste precisa de autenticação pelo nome do arquivo.
   * Testes de login e leads usam o page padrão (sem auth).
   * Testes de movies recebem uma page com sessionStorage pré-populado com o token admin.
   */
  page: async ({ browser, request, page }, use, testInfo) => {
    const isMoviesTest = testInfo.file.includes('movies.spec');

    if (!isMoviesTest) {
      // Login e leads: usa page padrão sem autenticação injetada
      await use(page);
      return;
    }

    // Movies: cria um contexto com sessionStorage autenticado
    const response = await request.post(`${API_BASE_URL}/sessions`, {
      data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
    });
    const body = await response.json();
    const token = body.token;
    const user = body.user;

    const context = await browser.newContext();

    // Injeta o token no sessionStorage antes de qualquer navegação
    await context.addInitScript(({ token, user }) => {
      sessionStorage.setItem('@ZombiePlus:token', token);
      sessionStorage.setItem('@ZombiePlus:user', JSON.stringify(user));
    }, { token, user });

    const authenticatedPage = await context.newPage();
    await use(authenticatedPage);

    await authenticatedPage.close();
    await context.close();
  },

  /**
   * Page Object da tela de login
   * @type {LoginPage}
   */
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  /**
   * Page Object das telas de filmes (listagem e cadastro)
   * @type {MoviesPage}
   */
  moviesPage: async ({ page }, use) => {
    await use(new MoviesPage(page));
  },

  /**
   * Page Object da página pública de leads
   * @type {LeadsPage}
   */
  leadsPage: async ({ page }, use) => {
    await use(new LeadsPage(page));
  },

  /**
   * Componente de popup/dialog (SweetAlert2)
   * @type {Popup}
   */
  popup: async ({ page }, use) => {
    await use(new Popup(page));
  },

  /**
   * Cliente da API REST do backend
   * Autentica automaticamente antes de usar
   * @type {Api}
   */
  api: async ({ request }, use) => {
    const api = new Api(request);
    await api.authenticate();
    await use(api);
  },

});

export { expect };
