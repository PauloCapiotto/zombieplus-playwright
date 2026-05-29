import { expect } from '@playwright/test';

/**
 * Cliente da API REST do ZombiePlus backend
 * Encapsula todas as operações de API usadas nos testes
 *
 * Benefícios:
 * - Centraliza a URL base e headers de autenticação
 * - Facilita troca de ambiente via variável BASE_API_URL
 * - Elimina duplicação de lógica de autenticação nos testes
 */
export class Api {
  /**
   * @param {import('@playwright/test').APIRequestContext} request
   */
  constructor(request) {
    this.request = request;
    this.token = null;
    this.baseURL = process.env.API_BASE_URL ?? 'http://localhost:3333';
  }

  // ─── Auth ─────────────────────────────────────────────────────────────────────

  /**
   * Autentica na API e armazena o token JWT internamente
   * Chamado automaticamente pelo fixture `api` em tests/fixtures/index.js
   */
  async authenticate() {
    const email = process.env.ADMIN_EMAIL ?? 'admin@zombieplus.com';
    const password = process.env.ADMIN_PASSWORD ?? 'pwd123';

    const response = await this.request.post(`${this.baseURL}/sessions`, {
      data: { email, password },
    });

    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    this.token = `Bearer ${body.token}`;
  }

  /**
   * Retorna os headers padrão com autorização
   * @returns {{ Authorization: string }}
   */
  get authHeaders() {
    return { Authorization: this.token };
  }

  // ─── Companies ────────────────────────────────────────────────────────────────

  /**
   * Busca o ID de uma distribuidora pelo nome
   * @param {string} companyName
   * @returns {Promise<string>} ID da distribuidora
   */
  async getCompanyIdByName(companyName) {
    const response = await this.request.get(`${this.baseURL}/companies`, {
      headers: this.authHeaders,
      params: { name: companyName },
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    return body.data[0].id;
  }

  // ─── Movies ───────────────────────────────────────────────────────────────────

  /**
   * Cadastra um filme via API (sem UI)
   * Usado para preparar o estado inicial dos testes
   *
   * @param {{ title: string, overview: string, company: string, release_year: string | number, featured?: boolean }} movie
   */
  async postMovie(movie) {
    const companyId = await this.getCompanyIdByName(movie.company);

    const response = await this.request.post(`${this.baseURL}/movies`, {
      headers: {
        ...this.authHeaders,
        Accept: 'application/json',
      },
      multipart: {
        title: movie.title,
        overview: movie.overview,
        company_id: companyId,
        release_year: String(movie.release_year),
        featured: String(movie.featured ?? false),
      },
    });

    expect(response.ok()).toBeTruthy();
  }

  // ─── Leads ────────────────────────────────────────────────────────────────────

  /**
   * Cadastra um lead via API (sem UI)
   * Usado para pré-popular dados em testes de duplicidade
   *
   * @param {string} name
   * @param {string} email
   */
  async postLead(name, email) {
    const response = await this.request.post(`${this.baseURL}/leads`, {
      data: { name, email },
    });

    expect(response.ok()).toBeTruthy();
  }
}
