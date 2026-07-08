import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('disclaimer_accepted', 'true')
  })
  await page.goto('')
})

test.describe('Home (search-first layout)', () => {
  test('category chip is visible and links to the catalog', async ({ page }) => {
    const chip = page.getByRole('link', { name: /Longevity/i })
    await expect(chip).toBeVisible()
    await expect(chip).toHaveAttribute('href', /\/catalog$/)
  })

  test('popular peptides heading and cards are visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Popular Peptides' })).toBeVisible()
    const card = page.getByRole('link', { name: /^BPC-157\b/i })
    await expect(card).toBeVisible()
  })

  test('selecting a featured peptide card navigates to its detail page', async ({ page }) => {
    await page.getByRole('link', { name: /^BPC-157\b/i }).click()
    await expect(page).toHaveURL(/\/peptides\/bpc-157$/)
  })

  test('get started strip links to /get-started and /catalog', async ({ page }) => {
    const main = page.getByRole('main')
    await expect(main.getByRole('link', { name: 'Get Started', exact: true })).toHaveAttribute('href', /\/get-started$/)
    await expect(main.getByRole('link', { name: 'Browse Full Catalog' })).toHaveAttribute('href', /\/catalog$/)
  })
})
