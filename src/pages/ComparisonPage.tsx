import { useState, useMemo, useCallback } from "react";
import { PageMeta } from "@/components/seo/PageMeta";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitCompare, Plus, X, Search, ArrowUpRight, DollarSign, BarChart2,
  TrendingUp, ShieldCheck, TrendingDown, AlertTriangle, Lightbulb,
  ThumbsUp, AlertCircle, Users, Target, Cloud, Server, Layers,
  CheckCircle2, XCircle, CreditCard,
} from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Surface } from "@/components/ui/surface";
import { cn } from "@/lib/utils";
import { allCategories } from "@/data/marketData";
import { vendorProfiles, toVendorSlug } from "@/data/vendorProfiles";
import { pricingData } from "@/data/pricingData";
import type { VendorEntry } from "@/components/presentation/CategorySection";
import type { VendorProfile } from "@/data/vendorProfiles";
import type { PricingInfo } from "@/data/pricingData";
import {
  MODEL_LABELS, MODEL_COLORS, TCO_COLORS, TCO_LABELS,
  SEGMENT_LABELS, DEPLOY_LABELS, TRANSPARENCY_LABELS,
  TYPE_BADGE, TYPE_LABEL,
} from "@/lib/pricingHelpers";
import { LAST_UPDATED } from "@/data/lastUpdated";

/* ─── Types ──────────────────────────────────────────────────────────────── */

interface VendorData {
  key: string;              // "cat/slug"
  categoryId: string;
  vendorSlug: string;
  entry: VendorEntry;
  profile: VendorProfile;
  pricing?: PricingInfo;
  categoryTitle: string;
  categoryColor: string;
}

/* ─── Flat vendor index for "Add vendor" search ──────────────────────────── */

interface ProfiledVendor {
  key: string;
  vendorName: string;
  vendorSlug: string;
  categoryId: string;
  categoryTitle: string;
  type: string;
  description: string;
}

const PROFILED_VENDORS: ProfiledVendor[] = allCategories.flatMap((cat) => {
  const entries: VendorEntry[] = [
    ...((cat.vendors as VendorEntry[] | undefined) ?? []),
    ...((cat.startups as VendorEntry[] | undefined) ?? []),
  ];
  return entries
    .map((v) => {
      const slug = toVendorSlug(v.name);
      const key = `${cat.id}/${slug}`;
      return { key, vendorName: v.name, vendorSlug: slug, categoryId: cat.id, categoryTitle: cat.title, type: v.type, description: v.description };
    })
    .filter((v) => !!vendorProfiles[v.key]);
});

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

function resolveVendorData(key: string): VendorData | null {
  const [catId, slug] = key.split("/");
  const cat = allCategories.find((c) => c.id === catId);
  if (!cat) return null;
  const entries: VendorEntry[] = [
    ...((cat.vendors as VendorEntry[] | undefined) ?? []),
    ...((cat.startups as VendorEntry[] | undefined) ?? []),
  ];
  const entry = entries.find((v) => toVendorSlug(v.name) === slug);
  const profile = vendorProfiles[key];
  if (!entry || !profile) return null;
  return {
    key,
    categoryId: catId,
    vendorSlug: slug,
    entry,
    profile,
    pricing: pricingData[key] as PricingInfo | undefined,
    categoryTitle: cat.title,
    categoryColor: (cat as { color?: string }).color ?? "#0EA5E9",
  };
}

function GrowthPill({ value }: { value?: string }) {
  if (!value || value === "—") return <span className="text-muted-foreground text-xs">—</span>;
  const isPos = value.startsWith("+");
  return <span className={`text-xs font-semibold ${isPos ? "text-emerald-400" : "text-rose-400"}`}>{value}</span>;
}

/* ─── Add-vendor mini-search ─────────────────────────────────────────────── */

