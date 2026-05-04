/**
 * generate-profiles.ts
 *
 * Generates VendorProfile + PricingInfo TypeScript for un-profiled vendors
 * using the Claude API. Avoids manual authoring for future expansions.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=xxx npx tsx scripts/generate-profiles.ts --category aiops
 *   ANTHROPIC_API_KEY=xxx npx tsx scripts/generate-profiles.ts --category itom --vendors "Ivanti,Atera"
 *   ANTHROPIC_API_KEY=xxx npx tsx scripts/generate-profiles.ts --category aiops --write
 *
 * Flags:
 *   --category <slug>     Required. One of: aiops, itom, rpa, agentops, secops
 *   --vendors <names>     Optional. Comma-separated vendor names to generate (subset).
 *                         If omitted, generates all un-profiled vendors in the category.
 *   --write               Optional. Appends generated TS to vendorProfiles.ts and pricingData.ts.
 *                         Without this flag, output is printed to stdout only.
 *
 * Dependencies:
 *   @anthropic-ai/sdk  (devDependency — add to package.json if not present)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ─── Minimal type shims so the script compiles standalone ────────────────────
// (The actual interfaces live in src/data/* — we re-declare minimal versions here)

interface VendorEntry {
  name: string;
  type: "leader" | "challenger" | "niche" | "startup" | "emerging";
  description: string;
  recentEvent?: string;
}

interface CategoryData {
  id: string;
  title: string;
  vendors: VendorEntry[];
  startups: VendorEntry[];
}

// ─── Path helpers ────────────────────────────────────────────────────────────

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const PROFILES_PATH = path.join(ROOT, "src/data/vendorProfiles.ts");
const PRICING_PATH = path.join(ROOT, "src/data/pricingData.ts");

// ─── Slug helper (mirrors toVendorSlug in vendorProfiles.ts) ─────────────────

function toVendorSlug(name: string): string {
  return name
    .replace(/\s*\(.*?\)\s*/g, " ")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ─── Load market data dynamically ───────────────────────────────────────────
// We import the compiled JS output if available, otherwise parse the TS source
// for vendor names directly (simpler for a script context).

async function loadMarketData(): Promise<CategoryData[]> {
  // Dynamic import via tsx transpilation
  const mod = await import("../src/data/marketData.js").catch(async () => {
    // Fallback: try direct TS import (when running under tsx)
    return import("../src/data/marketData.ts");
  });
  return mod.allCategories as CategoryData[];
}

// ─── Load existing profile keys from vendorProfiles.ts ───────────────────────

function loadExistingProfileKeys(): Set<string> {
  const src = fs.readFileSync(PROFILES_PATH, "utf-8");
  const keys = new Set<string>();
  const re = /"([\w-]+\/[\w-]+)":/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src)) !== null) {
    keys.add(m[1]);
  }
  return keys;
}

// ─── Claude API call ─────────────────────────────────────────────────────────

interface GeneratedData {
  profile: {
    competitiveEdge: string;
    swot: {
      strengths: string[];
      weaknesses: string[];
      opportunities: string[];
      threats: string[];
    };
    userLikes: string[];
    userComplaints: string[];
    customerProfile: {
      segments: string[];
      typicalBuyer: string;
      topUseCases: string[];
    };
    futureAreas: string[];
  };
  pricing: {
    pricingModel: string;
    transparency: string;
    startingPrice?: string;
    typicalACV?: string;
    marketSegment: string[];
    deploymentModel: string[];
    freeTrialOrTier: boolean;
    tcoBadge: string;
    keyPricingDrivers: string[];
    bottomLine: string;
  };
}

