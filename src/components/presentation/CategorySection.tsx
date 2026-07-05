import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  TrendingUp, DollarSign, Target, ChevronDown, ChevronUp,
  Building2, Rocket, ArrowUpRight, Info, ChevronRight,
  Lightbulb, Compass,
} from "lucide-react";
import MarketChart from "./MarketChart";
import { toVendorSlug } from "@/lib/vendorSlug";
import { profiledVendorKeys } from "@/data/profileKeys";
import { Surface } from "@/components/ui/surface";
import { Stat } from "@/components/ui/stat";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { cn } from "@/lib/utils";

/* ─── Vendor type ────────────────────────────────────────────────────────── */
export interface VendorEntry {
  name: string;
  type: "leader" | "challenger" | "niche" | "startup" | "emerging";
  /** e.g. "$42.3B", "Private – $2.4B val", "Div. of IBM", "—" */
  marketCap?: string;
  /** e.g. "$2.1B ARR", "$890M Rev", "Est. $60M ARR", "Pre-rev" */
  revenue?: string;
  /** e.g. "+28% YoY", "+65%", "—" */
  growth?: string;
  /** short badge: "Gartner Leader", "Fastest Growth", "YC W23" */
  highlight?: string;
  description: string;
  /** recent funding / acquisition event */
  recentEvent?: string;
  /** legacy field kept for backward compat */
  metric?: string;
}

/* ─── Category data shape ────────────────────────────────────────────────── */
interface UseCase  { title: string; description: string }
interface Trend    { title: string; description: string }

export interface CategoryData {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  colorClass: string;
  tam2025: string;
  tam2030: string;
  cagr: string;
  chartData: Array<{ year: string; value: number }>;
  tamScope?: string;
  sources?: string[];
  vendors?: VendorEntry[];
  startups?: VendorEntry[];
  /** legacy compat */
  topVendors?: VendorEntry[];
  emergingVendors?: VendorEntry[];
  useCases: UseCase[];
  trends: Trend[];
  opportunities: string[];
  [key: string]: unknown;
}

interface CategorySectionProps {
  data: CategoryData;
  index: number;
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const TYPE_BADGE: Record<string, string> = {
  leader:     "bg-info/15 text-info border-info/30",
  challenger: "bg-executive-purple/15 text-executive-purple border-executive-purple/30",
  niche:      "bg-muted/40 text-muted-foreground border-border",
  startup:    "bg-success/15 text-success border-success/30",
  emerging:   "bg-warning/15 text-warning border-warning/30",
};

const TYPE_LABEL: Record<string, string> = {
  leader: "Leader", challenger: "Challenger", niche: "Niche",
  startup: "Startup", emerging: "Emerging",
};

function GrowthPill({ value }: { value?: string }) {
  if (!value || value === "—") return <span className="text-muted-foreground">—</span>;
  const isPos = value.startsWith("+");
  return (
    <span className={cn("tabular-nums font-medium", isPos ? "text-success" : "text-danger")}>
      {value}
    </span>
  );
}

/* ─── Spotlight card (top-5) ─────────────────────────────────────────────── */
function SpotlightCard({
  vendor, rank, color, delay, categoryId,
}: { vendor: VendorEntry; rank: number; color: string; delay: number; categoryId: string }) {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const slug = toVendorSlug(vendor.name);
  const hasProfile = profiledVendorKeys.has(`${categoryId}/${slug}`);

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay }}
      onClick={() => hasProfile && navigate(`/vendor/${categoryId}/${slug}`)}
      className={cn(
        "group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-all",
        hasProfile ? "cursor-pointer hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md" : "cursor-default"
      )}
    >
      {/* rank chip */}
      <div
        className="absolute -top-2.5 -left-2.5 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white shadow-md"
        style={{ backgroundColor: color }}
      >
        {rank}
      </div>

      {/* header */}
      <div className="mt-1 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h4 className="text-base font-semibold leading-tight text-foreground">{vendor.name}</h4>
          <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-muted-foreground">{vendor.description}</p>
        </div>
        {vendor.highlight && (
          <span
            className="shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold"
            style={{ color, borderColor: `${color}40`, backgroundColor: `${color}15` }}
          >
            {vendor.highlight}
          </span>
        )}
      </div>

      {/* metrics row */}
      <div className="grid grid-cols-3 gap-1 border-t border-border/70 pt-3 text-center">
        <div>
          <div className="mb-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">Mkt Cap</div>
          <div className="truncate text-xs font-semibold text-foreground tabular-nums">{vendor.marketCap ?? vendor.metric ?? "—"}</div>
        </div>
        <div>
          <div className="mb-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">Revenue</div>
          <div className="truncate text-xs font-semibold text-foreground tabular-nums">{vendor.revenue ?? "—"}</div>
        </div>
        <div>
          <div className="mb-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">Growth</div>
          <div className="text-xs">
            <GrowthPill value={vendor.growth} />
          </div>
        </div>
      </div>

      {/* recent event strip */}
      {vendor.recentEvent && (
        <div className="flex items-center gap-1.5 border-t border-warning/20 pt-2">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
          <span className="line-clamp-2 text-[10px] font-medium leading-snug text-warning">{vendor.recentEvent}</span>
        </div>
      )}

      {/* CTA */}
      {hasProfile ? (
        <div className="mt-auto flex items-center justify-end gap-1 pt-1 text-primary transition-colors group-hover:text-primary/80">
          <span className="text-[10px] font-medium">View profile</span>
          <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </div>
      ) : (
        <div className="mt-auto flex items-center justify-end gap-1 pt-1 text-muted-foreground/40">
          <span className="text-[10px]">No profile</span>
        </div>
      )}
    </motion.div>
  );
}

