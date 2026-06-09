# OptimalPep UI Audit Fixes — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Address the 11 priority issues from the 2026-06-08 UI audit to lift the site from a solid CSS redesign into a premium, credible peptide reference that converts visitors.

**Architecture:** CSS-only changes for token, grid, and animation tasks; minimal JSX changes for the hero restructure, emoji replacement, and placeholder content. No new dependencies. All changes are file-local — no shared components added or restructured.

**Tech Stack:** React + Vite, plain CSS with component-scoped files, CSS custom properties for the design token system.

---

### Task 1: Add `--warning` design token and fix root `text-align`

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Add `--warning` token and fix `text-align` on `#root`**

Replace the full `:root` block and `#root` block in `src/index.css`:

```css
:root {
  --text: #6b5e52;
  --text-h: #1a1410;
  --bg: #faf8f4;
  --border: #e8e3da;
  --code-bg: #f0ece2;
  --accent: #1a4a3a;
  --accent-bg: rgba(26, 74, 58, 0.07);
  --accent-border: rgba(26, 74, 58, 0.25);
  --warning: #f59e0b;
  --social-bg: rgba(240, 236, 226, 0.5);
  --shadow:
    rgba(26, 74, 58, 0.1) 0 10px 15px -3px,
    rgba(0, 0, 0, 0.04) 0 4px 6px -2px;

  --sans: 'DM Sans', system-ui, sans-serif;
  --heading: 'DM Serif Display', Georgia, serif;
  --mono: 'JetBrains Mono', ui-monospace, Consolas, monospace;

  font: 18px/145% var(--sans);
  letter-spacing: 0.18px;
  color-scheme: light dark;
  color: var(--text);
  background: var(--bg);
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  @media (max-width: 1024px) {
    font-size: 16px;
  }
}
```

```css
#root {
  width: 1126px;
  max-width: 100%;
  margin: 0 auto;
  text-align: left;
  border-inline: 1px solid var(--border);
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
```

- [ ] **Step 2: Run dev server and verify no layout regressions**

```bash
npm run dev
```

Open http://localhost:5173. Check Home, Catalog, PeptideDetail, and GetStarted. All pages already override `text-align: left` explicitly, so this should produce no visible change — it's a safe default cleanup.

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "feat: add --warning token, set text-align left as root default"
```

---

### Task 2: Apply DM Serif Display to Home section headings

**Files:**
- Modify: `src/pages/Home.css`

The global `h2` rule uses `var(--sans)` because DM Serif Display has no bold weight. The "What we carry" and "How to get started" section headings should use the serif at `font-weight: 400` to match the editorial register of the h1 — the mix of sans-serif h2 under serif h1 reads as unresolved.

- [ ] **Step 1: Replace `.home__section-heading` in `src/pages/Home.css`**

```css
.home__section-heading {
  font-family: var(--heading);
  font-size: 30px;
  font-weight: 400;
  letter-spacing: -0.5px;
  color: var(--text-h);
  margin: 0 0 8px;
}

@media (max-width: 1024px) {
  .home__section-heading {
    font-size: 24px;
  }
}
```

- [ ] **Step 2: Verify visually**

At http://localhost:5173, the "What we carry" and "How to get started" headings should now render in DM Serif Display — thin, editorial serif weight, visually consistent with the h1 above them.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Home.css
git commit -m "feat: apply DM Serif Display to home section headings"
```

---

### Task 3: Home steps — drop ghost glass, use explicit card style

**Files:**
- Modify: `src/pages/Home.jsx`
- Modify: `src/pages/Home.css`

The `glass` class applies `backdrop-filter: blur(10px)` over a flat background — the blur composites nothing and adds a GPU layer with no visual payoff. Replace with an explicit card style.

- [ ] **Step 1: Remove `glass` from step cards in `src/pages/Home.jsx`**

Line 110 — change:
```jsx
<div key={step.number} className="home__step glass">
```
to:
```jsx
<div key={step.number} className="home__step">
```

