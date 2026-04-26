import { RatingPageColumnHeaders } from "../constants/rating-page";
import { test, expect }  from "../fixtures/rating-page-fixture";
import { RatingPage } from "../pages/RatingPage";

test.describe('Проверки страницы "Рейтинг игроков"', () => {
    test('Проверка общего отображения элементов', async({ratingPage}) => {
        await expect(ratingPage.globalRatingTab).toBeVisible();
        await expect(ratingPage.regionalRatingTab).toBeVisible();
        await expect(ratingPage.table).toBeVisible()
        await expect(ratingPage.ratingDisclaimerBlock).toHaveText(RatingPage.RATING_DISCLAIMER_TEXT)

        await ratingPage.clickOnRegionalRatingTab()

        await expect(ratingPage.globalRatingTab).toBeVisible();
        await expect(ratingPage.regionalRatingTab).toBeVisible();
        await expect(ratingPage.table).toBeVisible()
        await expect(ratingPage.ratingDisclaimerBlock).toHaveText(RatingPage.RATING_DISCLAIMER_TEXT)
        await expect(ratingPage.regionDisclaimer).toHaveText(RatingPage.REGION_DISCLAIMER + process.env.USER_REGION)
    })

    test('Проверка, что в региональном рейтинге отображаются участники только одного региона', async({ratingPage}) => {
        await ratingPage.clickOnRegionalRatingTab()

        expect(await ratingPage.getDataFromRegionColumn()).toEqual(expect.arrayOf(process.env.USER_REGION))
    })

    test('Проверка, что позиция в глобальном рейтинге начинается с 1', async({ratingPage}) => {
        const positions = await ratingPage.getDataFromPositionColumn();
        
        expect(positions[0]).toEqual('●\n1');
    })

    test('Проверка, что позиция в региональном рейтинге начинается с 1', async({ratingPage}) => {
        await ratingPage.clickOnRegionalRatingTab();
        const positions = await ratingPage.getDataFromPositionColumn();
        
        expect(positions[0]).toEqual('●\n1');
    })

    test('Проверка, что 1-3 позиции в глобальном рейтинге имеют смайлик медали', async({ratingPage}) => {
        const positions = await ratingPage.getDataFromPositionColumn();
        
        test.step('Перебираем массив позиций до 4й позиции', async() => {
            let i = 0
            while(positions[i] != '4') {
                expect(positions[i]).toContain('●\n');
                i++;
            }
        })
    })

    test('Проверка, что 1-3 позиции в региональном рейтинге имеют смайлик медали', async({ratingPage}) => {
        await ratingPage.clickOnRegionalRatingTab()
        const positions = await ratingPage.getDataFromPositionColumn();
        
        test.step('Перебираем массив позиций до 4й позиции', async() => {
            let i = 0
            while(positions[i] != '4') {
                expect(positions[i]).toContain('●\n');
                i++;
            }
        })
    })

    test('Проверка, что участники отсортированы по очкам по убыванию в глобальном рейтинге', async({ratingPage}) => {
        const points = await ratingPage.getDataFromPointsColumn()
        const sorted = points.sort((a, b) => b - a);
        
        expect(points).toStrictEqual(sorted);
    })

    test('Проверка, что участники отсортированы по очкам по убыванию в региональном рейтинге', async({ratingPage}) => {
        await ratingPage.clickOnRegionalRatingTab();
        const points = await ratingPage.getDataFromPointsColumn()
        const sorted = points.sort((a, b) => b - a);
        
        expect(points).toStrictEqual(sorted);
    })

    test('Проверка, что в таблице отображаются названия колонок', async({ratingPage}) => {
        const headers = await ratingPage.getRowByIndex(0)
        expect(headers).toEqual(Object.values(RatingPageColumnHeaders))
    })
})