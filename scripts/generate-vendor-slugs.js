import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const src = readFileSync(join(root, 'src/data/vendorProfiles.ts'), 'utf8');

// Extract keys of the form "category/vendor-slug": from the vendorProfiles record
const keys = [...src.matchAll(/^\s+"([a-z][a-z0-9]*\/[a-z0-9][a-z0-9-]*)"\s*:/gm)].map(m => m[1]);

writeFileSync(join(root, 'public/vendor-slugs.json'), JSON.stringify(keys, null, 2) + '\n');
console.log(`✓ Generated ${keys.length} vendor slugs → public/vendor-slugs.json`);
