import * as React from "react";
import { cn } from "@/lib/utils";

/*
  SectionHeader — promoted from VendorDetailPage's local SectionTitle helper
  so all in-page section titles share the same visual rhythm.
*/

interface SectionHeaderProps {
  icon?: React.ReactNode;
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  children?: React.ReactNode;
}

export function SectionHeader({
  icon,
  eyebrow,
  title,
  description,
  align = "left",
  className,
  children,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-6 flex items-end justify-between gap-4",
        align === "center" ? "flex-col items-center text-center" : "flex-col sm:flex-row",
        className
      )}
    >
      <div className={cn(align === "center" ? "max-w-2xl" : "max-w-3xl")}>
        {eyebrow ? (
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            {eyebrow}
          </p>
        ) : null}
        <div className="flex items-center gap-2">
          {icon ? <span className="text-muted-foreground">{icon}</span> : null}
          <h2 className="font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            {title}
          </h2>
        </div>
        {description ? (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children ? <div className="shrink-0">{children}</div> : null}
    </div>
  );
}
