import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, DollarSign, Target, ChevronDown, ChevronUp, Building2, Rocket, ArrowUpRight } from "lucide-react";
import MarketChart from "./MarketChart";

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
  tam2024: string;
  tam2030: string;
  cagr: string;
  chartData: Array<{ year: string; value: number }>;
  /** 50 established vendors ordered by market prominence */
  vendors?: VendorEntry[];
  /** 50 startups/emerging ordered by momentum */
  startups?: VendorEntry[];
  /** legacy compat */
  topVendors?: VendorEntry[];
  emergingVendors?: VendorEntry[];
  useCases: UseCase[];
  trends: Trend[];
  opportunities: string[];
  // icon is intentionally omitted — we don't render it
  [key: string]: unknown;
}

interface CategorySectionProps {
  data: CategoryData;
  index: number;
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const TYPE_BADGE: Record<string, string> = {
  leader:     "bg-blue-500/15 text-blue-400 border-blue-500/30",
  challenger: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  niche:      "bg-slate-500/15 text-slate-400 border-slate-500/30",
  startup:    "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  emerging:   "bg-amber-500/15 text-amber-400 border-amber-500/30",
};

const TYPE_LABEL: Record<string, string> = {
  leader: "Leader", challenger: "Challenger", niche: "Niche",
  startup: "Startup", emerging: "Emerging",
};

function GrowthPill({ value }: { value?: string }) {
  if (!value || value === "—") return <span className="text-muted-foreground">—</span>;
  const isPos = value.startsWith("+");
  return (
    <span className={`font-medium ${isPos ? "text-emerald-400" : "text-rose-400"}`}>
      {value}
    </span>
  );
}

/* ─── Spotlight card (top-5) ─────────────────────────────────────────────── */
function SpotlightCard({
  vendor, rank, color, delay,
}: { vendor: VendorEntry; rank: number; color: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay }}
      className="relative bg-card border border-border rounded-2xl p-5 hover:border-primary/30 transition-all flex flex-col gap-3"
    >
      {/* rank badge */}
      <div
        className="absolute -top-3 -left-3 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg"
        style={{ backgroundColor: color }}
      >
        {rank}
      </div>

      {/* header */}
      <div className="flex items-start justify-between gap-2 mt-1">
        <div>
          <h4 className="font-semibold text-foreground text-base leading-tight">{vendor.name}</h4>
          <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{vendor.description}</p>
        </div>
        {vendor.highlight && (
          <span
            className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border"
            style={{ color, borderColor: `${color}40`, backgroundColor: `${color}15` }}
          >
            {vendor.highlight}
          </span>
        )}
      </div>