- [ ] **Step 2: Add explicit card style to `.home__step` in `src/pages/Home.css`**

Replace the existing `.home__step` rule:

```css
.home__step {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 28px 24px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 12px;
}

[data-theme="dark"] .home__step {
  background: rgba(255, 255, 255, 0.03);
}
```

- [ ] **Step 3: Verify visually**

The three step cards should look identical to before (same border, same rounding) but without the composited blur layer. Toggle dark mode to confirm the dark variant renders correctly.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Home.jsx src/pages/Home.css
git commit -m "fix: replace ghost glass blur on home steps with explicit card style"
```

---

### Task 4: Hero split-screen layout + editorial italic

**Files:**
- Modify: `src/pages/Home.jsx`
- Modify: `src/pages/Home.css`

`src/assets/hero.png` exists but is unused. This task places it in the right half of an asymmetric split-screen hero. The h1 gains an `<em>` italic accent using the already-loaded DM Serif Display Italic variant.

- [ ] **Step 1: Add import and image column to `src/pages/Home.jsx`**

Add the import at the top of the file (after the existing imports, before `'./Home.css'`):

```jsx
import heroImg from '../assets/hero.png'
```

Add `<em>` to the h1 (line ~63):

```jsx
<h1 className="home__hero-heading">
  Your <em>peptide</em><br />
  reference guide
</h1>
```

Add the image column immediately after the closing `</div>` of `.home__hero-inner` (line ~79):

```jsx
<div className="home__hero-image" aria-hidden="true">
  <img src={heroImg} alt="" />
</div>
```

The hero `<section>` should now contain two children: `.home__hero-inner` and `.home__hero-image`.

- [ ] **Step 2: Restructure `.home__hero` in `src/pages/Home.css`**

Replace the entire `.home__hero` block and all its existing breakpoints, then add `.home__hero-inner` overrides and new `.home__hero-image` rules:

```css
/* ── Hero ── */
.home__hero {
  min-height: 70vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: stretch;
  background: linear-gradient(160deg, var(--bg) 0%, var(--code-bg) 55%, var(--bg) 100%);
  border-bottom: 1px solid var(--border);
  position: relative;
  overflow: hidden;
}

/* grain texture overlay */
.home__hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 0;
}

@media (max-width: 1024px) {
  .home__hero {
    grid-template-columns: 1fr;
    min-height: 60vh;
  }
}

.home__hero-inner {
  max-width: none;
  padding: calc(56px + 3rem) 32px 4rem;
  position: relative;
  z-index: 1;
  box-sizing: border-box;
}

@media (max-width: 1024px) {
  .home__hero-inner {
    padding: calc(56px + 2rem) 24px 3rem;
  }
}

@media (max-width: 600px) {
  .home__hero-inner {
    padding: calc(56px + 1.5rem) 16px 2.5rem;
  }
}

/* ── Image column ── */
.home__hero-image {
  position: relative;
  overflow: hidden;
}

/* fades the image edge into the hero background */
.home__hero-image::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, var(--bg) 0%, transparent 35%);
  pointer-events: none;
  z-index: 1;
}

.home__hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  opacity: 0.88;
}

@media (max-width: 1024px) {
  .home__hero-image {
    display: none;
  }
}
```

- [ ] **Step 3: Add italic style for the `<em>` in `src/pages/Home.css`**

Add after the `.home__hero-heading` block:

```css
.home__hero-heading em {
  font-style: italic;
}
```

- [ ] **Step 4: Verify visually**

At http://localhost:5173:
- **Desktop (≥1024px):** hero shows text content on the left, the hero image on the right with a left-edge gradient blending it into the background. The word "peptide" in the h1 renders in DM Serif Display Italic.
- **Mobile/tablet (<1024px):** single-column, image hidden, text fills the width.

Toggle dark mode and confirm the gradient overlay (`var(--bg)` is dark) blends correctly.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Home.jsx src/pages/Home.css
git commit -m "feat: hero split-screen with image, add italic accent to h1"
```

