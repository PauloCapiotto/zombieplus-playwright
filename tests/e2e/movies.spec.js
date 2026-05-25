import { test } from '../support';
import data from "../support/fixtures/movies.json" with { type: "json" };
import { executeSQL } from "../support/database";


test('deve poder cadastrar um novo filme', async ({ page }) => {
    const movie = data.create;
    await executeSQL(`DELETE FROM movies WHERE title = '${movie.title}'`)
    await page.login.go('admin@zombieplus.com', 'pwd123', 'Admin');

    await page.movies.create(movie);
    await page.popup.haveText(`O filme '${movie.title}' foi adicionado ao catálogo.`);
});

test('deve poder remover um filme do catálogo', async ({ page, request }) => {
    const movie = data.remove;
    await executeSQL(`DELETE FROM movies WHERE title = '${movie.title}'`)
    await request.api.postMovie(movie);

    await page.login.go('admin@zombieplus.com', 'pwd123', 'Admin');
    await page.movies.remove(movie.title);
    await page.popup.haveText('Filme removido com sucesso.');

});

test('não deve poder cadastrar um filme com o titulo duplicado', async ({ page, request }) => {
    const movie = data.duplicate;
    await executeSQL(`DELETE FROM movies WHERE title = '${movie.title}'`)
    await request.api.postMovie(movie);

    await page.login.go('admin@zombieplus.com', 'pwd123', 'Admin');
    await page.movies.create(movie);
    await page.popup.haveText(
        `O título '${movie.title}' já consta em nosso catálogo. Por favor, verifique se há necessidade de atualizações ou correções para este item.`);

});

test('não deve poder cadastrar quando os campos obrigatórios não são preenchidos', async ({ page }) => {
    await page.login.go('admin@zombieplus.com', 'pwd123', 'Admin');

    await page.movies.goForm();
    await page.movies.submit();
    await page.movies.alertHaveText([
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório']);
});

test('deve buscar pelo termo zumbi', async ({ page, request }) => {
    const movies = data.search;

    for (const m of movies.data) {
        await executeSQL(`DELETE FROM movies WHERE title = '${m.title}'`);
        await request.api.postMovie(m);
    }

    await page.login.go('admin@zombieplus.com', 'pwd123', 'Admin');
    await page.movies.search(movies.input);
    await page.movies.searchHaveMovies(movies.outputs);
});