/* ─── Full vendor table ───────────────────────────────────────────────────── */
function VendorTable({
  entries, color, initialRows = 10, categoryId,
}: { entries: VendorEntry[]; color: string; initialRows?: number; categoryId: string }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? entries : entries.slice(0, initialRows);

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="w-10 px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">#</th>
              <th className="min-w-[170px] px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Company</th>
              <th className="hidden w-[90px] px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">Type</th>
              <th className="hidden w-[130px] px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">Mkt Cap / Val</th>
              <th className="hidden w-[120px] px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">Revenue</th>
              <th className="hidden w-[100px] px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground lg:table-cell">Growth</th>
              <th className="hidden w-[150px] px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground xl:table-cell">Highlight</th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Description</th>
              <th className="w-10 px-4 py-3" aria-label="Profile" />
            </tr>
          </thead>
          <tbody>
            {visible.map((v, i) => {
              const slug = toVendorSlug(v.name);
              const hasProfile = profiledVendorKeys.has(`${categoryId}/${slug}`);
              return (
                <tr key={v.name} className="border-b border-border/40 align-top transition-colors last:border-b-0 hover:bg-secondary/25">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground tabular-nums">{i + 1}</td>
                  <td className="px-4 py-3">
                    {hasProfile ? (
                      <Link
                        to={`/vendor/${categoryId}/${slug}`}
                        className="whitespace-nowrap font-semibold text-foreground transition-colors hover:text-primary"
                      >
                        {v.name}
                      </Link>
                    ) : (
                      <div className="whitespace-nowrap font-semibold text-foreground">{v.name}</div>
                    )}
                    {v.recentEvent && (
                      <div className="mt-0.5 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
                        <span className="text-[10px] font-medium leading-snug text-warning">{v.recentEvent}</span>
                      </div>
                    )}
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", TYPE_BADGE[v.type] ?? TYPE_BADGE.niche)}>
                      {TYPE_LABEL[v.type] ?? v.type}
                    </span>
                  </td>
                  <td className="hidden whitespace-nowrap px-4 py-3 text-xs text-muted-foreground tabular-nums md:table-cell">
                    {v.marketCap ?? v.metric ?? "—"}
                  </td>
                  <td className="hidden whitespace-nowrap px-4 py-3 text-xs text-muted-foreground tabular-nums md:table-cell">
                    {v.revenue ?? "—"}
                  </td>
                  <td className="hidden px-4 py-3 lg:table-cell">
                    <GrowthPill value={v.growth} />
                  </td>
                  <td className="hidden px-4 py-3 xl:table-cell">
                    {v.highlight ? (
                      <span
                        className="whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] font-semibold"
                        style={{ color, borderColor: `${color}40`, backgroundColor: `${color}15` }}
                      >
                        {v.highlight}
                      </span>
                    ) : "—"}
                  </td>
                  <td className="min-w-0 px-4 py-3 text-xs text-muted-foreground">
                    <div className="line-clamp-2 leading-snug" title={v.description}>{v.description}</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {hasProfile ? (
                      <Link
                        to={`/vendor/${categoryId}/${slug}`}
                        className="inline-flex h-6 w-6 items-center justify-center rounded-md text-primary transition-colors hover:bg-primary/10 hover:text-primary/80"
                        title="View profile"
                      >
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    ) : (
                      <span className="inline-flex h-6 w-6 items-center justify-center text-muted-foreground/25" title="No profile available">
                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/20" />
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {entries.length > initialRows && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mx-auto mt-4 flex items-center gap-2 rounded-lg border border-border/60 px-4 py-2 text-xs font-medium text-muted-foreground transition-all hover:border-border hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {expanded
            ? <><ChevronUp className="h-4 w-4" /> Show less</>
            : <><ChevronDown className="h-4 w-4" /> Show all {entries.length} entries</>}
        </button>
      )}
    </div>
  );
}

/* ─── Sticky in-page sub-nav ─────────────────────────────────────────────── */

interface SubNavItem { id: string; label: string }

function SubNav({ items }: { items: SubNavItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    if (els.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  return (
    <div className="sticky top-16 z-30 -mx-6 mb-10 border-b border-border/70 bg-background/85 px-6 backdrop-blur">
      <nav className="container flex items-center gap-1 overflow-x-auto px-0 py-3">
        {items.map((item) => {
          const active = activeId === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={cn(
                "whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                active
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
              )}
            >
              {item.label}
            </a>
          );
        })}
      </nav>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */
const CategorySection = ({ data }: CategorySectionProps) => {
  const reduceMotion = useReducedMotion();

  // Prefer new `vendors`/`startups` arrays; fall back to legacy topVendors/emergingVendors
  const vendors  = data.vendors  ?? data.topVendors     ?? [];
  const startups = data.startups ?? data.emergingVendors ?? [];
  const topVendors  = vendors.slice(0, 5);
  const topStartups = startups.slice(0, 5);

  const subNavItems: SubNavItem[] = [
    { id: "overview",  label: "Overview" },
    { id: "vendors",   label: "Vendors" },
    { id: "startups",  label: "Startups" },
    { id: "use-cases", label: "Use Cases" },
    { id: "trends",    label: "Trends" },
    { id: "growth",    label: "Growth" },
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Subtle category accent — restrained */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-0 h-80 opacity-[0.07] blur-[140px]"
        style={{ backgroundColor: data.color }}
      />

      <div className="container relative z-10 px-6">
        {/* Header */}
        <div className="pt-6 pb-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: data.color }}>
            Market Intelligence
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {data.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            {data.subtitle}
          </p>
        </div>

        <SubNav items={subNavItems} />

        {/* ── Overview: TAM stats ───────────────────────────────────────── */}
        <section id="overview" className="scroll-mt-32 space-y-10">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { icon: <DollarSign className="h-4 w-4" />, label: "2025 Market Size", value: data.tam2025 },
              { icon: <Target     className="h-4 w-4" />, label: "2030 Projection",  value: data.tam2030 },
              { icon: <TrendingUp className="h-4 w-4" />, label: "CAGR",             value: data.cagr },
            ].map((m, i) => (
              <motion.div
                key={m.label}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <Surface variant="default" padding="lg">
                  <Stat
                    layout="block"
                    icon={m.icon}
                    label={m.label}
                    tone="default"
                    value={
                      <span style={{ color: data.color }} className="font-display text-3xl font-bold">
                        {m.value}
                      </span>
                    }
                  />
                </Surface>
              </motion.div>
            ))}
          </div>

          <MarketChart
            data={data.chartData}
            title="Market growth trajectory"
            color={data.color}
            gradientId={`gradient-${data.id}`}
          />
        </section>

        {/* ── Vendors ───────────────────────────────────────────────────── */}
        <section id="vendors" className="scroll-mt-32 pt-20">
          <SectionHeader
            icon={<Building2 className="h-5 w-5" style={{ color: data.color }} />}
            title="Established Vendors"
            description={vendors.length > 0 ? `${vendors.length} companies tracked, ranked by market prominence.` : undefined}
          />

          {topVendors.length > 0 && (
            <div className="mb-10">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Top 5 spotlight
              </p>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {topVendors.map((v, i) => (
                  <SpotlightCard key={v.name} vendor={v} rank={i + 1} color={data.color} delay={i * 0.06} categoryId={data.id} />
                ))}
              </div>
            </div>
          )}

          {vendors.length > 5 && (
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Full list
              </p>
              <VendorTable entries={vendors} color={data.color} categoryId={data.id} />
            </div>
          )}
        </section>

        {/* ── Startups ──────────────────────────────────────────────────── */}
        <section id="startups" className="scroll-mt-32 pt-20">
          <SectionHeader
            icon={<Rocket className="h-5 w-5" style={{ color: data.color }} />}
            title="Startups & Emerging Players"
            description={startups.length > 0 ? `${startups.length} emerging vendors, ranked by momentum.` : undefined}
          />

          {topStartups.length > 0 && (
            <div className="mb-10">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Top 5 to watch
              </p>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {topStartups.map((v, i) => (
                  <SpotlightCard key={v.name} vendor={v} rank={i + 1} color={data.color} delay={i * 0.06} categoryId={data.id} />
                ))}
              </div>
            </div>
          )}

          {startups.length > 5 && (
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Full list
              </p>
              <VendorTable entries={startups} color={data.color} categoryId={data.id} />
            </div>
          )}
        </section>

        {/* ── Use Cases ─────────────────────────────────────────────────── */}
        <section id="use-cases" className="scroll-mt-32 pt-20">
          <SectionHeader
            icon={<Compass className="h-5 w-5" style={{ color: data.color }} />}
            title="Top Use Cases"
            description="Where this market delivers measurable value today."
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {data.useCases.map((uc, i) => (
              <Surface key={i} variant="default" padding="lg">
                <div className="flex gap-4">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold tabular-nums"
                    style={{ backgroundColor: `${data.color}20`, color: data.color }}
                  >
                    {i + 1}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-foreground">{uc.title}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{uc.description}</p>
                  </div>
                </div>
              </Surface>
            ))}
          </div>
        </section>

        {/* ── Trends ────────────────────────────────────────────────────── */}
        <section id="trends" className="scroll-mt-32 pt-20">
          <SectionHeader
            icon={<Lightbulb className="h-5 w-5" style={{ color: data.color }} />}
            title="Latest Trends"
            description="What's changing fast enough to matter for the next 12-24 months."
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {data.trends.map((t, i) => (
              <Surface key={i} variant="muted" padding="md" className="transition-colors hover:bg-muted/60">
                <h4 className="flex items-center gap-2 font-semibold text-foreground">
                  <ArrowUpRight className="h-4 w-4" style={{ color: data.color }} />
                  {t.title}
                </h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t.description}</p>
              </Surface>
            ))}
          </div>
        </section>

        {/* ── Growth opportunities ──────────────────────────────────────── */}
        <section id="growth" className="scroll-mt-32 pt-20">
          <Surface
            variant="default"
            padding="lg"
            className="border-2"
            style={{ borderColor: `${data.color}40`, backgroundColor: `${data.color}06` }}
          >
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" style={{ color: data.color }} />
              <h3 className="font-display text-lg font-semibold text-foreground">
                Growth Opportunities
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {data.opportunities.map((opp, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg bg-background/40 p-3">
                  <div className="mt-2 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: data.color }} />
                  <span className="text-sm text-foreground">{opp}</span>
                </div>
              ))}
            </div>
          </Surface>
        </section>

        {/* ── Sources & scope ───────────────────────────────────────────── */}
        {(data.tamScope || (data.sources && data.sources.length > 0)) && (
          <div className="mt-20 border-t border-border/40 pt-6">
            <div className="mb-3 flex items-center gap-2">
              <Info className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/60">
                Data sources &amp; market scope
              </span>
            </div>
            {data.tamScope && (
              <p className="mb-3 max-w-4xl text-xs leading-relaxed text-muted-foreground/70">
                <span className="font-medium text-muted-foreground/80">Scope: </span>
                {data.tamScope}
              </p>
            )}
            {data.sources && data.sources.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {(data.sources as string[]).map((s, i) => (
                  <span
                    key={i}
                    className="rounded-md border border-border/40 bg-secondary/20 px-2.5 py-1 text-[10px] text-muted-foreground/60"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="h-4" />
      </div>
    </section>
  );
};

export default CategorySection;
