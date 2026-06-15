import { Brain } from "lucide-react";
import { LogoMark } from "@/components/Logo";
import { COPYRIGHT_YEAR, LAST_UPDATED } from "@/data/lastUpdated";
import { cn } from "@/lib/utils";

/*
  SiteFooter — single source of truth for the site footer.
  Replaces inline copies in Index, MarketPage, VendorDetailPage, AboutPage,
  PricingPage, SignalsPage, ComparisonPage.
*/

interface SiteFooterProps {
  /** Override the displayed "Data as of …" — typically passed when the live
   *  refresh timestamp is known on this page. Defaults to LAST_UPDATED. */
  dataDate?: string;
  /** Show a green "● Live" badge next to the data date. */
  isLive?: boolean;
  /** Unique id for the footer logo's SVG gradient (avoids duplicate gradient ids). */
  logoId?: string;
  className?: string;
}

export function SiteFooter({
  dataDate = LAST_UPDATED,
  isLive = false,
  logoId = "footer",
  className,
}: SiteFooterProps) {
  return (
    <footer
      className={cn(
        "border-t border-border/80 bg-card/30 py-12 backdrop-blur",
        className
      )}
    >
      <div className="container px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <a
            href={import.meta.env.PROD ? "/market-intelligence/" : "/"}
            className="flex items-center gap-3 text-sm text-muted-foreground transition-opacity hover:opacity-80"
            aria-label="Back to home"
          >
            <LogoMark size={22} id={logoId} />
            <span>
              © {COPYRIGHT_YEAR} AI Enterprise IT · Market Intelligence Portal
            </span>
          </a>

          <div className="flex flex-col items-center gap-3 text-center text-xs text-muted-foreground sm:flex-row sm:text-left">
            <span>
              Data as of {dataDate}
              {isLive ? (
                <span className="ml-2 text-success">● Live</span>
              ) : null}
              <span className="mx-2 text-border">·</span>
              Sources: Gartner, Forrester, Grand View Research, Mordor Intelligence, MarketsandMarkets & other industry analysts · company filings
            </span>
            <span className="hidden h-3 w-px bg-border sm:inline-block" />
            <span className="inline-flex items-center gap-1.5">
              <Brain className="h-3.5 w-3.5" />
              Powered by Claude AI
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
