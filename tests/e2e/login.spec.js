// spec: tests/e2e/login.spec.js
// Executa no projeto 'chromium' sem storageState (sobrescreve via test.use)

import { test, expect } from '../fixtures/index.js';

test.describe('Login', () => {

  // Garante que os testes de login não usem sessão pré-autenticada
  test.use({ storageState: { cookies: [], origins: [] } });

  test('realiza login como administrador com sucesso', async ({ loginPage }) => {
    await loginPage.visit();
    await loginPage.submitLogin('admin@zombieplus.com', 'pwd123');
    await loginPage.expectLoggedIn('Admin');
  });

  test('não deve logar com senha incorreta', async ({ loginPage, popup }) => {
    await loginPage.visit();
    await loginPage.submitLogin('admin@zombieplus.com', 'teste123');
    await popup.expectText(
      'Ocorreu um erro ao tentar efetuar o login. Por favor, verifique suas credenciais e tente novamente.'
    );
  });

  test('não deve logar com o email incorreto', async ({ loginPage }) => {
    await loginPage.visit();
    await loginPage.submitLogin('paulo.qa.com', 'pwd123');
    await loginPage.expectAlert('Email incorreto');
  });

  test('não deve logar com o campo email vazio', async ({ loginPage }) => {
    await loginPage.visit();
    await loginPage.submitLogin('', 'pwd123');
    await loginPage.expectAlert('Campo obrigatório');
  });

  test('não deve logar com o campo senha vazio', async ({ loginPage }) => {
    await loginPage.visit();
    await loginPage.submitLogin('admin@zombieplus.com', '');
    await loginPage.expectAlert('Campo obrigatório');
  });

  test('não deve logar quando nenhum campo for preenchido', async ({ loginPage }) => {
    await loginPage.visit();
    await loginPage.submitLogin('', '');
    await loginPage.expectAlert(['Campo obrigatório', 'Campo obrigatório']);
  });

});
