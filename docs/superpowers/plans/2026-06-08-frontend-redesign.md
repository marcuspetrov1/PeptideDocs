# OptimalPep Frontend Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the visual identity of OptimalPepInfo — replace generic system fonts and purple accent with DM Serif Display headings, DM Sans body, JetBrains Mono labels, and a deep forest green accent on a warm cream base.

**Architecture:** CSS-only changes across 8 files. Token values in `src/index.css` cascade to all pages automatically; most accent/shadow colors are via CSS variables. A handful of hardcoded `rgba(170,59,255,…)` purple values in page/component CSS files need manual replacement.

**Tech Stack:** Vanilla CSS, Google Fonts (DM Serif Display, DM Sans, JetBrains Mono), Vite + React (no JSX changes)

---

## File Map

| File | What changes |
|---|---|
| `index.html` | Add Google Fonts `<link>` tags |
| `src/index.css` | All token values, h1/h2 rules, `.glass`, add `@keyframes fadeUp` |
| `src/components/Header.css` | Warm glass background, hardcoded purple shadow on shop button |
| `src/components/Footer.css` | No code change — picks up new `--code-bg` token automatically |
| `src/pages/Home.css` | Hero gradient + grain texture, hero entrance animations, hardcoded purple shadows |
| `src/pages/Catalog.css` | Hardcoded purple card hover shadow, add serif font to card name + heading |
| `src/pages/PeptideDetail.css` | Hardcoded purple CTA shadow, peptide name font-weight |
| `src/pages/GetStarted.css` | Hardcoded purple button shadow |

---

## Task 1: Add Google Fonts to index.html

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add font imports to `<head>` in `index.html`**

  Replace the existing `<head>` block with:

  ```html
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>OptimalPep</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=DM+Serif+Display:ital@0;1&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  </head>
  ```

- [ ] **Step 2: Verify fonts load**

  Run: `npm run dev`

  Open http://localhost:5173 in browser. Open DevTools → Elements. Select the `<body>`. In Computed styles, confirm `font-family` resolves to `DM Sans` (it won't look right yet — that's fine, tokens come next).

- [ ] **Step 3: Commit**

  ```bash
  git add index.html
  git commit -m "feat: add Google Fonts (DM Serif Display, DM Sans, JetBrains Mono)"
  ```

---

## Task 2: Rewrite design tokens and global styles in src/index.css

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Replace the full contents of `src/index.css`**

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

  [data-theme="dark"] {
    --text: #a09080;
    --text-h: #f0ebe4;
    --bg: #18140f;
    --border: #332c24;
    --code-bg: #211c16;
    --accent: #4a8c6f;
    --accent-bg: rgba(74, 140, 111, 0.12);
    --accent-border: rgba(74, 140, 111, 0.35);
    --social-bg: rgba(33, 28, 22, 0.5);
    --shadow:
      rgba(0, 0, 0, 0.5) 0 10px 15px -3px,
      rgba(0, 0, 0, 0.3) 0 4px 6px -2px;
    color-scheme: dark;
  }

  body {
    margin: 0;
  }

  #root {
    width: 1126px;
    max-width: 100%;
    margin: 0 auto;
    text-align: center;
    border-inline: 1px solid var(--border);
    min-height: 100svh;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }

  h1 {
    font-family: var(--heading);
    font-weight: 400;
    font-size: 56px;
    letter-spacing: -1.68px;
    color: var(--text-h);
    margin: 32px 0;
    @media (max-width: 1024px) {
      font-size: 36px;
      margin: 20px 0;
    }
  }

  h2 {
    font-family: var(--sans);
    font-weight: 600;
    font-size: 24px;
    line-height: 118%;
    letter-spacing: -0.24px;
    color: var(--text-h);
    margin: 0 0 8px;
    @media (max-width: 1024px) {
      font-size: 20px;
    }
  }

  p {
    margin: 0;
  }

  /* ── Shared utility ── */
  .glass {
    background: rgba(250, 248, 244, 0.65);
    border: 1px solid var(--border);
    border-radius: 12px;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  [data-theme="dark"] .glass {
    background: rgba(24, 20, 15, 0.65);
  }

  code,
  .counter {
    font-family: var(--mono);
    display: inline-flex;
    border-radius: 4px;
    color: var(--text-h);
  }

  code {
    font-size: 15px;
    line-height: 135%;
    padding: 4px 8px;
    background: var(--code-bg);
  }

  /* ── Entrance animation ── */
  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(14px);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }
  ```

- [ ] **Step 2: Verify tokens applied**

  With the dev server running, check:
  - Page background is warm cream (`#faf8f4`), not white
  - Any `h1` elements use DM Serif Display (serif letterforms visible)
  - Any `h2` elements use DM Sans (sans-serif)
  - Mono elements (eyebrow labels, category chips) use JetBrains Mono
  - Toggle dark mode — background becomes deep warm charcoal `#18140f`, accent turns sage green

