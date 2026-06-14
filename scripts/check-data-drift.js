// Data drift detector — compares the LIVE WP-Cron snapshot (REST: ait/v1/markets, refreshed
// autonomously and never written back to git) against the static catalog in src/data/<market>.ts
// (the committed source of truth). Surfaces silent divergence in market sizing and vendor coverage.
//
//   node scripts/check-data-drift.js           # report (always exits 0)
//   node scripts/check-data-drift.js --strict   # exit 1 if any drift is found (CI / monitoring)
//
// Read-only. No tokens. Needs network (hits the production REST API).

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const STRICT = process.argv.includes('--strict');
const API = process.env.AIT_API_BASE || 'https://aienterpriseit.com/wp-json/ait/v1';
const MARKETS = ['aiops', 'itom', 'rpa', 'agentops', 'secops'];

const norm = (s) => String(s ?? '').replace(/[$,\s]/g, '').toLowerCase();
const vname = (s) => String(s ?? '').toLowerCase().replace(/\s*\(.*?\)\s*/g, '').trim();

// Pull a header string field (title/tam2030/cagr) and all vendor names out of the .ts source.
function readStatic(slug) {
  const src = readFileSync(join(root, 'src', 'data', `${slug}.ts`), 'utf8');
  const field = (name) => (src.match(new RegExp(`${name}:\\s*"([^"]*)"`)) || [])[1];
  const names = [...src.matchAll(/name:\s*"([^"]*)"/g)].map((m) => m[1]);
  return {
    title: field('title'),
    tam2030: field('tam2030'),
    cagr: field('cagr'),
    vendors: new Set(names.map(vname)),
  };
}

async function main() {
  let lastRefresh = 'unknown';
  try {
    const status = await (await fetch(`${API}/status`)).json();
    lastRefresh = status.last_refresh || 'unknown';
  } catch { /* non-fatal */ }

  let live;
  try {
    live = await (await fetch(`${API}/markets`)).json();
  } catch (e) {
    console.error(`✗ Could not reach live REST API at ${API}/markets — ${e.message}`);
    process.exit(2);
  }

  console.log(`Live snapshot last refreshed: ${lastRefresh}`);
  console.log(`Comparing live REST snapshot ↔ static src/data/*.ts\n`);

  let drift = 0;

  for (const slug of MARKETS) {
    const stat = readStatic(slug);
    const data = live?.[slug]?.data || {};
    const issues = [];

    for (const f of ['title', 'tam2030', 'cagr']) {
      if (stat[f] != null && data[f] != null && norm(stat[f]) !== norm(data[f])) {
        issues.push(`  ${f}: static "${stat[f]}"  ≠  live "${data[f]}"`);
      }
    }

    const liveVendors = (data.topVendors || []).map((v) => vname(v.name));
    const liveOnly = liveVendors.filter((n) => n && !stat.vendors.has(n));
    if (liveOnly.length) {
      issues.push(`  live topVendors absent from static catalog: ${liveOnly.join(', ')}`);
    }

    if (issues.length) {
      drift += issues.length;
      console.log(`▲ ${slug}`);
      for (const i of issues) console.log(i);
      console.log('');
    } else {
      console.log(`✓ ${slug} — in sync`);
    }
  }

  console.log('');
  if (drift === 0) {
    console.log('✓ No drift between live snapshot and static catalog.');
    process.exit(0);
  }
  console.log(`${drift} drift signal(s) found. The live DB has diverged from the committed seed.`);
  console.log('Reconcile by re-running the data refresh + redeploy, or updating src/data/*.ts to match.');
  process.exit(STRICT ? 1 : 0);
}

main();
