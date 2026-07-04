# Prompt for Claude Code — integrate rewritten source material into the 19 existing peptides.json entries

Paste everything below into Claude Code in the OptimalPepInfo repo root.

---

## Context

`src/data/peptides.json` drives this React/Vite site (OptimalPepInfo). It has 19 existing catalog entries: `bpc-157`, `tb-500`, `glow`, `klow`, `ghk-cu`, `ipamorelin`, `cjc-ipamorelin`, `sermorelin`, `tesamorelin`, `semaglutide`, `tirzepatide`, `retatrutide`, `mots-c`, `nad-plus`, `glutathione`, `semax`, `selank`, `melanotan-2`, `pt-141`.

The `sources/` folder has just been refreshed with fact-checked material for these same 19 peptides, sourced from peptidedosages.com and rewritten in original wording (not copied verbatim — copyright reasons). Your job is to fold that material into `peptides.json` for these 19 entries only.

**Do not touch anything related to the 45 new peptides in `sources/scraped-data.json`** (5-Amino-1MQ, AOD-9604, Epitalon, etc.) — that's a separate, larger expansion tracked independently. This pass is scoped strictly to the 19 peptides already in the catalog.

## What's in `sources/` now

- Rewritten `.md` notes for all 19 peptides (informal style: reconstitution math, dosing tables, mechanism, benefits, timeline). Some peptides have multiple vial-size files that map to ONE catalog entry's `doses[]` array — not separate entries:
  - `sources/sema/sema20.md` → `semaglutide`
  - `sources/triz/triz20.md` and `sources/triz/triz30.md` → `tirzepatide` (two dose variants)
  - `sources/reta/reta15.md` and `sources/reta/reta30.md` → `retatrutide` (two dose variants)
  - `sources/sermorelin/serm10.md` → `sermorelin`
  - Everything else is a single file per slug: `bpc157.md`→`bpc-157`, `tb500.md`→`tb-500`, `ghk.md`→`ghk-cu`, `ipamorelin.md`→`ipamorelin`, `cjc.md`→`cjc-ipamorelin`, `tesa.md`→`tesamorelin`, `motc.md`→`mots-c`, `nad.md`→`nad-plus`, `glutathione.md`→`glutathione`, `semax.md`→`semax`, `selank.md`→`selank`, `mt2.md`→`melanotan-2`, `pt141.md`→`pt-141`, `glow.md`→`glow`, `klow.md`→`klow`.
  - `sources/wolverine.md` (BPC-157 + TB-500 blend) does **not** map to any catalog slug — it's reference material only. Leave it alone; do not create a new catalog entry for it unless asked.
- `sources/citations.json` — real citations (PubMed/PMC/ClinicalTrials.gov/FDA/clinical-reference links, no vendor/affiliate links) already keyed by the exact `peptides.json` slugs above. Format: `{ "<slug>": [{"text": "...", "url": "..."}, ...] }`.

## Task

For each of the 19 slugs:

1. **Update prose fields** (`overview`, `mechanism`, `effects`, `results_timeline`, `timing`, `administration`) in `peptides.json` to reflect the facts in the corresponding rewritten `.md` file(s), written as clean prose consistent with the existing schema style (see any current entry for tone/length). The `.md` files are the source of truth for facts now — the current JSON prose may be stale/informal and should be replaced, not merged.
2. **Do not change `doses[]` reconstitution numbers** — `vial_mg`, `bac_water_ml`, `concentration_mg_per_ml`, and `syringe_reference` were deliberately kept identical to what's already in `peptides.json` when the `.md` files were rewritten, so these should already match. Spot-check a few to confirm, but the dosing math itself shouldn't need edits.
3. **Populate `research_notes`** using `sources/citations.json` for that slug. Decide on a sensible string format (this field is currently `null` for most/all entries) — e.g. a short paragraph plus a references list, or plain markdown-style links. Before deciding, check how `research_notes` is actually rendered in the frontend (search for it in `src/pages/` or `src/components/`) so the formatting doesn't break the layout. If it's not rendered anywhere yet, flag that to me rather than silently adding a field nothing displays.
4. **Category should not change** for any of these 19 — they already have valid categories in `Catalog.jsx`'s `CATEGORY_ORDER`. Don't touch categories in this pass.

## Validation before you finish

- `peptides.json` must still be valid JSON (`node -e "JSON.parse(require('fs').readFileSync('src/data/peptides.json'))"` or equivalent).
- No duplicate or renamed slugs — still exactly the same 19 slugs as before, just with updated content.
- Run the dev server and visually spot-check 2-3 peptide detail pages (e.g. bpc-157, semaglutide, glow) to confirm nothing renders broken.
- Diff the file before/after and sanity-check that dosing numbers (`vial_mg`, `bac_water_ml`, `concentration_mg_per_ml`) are unchanged for all 19.

## Known open items (not this task, just context)

- `sources/scraped-data.json` has 45 net-new peptides staged and ready for a future, separate integration pass — leave untouched here.
- That staged data has a few known schema quirks flagged previously (HCG/HMG use IU-based fields instead of mg; Chonluten/Vilon have mixed numeric/string types in `titration`) — not relevant to this task, just noted so you don't confuse it with the 19 you're working on now.
