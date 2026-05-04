import * as React from "react";
import { cn } from "@/lib/utils";

/*
  Stat — small key-value pill used in vendor heroes, market summaries,
  and category cards. Icon + label + value, optionally sized inline (compact)
  or as a stacked block (block).
*/

interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  label: string;
  value: React.ReactNode;
  layout?: "inline" | "block";
  tone?: "default" | "primary" | "success" | "danger" | "warning";
}

const toneClass: Record<NonNullable<StatProps["tone"]>, string> = {
  default: "text-foreground",
  primary: "text-primary",
  success: "text-success",
  danger: "text-danger",
  warning: "text-warning",
};

export function Stat({
  icon,
  label,
  value,
  layout = "inline",
  tone = "default",
  className,
  ...props
}: StatProps) {
  if (layout === "block") {
    return (
      <div
        className={cn(
          "rounded-lg border border-border bg-card px-4 py-3",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {icon}
          <span>{label}</span>
        </div>
        <div className={cn("mt-1 text-lg font-semibold tabular-nums", toneClass[tone])}>
          {value}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2",
        className
      )}
      {...props}
    >
      {icon ? <span className="text-muted-foreground">{icon}</span> : null}
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={cn("text-xs font-semibold tabular-nums", toneClass[tone])}>
        {value}
      </span>
    </div>
  );
}
