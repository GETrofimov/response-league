import { faker } from "@faker-js/faker";
import { DEFAULT_USER_DATA, RegisterUserData } from "../types/RegisterUserData";

export class TestDataFactory {
    static getRegisterUserData(userData: Partial<RegisterUserData> = {}): RegisterUserData {
        const password = `Aa1${faker.string.alphanumeric(9)}`

        return {
            ...DEFAULT_USER_DATA,
            name: faker.person.fullName(),
            phone: `79${faker.string.numeric(9)}`,
            email: faker.internet.email().toLowerCase(),
            region: '4',
            password,
            confirmPassword: password,
            ...userData
        }
    }
}