async function generateVendorData(
  vendor: VendorEntry,
  category: CategoryData
): Promise<GeneratedData> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY environment variable is not set.");
  }

  // Lazy-load the SDK to avoid hard dependency at import time
  const Anthropic = (await import("@anthropic-ai/sdk")).default;
  const client = new Anthropic({ apiKey });

  const prompt = `You are a B2B technology market analyst. Generate analyst-quality intelligence for:
  Vendor: ${vendor.name}
  Category: ${category.title} (${category.id})
  Segment: ${vendor.type}
  Description: ${vendor.description}

Return ONLY a JSON object (no markdown, no code fences) matching this structure:
{
  "profile": {
    "competitiveEdge": "<1-2 sentence unique differentiator>",
    "swot": {
      "strengths": ["<5 items>"],
      "weaknesses": ["<4 items>"],
      "opportunities": ["<4 items>"],
      "threats": ["<4 items>"]
    },
    "userLikes": ["<4 items>"],
    "userComplaints": ["<3 items>"],
    "customerProfile": {
      "segments": ["<2-3 segment labels>"],
      "typicalBuyer": "<job title / persona>",
      "topUseCases": ["<3 use cases>"]
    },
    "futureAreas": ["<4 items>"]
  },
  "pricing": {
    "pricingModel": "<one of: consumption | per-seat | enterprise-license | module-based | freemium | open-source-plus | platform-license>",
    "transparency": "<one of: public-list | limited-public | contact-sales>",
    "startingPrice": "<optional string, omit if not publicly listed>",
    "typicalACV": "<optional range string like $50K–$300K>",
    "marketSegment": ["<subset of: smb | mid-market | enterprise | fortune500>"],
    "deploymentModel": ["<subset of: saas | on-prem | hybrid>"],
    "freeTrialOrTier": <true|false>,
    "tcoBadge": "<one of: low | medium | high | very-high>",
    "keyPricingDrivers": ["<3 items>"],
    "bottomLine": "<1 sentence summary of pricing positioning>"
  }
}`;

  const message = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";

  // Strip any accidental markdown fences
  const cleaned = text.replace(/^```(?:json)?\s*/m, "").replace(/\s*```$/m, "").trim();

  try {
    return JSON.parse(cleaned) as GeneratedData;
  } catch (err) {
    throw new Error(
      `Failed to parse Claude response for ${vendor.name}:\n${cleaned}`
    );
  }
}

// ─── TypeScript serialization helpers ────────────────────────────────────────

function indent(str: string, spaces: number): string {
  const pad = " ".repeat(spaces);
  return str
    .split("\n")
    .map((l) => pad + l)
    .join("\n");
}

function serializeStringArray(arr: string[], indentSpaces: number): string {
  const pad = " ".repeat(indentSpaces);
  const inner = arr.map((s) => `${pad}  "${s.replace(/"/g, '\\"')}",`).join("\n");
  return `[\n${inner}\n${pad}]`;
}

function generateProfileTS(key: string, data: GeneratedData): string {
  const { profile, pricing } = data;
  const p = profile;
  const pr = pricing;

  const startingPriceLine = pr.startingPrice
    ? `\n    startingPrice: "${pr.startingPrice}",`
    : "";
  const typicalACVLine = pr.typicalACV
    ? `\n    typicalACV: "${pr.typicalACV}",`
    : "";

  return `  "${key}": {
    competitiveEdge: "${p.competitiveEdge.replace(/"/g, '\\"')}",
    swot: {
      strengths: ${indent(serializeStringArray(p.swot.strengths, 6), 0)},
      weaknesses: ${indent(serializeStringArray(p.swot.weaknesses, 6), 0)},
      opportunities: ${indent(serializeStringArray(p.swot.opportunities, 6), 0)},
      threats: ${indent(serializeStringArray(p.swot.threats, 6), 0)},
    },
    userLikes: ${indent(serializeStringArray(p.userLikes, 4), 0)},
    userComplaints: ${indent(serializeStringArray(p.userComplaints, 4), 0)},
    customerProfile: {
      segments: ${indent(serializeStringArray(p.customerProfile.segments, 6), 0)},
      typicalBuyer: "${p.customerProfile.typicalBuyer.replace(/"/g, '\\"')}",
      topUseCases: ${indent(serializeStringArray(p.customerProfile.topUseCases, 6), 0)},
    },
    futureAreas: ${indent(serializeStringArray(p.futureAreas, 4), 0)},
  },`;
}

function generatePricingTS(key: string, data: GeneratedData): string {
  const pr = data.pricing;

  const startingPriceLine = pr.startingPrice
    ? `\n    startingPrice: "${pr.startingPrice.replace(/"/g, '\\"')}",`
    : "";
  const typicalACVLine = pr.typicalACV
    ? `\n    typicalACV: "${pr.typicalACV.replace(/"/g, '\\"')}",`
    : "";

  return `  "${key}": {
    pricingModel: "${pr.pricingModel}",
    transparency: "${pr.transparency}",${startingPriceLine}${typicalACVLine}
    marketSegment: ${serializeStringArray(pr.marketSegment, 4)},
    deploymentModel: ${serializeStringArray(pr.deploymentModel, 4)},
    freeTrialOrTier: ${pr.freeTrialOrTier},
    tcoBadge: "${pr.tcoBadge}",
    keyPricingDrivers: ${serializeStringArray(pr.keyPricingDrivers, 4)},
    bottomLine: "${pr.bottomLine.replace(/"/g, '\\"')}",
  },`;
}

