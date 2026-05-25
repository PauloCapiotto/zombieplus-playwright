import { expect } from "@playwright/test";

export class MoviesPage {
    constructor(page) {
        this.page = page;
    }

    async goForm() {
        await this.page.locator('a[href$="register"]').click();
    }

    async submit() {
        await this.page.getByRole('button', { name: 'Cadastrar' }).click();
    }

    async create(movie) {
        await this.goForm()

        await this.page.getByLabel('Titulo do filme').fill(movie.title);
        await this.page.getByLabel('Sinopse').fill(movie.overview);

        await this.page.locator('#select_company_id .react-select__dropdown-indicator')
            .click()

        await this.page.locator('.react-select__option')
            .filter({ hasText: movie.company })
            .click()

        await this.page.locator('#select_year .react-select__dropdown-indicator')
            .click()

        await this.page.locator('.react-select__option')
            .filter({ hasText: movie.release_year })
            .click()

        await this.page.locator('#cover').setInputFiles('tests/support/fixtures/' + movie.cover);

        if (movie.featured) {
            await this.page.locator('label', { hasText: 'Destaque' }).click()
        }

        await this.submit()
    }

    async alertHaveText(target) {
        const alerts = this.page.locator('.alert');
        await expect(alerts).toHaveText(target);
    }

    async remove(title) {
        await this.page.getByRole('row', { name: title }).getByRole('button').click()
        await this.page.click('.confirm-removal')
    }

    async search(term) {
        await this.page.getByPlaceholder('Busque pelo nome').fill(term);
        await this.page.locator('form button[type="submit"]').click();
    }

    async searchHaveMovies(titles) {
        const rows = this.page.getByRole('rowgroup').getByRole('row');
        await expect(rows).toHaveCount(titles.length);
        for (const title of titles) {
            await expect(this.page.getByRole('row', { name: title })).toBeVisible();
        }
    }

}
