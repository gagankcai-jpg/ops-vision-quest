import { Outlet } from "react-router-dom";
import type { RouteRecord } from "vite-react-ssg";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import MarketPage from "./pages/MarketPage";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";
import { ErrorBoundary } from "./components/ErrorBoundary";

const queryClient = new QueryClient();

// Root layout — hosts the app-wide providers and renders the matched route via <Outlet />.
// (Previously these wrapped <BrowserRouter> in a single App component; with vite-react-ssg
// the router is created from the `routes` array below, so providers live in a layout route.)
function RootLayout() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Outlet />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

// Route-level lazy() (React Router data-router form) — resolved BEFORE render during SSG,
// so these pages prerender with real content instead of a Suspense fallback. Still code-split.
export const routes: RouteRecord[] = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Index /> },
      { path: "overview", element: <Index /> },
      { path: "market/:slug", element: <MarketPage /> },
      { path: "about", element: <AboutPage /> },
      {
        path: "vendor/:categorySlug/:vendorSlug",
        lazy: async () => ({ Component: (await import("./pages/VendorDetailPage")).default }),
      },
      {
        path: "pricing",
        lazy: async () => ({ Component: (await import("./pages/PricingPage")).default }),
      },
      {
        path: "signals",
        lazy: async () => ({ Component: (await import("./pages/SignalsPage")).default }),
      },
      {
        path: "compare",
        lazy: async () => ({ Component: (await import("./pages/ComparisonPage")).default }),
      },
      { path: "*", element: <NotFound /> },
    ],
  },
];
