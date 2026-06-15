import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  TrendingUp, BarChart3, Cpu, Bot, Sparkles, ShieldCheck, ArrowRight, Brain,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { ClientOnly } from "vite-react-ssg";
import { LAST_UPDATED } from "@/data/lastUpdated";
import type { MarketData } from "@/data/marketData";
import { AmbientBackground } from "@/components/layout/AmbientBackground";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  markets?: Record<string, MarketData>;
  dataDate?: string;
}

interface CategorySpec {
  slug: string;
  short: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  fallbackTAM: string;
  fallbackTrajectory: number[];
  accent: string; // tailwind text token
  hex: string; // for chart fill
}

const CATEGORIES: CategorySpec[] = [
  { slug: "aiops",    short: "AIOps",     title: "AIOps & Observability",   icon: BarChart3,   fallbackTAM: "$100B", fallbackTrajectory: [36.0, 43.9, 53.6, 65.3, 79.7, 100.0], accent: "text-executive-cyan",   hex: "hsl(199 89% 60%)" },
  { slug: "itom",     short: "ITOM",      title: "IT Service & Ops Mgmt",   icon: Cpu,         fallbackTAM: "$94B",  fallbackTrajectory: [52.0, 58.8, 66.4, 75.1, 84.8,  94.0], accent: "text-executive-purple", hex: "hsl(262 83% 64%)" },
  { slug: "rpa",      short: "RPA / IA",  title: "RPA & Intelligent Auto.", icon: Bot,         fallbackTAM: "$74B",  fallbackTrajectory: [24.0, 30.0, 37.5, 46.9, 58.6,  74.0], accent: "text-executive-green",  hex: "hsl(152 76% 50%)" },
  { slug: "agentops", short: "AgentOps",  title: "Agentic Operations",      icon: Sparkles,    fallbackTAM: "$8B",   fallbackTrajectory: [1.2,  1.7,  2.5,  3.7,  5.3,   8.0], accent: "text-executive-amber",  hex: "hsl(38 95% 58%)" },
  { slug: "secops",   short: "SecOps",    title: "Security Operations",     icon: ShieldCheck, fallbackTAM: "$54B",  fallbackTrajectory: [21.0, 25.4, 30.7, 37.2, 45.0,  54.0], accent: "text-executive-rose",   hex: "hsl(350 89% 62%)" },
];

function formatTAM(raw: string | number | undefined, fallback: string): string {
  if (raw == null) return fallback;
  if (typeof raw === "number") return `$${raw}B`;
  return raw.startsWith("$") ? raw : `$${raw}`;
}

function trajectoryFor(market: MarketData | undefined, fallback: number[]): { v: number }[] {
  const chart = market?.chartData;
  if (chart && chart.length >= 2) return chart.map((c) => ({ v: c.value }));
  return fallback.map((v) => ({ v }));
}

const HeroSection = ({ markets, dataDate }: HeroSectionProps) => {
  const reduceMotion = useReducedMotion();
  const displayDate = dataDate ?? LAST_UPDATED;

  return (
    <section className="relative overflow-hidden border-b border-border/60 pt-28 pb-20 sm:pt-32 sm:pb-24">
      <AmbientBackground variant="hero" />

      <div className="container relative z-10 px-6">
        {/* Eyebrow */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/[0.08] px-3 py-1.5 text-xs font-medium text-primary">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            <TrendingUp className="h-3.5 w-3.5" />
            <span className="tabular-nums">Live intelligence · Updated {displayDate}</span>
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mx-auto mt-6 max-w-4xl text-center font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl"
        >
          The state of{" "}
          <span className="bg-gradient-brand bg-clip-text text-transparent">
            Autonomous IT
          </span>
          <span className="block text-foreground/90">2025–2030</span>
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mx-auto mt-5 max-w-2xl text-center text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          Analyst-grade coverage across the five pillars of the autonomous enterprise stack
          — AIOps, ITOM, RPA, Agentic Operations, and Security Operations.
          500+ vendors. Refreshed weekly.
        </motion.p>

        {/* Primary actions */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            to="/market/aiops"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Explore the markets
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/signals"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/40 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Latest signals
          </Link>
        </motion.div>

        {/* Provenance */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.32 }}
          className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground/70"
        >
          <Brain className="h-3 w-3" />
          <span>
            Compiled by Claude from public analyst research & company filings · Gartner, Forrester, Grand View Research, Mordor Intelligence, MarketsandMarkets & other industry analysts
          </span>
        </motion.div>

        {/* Category cards with sparkline trajectories */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"
        >
          {CATEGORIES.map((cat) => {
            const live = markets?.[cat.slug];
            const tam2030 = formatTAM(live?.tam2030, cat.fallbackTAM);
            const cagr = live?.cagr ?? null;
            const traj = trajectoryFor(live, cat.fallbackTrajectory);
            return (
              <Link
                key={cat.slug}
                to={`/market/${cat.slug}`}
                className={cn(
                  "group relative flex flex-col gap-3 overflow-hidden rounded-xl border border-border bg-card/60 p-5 backdrop-blur",
                  "transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card hover:shadow-lg",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className={cn("inline-flex h-9 w-9 items-center justify-center rounded-lg bg-card", cat.accent)}>
                    <cat.icon className="h-4 w-4" />
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {cat.short}
                  </span>
                </div>

                <div>
                  <p className="text-xs leading-tight text-muted-foreground">
                    {live?.title ?? cat.title}
                  </p>
                  <p className="mt-2 font-display text-2xl font-bold tabular-nums text-foreground">
                    {tam2030}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    2030 TAM{cagr ? ` · ${cagr} CAGR` : ""}
                  </p>
                </div>

                <div className="-mb-1 h-10 w-full">
                  <ClientOnly fallback={<div className="h-full w-full" />}>
                  {() => (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={traj} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id={`spark-${cat.slug}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%"   stopColor={cat.hex} stopOpacity={0.45} />
                          <stop offset="100%" stopColor={cat.hex} stopOpacity={0}    />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="v"
                        stroke={cat.hex}
                        strokeWidth={1.75}
                        fill={`url(#spark-${cat.slug})`}
                        isAnimationActive={!reduceMotion}
                        animationDuration={900}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                  )}
                  </ClientOnly>
                </div>

                <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors group-hover:text-primary">
                  Explore market
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
