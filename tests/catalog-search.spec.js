import { test, expect } from '@playwright/test'

// Accept the disclaimer before each test so it doesn't block, same as catalog.spec.js
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('disclaimer_accepted', 'true')
  })
})

test('alias search: "body protection compound" surfaces BPC-157', async ({ page }) => {
  // BPC-157's aliases in src/data/peptides.json include "Body Protection
  // Compound" and "Body Protection Compound-157" — matchesQuery does a
  // case-insensitive substring match against the joined alias list.
  await page.goto('catalog?q=body%20protection%20compound')
  await expect(page.getByText('BPC-157', { exact: true })).toBeVisible()
})

test('content search: overview text surfaces TB-500 without matching its name', async ({ page }) => {
  // TB-500's overview describes it as "a synthetic fragment of Thymosin
  // Beta-4 (Tβ4)" — "Thymosin Beta-4" appears nowhere in TB-500's own name
  // and (confirmed against peptides.json) in no other peptide's name,
  // aliases, category label, or overview, so it's an unambiguous
  // content-only match.
  await page.goto('catalog')
  await page.getByRole('searchbox', { name: 'Search peptides' }).fill('Thymosin Beta-4')
  await expect(page.getByText('TB-500', { exact: true })).toBeVisible()
  await expect(page.getByText('HCG', { exact: true })).toHaveCount(0)
})

test('facet multi-select: two categories union, then a route facet narrows via AND', async ({ page }) => {
  await page.goto('catalog')
  const catGroup = page.getByRole('group', { name: 'Filter by category' })
  const routeGroup = page.getByRole('group', { name: 'Filter by route' })

  // Cognitive: Semax, Selank, Cerebrolysin, PE-22-28
  // Hormonal:  Gonadorelin, HCG, HMG, Kisspeptin, Oxytocin
  // (all confirmed in peptides.json) — selecting both categories is OR
  // within the "cat" group, so the union of both sets should be visible.
  await catGroup.getByRole('button', { name: 'Cognitive', exact: true }).click()
  await catGroup.getByRole('button', { name: 'Hormonal', exact: true }).click()

  await expect(page.getByText('Semax', { exact: true })).toBeVisible()
  await expect(page.getByText('Selank', { exact: true })).toBeVisible()
  await expect(page.getByText('Cerebrolysin', { exact: true })).toBeVisible()
  await expect(page.getByText('HCG', { exact: true })).toBeVisible()
  await expect(page.getByText('Oxytocin', { exact: true })).toBeVisible()
  // A peptide outside both selected categories (recovery) stays hidden.
  await expect(page.getByText('BPC-157', { exact: true })).toHaveCount(0)

  // Of that cognitive+hormonal union, only Semax and Selank list
  // "intranasal" in their route array (peptides.json) — every hormonal
  // peptide and the other two cognitive peptides are subcutaneous-only.
  // Adding the Intranasal route facet is AND-across-groups, so it should
  // narrow the union down to just those two.
  await routeGroup.getByRole('button', { name: 'Intranasal', exact: true }).click()

  await expect(page.getByText('Semax', { exact: true })).toBeVisible()
  await expect(page.getByText('Selank', { exact: true })).toBeVisible()
  await expect(page.getByText('Cerebrolysin', { exact: true })).toHaveCount(0)
  await expect(page.getByText('HCG', { exact: true })).toHaveCount(0)
})

test('URL round-trip: first paint respects all params, toggling a facet updates the URL', async ({ page }) => {
  // recovery ∪ beauty are all subcutaneous-only in peptides.json. "gastric
  // juice" appears only in BPC-157's overview (confirmed against the full
  // data set, not just this category pair) — GLOW/KLOW's overviews mention
  // "BPC-157" by name as an ingredient, so a plain 'bpc' query would
  // ambiguously match them too; "gastric juice" narrows to BPC-157 alone.
  await page.goto('catalog?q=gastric%20juice&cat=recovery,beauty&route=subcutaneous')

  await expect(page.getByText('BPC-157', { exact: true })).toBeVisible()
  await expect(page.getByText('TB-500', { exact: true })).toHaveCount(0)
  await expect(page.getByText('Glow Blend', { exact: true })).toHaveCount(0)

  const catGroup = page.getByRole('group', { name: 'Filter by category' })
  // Beauty is currently active (from the cat= param) — toggle it off.
  await catGroup.getByRole('button', { name: 'Beauty', exact: true }).click()

  // Its removal chip should disappear once the click's state update commits.
  await expect(page.getByRole('button', { name: 'Remove Beauty filter' })).toHaveCount(0)

  const url = new URL(page.url())
  expect(url.searchParams.get('q')).toBe('gastric juice')
  expect(url.searchParams.get('cat')).toBe('recovery')
  expect(url.searchParams.get('route')).toBe('subcutaneous')
  expect(url.searchParams.get('evidence')).toBeNull()
})

test('history hygiene: typing in the Catalog search box does not add history entries', async ({ page }) => {
  await page.goto('')
  await page.goto('catalog')

  const search = page.getByRole('searchbox', { name: 'Search peptides' })
  const lengthBeforeTyping = await page.evaluate(() => window.history.length)

  const query = 'bpc-157'
  // Use a human-plausible typing cadence: Catalog's search input is wired
  // directly to setSearchParams on every keystroke (no debounce), and
  // dispatching keys back-to-back with zero delay (pressSequentially's
  // default) can outrun a render/commit cycle and scramble characters —
  // not what this spec is testing. A per-key delay avoids that and keeps
  // the assertions focused on history (replace vs. push) semantics.
  await search.pressSequentially(query, { delay: 50 })
  await expect(search).toHaveValue(query)
  await expect(page.getByText('BPC-157', { exact: true })).toBeVisible()

  // Every keystroke updates the URL via setSearchParams(next, { replace:
  // true }) (Task 5), so the joint session history should not have grown —
  // each character replaces the previous entry instead of pushing a new one.
  const lengthAfterTyping = await page.evaluate(() => window.history.length)
  expect(lengthAfterTyping).toBe(lengthBeforeTyping)

  // One Back from Catalog should land directly on Home — not on
  // /catalog?q=<partial query> from an intermediate keystroke.
  await page.goBack()
  await expect(page).toHaveURL(/\/$/)
})
