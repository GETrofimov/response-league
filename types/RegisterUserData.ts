type RegisterUserData = {
    name: string;
    phone: string;
    email: string;
    region: string;
    password: string;
    confirmPassword?: string;
}

const DEFAULT_USER_DATA: RegisterUserData = {
        name: "Промысл-Божий Слуга-Бога Тетраграмматонович",
        phone: '79220264284',
        email: 'john-smith@example.com',
        region: '4',
        password: '123456789Ab'
    }

export {RegisterUserData, DEFAULT_USER_DATA};