- [ ] **Step 3: Commit**

  ```bash
  git add src/index.css
  git commit -m "feat: rewrite design tokens — warm cream palette, DM Serif Display, forest green accent"
  ```

---

## Task 3: Update Header.css

**Files:**
- Modify: `src/components/Header.css`

- [ ] **Step 1: Replace the full contents of `src/components/Header.css`**

  ```css
  .header {
    position: sticky;
    top: 0;
    z-index: 100;
    width: 100%;
    box-sizing: border-box;
    padding: 0 24px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    /* warm glass */
    background: rgba(250, 248, 244, 0.88);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
  }

  [data-theme="dark"] .header {
    background: rgba(24, 20, 15, 0.88);
  }

  .header-logo {
    font-family: var(--heading);
    font-size: 17px;
    font-weight: 400;
    color: var(--text-h);
    text-decoration: none;
    letter-spacing: -0.3px;
    transition: opacity 0.2s;
  }

  .header-logo:hover {
    opacity: 0.75;
  }

  .header-shop-btn {
    display: inline-flex;
    align-items: center;
    padding: 7px 18px;
    border-radius: 999px;
    background: var(--accent);
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    letter-spacing: 0.1px;
    transition: opacity 0.2s, box-shadow 0.2s;
  }

  .header-shop-btn:hover {
    opacity: 0.88;
    box-shadow: 0 2px 10px rgba(26, 74, 58, 0.4);
  }

  [data-theme="dark"] .header-shop-btn:hover {
    box-shadow: 0 2px 10px rgba(74, 140, 111, 0.45);
  }

  .header-shop-btn:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 3px;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .header-theme-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--text);
    cursor: pointer;
    transition: color 0.2s, border-color 0.2s, background 0.2s;
    padding: 0;
  }

  .header-theme-btn:hover {
    color: var(--text-h);
    border-color: var(--accent-border);
    background: var(--accent-bg);
  }

  .header-theme-btn:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
  ```

- [ ] **Step 2: Verify header**

  - Logo text is in DM Serif Display (elegant serif letterforms)
  - Header background is warm translucent cream, not cold white
  - Shop button is forest green — hover adds a green shadow, not purple
  - Dark mode: header is warm translucent charcoal

- [ ] **Step 3: Commit**

  ```bash
  git add src/components/Header.css
  git commit -m "feat: update header — warm glass, serif logo, green button shadow"
  ```

---

## Task 4: Update Home.css — hero gradient, grain texture, entrance animations

**Files:**
- Modify: `src/pages/Home.css`

