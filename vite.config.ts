import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { readFileSync } from "fs";
import { componentTagger } from "lovable-tagger";

// Routes to statically prerender. Derived from route-meta.json (generated pre-build from
// the same TS data the pages use) → router paths. Includes dynamic vendor routes, which
// vite-react-ssg cannot enumerate on its own.
function ssgRoutes(): string[] {
  // POC mode: prerender one of each route type to validate the pipeline quickly.
  if (process.env.SSG_POC) {
    return process.env.SSG_POC === "1"
      ? ["/about"]                                   // single minimal route (no charts) to isolate hangs
      : process.env.SSG_POC.split(",");              // explicit comma-separated route list
  }
  const meta = JSON.parse(readFileSync(path.resolve(__dirname, "public/route-meta.json"), "utf8"));
  const paths = new Set<string>(["/"]);
  for (const key of Object.keys(meta)) {
    paths.add(key === "overview" ? "/overview" : `/${key}`);
  }
  return [...paths];
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  base: mode === "production" ? "/wp-content/plugins/autonomous-it-insights/app/" : "/",
  ssgOptions: {
    entry: "src/main.tsx",
    dirStyle: "nested",          // /market/aiops → market/aiops/index.html
    script: "async",
    formatting: "none",          // prettify would break hydration
    beastiesOptions: false,      // skip critical-CSS inlining (it stalls on external Google Fonts @import)
    includedRoutes: () => ssgRoutes(),
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Function form (not object) so the SSR pass — which externalizes react/react-dom —
        // doesn't error with "react cannot be included in manualChunks". We only assign
        // chunks for libs we match; react/react-dom are left to rollup's default handling.
        manualChunks(id: string) {
          if (!id.includes("node_modules")) return;
          if (id.includes("recharts")) return "vendor-charts";
          if (id.includes("framer-motion")) return "vendor-motion";
          if (id.includes("@radix-ui")) return "vendor-ui";
        },
      },
    },
  },
}));
