import { expect } from "@playwright/test";

export class LoginPage {
    constructor(page) {
        this.page = page;
    }

    async go(email, password, username) {
        await this.visit();
        await this.submitLogin(email, password);
        await this.isloggedIn(username);
    }

    async visit() {
        await this.page.goto('/admin/login');

        const loginFormulario = this.page.locator('.login-form');
        await expect(loginFormulario).toBeVisible();
    }

    async submitLogin(email, password) {
        await this.page.getByPlaceholder('E-mail').fill(email);
        await this.page.getByPlaceholder('Senha').fill(password);
        await this.page.getByText('Entrar').click();
    }

    async alertHaveText(text) {
        const alertEmail = this.page.locator('span[class$="alert"]');
        await expect(alertEmail).toHaveText(text);
    }

    async isloggedIn(username) {
        await this.page.waitForLoadState('networkidle');
        await expect(this.page).toHaveURL(/.*admin/);
        const loggedUser = this.page.locator('.logged-user');
        await expect(loggedUser).toHaveText(`Olá, ${username}`);
    }

}