---

### Task 5: Catalog grid — break the 3-equal-column pattern

**Files:**
- Modify: `src/pages/Catalog.css`

Replace `repeat(3, 1fr)` with an asymmetric `3fr 2fr` 2-column layout. Each card gets more horizontal space for the overview text, and the unequal columns create visual variety. No JSX changes needed — the grid reflows for any number of filtered results.

- [ ] **Step 1: Replace `.catalog__grid` and its breakpoints in `src/pages/Catalog.css`**

```css
.catalog__grid {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 20px;
}

@media (max-width: 900px) {
  .catalog__grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 560px) {
  .catalog__grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }
}
```

- [ ] **Step 2: Verify visually**

At http://localhost:5173/catalog:
- **Desktop:** 2 columns, left ~60% width, right ~40%. Cards have more horizontal space than before.
- **Tablet:** 2 equal columns.
- **Mobile:** single column.
- Apply a category filter and confirm the grid reflows correctly for fewer results. Search to a 0-result state and confirm the empty state message still shows.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Catalog.css
git commit -m "feat: replace 3-col equal catalog grid with asymmetric 2-col layout"
```

---

### Task 6: Catalog card entrance animation

**Files:**
- Modify: `src/pages/Catalog.css`

The `@keyframes fadeUp` is already defined in `src/index.css` and used by the hero section. Apply it to catalog cards with staggered delays on the first 6. Add the `prefers-reduced-motion` override to match the pattern already used by the hero.

- [ ] **Step 1: Add animation to `.catalog__card` in `src/pages/Catalog.css`**

In the existing `.catalog__card` rule, add the `animation` property:

```css
.catalog__card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px 22px 22px;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  animation: fadeUp 0.4s ease both;
}
```

After the `.catalog__card` block, add the stagger delays and the reduced-motion override:

```css
.catalog__card:nth-child(2) { animation-delay: 60ms; }
.catalog__card:nth-child(3) { animation-delay: 120ms; }
.catalog__card:nth-child(4) { animation-delay: 180ms; }
.catalog__card:nth-child(5) { animation-delay: 240ms; }
.catalog__card:nth-child(6) { animation-delay: 300ms; }

@media (prefers-reduced-motion: reduce) {
  .catalog__card {
    animation: none;
  }
}
```

Cards 7 and beyond animate at `animation-delay: 0ms` (the default) — they all appear at once below the staggered initial burst, which is acceptable since they're below the fold on most viewports.

- [ ] **Step 2: Verify visually**

At http://localhost:5173/catalog, do a hard-refresh (Cmd+Shift+R). The first 6 cards should fade up sequentially. Navigate to Home and back to Catalog — the animation should fire again on mount.

Apply a category filter. The remaining cards should animate in on each filter change.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Catalog.css
git commit -m "feat: staggered fadeUp entrance animation on catalog cards"
```

---

### Task 7: PeptideDetail — emoji, disclaimer text, CTA alignment, token fix

**Files:**
- Modify: `src/pages/PeptideDetail.jsx`
- Modify: `src/pages/PeptideDetail.css`

Four related fixes in one component:
1. Replace `⚠` emoji with an inline SVG warning icon
2. Write the actual disclaimer text (currently placeholder)
3. Left-align the bottom CTA and change its link target from `/get-started` (internal) to the shop (conversion path)
4. Replace hardcoded `#f59e0b` with `var(--warning)` from Task 1

- [ ] **Step 1: Replace `src/pages/PeptideDetail.jsx`**

