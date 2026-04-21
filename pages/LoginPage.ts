import test, { Locator, Page } from "@playwright/test";

export class LoginPage {
    readonly page: Page;
    
    // inputs
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly rememberMeCheckbox: Locator;
    readonly wrongCredentialsAlert: Locator;
    
    // buttons 
    readonly loginButton: Locator;
    readonly registerButton: Locator;
    readonly passwordVisibilityButton: Locator;

    public static readonly PATH = '/login'

    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.getByRole('textbox', { name: 'Адрес электронной почты' });
        this.passwordInput = page.getByRole('textbox', { name: 'Пароль' });
        this.rememberMeCheckbox = page.getByRole('checkbox', { name: 'Запомнить меня' });
        this.loginButton = page.locator('[data-test="login-button"]');
        this.registerButton = page.getByRole('link', { name: 'Зарегистрироваться' });
        this.passwordVisibilityButton = page.getByRole('button', { name: 'Toggle password visibility' });
        this.wrongCredentialsAlert = page.getByText('These credentials do');
    }

    async open() {
        await test.step(`Открываем страницу ${process.env.BASE_URL}${LoginPage.PATH}`, async() => {
            await this.page.goto(LoginPage.PATH)
        })
    }

    async login(email: string = process.env.EMAIL, password: string = process.env.PASSWORD) {
        await test.step('Авторизуемся', async() => {
            await this.emailInput.fill(email)
            await this.passwordInput.fill(password)
            await this.loginButton.click()
        })
    }

    async clickOnRegisterButton() {
        await test.step('Кликаем на кнопку "Зарегистрироваться"', async() => {
            await this.registerButton.click()
        })
    }

    async clickOnRememberMeCheckbox() {
        await test.step('Кликаем на чекбокс "Запомнить меня"', async() => {
            await this.rememberMeCheckbox.check()
        })
    }

    async clickOnPasswordVisibilityButton() {
        await test.step('Кликаем на кнопку отображения пароля', async() => {
            await this.passwordVisibilityButton.click()
        })
    }
}