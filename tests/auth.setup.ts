import {expect, request, test as setup} from "@playwright/test";

const authFile = '.auth/user.json'

setup('authenticate', async({request}) => {
    const email = process.env.EMAIL;
    const password = process.env.PASSWORD;
    
    if (!email || !password) {
    throw new Error('EMAIL или PASSWORD не заданы');
    }

    const loginPageResponse = await request.get('/login')
    expect(loginPageResponse.ok()).toBeTruthy();

    const html = await loginPageResponse.text();

    const tokenMatch = html.match(
        /<input[^>]+name=["']_token["'][^>]+value=["']([^"']+)["']/i
    );

    if (!tokenMatch) {
        throw new Error('Не найден _token на странице /login')
    }

    const token = tokenMatch[1];

    const loginResponse = await request.post('/login', {
        multipart: {
            email,
            password,
            _token: token,
        }
    })

    expect(loginResponse.status()).toBeLessThan(400)

    await request.storageState({ path: authFile });
})