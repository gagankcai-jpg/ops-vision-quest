import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MarketPage from "./pages/MarketPage";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";
import { ErrorBoundary } from "./components/ErrorBoundary";

const VendorDetailPage = lazy(() => import("./pages/VendorDetailPage"));
const PricingPage      = lazy(() => import("./pages/PricingPage"));
const SignalsPage      = lazy(() => import("./pages/SignalsPage"));
const ComparisonPage   = lazy(() => import("./pages/ComparisonPage"));

const queryClient = new QueryClient();

// In production the SPA lives under /market-intelligence/ (WordPress page slug).
// BrowserRouter needs this prefix so its routes match the full URL paths.
// In dev (localhost) routes are served at root, so no prefix is needed.
const BASENAME = import.meta.env.PROD ? "/market-intelligence" : "/";

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={BASENAME}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/overview" element={<Index />} />
            <Route path="/market/:slug" element={<MarketPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/vendor/:categorySlug/:vendorSlug" element={
              <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
                <VendorDetailPage />
              </Suspense>
            } />
            <Route path="/pricing" element={
              <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
                <PricingPage />
              </Suspense>
            } />
            <Route path="/signals" element={
              <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
                <SignalsPage />
              </Suspense>
            } />
            <Route path="/compare" element={
              <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
                <ComparisonPage />
              </Suspense>
            } />
{/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
