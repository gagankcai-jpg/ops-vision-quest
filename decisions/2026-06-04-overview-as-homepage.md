## Decision: Promote the React "overview" dashboard to the homepage at bare `/market-intelligence/`, with the category deep-dive editorial ported in below the Market Map.

## Context
Two competing intro pages existed:
- `/market-intelligence/` — a hand-built SSR WordPress **theme** landing (`files/page-market-intelligence.php`, ~1300 lines): narrow-vs-broad TAM framing, 5 category deep-dives with analyst source citations, Scope Arbitrage Zone, Methodology. No interactivity (no bubble chart, no matrix).
- `/market-intelligence/overview/` — the React `<Index />` (also the router index route): Hero, pillar cards, Live Signals, Executive Summary, TAM chart, **Vendor Comparison Matrix + Market Map bubble chart**, fastest/largest lists. No scope framing, no per-category deep-dive.

First-time visitors landed on the static text page; the actual interactive product was hidden one click away. User asked: can overview *be* the homepage, with the category deep-dive below the market map?

## Alternatives considered
1. **(Chosen) Retire the PHP landing; serve the prerendered React overview at the bare route; port the editorial into a React `CategoryDeepDive` section below the Market Map.** Single canonical homepage; `/overview` 301s to bare.
2. **Keep the PHP page at a new URL** (e.g. `/scope/`) and add a lighter deep-dive on the homepage. Preserves long-form but creates two overlapping pages to maintain.
3. **Make overview the homepage but leave the PHP landing fully intact at its own URL.** Fastest, but the unique scope content drops off the homepage and you maintain two near-duplicate intros.

## Reasoning
Option 1 puts the interactive dashboard (the real value) first while preserving the site's strongest SEO/editorial asset — the narrow/broad scope analysis + analyst citations — as the "go deeper" layer beneath the map. Porting was cheap and near-verbatim because the PHP content is already structured data (no LLM generation). The SSG already prerenders the index/overview route, so the homepage stays fully crawlable. A single canonical homepage avoids duplicate-content dilution.

## Implementation
- New `src/components/presentation/CategoryDeepDive.tsx` (lazy-loaded in `Index.tsx` after `#comparison`): narrow/broad scope boxes + two TAM tables, 5 category deep-dive cards (KPIs, scope note, description, key signals, sources), Scope Arbitrage Zone, Methodology. Content ported verbatim from `files/page-market-intelligence.php`.
- `autonomous-it-insights.php` (`template_redirect`, priority 1): bare `/market-intelligence/` now serves the SPA template (`page-market-intel.php`), which maps the empty route key → prerendered `app/overview/index.html`. Added a 301 from `/market-intelligence/overview` → bare.
- Internal `/overview` links repointed to `/` (Navigation scrollToSection, NotFound, MarketPage ×2).
- Index canonical already points to the bare URL — correct for the new homepage.

## Trade-offs accepted
- The old SSR theme landing (`files/page-market-intelligence.php`) is no longer served (kept on disk for rollback). Its narrow/broad **Chart.js** bar/CAGR canvases were NOT ported — the React homepage already has its own TAM comparison chart + Market Map; the deep-dive ports the tables and editorial, not those two decorative canvases.
- Homepage is now longer (interactive dashboard + full editorial deep-dive in one scroll). Accepted for SEO depth and single-page coherence.
- Scope-arbitrage/category TAM numbers now live in TWO places (the new React component and the per-market `src/data/*.ts`). The React deep-dive numbers are a static editorial snapshot; if analyst figures change, update both.

## Supersedes
Partially supersedes the routing note in `decisions/2026-06-03-ssr-approach.md` (which kept the bare `/market-intelligence/` on the SSR theme landing). The bare route now serves the prerendered React overview instead.

## Verification (live, post-deploy 2026-06-04)
- Bare homepage serves React overview: Vendor Comparison/Market Map (`#comparison`) before Category deep dives (`#deep-dive`). ✅
- `/market-intelligence/overview/` → `301` → bare. ✅
- `market/aiops` → `200` (sub-routes intact). ✅
- `tsc` clean; build 515 HTML; deep-dive content confirmed in prerendered `index.html` + `overview/index.html`.
