import { test, expect } from '@playwright/test'

test('home page renders', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/OptimalPep/)
  await expect(page.locator('h1.home__hero-heading')).toBeVisible()
})
