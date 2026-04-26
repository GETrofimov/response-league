import test, { Locator, Page } from "@playwright/test";
import { DEFAULT_USER_DATA, RegisterUserData } from "../types/RegisterUserData";


export class RegisterPage {
    public static readonly PATH = '/register'

    public static readonly DUPLICATE_EMAIL_ERROR = 'Такое значение поля электронная почта уже существует.'
    public static readonly DUPLICATE_PHONE_ERROR = 'Такое значение поля телефон уже существует.'
    public static readonly SHORT_PASSWORD_ERROR = 'Количество символов в поле пароль должно быть не менее 8.'
    public static readonly PASSWORD_MISMATCH_ERROR = 'Поле пароль не совпадает с подтверждением.'
    public static readonly INVALID_EMAIL_ERROR = 'Поле электронная почта должно быть действительным электронным адресом.'

    readonly page: Page;
    readonly nameInput: Locator;
    readonly phoneInput: Locator;
    readonly emailInput: Locator;
    readonly regionInput: Locator;
    readonly passwordInput: Locator;
    readonly confirmPasswordInput: Locator;
    readonly userAgreementCheckbox: Locator;
    readonly createAccountButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.nameInput = page.getByRole('textbox', { name: 'Имя' });
        this.phoneInput = page.getByRole('textbox', { name: 'Телефон' });
        this.emailInput = page.getByRole('textbox', { name: 'Адрес электронной почты' });
        this.regionInput = page.getByLabel('Регион *');
        this.passwordInput = page.getByRole('textbox', { name: 'Пароль', exact: true });
        this.confirmPasswordInput = page.getByRole('textbox', { name: 'Подтвердите пароль' });
        this.userAgreementCheckbox = page.getByRole('checkbox', { name: 'Я соглашаюсь с Политикой конфиденциальности и Пользовательским соглашением' });
        this.createAccountButton = page.locator('[data-test="register-user-button"]');
    }

    async open() {
        await test.step(`Открываем страницу ${process.env.BASE_URL}${RegisterPage.PATH}`, async() => {
            await this.page.goto(RegisterPage.PATH)
        })
    }

    async fillName(name: string) {
        await test.step('Заполняем поле "Имя"', async() => {
            await this.nameInput.fill(name)
        })
    }

    async fillPhone(phone: string) {
        await test.step('Заполняем поле "Телефон"', async() => {
            await this.phoneInput.fill(phone)
        })
    }

    async fillEmail(email: string) {
        await test.step('Заполняем поле "Адрес электронной почты"', async() => {
            await this.emailInput.fill(email)
        })
    }

    async fillRegion(region: string) {
        await test.step('Заполняем поле "Регион"', async() => {
            await this.regionInput.selectOption(region)
        })
    }

    async fillPassword(password: string) {
        await test.step('Заполняем поле "Пароль"', async() => {
            await this.passwordInput.fill(password)
        })
    }

    async fillConfirmPassword(password: string) {
        await test.step('Заполняем поле "Подтвердите пароль"', async() => {
            await this.confirmPasswordInput.fill(password)
        })
    }

    async fillRegistrationForm(userData: Partial<RegisterUserData> = {}) {
        const registrationData = {
            ...DEFAULT_USER_DATA,
            ...userData
        }

        await test.step('Заполняем форму регистрации', async() => {
            await this.nameInput.fill(registrationData.name)
            await this.phoneInput.fill(registrationData.phone)
            await this.emailInput.fill(registrationData.email)
            await this.regionInput.selectOption(registrationData.region)
            await this.passwordInput.fill(registrationData.password)
            await this.confirmPasswordInput.fill(registrationData.confirmPassword ?? registrationData.password)
        })
    }

    async clickOnUserAgreementCheckbox() {
        await test.step('Кликаем на чекбокс согласия с документами', async() => {
            await this.userAgreementCheckbox.check()
        })
    }

    async clickOnCreateAccountButton() {
        await test.step('Кликаем на кнопку создания аккаунта', async() => {
            await this.createAccountButton.click()
        })
    }

    async isFieldValid(field: Locator): Promise<boolean> {
        return field.evaluate((element: HTMLInputElement | HTMLSelectElement) => element.checkValidity())
    }

    async register(userData: Partial<RegisterUserData> = {}) {
        await test.step('Регистрируем нового пользователя', async() => {
            await this.fillRegistrationForm(userData)
            await this.userAgreementCheckbox.check()
            await this.createAccountButton.click()
        })
    }

}
