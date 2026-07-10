# CLAUDE.md

Guidance for agents working in this repository. This is a **living document** — see [Maintaining this file](#maintaining-this-file-living-document). When a routing choice proves wrong or a new pattern emerges, update the relevant section rather than working around it.

## Project overview

**OptimalPepInfo / "PeptideDocs"** is an informational catalog website for a peptide research business (live at optimalpepinfo.com). It is **inquiry-only / informational** — no transactions, purchases, or checkout. Visitors browse a peptide catalog and read per-peptide profiles.

**Required content rule:** a research-chemical disclaimer must appear in the footer and on every peptide detail page. Do not remove or weaken it.

## Tech stack & conventions

- **React 19 SPA on Vite 8**, routed with `react-router-dom` v7.
- **JavaScript / JSX only — not TypeScript.** Do not add `.ts`/`.tsx` files. (`@types/*` exist only for editor tooling; `components.json` sets `tsx: false`.)
- **Tailwind CSS v4**, CSS-first config. Theme lives in `src/index.css`; there is **no `tailwind.config`**.
- **shadcn/ui** — style `radix-nova`, base color `neutral`, icons via `lucide-react`.
- Use the **`@/` alias** (→ `src/`). Use **`cn()`** (`src/lib/utils.js`) for class merging.
- Component placement: shadcn primitives in `src/components/ui/`, app components in `src/components/`.
- **Content is data, not code:** peptide entries live in `src/data/peptides.json` (~65 entries); categories in `src/data/categories.js` (shared by Home & Catalog). **Always run `npm run validate` after editing peptide data.**

### Layout

```
src/
  main.jsx            Entry: BrowserRouter + HelmetProvider
  App.jsx             Routes: / /catalog /peptides/:slug /get-started
  index.css           Tailwind v4 + theme
  pages/              Home, Catalog, PeptideDetail, GetStarted
  components/         Header, Footer, Layout, BackBar, ScrollToTop, ReconstitutionPanel
    ui/               shadcn primitives (button, card, badge, input)
  lib/utils.js        cn() helper
  data/               peptides.json, categories.js
scripts/              validate-peptides.mjs
tests/                Playwright specs
```

Note: Vite `base` is the default `/` (root) — the app is served from the domain root on Vercel, not a repo-name subpath. Don't reintroduce a `/PeptideDocs/`-style `base`; it was a GitHub Pages leftover that broke asset loading on Vercel (blank page).

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint (flat config) |
| `npm run preview` | Serve the built site |
| `npm run validate` | Validate `peptides.json` via `scripts/validate-peptides.mjs` |
| `npx playwright test` | Run Playwright specs in `tests/` (there is **no** `npm test` script) |

CI (`.github/`) mirrors these on PRs to `main`: **lint → validate → build → Playwright**. Deployed on **Vercel**.

### Branching & merge policy

Trunk-based: `main` is the only long-lived branch (no `develop`). All changes land via a short-lived `feat/*`/`fix/*`/`chore/*` branch and a PR — branch protection blocks direct pushes to `main` and requires the `ci` check to pass before merge. Vercel gives every branch/PR its own preview deployment automatically, so there's no separate staging branch to keep in sync.

## Agentic workflow — when to use which skill

Route by task. Most of these are **SHOULD** (follow by default, deviate with judgment); the three **hard rules** at the bottom are **MUST**.

| When the task is… | Reach for… |
|---|---|
| Understanding the codebase — "how does X work", "where is Y" | **graphify** — a graph is already built (`graphify-out/`). Treat the question as a graphify query first: `/graphify query "…"`. Refresh with `/graphify --update` when code has changed since the last build. |
| Starting a new feature — "let's build X" | **superpowers:brainstorming** → **superpowers:writing-plans** → then implement with **agent-skills:build** / incremental-implementation |
| Redesigning an existing page/UI | **redesign-existing-projects** (audit-first), then review with **web-design-guidelines** |
| Building brand-new UI | **design-taste-frontend**, then review with **web-design-guidelines** |
| Adding or finding a shadcn component | **shadcn MCP** (`search_items` → `get_add_command`). Keep style `radix-nova`, base `neutral`. |
| Writing user-facing copy / content | **writing-guidelines** |
| A bug, test failure, or unexpected behavior | **superpowers:systematic-debugging** *before* proposing a fix |
| Adding logic or fixing a bug with test coverage | **superpowers:test-driven-development**; tests are Playwright specs in `tests/` |
| Reviewing a change before merge | **/code-review** (or agent-skills:review) |
| Deploying, build size, or performance | **deploy-to-vercel**, **vercel-optimize**, **vercel-react-best-practices** |

### Hard rules (MUST)

1. **graphify first** for codebase-understanding questions while `graphify-out/` exists.
2. **Never claim work is done** without running `npm run lint`, `npx playwright test`, and `npm run validate` (when peptide data was touched) — and reporting the real output. Use **superpowers:verification-before-completion**.
3. **Preserve the disclaimer** in the footer and on every peptide detail page.

## Definition of done

Mirror CI before saying a change is complete:

- [ ] `npm run lint` clean
- [ ] `npm run validate` clean (if `peptides.json` / categories changed)
- [ ] `npm run build` succeeds
- [ ] `npx playwright test` green
- [ ] Disclaimer intact (footer + detail pages)

## Maintaining this file (living document)

This file is meant to evolve — improving it is usually the first fix when an agent stumbles.

- When a routing choice sends you to the wrong skill, or a better one exists, **edit the routing table**.
- When a new convention or gotcha surfaces, add it to **Tech stack & conventions**.
- Keep commands and paths accurate; if the repo changes, this file changes with it.
- If a repeated manual step becomes reliable enough to automate, consider graduating it into a hook or `.claude/settings.json` — and note it here.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
