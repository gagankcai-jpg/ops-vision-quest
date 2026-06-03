import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageMeta } from "@/components/seo/PageMeta";
import { motion, useReducedMotion } from "framer-motion";
import { Radio, BarChart3, Cpu, Bot, Sparkles, ShieldCheck, TrendingUp, Search, X, User } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Surface } from "@/components/ui/surface";
import { Stat } from "@/components/ui/stat";
import { useMarketData } from "@/hooks/useMarketData";
import { vendorProfiles, toVendorSlug } from "@/data/vendorProfiles";
import type { VendorEntry } from "@/components/presentation/CategorySection";
import { TYPE_BADGE, TYPE_LABEL } from "@/lib/pricingHelpers";
import { LAST_UPDATED } from "@/data/lastUpdated";
import { cn } from "@/lib/utils";

/* ─── Types ──────────────────────────────────────────────────────────────── */

type SignalType = "acquisition" | "funding" | "launch" | "ipo" | "partnership" | "update";

interface SignalEntry {
  vendorName: string;
  vendorSlug: string;
  categoryId: string;
  categoryTitle: string;
  categoryColor: string;
  type: string;
  event: string;
  parsedDate: number;
  hasProfile: boolean;
  signalType: SignalType;
}

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

const MONTHS: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

function parseEventDate(event: string): number {
  const m = event.match(/(\w{3})\s+(\d{4})/);
  if (!m || !(m[1] in MONTHS)) return 0;
  return new Date(+m[2], MONTHS[m[1]], 1).getTime();
}

function formatMonthYear(ts: number): string {
  if (ts === 0) return "Undated";
  const d = new Date(ts);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function inferSignalType(event: string): SignalType {
  const lower = event.toLowerCase();
  if (lower.includes("ipo") || lower.includes("went public") || lower.includes("nasdaq") || lower.includes("nyse")) return "ipo";
  if (lower.includes("acq.") || lower.includes("acquired") || lower.includes("acquisition") || lower.includes("acqui-hire") || lower.includes("merger")) return "acquisition";
  if (/series [a-f]/i.test(event) || lower.includes("raise") || lower.includes("raised") || lower.includes("funding") || /\$\d+m\b/i.test(event)) return "funding";
  if (lower.includes("partner") || lower.includes("partnership") || lower.includes("alliance") || lower.includes("integration")) return "partnership";
  if (lower.includes("launch") || lower.includes("launched") || lower.includes("released") || lower.includes("introduced") || lower.includes("announced") || lower.includes("unveil")) return "launch";
  return "update";
}

const SIGNAL_TYPE_CONFIG: Record<SignalType, { label: string; className: string }> = {
  acquisition: { label: "M&A",         className: "bg-orange-500/15 text-orange-400 border-orange-500/30" },
  funding:     { label: "Funding",      className: "bg-sky-500/15 text-sky-400 border-sky-500/30" },
  launch:      { label: "Launch",       className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  ipo:         { label: "IPO",          className: "bg-violet-500/15 text-violet-400 border-violet-500/30" },
  partnership: { label: "Partnership",  className: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  update:      { label: "Update",       className: "bg-slate-500/15 text-slate-400 border-slate-500/30" },
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  aiops:    <BarChart3 className="w-3.5 h-3.5" />,
  itom:     <Cpu className="w-3.5 h-3.5" />,
  rpa:      <Bot className="w-3.5 h-3.5" />,
  agentops: <Sparkles className="w-3.5 h-3.5" />,
  secops:   <ShieldCheck className="w-3.5 h-3.5" />,
};

const FILTER_ITEMS = [
  { id: "all",      label: "All" },
  { id: "aiops",    label: "AIOps" },
  { id: "itom",     label: "ITOM" },
  { id: "rpa",      label: "RPA" },
  { id: "agentops", label: "AgentOps" },
  { id: "secops",   label: "SecOps" },
];

/* ─── Signal builder (runs from live data when available) ─────────────────── */

function buildSignals(categories: ReturnType<typeof useMarketData>["data"]): SignalEntry[] {
  const seen = new Set<string>();
  return Object.values(categories)
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
          return {
            vendorName: v.name,
            vendorSlug: slug,
            categoryId: cat.id,
            categoryTitle: cat.title,
            categoryColor: color,
            type: v.type,
            event: v.recentEvent!,
            parsedDate: parseEventDate(v.recentEvent!),
            hasProfile: !!vendorProfiles[`${cat.id}/${slug}`],
            signalType: inferSignalType(v.recentEvent!),
          };
        })
        .filter((x): x is SignalEntry => x !== null);
    })
    .sort((a, b) => b.parsedDate - a.parsedDate || a.vendorName.localeCompare(b.vendorName));
}

/* ─── Main component ─────────────────────────────────────────────────────── */

