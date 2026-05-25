import { expect, test } from '../support';
import { faker } from '@faker-js/faker';


test('deve cadastrar um filme na fila de espera com sucesso', async ({ page }) => {
  const leadName = faker.person.fullName();
  const leadEmail = faker.internet.email();

  await page.Leads.visit();
  await page.Leads.openModal();
  await page.Leads.submitForm(leadName, leadEmail);

  await page.popup.haveText('Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato.');
});

test('não deve cadastrar email já registrado', async ({ page, request }) => {
  const leadName = faker.person.fullName();
  const leadEmail = faker.internet.email();

  const newLead = await request.post('http://localhost:3333/leads', {
    data: {
      name: leadName,
      email: leadEmail
    }
  })

  expect(newLead.ok()).toBeTruthy()

  await page.Leads.visit();
  await page.Leads.openModal();
  await page.Leads.submitForm(leadName, leadEmail);

  await page.popup.haveText('Verificamos que o endereço de e-mail fornecido já consta em nossa lista de espera. Isso significa que você está um passo mais perto de aproveitar nossos serviços.');
})

test('não deve cadastrar com email incorreto', async ({ page }) => {

  await page.Leads.visit();
  await page.Leads.openModal();
  await page.Leads.submitForm('Paulo Capiotto', 'paulo.capiotto.com');
  await page.Leads.alertHaveText('Email incorreto');
});

test('não deve cadastrar se o campo email não for preenchido', async ({ page }) => {

  await page.Leads.visit();
  await page.Leads.openModal();
  await page.Leads.submitForm('Paulo Capiotto', '');

  await page.Leads.alertHaveText('Campo obrigatório');
});

test('não deve cadastrar quando o campo nome não for preenchido', async ({ page }) => {

  await page.Leads.visit();
  await page.Leads.openModal();
  await page.Leads.submitForm('', 'paulo@capiotto.com');

  await page.Leads.alertHaveText('Campo obrigatório');
});

test('não deve cadastrar quando nenhum campo for preenchido', async ({ page }) => {

  await page.Leads.visit();
  await page.Leads.openModal();
  await page.Leads.submitForm('', '');

  await page.Leads.alertHaveText([
    'Campo obrigatório',
    'Campo obrigatório'
  ]);
});
