import { useEffect, useState } from "react";
import { useParams, Link, useSearchParams, useNavigate } from "react-router-dom";
import { PageMeta } from "@/components/seo/PageMeta";
import { motion, useReducedMotion } from "framer-motion";
import {
  ChevronLeft, TrendingUp, DollarSign, BarChart2,
  ThumbsUp, AlertCircle, Users, Target, Zap, Quote,
  ShieldCheck, AlertTriangle, Lightbulb, TrendingDown,
  CreditCard, Cloud, Server, Layers, CheckCircle2, XCircle, ChevronRight,
  GitCompare,
} from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Surface } from "@/components/ui/surface";
import { Stat } from "@/components/ui/stat";
import { allCategories } from "@/data/marketData";
import { vendorProfiles } from "@/data/vendorProfiles";
import { toVendorSlug } from "@/lib/vendorSlug";
import type { VendorProfile } from "@/data/vendorProfiles";
import type { VendorEntry } from "@/components/presentation/CategorySection";
import { pricingData } from "@/data/pricingData";
import type { PricingInfo } from "@/data/pricingData";
import { LAST_UPDATED } from "@/data/lastUpdated";
import {
  MODEL_LABELS, MODEL_COLORS, TCO_COLORS, TCO_LABELS,
  SEGMENT_LABELS, DEPLOY_LABELS, TRANSPARENCY_LABELS, TYPE_BADGE, TYPE_LABEL,
} from "@/lib/pricingHelpers";
import { cn } from "@/lib/utils";

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

function GrowthValue({ value }: { value?: string }) {
  if (!value || value === "—") return <span className="text-muted-foreground">—</span>;
  const isPos = value.startsWith("+");
  return (
    <span className={cn("tabular-nums font-semibold", isPos ? "text-success" : "text-danger")}>
      {value}
    </span>
  );
}

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.4, delay },
});

/* ─── Bullet list ────────────────────────────────────────────────────────── */