const SignalsPage = () => {
  const [activeFilter, setActiveFilter]   = useState<string>("all");
  const [searchQuery, setSearchQuery]     = useState<string>("");
  const { data: liveData }                = useMarketData();
  const navigate                          = useNavigate();

  const allSignals = useMemo(() => buildSignals(liveData), [liveData]);

  const filtered = useMemo(() => {
    let results = activeFilter === "all"
      ? allSignals
      : allSignals.filter((s) => s.categoryId === activeFilter);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (s) => s.vendorName.toLowerCase().includes(q) || s.event.toLowerCase().includes(q)
      );
    }
    return results;
  }, [activeFilter, searchQuery, allSignals]);

  // Group by month — "Undated" always last
  const grouped = useMemo(() => {
    const groups = new Map<string, { ts: number; items: SignalEntry[] }>();
    for (const s of filtered) {
      const key = formatMonthYear(s.parsedDate);
      if (!groups.has(key)) groups.set(key, { ts: s.parsedDate, items: [] });
      groups.get(key)!.items.push(s);
    }
    return Array.from(groups.entries())
      .map(([label, { ts, items }]) => ({ label, ts, items }))
      .sort((a, b) => {
        if (a.label === "Undated") return 1;
        if (b.label === "Undated") return -1;
        return b.ts - a.ts;
      });
  }, [filtered]);

  const reduceMotion = useReducedMotion();

  return (
    <PageShell dataDate={LAST_UPDATED} footerLogoId="signals-footer">
      <PageMeta
        title="Autonomous IT Market Signals"
        description="Weekly signals across AIOps, ITOM, RPA, Agentic Operations, and SecOps — acquisitions, funding rounds, product launches, and analyst updates."
        canonical="https://aienterpriseit.com/market-intelligence/signals"
      />
      <div>
        {/* ── Hero ───────────────────────────────────────────────────────── */}
        <section className="container px-6 pt-10 pb-8">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              Live signals
            </p>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
              <div>
                <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Market Signals
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Recent moves, acquisitions, and funding rounds across the Autonomous IT Ops landscape.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Stat icon={<TrendingUp className="h-3.5 w-3.5" />} label="recent moves" value={allSignals.length} />
                <Stat icon={<Radio className="h-3.5 w-3.5" />} label="categories" value="5" />
              </div>
            </div>

            {/* Search + Filter row */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative max-w-sm flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search vendors or events…"
                  className="w-full rounded-full border border-border bg-card py-1.5 pl-9 pr-8 text-xs text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {FILTER_ITEMS.map((f) => {
                  const count = f.id === "all"
                    ? allSignals.length
                    : allSignals.filter((s) => s.categoryId === f.id).length;
                  const active = activeFilter === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => setActiveFilter(f.id)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      )}
                    >
                      {f.label}
                      <span className="ml-1.5 tabular-nums opacity-60">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {searchQuery && (
              <p className="mt-3 text-xs text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{filtered.length}</span> result{filtered.length !== 1 ? "s" : ""} for &ldquo;{searchQuery}&rdquo;
              </p>
            )}
          </motion.div>
        </section>

        {/* ── Timeline feed ─────────────────────────────────────────────── */}
        <section className="container px-6 pb-16">
          {grouped.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">No signals for this filter.</p>
          ) : (
            <div className="relative">
              {/* Continuous timeline rail */}
              <div
                aria-hidden
                className="absolute bottom-0 left-[6px] top-3 w-px bg-gradient-to-b from-border via-border/60 to-transparent sm:left-[7px]"
              />

              <div className="space-y-12">
                {grouped.map(({ label, items }, gi) => (
                  <motion.div
                    key={label}
                    initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: gi * 0.04 }}
                    className="relative pl-8"
                  >
                    {/* Month dot */}
                    <span
                      aria-hidden
                      className="absolute left-0 top-1 flex h-3.5 w-3.5 items-center justify-center"
                    >
                      <span className="h-3.5 w-3.5 rounded-full border-2 border-primary bg-background" />
                    </span>

                    {/* Month header */}
                    <div className="mb-4 flex items-baseline gap-3">
                      <h2 className="font-display text-base font-semibold tracking-tight text-foreground">
                        {label}
                      </h2>
                      <span className="rounded-full border border-border bg-muted/30 px-2 py-0.5 text-[10px] font-medium tabular-nums text-muted-foreground">
                        {items.length} event{items.length !== 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {items.map((s, i) => {
                        const vendorLink = s.hasProfile
                          ? `/vendor/${s.categoryId}/${s.vendorSlug}`
                          : `/market/${s.categoryId}`;
                        const sig = SIGNAL_TYPE_CONFIG[s.signalType];
                        return (
                          <Surface
                            key={`${s.categoryId}/${s.vendorSlug}/${i}`}
                            variant="default"
                            padding="md"
                            interactive
                            onClick={() => navigate(vendorLink)}
                            className="group flex items-start gap-4"
                          >
                            <div
                              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border"
                              style={{
                                color: s.categoryColor,
                                borderColor: `${s.categoryColor}40`,
                                backgroundColor: `${s.categoryColor}12`,
                              }}
                            >
                              {CATEGORY_ICONS[s.categoryId] ?? <Radio className="h-3.5 w-3.5" />}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                                <Link
                                  to={vendorLink}
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-sm font-semibold text-foreground transition-colors hover:text-primary"
                                >
                                  {s.vendorName}
                                </Link>
                                <span className={cn("rounded-full border px-1.5 py-0.5 text-[9px] font-semibold", sig.className)}>
                                  {sig.label}
                                </span>
                                <span className={cn("rounded-full border px-1.5 py-0.5 text-[9px] font-semibold", TYPE_BADGE[s.type] ?? "")}>
                                  {TYPE_LABEL[s.type] ?? s.type}
                                </span>
                                <span
                                  className="rounded-full border px-1.5 py-0.5 text-[9px] font-semibold"
                                  style={{
                                    color: s.categoryColor,
                                    borderColor: `${s.categoryColor}40`,
                                    backgroundColor: `${s.categoryColor}15`,
                                  }}
                                >
                                  {s.categoryTitle}
                                </span>
                              </div>
                              <p className="text-sm leading-snug text-muted-foreground">{s.event}</p>
                            </div>

                            {s.hasProfile && (
                              <div className="mt-0.5 flex shrink-0 items-center gap-1 text-[10px] font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                                <User className="h-3 w-3" />
                                Profile
                              </div>
                            )}
                          </Surface>
                        );
                      })}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </PageShell>
  );
};

export default SignalsPage;