      {/* metrics row */}
      <div className="grid grid-cols-3 gap-1 text-center border-t border-border pt-3">
        <div>
          <div className="text-[10px] text-muted-foreground mb-0.5">Mkt Cap / Val</div>
          <div className="text-xs font-semibold text-foreground truncate">{vendor.marketCap ?? vendor.metric ?? "—"}</div>
        </div>
        <div>
          <div className="text-[10px] text-muted-foreground mb-0.5">Revenue</div>
          <div className="text-xs font-semibold text-foreground truncate">{vendor.revenue ?? "—"}</div>
        </div>
        <div>
          <div className="text-[10px] text-muted-foreground mb-0.5">Growth</div>
          <div className="text-xs font-semibold">
            <GrowthPill value={vendor.growth} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Full vendor table ───────────────────────────────────────────────────── */
function VendorTable({
  entries, color, initialRows = 10,
}: { entries: VendorEntry[]; color: string; initialRows?: number }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? entries : entries.slice(0, initialRows);

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/40">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground w-10">#</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Company</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden sm:table-cell">Type</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">Mkt Cap / Val</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">Revenue</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden lg:table-cell">Growth</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden xl:table-cell">Highlight</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Description</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((v, i) => (
              <tr key={v.name} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{i + 1}</td>
                <td className="px-4 py-3 font-semibold text-foreground whitespace-nowrap">{v.name}</td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${TYPE_BADGE[v.type] ?? TYPE_BADGE.niche}`}>
                    {TYPE_LABEL[v.type] ?? v.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap hidden md:table-cell">
                  {v.marketCap ?? v.metric ?? "—"}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap hidden md:table-cell">
                  {v.revenue ?? "—"}
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <GrowthPill value={v.growth} />
                </td>
                <td className="px-4 py-3 hidden xl:table-cell">
                  {v.highlight ? (
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap"
                      style={{ color, borderColor: `${color}40`, backgroundColor: `${color}15` }}
                    >
                      {v.highlight}
                    </span>
                  ) : "—"}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground max-w-xs truncate">{v.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {entries.length > initialRows && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto"
        >
          {expanded
            ? <><ChevronUp className="w-4 h-4" /> Show less</>
            : <><ChevronDown className="w-4 h-4" /> Show all {entries.length} entries</>}
        </button>
      )}
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */
const CategorySection = ({ data, index }: CategorySectionProps) => {
  const isEven = index % 2 === 0;

  // Prefer new `vendors`/`startups` arrays; fall back to legacy topVendors/emergingVendors
  const vendors  = data.vendors  ?? data.topVendors     ?? [];
  const startups = data.startups ?? data.emergingVendors ?? [];
  const topVendors  = vendors.slice(0, 5);
  const topStartups = startups.slice(0, 5);

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background accent */}
      <div
        className={`absolute ${isEven ? "right-0" : "left-0"} top-1/2 -translate-y-1/2 w-1/2 h-96 opacity-10 blur-[100px]`}
        style={{ backgroundColor: data.color }}
      />

      <div className="container px-6 relative z-10 space-y-16">

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, x: isEven ? -30 : 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-foreground">{data.title}</h2>
          <p className="text-muted-foreground mt-1">{data.subtitle}</p>
        </motion.div>

        {/* ── Key metrics ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <DollarSign className="w-5 h-5" />, label: "2024 Market Size", value: data.tam2024 },
            { icon: <Target className="w-5 h-5" />,     label: "2030 Projection",  value: data.tam2030 },
            { icon: <TrendingUp className="w-5 h-5" />, label: "CAGR",             value: data.cagr },
          ].map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-card border border-border"
            >
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                {m.icon}
                <span className="text-sm">{m.label}</span>
              </div>
              <div className="text-3xl font-bold" style={{ color: data.color }}>{m.value}</div>
            </motion.div>
          ))}
        </div>

        {/* ── Growth chart ── */}
        <MarketChart
          data={data.chartData}
          title="Market Growth Trajectory"
          color={data.color}
          gradientId={`gradient-${data.id}`}
        />

        {/* ══════════════════════════════════════════
            ESTABLISHED VENDORS
        ══════════════════════════════════════════ */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <Building2 className="w-5 h-5" style={{ color: data.color }} />
            <h3 className="text-2xl font-bold text-foreground">
              Established Vendors
              {vendors.length > 0 && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">({vendors.length} total)</span>
              )}
            </h3>
          </div>

          {/* Spotlight — top 5 */}
          {topVendors.length > 0 && (
            <div className="mb-8">
              <p className="text-sm text-muted-foreground mb-4 font-medium uppercase tracking-wider">Top 5 Spotlight</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
                {topVendors.map((v, i) => (
                  <SpotlightCard key={v.name} vendor={v} rank={i + 1} color={data.color} delay={i * 0.08} />
                ))}
              </div>
            </div>
          )}

          {/* Full table */}
          {vendors.length > 5 && (
            <div>
              <p className="text-sm text-muted-foreground mb-3 font-medium uppercase tracking-wider">Full List</p>
              <VendorTable entries={vendors} color={data.color} />
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════
            STARTUPS & EMERGING
        ══════════════════════════════════════════ */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <Rocket className="w-5 h-5" style={{ color: data.color }} />
            <h3 className="text-2xl font-bold text-foreground">
              Startups & Emerging Players
              {startups.length > 0 && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">({startups.length} total)</span>
              )}
            </h3>
          </div>

          {/* Spotlight — top 5 */}
          {topStartups.length > 0 && (
            <div className="mb-8">
              <p className="text-sm text-muted-foreground mb-4 font-medium uppercase tracking-wider">Top 5 to Watch</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
                {topStartups.map((v, i) => (
                  <SpotlightCard key={v.name} vendor={v} rank={i + 1} color={data.color} delay={i * 0.08} />
                ))}
              </div>
            </div>
          )}

          {/* Full table */}
          {startups.length > 5 && (
            <div>
              <p className="text-sm text-muted-foreground mb-3 font-medium uppercase tracking-wider">Full List</p>
              <VendorTable entries={startups} color={data.color} />
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════
            USE CASES + TRENDS
        ══════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card border border-border rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-6">Top Use Cases</h3>
            <div className="space-y-4">
              {data.useCases.map((uc, i) => (
                <div key={i} className="flex gap-4">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
                    style={{ backgroundColor: `${data.color}20`, color: data.color }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{uc.title}</h4>
                    <p className="text-sm text-muted-foreground">{uc.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-card border border-border rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-6">Latest Trends</h3>
            <div className="space-y-4">
              {data.trends.map((t, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-border/50 bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <h4 className="font-medium text-foreground flex items-center gap-2">
                    <ArrowUpRight className="w-4 h-4" style={{ color: data.color }} />
                    {t.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">{t.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Growth opportunities ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-6 rounded-2xl border-2"
          style={{ borderColor: `${data.color}40`, backgroundColor: `${data.color}08` }}
        >
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" style={{ color: data.color }} />
            Growth Opportunities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.opportunities.map((opp, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                <div className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ backgroundColor: data.color }} />
                <span className="text-sm text-foreground">{opp}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default CategorySection;
