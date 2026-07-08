import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('disclaimer_accepted', 'true')
  })
})

test.describe('Cards and Tables', () => {
  test.describe('Catalog Cards', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('catalog')
    })

    test('cards render peptide titles', async ({ page }) => {
      const firstCardTitle = page.locator('.font-heading').filter({ hasText: /./ }).first()
      await expect(firstCardTitle).toBeVisible()
    })

    test('cards link to peptide detail pages', async ({ page }) => {
      // Find an <a> that wraps a heading — our Card > Link > CardHeader > CardTitle structure
      const firstLink = page.getByRole('link').filter({
        has: page.locator('.font-heading').filter({ hasText: /./ }),
      }).first()
      const href = await firstLink.getAttribute('href')
      expect(href).toMatch(/\/peptides\//)
    })
  })

  test.describe('Reconstitution Panel Tables', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('peptides/bpc-157')
      await page.getByRole('tab', { name: 'Protocol' }).click()
    })

    test('syringe reference table headers are present', async ({ page }) => {
      await expect(page.getByRole('columnheader', { name: 'Units (syringe)', exact: true })).toBeVisible()
      await expect(page.getByRole('columnheader', { name: /Dose/i }).first()).toBeVisible()
    })

    test('table has data rows', async ({ page }) => {
      // At least 1 data row in syringe reference table
      const rows = page.getByRole('row')
      const count = await rows.count()
      expect(count).toBeGreaterThanOrEqual(2) // 1 header + 1+ data rows
    })
  })
})
