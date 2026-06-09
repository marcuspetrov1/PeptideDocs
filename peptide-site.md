---
type: project
status: active
updated: 2026-06-08
---

# Peptide Information Site

Info/catalog website for the peptide business. Visitors can browse what's offered, read per-peptide info, and learn how to get started.

## Goal
Replace the Notes app workflow with a public-facing, professional catalog. No transactions — information and inquiry only.

## Stack
- **Frontend**: Vite + React
- **Styling**: Vanilla CSS (Premium, modern aesthetics)
- **CMS/Data**: Local JSON or Markdown files
- **Domain**: info.optimalpep.com
- **Legal copy**: Research chemical disclaimer (required)

---

## Phase 1 — Content & Schema ✅ Complete

### 1.1 Inventory your Notes ✅
### 1.2 Define the CMS schema ✅

Schema implemented in `src/data/peptides.json`:

| Field | Type | Notes |
|---|---|---|
| slug | Text | URL-safe identifier, e.g. `bpc-157` — used for routing |
| name | Text | Display name, e.g. BPC-157 |
| category | Text | e.g. recovery, fat loss, cognitive, GH secretagogue |
| overview | Rich text | 2–3 sentence summary |
| mechanism | Rich text | How it works |
| dosage | Rich text | Dose range, frequency, cycle length |
| effects | Rich text | What to expect |
| results_timeline | Rich text | When effects are typically felt |
| half_life | Text | e.g. ~4 hours |
| available_sizes | Text | Informational only — e.g. 5mg / 10mg |
| research_notes | Rich text | Optional — sourced notes |

### 1.3 Disclaimer copy
Goes in: site footer + bottom of every peptide detail page.

### 1.4 Contact/inquiry method
Leave as an empty placeholder on the page — will be added later.

---

## Phase 2 — Project Setup ✅ Complete

- Vite + React initialized
- React Router installed and configured
- CSS design tokens in `src/index.css`
- `src/config.js` with Shop URL constant

---

## Phase 3 — Build the Application ✅ Complete

All four pages built and routing configured:
- `/` → Homepage (`src/pages/Home.jsx`)
- `/catalog` → Catalog (`src/pages/Catalog.jsx`)
- `/peptides/:slug` → Peptide detail (`src/pages/PeptideDetail.jsx`)
- `/get-started` → How to Get Started (`src/pages/GetStarted.jsx`)

Header: site logo (left), Shop button (right).

---

## Phase 4 — Polish & Launch

### 4.1 Mobile & Responsive ✅
All views verified at mobile widths. Three breakpoints in every page CSS.

### 4.2 SEO basics ✅
`react-helmet-async` installed. Meta title + description set on all pages and per-peptide detail pages.

### 4.3 Light / Dark mode toggle
- [x] Theme stored in `localStorage`, falls back to `prefers-color-scheme`
- [x] `data-theme` attribute applied to `<html>` element
- [x] All dark-mode CSS converted from `@media (prefers-color-scheme: dark)` to `[data-theme="dark"]`
- [x] Sun/moon toggle button in header

### 4.4 Deployment
Deploy to **Vercel or Netlify** — both handle React Router's client-side routing natively. Connect domain: `info.optimalpep.com`

### 4.5 Publish
Share with a few people first for a gut check before wider distribution.

---

## Timeline summary

| Phase | What | Status |
|---|---|---|
| 1 | Content & schema | ✅ Done |
| 2 | Vite/React setup + data migration | ✅ Done |
| 3 | Build components & routing | ✅ Done |
| 4 | Polish + deploy | In progress |

---

---

## Phase 5 — Full Content Migration + Vial-Size Dose Selector

All source content lives in `/sources/`. Goal: migrate every peptide to a richer schema, add all missing entries, and add a per-vial-size dose selector on detail pages for peptides that come in multiple vial sizes.

---

### 5.1 Revised Schema

The current flat schema does not support per-vial dosing math. The new schema promotes reconstitution data into a `doses[]` array on each peptide. Peptides with one vial size have a single-element array (no UI dropdown shown). Peptides with multiple vial sizes get a dropdown next to the name on the detail page.

**Shared fields** (same regardless of vial size selected):

| Field | Type | Notes |
|---|---|---|
| `slug` | string | URL key |
| `name` | string | Display name |
| `category` | string | `fat-loss`, `recovery`, `cognitive`, `metabolic`, `beauty`, `sexual-health` |
| `overview` | string | 2–3 sentence summary |
| `mechanism` | string | How it works |
| `effects` | string | What to expect |
| `results_timeline` | string | When effects typically appear |
| `half_life` | string | e.g. `~4 hours` |
| `timing` | string | When/how to inject — timing guidance |
| `administration` | string | `Subcutaneous`, `Intranasal`, `Subcutaneous or intranasal` |
| `research_notes` | string \| null | Optional notes |

**Per-dose fields** — inside each `doses[]` entry (change when dropdown selection changes):

| Field | Type | Notes |
|---|---|---|
| `label` | string | Dropdown display text, e.g. `20mg` |
| `vial_mg` | number | Vial size in mg |
| `bac_water_ml` | number | Reconstitution volume in mL |
| `concentration_mg_per_ml` | number | Resulting concentration |
| `syringe_reference` | `{ units, mg }[]` | Lookup table: units on syringe → dose in mg |
| `dosage_text` | string | Human-readable protocol for this vial size, unit-accurate |
| `titration` | `{ weeks, dose_mg, units }[]` \| null | Week-by-week ramp for GLP-1 class; null otherwise |