function AddVendorSearch({
  excluded,
  onSelect,
  onClose,
}: {
  excluded: string[];
  onSelect: (key: string) => void;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const lq = q.trim().toLowerCase();
    if (!lq) return PROFILED_VENDORS.filter((v) => !excluded.includes(v.key)).slice(0, 8);
    return PROFILED_VENDORS
      .filter((v) => !excluded.includes(v.key) && (
        v.vendorName.toLowerCase().includes(lq) ||
        v.categoryTitle.toLowerCase().includes(lq) ||
        v.description.toLowerCase().includes(lq)
      ))
      .slice(0, 8);
  }, [q, excluded]);

  return (
    <div className="absolute top-full left-0 mt-2 w-80 z-50 bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <Search className="w-4 h-4 text-muted-foreground shrink-0" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search profiled vendors…"
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
        />
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>
      <ul className="max-h-64 overflow-y-auto">
        {results.length === 0 ? (
          <li className="px-4 py-3 text-sm text-muted-foreground">No vendors found</li>
        ) : (
          results.map((v) => (
            <li key={v.key}>
              <button
                onClick={() => { onSelect(v.key); onClose(); }}
                className="w-full text-left px-4 py-2.5 hover:bg-secondary/50 flex items-center gap-3 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-foreground block truncate">{v.vendorName}</span>
                  <span className="text-[10px] text-muted-foreground/60">{v.categoryTitle}</span>
                </div>
                <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border shrink-0 ${TYPE_BADGE[v.type] ?? ""}`}>
                  {TYPE_LABEL[v.type] ?? v.type}
                </span>
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

/* ─── Section row label ──────────────────────────────────────────────────── */

function RowLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 py-3 border-t border-border bg-muted/20 px-4">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</span>
    </div>
  );
}

/* ─── Empty-state picker — lets users start a comparison from /compare ─── */

function EmptyComparePicker({ onSelect }: { onSelect: (key: string) => void }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const lq = q.trim().toLowerCase();
    if (!lq) return PROFILED_VENDORS.slice(0, 24);
    return PROFILED_VENDORS
      .filter((v) =>
        v.vendorName.toLowerCase().includes(lq) ||
        v.categoryTitle.toLowerCase().includes(lq) ||
        v.description.toLowerCase().includes(lq)
      )
      .slice(0, 24);
  }, [q]);

  return (
    <div className="container px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <GitCompare className="mx-auto mb-4 h-10 w-10 text-primary" />
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Vendor Comparison
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Pick up to three vendors to see SWOT, sentiment, pricing, customer profile, and future
            focus side by side.
          </p>
        </div>

        <div className="relative mb-6">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            autoFocus
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search profiled vendors by name, category, or description…"
            className="w-full rounded-xl border border-border bg-card py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        {filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No vendors found. Try a different search.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {filtered.map((v) => (
              <li key={v.key}>
                <button
                  onClick={() => onSelect(v.key)}
                  className="group flex w-full items-start gap-3 rounded-lg border border-border bg-card px-4 py-3 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                        {v.vendorName}
                      </span>
                      <span className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[9px] font-semibold ${TYPE_BADGE[v.type] ?? ""}`}>
                        {TYPE_LABEL[v.type] ?? v.type}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {v.categoryTitle}
                    </p>
                  </div>
                  <Plus className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Tip: you can also add vendors from a profile page or from any vendor table on the site.
        </p>
      </div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */

const ComparisonPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);

  // Parse ?v= param
  const vendorKeys = useMemo(() => {
    const raw = searchParams.get("v") ?? "";
    return raw.split(",").filter(Boolean).slice(0, 3);
  }, [searchParams]);

  const vendors = useMemo(
    () => vendorKeys.map(resolveVendorData).filter(Boolean) as VendorData[],
    [vendorKeys]
  );

  const addVendor = useCallback((key: string) => {
    const next = [...vendorKeys, key].slice(0, 3);
    setSearchParams({ v: next.join(",") });
  }, [vendorKeys, setSearchParams]);

  const removeVendor = useCallback((key: string) => {
    const next = vendorKeys.filter((k) => k !== key);
    if (next.length === 0) {
      navigate("/");
    } else {
      setSearchParams({ v: next.join(",") });
    }
  }, [vendorKeys, setSearchParams, navigate]);

  const colClass = vendors.length === 1 ? "grid-cols-1 max-w-xl" :
    vendors.length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-3";

  const nCols = vendors.length;

  // Empty state — let users start a comparison directly from this page
  if (vendors.length === 0) {
    return (
      <PageShell footerLogoId="compare-empty-footer">
        <EmptyComparePicker onSelect={(key) => setSearchParams({ v: key })} />
      </PageShell>
    );
  }

  return (
    <PageShell dataDate={LAST_UPDATED} footerLogoId="compare-footer">
      <PageMeta
        title="Vendor Comparison — AIOps, ITOM, RPA & More"
        description="Side-by-side comparison of enterprise IT vendors across AIOps, ITOM, RPA, Agentic Operations, and SecOps. Compare pricing, SWOT, user sentiment, and market position."
        canonical="https://aienterpriseit.com/market-intelligence/compare"
      />
      <div>
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <section className="container px-6 py-8 border-b border-border">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-wrap items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <GitCompare className="w-6 h-6 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Vendor Comparison</h1>
                <p className="text-xs text-muted-foreground">
                  Comparing {vendors.length} vendor{vendors.length !== 1 ? "s" : ""} · Side-by-side SWOT, pricing & sentiment
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 relative">
              {vendors.length < 3 && (
                <>
                  <button
                    onClick={() => setShowSearch((v) => !v)}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add vendor
                  </button>
                  <AnimatePresence>
                    {showSearch && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -8 }}
                        transition={{ duration: 0.15 }}
                      >
                        <AddVendorSearch
                          excluded={vendorKeys}
                          onSelect={addVendor}
                          onClose={() => setShowSearch(false)}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            </div>
          </motion.div>
        </section>

        {/* ── Comparison grid ────────────────────────────────────────────── */}
        <section className="container px-6 py-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >

            {/* ── Vendor header cards ── */}
            <div className={cn("mb-8 grid gap-4", colClass)}>
              {vendors.map((v) => (
                <Surface
                  key={v.key}
                  variant="default"
                  padding="lg"
                  className="group relative"
                >
                  <button
                    onClick={() => removeVendor(v.key)}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground p-1"
                    title="Remove"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span
                      className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full border"
                      style={{
                        color: v.categoryColor,
                        borderColor: `${v.categoryColor}40`,
                        backgroundColor: `${v.categoryColor}15`,
                      }}
                    >
                      {v.categoryTitle}
                    </span>
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${TYPE_BADGE[v.entry.type] ?? ""}`}>
                      {TYPE_LABEL[v.entry.type] ?? v.entry.type}
                    </span>
                  </div>

                  <Link to={`/vendor/${v.categoryId}/${v.vendorSlug}`} className="group/link">
                    <h2 className="font-bold text-lg text-foreground group-hover/link:text-primary transition-colors leading-tight flex items-center gap-1.5">
                      {v.entry.name}
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                    </h2>
                  </Link>
                  <p className="text-xs text-muted-foreground mt-1.5 mb-3 leading-snug line-clamp-2">{v.entry.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {v.entry.marketCap && v.entry.marketCap !== "—" && (
                      <div className="flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2 py-1">
                        <DollarSign className="h-3 w-3 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground">Val</span>
                        <span className="text-[10px] font-semibold tabular-nums text-foreground">{v.entry.marketCap}</span>
                      </div>
                    )}
                    {v.entry.revenue && v.entry.revenue !== "—" && (
                      <div className="flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2 py-1">
                        <BarChart2 className="h-3 w-3 text-muted-foreground" />
                        <span className="text-[10px] font-semibold tabular-nums text-foreground">{v.entry.revenue}</span>
                      </div>
                    )}
                    {v.entry.growth && v.entry.growth !== "—" && (
                      <div className="flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2 py-1">
                        <TrendingUp className="h-3 w-3 text-muted-foreground" />
                        <GrowthPill value={v.entry.growth} />
                      </div>
                    )}
                  </div>
                </Surface>
              ))}
            </div>

            {/* ── Comparison table ── */}
            <div className="overflow-hidden rounded-xl border border-border bg-card/40">

              {/* Pricing */}
              <RowLabel icon={<CreditCard className="w-4 h-4" />} label="Pricing & TCO" />
              <div className={`grid ${colClass} divide-x divide-border`}>
                {vendors.map((v) => (
                  <div key={v.key} className="p-4">
                    {v.pricing ? (
                      <div className="space-y-2.5">
                        <div className="flex flex-wrap gap-1.5">
                          <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${MODEL_COLORS[v.pricing.pricingModel]}`}>
                            {MODEL_LABELS[v.pricing.pricingModel]}
                          </span>
                          <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${TCO_COLORS[v.pricing.tcoBadge]}`}>
                            {TCO_LABELS[v.pricing.tcoBadge]}
                          </span>
                          <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full border flex items-center gap-0.5 ${v.pricing.freeTrialOrTier ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-border bg-muted/40 text-muted-foreground"}`}>
                            {v.pricing.freeTrialOrTier ? <CheckCircle2 className="w-2.5 h-2.5" /> : <XCircle className="w-2.5 h-2.5" />}
                            {v.pricing.freeTrialOrTier ? "Free Trial" : "No Free Tier"}
                          </span>
                        </div>
                        {v.pricing.startingPrice && (
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Starting</p>
                            <p className="text-xs font-semibold text-foreground">{v.pricing.startingPrice}</p>
                          </div>
                        )}
                        {v.pricing.typicalACV && (
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Typical ACV</p>
                            <p className="text-xs font-semibold text-foreground">{v.pricing.typicalACV}</p>
                          </div>
                        )}
                        <div className="flex flex-wrap gap-1">
                          {v.pricing.deploymentModel.map((d) => (
                            <span key={d} className="text-[9px] px-1.5 py-0.5 rounded border border-border bg-muted/40 text-muted-foreground flex items-center gap-0.5">
                              {d === "saas" ? <Cloud className="w-2.5 h-2.5" /> : d === "on-prem" ? <Server className="w-2.5 h-2.5" /> : <Layers className="w-2.5 h-2.5" />}
                              {DEPLOY_LABELS[d]}
                            </span>
                          ))}
                        </div>
                        <p className="text-[10px] text-muted-foreground italic">{v.pricing.bottomLine}</p>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground/40">No pricing data</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Competitive Edge */}
              <RowLabel icon={<ShieldCheck className="w-4 h-4" />} label="Competitive Edge" />
              <div className={`grid ${colClass} divide-x divide-border`}>
                {vendors.map((v) => (
                  <div key={v.key} className="p-4">
                    <p className="text-xs text-muted-foreground italic leading-snug">"{v.profile.competitiveEdge}"</p>
                  </div>
                ))}
              </div>

              {/* Strengths */}
              <RowLabel icon={<ShieldCheck className="w-4 h-4 text-emerald-400" />} label="Strengths (Top 3)" />
              <div className={`grid ${colClass} divide-x divide-border`}>
                {vendors.map((v) => (
                  <div key={v.key} className="p-4">
                    <ul className="space-y-1.5">
                      {v.profile.swot.strengths.slice(0, 3).map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs leading-snug">
                          <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                          <span className="text-muted-foreground">{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Weaknesses */}
              <RowLabel icon={<TrendingDown className="w-4 h-4 text-rose-400" />} label="Weaknesses (Top 3)" />
              <div className={`grid ${colClass} divide-x divide-border`}>
                {vendors.map((v) => (
                  <div key={v.key} className="p-4">
                    <ul className="space-y-1.5">
                      {v.profile.swot.weaknesses.slice(0, 3).map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs leading-snug">
                          <span className="mt-1 w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                          <span className="text-muted-foreground">{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Opportunities */}
              <RowLabel icon={<Lightbulb className="w-4 h-4 text-sky-400" />} label="Opportunities" />
              <div className={`grid ${colClass} divide-x divide-border`}>
                {vendors.map((v) => (
                  <div key={v.key} className="p-4">
                    <ul className="space-y-1.5">
                      {v.profile.swot.opportunities.slice(0, 3).map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs leading-snug">
                          <span className="mt-1 w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                          <span className="text-muted-foreground">{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Threats */}
              <RowLabel icon={<AlertTriangle className="w-4 h-4 text-amber-400" />} label="Threats" />
              <div className={`grid ${colClass} divide-x divide-border`}>
                {vendors.map((v) => (
                  <div key={v.key} className="p-4">
                    <ul className="space-y-1.5">
                      {v.profile.swot.threats.slice(0, 3).map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs leading-snug">
                          <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                          <span className="text-muted-foreground">{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* User Likes */}
              <RowLabel icon={<ThumbsUp className="w-4 h-4 text-emerald-400" />} label="What Users Love" />
              <div className={`grid ${colClass} divide-x divide-border`}>
                {vendors.map((v) => (
                  <div key={v.key} className="p-4">
                    <ul className="space-y-1.5">
                      {v.profile.userLikes.slice(0, 3).map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs leading-snug">
                          <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                          <span className="text-muted-foreground">{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Complaints */}
              <RowLabel icon={<AlertCircle className="w-4 h-4 text-rose-400" />} label="Common Complaints" />
              <div className={`grid ${colClass} divide-x divide-border`}>
                {vendors.map((v) => (
                  <div key={v.key} className="p-4">
                    <ul className="space-y-1.5">
                      {v.profile.userComplaints.slice(0, 2).map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs leading-snug">
                          <span className="mt-1 w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                          <span className="text-muted-foreground">{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Customer Profile */}
              <RowLabel icon={<Users className="w-4 h-4" />} label="Ideal Customer Profile" />
              <div className={`grid ${colClass} divide-x divide-border`}>
                {vendors.map((v) => (
                  <div key={v.key} className="p-4 space-y-2.5">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Typical Buyer</p>
                      <p className="text-xs font-medium text-foreground">{v.profile.customerProfile.typicalBuyer}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Segments</p>
                      <div className="flex flex-wrap gap-1">
                        {v.profile.customerProfile.segments.slice(0, 3).map((seg, i) => (
                          <span key={i} className="text-[9px] px-1.5 py-0.5 rounded border border-border bg-muted/40 text-muted-foreground">{seg}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Top Use Cases</p>
                      <ol className="space-y-1">
                        {v.profile.customerProfile.topUseCases.slice(0, 3).map((uc, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-xs leading-snug">
                            <span className="shrink-0 w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[9px] font-bold">{i + 1}</span>
                            <span className="text-muted-foreground">{uc}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                ))}
              </div>

              {/* Full profile links */}
              <RowLabel icon={<Target className="w-4 h-4" />} label="Full Profiles" />
              <div className={`grid ${colClass} divide-x divide-border`}>
                {vendors.map((v) => (
                  <div key={v.key} className="p-4">
                    <Link
                      to={`/vendor/${v.categoryId}/${v.vendorSlug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-400 hover:text-sky-300 transition-colors"
                    >
                      View full profile <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>

            </div>
          </motion.div>
        </section>

      </div>
    </PageShell>
  );
};

export default ComparisonPage;
