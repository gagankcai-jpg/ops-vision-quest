import { lazy, Suspense } from "react";
import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/presentation/Navigation";
import { allCategories } from "@/data/marketData";
import { useMarketData } from "@/hooks/useMarketData";
import { ChevronLeft } from "lucide-react";
import { LAST_UPDATED } from "@/data/lastUpdated";

const CategorySection = lazy(() => import("@/components/presentation/CategorySection"));

const SLUG_ORDER = ["aiops", "itom", "rpa", "agentops", "secops"];

const MarketPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: markets, status, lastRefresh } = useMarketData();

  const staticData = allCategories.find((c) => c.id === slug);
  const liveData = markets?.[slug ?? ""];

  // Merge live TAM/chart data over static structure data
  const data = staticData
    ? { ...staticData, ...(liveData ?? {}) }
    : null;

  const displayDate =
    status === "live" && lastRefresh
      ? new Date(lastRefresh).toLocaleDateString("en-US", { month: "long", year: "numeric" })
      : LAST_UPDATED;

  if (!data) {
    return (
      <div className="min-h-screen bg-background font-sans flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Market not found.</p>
          <Link to="/" className="text-primary hover:underline">← Back to Overview</Link>
        </div>
      </div>
    );
  }

  const slugIndex = SLUG_ORDER.indexOf(slug ?? "");
  const prevSlug = slugIndex > 0 ? SLUG_ORDER[slugIndex - 1] : null;
  const nextSlug = slugIndex < SLUG_ORDER.length - 1 ? SLUG_ORDER[slugIndex + 1] : null;
  const prevData = prevSlug ? allCategories.find((c) => c.id === prevSlug) : null;
  const nextData = nextSlug ? allCategories.find((c) => c.id === nextSlug) : null;

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navigation />

      <main className="pt-20">
        {/* Breadcrumb */}
        <div className="container px-6 py-6 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Overview
          </Link>
          <span className="text-xs text-muted-foreground">
            Data as of {displayDate}
            {status === "live" && <span className="ml-2 text-green-400">● Live</span>}
          </span>
        </div>

        <Suspense fallback={null}>
          <CategorySection data={data} index={0} />
        </Suspense>

        {/* Prev / Next navigation */}
        <div className="container px-6 py-12 border-t border-border flex items-center justify-between gap-4">
          {prevData ? (
            <Link
              to={`/market/${prevData.id}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{prevData.title}</span>
            </Link>
          ) : <div />}
          {nextData ? (
            <Link
              to={`/market/${nextData.id}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors ml-auto"
            >
              <span>{nextData.title}</span>
              <ChevronLeft className="w-4 h-4 rotate-180" />
            </Link>
          ) : <div />}
        </div>
      </main>
    </div>
  );
};

export default MarketPage;
