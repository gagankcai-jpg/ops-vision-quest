import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend,
} from "recharts";
import { ClientOnly } from "vite-react-ssg";
import { motion, useReducedMotion } from "framer-motion";
import { Surface } from "@/components/ui/surface";

/*
  Recharts theming notes
  ──────────────────────
  Recharts wants real color values (not CSS var() refs). Since the site is
  dark-only, we hardcode HSL values that match the design tokens defined in
  src/index.css:
    --border        217 24% 22%
    --muted-foreground 215 20% 70%
    --popover       222 32% 13%
    --foreground    210 40% 98%
    --primary       198 93% 60%

  Executive accent palette mirrors the values in CSS too.
*/

const TOKENS = {
  grid:        "hsl(217 24% 22% / 0.6)",
  axis:        "hsl(215 20% 70%)",
  tooltipBg:   "hsl(222 32% 13%)",
  tooltipBd:   "hsl(217 24% 22%)",
  tooltipFg:   "hsl(210 40% 98%)",
};

const TOOLTIP_STYLE = {
  backgroundColor: TOKENS.tooltipBg,
  border: `1px solid ${TOKENS.tooltipBd}`,
  borderRadius: "10px",
  color: TOKENS.tooltipFg,
  boxShadow: "0 8px 24px -8px hsl(0 0% 0% / 0.45)",
  fontSize: "12px",
  padding: "10px 12px",
};

const TOOLTIP_LABEL_STYLE = { color: TOKENS.axis, fontWeight: 500, fontSize: "11px" };
const TOOLTIP_ITEM_STYLE = { color: TOKENS.tooltipFg };

interface MarketChartProps {
  data: Array<{ year: string; value: number; projected?: boolean }>;
  title: string;
  color: string;
  gradientId: string;
}

const MarketChart = ({ data, title, color, gradientId }: MarketChartProps) => {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      <Surface variant="default" padding="lg">
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <h3 className="font-display text-base font-semibold text-foreground sm:text-lg">{title}</h3>
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            $B / year
          </span>
        </div>
        <div className="h-64">
          <ClientOnly fallback={<div className="h-full w-full" />}>
          {() => (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={color} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={TOKENS.grid} vertical={false} />
              <XAxis
                dataKey="year"
                stroke={TOKENS.axis}
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: TOKENS.tooltipBd }}
              />
              <YAxis
                stroke={TOKENS.axis}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `$${v}B`}
                width={48}
              />
              <Tooltip
                cursor={{ stroke: color, strokeOpacity: 0.4, strokeWidth: 1 }}
                contentStyle={TOOLTIP_STYLE}
                labelStyle={TOOLTIP_LABEL_STYLE}
                itemStyle={TOOLTIP_ITEM_STYLE}
                formatter={(v: number) => [`$${v}B`, "Market Size"]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                isAnimationActive={!reduceMotion}
                animationDuration={900}
              />
            </AreaChart>
          </ResponsiveContainer>
          )}
          </ClientOnly>
        </div>
      </Surface>
    </motion.div>
  );
};

interface ComparisonChartProps {
  data: Array<{ name: string; aiops: number; itom: number; rpa: number; agentops: number; secops: number }>;
}

const COMPARISON_BARS = [
  { key: "aiops",    label: "AIOps",       fill: "hsl(199 89% 60%)" },
  { key: "itom",     label: "ITOM",        fill: "hsl(262 83% 64%)" },
  { key: "rpa",      label: "RPA / IA",    fill: "hsl(152 76% 50%)" },
  { key: "agentops", label: "Agentic Ops", fill: "hsl(38 95% 58%)"  },
  { key: "secops",   label: "SecOps",      fill: "hsl(350 89% 62%)" },
] as const;

export const ComparisonChart = ({ data }: ComparisonChartProps) => {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      <Surface variant="default" padding="lg">
        <div className="mb-1 flex items-baseline justify-between gap-3">
          <h3 className="font-display text-base font-semibold text-foreground sm:text-lg">
            5-Market TAM Comparison
          </h3>
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            $B / year
          </span>
        </div>
        <p className="mb-5 text-xs text-muted-foreground">
          AIOps · ITOM · RPA · Agentic Ops · Security Ops
        </p>
        <div className="h-80">
          <ClientOnly fallback={<div className="h-full w-full" />}>
          {() => (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 12, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={TOKENS.grid} vertical={false} />
              <XAxis
                dataKey="name"
                stroke={TOKENS.axis}
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: TOKENS.tooltipBd }}
              />
              <YAxis
                stroke={TOKENS.axis}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={36}
              />
              <Tooltip
                cursor={{ fill: "hsl(217 27% 18% / 0.5)" }}
                contentStyle={TOOLTIP_STYLE}
                labelStyle={TOOLTIP_LABEL_STYLE}
                itemStyle={TOOLTIP_ITEM_STYLE}
              />
              <Legend
                wrapperStyle={{ color: TOKENS.tooltipFg, fontSize: "12px", paddingTop: 12 }}
                iconType="circle"
                iconSize={8}
              />
              {COMPARISON_BARS.map((b) => (
                <Bar
                  key={b.key}
                  dataKey={b.key}
                  name={b.label}
                  fill={b.fill}
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={!reduceMotion}
                  animationDuration={700}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
          )}
          </ClientOnly>
        </div>
      </Surface>
    </motion.div>
  );
};

export default MarketChart;