- [ ] **Step 1: Replace the full contents of `src/pages/Home.css`**

  ```css
  /* ──────────────────────────────────────────────
     Home page — shared layout
  ────────────────────────────────────────────── */
  .home {
    width: 100%;
    box-sizing: border-box;
    text-align: left;
  }

  /* ── Section helpers ── */
  .home__section-heading {
    font-size: 32px;
    font-weight: 600;
    letter-spacing: -0.6px;
    color: var(--text-h);
    margin: 0 0 8px;
  }

  @media (max-width: 1024px) {
    .home__section-heading {
      font-size: 26px;
    }
  }

  .home__section-sub {
    font-size: 16px;
    color: var(--text);
    margin: 0 0 32px;
  }

  /* ──────────────────────────────────────────────
     Section 1 — Hero
  ────────────────────────────────────────────── */
  .home__hero {
    min-height: 70vh;
    display: flex;
    align-items: center;
    padding: calc(56px + 3rem) 32px 4rem;
    box-sizing: border-box;
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
  }

  @media (max-width: 1024px) {
    .home__hero {
      padding: calc(56px + 2rem) 24px 3rem;
      min-height: 60vh;
    }
  }

  @media (max-width: 600px) {
    .home__hero {
      padding: calc(56px + 1.5rem) 16px 2.5rem;
      min-height: 55vh;
    }
  }

  .home__hero-inner {
    max-width: 680px;
    position: relative; /* stay above grain overlay */
  }

  .home__hero-eyebrow {
    font-family: var(--mono);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--accent);
    margin: 0 0 16px;
    animation: fadeUp 0.5s ease both;
  }

  .home__hero-heading {
    font-size: 64px;
    font-weight: 400;
    letter-spacing: -2px;
    line-height: 1.02;
    color: var(--text-h);
    margin: 0 0 24px;
    animation: fadeUp 0.55s ease both;
    animation-delay: 120ms;
  }

  @media (max-width: 1024px) {
    .home__hero-heading {
      font-size: 44px;
      letter-spacing: -1.2px;
    }
  }

  @media (max-width: 600px) {
    .home__hero-heading {
      font-size: 34px;
      letter-spacing: -0.8px;
    }
  }

  .home__hero-sub {
    font-size: 17px;
    line-height: 1.6;
    color: var(--text);
    margin: 0 0 36px;
    max-width: 560px;
    animation: fadeUp 0.55s ease both;
    animation-delay: 240ms;
  }

  @media (max-width: 600px) {
    .home__hero-sub {
      font-size: 15px;
    }
  }

  /* ── CTA buttons ── */
  .home__hero-ctas {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    animation: fadeUp 0.5s ease both;
    animation-delay: 360ms;
  }

  .home__cta {
    display: inline-flex;
    align-items: center;
    padding: 11px 24px;
    border-radius: 999px;
    font-size: 15px;
    font-weight: 500;
    text-decoration: none;
    letter-spacing: 0.05px;
    transition: opacity 0.2s, box-shadow 0.2s, background 0.2s;
  }

  .home__cta--primary {
    background: var(--accent);
    color: #fff;
  }

  .home__cta--primary:hover {
    opacity: 0.88;
    box-shadow: 0 2px 14px rgba(26, 74, 58, 0.35);
  }

  [data-theme="dark"] .home__cta--primary:hover {
    box-shadow: 0 2px 14px rgba(74, 140, 111, 0.4);
  }

  .home__cta--secondary {
    background: transparent;
    color: var(--text-h);
    border: 1px solid var(--border);
  }

  .home__cta--secondary:hover {
    border-color: var(--accent-border);
    color: var(--accent);
  }

  .home__cta:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 3px;
  }

  /* reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .home__hero-eyebrow,
    .home__hero-heading,
    .home__hero-sub,
    .home__hero-ctas {
      animation: none;
    }
  }

  /* ──────────────────────────────────────────────
     Section 2 — Categories
  ────────────────────────────────────────────── */
  .home__categories {
    padding: 5rem 32px;
    border-bottom: 1px solid var(--border);
  }

  @media (max-width: 1024px) {
    .home__categories {
      padding: 4rem 24px;
    }
  }

  @media (max-width: 600px) {
    .home__categories {
      padding: 3rem 16px;
    }
  }

  .home__category-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .home__category-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    border-radius: 999px;
    background: var(--accent-bg);
    border: 1px solid var(--accent-border);
    color: var(--accent);
    font-family: var(--mono);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    text-decoration: none;
    transition: opacity 0.2s, box-shadow 0.2s;
  }

  .home__category-chip:hover {
    opacity: 0.82;
    box-shadow: 0 0 0 1px var(--accent-border);
  }

  .home__category-chip:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  .home__category-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--accent);
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0;
  }

  /* ──────────────────────────────────────────────
     Section 3 — How it works
  ────────────────────────────────────────────── */
  .home__how {
    padding: 5rem 32px 6rem;
  }

  @media (max-width: 1024px) {
    .home__how {
      padding: 4rem 24px 5rem;
    }
  }

  @media (max-width: 600px) {
    .home__how {
      padding: 3rem 16px 4rem;
    }
  }

  .home__steps {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  @media (max-width: 800px) {
    .home__steps {
      grid-template-columns: 1fr;
      max-width: 480px;
    }
  }

  .home__step {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 28px 24px;
  }

  .home__step-number {
    font-family: var(--mono);
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: var(--accent);
    background: var(--accent-bg);
    border: 1px solid var(--accent-border);
    border-radius: 6px;
    padding: 3px 9px;
    align-self: flex-start;
  }

  .home__step-title {
    font-size: 18px;
    font-weight: 600;
    letter-spacing: -0.2px;
    color: var(--text-h);
    line-height: 1.2;
  }

  .home__step-desc {
    font-size: 14px;
    line-height: 1.65;
    color: var(--text);
    margin: 0;
  }

  .home__step-link {
    color: var(--accent);
    text-decoration: underline;
    text-underline-offset: 2px;
    transition: opacity 0.2s;
  }

  .home__step-link:hover {
    opacity: 0.75;
  }
  ```

