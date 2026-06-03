import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { PageShell } from "@/components/layout/PageShell";
import { PageMeta } from "@/components/seo/PageMeta";
import { LAST_UPDATED } from "@/data/lastUpdated";
import { allCategories } from "@/data/marketData";
import { toVendorSlug } from "@/data/vendorProfiles";
import {
  pricingData,
  type PricingInfo,
  type PricingModel,
  type TCOBadge,
  type MarketSegment,
} from "@/data/pricingData";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Surface } from "@/components/ui/surface";
import { cn } from "@/lib/utils";
import {
  DollarSign,
  TrendingUp,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  XCircle,
  X,
  Building2,
  Layers,
  Server,
  Cloud,
  BarChart3,
  Cpu,
  Bot,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

/* ── Constants ───────────────────────────────────────────────────────────── */

const SLUG_ORDER = ["aiops", "itom", "rpa", "agentops", "secops"];

const categoryIcons: Record<string, React.ReactNode> = {
  aiops:    <BarChart3 className="w-3.5 h-3.5" />,
  itom:     <Cpu className="w-3.5 h-3.5" />,
  rpa:      <Bot className="w-3.5 h-3.5" />,
  agentops: <Sparkles className="w-3.5 h-3.5" />,
  secops:   <ShieldCheck className="w-3.5 h-3.5" />,
};

const MODEL_LABELS: Record<PricingModel, string> = {
  "consumption":        "Consumption",
  "per-seat":           "Per Seat",
  "enterprise-license": "Enterprise License",
  "module-based":       "Module-Based",
  "freemium":           "Freemium",
  "open-source-plus":   "Open Source+",
  "platform-license":   "Platform License",
};

const MODEL_COLORS: Record<PricingModel, string> = {
  "consumption":        "bg-sky-500/15 text-sky-300 border-sky-500/30",
  "per-seat":           "bg-violet-500/15 text-violet-300 border-violet-500/30",
  "enterprise-license": "bg-slate-500/15 text-slate-300 border-slate-500/30",
  "module-based":       "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
  "freemium":           "bg-teal-500/15 text-teal-300 border-teal-500/30",
  "open-source-plus":   "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  "platform-license":   "bg-zinc-500/15 text-zinc-300 border-zinc-500/30",
};

const TCO_COLORS: Record<TCOBadge, string> = {
  "low":       "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  "medium":    "bg-amber-500/15 text-amber-300 border-amber-500/30",
  "high":      "bg-orange-500/15 text-orange-300 border-orange-500/30",
  "very-high": "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

const TCO_LABELS: Record<TCOBadge, string> = {
  "low":       "Low TCO",
  "medium":    "Medium TCO",
  "high":      "High TCO",
  "very-high": "Very High TCO",
};

const TRANSPARENCY_LABELS: Record<string, string> = {
  "public-list":   "Public Pricing",
  "limited-public": "Limited Public",
  "contact-sales": "Contact Sales",
};

const TRANSPARENCY_COLORS: Record<string, string> = {
  "public-list":    "text-emerald-400",
  "limited-public": "text-amber-400",
  "contact-sales":  "text-muted-foreground",
};

const SEGMENT_LABELS: Record<MarketSegment, string> = {
  "smb":         "SMB",
  "mid-market":  "Mid-Market",
  "enterprise":  "Enterprise",
  "fortune500":  "Fortune 500",
};

/* ── PricingCard ─────────────────────────────────────────────────────────── */

interface PricingCardProps {
  vendorName: string;
  vendorType: string;
  pricing: PricingInfo;
  categoryId: string;
  index: number;
}

function PricingCard({ vendorName, vendorType, pricing, categoryId, index }: PricingCardProps) {
  const navigate = useNavigate();
  const vendorSlug = toVendorSlug(vendorName);

  const isLeader = vendorType === "leader" || vendorType === "challenger" || vendorType === "niche";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
    >
      <Surface
        variant="default"
        padding="md"
        interactive
        className="group flex h-full flex-col gap-3"
        onClick={() => navigate(`/vendor/${categoryId}/${vendorSlug}`)}
      >
        <div className="flex h-full flex-col gap-3">
          {/* Row 1: type + TCO badge */}
          <div className="flex items-center justify-between gap-2">
            <span className={cn(
              "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
              isLeader
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-warning/30 bg-warning/10 text-warning"
            )}>
              {isLeader ? "Leader" : "To Watch"}
            </span>
            <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider", TCO_COLORS[pricing.tcoBadge])}>
              {TCO_LABELS[pricing.tcoBadge]}
            </span>
          </div>

          {/* Row 2: vendor name + pricing model */}
          <div>
            <h3 className="font-semibold text-foreground text-sm leading-snug mb-1.5">
              {vendorName}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${MODEL_COLORS[pricing.pricingModel]}`}>
                {MODEL_LABELS[pricing.pricingModel]}
              </span>
              <span className={`text-[10px] font-medium ${TRANSPARENCY_COLORS[pricing.transparency]}`}>
                {TRANSPARENCY_LABELS[pricing.transparency]}
              </span>
            </div>
          </div>

          {/* Row 3: prices */}
          {(pricing.startingPrice || pricing.typicalACV) && (
            <div className="border-t border-border/50 pt-2.5 flex flex-col gap-1">
              {pricing.startingPrice && (
                <div className="flex items-start gap-1.5">
                  <DollarSign className="w-3 h-3 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Starting</span>
                    <p className="text-xs text-foreground leading-snug">{pricing.startingPrice}</p>
                  </div>
                </div>
              )}
              {pricing.typicalACV && (
                <div className="flex items-start gap-1.5">
                  <TrendingUp className="w-3 h-3 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Typical ACV</span>
                    <p className="text-xs text-foreground leading-snug">{pricing.typicalACV}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Row 4: market segment + deployment + free trial */}
          <div className="border-t border-border/50 pt-2.5 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Building2 className="w-3 h-3 text-muted-foreground shrink-0" />
              {pricing.marketSegment.map((seg) => (
                <span key={seg} className="text-[10px] bg-secondary/60 text-muted-foreground px-1.5 py-0.5 rounded">
                  {SEGMENT_LABELS[seg]}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {pricing.deploymentModel.includes("saas") && (
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Cloud className="w-3 h-3" /> SaaS
                </span>
              )}
              {pricing.deploymentModel.includes("on-prem") && (
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Server className="w-3 h-3" /> On-Prem
                </span>
              )}
              {pricing.deploymentModel.includes("hybrid") && (
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Layers className="w-3 h-3" /> Hybrid
                </span>
              )}
              <span className="ml-auto flex items-center gap-1 text-[10px]">
                {pricing.freeTrialOrTier
                  ? <><CheckCircle2 className="h-3 w-3 text-success" /><span className="text-success">Free Trial</span></>
                  : <><XCircle className="h-3 w-3 text-muted-foreground/50" /><span className="text-muted-foreground/50">No Trial</span></>
                }
              </span>
            </div>
          </div>

          {/* Row 5: key pricing drivers */}
          <div className="border-t border-border/50 pt-2.5 flex-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">Key cost drivers</p>
            <ul className="flex flex-col gap-1">
              {pricing.keyPricingDrivers.map((driver, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground leading-snug">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-muted-foreground/50 shrink-0" />
                  {driver}
                </li>
              ))}
            </ul>
          </div>

          {/* Row 6: bottom line + view profile CTA */}
          <div className="flex flex-col gap-2 border-t border-border/50 pt-2.5">
            <p className="font-serif text-[11px] italic leading-snug text-muted-foreground">
              {pricing.bottomLine}
            </p>
            <div className="flex items-center justify-end gap-1 text-primary transition-colors group-hover:text-primary/80">
              <span className="text-[10px] font-medium">View profile</span>
              <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </Surface>
    </motion.div>
  );
}

/* ── Filter types ────────────────────────────────────────────────────────── */

type FilterState = {
  pricingModels: Set<PricingModel>;
  tcoBadges: Set<TCOBadge>;
  segments: Set<MarketSegment>;
};

const emptyFilters = (): FilterState => ({
  pricingModels: new Set(),
  tcoBadges: new Set(),
  segments: new Set(),
});

function hasActiveFilters(f: FilterState) {
  return f.pricingModels.size > 0 || f.tcoBadges.size > 0 || f.segments.size > 0;
}

function toggle<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

function vendorPassesFilter(pricing: PricingInfo, filters: FilterState): boolean {
  if (filters.pricingModels.size > 0 && !filters.pricingModels.has(pricing.pricingModel)) return false;
  if (filters.tcoBadges.size > 0 && !filters.tcoBadges.has(pricing.tcoBadge)) return false;
  if (filters.segments.size > 0) {
    const hasMatch = pricing.marketSegment.some((s) => filters.segments.has(s));
    if (!hasMatch) return false;
  }
  return true;
}

/* ── FilterChip ──────────────────────────────────────────────────────────── */

function FilterChip({
  label,
  active,
  colorClass,
  onClick,
}: {
  label: string;
  active: boolean;
  colorClass?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-[11px] font-medium px-2.5 py-1 rounded-full border transition-all duration-150 ${
        active
          ? (colorClass ?? "bg-primary/20 text-primary border-primary/40")
          : "bg-secondary/40 text-muted-foreground border-border hover:border-border/80 hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}

/* ── PricingPage ─────────────────────────────────────────────────────────── */

const PricingPage = () => {
  const [activeTab, setActiveTab] = useState(SLUG_ORDER[0]);
  const [filters, setFilters] = useState<FilterState>(emptyFilters());

  // Build per-category vendor+pricing pairs (leaders and to-watch) upfront
  const categoryData = useMemo(() => {
    return SLUG_ORDER.map((slug) => {
      const cat = allCategories.find((c) => c.id === slug)!;
      const leaders = cat.vendors.slice(0, 5).flatMap((v) => {
        const key = `${slug}/${toVendorSlug(v.name)}`;
        const p = pricingData[key];
        return p ? [{ vendor: v, pricing: p }] : [];
      });
      const toWatch = cat.startups.slice(0, 5).flatMap((v) => {
        const key = `${slug}/${toVendorSlug(v.name)}`;
        const p = pricingData[key];
        return p ? [{ vendor: v, pricing: p }] : [];
      });
      return { cat, leaders, toWatch };
    });
  }, []);

  // Active tab's data filtered
  const activeCatData = useMemo(() => {
    const found = categoryData.find((d) => d.cat.id === activeTab);
    if (!found) return null;
    return {
      ...found,
      leaders: found.leaders.filter(({ pricing }) => vendorPassesFilter(pricing, filters)),
      toWatch: found.toWatch.filter(({ pricing }) => vendorPassesFilter(pricing, filters)),
    };
  }, [categoryData, activeTab, filters]);

  // Count vendors per tab (for badge)
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const { cat, leaders, toWatch } of categoryData) {
      const filtered = [...leaders, ...toWatch].filter(({ pricing }) =>
        vendorPassesFilter(pricing, filters)
      );
      counts[cat.id] = filtered.length;
    }
    return counts;
  }, [categoryData, filters]);

  const active = hasActiveFilters(filters);

  return (
    <PageShell dataDate={LAST_UPDATED} footerLogoId="pricing-footer">
      <PageMeta
        title="Vendor Pricing & TCO Comparison"
        description="Compare pricing models and total cost of ownership across 200+ AIOps, ITOM, RPA, AgentOps, and SecOps vendors. Free analyst-grade pricing intelligence."
        canonical="https://aienterpriseit.com/market-intelligence/pricing"
      />
      <div className="pt-4">
        {/* ── Hero ───────────────────────────────────────────────────────── */}
        <section className="container px-6 pt-10 pb-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="text-xs font-medium border-primary/40 text-primary">
                <DollarSign className="w-3 h-3 mr-1" />
                Pricing Intelligence
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-3">
              Pricing & TCO Intelligence
            </h1>
            <p className="text-muted-foreground max-w-2xl leading-relaxed mb-4">
              Understand how 50 leading vendors charge — pricing models, TCO signals, and market
              segment fit across AIOps, ITOM, RPA, AgentOps, and SecOps.
            </p>
            {/* Disclaimer */}
            <div className="flex items-start gap-2 bg-amber-500/8 border border-amber-500/20 rounded-lg px-4 py-3 max-w-2xl">
              <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-300/80 leading-relaxed">
                Pricing data is analyst-synthesized from public sources, analyst reports, and buyer
                community data. It is provided for directional guidance only. Contact vendors
                directly for current quotes and contract terms.
              </p>
            </div>
          </motion.div>
        </section>

        {/* ── Sticky Filter Bar ──────────────────────────────────────────── */}
        <div className="sticky top-[64px] z-40 bg-background/95 backdrop-blur-md border-b border-border">
          <div className="container px-6 py-3 flex flex-wrap items-center gap-3">
            {/* Pricing Model filters */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider mr-0.5">Model</span>
              {(Object.entries(MODEL_LABELS) as [PricingModel, string][]).map(([model, label]) => (
                <FilterChip
                  key={model}
                  label={label}
                  active={filters.pricingModels.has(model)}
                  colorClass={`border ${MODEL_COLORS[model]}`}
                  onClick={() => setFilters((f) => ({ ...f, pricingModels: toggle(f.pricingModels, model) }))}
                />
              ))}
            </div>

            <div className="h-4 w-px bg-border hidden sm:block" />

            {/* TCO filters */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider mr-0.5">TCO</span>
              {(["low", "medium", "high", "very-high"] as TCOBadge[]).map((tco) => (
                <FilterChip
                  key={tco}
                  label={TCO_LABELS[tco]}
                  active={filters.tcoBadges.has(tco)}
                  colorClass={`border ${TCO_COLORS[tco]}`}
                  onClick={() => setFilters((f) => ({ ...f, tcoBadges: toggle(f.tcoBadges, tco) }))}
                />
              ))}
            </div>

            <div className="h-4 w-px bg-border hidden sm:block" />

            {/* Segment filters */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider mr-0.5">Segment</span>
              {(["smb", "mid-market", "enterprise", "fortune500"] as MarketSegment[]).map((seg) => (
                <FilterChip
                  key={seg}
                  label={SEGMENT_LABELS[seg]}
                  active={filters.segments.has(seg)}
                  onClick={() => setFilters((f) => ({ ...f, segments: toggle(f.segments, seg) }))}
                />
              ))}
            </div>

            {/* Clear */}
            <AnimatePresence>
              {active && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => setFilters(emptyFilters())}
                  className="flex items-center gap-1.5 ml-auto text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear filters
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Category Tabs ──────────────────────────────────────────────── */}
        <div className="container px-6 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex h-auto w-full justify-start gap-1 overflow-x-auto rounded-lg border border-border bg-card/50 p-1 sm:w-auto">
              {categoryData.map(({ cat }) => (
                <TabsTrigger
                  key={cat.id}
                  value={cat.id}
                  className="flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-2 text-xs font-medium text-muted-foreground transition-colors data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"
                >
                  {categoryIcons[cat.id]}
                  <span>{cat.id === "agentops" ? "AgentOps" : cat.id === "aiops" ? "AIOps" : cat.id === "secops" ? "SecOps" : cat.id.toUpperCase()}</span>
                  {active && (
                    <span className="ml-0.5 rounded-full bg-primary-foreground/20 px-1.5 py-0 text-[10px] tabular-nums">
                      {tabCounts[cat.id]}
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            {categoryData.map(({ cat }) => (
              <TabsContent key={cat.id} value={cat.id} className="mt-6">
                {activeCatData && (
                  <>
                    {/* Leaders section */}
                    <div className="mb-8">
                      <div className="flex items-center gap-2 mb-4">
                        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Leaders</h2>
                        <span className="text-[10px] text-muted-foreground">
                          {activeCatData.leaders.length} of 5
                          {active && activeCatData.leaders.length < 5 && " matched filters"}
                        </span>
                      </div>
                      {activeCatData.leaders.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-6 text-center">
                          No leaders match your current filters.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                          {activeCatData.leaders.map(({ vendor, pricing }, i) => (
                            <PricingCard
                              key={vendor.name}
                              vendorName={vendor.name}
                              vendorType={vendor.type}
                              pricing={pricing}
                              categoryId={cat.id}
                              index={i}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* To Watch section */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">To Watch</h2>
                        <span className="text-[10px] text-muted-foreground">
                          {activeCatData.toWatch.length} of 5
                          {active && activeCatData.toWatch.length < 5 && " matched filters"}
                        </span>
                      </div>
                      {activeCatData.toWatch.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-6 text-center">
                          No startups match your current filters.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                          {activeCatData.toWatch.map(({ vendor, pricing }, i) => (
                            <PricingCard
                              key={vendor.name}
                              vendorName={vendor.name}
                              vendorType={vendor.type}
                              pricing={pricing}
                              categoryId={cat.id}
                              index={i}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>

      </div>
    </PageShell>
  );
};

export default PricingPage;
