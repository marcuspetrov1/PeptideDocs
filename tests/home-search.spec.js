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