**Removed fields:** `available_sizes` (replaced by `doses[].label`) and top-level `dosage` (replaced by `doses[].dosage_text`).

---

### 5.2 Peptide inventory from sources

**Multi-dose peptides** (need the dropdown — multiple source files per peptide):

| Peptide | Vial sizes | Source files |
|---|---|---|
| Retatrutide | 15mg, 30mg | `reta/reta15.md`, `reta/reta30.md` |
| Tirzepatide | 20mg, 30mg | `triz/triz20.md`, `triz/triz30.md` |

**Single-dose peptides** (one entry in `doses[]`, no dropdown):

| Peptide | Vial size | Source file |
|---|---|---|
| Semaglutide | 20mg | `sema/sema20.md` |
| Sermorelin | 10mg | `sermorelin/serm10.md` |
| Ipamorelin | 10mg | `ipamorelin.md` |
| CJC-1295 + Ipamorelin | 10mg (5+5 blend) | `cjc.md` |
| Tesamorelin | 10mg | `tesa.md` |
| MOTS-c | 10mg | `motc.md` |
| GHK-Cu | 100mg | `ghk.md` |
| Melanotan II (MT-2) | 10mg | `mt2.md` |
| NAD+ | 1000mg | `nad.md` |
| Glutathione | 1500mg | `nad.md` (combined file) |
| PT-141 | 10mg | `pt141.md` |
| Selank | 10mg | `selank.md` |
| Semax | 10mg | `semax.md` |
| Glow Blend | 70mg | `glow.md` |
| KLOW Blend | 80mg | `klow.md` |

**Carry-forward from existing JSON** (need schema migration):
- BPC-157 — update to new schema (single dose entry)
- TB-500 — update to new schema (single dose entry)

Total peptides after migration: ~19 entries.

---

### 5.3 Data migration

Rewrite `src/data/peptides.json` with the new schema. For each peptide:

1. Populate shared fields from source content (overview, mechanism, effects, results_timeline, half_life, timing, administration)
2. Build the `doses[]` array — one entry per vial size
3. For each dose entry: transcribe the syringe reference table and dosage protocol from the source file, with unit values accurate to that vial's concentration
4. Add `titration[]` for GLP-1 class (Semaglutide, Retatrutide, Tirzepatide)

---

### 5.4 UI — Vial-size dropdown on PeptideDetail

**Location:** Inline with the peptide name — a small styled `<select>` rendered to the right of the `<h1>`, only when `doses.length > 1`.

**Behavior:**
- Default selection: `doses[0]` (first/smallest vial)
- On change: `selectedDoseIdx` state updates → `ReconstitutionPanel` re-renders with new concentration, syringe table, and dosage text
- All other content (overview, mechanism, effects, timeline) is unaffected

**New page layout after this phase:**

```
[Category chip]
[Peptide Name]  [Vial selector dropdown — only if multi-dose]

Overview text

Info table (static rows):
  Mechanism | ...
  Effects   | ...
  Results   | ...
  Half-Life | ...
  Timing    | ...
  Admin.    | ...

Reconstitution panel (updates on dropdown change):
  [Vial: 20mg + 2mL → 10 mg/mL]
  Syringe reference table  (units | dose)
  Dosage protocol          (text + optional titration table)

Disclaimer
CTA
```

---

### 5.5 New component files

**`src/components/DoseSelector.jsx`**
- Renders a `<select>` (or custom styled button group for 2 options) next to the peptide name
- Props: `doses`, `selectedIdx`, `onChange`
- Styled as a compact pill/chip consistent with existing accent chips

**`src/components/ReconstitutionPanel.jsx`**
- Receives the active `dose` object from the parent
- Renders:
  - Reconstitution line: `[vial_mg]mg + [bac_water_ml]mL → [concentration_mg_per_ml] mg/mL`
  - Syringe reference: two-column table (Units | Dose)
  - Dosage: `dosage_text` paragraph + `titration` table if present
- Replaces the current `dosage` and `available_sizes` rows in the info table

**`src/pages/PeptideDetail.jsx` updates:**
- Add `const [selectedDoseIdx, setSelectedDoseIdx] = useState(0)`
- Derive `const activeDose = peptide.doses[selectedDoseIdx]`
- Render `<DoseSelector>` conditionally (only if `doses.length > 1`)
- Remove `dosage` and `available_sizes` from `INFO_ROWS`
- Add `timing` and `administration` to `INFO_ROWS`
- Render `<ReconstitutionPanel dose={activeDose} />` below the info table

**`src/pages/PeptideDetail.css` updates:**
- `.peptide-detail__name-row` — flex row for name + selector
- `.peptide-detail__recon` — reconstitution panel card styles
- `.peptide-detail__syringe-table` — two-column units/dose table
- `.peptide-detail__titration` — titration schedule table

---

## Open decisions

- [x] Domain — subdomain of existing site (`info.optimalpep.com`)
- [x] CTA — "Shop" button in header linking to existing sales site
- [x] Tech stack — Vite + React + Vanilla CSS
- [ ] Disclaimer copy — copy from optimalpep.com and paste into §1.3
- [ ] Contact/inquiry method — placeholder on page, to be filled in later
- [ ] Deployment — Vercel or Netlify (Phase 4.4)

## Notes