```jsx
import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import peptides from '../data/peptides.json'
import { SHOP_URL } from '../config.js'
import DoseSelector from '../components/DoseSelector.jsx'
import ReconstitutionPanel from '../components/ReconstitutionPanel.jsx'
import './PeptideDetail.css'

function WarningIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ flexShrink: 0, marginTop: '1px' }}
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

const INFO_ROWS = [
  { key: 'mechanism',        label: 'Mechanism'      },
  { key: 'effects',          label: 'Effects'        },
  { key: 'results_timeline', label: 'Results'        },
  { key: 'timing',           label: 'Timing'         },
  { key: 'administration',   label: 'Administration' },
  { key: 'research_notes',   label: 'Research Notes' },
]

export default function PeptideDetail() {
  const { slug } = useParams()
  const peptide = peptides.find(p => p.slug === slug)
  const [selectedDoseIdx, setSelectedDoseIdx] = useState(0)

  if (!peptide) {
    return (
      <div className="peptide-detail--not-found">
        <h1>Peptide not found</h1>
        <p>No peptide matches <strong>{slug}</strong>.</p>
        <Link to="/catalog">Back to catalog</Link>
      </div>
    )
  }

  const activeDose = peptide.doses[selectedDoseIdx]

  return (
    <article className="peptide-detail">
      <Helmet>
        <title>{peptide.name} — OptimalPep</title>
        <meta name="description" content={`${peptide.overview.slice(0, 155)}...`} />
      </Helmet>

      {/* Hero */}
      <span className="peptide-detail__category">{peptide.category}</span>
      <div className="peptide-detail__name-row">
        <h1 className="peptide-detail__name">{peptide.name}</h1>
        <DoseSelector
          doses={peptide.doses}
          selectedIdx={selectedDoseIdx}
          onChange={setSelectedDoseIdx}
        />
      </div>
      <p className="peptide-detail__overview">{peptide.overview}</p>

      {/* Info rows */}
      <div className="peptide-detail__info" role="list">
        {INFO_ROWS.map(({ key, label }) => {
          const value = peptide[key]
          if (value == null) return null
          return (
            <div key={key} className="peptide-detail__row" role="listitem">
              <dt className="peptide-detail__label">{label}</dt>
              <dd className="peptide-detail__value">{value}</dd>
            </div>
          )
        })}
      </div>

      {/* Reconstitution panel */}
      <ReconstitutionPanel dose={activeDose} />

      {/* Disclaimer */}
      <div className="peptide-detail__disclaimer">
        <WarningIcon />
        <p className="peptide-detail__disclaimer-text">
          This information is for educational and research purposes only. It does not
          constitute medical advice, diagnosis, or treatment. Research peptides are not
          approved for human use by any regulatory authority. Always consult a qualified
          healthcare professional before using any compound. Not for use by persons under
          18 years of age.
        </p>
      </div>

      {/* CTA */}
      <div className="peptide-detail__cta">
        <a
          href={SHOP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="peptide-detail__cta-link"
        >
          Purchase at OptimalPep
        </a>
      </div>
    </article>
  )
}
```

- [ ] **Step 2: Update `src/pages/PeptideDetail.css`**

Two changes:

Replace the `.peptide-detail__cta` block (left-align):
```css
.peptide-detail__cta {
  text-align: left;
  padding: 8px 0 16px;
}
```

In `.peptide-detail__disclaimer`, replace `border-left: 4px solid #f59e0b` with the token:
```css
.peptide-detail__disclaimer {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  padding: 16px 20px;
  border-radius: 8px;
  border: 1px solid var(--border);
  border-left: 4px solid var(--warning);
  background: rgba(245, 158, 11, 0.06);
  margin-bottom: 36px;
}
```

Also delete the now-unused `.peptide-detail__disclaimer-icon` rule (the `font-size: 18px` span rule for the removed emoji span).

- [ ] **Step 3: Verify visually**

At http://localhost:5173/peptides/bpc-157:
- Disclaimer: SVG triangle-warning icon appears left of the disclaimer text. No emoji.
- Disclaimer border-left: amber stripe from `var(--warning)`.
- Bottom CTA: "Purchase at OptimalPep" button, left-aligned (not centered).
- Click the CTA: should open the shop in a new tab.

Check dark mode: disclaimer amber stripe should remain visible against the dark background.

