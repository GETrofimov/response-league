import { test, expect } from "../fixtures/login-page-fixture";
import { DashboardPage } from "../pages/DashboardPage";
import { RegisterPage } from "../pages/RegisterPage";
import { captureRequests } from "../utils/listener";

test.describe('Проверки авторизации', () => {
    test('Проверка успешного логина', async({loginPage}) => {
        await loginPage.login()
        expect(loginPage.page).toHaveURL(DashboardPage.PATH)
    })

    test.skip('Авторизация без пароля', {
        annotation: {
            type: 'notReady',
            description: 'Нормальная валидация не реализована. Появляется только тултип обязательности поля, который сходу непонятно как искать на странице'
        },
    }, async({loginPage}) => {})

    test.skip('Авторизация без email', {
        annotation: {
            type: 'notReady',
            description: 'Нормальная валидация не реализована. Появляется только тултип обязательности поля, который сходу непонятно как искать на странице'
        },
    } ,async({loginPage}) => {})

    test('Авторизация с неверными кредами', async({loginPage}) => {
        await loginPage.login(undefined, "wrong password")

        await expect(loginPage.wrongCredentialsAlert).toBeVisible()
    })

    test('Кнопка отображения пароля делает его видимым', async({loginPage}) => {
        // Тут суть теста в том, что мы можем проверить что поменялся тип поля, 
        // но не можем проверить реально ли стало видимым содержимое поля
        // Алгоритм проверки:  посмотрели тип -> кликнули -> посмотрели, что тип поменялся
        const fieldType = await loginPage.passwordInput.getAttribute("type")

        expect(fieldType).toEqual("password")
        
        await loginPage.clickOnPasswordVisibilityButton()
        const changedFieldType = await loginPage.passwordInput.getAttribute("type")

        expect(changedFieldType).toEqual("text")
    })

    test('Кнопка "Запомнить меня" отправляет правильный флаг в запросе', async({loginPage}) => {
        // Регистрируем слушатель для перехвата запросов в консоли
        let requests = captureRequests(loginPage.page, '/login')
        
        await loginPage.clickOnRememberMeCheckbox()
        await loginPage.login()

        expect(requests[0].postDataJSON()['remember']).toEqual('on')
    })

    test('Кнопка "Зарегистрироваться" ведет на страницу регистрации', async({loginPage}) => {
        await loginPage.clickOnRegisterButton()
        
        await expect(loginPage.page).toHaveURL(RegisterPage.PATH)
    })
})