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

1. `npm run build` — outputs to `dist/`

2. Rsync assets to the server:
```bash
rsync -avz -e "ssh -i ~/.ssh/hostinger_deploy -p 65002 -o StrictHostKeyChecking=no" \
  dist/assets/ \
  u552630707@82.29.199.42:/home/u552630707/domains/aienterpriseit.com/public_html/wp-content/plugins/autonomous-it-insights/app/assets/
```

3. Update asset hashes in the PHP template — file: `wordpress-plugin/autonomous-it-insights/templates/page-market-intel.php`
   - Update `assets/index-XXXXXXXX.css` and `assets/index-XXXXXXXX.js` to match new Vite output filenames in `dist/assets/`

4. Rsync the updated PHP template:
```bash
rsync -avz -e "ssh -i ~/.ssh/hostinger_deploy -p 65002 -o StrictHostKeyChecking=no" \
  wordpress-plugin/autonomous-it-insights/templates/page-market-intel.php \
  u552630707@82.29.199.42:/home/u552630707/domains/aienterpriseit.com/public_html/wp-content/plugins/autonomous-it-insights/templates/
```

5. Purge LiteSpeed cache — required after every deploy or changes won't appear:
```bash
ssh -i ~/.ssh/hostinger_deploy -p 65002 u552630707@82.29.199.42 \
  "wp --path=/home/u552630707/domains/aienterpriseit.com/public_html litespeed-purge all"
```

---

## Architecture

### Router

Uses `HashRouter` (not `BrowserRouter`) — WordPress doesn't support server-side rewrite rules for SPA routes. Per-market routes use `#/market/:slug` hash format.

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
