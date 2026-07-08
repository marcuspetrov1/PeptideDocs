import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('disclaimer_accepted', 'true')
  })
})

test.describe('Breadcrumb Navigation', () => {
  test('no breadcrumbs on home page', async ({ page }) => {
    await page.goto('')
    // On home, SiteBreadcrumbs returns null — nav element is absent
    await expect(page.getByRole('navigation', { name: 'breadcrumb' })).toHaveCount(0)
  })

  test('breadcrumbs show Home › Catalog on /catalog', async ({ page }) => {
    await page.goto('catalog')
    const nav = page.getByRole('navigation', { name: 'breadcrumb' })
    await expect(nav).toBeVisible()
    await expect(nav).toContainText('Home')
    await expect(nav).toContainText('Catalog')
  })

  test('breadcrumbs show Home › Get Started on /get-started', async ({ page }) => {
    await page.goto('get-started')
    const nav = page.getByRole('navigation', { name: 'breadcrumb' })
    await expect(nav).toBeVisible()
    await expect(nav).toContainText('Get Started')
  })

  test('peptide detail breadcrumbs show category › name', async ({ page }) => {
    await page.goto('peptides/bpc-157')
    const nav = page.getByRole('navigation', { name: 'breadcrumb' })
    await expect(nav).toBeVisible()
    await expect(nav).toContainText('Home')
    await expect(nav).toContainText('BPC-157')
  })

  test('category breadcrumb links to /catalog', async ({ page }) => {
    await page.goto('peptides/bpc-157')
    const nav = page.getByRole('navigation', { name: 'breadcrumb' })
    // The category crumb is the link between Home and the leaf (BPC-157)
    // It links to /catalog
    const links = nav.getByRole('link')
    // links: [Home, Category]
    const catLink = links.nth(1)
    await catLink.click()
    await expect(page).toHaveURL(/\/catalog/)
  })

  test('leaf breadcrumb (peptide name) is not a link', async ({ page }) => {
    await page.goto('peptides/bpc-157')
    const nav = page.getByRole('navigation', { name: 'breadcrumb' })
    // BreadcrumbPage renders a span with aria-current="page"
    const leaf = nav.locator('[aria-current="page"]')
    await expect(leaf).toBeVisible()
    await expect(leaf).toContainText('BPC-157')
  })
})
