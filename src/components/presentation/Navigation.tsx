import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu, BarChart3, Cpu, Bot, FileText, LayoutGrid, Download, FileDown,
  Sparkles, ShieldCheck, Info, DollarSign, Search, ChevronDown, Radio,
} from "lucide-react";
import { Logo } from "@/components/Logo";
// generatePPTX/generatePDF pull in browser-only libs (pptxgen, jspdf, html2canvas).
// They are dynamically imported inside the export handler so they are excluded from the
// SSR/initial bundle and only loaded when the user actually exports.
import { toast } from "sonner";
import SearchModal from "@/components/presentation/SearchModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

/* ─── Nav model ──────────────────────────────────────────────────────────── */

const MARKETS = [
  { label: "AIOps & Observability", short: "AIOps", to: "/market/aiops", icon: BarChart3 },
  { label: "IT Service & Ops Mgmt", short: "ITOM", to: "/market/itom", icon: Cpu },
  { label: "RPA & Intelligent Auto.", short: "RPA / IA", to: "/market/rpa", icon: Bot },
  { label: "Agentic Operations", short: "AgentOps", to: "/market/agentops", icon: Sparkles },
  { label: "Security Operations", short: "SecOps", to: "/market/secops", icon: ShieldCheck },
];

const RESOURCES = [
  { label: "Signals", to: "/signals", icon: Radio },
  { label: "Pricing", to: "/pricing", icon: DollarSign },
  { label: "Compare", to: "/compare", icon: LayoutGrid },
  { label: "About", to: "/about", icon: Info },
];

const SCROLL_ITEMS = [
  { label: "Summary", href: "#summary", icon: FileText },
  { label: "Comparison", href: "#comparison", icon: LayoutGrid },
];

/* ─── Component ──────────────────────────────────────────────────────────── */

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [exporting, setExporting] = useState<"pdf" | "pptx" | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ⌘K opens global search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (to: string) =>
    location.pathname === to || location.pathname.startsWith(`${to}/`);

  const scrollToSection = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    } else {
      // Navigate to the homepage (the React dashboard index, now the canonical
      // landing) and scroll to the requested section after it mounts.
      navigate("/", { state: { scrollTo: href.replace("#", "") } });
    }
    setMobileOpen(false);
  };

  const handleExport = async (kind: "pdf" | "pptx") => {
    setExporting(kind);
    try {
      if (kind === "pdf") {
        const { generatePDF } = await import("@/utils/generatePDF");
        await generatePDF();
      } else {
        const { generatePPTX } = await import("@/utils/generatePPTX");
        await generatePPTX();
      }
      toast.success(`${kind.toUpperCase()} exported successfully`);
    } catch (err) {
      console.error("Export failed:", err);
      toast.error(`${kind.toUpperCase()} export failed. Please try again.`);
    } finally {
      setExporting(null);
    }
  };

  return (
    <>
      <motion.header
        initial={reduceMotion ? false : { y: -64 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background,backdrop-filter,border-color] duration-300",
          isScrolled
            ? "border-b border-border/70 bg-background/95 backdrop-blur-xl"
            : "border-b border-transparent bg-background/40 backdrop-blur-md"
        )}
      >
        <nav className="container flex h-16 items-center justify-between px-6">
          {/* Hard-navigate to the SSR landing page, not client-side to Index.tsx */}
          <a
            href={import.meta.env.PROD ? "/market-intelligence/" : "/"}
            className="rounded-md outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label="AI Enterprise IT — Market Intelligence Home"
          >
            <Logo size={32} id="nav" />
          </a>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 md:flex">
            {SCROLL_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.href)}
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-foreground focus-visible:bg-secondary/40 focus-visible:text-foreground focus-visible:outline-none"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground outline-none transition-colors hover:bg-secondary/40 hover:text-foreground focus-visible:bg-secondary/40 focus-visible:text-foreground">
                <LayoutGrid className="h-4 w-4" />
                Markets
                <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-60">
                <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  Markets
                </DropdownMenuLabel>
                {MARKETS.map((m) => (
                  <DropdownMenuItem key={m.to} asChild>
                    <Link to={m.to} className="flex items-center gap-2">
                      <m.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="flex-1">{m.label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {RESOURCES.map((r) => (
              <Link
                key={r.to}
                to={r.to}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary/40 hover:text-foreground focus-visible:bg-secondary/40 focus-visible:text-foreground focus-visible:outline-none",
                  isActive(r.to) ? "text-foreground" : "text-muted-foreground"
                )}
              >
                <r.icon className="h-4 w-4" />
                {r.label}
              </Link>
            ))}

            <button
              onClick={() => setSearchOpen(true)}
              className="ml-1 inline-flex items-center gap-2 rounded-md border border-border/70 bg-card/40 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-border hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Search vendors"
              title="Search vendors (⌘K)"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">Search vendors</span>
              <kbd className="ml-1 hidden rounded border border-border/70 bg-background/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground/70 lg:inline">
                ⌘K
              </kbd>
            </button>

            {/* Export dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger
                className="ml-1 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground outline-none transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50"
                disabled={!!exporting}
              >
                <Download className="h-4 w-4" />
                {exporting ? "Exporting…" : "Export"}
                <ChevronDown className="h-3.5 w-3.5 opacity-80" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  Download report
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleExport("pdf")} className="flex items-center gap-2">
                  <FileDown className="h-4 w-4 text-muted-foreground" />
                  PDF report
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("pptx")} className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  PowerPoint deck
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile trigger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-secondary/40 md:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[88%] max-w-sm border-border bg-background p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex items-center border-b border-border px-5 py-4">
                <Logo size={28} id="mobile-nav" />
              </div>

              <div className="flex flex-col gap-1 p-4">
                <p className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  On this page
                </p>
                {SCROLL_ITEMS.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => scrollToSection(item.href)}
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-secondary/40"
                  >
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                    {item.label}
                  </button>
                ))}

                <p className="mt-3 px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Markets
                </p>
                {MARKETS.map((m) => (
                  <Link
                    key={m.to}
                    to={m.to}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-secondary/40"
                  >
                    <m.icon className="h-4 w-4 text-muted-foreground" />
                    {m.short}
                    <span className="ml-auto text-[11px] text-muted-foreground/70">
                      {m.label}
                    </span>
                  </Link>
                ))}

                <p className="mt-3 px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Resources
                </p>
                {RESOURCES.map((r) => (
                  <Link
                    key={r.to}
                    to={r.to}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-secondary/40"
                  >
                    <r.icon className="h-4 w-4 text-muted-foreground" />
                    {r.label}
                  </Link>
                ))}

                <p className="mt-3 px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Tools
                </p>
                <button
                  onClick={() => { setMobileOpen(false); setSearchOpen(true); }}
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-secondary/40"
                >
                  <Search className="h-4 w-4 text-muted-foreground" />
                  Search vendors
                </button>
                <button
                  onClick={() => handleExport("pdf")}
                  disabled={!!exporting}
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-secondary/40 disabled:opacity-60"
                >
                  <FileDown className="h-4 w-4 text-muted-foreground" />
                  Export PDF
                </button>
                <button
                  onClick={() => handleExport("pptx")}
                  disabled={!!exporting}
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-secondary/40 disabled:opacity-60"
                >
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Export PPTX
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </motion.header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Navigation;