// ─── Append to data files ────────────────────────────────────────────────────

function appendToFile(filePath: string, newEntry: string): void {
  let src = fs.readFileSync(filePath, "utf-8");
  // Insert before the final closing `};`
  const insertPoint = src.lastIndexOf("};");
  if (insertPoint === -1) {
    throw new Error(`Could not find closing '};' in ${filePath}`);
  }
  src = src.slice(0, insertPoint) + "\n" + newEntry + "\n\n" + src.slice(insertPoint);
  fs.writeFileSync(filePath, src, "utf-8");
}

// ─── Delay helper ────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── CLI argument parsing ────────────────────────────────────────────────────

function parseArgs(): {
  categorySlug: string;
  vendorNames: string[] | null;
  write: boolean;
} {
  const args = process.argv.slice(2);
  let categorySlug = "";
  let vendorNames: string[] | null = null;
  let write = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--category" && args[i + 1]) {
      categorySlug = args[++i];
    } else if (args[i] === "--vendors" && args[i + 1]) {
      vendorNames = args[++i].split(",").map((v) => v.trim()).filter(Boolean);
    } else if (args[i] === "--write") {
      write = true;
    }
  }

  if (!categorySlug) {
    console.error(
      "Usage: npx tsx scripts/generate-profiles.ts --category <slug> [--vendors <name1,name2>] [--write]"
    );
    console.error("Valid slugs: aiops, itom, rpa, agentops, secops");
    process.exit(1);
  }

  return { categorySlug, vendorNames, write };
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const { categorySlug, vendorNames, write } = parseArgs();

  console.log(`\n🔍 Loading market data...`);
  const allCategories = await loadMarketData();
  const category = allCategories.find((c) => c.id === categorySlug);

  if (!category) {
    console.error(
      `Category "${categorySlug}" not found. Valid options: ${allCategories
        .map((c) => c.id)
        .join(", ")}`
    );
    process.exit(1);
  }

  const existingKeys = loadExistingProfileKeys();
  const allVendors: VendorEntry[] = [
    ...(category.vendors ?? []),
    ...(category.startups ?? []),
  ];

  // Filter to un-profiled vendors (or specified vendors)
  const targets = allVendors.filter((v) => {
    const key = `${categorySlug}/${toVendorSlug(v.name)}`;
    if (vendorNames) {
      return vendorNames.some(
        (n) => n.toLowerCase() === v.name.toLowerCase()
      );
    }
    return !existingKeys.has(key);
  });

  if (targets.length === 0) {
    console.log(
      `✅ All vendors in "${category.title}" already have profiles.`
    );
    return;
  }

  console.log(
    `📋 Generating profiles for ${targets.length} vendor(s) in ${category.title}:`
  );
  targets.forEach((v) =>
    console.log(`   - ${v.name} (${toVendorSlug(v.name)})`)
  );
  if (write) {
    console.log(`\n✏️  --write flag set: results will be appended to data files.`);
  } else {
    console.log(`\n📄 Dry run (no --write): output printed to stdout only.`);
  }
  console.log();

  const profileBlocks: string[] = [];
  const pricingBlocks: string[] = [];

  for (let i = 0; i < targets.length; i++) {
    const vendor = targets[i];
    const key = `${categorySlug}/${toVendorSlug(vendor.name)}`;
    console.log(
      `[${i + 1}/${targets.length}] Generating: ${vendor.name} → ${key}`
    );

    try {
      const data = await generateVendorData(vendor, category);
      const profileTS = generateProfileTS(key, data);
      const pricingTS = generatePricingTS(key, data);

      profileBlocks.push(profileTS);
      pricingBlocks.push(pricingTS);

      if (write) {
        appendToFile(PROFILES_PATH, profileTS);
        appendToFile(PRICING_PATH, pricingTS);
        console.log(`   ✅ Appended to data files.`);
      } else {
        console.log(`\n── vendorProfiles.ts entry ──────────────────────────`);
        console.log(profileTS);
        console.log(`\n── pricingData.ts entry ─────────────────────────────`);
        console.log(pricingTS);
        console.log();
      }
    } catch (err) {
      console.error(`   ❌ Error for ${vendor.name}:`, err);
    }

    // Rate limit: 500ms between calls
    if (i < targets.length - 1) {
      await sleep(500);
    }
  }

  console.log(`\n🎉 Done. Generated ${profileBlocks.length}/${targets.length} profiles.`);

  if (!write && profileBlocks.length > 0) {
    console.log(
      `\nRun with --write to append all ${profileBlocks.length} entries directly to the data files.`
    );
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
