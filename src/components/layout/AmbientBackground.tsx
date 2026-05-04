import { cn } from "@/lib/utils";

/*
  AmbientBackground — replaces the duplicated grid + glow-orb pattern in
  HeroSection / AboutPage. Tuned for analyst-grade restraint:
  one subtle orb, faint grid, no rainbow.
*/

interface AmbientBackgroundProps {
  variant?: "hero" | "subtle" | "none";
  className?: string;
}

export function AmbientBackground({ variant = "subtle", className }: AmbientBackgroundProps) {
  if (variant === "none") return null;

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
    >
      {/* Faint grid */}
      <div
        className={cn(
          "absolute inset-0 bg-grid-faint bg-[size:64px_64px]",
          variant === "hero" ? "opacity-[0.18]" : "opacity-[0.10]"
        )}
        style={{
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 30%, black 0%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 30%, black 0%, transparent 75%)",
        }}
      />

      {/* Single subtle orb */}
      <div
        className={cn(
          "absolute -top-32 left-1/2 h-[480px] w-[640px] -translate-x-1/2 rounded-full blur-[120px]",
          "bg-[radial-gradient(closest-side,hsl(var(--primary)/0.18),transparent_70%)]",
          variant === "hero" ? "" : "opacity-60"
        )}
      />
    </div>
  );
}
