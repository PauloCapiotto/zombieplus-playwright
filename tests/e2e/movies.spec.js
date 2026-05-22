import { test } from '../support';
import data from "../support/fixtures/movies.json" with { type: "json" };
import { executeSQL } from "../support/database";

test('deve poder cadastrar um novo filme', async ({ page }) => {
    const movie = data.create;
    await executeSQL('DELETE FROM movies WHERE title = $1', [movie.title]);

    await page.login.visit();
    await page.login.submitLogin('admin@zombieplus.com', 'pwd123');
    await page.movies.isloggedIn();

    await page.movies.create(movie);
    await page.toast.containText('Cadastro realizado com sucesso!');
});

test('não deve poder cadastrar quando os campos obrigatórios não são preenchidos', async ({ page }) => {

    await page.login.visit();
    await page.login.submitLogin('admin@zombieplus.com', 'pwd123');
    await page.movies.isloggedIn();

    await page.movies.goForm();
    await page.movies.submit();
    await page.movies.alertHaveText([
        'Por favor, informe o título.',
        'Por favor, informe a sinopse.',
        'Por favor, informe a empresa distribuidora.',
        'Por favor, informe o ano de lançamento.']);
});

