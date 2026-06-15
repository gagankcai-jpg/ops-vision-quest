import {
  aiopsData, itomData, rpaData, agentopsData, secopsData,
  type MarketData,
} from "@/data/marketData";

const STATIC_DATA: Record<string, MarketData> = {
  aiops:    aiopsData,
  itom:     itomData,
  rpa:      rpaData,
  agentops: agentopsData,
  secops:   secopsData,
};

export type RefreshStatus = "idle" | "loading" | "live" | "static";

export interface MarketDataState {
  data: Record<string, MarketData>;
  status: RefreshStatus;
  lastRefresh: string | null;
}

// Single source of truth: the static TS catalog in src/data/*.ts, refreshed weekly by the
// `ait-weekly-market-refresh` routine (targeted, version-controlled edits) and shipped on
// each deploy. The former WP-Cron REST "live data layer" was retired — it regenerated a
// parallel snapshot that diverged from this catalog and overrode the vendor tables with
// stale data. Pages fall back to LAST_UPDATED for the freshness date when lastRefresh is null.
export function useMarketData(): MarketDataState {
  return { data: STATIC_DATA, status: "static", lastRefresh: null };
}
