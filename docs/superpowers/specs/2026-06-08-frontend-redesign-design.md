# OptimalPep Frontend Redesign — Design Spec

**Date:** 2026-06-08  
**Direction:** A — Clinical Editorial  
**Scope:** CSS-only redesign. No JSX or HTML structure changes.

---

## Problem

The current design uses:
- `system-ui / Segoe UI / Roboto` — generic system font stack, no personality
- `#aa3bff` purple accent on white — the most overused AI-generated color combination
- No entrance animations — only `opacity 0.2s` hover transitions
- Flat white/gray backgrounds — no atmosphere or visual identity

The site goal is a **premium peptide information catalog**. The design must signal precision, trust, and authority — not a generic developer scaffold.

---

## Design Direction: Clinical Editorial

Aesthetic reference: premium medical reference meets luxury wellness brand. Warm and credible, not cold and clinical.

---

## Typography

| Role | Font | Weight | Notes |
|---|---|---|---|
| Display headings (h1, hero) | DM Serif Display | Regular + Italic | Italic used for accent words in hero h1 |
| Section headings (h2, h3) | DM Serif Display | Regular | |
| Body / UI text | DM Sans | 300–600 | Replaces system-ui |
| Mono / chips / labels / eyebrows | JetBrains Mono | 400–600 | Replaces ui-monospace |

Google Fonts import in `index.html`:
```
DM Serif Display (regular, italic)
DM Sans (300, 400, 500, 600)
JetBrains Mono (400, 500, 600)
```

---

## Color Tokens

### Light mode (`:root`)

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#faf8f4` | Page background |
| `--bg-alt` | `#f0ece2` | Sections, cards, code-bg |
| `--text` | `#6b5e52` | Body text |
| `--text-h` | `#1a1410` | Headings, high-emphasis text |
| `--border` | `#e8e3da` | All borders |
| `--accent` | `#1a4a3a` | Primary accent (deep forest green) |
| `--accent-bg` | `rgba(26,74,58,0.07)` | Chip backgrounds, hover tints |
| `--accent-border` | `rgba(26,74,58,0.25)` | Chip/focus borders |
| `--shadow` | warm amber shadow | Replaces neutral box shadow |

### Dark mode (`[data-theme="dark"]`)

| Token | Value |
|---|---|
| `--bg` | `#18140f` |
| `--bg-alt` | `#211c16` |
| `--text` | `#a09080` |
| `--text-h` | `#f0ebe4` |
| `--border` | `#332c24` |
| `--accent` | `#4a8c6f` |
| `--accent-bg` | `rgba(74,140,111,0.12)` |
| `--accent-border` | `rgba(74,140,111,0.35)` |

---

## Animation

### Hero entrance (Home page)
Staggered fade-up sequence on first load:
1. Eyebrow — delay 0ms
2. h1 — delay 120ms
3. Subtext — delay 240ms
4. CTA buttons — delay 360ms

CSS keyframe: `@keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }`

All animations respect `@media (prefers-reduced-motion: reduce)`.

### Catalog cards
Subtle `fadeUp` on mount — all cards animate together with a single short duration.

### Hover transitions
Cards: warm shadow appears (`box-shadow` with warm amber tint, no purple glow).  
Buttons: `opacity` + warm shadow (no purple).

---

## Atmosphere

### Hero section
- Background: warm diagonal gradient `#faf8f4` → `#f0ece2`
- No radial purple glow — replaced by a faint warm wash
- Very subtle grain texture overlay (4% opacity SVG noise) applied to hero — key premium detail

### Cards / panels
- Background: `#fff` (light) / `rgba(255,255,255,0.03)` (dark)
- Border: `--border` (warm beige)
- Hover shadow: `rgba(26,74,58,0.12)` (green-tinted, not purple)

### Buttons
- Primary: `background: var(--accent)` (forest green), white text, `border-radius: 999px`
- Secondary: transparent, `border: 1px solid var(--border)`, border-color shifts to `--accent-border` on hover
- Shop button in header: same as primary

---

## Files Modified

| File | Changes |
|---|---|
| `index.html` | Add Google Fonts `<link>` import |
| `src/index.css` | Replace all tokens (colors, fonts). Add `@keyframes fadeUp`. |
| `src/components/Header.css` | Update logo font, button colors, glass bg to warm tint |
| `src/components/Footer.css` | Update bg to `--bg-alt`, border to `--border` |
| `src/pages/Home.css` | Replace hero gradient, accent colors. Add entrance animation classes. |
| `src/pages/Catalog.css` | Replace accent colors, card hover shadow |
| `src/pages/PeptideDetail.css` | Replace accent colors, disclaimer border/bg |
| `src/pages/GetStarted.css` | Replace accent colors |

**No JSX changes.**

---

## Constraints

- All breakpoints (1024px / 600px / 560px) unchanged
- Dark mode continues to work via `[data-theme="dark"]`
- `prefers-reduced-motion` respected
- No new dependencies beyond Google Fonts
