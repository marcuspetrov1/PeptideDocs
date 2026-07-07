import { test, expect } from '@playwright/test'

test('invalid slug shows the not-found state', async ({ page }) => {
  await page.goto('peptides/not-a-real-peptide')
  await expect(page.getByRole('heading', { level: 1, name: 'Peptide not found' })).toBeVisible()
  await page.getByRole('link', { name: 'Back to catalog' }).click()
  await expect(page).toHaveURL(/\/catalog$/)
})

test('mg-based dose with a titration schedule renders both tables', async ({ page }) => {
  await page.goto('peptides/bpc-157')
  await expect(page.getByRole('heading', { level: 1, name: 'BPC-157' })).toBeVisible()

  // mg-based header: vial + bac water -> concentration, not a plain label
  await expect(page.getByText('10mg + 2mL bac water')).toBeVisible()
  await expect(page.getByText('5 mg/mL', { exact: true })).toBeVisible()

  await expect(page.getByText('Titration schedule')).toBeVisible()
  await expect(page.getByRole('table').first()).toBeVisible()
})

test('mg-based dose without a titration schedule omits the titration table', async ({ page }) => {
  await page.goto('peptides/glow')
  await expect(page.getByRole('heading', { level: 1, name: 'Glow Blend' })).toBeVisible()
  await expect(page.getByText('70mg + 3mL bac water')).toBeVisible()
  await expect(page.getByText('Titration schedule')).toHaveCount(0)
})

test('IU-based dose renders its label instead of a vial/concentration line', async ({ page }) => {
  await page.goto('peptides/hcg')
  await expect(page.getByRole('heading', { level: 1, name: 'HCG' })).toBeVisible()
  await expect(page.getByText('5000IU')).toBeVisible()
  await expect(page.getByText('250 IU')).toBeVisible()
})
