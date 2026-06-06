// Build-time regression watchdog (Step 2 monitor — build surface).
// Validates src/data/<market>.ts coverage + ranking invariants against the pinned
// baseline in scripts/data-baseline.json. Exits non-zero (fails the build) on any
// violation so a manual data edit can't ship broken counts or drop an anchor leader.
// Zero network / zero tokens. Run as the FIRST step of `npm run build`.
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const baseline = JSON.parse(readFileSync(join(__dirname, 'data-baseline.json'), 'utf8'));

const EST_TYPES = new Set(baseline.types.established);
const STARTUP_TYPES = new Set(baseline.types.startups);

// Pull {name, type} pairs out of a TS array region. Tolerant regex: matches a
// `name: "..."` followed (within a small window) by its `type: "..."`.
function parseEntries(region) {
  const re = /name:\s*"([^"]*)"[\s\S]{0,400}?type:\s*"([a-z]+)"/g;
  const out = [];
  let m;
  while ((m = re.exec(region))) out.push({ name: m[1], type: m[2] });
  return out;
}

function splitRegions(src) {
  const sIdx = src.indexOf('startups:');
  const vIdx = src.indexOf('vendors:');
  if (vIdx < 0 || sIdx < 0 || sIdx < vIdx) return null;
  return { established: src.slice(vIdx, sIdx), startups: src.slice(sIdx) };
}

const errors = [];

for (const [slug, rule] of Object.entries(baseline.markets)) {
  let src;
  try {
    src = readFileSync(join(root, 'src', 'data', `${slug}.ts`), 'utf8');
  } catch {
    errors.push(`${slug}: src/data/${slug}.ts not found`);
    continue;
  }
  const regions = splitRegions(src);
  if (!regions) { errors.push(`${slug}: could not locate vendors[]/startups[] regions`); continue; }

  const established = parseEntries(regions.established);
  const startups = parseEntries(regions.startups);

  // Coverage
  if (established.length < rule.establishedMin)
    errors.push(`${slug}: established ${established.length} < min ${rule.establishedMin}`);
  if (startups.length < baseline.startupsMin)
    errors.push(`${slug}: startups ${startups.length} < min ${baseline.startupsMin}`);

  // Enum integrity + empty-name guard
  for (const v of established) {
    if (!v.name) errors.push(`${slug}: established entry with empty name`);
    if (!EST_TYPES.has(v.type)) errors.push(`${slug}: established "${v.name}" has invalid type "${v.type}"`);
  }
  for (const s of startups) {
    if (!STARTUP_TYPES.has(s.type)) errors.push(`${slug}: startup "${s.name}" has invalid type "${s.type}"`);
  }

  // Tier floors (catch a leader/challenger collapse)
  const counts = { leader: 0, challenger: 0, niche: 0 };
  for (const v of established) if (counts[v.type] !== undefined) counts[v.type]++;
  if (counts.leader < rule.leaderMin)
    errors.push(`${slug}: leader ${counts.leader} < min ${rule.leaderMin}`);
  if (counts.challenger < rule.challengerMin)
    errors.push(`${slug}: challenger ${counts.challenger} < min ${rule.challengerMin}`);
  if (counts.niche < rule.nicheMin)
    errors.push(`${slug}: niche ${counts.niche} < min ${rule.nicheMin}`);

  // Ranking anchors: each must be present AND tier leader|challenger (never dropped/demoted)
  for (const anchor of rule.anchors) {
    const hit = established.find((v) => v.name.toLowerCase().includes(anchor));
    if (!hit) errors.push(`${slug}: anchor "${anchor}" missing from established vendors`);
    else if (hit.type === 'niche')
      errors.push(`${slug}: anchor "${anchor}" demoted to niche (was leader/challenger)`);
  }
}

if (errors.length) {
  console.error('\n✗ data invariant check FAILED:\n  - ' + errors.join('\n  - ') + '\n');
  process.exit(1);
}
console.log('✓ data invariant check passed (coverage + rankings within baseline)');
