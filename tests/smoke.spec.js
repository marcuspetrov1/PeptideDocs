import { test, expect } from '@playwright/test'

test('home page renders', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('disclaimer_accepted', 'true')
  })
  await page.goto('')
  await expect(page).toHaveTitle(/PeptideDocs/)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})
