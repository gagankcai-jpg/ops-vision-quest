import { describe, it, expect } from "vitest";
import { allCategories } from "@/data";
import baseline from "../../scripts/data-baseline.json";

// TS-level mirror of scripts/check-data-invariants.js (which parses the .ts source with
// regex at build time). This runs against the *imported* data objects, so it also catches
// runtime/shape drift the regex can't see. Driven by the same pinned baseline.

const EST_TYPES = new Set(baseline.types.established);
const STARTUP_TYPES = new Set(baseline.types.startups);
const ALL_TYPES = new Set([...EST_TYPES, ...STARTUP_TYPES]);

describe("market data coverage", () => {
  it("exposes exactly the five expected markets", () => {
    const ids = allCategories.map((c) => c.id).sort();
    expect(ids).toEqual(["agentops", "aiops", "itom", "rpa", "secops"]);
  });

  for (const [slug, rule] of Object.entries(baseline.markets)) {
    describe(slug, () => {
      const cat = allCategories.find((c) => c.id === slug)!;

      it("exists with vendors + startups arrays", () => {
        expect(cat, `category ${slug} missing`).toBeTruthy();
        expect(Array.isArray(cat.vendors)).toBe(true);
        expect(Array.isArray(cat.startups)).toBe(true);
      });

      it(`carries >= ${rule.establishedMin} established vendors`, () => {
        expect(cat.vendors.length).toBeGreaterThanOrEqual(rule.establishedMin);
      });

      it(`carries >= ${baseline.startupsMin} startups`, () => {
        expect(cat.startups.length).toBeGreaterThanOrEqual(baseline.startupsMin);
      });

      it("uses only valid established / startup types", () => {
        for (const v of cat.vendors) expect(EST_TYPES.has(v.type), `${slug} vendor "${v.name}" has non-established type "${v.type}"`).toBe(true);
        for (const s of cat.startups) expect(STARTUP_TYPES.has(s.type), `${slug} startup "${s.name}" has non-startup type "${s.type}"`).toBe(true);
      });

      it("meets per-tier minimums among established vendors", () => {
        const n = (t: string) => cat.vendors.filter((v) => v.type === t).length;
        expect(n("leader")).toBeGreaterThanOrEqual(rule.leaderMin);
        expect(n("challenger")).toBeGreaterThanOrEqual(rule.challengerMin);
        expect(n("niche")).toBeGreaterThanOrEqual(rule.nicheMin);
      });

      it("retains all anchor vendors as leader|challenger", () => {
        const top = cat.vendors
          .filter((v) => v.type === "leader" || v.type === "challenger")
          .map((v) => v.name.toLowerCase());
        for (const anchor of rule.anchors) {
          expect(top.some((name) => name.includes(anchor)), `${slug} lost anchor "${anchor}"`).toBe(true);
        }
      });

      it("has non-empty name + description on every entry", () => {
        for (const e of [...cat.vendors, ...cat.startups]) {
          expect(e.name?.trim().length, `empty name in ${slug}`).toBeGreaterThan(0);
          expect(e.description?.trim().length, `empty description for "${e.name}" in ${slug}`).toBeGreaterThan(0);
          expect(ALL_TYPES.has(e.type)).toBe(true);
        }
      });
    });
  }

  it("totals at least 504 vendor profiles across all markets", () => {
    const total = allCategories.reduce((sum, c) => sum + c.vendors.length + c.startups.length, 0);
    expect(total).toBeGreaterThanOrEqual(504);
  });
});
