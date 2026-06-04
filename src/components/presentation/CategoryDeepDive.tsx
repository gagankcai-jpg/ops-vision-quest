import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// ──────────────────────────────────────────────────────────────────────────
// Narrow vs. broad scope analysis + per-category deep dives.
// Ported verbatim from the retired SSR landing page (files/page-market-intelligence.php)
// to preserve its unique scope-arbitrage editorial + analyst source citations.
// ──────────────────────────────────────────────────────────────────────────

interface ScopeRow {
  cat: string;
  tam25: number;
  tam30: number;
  cagr: number;
  basis: string;
}

const NARROW: ScopeRow[] = [
  { cat: "AIOps & Observability", tam25: 36, tam30: 100, cagr: 22, basis: "AIOps analytics platforms only" },
  { cat: "ITSM · ITAM · FinOps", tam25: 52, tam30: 94, cagr: 13, basis: "ITSM + ITOM + ITAM + Cloud FinOps platform software" },
  { cat: "RPA & IPA", tam25: 24, tam30: 74, cagr: 25, basis: "Platform/software only, excl. services" },
  { cat: "Agentic AI for IT Ops", tam25: 1.2, tam30: 8, cagr: 45, basis: "IT slice of horizontal enterprise agents" },
  { cat: "SecOps Platform", tam25: 21, tam30: 54, cagr: 21, basis: "SIEM + SOAR + XDR core stack" },
];

const BROAD: ScopeRow[] = [
  { cat: "AIOps & Observability", tam25: 62, tam30: 170, cagr: 22, basis: "+ OTel, APM, log management, data observability" },
  { cat: "ITSM · ITAM · FinOps", tam25: 52, tam30: 94, cagr: 13, basis: "Stable — same envelope (ITSM, ITOM, ITAM, FinOps) in both cuts" },
  { cat: "RPA & IPA", tam25: 28, tam30: 99, cagr: 29, basis: "+ implementation and managed services" },
  { cat: "Agentic AI for IT Ops", tam25: 3, tam30: 40, cagr: 68, basis: "+ all horizontal enterprise agents touching IT" },
  { cat: "SecOps Platform", tam25: 38, tam30: 75, cagr: 15, basis: "+ EDR, NDR, UEBA, threat intelligence" },
];

const sum = (rows: ScopeRow[], k: "tam25" | "tam30") => rows.reduce((s, r) => s + r[k], 0);

interface DeepDiveCategory {
  slug: string;
  title: string;
  icon: string;
  narrow25: string;
  narrow30: string;
  broad25: string;
  broad30: string;
  narrowCagr: string;
  scopeNote: string;
  description: string;
  keySignals: string[];
  sources: string;
}

