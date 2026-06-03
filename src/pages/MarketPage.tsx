import { useParams, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { allCategories } from "@/data/marketData";
import { useMarketData } from "@/hooks/useMarketData";
import { LAST_UPDATED } from "@/data/lastUpdated";
import { PageShell } from "@/components/layout/PageShell";
import CategorySection from "@/components/presentation/CategorySection";
import { PageMeta } from "@/components/seo/PageMeta";

const SLUG_ORDER = ["aiops", "itom", "rpa", "agentops", "secops"];

const BASE_URL = "https://aienterpriseit.com/market-intelligence";

const ORG = { "@type": "Organization", "name": "AI Enterprise IT", "url": "https://aienterpriseit.com" };
const LICENSE = "https://creativecommons.org/licenses/by/4.0/";

const MARKET_JSONLD: Record<string, object> = {
  aiops: {
    "@context": "https://schema.org", "@type": "Dataset",
    "name": "AIOps & Observability Market 2025–2030",
    "description": "Market sizing, CAGR projections, and vendor profiles for 100+ AIOps and observability vendors. TAM reaches $100B by 2030 at 22% CAGR.",
    "url": `${BASE_URL}/market/aiops`,
    "license": LICENSE, "creator": ORG, "provider": ORG,
  },
  itom: {
    "@context": "https://schema.org", "@type": "Dataset",
    "name": "IT Service, Operations & Asset Management Market 2025–2030",
    "description": "Market sizing, CAGR projections, and vendor profiles for 100+ ITSM, ITAM, and Cloud FinOps vendors. TAM reaches $94B by 2030 at 13% CAGR.",
    "url": `${BASE_URL}/market/itom`,
    "license": LICENSE, "creator": ORG, "provider": ORG,
  },
  rpa: {
    "@context": "https://schema.org", "@type": "Dataset",
    "name": "RPA & Intelligent Automation Market 2025–2030",
    "description": "Market sizing, CAGR projections, and vendor profiles for 100+ RPA and intelligent automation vendors. TAM reaches $74B by 2030 at 25% CAGR.",
    "url": `${BASE_URL}/market/rpa`,
    "license": LICENSE, "creator": ORG, "provider": ORG,
  },
  agentops: {
    "@context": "https://schema.org", "@type": "Dataset",
    "name": "Agentic Operations Market 2025–2030",
    "description": "Market sizing, CAGR projections, and vendor profiles for 100+ agentic IT operations vendors. TAM reaches $8B by 2030 at 45% CAGR — the fastest-growing autonomous IT segment.",
    "url": `${BASE_URL}/market/agentops`,
    "license": LICENSE, "creator": ORG, "provider": ORG,
  },
  secops: {
    "@context": "https://schema.org", "@type": "Dataset",
    "name": "Security Operations Market 2025–2030",
    "description": "Market sizing, CAGR projections, and vendor profiles for 100+ SecOps vendors including SIEM, SOAR, XDR, and threat intelligence. TAM reaches $54B by 2030 at 21% CAGR.",
    "url": `${BASE_URL}/market/secops`,
    "license": LICENSE, "creator": ORG, "provider": ORG,
  },
};

const MARKET_META: Record<string, { title: string; description: string }> = {
  aiops:    { title: "AIOps & Observability Market 2025–2030", description: "AIOps market reaches $100B by 2030 at 22% CAGR. 100+ vendor profiles covering Dynatrace, Datadog, New Relic, Splunk, and more." },
  itom:     { title: "IT Service, Operations & Asset Management Market 2025–2030", description: "ITSM, ITAM, and Cloud FinOps market reaches $94B by 2030 at 13% CAGR. 100+ vendor profiles: ServiceNow, BMC, Flexera, Tanium, Apptio, CAST AI, and more." },
  rpa:      { title: "RPA & Intelligent Automation Market 2025–2030", description: "RPA market reaches $74B by 2030 at 25% CAGR. UiPath, Automation Anywhere, Blue Prism, and 97 more vendors analyzed." },
  agentops: { title: "Agentic Operations Market 2025–2030", description: "Agentic IT Operations market reaches $8B by 2030 at 45% CAGR — the fastest-growing segment in the autonomous IT stack." },
  secops:   { title: "Security Operations Market 2025–2030", description: "SecOps market reaches $54B by 2030 at 21% CAGR. CrowdStrike, Palo Alto Networks, SentinelOne, and 97 more vendors profiled." },
};

const MarketPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: markets, status, lastRefresh } = useMarketData();

  const staticData = allCategories.find((c) => c.id === slug);
  const liveData = markets?.[slug ?? ""];

  // Merge live TAM/chart data over static structure data
  const data = staticData ? { ...staticData, ...(liveData ?? {}) } : null;

  const displayDate =
    status === "live" && lastRefresh
      ? new Date(lastRefresh).toLocaleDateString("en-US", { month: "long", year: "numeric" })
      : LAST_UPDATED;

  if (!data) {
    return (
      <PageShell footerLogoId="market-404">
        <div className="container flex min-h-[60vh] items-center justify-center px-6">
          <div className="text-center">
            <p className="mb-4 text-muted-foreground">Market not found.</p>
            <Link to="/overview" className="text-primary hover:underline">
              ← Back to Overview
            </Link>
          </div>
        </div>
      </PageShell>
    );
  }

  const slugIndex = SLUG_ORDER.indexOf(slug ?? "");
  const prevSlug = slugIndex > 0 ? SLUG_ORDER[slugIndex - 1] : null;
  const nextSlug = slugIndex < SLUG_ORDER.length - 1 ? SLUG_ORDER[slugIndex + 1] : null;
  const prevData = prevSlug ? allCategories.find((c) => c.id === prevSlug) : null;
  const nextData = nextSlug ? allCategories.find((c) => c.id === nextSlug) : null;

  const meta = MARKET_META[slug ?? ""];

  return (
    <PageShell
      dataDate={displayDate}
      isLive={status === "live"}
      footerLogoId="market-footer"
    >
      {meta && (
        <PageMeta
          title={meta.title}
          description={meta.description}
          canonical={`${BASE_URL}/market/${slug}`}
        />
      )}
      {slug && MARKET_JSONLD[slug] && (
        <Helmet>
          <script type="application/ld+json">{JSON.stringify(MARKET_JSONLD[slug])}</script>
        </Helmet>
      )}
      {/* Breadcrumb / meta strip */}
      <div className="border-b border-border/60 bg-card/30">
        <div className="container flex items-center justify-between px-6 py-4">
          <Link
            to="/overview"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to overview
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">
              Data as of {displayDate}
              {status === "live" && (
                <span className="ml-2 text-success">● Live</span>
              )}
            </span>
            {nextData && (
              <Link
                to={`/market/${nextData.id}`}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {nextData.title}
                <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </div>

      <CategorySection data={data} index={0} />

      {/* Prev / Next navigation */}
      <nav
        aria-label="Adjacent markets"
        className="border-t border-border/60"
      >
        <div className="container flex items-center justify-between gap-4 px-6 py-10">
          {prevData ? (
            <Link
              to={`/market/${prevData.id}`}
              className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              <span>
                <span className="block text-[11px] uppercase tracking-wider text-muted-foreground/70">
                  Previous market
                </span>
                <span>{prevData.title}</span>
              </span>
            </Link>
          ) : (
            <span />
          )}
          {nextData ? (
            <Link
              to={`/market/${nextData.id}`}
              className="group ml-auto inline-flex items-center gap-2 text-right text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <span>
                <span className="block text-[11px] uppercase tracking-wider text-muted-foreground/70">
                  Next market
                </span>
                <span>{nextData.title}</span>
              </span>
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ) : (
            <span />
          )}
        </div>
      </nav>
    </PageShell>
  );
};

export default MarketPage;
