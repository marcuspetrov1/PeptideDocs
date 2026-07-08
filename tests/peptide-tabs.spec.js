import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('disclaimer_accepted', 'true')
  })
  await page.goto('peptides/bpc-157')
})

test.describe('Peptide Detail Tabs', () => {
  test('Overview tab is visible by default', async ({ page }) => {
    const overviewTab = page.getByRole('tab', { name: 'Overview' })
    await expect(overviewTab).toHaveAttribute('data-state', 'active')
  })

  test('Overview tab content is visible by default', async ({ page }) => {
    const overviewPanel = page.getByRole('tabpanel')
    await expect(overviewPanel).toBeVisible()
  })

  test('clicking Research tab shows Research content and hides Overview', async ({ page }) => {
    await page.getByRole('tab', { name: 'Research' }).click()
    const researchPanel = page.getByRole('tabpanel')
    await expect(researchPanel).toBeVisible()
    // Overview tab should no longer be active
    await expect(page.getByRole('tab', { name: 'Overview' })).toHaveAttribute('data-state', 'inactive')
  })

  test('Protocol tab contains the reconstitution calculator', async ({ page }) => {
    await page.getByRole('tab', { name: 'Protocol' }).click()
    await expect(page.getByText('Reconstitution Calculator')).toBeVisible()
  })

  test('Mechanism & Effects tab shows mechanism content', async ({ page }) => {
    await page.getByRole('tab', { name: /Mechanism/i }).click()
    const panel = page.getByRole('tabpanel')
    await expect(panel).toBeVisible()
    await expect(panel.getByText(/Mechanism/i).first()).toBeVisible()
  })
})
