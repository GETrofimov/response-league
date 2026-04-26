import { test as base } from "@playwright/test";
import { RegisterPage } from "../pages/RegisterPage";

type RegisterPageFixture = {
    registerPage: RegisterPage;
}

export const test = base.extend<RegisterPageFixture>({
    registerPage: async({ page }, use) => {
        const registerPage = new RegisterPage(page);
        await registerPage.open();

        await use(registerPage);
    }
})

export { expect } from "@playwright/test";