- [ ] **Step 2: Verify home page**

  - Hero background is a warm diagonal gradient cream, not white
  - On page load, eyebrow fades up first, then heading, then subtext, then buttons (staggered ~120ms apart)
  - Toggle dark mode — hero goes warm charcoal, accent chips are sage green
  - Hover on primary CTA — shadow is green, not purple

- [ ] **Step 3: Commit**

  ```bash
  git add src/pages/Home.css
  git commit -m "feat: redesign home hero — warm gradient, grain texture, staggered entrance animations"
  ```

---

## Task 5: Update Catalog.css — card shadow and serif card names

**Files:**
- Modify: `src/pages/Catalog.css`

- [ ] **Step 1: Replace the full contents of `src/pages/Catalog.css`**

  ```css
  /* ── Page wrapper ── */
  .catalog {
    padding: calc(56px + 2rem) 32px 4rem;
    text-align: left;
    max-width: 1126px;
    margin: 0 auto;
    box-sizing: border-box;
  }

  @media (max-width: 1024px) {
    .catalog {
      padding: calc(56px + 1.5rem) 24px 3rem;
    }
  }

  @media (max-width: 600px) {
    .catalog {
      padding: calc(56px + 1rem) 16px 2.5rem;
    }
  }

  /* ── Heading area ── */
  .catalog__heading {
    font-family: var(--heading);
    font-size: 56px;
    font-weight: 400;
    letter-spacing: -1.68px;
    color: var(--text-h);
    margin: 32px 0 10px;
    line-height: 1.05;
  }

  @media (max-width: 1024px) {
    .catalog__heading {
      font-size: 36px;
      letter-spacing: -0.9px;
      margin: 20px 0 8px;
    }
  }

  .catalog__subtitle {
    font-size: 17px;
    line-height: 1.55;
    color: var(--text);
    margin: 0 0 40px;
  }

  @media (max-width: 1024px) {
    .catalog__subtitle {
      margin-bottom: 28px;
    }
  }

  /* ── Search bar ── */
  .catalog__search-row {
    margin-bottom: 16px;
  }

  .catalog__search {
    width: 100%;
    box-sizing: border-box;
    padding: 10px 16px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--code-bg);
    color: var(--text-h);
    font-size: 15px;
    font-family: var(--sans);
    transition: border-color 0.15s, box-shadow 0.15s;
    outline: none;
  }

  .catalog__search::placeholder {
    color: var(--text);
    opacity: 0.6;
  }

  .catalog__search:focus {
    border-color: var(--accent-border);
    box-shadow: 0 0 0 3px var(--accent-bg);
  }

  .catalog__search::-webkit-search-cancel-button {
    -webkit-appearance: none;
    appearance: none;
  }

  /* ── Empty state ── */
  .catalog__empty {
    color: var(--text);
    font-size: 15px;
    padding: 48px 0;
    text-align: center;
  }

  /* ── Category filter bar ── */
  .catalog__filters {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 32px;
  }

  @media (max-width: 1024px) {
    .catalog__filters {
      margin-bottom: 24px;
    }
  }

  .catalog__filter-btn {
    appearance: none;
    border: 1px solid var(--border);
    border-radius: 999px;
    background: transparent;
    color: var(--text);
    font-family: var(--mono);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    padding: 6px 14px;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s, color 0.15s;
  }

  .catalog__filter-btn:hover {
    border-color: var(--accent-border);
    color: var(--accent);
    background: var(--accent-bg);
  }

  .catalog__filter-btn--active {
    border-color: var(--accent-border);
    color: var(--accent);
    background: var(--accent-bg);
  }

  .catalog__filter-btn:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  /* ── Grid ── */
  .catalog__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  @media (max-width: 900px) {
    .catalog__grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 560px) {
    .catalog__grid {
      grid-template-columns: 1fr;
      gap: 14px;
    }
  }

  /* ── Peptide card ── */
  .catalog__card {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px 22px 22px;
    text-decoration: none;
    color: inherit;
    transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .catalog__card:hover {
    transform: translateY(-2px);
    border-color: var(--accent-border);
    box-shadow: 0 4px 20px rgba(26, 74, 58, 0.12);
  }

  [data-theme="dark"] .catalog__card:hover {
    box-shadow: 0 4px 20px rgba(74, 140, 111, 0.18);
  }

  .catalog__card:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  /* ── Category chip ── */
  .catalog__category {
    display: inline-block;
    align-self: flex-start;
    padding: 3px 10px;
    border-radius: 999px;
    background: var(--accent-bg);
    border: 1px solid var(--accent-border);
    color: var(--accent);
    font-family: var(--mono);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  /* ── Card name — serif for editorial feel ── */
  .catalog__name {
    font-family: var(--heading);
    font-size: 22px;
    font-weight: 400;
    letter-spacing: -0.3px;
    color: var(--text-h);
    margin: 0;
    line-height: 1.15;
  }

  /* ── Card overview ── */
  .catalog__overview {
    font-size: 14px;
    line-height: 1.6;
    color: var(--text);
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  ```

