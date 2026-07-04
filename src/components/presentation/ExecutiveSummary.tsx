import { motion } from "framer-motion";
import { ComparisonChart } from "./MarketChart";
import { Lightbulb, Globe, Zap, Shield } from "lucide-react";
import { allCategories } from "@/data/marketData";
import type { MarketData } from "@/data/marketData";

interface ExecutiveSummaryProps {
  markets?: Record<string, MarketData>;
}

function parseTAM(v: string | number | undefined): number {
  if (!v) return 0;
  if (typeof v === "number") return v;
  return parseFloat(v.replace(/[$B,]/g, "")) || 0;
}

function parseCAGR(v: string | number | undefined): number {
  if (!v) return 0;
  if (typeof v === "number") return v;
  return parseFloat(v.replace("%", "")) || 0;
}

function getChartValue(market: MarketData | undefined, year: string): number {
  const entry = market?.chartData?.find((c) => c.year === year);
  return entry?.value ?? 0;
}

function formatBillions(n: number): string {
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}T`;
  return `$${n % 1 === 0 ? n.toFixed(0) : n.toFixed(1)}B`;
}

// Static data is the fallback when no live `markets` prop is supplied — same
// source of truth as the live path, so the two can never drift apart.
const STATIC_MARKETS: Record<string, MarketData> = Object.fromEntries(
  allCategories.map((c) => [c.id, c])
);

const SLUGS = ["aiops", "itom", "rpa", "agentops", "secops"] as const;

const ExecutiveSummary = ({ markets }: ExecutiveSummaryProps) => {
  const source: Record<string, MarketData> =
    markets && Object.keys(markets).length > 0 ? markets : STATIC_MARKETS;

  const combined2025 = SLUGS.reduce((sum, s) => sum + parseTAM(source[s]?.tam2025 as string), 0);
  const combined2030 = SLUGS.reduce((sum, s) => sum + parseTAM(source[s]?.tam2030), 0);
  const avgCAGR = SLUGS.reduce((sum, s) => sum + parseCAGR(source[s]?.cagr), 0) / SLUGS.length;

  const growthPct = combined2025 > 0
    ? Math.round(((combined2030 - combined2025) / combined2025) * 100)
    : 0;

  const comparisonData = ["2025", "2026", "2028", "2030"].map((year) => ({
    name: year,
    aiops:    getChartValue(source.aiops, year),
    itom:     getChartValue(source.itom, year),
    rpa:      getChartValue(source.rpa, year),
    agentops: getChartValue(source.agentops, year),
    secops:   getChartValue(source.secops, year),
  }));

  const tam2030Str = formatBillions(combined2030);

  const keyInsights = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "AI-First Transformation",
      description: "GenAI is now standard across all five markets. Agentic AI is the fastest-growing segment at 45.0% CAGR — Gartner forecasts 70% of enterprises deploying agentic IT ops by 2029.",
      color: "hsl(199 89% 48%)",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Cloud & SaaS Dominance",
      description: "Cloud deployments capture 54.5%+ market share across ITSM and RPA. SaaS models enable SME market penetration with 20%+ CAGR in the mid-market segment.",
      color: "hsl(262 83% 58%)",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Autonomous IT Ops Convergence",
      description: `AIOps, ITOM, RPA, Agentic Ops, and SecOps are converging into unified self-healing platforms — the ${tam2030Str} Autonomous IT Ops stack by 2030.`,
      color: "hsl(142 71% 45%)",
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Record Investment Wave",
      description: "2024–2025 funding surge: CrowdStrike ($3.1B ARR), Celonis ($13B valuation), Torq ($70M Series C), Leena AI Series C — agentic and SecOps segments attract most capital.",
      color: "hsl(38 92% 50%)",
    },
  ];

  return (
    <section className="py-24 bg-background relative">
      <div className="container px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-foreground mb-4">Executive Summary</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            The Autonomous IT Ops stack is converging — AIOps, ITOM, RPA, Agentic Operations, and Security Ops are merging into unified, self-healing enterprise platforms.
          </p>
        </motion.div>

        {/* Combined Market TAM */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-primary/10 via-accent/10 to-executive-green/10 p-8 rounded-3xl border border-border mb-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-sm text-muted-foreground mb-2">Combined TAM 2025</div>
              <div className="text-4xl font-bold text-foreground">{formatBillions(combined2025)}</div>
              <div className="text-xs text-muted-foreground mt-1">5 markets</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-2">Combined TAM 2030</div>
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{tam2030Str}</div>
              <div className="text-xs text-muted-foreground mt-1">projected</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-2">Total Growth</div>
              <div className="text-4xl font-bold text-executive-green">+{growthPct}%</div>
              <div className="text-xs text-muted-foreground mt-1">2025–2030</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-2">Avg. CAGR</div>
              <div className="text-4xl font-bold text-executive-amber">{avgCAGR.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground mt-1">across all markets</div>
            </div>
          </div>
        </motion.div>

        {/* Comparison Chart */}
        <div className="mb-12">
          <ComparisonChart data={comparisonData} />
        </div>

        {/* Key Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {keyInsights.map((insight, index) => (
            <motion.div
              key={insight.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${insight.color}20`, color: insight.color }}
              >
                {insight.icon}
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{insight.title}</h3>
              <p className="text-muted-foreground">{insight.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExecutiveSummary;
