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

## Phase 1 — Content & Schema (Days 1–2)

Before touching code, define and prep the content. This is the foundation everything else builds on.

### 1.1 Inventory your Notes
- List every peptide currently in the Notes app
- Note which ones have complete info vs. gaps
- Group by category (e.g. fat loss, recovery, cognitive, GH secretagogues)

### 1.2 Define the CMS schema
Every peptide entry needs consistent fields. Proposed schema:

~34 Notes entries → ~20–25 unique peptides once vial size variants are consolidated. Vial sizes are product variants, not separate entries.

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

Disclaimer is sitewide (footer + peptide page bottom) — not a per-entry field.

Trim or add fields based on what's actually in your Notes. Don't add fields you won't fill.

### 1.3 Disclaimer copy

Copy from optimalpep.com. Paste below when ready:

---

*(paste disclaimer here)*

---

Goes in: site footer + bottom of every peptide detail page.

### 1.4 Contact/inquiry method

Leave as an empty placeholder on the page — will be added later. Build the "How to Get Started" page with the space reserved.

---

## Phase 2 — Project Setup (Days 2–3)

### 2.1 Initialize Web App
- Run `npm create vite@latest . -- --template react` from the project root (not inside `/src`)
- Install React Router: `npm install react-router-dom`
- Set up Vanilla CSS with a global `index.css` for design tokens (colors, fonts, animations)
- Define the premium aesthetic (glassmorphism, dark mode, smooth transitions)
- Add a `src/config.js` with the Shop/Order URL as a single constant — used in the header CTA

### 2.2 Build the Local CMS Data Structure
- Create `src/data/peptides.json`
- Add all fields from the schema, including `slug` and `category`
- Create 2–3 test entries with real content to validate routing and layout before migrating everything

### 2.3 Migrate Notes content
- Go peptide by peptide, fill in the local data structure
- Don't worry about perfect copy — get it in, refine later
- This is the most time-consuming step (~1–2 hours depending on volume)

---

## Phase 3 — Build the Application (Days 3–5)

Four pages total. Build in this order — each one is simpler if the previous exists.

All pages share a consistent header: site name/logo (left) and a "Shop" or "Order" button (right) linking to the existing sales site. The URL comes from `src/config.js`. This is the only navigation element needed.

Set up React Router in `main.jsx` with these routes before building any page:
- `/` → Homepage
- `/catalog` → Catalog
- `/peptides/:slug` → Peptide detail
- `/get-started` → How to Get Started

### 3.1 Peptide detail view (`src/pages/PeptideDetail.jsx`)
Build this first because it's the most important page and everything links to it.
- Read `:slug` from the URL param, look up the matching entry in `peptides.json`
- Sections: name/category header, overview, mechanism, dosage, effects, results timeline
- Disclaimer block at bottom
- "How to get started" CTA

### 3.2 Catalog view
- Alphabetical grid or list of all peptides, mapped from the data structure
- Each card → links to `/peptides/:slug`
- Keep it clean — name and one-line overview only
- Optional: filter by `category` if the list warrants it

### 3.3 Homepage
- Hero: what the site is, who it's for, clear CTA to catalog
- Section: categories / what's offered (pulled from data or manual)
- Section: how it works / how to get started (brief)
- Footer with disclaimer

### 3.4 How to Get Started page
- Standalone page explaining the process: browse → pick → [placeholder — contact method to be added later]
- FAQ section if needed
- Clear, non-medical language

---

## Phase 4 — Polish & Launch (Days 5–7)

### 4.1 Mobile & Responsive Check
Verify every view at mobile widths before deploying. React Router + CSS handles this but always confirm manually.

### 4.2 SEO basics
Use `react-helmet-async` (not `react-helmet`, which is unmaintained) to set meta title + description per peptide entry and per page. Install with `npm install react-helmet-async`.

### 4.3 Deployment
Deploy to **Vercel or Netlify** — both handle React Router's client-side routing natively with no extra config. GitHub Pages requires a `404.html` workaround for SPA routing and is not recommended here.

Connect the custom domain: `info.optimalpep.com`

### 4.4 Publish
Share with a few people first for a gut check before wider distribution.

---

## Timeline summary

| Phase | What | Time estimate |
|---|---|---|
| 1 | Content & schema | Days 1–2 |
| 2 | Vite/React setup + data migration | Days 2–3 |
| 3 | Build components & routing | Days 3–5 |
| 4 | Polish + deploy | Days 5–7 |

Realistic total: **1 focused week** if you block time for it. Stretched across evenings: 2–3 weeks.

---

## Open decisions

- [x] Domain — subdomain of existing site (`info.optimalpep.com`)
- [x] CTA — "Shop" button in header linking to existing sales site
- [x] Tech stack — Vite + React + Vanilla CSS
- [ ] Disclaimer copy — copy from optimalpep.com and paste into §1.3
- [ ] Contact/inquiry method — placeholder on page, to be filled in later

## Notes
