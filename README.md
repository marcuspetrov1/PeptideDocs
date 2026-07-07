# OptimalPepInfo

Informational catalog website for a peptide research business. Visitors can browse the peptide catalog, read per-peptide profiles (mechanism, dosing, effects, timeline, half-life), and find guidance on how to get started. The site is informational and inquiry-only — there are no transactions, purchases, or checkout flows.

Live at [optimalpepinfo.com](https://optimalpepinfo.com).

## Stack

- **Frontend**: React 19 + Vite, client-side routing via React Router
- **Styling**: Vanilla CSS
- **Content**: Local JSON data file (no external CMS/backend)
- **Testing**: Playwright (end-to-end smoke tests)
- **Linting**: ESLint
- **CI**: GitHub Actions — lint, validate peptide data, build, and run Playwright tests on every PR to `main`

## Repository structure

```
src/
  pages/         Home, Catalog, PeptideDetail, GetStarted
  components/    Header, Footer, Layout, DoseSelector, ReconstitutionPanel, etc.
  context/       Theme (light/dark) context
  data/
    peptides.json   Peptide catalog content (schema below)
    categories.js    Category definitions used across Home/Catalog
  config.js
scripts/
  validate-peptides.mjs   Validates peptides.json schema/integrity
tests/
  smoke.spec.js  Playwright smoke test
sources/         Reference/research notes per peptide (not shipped to the site)
docs/            Project plans and notes
```

### Peptide data schema

Each entry in `src/data/peptides.json` follows this shape:

| Field | Type | Notes |
|---|---|---|
| `slug` | text | URL-safe identifier used for routing, e.g. `bpc-157` |
| `name` | text | Display name, e.g. BPC-157 |
| `category` | text | e.g. recovery, fat-loss, cognitive, gh-secretagogue |
| `overview` | rich text | 2–3 sentence summary |
| `mechanism` | rich text | How it works |
| `dosage` | rich text | Dose range, frequency, cycle length |
| `effects` | rich text | What to expect |
| `results_timeline` | rich text | When effects are typically felt |
| `half_life` | text | e.g. ~4 hours |
| `available_sizes` | text | Informational only, e.g. 5mg / 10mg |
| `research_notes` | rich text | Optional, sourced notes |

Run `npm run validate` to check the data file against this schema (unique slugs, valid categories, required fields).

## Getting started

```bash
npm install
npm run dev        # start the dev server
```

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run validate` | Validate `src/data/peptides.json` |
| `npx playwright test` | Run Playwright smoke tests |

## Disclaimer

The site carries a research-chemical disclaimer in the footer and on every peptide detail page — this is required content, not optional copy.
