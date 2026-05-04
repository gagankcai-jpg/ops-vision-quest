import { useState, useEffect } from "react";
import {
  aiopsData, itomData, rpaData, agentopsData, secopsData,
  type MarketData,
} from "@/data/marketData";
import { LAST_UPDATED } from "@/data/lastUpdated";

const STATIC_DATA: Record<string, MarketData> = {
  aiops:    aiopsData,
  itom:     itomData,
  rpa:      rpaData,
  agentops: agentopsData,
  secops:   secopsData,
};

// WP REST API endpoint — resolves to empty string in dev (uses static fallback)
const API_BASE =
  typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? "/wp-json/ait/v1"
    : "";

export type RefreshStatus = "idle" | "loading" | "live" | "static";

export interface MarketDataState {
  data: Record<string, MarketData>;
  status: RefreshStatus;
  lastRefresh: string | null;
}

export function useMarketData(): MarketDataState {
  const [state, setState] = useState<MarketDataState>({
    data:        STATIC_DATA,
    status:      "loading",
    lastRefresh: null,
  });

  useEffect(() => {
    if ( ! API_BASE ) {
      setState({ data: STATIC_DATA, status: "static", lastRefresh: null });
      return;
    }

    const controller = new AbortController();

    async function fetchLiveData() {
      try {
        const res = await fetch( `${API_BASE}/markets`, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        } );

        if ( ! res.ok ) throw new Error( `HTTP ${res.status}` );

        const json = await res.json();

        // Merge live data over static defaults so missing fields always have a fallback.
        // TAM/CAGR/chart/scope/source fields are ALWAYS sourced from static data — only
        // vendor arrays and narrative content are accepted from the live API so that
        // manually-researched market figures are never overwritten by cached plugin data.
        const LIVE_ALLOWED_KEYS = new Set([
          "vendors", "startups",
          "useCases", "trends", "opportunities",
        ]);
        const merged: Record<string, MarketData> = { ...STATIC_DATA };
        for ( const slug of Object.keys( STATIC_DATA ) ) {
          if ( json[ slug ]?.data ) {
            const liveFiltered: Record<string, unknown> = {};
            for ( const key of Object.keys( json[ slug ].data ) ) {
              if ( LIVE_ALLOWED_KEYS.has( key ) ) {
                liveFiltered[ key ] = json[ slug ].data[ key ];
              }
            }
            merged[ slug ] = { ...STATIC_DATA[ slug ], ...liveFiltered };
          }
        }

        // Infer last refresh from the newest snapshot_at value.
        // Only surface the DB date if it is strictly newer than the static
        // LAST_UPDATED — otherwise the static deployment date is more recent
        // and should be used as the display date (pages fall back to LAST_UPDATED
        // when lastRefresh is null).
        const timestamps = Object.values( json )
          .map( ( v: any ) => v.snapshot_at )
          .filter( Boolean )
          .sort()
          .reverse();

        const dbDate     = timestamps[0] ? new Date( timestamps[0] ) : null;
        const staticDate = new Date( `1 ${LAST_UPDATED}` );          // "1 May 2026"
        const effectiveLastRefresh =
          dbDate && dbDate > staticDate ? timestamps[0] : null;

        setState( {
          data:        merged,
          status:      "live",
          lastRefresh: effectiveLastRefresh,
        } );
      } catch ( err: any ) {
        if ( err.name !== "AbortError" ) {
          // Network error or API not yet seeded — fall back to static data silently
          setState( { data: STATIC_DATA, status: "static", lastRefresh: null } );
        }
      }
    }

    fetchLiveData();
    return () => controller.abort();
  }, [] );

  return state;
}