- [ ] **Step 2: Verify catalog page**

  - Large catalog heading uses DM Serif Display
  - Card names use DM Serif Display (elegant, editorial)
  - Card hover: green-tinted shadow, not purple
  - Dark mode card hover: sage green shadow

- [ ] **Step 3: Commit**

  ```bash
  git add src/pages/Catalog.css
  git commit -m "feat: update catalog — serif card names, green hover shadow"
  ```

---

## Task 6: Update PeptideDetail.css — serif peptide name, green CTA shadow

**Files:**
- Modify: `src/pages/PeptideDetail.css`

- [ ] **Step 1: Update three sections in `src/pages/PeptideDetail.css`**

  Replace `.peptide-detail__name` block:

  ```css
  .peptide-detail__name {
    font-family: var(--heading);
    font-size: 48px;
    font-weight: 400;
    letter-spacing: -1.5px;
    color: var(--text-h);
    margin: 0;
    line-height: 1.05;
  }

  @media (max-width: 600px) {
    .peptide-detail__name {
      font-size: 32px;
      letter-spacing: -0.8px;
    }
  }
  ```

  Replace `.peptide-detail__cta-link:hover` block:

  ```css
  .peptide-detail__cta-link:hover {
    opacity: 0.88;
    box-shadow: 0 4px 18px rgba(26, 74, 58, 0.4);
  }
  ```

  Add dark mode shadow (after the hover rule):

  ```css
  [data-theme="dark"] .peptide-detail__cta-link:hover {
    box-shadow: 0 4px 18px rgba(74, 140, 111, 0.45);
  }
  ```

