// spec: tests/e2e/movies.spec.js
// Executa no projeto 'e2e' (com storageState de admin) — ver playwright.config.js

import { test, expect } from '../fixtures/index.js';
import { deleteMovieByTitle, deleteMoviesByTitle } from '../support/database/index.js';
import data from '../support/fixtures/movies.json' with { type: 'json' };

test.describe('Movies', () => {

  test('deve poder cadastrar um novo filme', async ({ moviesPage, popup }) => {
    const movie = data.create;

    await deleteMovieByTitle(movie.title);

    await moviesPage.create(movie);
    await popup.expectText(`O filme '${movie.title}' foi adicionado ao catálogo.`);
  });

  test('deve poder remover um filme do catálogo', async ({ moviesPage, popup, api }) => {
    const movie = data.remove;

    await deleteMovieByTitle(movie.title);
    await api.postMovie(movie);

    await moviesPage.goToList();
    await moviesPage.remove(movie.title);
    await popup.expectText('Filme removido com sucesso.');
  });

  test('não deve poder cadastrar um filme com o titulo duplicado', async ({ moviesPage, popup, api }) => {
    const movie = data.duplicate;

    await deleteMovieByTitle(movie.title);
    await api.postMovie(movie);

    await moviesPage.create(movie);
    await popup.expectText(
      `O título '${movie.title}' já consta em nosso catálogo. Por favor, verifique se há necessidade de atualizações ou correções para este item.`
    );
  });

  test('não deve poder cadastrar quando os campos obrigatórios não são preenchidos', async ({ moviesPage }) => {
    await moviesPage.goToRegister();
    await moviesPage.submit();
    await moviesPage.expectAlertMessages([
      'Campo obrigatório',
      'Campo obrigatório',
      'Campo obrigatório',
      'Campo obrigatório',
    ]);
  });

  test('deve buscar pelo termo zumbi', async ({ moviesPage, api }) => {
    const movies = data.search;

    await deleteMoviesByTitle(movies.data.map((m) => m.title));
    for (const movie of movies.data) {
      await api.postMovie(movie);
    }

    await moviesPage.goToList();
    await moviesPage.search(movies.input);
    await moviesPage.expectSearchResults(movies.outputs);
  });

});
