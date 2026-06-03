# ops-vision-quest — CLAUDE.md

## Project Overview

**Autonomous IT Market Intelligence Portal** — React 18 + TypeScript + Vite SPA deployed as a WordPress plugin at `aienterpriseit.com`.

Covers 5 market categories: AIOps, ITOM, RPA, Agentic Operations, SecOps — each with 50 established vendors + 50 startups.

---

## Build & Dev

```bash
npm run dev          # local dev server
npm run build        # production build → dist/
npx tsc --noEmit     # type-check only (no build)
```

---

## Deploy to Production (Hostinger)

SSH key is at `~/.ssh/hostinger_deploy` (ed25519, added to hPanel). Use rsync — not scp.

**The site is statically prerendered (SSG via vite-react-ssg).** `npm run build` produces a full
`dist/` tree: one prerendered `dist/<route>/index.html` per route (real content + per-route `<head>`),
the hashed `dist/assets/`, and `dist/.vite/manifest.json` + `dist/route-meta.json`. Deploy the WHOLE
`dist/` — not just `dist/assets/`.

1. `npm run build` — runs `generate-vendor-slugs.js` + `generate-route-meta.js` + `vite-react-ssg build`.
   (Use `npm run build:spa` for a non-prerendered SPA-only build — debugging only.)

2. Rsync the entire `dist/` tree to `app/` (prerendered HTML + assets + manifests). No `--delete` keeps
   old hashed assets so in-flight clients don't break:
```bash
rsync -avz -e "ssh -i ~/.ssh/hostinger_deploy -p 65002 -o StrictHostKeyChecking=no" \
  dist/ \
  u552630707@82.29.199.42:/home/u552630707/domains/aienterpriseit.com/public_html/wp-content/plugins/autonomous-it-insights/app/
```

3. No manual asset-hash edit needed. `page-market-intel.php` serves the prerendered file for each route
   if present (`app/<route>/index.html`), and for any non-prerendered route falls back to a shell whose
   JS/CSS hashes it reads at runtime from `app/.vite/manifest.json`. Only rsync the template if you changed it:
```bash
rsync -avz -e "ssh -i ~/.ssh/hostinger_deploy -p 65002 -o StrictHostKeyChecking=no" \
  wordpress-plugin/autonomous-it-insights/templates/page-market-intel.php \
  u552630707@82.29.199.42:/home/u552630707/domains/aienterpriseit.com/public_html/wp-content/plugins/autonomous-it-insights/templates/
```

4. Purge LiteSpeed cache — required after every deploy or changes won't appear:
```bash
ssh -i ~/.ssh/hostinger_deploy -p 65002 u552630707@82.29.199.42 \
  "wp --path=/home/u552630707/domains/aienterpriseit.com/public_html litespeed-purge all"
```

**Rollback:** the prior SPA-only behavior is one revert away — restore the previous `page-market-intel.php`
(client-render shell) and purge; old hashed assets are still on the server.

**Recharts + SSG:** chart components are wrapped in `<ClientOnly>` (from `vite-react-ssg`) so they render
only on the client — `ResponsiveContainer` measures the DOM (0×0 during SSG) and would otherwise cause
React hydration mismatches (#418/#421). Any NEW recharts chart MUST be wrapped the same way.

---

## Architecture

### Router

Uses **`BrowserRouter` with `basename="/market-intelligence"`** (path routing, NOT hash). The router is
defined as a `routes` array in `src/App.tsx` and bootstrapped by `vite-react-ssg` in `src/main.tsx`
(`ViteReactSSG({ routes, basename })`). WordPress serves SPA sub-paths via a `template_redirect` hook in
`autonomous-it-insights.php` (every `/market-intelligence/*` sub-path → `page-market-intel.php`); the bare
`/market-intelligence/` is the separate SSR landing page in the theme. Per-market routes use `/market/:slug`.

Lazy-loaded routes use React Router's route-level `lazy:` (data-router form), NOT `React.lazy` — so they
prerender real content during SSG instead of a Suspense fallback.

### Per-market pages

Route: `/market/:slug` → `src/pages/MarketPage.tsx`

Valid slugs: `aiops`, `itom`, `rpa`, `agentops`, `secops`

### Data — single source of truth

`src/data/marketData.ts` — `allCategories` array is the single source of truth for all market and vendor data. Do not maintain parallel data arrays elsewhere.

Each category has:
- `vendors[]` — 50 established vendors (types: `leader`, `challenger`, `niche`)
- `startups[]` — 50 startups/emerging vendors (types: `startup`, `emerging`)

### VendorEntry interface (exported from `CategorySection.tsx`)

```ts
interface VendorEntry {
  name: string;
  type: "leader" | "challenger" | "niche" | "startup" | "emerging";
  marketCap?: string;  // "$42.3B" | "Private $6B" | "Div. of IBM" | "—"
  revenue?: string;    // "$2.1B ARR" | "Est. $60M ARR" | "Pre-rev"
  growth?: string;     // "+28% YoY" | "—"
  highlight?: string;  // "Gartner Leader" | "YC W23"
  description: string;
}
```

---

## Key files

| File | Purpose |
|------|---------|
| `src/data/marketData.ts` | All market data + vendor lists (source of truth) |
| `src/components/presentation/CategorySection.tsx` | Per-market layout: spotlight cards + vendor tables |
| `src/components/presentation/VendorComparisonMatrix.tsx` | Cross-market sortable/filterable vendor table |
| `src/pages/MarketPage.tsx` | Per-market route page (`/market/:slug`) |
| `src/pages/Index.tsx` | Homepage |
| `wordpress-plugin/…/autonomous-it-insights.php` | WP plugin + WP-Cron weekly refresh via Claude API |
| `wordpress-plugin/…/templates/page-market-intel.php` | Full-screen HTML shell that mounts the React app |

---

## VendorComparisonMatrix

Rows are derived from `allCategories` — no separate hardcoded array. String fields (`marketCap`, `revenue`, `growth`) are parsed to numbers for sorting via `parseMarketCapNum`, `parseRevenueNum`, `parseGrowthNum` helpers. All 5 categories and all 5 types are represented. Currently shows ~502 vendors across all markets.

---

## WordPress Plugin — WP-Cron Auto-Refresh

Calls Claude API (`claude-haiku-4-5`) weekly to refresh vendor data. Prompt defined in `autonomous-it-insights.php` — instructs Claude to return the full `allCategories` array in 50+50 format with all `VendorEntry` fields.

---

## TypeScript Notes

- `CategoryData` interface uses `[key: string]: unknown` to allow `data.icon` (`LucideIcon`) without errors since `icon` is not formally typed.
- Use `export type { VendorEntry }` re-export in `marketData.ts` to avoid circular dependency issues.
