import { lazy, Suspense } from "react";
import Navigation from "@/components/presentation/Navigation";
import HeroSection from "@/components/presentation/HeroSection";
import { LAST_UPDATED, COPYRIGHT_YEAR } from "@/data/lastUpdated";
import { useMarketData } from "@/hooks/useMarketData";

const ExecutiveSummary = lazy(() => import("@/components/presentation/ExecutiveSummary"));
const VendorComparisonMatrix = lazy(() => import("@/components/presentation/VendorComparisonMatrix"));
const CategorySection = lazy(() => import("@/components/presentation/CategorySection"));

const Index = () => {
  const { data: markets, status, lastRefresh } = useMarketData();
  const displayDate = status === "live" && lastRefresh
    ? new Date(lastRefresh).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : LAST_UPDATED;

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navigation />

      <main>
        <HeroSection markets={markets} dataDate={displayDate} />

        <Suspense fallback={null}>
          <div id="summary">
            <ExecutiveSummary markets={markets} />
          </div>

          <div id="comparison">
            <VendorComparisonMatrix />
          </div>

          <div id="aiops">
            <CategorySection data={markets.aiops} index={0} />
          </div>

          <div id="itom">
            <CategorySection data={markets.itom} index={1} />
          </div>

          <div id="rpa">
            <CategorySection data={markets.rpa} index={2} />
          </div>

          <div id="agentops">
            <CategorySection data={markets.agentops} index={3} />
          </div>

          <div id="secops">
            <CategorySection data={markets.secops} index={4} />
          </div>
        </Suspense>

        {/* Footer */}
        <footer className="py-12 border-t border-border bg-card">
          <div className="container px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                © {COPYRIGHT_YEAR} Autonomous IT Market Intelligence. Executive Intelligence Report.
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>
                  Data as of {displayDate}
                  {status === "live" && <span className="ml-2 text-xs text-green-400">● Live</span>}
                  {" · "}Sources: Gartner, IDC, Mordor Intelligence, Fortune Business Insights, QKS Group
                </span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
