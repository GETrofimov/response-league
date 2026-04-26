import { RatingPage } from "../pages/RatingPage"
import { test as base } from "@playwright/test"

export type RatingFixture = {
    ratingPage: RatingPage
}

export const test = base.extend<RatingFixture>({
    ratingPage: async({page}, use) => {
        const ratingPage = new RatingPage(page);
        await ratingPage.open();

        await use(ratingPage);
    }
})

export { expect } from "@playwright/test"