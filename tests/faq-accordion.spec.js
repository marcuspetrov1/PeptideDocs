import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('disclaimer_accepted', 'true')
  })
  await page.goto('peptides/bpc-157')
})

test.describe('Peptide FAQ Accordion', () => {
  test('FAQ section is present on the peptide detail page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Frequently Asked Questions/i })).toBeVisible()
  })

  test('accordion content is hidden on initial load', async ({ page }) => {
    // All accordion items should be in closed state initially
    const closedItems = page.locator('[data-state="closed"]')
    await expect(closedItems.first()).toBeVisible()
    // No accordion content panel should be expanded
    const openItems = page.locator('[data-state="open"]')
    await expect(openItems).toHaveCount(0)
  })

  test('clicking a trigger reveals its content', async ({ page }) => {
    const firstTrigger = page.getByRole('button').filter({ hasText: /How does/i }).first()
    await firstTrigger.click()
    // After clicking, the item should be open
    const openItems = page.locator('[data-state="open"]')
    await expect(openItems.first()).toBeVisible()
  })
})