const CATEGORIES: DeepDiveCategory[] = [
  {
    slug: "aiops",
    title: "AIOps & Observability Platforms",
    icon: "📡",
    narrow25: "$36B", narrow30: "$100B", broad25: "$62B", broad30: "$170B", narrowCagr: "22%",
    scopeNote: "Narrow = AIOps analytics platforms. Broad = full observability envelope including OTel-driven APM, log management, and data observability.",
    description: "The most contested category because analysts draw the boundary differently. Mordor Intelligence sizes AIOps at $18.95B in 2026 growing to $37.79B by 2031. Grand View Research takes a narrower cut at $14.60B in 2024 to $36.07B by 2030. Research & Markets captures the broader AIOps+services envelope at $33.78B in 2025 to $99.07B by 2030. Observability platforms alone are sized at $28.5B in 2025 growing to $172.1B by 2035. The variance reflects whether you count OpenTelemetry-era full-stack observability plus AIOps overlays, or just the AIOps analytics layer.",
    keySignals: [
      "Palo Alto Networks / Chronosphere acquisition signals SecOps-Observability convergence",
      "SentinelOne / Observo AI deal extends security into telemetry pipelines",
      "OpenTelemetry becoming the de facto collection standard, shifting TAM toward OTel-native platforms",
      "Datadog, Dynatrace, New Relic expanding into AIOps analytics overlays",
    ],
    sources: "Mordor Intelligence, Grand View Research, Research & Markets, Precedence Research",
  },
  {
    slug: "itom",
    title: "IT Service, Operations & Asset Management",
    icon: "🔧",
    narrow25: "$52B", narrow30: "$94B", broad25: "$52B", broad30: "$94B", narrowCagr: "13%",
    scopeNote: "Spans ITSM (~$15B), ITOM operations (~$36B), ITAM (~$2B), and Cloud FinOps (~$15B). These segments overlap within the ITOM umbrella — ITOM already counts cloud management and FinOps overlaps it — so they are not additive; the ~$52B is the de-duplicated envelope, not their sum. Excludes APM/observability (AIOps category) and managed services.",
    description: "The most stable and concentrated category. Mordor Intelligence sizes ITSM at $14.95B in 2026 growing to $32B by 2031 at 16.45% CAGR. ITOM is sized at $36.3B in 2025 forecast to $64.9B by 2030 at 12.30% CAGR. ITAM reaches $3.01B by 2031 at 6.28% CAGR (Mordor 2026). ServiceNow holds roughly 44% ITSM share. FinOps Foundation State of FinOps 2026 (1,192 respondents, $83B+ cloud spend) reports AI cost management at 98% of FinOps teams — up from 63% in 2024 — with 90% now managing SaaS spend, expanding FinOps from cloud to total technology value.",
    keySignals: [
      "ServiceNow Moveworks acquisition and AI Agent Orchestrator redefine the ITSM category",
      "Flexera (Gartner Leader for SAM Tools) + Snow Software merger creates largest pure-play ITAM/SAM vendor",
      "FinOps Foundation 2026: AI cost management (GPU/LLM inference) now top new FinOps capability — 98% of teams engaged",
      "ITAM + ITSM convergence: enterprises consolidating asset data into CMDB for AI-driven lifecycle decisions",
    ],
    sources: "Mordor Intelligence (ITSM 2026, ITOM 2025, ITAM 2026), Grand View Research, FinOps Foundation State of FinOps 2026, Gartner Market Guide: Hardware & Software Asset Management Tools (2026)",
  },
  {
    slug: "rpa",
    title: "RPA & Intelligent Process Automation",
    icon: "🤖",
    narrow25: "$24B", narrow30: "$74B", broad25: "$28B", broad30: "$99B", narrowCagr: "25%",
    scopeNote: "Narrow = platform/software only. Broad = includes implementation services wrap.",
    description: "Precedence Research puts global RPA at $28.31B in 2025, growing to approximately $247.34B by 2035 at 24.20% CAGR. The critical narrative shift: pure rule-based RPA is being absorbed into agentic automation. Deloitte partnered with UiPath in July 2025 to launch agentic GBS integrating generative AI, workflow orchestration, RPA, and machine learning. UiPath launched its enterprise-grade agentic automation platform with Maestro orchestration in April 2025.",
    keySignals: [
      "Category morphing from rule-based RPA into agentic automation — TAM definitions shifting underneath forecast models",
      "UiPath Maestro orchestration platform repositions RPA as AI agent infrastructure",
      "Deloitte-UiPath agentic GBS partnership signals enterprise readiness",
      "Narrow vs. broad spread (~$25B by 2030) reflects services revenue that follows platform adoption",
    ],
    sources: "Precedence Research, Grand View Research, Fortune Business Insights",
  },
  {
    slug: "agentops",
    title: "Agentic AI for IT Operations",
    icon: "🧠",
    narrow25: "$1.2B", narrow30: "$8B", broad25: "$3B", broad30: "$40B", narrowCagr: "45%",
    scopeNote: "Narrow = disciplined carve-out of IT-specific agents. Broad = all horizontal enterprise agents touching IT workflows.",
    description: "The newest and fastest-growing category. Grand View sizes overall enterprise agentic AI at $2.58B in 2024 to $24.50B by 2030 at 46.2% CAGR. MarketsandMarkets projects $40B by 2030 at 47% CAGR. The IT operations slice is much smaller: horizontal enterprise agents in customer operations and IT/security together accounted for $2.18B in 2025, with IT representing roughly half. The strongest ROI is being reported in IT operations (35%) and marketing (30%), and 88% of executives plan to increase AI budgets specifically for agentic AI.",
    keySignals: [
      "Fastest-growing category at 45% CAGR (narrow) — did not exist as a named line item two years ago",
      "IT operations showing highest ROI (35%) of any agentic AI use case",
      "Narrow vs. broad spread is the widest (5x) — reflects whether you count just IT agents or all enterprise agents",
      "Vendor taxonomies will keep shifting through 2027 as category boundaries settle",
    ],
    sources: "Grand View Research, MarketsandMarkets, Omdia, Information Matters",
  },
  {
    slug: "secops",
    title: "Security Operations (SecOps) Platform",
    icon: "🛡️",
    narrow25: "$21B", narrow30: "$54B", broad25: "$38B", broad30: "$75B", narrowCagr: "21%",
    scopeNote: "Narrow = SIEM + SOAR + XDR. Broad = adds EDR, NDR, UEBA, threat intelligence, vulnerability management.",
    description: "The scope question matters most here. Global Growth Insights sizes Security Operations Software at $31.4B in 2025 to $76.2B by 2033 at 11.72% CAGR. Business Research Insights takes a tighter cut at $26.8B in 2024 to $51.68B by 2033. Omdia tracks 10 segments — TH, EDR, NDR, XDR, SIEM, SOAR, RBVM, ASMD, SA & UEBA, and threat intelligence — with forecasts through 2030. The category is being re-segmented: SIEM, SOAR, EDR, XDR, and UEBA are collapsing into unified platforms.",
    keySignals: [
      "SIEM/XDR/SOAR collapsing into unified platforms — 10 sub-segments converging",
      "AI SOC startups (Dropzone, Prophet, Radiant, Simbian, Crogl) compete in the narrow SIEM+SOAR+XDR cut",
      "Use narrow for AI SOC disruption thesis; broad for enterprise buyer budget framing",
      "CrowdStrike-Onum deal extends security into data observability",
    ],
    sources: "Global Growth Insights, Business Research Insights, Omdia, MRFR",
  },
];

