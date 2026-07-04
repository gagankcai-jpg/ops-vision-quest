import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Radio, BarChart3, Cpu, Bot, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import { allCategories } from "@/data/marketData";
import { Surface } from "@/components/ui/surface";
import { cn } from "@/lib/utils";
import { buildSignals, type SignalType } from "@/lib/signals";

const SIGNAL_TYPE_CONFIG: Record<SignalType, { label: string; className: string }> = {
  acquisition: { label: "M&A",        className: "bg-orange-500/15 text-orange-400 border-orange-500/30" },
  funding:     { label: "Funding",     className: "bg-sky-500/15 text-sky-400 border-sky-500/30" },
  launch:      { label: "Launch",      className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  ipo:         { label: "IPO",         className: "bg-violet-500/15 text-violet-400 border-violet-500/30" },
  partnership: { label: "Partnership", className: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  update:      { label: "Update",      className: "bg-slate-500/15 text-slate-400 border-slate-500/30" },
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  aiops:    <BarChart3 className="w-3.5 h-3.5" />,
  itom:     <Cpu className="w-3.5 h-3.5" />,
  rpa:      <Bot className="w-3.5 h-3.5" />,
  agentops: <Sparkles className="w-3.5 h-3.5" />,
  secops:   <ShieldCheck className="w-3.5 h-3.5" />,
};

/* ─── Component ──────────────────────────────────────────────────────────── */

const PREVIEW_COUNT = 4;

const SignalsTeaser = () => {
  const navigate = useNavigate();

  const { signals, total } = useMemo(() => {
    const all = buildSignals(allCategories);
    return { signals: all.slice(0, PREVIEW_COUNT), total: all.length };
  }, []);

  if (signals.length === 0) return null;

  return (
    <section className="border-t border-border/60 bg-card/30">
      <div className="container px-6 py-10">
        {/* Header row */}
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              Live signals
            </p>
            <div className="flex items-center gap-3">
              <h2 className="font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                Latest Market Signals
              </h2>
              <span className="rounded-full border border-border bg-muted/40 px-2 py-0.5 text-[10px] font-medium tabular-nums text-muted-foreground">
                {total} tracked
              </span>
            </div>
          </div>
          <Link
            to="/signals"
            className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-primary transition-colors hover:text-primary/80"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Signal cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {signals.map((s, i) => {
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
                className="group flex flex-col gap-2.5"
              >
                <div className="flex items-center justify-between">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg border"
                    style={{
                      color: s.categoryColor,
                      borderColor: `${s.categoryColor}40`,
                      backgroundColor: `${s.categoryColor}12`,
                    }}
                  >
                    {CATEGORY_ICONS[s.categoryId] ?? <Radio className="h-3.5 w-3.5" />}
                  </div>
                  <span className={cn("rounded-full border px-1.5 py-0.5 text-[9px] font-semibold", sig.className)}>
                    {sig.label}
                  </span>
                </div>

                <Link
                  to={vendorLink}
                  onClick={(e) => e.stopPropagation()}
                  className="text-sm font-semibold leading-tight text-foreground transition-colors group-hover:text-primary"
                >
                  {s.vendorName}
                </Link>

                <p className="line-clamp-2 flex-1 text-xs leading-snug text-muted-foreground">
                  {s.event}
                </p>

                <span
                  className="self-start rounded-full border px-1.5 py-0.5 text-[9px] font-medium"
                  style={{
                    color: s.categoryColor,
                    borderColor: `${s.categoryColor}40`,
                    backgroundColor: `${s.categoryColor}12`,
                  }}
                >
                  {s.categoryTitle}
                </span>
              </Surface>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SignalsTeaser;
