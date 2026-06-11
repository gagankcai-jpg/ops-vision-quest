import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

/* ─────────────────────────────────────────────────────────────────────────────
   Generates public/route-meta.json — a server-side SEO manifest.

   page-market-intel.php reads this at request time and injects the correct
   <title>, <meta description>, canonical, OpenGraph/Twitter tags, and JSON-LD
   into the HTML shell BEFORE React mounts — so crawlers and social scrapers
   see unique, per-route metadata instead of the generic fallback shell.

   The strings here mirror EXACTLY what the React pages emit client-side
   (MarketPage MARKET_META/MARKET_JSONLD, VendorDetailPage vendorMeta,
   PageMeta component, Index Helmet). Same source data → zero drift.

   Key format: route sub-path relative to /market-intelligence/, no slashes
   at the ends. e.g. "market/aiops", "vendor/itom/flexera", "signals".
───────────────────────────────────────────────────────────────────────────── */

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const SITE_NAME = 'AI Enterprise IT';
const BASE_URL = 'https://aienterpriseit.com/market-intelligence';
const ORG = { '@type': 'Organization', name: SITE_NAME, url: 'https://aienterpriseit.com' };
const LICENSE = 'https://creativecommons.org/licenses/by/4.0/';

// id → display title (matches each category data file's `title`)
const CATEGORY_TITLES = {
  aiops:    'AIOps & Observability',
  itom:     'IT Service, Operations & Asset Management',
  rpa:      'RPA & Intelligent Automation',
  agentops: 'Agentic IT Operations',
  secops:   'Security Operations (SecOps)',
};

// Mirrors MarketPage.tsx MARKET_META
const MARKET_META = {
  aiops:    { title: 'AIOps & Observability Market 2025–2030', description: 'AIOps market reaches $100B by 2030 at 22% CAGR. 100+ vendor profiles covering Dynatrace, Datadog, New Relic, Splunk, and more.' },
  itom:     { title: 'IT Service, Operations & Asset Management Market 2025–2030', description: 'ITSM, ITAM, and Cloud FinOps market reaches $94B by 2030 at 13% CAGR. 100+ vendor profiles: ServiceNow, BMC, Flexera, Tanium, Apptio, CAST AI, and more.' },
  rpa:      { title: 'RPA & Intelligent Automation Market 2025–2030', description: 'RPA market reaches $74B by 2030 at 25% CAGR. UiPath, Automation Anywhere, Blue Prism, and 97 more vendors analyzed.' },
  agentops: { title: 'Agentic Operations Market 2025–2030', description: 'Agentic IT Operations market reaches $8B by 2030 at 45% CAGR — the fastest-growing segment in the autonomous IT stack.' },
  secops:   { title: 'Security Operations Market 2025–2030', description: 'SecOps market reaches $54B by 2030 at 21% CAGR. CrowdStrike, Palo Alto Networks, SentinelOne, and 97 more vendors profiled.' },
};

// Mirrors MarketPage.tsx MARKET_JSONLD
const MARKET_JSONLD = {};
for (const [id, m] of Object.entries(MARKET_META)) {
  MARKET_JSONLD[id] = {
    '@context': 'https://schema.org', '@type': 'Dataset',
    name: m.title,
    description: MARKET_META[id].description,
    url: `${BASE_URL}/market/${id}`,
    license: LICENSE, creator: ORG, provider: ORG,
  };
}
// JSON-LD descriptions differ slightly from meta descriptions — restore the exact ones.
MARKET_JSONLD.aiops.description    = 'Market sizing, CAGR projections, and vendor profiles for 100+ AIOps and observability vendors. TAM reaches $100B by 2030 at 22% CAGR.';
MARKET_JSONLD.itom.description     = 'Market sizing, CAGR projections, and vendor profiles for 100+ ITSM, ITAM, and Cloud FinOps vendors. TAM reaches $94B by 2030 at 13% CAGR.';
MARKET_JSONLD.rpa.description      = 'Market sizing, CAGR projections, and vendor profiles for 100+ RPA and intelligent automation vendors. TAM reaches $74B by 2030 at 25% CAGR.';
MARKET_JSONLD.agentops.description = 'Market sizing, CAGR projections, and vendor profiles for 100+ agentic IT operations vendors. TAM reaches $8B by 2030 at 45% CAGR — the fastest-growing autonomous IT segment.';
MARKET_JSONLD.secops.description   = 'Market sizing, CAGR projections, and vendor profiles for 100+ SecOps vendors including SIEM, SOAR, XDR, and threat intelligence. TAM reaches $54B by 2030 at 21% CAGR.';

