import { RatingPage } from "../pages/RatingPage"
import { AuthFixture, test as base } from "../fixtures/authorized-fixture"

export type RatingFixture = {
    ratingPage: RatingPage
    auth: AuthFixture
}

export const test = base.extend<RatingFixture>({
    ratingPage: async({auth}, use) => {
        const ratingPage = new RatingPage(auth.page);
        await ratingPage.open();

        await use(ratingPage);
    }
})

export { expect } from "@playwright/test"