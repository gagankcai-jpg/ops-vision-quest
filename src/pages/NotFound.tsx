import { Link } from "react-router-dom";
import { PageShell } from "@/components/layout/PageShell";
import { PageMeta } from "@/components/seo/PageMeta";

const NotFound = () => (
  <PageShell>
    <PageMeta
      title="Page Not Found"
      description="The page you're looking for doesn't exist. Return to AI Enterprise IT market intelligence."
      canonical="https://aienterpriseit.com/market-intelligence/"
    />
    <div className="container flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-8xl font-bold text-muted-foreground/15">404</p>
      <h1 className="text-2xl font-semibold text-foreground">Page not found</h1>
      <p className="max-w-md text-muted-foreground">
        This page doesn't exist or may have moved. Try exploring the market intelligence portal below.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Back to overview
        </Link>
        <Link
          to="/market/aiops"
          className="rounded-md border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          AIOps market
        </Link>
        <Link
          to="/signals"
          className="rounded-md border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Market signals
        </Link>
      </div>
    </div>
  </PageShell>
);

export default NotFound;
