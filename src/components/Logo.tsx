/**
 * AI Enterprise IT — brand logo mark + wordmark.
 * Used in Navigation (top-left), footer, and as the SVG favicon source.
 *
 * Design: hexagonal circuit-chip mark
 *   • Hex body — primary→accent gradient
 *   • Inner hex ring — subtle white outline (depth layer)
 *   • 6 vertex nodes — gradient-tinted circles (circuit pad motif)
 *   • "AI" wordmark — bold white, centred
 */

interface LogoMarkProps {
  /** Rendered pixel size (square). Default: 36 */
  size?: number;
  /** Gradient id suffix — must be unique per page instance to avoid SVG id collisions */
  id?: string;
}

export function LogoMark({ size = 36, id = "a" }: LogoMarkProps) {
  const gId  = `lm-g-${id}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gId} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>

      {/* Hex body */}
      <polygon
        points="20,2 35,11 35,29 20,38 5,29 5,11"
        fill={`url(#${gId})`}
      />

      {/* Inner hex ring — depth layer */}
      <polygon
        points="20,7.5 30.5,13.75 30.5,26.25 20,32.5 9.5,26.25 9.5,13.75"
        fill="none"
        stroke="white"
        strokeOpacity="0.18"
        strokeWidth="1"
      />

      {/* Vertex nodes — circuit pad motif */}
      {/* top */}
      <circle cx="20"  cy="2"  r="2.2" fill="#38BDF8" />
      {/* top-right */}
      <circle cx="35"  cy="11" r="2.2" fill="#67E8F9" />
      {/* bottom-right */}
      <circle cx="35"  cy="29" r="2.2" fill="#A78BFA" />
      {/* bottom */}
      <circle cx="20"  cy="38" r="2.2" fill="#8B5CF6" />
      {/* bottom-left */}
      <circle cx="5"   cy="29" r="2.2" fill="#A78BFA" />
      {/* top-left */}
      <circle cx="5"   cy="11" r="2.2" fill="#38BDF8" />

      {/* "AI" wordmark */}
      <text
        x="20"
        y="25.5"
        textAnchor="middle"
        fontSize="14"
        fontWeight="800"
        fontFamily="Arial, system-ui, sans-serif"
        fill="white"
        letterSpacing="0.5"
      >
        AI
      </text>
    </svg>
  );
}

interface LogoProps {
  /** Hide the text wordmark — icon only */
  iconOnly?: boolean;
  size?: number;
  id?: string;
}

/** Full logo: mark + wordmark */
export function Logo({ iconOnly = false, size = 36, id = "a" }: LogoProps) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark size={size} id={id} />
      {!iconOnly && (
        <span className="flex flex-col leading-none gap-[3px]">
          <span className="text-[13px] font-bold text-foreground tracking-tight whitespace-nowrap">
            AI Enterprise IT
          </span>
          <span className="text-[9px] font-semibold text-muted-foreground tracking-[0.15em] uppercase whitespace-nowrap">
            Market Intelligence
          </span>
        </span>
      )}
    </span>
  );
}
