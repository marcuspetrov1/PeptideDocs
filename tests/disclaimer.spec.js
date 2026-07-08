import { test, expect } from '@playwright/test'

test.describe('Legal Disclaimer Dialog', () => {
  test.beforeEach(async ({ page }) => {
    // Clear storage so the dialog always appears
    await page.context().clearCookies()
    await page.goto('')
    await page.evaluate(() => localStorage.clear())
    await page.goto('')
  })

  test('dialog blocks the screen on fresh visit', async ({ page }) => {
    const dialog = page.getByRole('alertdialog')
    await expect(dialog).toBeVisible()
    const heading = dialog.getByRole('heading')
    await expect(heading).toContainText('Research Use Only')
  })

  test('pressing Escape does not dismiss the dialog', async ({ page }) => {
    const dialog = page.getByRole('alertdialog')
    await expect(dialog).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(dialog).toBeVisible()
  })

  test('clicking "I Understand and Agree" closes the dialog', async ({ page }) => {
    const dialog = page.getByRole('alertdialog')
    await expect(dialog).toBeVisible()
    await page.getByRole('button', { name: 'I Understand and Agree' }).click()
    await expect(dialog).toBeHidden()
  })

  test('dialog does not reappear after acceptance on reload', async ({ page }) => {
    await page.getByRole('button', { name: 'I Understand and Agree' }).click()
    await page.reload()
    const dialog = page.getByRole('alertdialog')
    await expect(dialog).toBeHidden()
  })
})
