import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('disclaimer_accepted', 'true')
  })
  await page.goto('peptides/bpc-157')
})

test.describe('Glossary Tooltips', () => {
  test('hovering the Protocol tab trigger shows a tooltip', async ({ page }) => {
    // The "Protocol" tab uses GlossaryTerm for "Reconstitution"
    const protocolTab = page.getByRole('tab', { name: 'Protocol' })
    await protocolTab.hover()
    // Tooltip should appear within 1s (delayDuration=300ms)
    const tooltip = page.getByRole('tooltip')
    await expect(tooltip).toBeVisible({ timeout: 1500 })
  })

  test('moving away from the term hides the tooltip', async ({ page }) => {
    const protocolTab = page.getByRole('tab', { name: 'Protocol' })
    await protocolTab.hover()
    await expect(page.getByRole('tooltip')).toBeVisible({ timeout: 1500 })
    // Move away
    await page.keyboard.press('Escape')
    await expect(page.getByRole('tooltip')).toBeHidden()
  })
})
