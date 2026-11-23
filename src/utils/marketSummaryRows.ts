import { allCategories } from "@/data/marketData";

const parseBillions = (v: unknown) => parseFloat(String(v ?? "").replace(/[$B,]/g, "")) || 0;
const fmt = (n: number) => `$${n.toFixed(1)}B`;

/** Executive-summary rows (category, TAM 2025, TAM 2030, CAGR) built from the live market data. */
export function marketSummaryRows(): string[][] {
  const rows = allCategories.map((c) => [
    String(c.title),
    String(c.tam2025),
    String(c.tam2030),
    String(c.cagr),
  ]);
  const t25 = allCategories.reduce((s, c) => s + parseBillions(c.tam2025), 0);
  const t30 = allCategories.reduce((s, c) => s + parseBillions(c.tam2030), 0);
  const cagr = t25 > 0 ? (Math.pow(t30 / t25, 1 / 5) - 1) * 100 : 0;
  rows.push(["Combined Total", fmt(t25), fmt(t30), `${cagr.toFixed(1)}%`]);
  return rows;
}
