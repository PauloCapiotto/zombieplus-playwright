// spec: tests/e2e/leads.spec.js
// Executa no projeto 'e2e' (storageState não afeta a página pública /)

import { test, expect } from '../fixtures/index.js';
import { faker } from '@faker-js/faker';

test.describe('Leads', () => {

  test('deve cadastrar um lead na fila de espera com sucesso', async ({ leadsPage, popup }) => {
    await leadsPage.visit();
    await leadsPage.openModal();
    await leadsPage.submitForm(faker.person.fullName(), faker.internet.email());
    await popup.expectText(
      'Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato.'
    );
  });

  test('não deve cadastrar email já registrado', async ({ leadsPage, popup, api }) => {
    const name = faker.person.fullName();
    const email = faker.internet.email();

    await api.postLead(name, email);

    await leadsPage.visit();
    await leadsPage.openModal();
    await leadsPage.submitForm(name, email);
    await popup.expectText(
      'Verificamos que o endereço de e-mail fornecido já consta em nossa lista de espera. Isso significa que você está um passo mais perto de aproveitar nossos serviços.'
    );
  });

  test('não deve cadastrar com email incorreto', async ({ leadsPage }) => {
    await leadsPage.visit();
    await leadsPage.openModal();
    await leadsPage.submitForm('Paulo Capiotto', 'paulo.capiotto.com');
    await leadsPage.expectAlert('Email incorreto');
  });

  test('não deve cadastrar se o campo email não for preenchido', async ({ leadsPage }) => {
    await leadsPage.visit();
    await leadsPage.openModal();
    await leadsPage.submitForm('Paulo Capiotto', '');
    await leadsPage.expectAlert('Campo obrigatório');
  });

  test('não deve cadastrar quando o campo nome não for preenchido', async ({ leadsPage }) => {
    await leadsPage.visit();
    await leadsPage.openModal();
    await leadsPage.submitForm('', 'paulo@capiotto.com');
    await leadsPage.expectAlert('Campo obrigatório');
  });

  test('não deve cadastrar quando nenhum campo for preenchido', async ({ leadsPage }) => {
    await leadsPage.visit();
    await leadsPage.openModal();
    await leadsPage.submitForm('', '');
    await leadsPage.expectAlert(['Campo obrigatório', 'Campo obrigatório']);
  });

});
