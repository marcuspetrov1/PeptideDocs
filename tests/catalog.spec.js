import { test, expect } from '@playwright/test'

test('search filters the visible peptides', async ({ page }) => {
  await page.goto('catalog')
  const search = page.getByRole('searchbox', { name: 'Search peptides' })

  await search.fill('bpc-157')
  await expect(page.getByRole('heading', { level: 2, name: 'BPC-157' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: 'HCG' })).toHaveCount(0)
})

test('search with no matches shows the empty state', async ({ page }) => {
  await page.goto('catalog')
  await page.getByRole('searchbox', { name: 'Search peptides' }).fill('not-a-real-peptide-xyz')
  await expect(page.getByText('No peptides match your search.')).toBeVisible()
})

test('category filter narrows results and toggles off', async ({ page }) => {
  await page.goto('catalog')
  const group = page.getByRole('group', { name: 'Filter by category' })
  const allButton = group.getByRole('button', { name: 'All', exact: true })
  const hormonalButton = group.getByRole('button', { name: 'Hormonal', exact: true })

  await hormonalButton.click()
  await expect(page.getByRole('heading', { level: 2, name: 'HCG' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: 'BPC-157' })).toHaveCount(0)

  await hormonalButton.click()
  await expect(allButton).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: 'BPC-157' })).toBeVisible()
})
