import { useParams, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { allCategories } from "@/data/marketData";
import { useMarketData } from "@/hooks/useMarketData";
import { LAST_UPDATED } from "@/data/lastUpdated";
import { PageShell } from "@/components/layout/PageShell";
import CategorySection from "@/components/presentation/CategorySection";

const SLUG_ORDER = ["aiops", "itom", "rpa", "agentops", "secops"];

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
            <Link to="/" className="text-primary hover:underline">
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

  return (
    <PageShell
      dataDate={displayDate}
      isLive={status === "live"}
      footerLogoId="market-footer"
    >
      {/* Breadcrumb / meta strip */}
      <div className="border-b border-border/60 bg-card/30">
        <div className="container flex items-center justify-between px-6 py-4">
          <Link
            to="/"
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
