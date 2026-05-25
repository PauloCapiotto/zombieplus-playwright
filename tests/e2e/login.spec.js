import { expect, test } from '../support';


test('realiza login como administrador com sucesso', async ({ page }) => {
    await page.login.visit();
    await page.login.submitLogin('admin@zombieplus.com', 'pwd123');
    await page.login.isloggedIn('Admin');
});

test('não deve logar com senha incorreta', async ({ page }) => {
    await page.login.visit();
    await page.login.submitLogin('admin@zombieplus.com', 'teste123');
    await page.popup.haveText('Ocorreu um erro ao tentar efetuar o login. Por favor, verifique suas credenciais e tente novamente.');
});

test('não deve logar com o email incorreto', async ({ page }) => {
    await page.login.visit();
    await page.login.submitLogin('paulo.qa.com', 'pwd123');
    await page.login.alertHaveText('Email incorreto');
});

test('não deve logar com o campo email vazio', async ({ page }) => {
    await page.login.visit();
    await page.login.submitLogin('', 'pwd123');
    await page.login.alertHaveText('Campo obrigatório');
});

test('não deve logar com o campo senha vazio', async ({ page }) => {
    await page.login.visit();
    await page.login.submitLogin('admin@zombieplus.com', '');
    await page.login.alertHaveText('Campo obrigatório');
});

test('não deve logar quando nenhum campo for preenchido', async ({ page }) => {
    await page.login.visit();
    await page.login.submitLogin('', '');
    await page.login.alertHaveText(
        ['Campo obrigatório', 'Campo obrigatório']);
});
