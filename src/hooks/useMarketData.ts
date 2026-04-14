import { useState, useEffect } from "react";
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

        // Merge live data over static defaults so missing fields always have a fallback
        const merged: Record<string, MarketData> = { ...STATIC_DATA };
        for ( const slug of Object.keys( STATIC_DATA ) ) {
          if ( json[ slug ]?.data ) {
            merged[ slug ] = { ...STATIC_DATA[ slug ], ...json[ slug ].data };
          }
        }

        // Infer last refresh from the newest snapshot_at value
        const timestamps = Object.values( json )
          .map( ( v: any ) => v.snapshot_at )
          .filter( Boolean )
          .sort()
          .reverse();

        setState( {
          data:        merged,
          status:      "live",
          lastRefresh: timestamps[0] ?? null,
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
