import * as React from "react";
import Navigation from "@/components/presentation/Navigation";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { cn } from "@/lib/utils";

/*
  PageShell — wraps a page with the global Navigation + SiteFooter and
  provides a consistent main container so individual pages don't repeat
  the same min-h-screen + bg-background + pt-20 + footer scaffolding.
*/

interface PageShellProps {
  children: React.ReactNode;
  /** Skip the default top padding (some pages — like Index — want a full-bleed hero). */
  noTopPadding?: boolean;
  /** Override the data date in the footer. Defaults to LAST_UPDATED. */
  dataDate?: string;
  /** Show "● Live" badge in footer. */
  isLive?: boolean;
  /** Hide the footer (e.g., for embedded contexts). */
  hideFooter?: boolean;
  className?: string;
  /** Unique id for the footer logo gradient. */
  footerLogoId?: string;
}

export function PageShell({
  children,
  noTopPadding,
  dataDate,
  isLive,
  hideFooter,
  className,
  footerLogoId,
}: PageShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <Navigation />
      <main id="main" className={cn(noTopPadding ? "" : "pt-16", "flex-1", className)}>
        {children}
      </main>
      {hideFooter ? null : (
        <SiteFooter dataDate={dataDate} isLive={isLive} logoId={footerLogoId} />
      )}
    </div>
  );
}
