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
  // Use a human-plausible typing cadence. The search input's displayed value
  // is local state updated synchronously per keystroke, so it can't scramble
  // regardless of cadence — the per-key delay here is just realism, not a
  // workaround. The URL push itself is debounced (~200ms after the last
  // keystroke), so this cadence (50ms/key) never lets the debounce fire
  // mid-typing; only one setSearchParams call happens, after typing stops.
  await search.pressSequentially(query, { delay: 50 })
  await expect(search).toHaveValue(query)
  await expect(page.getByText('BPC-157', { exact: true })).toBeVisible()

  // Wait for the debounced URL push to actually land before measuring
  // history — otherwise this assertion could trivially pass just because
  // the push hasn't happened yet, rather than because `replace: true` keeps
  // history flat.
  await expect.poll(() => new URL(page.url()).searchParams.get('q')).toBe(query)

  // The single debounced push updates the URL via setSearchParams(next,
  // { replace: true }), so the joint session history should not have
  // grown — it replaces the previous entry instead of pushing a new one.
  const lengthAfterTyping = await page.evaluate(() => window.history.length)
  expect(lengthAfterTyping).toBe(lengthBeforeTyping)

  // One Back from Catalog should land directly on Home — not on
  // /catalog?q=<partial query> from an intermediate keystroke.
  await page.goBack()
  await expect(page).toHaveURL(/\/$/)
})

test('fast typing does not scramble the search input (out-of-order URL commit race)', async ({ page }) => {
  // Regression test for a race where the search box was fully controlled by
  // `q` (parsed straight from useSearchParams) with no local state buffer.
  // Dispatching keystrokes faster than React Router's async setSearchParams
  // render/commit cycle could settle out of order and snap the input back to
  // a stale, shorter string mid-typing. Typing "bpc-157" with zero delay
  // between keystrokes deterministically reproduced this before the fix
  // (final value observed as "7", having cycled through out-of-order commits
  // like q=b -> q=p -> q=pc -> q=p- -> q=p1 -> q=p5 -> q=p7).
  //
  // The fix: the input is bound only to local state (`localQuery`), updated
  // synchronously on every keystroke with zero async involvement, so the
  // display can never be clobbered by a URL commit. The URL push itself is
  // debounced (~200ms after the last keystroke), so at most one
  // setSearchParams call is ever in flight for the query — there's no queue
  // of same-field updates left to land out of order. That means the URL
  // update now trails the input by roughly the debounce delay, so we poll
  // for it instead of asserting it synchronously.
  await page.goto('catalog')
  const search = page.getByRole('searchbox', { name: 'Search peptides' })

  await search.pressSequentially('bpc-157', { delay: 0 })

  await expect(search).toHaveValue('bpc-157')
  await expect.poll(() => new URL(page.url()).searchParams.get('q')).toBe('bpc-157')
})

test('fast typing burst followed by an immediate external q change (Clear all) updates the display correctly', async ({ page }) => {
  // Regression test for a failure mode introduced by an earlier, since-
  // reverted fix attempt: that version tracked "edits with a pending
  // setSearchParams commit" via a plain counter (incremented per keystroke,
  // decremented per commit) to distinguish the URL echoing back our own
  // typing from a genuine external change. Because React Router wraps
  // setSearchParams commits in React.startTransition (interruptible), a fast
  // burst of N keystrokes can coalesce into far fewer than N committed
  // renders, so the counter is incremented N times but decremented only a
  // handful — leaving a positive residual after the burst. That residual
  // then caused the NEXT genuine external `q` change (Back/Forward, chip
  // removal, Clear all) to be silently swallowed by the sync effect, so the
  // search box kept showing stale typed text instead of reflecting the
  // real change.
  //
  // This uses "Clear all" rather than Back to trigger the external change:
  // every URL update in this component (typing, facet toggles, Clear all)
  // uses `{ replace: true }`, so Back from Catalog exits the component
  // entirely (see the "history hygiene" test) rather than changing `q`
  // while the component stays mounted — it wouldn't exercise the in-place
  // sync/cancel path this regression is about. Clear all does, and is one
  // of the external actions the task calls out explicitly.
  //
  // The debounce-based fix has no counter: it re-syncs `localQuery` from
  // `q` on every external change and cancels any in-flight debounce timer
  // at that point, so a burst-then-external-change sequence can't leave the
  // display stuck on stale text.
  // Start with a non-empty `q` already in the URL, so that Clear all causes
  // a genuine, detectable *value change* to `q` ('xyz' -> gone). If `q`
  // started empty and the debounce never got a chance to push the typed
  // burst, Clear all wouldn't actually change `q`'s value (it was already
  // empty), which would exercise a different, pre-existing "nothing to
  // resync because q never moved" case rather than the regression this test
  // targets — so the setup deliberately avoids that.
  await page.goto('catalog?q=xyz&cat=recovery')
  const search = page.getByRole('searchbox', { name: 'Search peptides' })
  await expect(search).toHaveValue('xyz')
  await expect(page.getByRole('button', { name: 'Remove Recovery filter' })).toBeVisible()

  // Fast burst replacing the existing text — select all first so the burst
  // overwrites "xyz" rather than appending to it.
  await search.click()
  await search.press('ControlOrMeta+A')
  await search.pressSequentially('bpc-157', { delay: 0 })
  await expect(search).toHaveValue('bpc-157')

  // Immediately perform a genuine external q-change — before the ~200ms
  // debounce has a chance to elapse.
  await page.getByRole('button', { name: 'Clear all', exact: true }).click()

  // The search box must reflect the external Clear all action, not get
  // stuck showing the just-typed "bpc-157".
  await expect(search).toHaveValue('')
  await expect(page.getByRole('button', { name: 'Remove Recovery filter' })).toHaveCount(0)

  // Give the cancelled debounce timer's original delay window time to
  // elapse, to confirm the stale push never lands and re-adds `q`/`cat` to
  // the URL after Clear all already ran.
  await page.waitForTimeout(300)
  await expect(search).toHaveValue('')
  const url = new URL(page.url())
  expect(url.searchParams.get('q')).toBeNull()
  expect(url.searchParams.get('cat')).toBeNull()
})
