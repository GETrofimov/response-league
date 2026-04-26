# Response League Tests

Автотесты для проекта Response League на Playwright и TypeScript.

Проект проверяет основные пользовательские сценарии:

- регистрацию пользователя;
- авторизацию;
- страницу рейтинга игроков;
- работу сессии через предварительный setup авторизации.

## Стек

- Node.js
- TypeScript
- Playwright Test
- Faker для генерации тестовых данных
- dotenv для переменных окружения

## Установка

Установите зависимости:

```bash
npm install
```

Установите браузеры Playwright:

```bash
npx playwright install
```

## Настройка окружения

Создайте файл `.env` в корне проекта на основе `.env.example`:

```bash
cp .env.example .env
```

Для Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Заполните переменные:

```env
BASE_URL=https://response-league.ru
EMAIL=johnSmith@example.com
PASSWORD=123456789
USER_REGION=Екатеринбург
```

Переменные используются так:

- `BASE_URL` - базовый адрес тестируемого приложения;
- `EMAIL` и `PASSWORD` - данные существующего пользователя для авторизации;
- `USER_REGION` - регион авторизованного пользователя, который проверяется на странице рейтинга.

Файл `.env` не коммитится в репозиторий.

## Запуск тестов

Запустить все тесты:

```bash
npx playwright test
```

Запустить тесты только в Chromium:

```bash
npx playwright test --project=chromium
```

Запустить конкретный файл:

```bash
npx playwright test tests/login.spec.ts
```

Запустить тесты в headed-режиме:

```bash
npx playwright test --headed
```

Запустить тесты с UI Playwright:

```bash
npx playwright test --ui
```

## Отчет

После запуска формируется HTML-отчет в `playwright-report`.

Открыть последний отчет:

```bash
npx playwright show-report
```

## Авторизация в тестах

В конфигурации Playwright есть отдельный проект `setup`, который запускает `tests/auth.setup.ts`.

Он:

1. открывает `/login`;
2. получает CSRF-токен из формы;
3. отправляет POST-запрос авторизации;
4. сохраняет состояние браузера в `.auth/user.json`.

Основные браузерные проекты (`chromium`, `firefox`, `webkit`) используют этот файл через `storageState`.

Тесты регистрации и логина очищают `storageState`, потому что для них нужна неавторизованная сессия.

## Структура проекта

```text
constants/     Константы для тестов
fixtures/      Playwright fixtures для Page Object'ов
pages/         Page Object-классы страниц
test-data/     Тестовые данные
tests/         Спецификации Playwright
types/         TypeScript-типы
utils/         Вспомогательные функции
```

Основные файлы:

- `playwright.config.ts` - конфигурация Playwright, браузеры, baseURL и setup авторизации;
- `tests/auth.setup.ts` - подготовка авторизованной сессии;
- `tests/login.spec.ts` - проверки авторизации;
- `tests/register.spec.ts` - проверки регистрации;
- `tests/rating.spec.ts` - проверки страницы рейтинга;
- `utils/faker.ts` - генерация данных для регистрации;
- `utils/listener.ts` - перехват запросов для проверок отправляемых данных.

## Полезные команды

Посмотреть список тестов:

```bash
npx playwright test --list
```

Запустить тесты в debug-режиме:

```bash
npx playwright test --debug
```

Открыть trace после падения теста:

```bash
npx playwright show-trace path/to/trace.zip
```

Trace включен в режиме `on-first-retry`, поэтому на локальном запуске без retry он появится только при соответствующей настройке или при запуске на CI.

## Git ignore

В репозиторий не попадают:

- `node_modules`;
- `.env`;
- `.auth`;
- `test-results`;
- `playwright-report`;
- кэш Playwright.

