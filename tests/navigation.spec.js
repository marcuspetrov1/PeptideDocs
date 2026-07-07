import { test, expect } from '@playwright/test'

test('home to catalog to a real detail page', async ({ page }) => {
  await page.goto('')
  await page.getByRole('link', { name: 'Browse Catalog' }).click()
  await expect(page).toHaveURL(/\/catalog$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Browse Peptides' })).toBeVisible()

  await page.getByRole('heading', { level: 2, name: 'BPC-157' }).click()
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
