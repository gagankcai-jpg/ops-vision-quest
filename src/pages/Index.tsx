import { lazy, Suspense, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import HeroSection from "@/components/presentation/HeroSection";
import SignalsTeaser from "@/components/presentation/SignalsTeaser";
import { PageShell } from "@/components/layout/PageShell";
import { LAST_UPDATED } from "@/data/lastUpdated";
import { useMarketData } from "@/hooks/useMarketData";

const ExecutiveSummary = lazy(() => import("@/components/presentation/ExecutiveSummary"));
const VendorComparisonMatrix = lazy(() => import("@/components/presentation/VendorComparisonMatrix"));

const Index = () => {
  const location = useLocation();
  const { data: markets, status, lastRefresh } = useMarketData();

  // Scroll to section when navigated here from another page
  useEffect(() => {
    const scrollTo = (location.state as { scrollTo?: string } | null)?.scrollTo;
    if (!scrollTo) return;
    const timer = setTimeout(() => {
      const el = document.getElementById(scrollTo);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 300);
    return () => clearTimeout(timer);
  }, [location.state]);

  const displayDate =
    status === "live" && lastRefresh
      ? new Date(lastRefresh).toLocaleDateString("en-US", { month: "long", year: "numeric" })
      : LAST_UPDATED;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DataCatalog",
    "name": "Autonomous IT Market Intelligence",
    "description": "Analyst-grade coverage of AIOps, ITOM, RPA, Agentic Operations, and SecOps markets 2025–2030. 500+ vendors. Refreshed weekly.",
    "url": "https://aienterpriseit.com/market-intelligence/",
    "provider": { "@type": "Organization", "name": "AI Enterprise IT", "url": "https://aienterpriseit.com" },
    "license": "https://creativecommons.org/licenses/by/4.0/",
    "creator": { "@type": "Organization", "name": "AI Enterprise IT", "url": "https://aienterpriseit.com" },
    "dataset": [
      {
        "@type": "Dataset",
        "name": "AIOps & Observability Market 2025–2030",
        "description": "Market sizing, CAGR projections, and vendor profiles for 100+ AIOps and observability vendors. TAM reaches $100B by 2030 at 22% CAGR.",
        "url": "https://aienterpriseit.com/market-intelligence/market/aiops",
        "license": "https://creativecommons.org/licenses/by/4.0/",
        "creator": { "@type": "Organization", "name": "AI Enterprise IT", "url": "https://aienterpriseit.com" },
      },
      {
        "@type": "Dataset",
        "name": "IT Service, Operations & Asset Management Market 2025–2030",
        "description": "Market sizing, CAGR projections, and vendor profiles for 100+ ITSM, ITAM, and Cloud FinOps vendors. TAM reaches $94B by 2030 at 13% CAGR.",
        "url": "https://aienterpriseit.com/market-intelligence/market/itom",
        "license": "https://creativecommons.org/licenses/by/4.0/",
        "creator": { "@type": "Organization", "name": "AI Enterprise IT", "url": "https://aienterpriseit.com" },
      },
      {
        "@type": "Dataset",
        "name": "RPA & Intelligent Automation Market 2025–2030",
        "description": "Market sizing, CAGR projections, and vendor profiles for 100+ RPA and intelligent automation vendors. TAM reaches $74B by 2030 at 25% CAGR.",
        "url": "https://aienterpriseit.com/market-intelligence/market/rpa",
        "license": "https://creativecommons.org/licenses/by/4.0/",
        "creator": { "@type": "Organization", "name": "AI Enterprise IT", "url": "https://aienterpriseit.com" },
      },
      {
        "@type": "Dataset",
        "name": "Agentic Operations Market 2025–2030",
        "description": "Market sizing, CAGR projections, and vendor profiles for 100+ agentic IT operations vendors. TAM reaches $8B by 2030 at 45% CAGR — the fastest-growing autonomous IT segment.",
        "url": "https://aienterpriseit.com/market-intelligence/market/agentops",
        "license": "https://creativecommons.org/licenses/by/4.0/",
        "creator": { "@type": "Organization", "name": "AI Enterprise IT", "url": "https://aienterpriseit.com" },
      },
      {
        "@type": "Dataset",
        "name": "Security Operations Market 2025–2030",
        "description": "Market sizing, CAGR projections, and vendor profiles for 100+ SecOps vendors including SIEM, SOAR, XDR, and threat intelligence. TAM reaches $54B by 2030 at 21% CAGR.",
        "url": "https://aienterpriseit.com/market-intelligence/market/secops",
        "license": "https://creativecommons.org/licenses/by/4.0/",
        "creator": { "@type": "Organization", "name": "AI Enterprise IT", "url": "https://aienterpriseit.com" },
      },
    ],
  };

  return (
    <PageShell noTopPadding dataDate={displayDate} isLive={status === "live"}>
      <Helmet>
        <title>Autonomous IT Market Intelligence 2025–2030 | AI Enterprise IT</title>
        <meta name="description" content="Analyst-grade market intelligence covering AIOps, ITOM, RPA, Agentic Operations, and Security Operations. 500+ vendors profiled. $330B+ combined TAM by 2030. Updated weekly." />
        <link rel="canonical" href="https://aienterpriseit.com/market-intelligence/" />
        <meta property="og:title" content="Autonomous IT Market Intelligence 2025–2030 | AI Enterprise IT" />
        <meta property="og:description" content="Free analyst-grade coverage of the five pillars of the autonomous enterprise stack. AIOps, ITOM, RPA, AgentOps, SecOps. 500+ vendors. Weekly refresh." />
        <meta property="og:url" content="https://aienterpriseit.com/market-intelligence/" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <HeroSection markets={markets} dataDate={displayDate} />
      <SignalsTeaser />

      <Suspense fallback={null}>
        <div id="summary">
          <ExecutiveSummary markets={markets} />
        </div>
        <div id="comparison">
          <VendorComparisonMatrix />
        </div>
      </Suspense>
    </PageShell>
  );
};

export default Index;
