import { test, expect } from "../fixtures/register-page-fixture";
import { DashboardPage } from "../pages/DashboardPage";
import { RegisterPage } from "../pages/RegisterPage";
import { TestDataFactory } from "../utils/faker";
import { captureRequests } from "../utils/listener";

test.describe('Проверки регистрации', () => {

    // Для тестов регистрации сбрасываем заранее полученные токены авторизации
    test.use({
        storageState: {cookies: [], origins: []}
    })

    test('Проверка общего отображения элементов', async({registerPage}) => {
        await expect(registerPage.nameInput).toBeVisible()
        await expect(registerPage.phoneInput).toBeVisible()
        await expect(registerPage.emailInput).toBeVisible()
        await expect(registerPage.regionInput).toBeVisible()
        await expect(registerPage.passwordInput).toBeVisible()
        await expect(registerPage.confirmPasswordInput).toBeVisible()
        await expect(registerPage.userAgreementCheckbox).toBeVisible()
        await expect(registerPage.createAccountButton).toBeVisible()
    })

    test('Проверка заполнения формы регистрации', async({registerPage}) => {
        const userData = TestDataFactory.getRegisterUserData()

        await registerPage.fillRegistrationForm(userData)

        await expect(registerPage.nameInput).toHaveValue(userData.name)
        await expect(registerPage.phoneInput).toHaveValue(userData.phone)
        await expect(registerPage.emailInput).toHaveValue(userData.email)
        await expect(registerPage.regionInput).toHaveValue(userData.region)
        await expect(registerPage.passwordInput).toHaveValue(userData.password)
        await expect(registerPage.confirmPasswordInput).toHaveValue(userData.password)
    })

    test('Чекбокс согласия с документами можно отметить', async({registerPage}) => {
        await registerPage.clickOnUserAgreementCheckbox()

        await expect(registerPage.userAgreementCheckbox).toBeChecked()
    })

    test('Проверка успешной регистрации', async({registerPage}) => {
        const userData = TestDataFactory.getRegisterUserData()

        await registerPage.register(userData)

        await expect(registerPage.page).toHaveURL(DashboardPage.PATH)
    })

    test('Кнопка создания аккаунта отправляет данные формы в запросе', async({registerPage}) => {
        const userData = TestDataFactory.getRegisterUserData()
        const requests = captureRequests(registerPage.page, RegisterPage.PATH)

        await registerPage.register(userData)

        const requestBody = requests[0].postDataJSON()

        expect(requestBody['name']).toEqual(userData.name)
        expect(requestBody['phone']).toEqual(userData.phone)
        expect(requestBody['email']).toEqual(userData.email)
        expect(requestBody['region_id']).toEqual(userData.region)
        expect(requestBody['password']).toEqual(userData.password)
    })

    test('Нельзя зарегистрироваться, не заполнив обязательное поле', async({registerPage}) => {
        const requiredFields = [
            {
                name: 'Имя',
                field: registerPage.nameInput,
                clear: async() => registerPage.nameInput.fill('')
            },
            {
                name: 'Телефон',
                field: registerPage.phoneInput,
                clear: async() => registerPage.phoneInput.fill('')
            },
            {
                name: 'Адрес электронной почты',
                field: registerPage.emailInput,
                clear: async() => registerPage.emailInput.fill('')
            },
            {
                name: 'Регион',
                field: registerPage.regionInput,
                clear: async() => registerPage.regionInput.evaluate((element: HTMLSelectElement) => {
                    element.value = ''
                    element.dispatchEvent(new Event('change', { bubbles: true }))
                })
            },
            {
                name: 'Пароль',
                field: registerPage.passwordInput,
                clear: async() => registerPage.passwordInput.fill('')
            },
            {
                name: 'Подтверждение пароля',
                field: registerPage.confirmPasswordInput,
                clear: async() => registerPage.confirmPasswordInput.fill('')
            },
            {
                name: 'Согласие с документами',
                field: registerPage.userAgreementCheckbox,
                clear: async() => registerPage.userAgreementCheckbox.uncheck()
            }
        ]

        for (const requiredField of requiredFields) {
            await test.step(`Поле "${requiredField.name}" обязательно`, async() => {
                await registerPage.open()
                await registerPage.fillRegistrationForm(TestDataFactory.getRegisterUserData())
                await registerPage.clickOnUserAgreementCheckbox()
                await requiredField.clear()

                const requests = captureRequests(registerPage.page, RegisterPage.PATH)
                await registerPage.clickOnCreateAccountButton()

                expect(await registerPage.isFieldValid(requiredField.field)).toBeFalsy()
                expect(requests.find(request => request.method() === 'POST')).toBeUndefined()
                await expect(registerPage.page).toHaveURL(RegisterPage.PATH)
            })
        }
    })

    test('Нельзя создать пользователей с одинаковым email', async({registerPage}) => {
        const userData = TestDataFactory.getRegisterUserData()

        await registerPage.register(userData)
        await registerPage.page.context().clearCookies()
        await registerPage.open()
        await registerPage.register({
            ...TestDataFactory.getRegisterUserData(),
            email: userData.email
        })

        await expect(registerPage.page).toHaveURL(RegisterPage.PATH)
        await expect(registerPage.page.getByText(RegisterPage.DUPLICATE_EMAIL_ERROR)).toBeVisible()
    })

    test('Нельзя создать пользователей с одинаковым номером телефона', async({registerPage}) => {
        const userData = TestDataFactory.getRegisterUserData()

        await registerPage.register(userData)
        await registerPage.page.context().clearCookies()
        await registerPage.open()
        await registerPage.register({
            ...TestDataFactory.getRegisterUserData(),
            phone: userData.phone
        })

        await expect(registerPage.page).toHaveURL(RegisterPage.PATH)
        await expect(registerPage.page.getByText(RegisterPage.DUPLICATE_PHONE_ERROR)).toBeVisible()
    })

    test('Пароль должен быть не меньше 8 символов', async({registerPage}) => {
        await registerPage.register(TestDataFactory.getRegisterUserData({
            password: 'Aa12345',
            confirmPassword: 'Aa12345'
        }))

        await expect(registerPage.page).toHaveURL(RegisterPage.PATH)
        await expect(registerPage.page.getByText(RegisterPage.SHORT_PASSWORD_ERROR)).toBeVisible()
    })

    test('Нельзя зарегистрироваться, если пароли не совпадают', async({registerPage}) => {
        await registerPage.register(TestDataFactory.getRegisterUserData({
            password: 'Aa12345678',
            confirmPassword: 'Aa12345679'
        }))

        await expect(registerPage.page).toHaveURL(RegisterPage.PATH)
        await expect(registerPage.page.getByText(RegisterPage.PASSWORD_MISMATCH_ERROR)).toBeVisible()
    })

    test('Нельзя сохранить поля только с пробелами', async({registerPage}) => {
        await registerPage.fillRegistrationForm(TestDataFactory.getRegisterUserData({
            name: '   ',
            phone: '   ',
            email: '   ',
            password: '        ',
            confirmPassword: '        '
        }))
        await registerPage.clickOnUserAgreementCheckbox()
        await registerPage.clickOnCreateAccountButton()

        await expect(registerPage.page).toHaveURL(RegisterPage.PATH)
    })

    const invalidEmails = [
        'john..smith@example.com',
        '.john@example.com',
        'john@example..com',
        'john@.example.com'
    ]

    for (const invalidEmail of invalidEmails) {
        test(`Нельзя зарегистрироваться с невалидным email: ${invalidEmail}`, async({registerPage}) => {
            await registerPage.register(TestDataFactory.getRegisterUserData({
                email: invalidEmail
            }))

            await expect(registerPage.page).toHaveURL(RegisterPage.PATH)

            const isEmailValid = await registerPage.isFieldValid(registerPage.emailInput)
            if (isEmailValid) {
                await expect(registerPage.page.getByText(RegisterPage.INVALID_EMAIL_ERROR)).toBeVisible()
            } else {
                expect(isEmailValid).toBeFalsy()
            }
        })
    }
})
