import { LoginPage } from "../pages/LoginPage";
import {test as base } from "@playwright/test";

export type AuthFixture = {
    auth: LoginPage
}

export const test = base.extend<AuthFixture>({
    auth: async({page}, use) => {
        const loginPage = new LoginPage(page);
        await loginPage.open();
        await loginPage.login()

        await use(loginPage);
    }
})

export { expect } from '@playwright/test';