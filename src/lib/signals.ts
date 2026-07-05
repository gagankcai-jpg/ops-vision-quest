import { toVendorSlug } from "@/lib/vendorSlug";
import { profiledVendorKeys } from "@/data/profileKeys";
import type { VendorEntry } from "@/components/presentation/CategorySection";

/* Shared signal-feed builder used by SignalsPage and SignalsTeaser. */

export type SignalType = "acquisition" | "funding" | "launch" | "ipo" | "partnership" | "update";

export type DatePrecision = "month" | "year" | "none";

export interface SignalEntry {
  vendorName: string;
  vendorSlug: string;
  categoryId: string;
  categoryTitle: string;
  categoryColor: string;
  type: string;
  event: string;
  parsedDate: number;
  datePrecision: DatePrecision;
  hasProfile: boolean;
  signalType: SignalType;
}

const MONTHS: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

const MONTH_YEAR_RE = /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})\b/;
const BARE_YEAR_RE = /\b(20\d{2})\b/;

/* Year-only events ("2025: …") sort at Jan 15 of that year: they stay in the
   timeline (not "Undated") but land near the bottom of their year, so a vague
   year-only event never outranks concretely-dated recent months. */
export function parseEventDate(event: string): { ts: number; precision: DatePrecision } {
  const m = event.match(MONTH_YEAR_RE);
  if (m) return { ts: new Date(+m[2], MONTHS[m[1]], 1).getTime(), precision: "month" };
  const y = event.match(BARE_YEAR_RE);
  if (y) return { ts: new Date(+y[1], 0, 15).getTime(), precision: "year" };
  if (import.meta.env.DEV) console.warn(`[signals] Undated event string: "${event}"`);
  return { ts: 0, precision: "none" };
}

export function formatSignalGroup(s: Pick<SignalEntry, "parsedDate" | "datePrecision">): string {
  if (s.datePrecision === "none") return "Undated";
  const d = new Date(s.parsedDate);
  if (s.datePrecision === "year") return String(d.getFullYear());
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function inferSignalType(event: string): SignalType {
  const lower = event.toLowerCase();
  if (lower.includes("ipo") || lower.includes("went public") || lower.includes("nasdaq") || lower.includes("nyse")) return "ipo";
  if (lower.includes("acq.") || lower.includes("acquired") || lower.includes("acquisition") || lower.includes("acqui-hire") || lower.includes("merger")) return "acquisition";
  if (/series [a-f]/i.test(event) || lower.includes("raise") || lower.includes("raised") || lower.includes("funding") || /\$\d+m\b/i.test(event)) return "funding";
  if (lower.includes("partner") || lower.includes("partnership") || lower.includes("alliance") || lower.includes("integration")) return "partnership";
  if (lower.includes("launch") || lower.includes("launched") || lower.includes("released") || lower.includes("introduced") || lower.includes("announced") || lower.includes("unveil")) return "launch";
  return "update";
}

interface SignalSourceCategory {
  id: string;
  title: string;
  [key: string]: unknown;
}

export function buildSignals(categories: readonly SignalSourceCategory[]): SignalEntry[] {
  const seen = new Set<string>();
  return categories
    .flatMap((cat) => {
      const color = (cat as { color?: string }).color ?? "#0EA5E9";
      const entries: VendorEntry[] = [
        ...((cat.vendors as VendorEntry[] | undefined) ?? []),
        ...((cat.startups as VendorEntry[] | undefined) ?? []),
      ];
      return entries
        .filter((v) => !!v.recentEvent)
        .map((v) => {
          const slug = toVendorSlug(v.name);
          const key = `${cat.id}/${slug}`;
          if (seen.has(key)) return null;
          seen.add(key);
          const { ts, precision } = parseEventDate(v.recentEvent!);
          return {
            vendorName: v.name,
            vendorSlug: slug,
            categoryId: cat.id,
            categoryTitle: cat.title,
            categoryColor: color,
            type: v.type,
            event: v.recentEvent!,
            parsedDate: ts,
            datePrecision: precision,
            hasProfile: profiledVendorKeys.has(key),
            signalType: inferSignalType(v.recentEvent!),
          };
        })
        .filter((x): x is SignalEntry => x !== null);
    })
    .sort((a, b) => b.parsedDate - a.parsedDate || a.vendorName.localeCompare(b.vendorName));
}
