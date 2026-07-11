import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('disclaimer_accepted', 'true')
  })
  await page.goto('')
})

test.describe('Home Search (Command)', () => {
  test('search input is present on the home page', async ({ page }) => {
    const input = page.getByRole('combobox')
    await expect(input).toBeVisible()
  })

  test('typing "BPC" filters to show BPC-157', async ({ page }) => {
    const input = page.getByRole('combobox')
    await input.fill('BPC')
    await expect(page.getByRole('option', { name: /BPC-157/i })).toBeVisible()
  })

  test('selecting BPC-157 navigates to its detail page', async ({ page }) => {
    const input = page.getByRole('combobox')
    await input.fill('BPC')
    await page.getByRole('option', { name: /BPC-157/i }).click()
    await expect(page).toHaveURL(/\/peptides\/bpc-157/)
  })

  test('typing a category term filters to peptides in that category', async ({ page }) => {
    const input = page.getByRole('combobox')
    await input.fill('fat loss')
    await expect(page.getByRole('option', { name: /Adipotide/i })).toBeVisible()
  })

  test('search input exposes an accessible name and disables spellcheck', async ({ page }) => {
    const input = page.getByRole('combobox')
    await expect(input).toHaveAccessibleName(/search peptides/i)
    await expect(input).toHaveAttribute('spellcheck', 'false')
  })
})

test.describe('Home → Catalog navigation', () => {
  test('a query with zero peptide suggestions submits to Catalog on Enter', async ({ page }) => {
    const input = page.getByRole('combobox')
    const query = 'zzznotarealpeptide'

    // Guaranteed zero matches, so cmdk has nothing highlighted and our
    // onKeyDown guard (not cmdk's own selection) is what handles Enter here.
    await input.fill(query)
    await input.press('Enter')

    await expect(page).toHaveURL(new RegExp(`/catalog\\?q=${query}$`))
    await expect(page.getByText('No peptides match your search.')).toBeVisible()
  })

  test('clicking "Search catalog for…" navigates to Catalog even when suggestions exist', async ({ page }) => {
    const input = page.getByRole('combobox')

    // 'BPC' has a matching suggestion (BPC-157), so Enter would select it
    // instead — this exercises the click-driven path to Catalog instead.
    await input.fill('BPC')
    await page.getByRole('option', { name: /Search catalog for/i }).click()

    await expect(page).toHaveURL(/\/catalog\?q=BPC$/)
    // Wait for Home's cmdk popover to fully unmount before asserting on
    // Catalog content — otherwise a stale "BPC-157" suggestion item can
    // transiently coexist with the newly-rendered Catalog card (both
    // contain the same text) and make the exact-text query ambiguous.
    await expect(page.getByRole('combobox')).toHaveCount(0)
    await expect(page.getByText('BPC-157', { exact: true })).toBeVisible()
  })
})