const fmt = (n: number) => `$${n % 1 === 0 ? n.toFixed(0) : n.toFixed(1)}B`;

function ScopeTable({ title, rows, headLast }: { title: string; rows: ScopeRow[]; headLast: string }) {
  return (
    <div>
      <h3 className="text-base font-semibold text-muted-foreground mt-8 mb-3">{title}</h3>
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-card text-muted-foreground">
              <th className="text-left font-medium px-4 py-3">Category</th>
              <th className="text-right font-medium px-4 py-3">2025 TAM</th>
              <th className="text-right font-medium px-4 py-3">2030 TAM</th>
              <th className="text-right font-medium px-4 py-3">CAGR</th>
              <th className="text-left font-medium px-4 py-3">{headLast}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.cat} className="border-t border-border">
                <td className="px-4 py-3 text-foreground font-medium whitespace-nowrap">{r.cat}</td>
                <td className="px-4 py-3 text-right text-foreground">{fmt(r.tam25)}</td>
                <td className="px-4 py-3 text-right text-foreground">{fmt(r.tam30)}</td>
                <td className="px-4 py-3 text-right text-foreground">{r.cagr}%</td>
                <td className="px-4 py-3 text-left text-xs text-muted-foreground">{r.basis}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-border bg-card/50 font-semibold">
              <td className="px-4 py-3 text-foreground">Combined</td>
              <td className="px-4 py-3 text-right text-foreground">~{fmt(sum(rows, "tam25"))}</td>
              <td className="px-4 py-3 text-right text-foreground">~{fmt(sum(rows, "tam30"))}</td>
              <td className="px-4 py-3 text-right text-foreground">~20%</td>
              <td className="px-4 py-3" />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

const CategoryDeepDive = () => {
  const arbitrageDelta = Math.round(sum(BROAD, "tam30") - sum(NARROW, "tam30"));

  return (
    <section id="deep-dive" className="py-24 bg-background relative">
      <div className="container px-6 max-w-6xl">
        {/* ── Narrow vs. broad scope ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-foreground mb-4">Narrow vs. broad scope</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Every TAM number in Autonomous IT Ops depends on where you draw the category boundary.
            We present both cuts so you can choose the right framing for your audience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div className="p-6 rounded-2xl bg-card border border-border">
            <p className="text-sm font-semibold text-primary mb-2">Narrow cut — when to use</p>
            <p className="text-muted-foreground">
              AI SOC disruption thesis, vendor competitive analysis, isolating the displaceable market.
              Strips out commoditized adjacencies like EDR, NDR, managed services, broader observability tooling.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-card border border-border">
            <p className="text-sm font-semibold text-accent mb-2">Broad cut — when to use</p>
            <p className="text-muted-foreground">
              Buyer-budget framing, CIO decks, platform consolidation narratives.
              Reflects how enterprises actually line-item spend across telemetry, security, and service management.
            </p>
          </div>
        </div>

        <ScopeTable title="Narrow scope (platform-only)" rows={NARROW} headLast="Scope basis" />
        <ScopeTable title="Broad scope (full envelope)" rows={BROAD} headLast="What changes" />

        {/* ── Category deep dives ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-20 mb-12"
        >
          <h2 className="text-4xl font-bold text-foreground mb-4">Category deep dives</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Each category includes narrow and broad TAM, key market signals, and source citations.
          </p>
        </motion.div>

        <div className="space-y-8">
          {CATEGORIES.map((cat, i) => (
            <motion.article
              key={cat.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.2) }}
              className="p-6 md:p-8 rounded-3xl bg-card border border-border hover:border-primary/30 transition-all"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl" aria-hidden>{cat.icon}</span>
                <h3 className="text-2xl font-semibold text-foreground">{cat.title}</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                {[
                  { label: "Narrow 2025", value: cat.narrow25 },
                  { label: "Narrow 2030", value: cat.narrow30 },
                  { label: "Broad 2025", value: cat.broad25 },
                  { label: "Broad 2030", value: cat.broad30 },
                  { label: "CAGR (narrow)", value: cat.narrowCagr },
                ].map((kpi) => (
                  <div key={kpi.label} className="rounded-xl bg-background border border-border px-3 py-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">{kpi.label}</p>
                    <p className="text-xl font-bold text-foreground">{kpi.value}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl bg-primary/5 border border-primary/20 px-4 py-3 text-sm text-muted-foreground mb-4">
                {cat.scopeNote}
              </div>

              <p className="text-muted-foreground mb-5">{cat.description}</p>

              <h4 className="text-sm font-semibold text-primary mb-2">Key market signals</h4>
              <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground mb-5">
                {cat.keySignals.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">Sources: {cat.sources}</p>
                <Link
                  to={`/market/${cat.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-accent transition-colors"
                >
                  Explore {cat.title.split(" ")[0]} →
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {/* ── Scope arbitrage ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20"
        >
          <h2 className="text-4xl font-bold text-foreground mb-4">The scope arbitrage zone</h2>
          <p className="text-xl text-muted-foreground mb-6 max-w-3xl">
            The ~${arbitrageDelta}B delta between narrow and broad 2030 TAM is where category definitions
            are actively shifting.
          </p>
          <div className="p-6 md:p-8 rounded-3xl bg-card border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-3">Why scope cuts matter</h3>
            <p className="text-muted-foreground">
              Observability platforms are absorbing AIOps. SecOps is absorbing telemetry pipelines.
              Agentic AI is absorbing RPA. ITSM is extending into ITOM and AIOps via ServiceNow's AI Agent Orchestrator.
              The clean TAM charts are a 2024-era artifact — by 2027 the analyst houses will be forced to re-cut.
              Whichever platforms own "AI-native ITOM" and "unified SecOps" by 2027 capture both pools.
            </p>
          </div>
        </motion.div>

        {/* ── Methodology ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16"
        >
          <h2 className="text-4xl font-bold text-foreground mb-4">Methodology</h2>
          <div className="p-6 md:p-8 rounded-3xl bg-card border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-3">Source triangulation</h3>
            <p className="text-muted-foreground">
              Each category is sized using 3–5 independent analyst sources (Mordor Intelligence, Grand View Research,
              MarketsandMarkets, Precedence Research, Omdia, Global Growth Insights, Fortune Business Insights,
              Business Research Insights, MRFR, Information Matters). We take the midpoint of credible estimates
              after normalizing for scope differences. Narrow and broad cuts are not different sources — they
              reflect different category boundary definitions applied to the same underlying data.
              All figures are in USD. 2025 is the base year; 2030 is the projection year. CAGRs are calculated
              from the midpoint estimates. Numbers are rounded and should be treated as order-of-magnitude guidance,
              not precision forecasts.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CategoryDeepDive;