- [ ] **Step 2: Verify peptide detail page**

  Navigate to any peptide detail page (e.g. `/peptides/bpc-157`).
  - Peptide name at top uses DM Serif Display — large, elegant serif
  - CTA button hover glow is green, not purple

- [ ] **Step 3: Commit**

  ```bash
  git add src/pages/PeptideDetail.css
  git commit -m "feat: update peptide detail — serif peptide name, green CTA shadow"
  ```

---

## Task 7: Update GetStarted.css — green button shadow, serif heading

**Files:**
- Modify: `src/pages/GetStarted.css`

- [ ] **Step 1: Update three sections in `src/pages/GetStarted.css`**

  Replace `.get-started__heading` block:

  ```css
  .get-started__heading {
    font-family: var(--heading);
    font-size: 56px;
    font-weight: 400;
    letter-spacing: -1.68px;
    color: var(--text-h);
    margin: 0 0 16px;
    line-height: 1.05;
  }

  @media (max-width: 1024px) {
    .get-started__heading {
      font-size: 38px;
      letter-spacing: -1px;
      margin: 0 0 12px;
    }
  }

  @media (max-width: 600px) {
    .get-started__heading {
      font-size: 30px;
      letter-spacing: -0.6px;
    }
  }
  ```

  Replace `.get-started__btn:hover` block:

  ```css
  .get-started__btn:hover {
    opacity: 0.88;
    box-shadow: 0 2px 14px rgba(26, 74, 58, 0.35);
  }
  ```

  Replace `[data-theme="dark"] .get-started__btn:hover` block:

  ```css
  [data-theme="dark"] .get-started__btn:hover {
    box-shadow: 0 2px 14px rgba(74, 140, 111, 0.4);
  }
  ```

- [ ] **Step 2: Verify Get Started page**

  Navigate to `/get-started`.
  - Page heading uses DM Serif Display
  - "Browse Catalog" button hover: green shadow, not purple

- [ ] **Step 3: Commit**

  ```bash
  git add src/pages/GetStarted.css
  git commit -m "feat: update get-started — serif heading, green button shadow"
  ```

---

## Task 8: Final cross-page visual verification

- [ ] **Step 1: Run dev server and check all pages in light mode**

  `npm run dev`

  Checklist:
  - `/` — Hero: warm cream gradient, serif heading, staggered fade-up animations, green CTAs
  - `/catalog` — Serif page heading, serif card names, green filter chips, green card hover shadow
  - `/peptides/bpc-157` (or any slug) — Large serif peptide name, info table, reconstitution panel, green CTA
  - `/get-started` — Serif heading, numbered steps, green button

- [ ] **Step 2: Check dark mode on all pages**

  Click the sun/moon toggle in the header. Verify:
  - Background: warm charcoal `#18140f`, not cold black
  - Accent: sage green `#4a8c6f`, not purple
  - Borders: warm brown `#332c24`, not gray
  - All text readable, no invisible elements

- [ ] **Step 3: Check mobile (600px)**

  Open DevTools → Device toolbar → set width to 390px. Verify:
  - Hero heading scales down correctly, still readable
  - Catalog grid collapses to 1 column
  - Peptide detail info table collapses to single column
  - No horizontal overflow

- [ ] **Step 4: Check reduced motion**

  DevTools → Rendering → Emulate CSS media feature → `prefers-reduced-motion: reduce`. Reload home page. Hero elements should appear instantly with no animation.
