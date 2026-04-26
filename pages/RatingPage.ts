import test, { Locator, Page } from "@playwright/test";
export class RatingPage {
    
    // Константы
    public static readonly PATH = '/rating'
    public static readonly RATING_DISCLAIMER_TEXT = /Как рассчитывается рейтинг\s+Рейтинговые очки начисляются за участие в завершённых играх: 3 очка за победу, 1 очко за поражение\. Учитывается не более одной игры с одним и тем же оппонентом в неделю\. На турнирные игры данное ограничение не распространяется\./
    public static readonly REGION_DISCLAIMER = 'Показан рейтинг для вашего региона: '

    readonly page: Page;
    readonly globalRatingTab: Locator;
    readonly regionalRatingTab: Locator;
    readonly columnHeader: Locator;
    readonly table: Locator;
    readonly ratingDisclaimerBlock: Locator;
    readonly regionDisclaimer: Locator;

    constructor(page: Page) {
        this.page = page;
        this.globalRatingTab = page.getByRole('button', { name: 'Глобальный рейтинг' });
        this.regionalRatingTab = page.getByRole('button', { name: 'Рейтинг по региону' });
        this.columnHeader = page.getByRole('columnheader');
        this.table = page.getByRole('table');
        this.ratingDisclaimerBlock = page.getByText('Как рассчитывается рейтинг').locator('..')
        this.regionDisclaimer = page.getByText(RatingPage.REGION_DISCLAIMER)
    }

    async open() {
        await test.step(`Открываем страницу ${process.env.BASE_URL}${RatingPage.PATH}`, async() => {
            await this.page.goto(RatingPage.PATH)
        })
    }

    async clickOnRegionalRatingTab() {
        await test.step('Кликаем на таб "Рейтинг по региону"', async() => {
            const responsePromise = this.page.waitForResponse('**/update');
            await this.regionalRatingTab.click()
            const response = await responsePromise;
        })
    }

    async clickOnGlobalRatingTab() {
        await test.step('Кликаем на таб "Глобальный рейтинг"', async() => {
            const responsePromise = this.page.waitForResponse('**/update');
            await this.globalRatingTab.click()
            const response = await responsePromise;
        })
    }

    // У нас всего 4 колонки, так что их можно захардкодить
    async getDataFromPositionColumn(): Promise<string[]> {
        const columnData = await this.page.locator('table tr td:nth-child(1)').allInnerTexts()
        return columnData;
    }
    async getDataFromPlayerColumn(): Promise<string[]> {
        const columnData = await this.page.locator('table tr td:nth-child(2)').allInnerTexts()
        return columnData;
    }

    async getDataFromRegionColumn(): Promise<string[]> {
        const columnData = await this.page.locator('table tr td:nth-child(3)').allInnerTexts()
        return columnData;
    }

    async getDataFromPointsColumn(): Promise<number[]> {
        const columnData = await this.page.locator('table tr td:nth-child(4)').allInnerTexts()
        const points = columnData.map(item => Number(item.split(' ')[0]))
        return points;
    }

    async getRowByIndex(index: number): Promise<string[]> {
        return (await this.table.locator('tr').nth(index).allInnerTexts()).flatMap(i => i.split('\t'))
    }

    async getTableHeaders() {
        test.step('Получаем заголовки таблицы', async() => {
            return this.getRowByIndex(0)
        })
    }
}