// toVendorSlug — identical to src/data/vendorProfiles.ts
function toVendorSlug(name) {
  return name
    .toLowerCase()
    .replace(/\s*\(.*?\)/g, '')
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Build {`${catId}/${slug}` → vendorName} from the category data files
const nameBySlug = {};
for (const catId of Object.keys(CATEGORY_TITLES)) {
  const src = readFileSync(join(root, `src/data/${catId}.ts`), 'utf8');
  for (const m of src.matchAll(/name:\s*"([^"]+)"/g)) {
    nameBySlug[`${catId}/${toVendorSlug(m[1])}`] = m[1];
  }
}

function titleCaseFromSlug(slug) {
  return slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

const routes = {};

// ── Static pages (mirror PageMeta / Index Helmet) ──────────────────────────────
routes['overview'] = {
  title: 'Autonomous IT Market Intelligence 2025–2030 | AI Enterprise IT',
  description: 'Analyst-grade market intelligence covering AIOps, ITOM, RPA, Agentic Operations, and Security Operations. 500+ vendors profiled. $330B+ combined TAM by 2030. Updated weekly.',
  canonical: `${BASE_URL}/`,
  ogType: 'website',
};
routes['pricing'] = {
  title: 'Vendor Pricing & TCO Comparison | AI Enterprise IT',
  description: 'Compare pricing models and total cost of ownership across 200+ AIOps, ITOM, RPA, AgentOps, and SecOps vendors. Free analyst-grade pricing intelligence.',
  canonical: `${BASE_URL}/pricing`,
};
routes['signals'] = {
  title: 'Autonomous IT Market Signals | AI Enterprise IT',
  description: 'Weekly signals across AIOps, ITOM, RPA, Agentic Operations, and SecOps — acquisitions, funding rounds, product launches, and analyst updates.',
  canonical: `${BASE_URL}/signals`,
};
routes['compare'] = {
  title: 'Vendor Comparison — AIOps, ITOM, RPA & More | AI Enterprise IT',
  description: 'Side-by-side comparison of enterprise IT vendors across AIOps, ITOM, RPA, Agentic Operations, and SecOps. Compare pricing, SWOT, user sentiment, and market position.',
  canonical: `${BASE_URL}/compare`,
};
routes['about'] = {
  title: 'About AI Enterprise IT | AI Enterprise IT',
  description: 'AI Enterprise IT provides analyst-grade market intelligence on autonomous IT — AIOps, ITOM, RPA, AgentOps, and SecOps. 500+ vendors profiled, updated weekly.',
  canonical: `${BASE_URL}/about`,
};

// ── Category (market) pages ────────────────────────────────────────────────────
for (const [id, m] of Object.entries(MARKET_META)) {
  routes[`market/${id}`] = {
    title: `${m.title} | ${SITE_NAME}`,
    description: m.description,
    canonical: `${BASE_URL}/market/${id}`,
    jsonld: MARKET_JSONLD[id],
  };
}

// ── Vendor profile pages ───────────────────────────────────────────────────────
const profileKeys = JSON.parse(readFileSync(join(root, 'public/vendor-slugs.json'), 'utf8'));
let vendorCount = 0;
const orphans = [];
for (const key of profileKeys) {
  const [catId, slug] = key.split('/');
  const catTitle = CATEGORY_TITLES[catId];
  if (!catTitle) continue;
  // Only emit meta for vendor routes that actually render — i.e. the slug resolves
  // to a real vendor in the category data. Profile-only "orphan" keys 404 on the
  // live React page (VendorDetailPage requires a matching vendor entry), so giving
  // them SEO metadata would advertise a not-found page. Skip them.
  const name = nameBySlug[key];
  if (!name) { orphans.push(key); continue; }
  routes[`vendor/${catId}/${slug}`] = {
    title: `${name} — ${catTitle} Market Position & SWOT 2026 | ${SITE_NAME}`,
    description: `${name} profile: market position, SWOT analysis, user sentiment, ICP, and future focus in the ${catTitle} market. Updated weekly.`,
    canonical: `${BASE_URL}/vendor/${catId}/${slug}`,
  };
  vendorCount++;
}

writeFileSync(join(root, 'public/route-meta.json'), JSON.stringify(routes, null, 0) + '\n');
console.log(`✓ Generated route-meta.json — ${Object.keys(routes).length} routes (${vendorCount} vendor profiles)`);
if (orphans.length) {
  console.log(`  ⚠ Skipped ${orphans.length} orphan profile keys (no matching vendor → page 404s): ${orphans.join(', ')}`);
}