- [ ] **Step 4: Commit**

```bash
git add src/pages/PeptideDetail.jsx src/pages/PeptideDetail.css
git commit -m "fix: replace emoji, fill disclaimer, left-align CTA, link to shop"
```

---

### Task 8: GetStarted — replace emoji placeholder with real shop CTA

**Files:**
- Modify: `src/pages/GetStarted.jsx`
- Modify: `src/pages/GetStarted.css`

The "Contact & Ordering" section at the bottom of the Getting Started page shows a glass card with placeholder text and a `📋` emoji. Replace it with a real CTA section pointing to the shop — the user arriving at the bottom of this page is ready to act.

- [ ] **Step 1: Replace the contact section in `src/pages/GetStarted.jsx`**

Find the `{/* ── Contact placeholder ── */}` section (lines ~169–181) and replace it entirely:

```jsx
{/* ── Contact & Ordering ── */}
<section className="get-started__contact-section">
  <h2 className="get-started__section-heading">Ready to order?</h2>
  <p className="get-started__section-intro">
    Browse the full catalog and complete your order at{' '}
    <a href={SHOP_URL} target="_blank" rel="noopener noreferrer" className="get-started__link">
      optimalpep.com
    </a>
    . All products are sourced from our trusted supplier and ship with standard
    research-grade handling.
  </p>
  <Link to="/catalog" className="get-started__btn">Browse the Catalog</Link>
</section>
```

- [ ] **Step 2: Remove unused placeholder CSS from `src/pages/GetStarted.css`**

Delete the following rules (they are now dead code):

```css
/* ── Contact placeholder ── */
.get-started__placeholder { ... }
.get-started__placeholder-icon { ... }
.get-started__placeholder-body { ... }
.get-started__placeholder-title { ... }
.get-started__placeholder-text { ... }
```

- [ ] **Step 3: Verify visually**

At http://localhost:5173/get-started, scroll to the bottom:
- The section should be titled "Ready to order?" with a paragraph containing a live link to the shop and a "Browse the Catalog" button.
- No placeholder text, no emoji, no glass card.

- [ ] **Step 4: Commit**

```bash
git add src/pages/GetStarted.jsx src/pages/GetStarted.css
git commit -m "fix: replace contact placeholder with real shop CTA on get-started"
```

---

## Self-Review

### 1. Spec coverage

| Audit priority | Task |
|---|---|
| Hero.png in asymmetric split-screen | Task 4 |
| Hero h1 `<em>` italic accent | Task 4 |
| Catalog grid — break 3-equal-column pattern | Task 5 |
| Catalog card entrance animation | Task 6 |
| PeptideDetail CTA — left-align + link to shop | Task 7 |
| Fill disclaimer text | Task 7 |
| PeptideDetail emoji replacement | Task 7 |
| Amber hardcoded color → `var(--warning)` | Tasks 1 + 7 |
| GetStarted emoji replacement | Task 8 |
| Fill contact placeholder | Task 8 |
| Section heading font inconsistency (h2 sans vs serif spec) | Task 2 |
| Ghost `.glass` on Home steps | Task 3 |
| `#root` `text-align: center` default | Task 1 |

All audit priorities covered.

### 2. Placeholder scan

No placeholder patterns found. All code blocks are complete and directly executable.

### 3. Type/reference consistency

- `SHOP_URL` imported from `'../config.js'` in Tasks 7 and 8 — same import path as `Home.jsx` and `GetStarted.jsx` (already use it).
- `heroImg` imported from `'../assets/hero.png'` in Task 4 — file confirmed at `src/assets/hero.png`.
- `--warning` defined in Task 1, consumed in Task 7 — consistent token name throughout.
- `fadeUp` keyframe defined in `src/index.css` (existing), consumed in Task 6 — no redefinition needed.
- CSS class `.home__section-heading` targeted in Task 2 — confirmed in `Home.jsx` (`className="home__section-heading"`).
