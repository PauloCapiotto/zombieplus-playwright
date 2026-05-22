import { expect, test } from '../support';
import { faker } from '@faker-js/faker';


test('deve cadastrar um filme na fila de espera com sucesso', async ({ page }) => {
  const leadName = faker.person.fullName();
  const leadEmail = faker.internet.email();

  await page.landing.visit();
  await page.landing.openModal();
  await page.landing.submitForm(leadName, leadEmail);

  await page.toast.containText('Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato!');
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

  await page.landing.visit();
  await page.landing.openModal();
  await page.landing.submitForm(leadName, leadEmail);

  await page.toast.containText('O endereço de e-mail fornecido já está registrado em nossa fila de espera.');
})

test('não deve cadastrar com email incorreto', async ({ page }) => {

  await page.landing.visit();
  await page.landing.openModal();
  await page.landing.submitForm('Paulo Capiotto', 'paulo.capiotto.com');
  await page.landing.alertHaveText('Email incorreto');
});

test('não deve cadastrar se o campo email não for preenchido', async ({ page }) => {

  await page.landing.visit();
  await page.landing.openModal();
  await page.landing.submitForm('Paulo Capiotto', '');

  await page.landing.alertHaveText('Campo obrigatório');
});

test('não deve cadastrar quando o campo nome não for preenchido', async ({ page }) => {

  await page.landing.visit();
  await page.landing.openModal();
  await page.landing.submitForm('', 'paulo@capiotto.com');

  await page.landing.alertHaveText('Campo obrigatório');
});

test('não deve cadastrar quando nenhum campo for preenchido', async ({ page }) => {

  await page.landing.visit();
  await page.landing.openModal();
  await page.landing.submitForm('', '');

  await page.landing.alertHaveText([
    'Campo obrigatório',
    'Campo obrigatório'
  ]);
});
