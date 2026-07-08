import { test, expect } from '@playwright/test'

// Inject disclaimer acceptance before page loads so the dialog never blocks
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('disclaimer_accepted', 'true')
  })
})

test('home to catalog to a real detail page', async ({ page }) => {
  await page.goto('')
  await page.getByRole('link', { name: 'Browse Catalog' }).click()
  await expect(page).toHaveURL(/\/catalog$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Browse Peptides' })).toBeVisible()

  await page.getByText('BPC-157', { exact: true }).click()
  await expect(page).toHaveURL(/\/peptides\/bpc-157$/)
  await expect(page.getByRole('heading', { level: 1, name: 'BPC-157' })).toBeVisible()
})

test('home to get-started', async ({ page }) => {
  await page.goto('')
  await page.getByRole('link', { name: 'How to Get Started' }).click()
  await expect(page).toHaveURL(/\/get-started$/)
  await expect(page.getByRole('heading', { level: 1, name: 'How to Get Started' })).toBeVisible()
})

test('get-started links back to catalog', async ({ page }) => {
  await page.goto('get-started')
  await page.getByRole('link', { name: 'Browse the Catalog' }).click()
  await expect(page).toHaveURL(/\/catalog$/)
})

test('breadcrumbs replace BackBar on detail pages', async ({ page }) => {
  await page.goto('peptides/bpc-157')
  // Breadcrumb nav should be present
  await expect(page.getByRole('navigation', { name: 'breadcrumb' })).toBeVisible()
})
