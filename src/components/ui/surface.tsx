import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/*
  Surface — the canonical card primitive for the analyst-grade design system.
  Replaces the dozens of ad-hoc `rounded-xl border border-border bg-card p-5`
  blocks scattered across pages so semantic intent and visual rhythm stay aligned.
*/

const surfaceVariants = cva(
  "rounded-xl border transition-colors",
  {
    variants: {
      variant: {
        default: "border-border bg-card text-card-foreground",
        muted: "border-border/60 bg-muted/40 text-foreground",
        accent: "border-primary/25 bg-primary/[0.06] text-foreground",
        success: "border-success/25 bg-success/[0.06] text-foreground",
        warning: "border-warning/25 bg-warning/[0.06] text-foreground",
        danger: "border-danger/25 bg-danger/[0.06] text-foreground",
        info: "border-info/25 bg-info/[0.06] text-foreground",
        elevated: "border-border bg-card text-card-foreground shadow-md",
      },
      padding: {
        none: "p-0",
        sm: "p-3",
        md: "p-5",
        lg: "p-6",
      },
      interactive: {
        true: "cursor-pointer hover:border-primary/40 hover:shadow-md",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
      interactive: false,
    },
  }
);

export interface SurfaceProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof surfaceVariants> {}

export const Surface = React.forwardRef<HTMLDivElement, SurfaceProps>(
  ({ className, variant, padding, interactive, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(surfaceVariants({ variant, padding, interactive }), className)}
      {...props}
    />
  )
);
Surface.displayName = "Surface";

export { surfaceVariants };
