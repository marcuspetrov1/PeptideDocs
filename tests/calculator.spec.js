import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('disclaimer_accepted', 'true')
  })
  await page.goto('peptides/bpc-157')
  await page.getByRole('tab', { name: 'Protocol' }).click()
})

test.describe('Reconstitution Calculator', () => {
  test('calculator is visible on the Protocol tab', async ({ page }) => {
    await expect(page.getByText('Reconstitution Calculator')).toBeVisible()
  })

  test('disclaimer text is visible', async ({ page }) => {
    await expect(page.getByText('For Research Purposes Only')).toBeVisible()
  })

  test('result displays mcg per unit', async ({ page }) => {
    await expect(page.getByText('mcg', { exact: true })).toBeVisible()
  })
})