function BulletList({ items, dotClass }: { items: string[]; dotClass: string }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm leading-snug">
          <span className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", dotClass)} />
          <span className="text-muted-foreground">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* ─── Pricing section ────────────────────────────────────────────────────── */

function PricingSection({ pricing }: { pricing: PricingInfo }) {
  return (
    <section id="pricing" className="container scroll-mt-32 px-6 py-12">
      <motion.div {...fadeUp(0.05)}>
        <SectionHeader
          icon={<CreditCard className="h-5 w-5" />}
          title="Pricing & TCO"
          description="Analyst-synthesized pricing signals — directional only, contact vendor for current terms."
        />

        {/* Model + TCO badges */}
        <div className="mb-6 flex flex-wrap gap-2">
          <span className={cn("rounded-full border px-2.5 py-1 text-xs font-semibold", MODEL_COLORS[pricing.pricingModel])}>
            {MODEL_LABELS[pricing.pricingModel]}
          </span>
          <span className={cn("rounded-full border px-2.5 py-1 text-xs font-semibold", TCO_COLORS[pricing.tcoBadge])}>
            {TCO_LABELS[pricing.tcoBadge]}
          </span>
          <span className="rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {TRANSPARENCY_LABELS[pricing.transparency]}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium",
              pricing.freeTrialOrTier
                ? "border-success/30 bg-success/10 text-success"
                : "border-border bg-muted/40 text-muted-foreground"
            )}
          >
            {pricing.freeTrialOrTier
              ? <><CheckCircle2 className="h-3 w-3" /> Free Trial / Tier</>
              : <><XCircle className="h-3 w-3" /> No Free Tier</>}
          </span>
        </div>

        <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Surface variant="default" padding="lg" className="space-y-3">
            {pricing.startingPrice && (
              <div>
                <p className="mb-1 text-[11px] uppercase tracking-wider text-muted-foreground">Starting Price</p>
                <p className="text-sm font-semibold text-foreground">{pricing.startingPrice}</p>
              </div>
            )}
            {pricing.typicalACV && (
              <div>
                <p className="mb-1 text-[11px] uppercase tracking-wider text-muted-foreground">Typical ACV (Mid-Enterprise)</p>
                <p className="text-sm font-semibold text-foreground">{pricing.typicalACV}</p>
              </div>
            )}
            <div>
              <p className="mb-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">Market Segments</p>
              <div className="flex flex-wrap gap-1.5">
                {pricing.marketSegment.map((s) => (
                  <span key={s} className="rounded-md border border-border bg-muted/40 px-2 py-0.5 text-xs text-muted-foreground">
                    {SEGMENT_LABELS[s] ?? s}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">Deployment</p>
              <div className="flex flex-wrap gap-1.5">
                {pricing.deploymentModel.map((d) => (
                  <span key={d} className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/40 px-2 py-0.5 text-xs text-muted-foreground">
                    {d === "saas" ? <Cloud className="h-3 w-3" /> : d === "on-prem" ? <Server className="h-3 w-3" /> : <Layers className="h-3 w-3" />}
                    {DEPLOY_LABELS[d] ?? d}
                  </span>
                ))}
              </div>
            </div>
          </Surface>

          <Surface variant="default" padding="lg">
            <p className="mb-3 text-[11px] uppercase tracking-wider text-muted-foreground">Key Cost Drivers</p>
            <ul className="space-y-2">
              {pricing.keyPricingDrivers.map((driver, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm leading-snug">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
                  <span className="text-muted-foreground">{driver}</span>
                </li>
              ))}
            </ul>
          </Surface>
        </div>

        <Surface variant="muted" padding="md" className="flex items-start gap-3">
          <DollarSign className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <p className="font-serif text-sm italic leading-relaxed text-muted-foreground">{pricing.bottomLine}</p>
          <Link
            to="/pricing"
            className="ml-auto inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-xs font-medium text-primary transition-colors hover:text-primary/80"
          >
            Full comparison <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </Surface>
      </motion.div>
    </section>
  );
}

/* ─── Related Vendors ────────────────────────────────────────────────────── */

function RelatedVendors({
  category, currentSlug, categoryColor,
}: { category: { id: string; title: string; vendors?: VendorEntry[]; startups?: VendorEntry[] }; currentSlug: string; categoryColor: string }) {
  const allVendors: VendorEntry[] = [
    ...((category.vendors as VendorEntry[] | undefined) ?? []),
    ...((category.startups as VendorEntry[] | undefined) ?? []),
  ];

  const peers = allVendors
    .filter((v) => toVendorSlug(v.name) !== currentSlug)
    .filter((v) => !!vendorProfiles[`${category.id}/${toVendorSlug(v.name)}`])
    .slice(0, 4);

  if (peers.length === 0) return null;

  return (
    <section id="related" className="container scroll-mt-32 px-6 py-12">
      <motion.div {...fadeUp(0.1)}>
        <SectionHeader
          icon={<Users className="h-5 w-5" />}
          title={`Others in ${category.title}`}
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {peers.map((v) => {
            const slug = toVendorSlug(v.name);
            return (
              <Link
                key={v.name}
                to={`/vendor/${category.id}/${slug}`}
                className="group flex flex-col gap-2 rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">{v.name}</span>
                  <span
                    className="shrink-0 rounded-full border px-1.5 py-0.5 text-[9px] font-semibold"
                    style={{ color: categoryColor, borderColor: `${categoryColor}40`, backgroundColor: `${categoryColor}15` }}
                  >
                    {v.type.charAt(0).toUpperCase() + v.type.slice(1)}
                  </span>
                </div>
                <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">{v.description}</p>
                <div className="mt-auto flex items-center gap-1 text-primary transition-colors group-hover:text-primary/80">
                  <span className="text-[10px] font-medium">View profile</span>
                  <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

/* ─── Sticky right-rail TOC (desktop only) ───────────────────────────────── */

interface TOCEntry { id: string; label: string }

function VendorTOC({ entries }: { entries: TOCEntry[] }) {
  const [activeId, setActiveId] = useState(entries[0]?.id ?? "");

  useEffect(() => {
    const els = entries.map((e) => document.getElementById(e.id)).filter(Boolean) as HTMLElement[];
    if (els.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-25% 0px -55% 0px", threshold: 0 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [entries]);

  return (
    <aside className="sticky top-24 hidden w-52 shrink-0 lg:block">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        On this page
      </p>
      <nav className="flex flex-col">
        {entries.map((e) => {
          const active = activeId === e.id;
          return (
            <a
              key={e.id}
              href={`#${e.id}`}
              onClick={(ev) => {
                ev.preventDefault();
                document.getElementById(e.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={cn(
                "border-l-2 px-3 py-1.5 text-xs transition-colors",
                active
                  ? "border-primary text-foreground"
                  : "border-border/40 text-muted-foreground hover:border-border hover:text-foreground"
              )}
            >
              {e.label}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}

/* ─── Main page ──────────────────────────────────────────────────────────── */

const VendorDetailPage = () => {
  const { categorySlug, vendorSlug } = useParams<{ categorySlug: string; vendorSlug: string }>();
  const [compareParams] = useSearchParams();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const category = allCategories.find((c) => c.id === categorySlug);
  const vendorList: VendorEntry[] = [
    ...((category?.vendors as VendorEntry[] | undefined) ?? []),
    ...((category?.startups as VendorEntry[] | undefined) ?? []),
  ];
  const vendor = vendorList.find((v) => toVendorSlug(v.name) === vendorSlug);
  const staticProfile = vendorProfiles[`${categorySlug}/${vendorSlug}`];
  const pricing = pricingData[`${categorySlug}/${vendorSlug}`] as PricingInfo | undefined;

  // Single source of truth: profiles come from the static catalog (vendorProfiles.ts),
  // refreshed weekly by the ait-weekly-market-refresh routine. The WP-Cron REST profile
  // layer was retired to eliminate drift from a parallel, stale snapshot.
  const profile: VendorProfile | undefined = staticProfile;

  /* 404 state */
  if (!category || !vendor || !staticProfile) {
    return (
      <PageShell footerLogoId="vendor-404">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="space-y-4 text-center">
            <p className="text-2xl font-semibold text-foreground">Vendor profile not found</p>
            <p className="text-sm text-muted-foreground">
              No drill-down available for{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                {categorySlug}/{vendorSlug}
              </code>
            </p>
            {categorySlug && (
              <Link
                to={`/market/${categorySlug}`}
                className="inline-flex items-center gap-1.5 text-sm text-primary transition-colors hover:text-primary/80"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to {category?.title ?? "Market"}
              </Link>
            )}
          </div>
        </div>
      </PageShell>
    );
  }

  const categoryColor = (category as { color?: string }).color ?? "#0EA5E9";

  const tocEntries: TOCEntry[] = [
    { id: "overview", label: "Overview" },
    { id: "swot",     label: "SWOT" },
    { id: "sentiment", label: "User sentiment" },
    ...(pricing ? [{ id: "pricing", label: "Pricing & TCO" }] : []),
    { id: "customer", label: "Customer profile" },
    { id: "future",   label: "Future focus" },
    { id: "related",  label: "Related vendors" },
  ];

  const BASE_URL = "https://aienterpriseit.com/market-intelligence";
  const vendorMeta = {
    title: `${vendor.name} — ${category.title} Market Position & SWOT 2026`,
    description: `${vendor.name} profile: market position, SWOT analysis, user sentiment, ICP, and future focus in the ${category.title} market. Updated weekly.`,
    canonical: `${BASE_URL}/vendor/${categorySlug}/${vendorSlug}`,
  };

  return (
    <PageShell dataDate={LAST_UPDATED} footerLogoId="vendor-footer">
      <PageMeta {...vendorMeta} />
      {/* Breadcrumb */}
      <div className="border-b border-border/60 bg-card/30">
        <div className="container px-6 py-4">
          <Link
            to={`/market/${categorySlug}`}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to {category.title}
          </Link>
        </div>
      </div>

      {/* Two-column body — content + sticky TOC */}
      <div className="container px-6">
        <div className="flex gap-10">
          <div className="min-w-0 flex-1">
            {/* ── Hero / overview ─────────────────────────────── */}
            <section id="overview" className="scroll-mt-32 py-10">
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Badges */}
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span
                    className="rounded-full border px-2.5 py-1 text-xs font-semibold"
                    style={{ color: categoryColor, borderColor: `${categoryColor}40`, backgroundColor: `${categoryColor}15` }}
                  >
                    {category.title}
                  </span>
                  <span className={cn("rounded-full border px-2.5 py-1 text-xs font-semibold", TYPE_BADGE[vendor.type] ?? "")}>
                    {TYPE_LABEL[vendor.type] ?? vendor.type}
                  </span>
                  {vendor.highlight && (
                    <span className="rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                      {vendor.highlight}
                    </span>
                  )}
                </div>

                <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {vendor.name}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {vendor.description}
                </p>

                {/* Metrics row — Stat primitive */}
                <div className="mt-6 flex flex-wrap gap-3">
                  {vendor.marketCap && vendor.marketCap !== "—" && (
                    <Stat icon={<DollarSign className="h-3.5 w-3.5" />} label="Mkt Cap / Val" value={vendor.marketCap} />
                  )}
                  {vendor.revenue && vendor.revenue !== "—" && (
                    <Stat icon={<BarChart2 className="h-3.5 w-3.5" />} label="Revenue" value={vendor.revenue} />
                  )}
                  {vendor.growth && vendor.growth !== "—" && (
                    <Stat icon={<TrendingUp className="h-3.5 w-3.5" />} label="Growth" value={<GrowthValue value={vendor.growth} />} />
                  )}
                </div>

                {/* Compare CTA */}
                {categorySlug && vendorSlug && (
                  <div className="mt-4">
                    <button
                      onClick={() => {
                        const currentKey = `${categorySlug}/${vendorSlug}`;
                        const existing = compareParams.get("v");
                        if (existing) {
                          const keys = existing.split(",").filter(Boolean);
                          if (!keys.includes(currentKey) && keys.length < 3) {
                            navigate(`/compare?v=${[...keys, currentKey].join(",")}`);
                          } else {
                            navigate(`/compare?v=${existing}`);
                          }
                        } else {
                          navigate(`/compare?v=${currentKey}`);
                        }
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <GitCompare className="h-3.5 w-3.5" />
                      Compare +
                    </button>
                  </div>
                )}

                {/* Recent event */}
                {vendor.recentEvent && (
                  <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-warning/25 bg-warning/10 px-3 py-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
                    <span className="text-xs font-medium text-warning">{vendor.recentEvent}</span>
                  </div>
                )}

                {/* Editorial pull-quote — competitive edge */}
                <figure className="mt-10 border-l-2 border-primary/40 pl-6">
                  <Quote className="mb-2 h-6 w-6 text-primary/40" aria-hidden />
                  <blockquote className="font-serif text-lg italic leading-relaxed text-foreground/90 sm:text-xl">
                    {profile.competitiveEdge}
                  </blockquote>
                  <figcaption className="mt-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    Analyst take · Competitive edge
                  </figcaption>
                </figure>
              </motion.div>
            </section>

            {/* ── SWOT ───────────────────────────────────────── */}
            <section id="swot" className="scroll-mt-32 border-t border-border/60 py-12">
              <motion.div {...fadeUp(0.05)}>
                <SectionHeader icon={<ShieldCheck className="h-5 w-5" />} title="SWOT Analysis" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Surface variant="success" padding="lg">
                    <div className="mb-3 flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-success" />
                      <span className="text-sm font-semibold text-success">Strengths</span>
                    </div>
                    <BulletList items={profile.swot.strengths} dotClass="bg-success/70" />
                  </Surface>

                  <Surface variant="info" padding="lg">
                    <div className="mb-3 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-info" />
                      <span className="text-sm font-semibold text-info">Opportunities</span>
                    </div>
                    <BulletList items={profile.swot.opportunities} dotClass="bg-info/70" />
                  </Surface>

                  <Surface variant="danger" padding="lg">
                    <div className="mb-3 flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-danger" />
                      <span className="text-sm font-semibold text-danger">Weaknesses</span>
                    </div>
                    <BulletList items={profile.swot.weaknesses} dotClass="bg-danger/70" />
                  </Surface>

                  <Surface variant="warning" padding="lg">
                    <div className="mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-warning" />
                      <span className="text-sm font-semibold text-warning">Threats</span>
                    </div>
                    <BulletList items={profile.swot.threats} dotClass="bg-warning/70" />
                  </Surface>
                </div>
              </motion.div>
            </section>

            {/* ── User Sentiment ─────────────────────────────── */}
            <section id="sentiment" className="scroll-mt-32 border-t border-border/60 py-12">
              <motion.div {...fadeUp(0.05)}>
                <SectionHeader
                  icon={<ThumbsUp className="h-5 w-5" />}
                  title="User Sentiment"
                  description="Synthesized from G2, Gartner Peer Insights, and analyst review data."
                />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Surface variant="default" padding="lg" className="border-success/30">
                    <div className="mb-4 flex items-center gap-2">
                      <ThumbsUp className="h-4 w-4 text-success" />
                      <span className="text-sm font-semibold text-success">What users love</span>
                    </div>
                    <BulletList items={profile.userLikes} dotClass="bg-success" />
                  </Surface>

                  <Surface variant="default" padding="lg" className="border-danger/30">
                    <div className="mb-4 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-danger" />
                      <span className="text-sm font-semibold text-danger">Common complaints</span>
                    </div>
                    <BulletList items={profile.userComplaints} dotClass="bg-danger" />
                  </Surface>
                </div>
              </motion.div>
            </section>

            {/* ── Pricing & TCO ──────────────────────────────── */}
            {pricing && (
              <div className="border-t border-border/60">
                <PricingSection pricing={pricing} />
              </div>
            )}

            {/* ── Customer Profile ───────────────────────────── */}
            <section id="customer" className="scroll-mt-32 border-t border-border/60 py-12">
              <motion.div {...fadeUp(0.05)}>
                <SectionHeader icon={<Users className="h-5 w-5" />} title="Customer Profile" />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Surface variant="default" padding="lg" className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-executive-purple" />
                      <span className="text-sm font-semibold text-executive-purple">Who buys this</span>
                    </div>
                    <div>
                      <p className="mb-2 text-[11px] uppercase tracking-wider text-muted-foreground">Typical segments</p>
                      <div className="flex flex-wrap gap-2">
                        {profile.customerProfile.segments.map((seg, i) => (
                          <span
                            key={i}
                            className="rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground"
                          >
                            {seg}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="mb-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">Typical buyer</p>
                      <p className="text-sm font-medium text-foreground">{profile.customerProfile.typicalBuyer}</p>
                    </div>
                  </Surface>

                  <Surface variant="default" padding="lg">
                    <div className="mb-4 flex items-center gap-2">
                      <Target className="h-4 w-4 text-info" />
                      <span className="text-sm font-semibold text-info">Top use cases</span>
                    </div>
                    <ol className="space-y-3">
                      {profile.customerProfile.topUseCases.map((uc, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm leading-snug">
                          <span
                            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold tabular-nums text-white"
                            style={{ backgroundColor: categoryColor }}
                          >
                            {i + 1}
                          </span>
                          <span className="text-muted-foreground">{uc}</span>
                        </li>
                      ))}
                    </ol>
                  </Surface>
                </div>
              </motion.div>
            </section>

            {/* ── Future Focus ───────────────────────────────── */}
            <section id="future" className="scroll-mt-32 border-t border-border/60 py-12">
              <motion.div {...fadeUp(0.05)}>
                <SectionHeader icon={<Zap className="h-5 w-5" />} title="Future Focus Areas" />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {profile.futureAreas.map((area, i) => (
                    <Surface
                      key={i}
                      variant="default"
                      padding="md"
                      className="flex items-start gap-3"
                    >
                      <span
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold tabular-nums text-white"
                        style={{ backgroundColor: categoryColor }}
                      >
                        {i + 1}
                      </span>
                      <p className="text-sm leading-snug text-muted-foreground">{area}</p>
                    </Surface>
                  ))}
                </div>
              </motion.div>
            </section>

            {/* ── Related ────────────────────────────────────── */}
            <div className="border-t border-border/60">
              {vendorSlug && (
                <RelatedVendors
                  category={category as { id: string; title: string; vendors?: VendorEntry[]; startups?: VendorEntry[] }}
                  currentSlug={vendorSlug}
                  categoryColor={categoryColor}
                />
              )}
            </div>
          </div>

          {/* Sticky right rail TOC */}
          <VendorTOC entries={tocEntries} />
        </div>
      </div>
    </PageShell>
  );
};

export default VendorDetailPage;
