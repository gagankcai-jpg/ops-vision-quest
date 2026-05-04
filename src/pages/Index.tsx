import { lazy, Suspense, useEffect } from "react";
import { useLocation } from "react-router-dom";
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

  return (
    <PageShell noTopPadding dataDate={displayDate} isLive={status === "live"}>
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
