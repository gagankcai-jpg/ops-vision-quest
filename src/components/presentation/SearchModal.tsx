import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowUpRight, BarChart3, Cpu, Bot, Sparkles, ShieldCheck } from "lucide-react";
import { allCategories } from "@/data/marketData";
import { toVendorSlug, vendorProfiles } from "@/data/vendorProfiles";
import type { VendorEntry } from "@/components/presentation/CategorySection";

/* ─── Types ──────────────────────────────────────────────────────────────── */

interface SearchResult {
  vendorName: string;
  vendorSlug: string;
  categoryId: string;
  categoryTitle: string;
  type: string;
  description: string;
  hasProfile: boolean;
}

/* ─── Constants ──────────────────────────────────────────────────────────── */

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  aiops:    <BarChart3 className="w-3.5 h-3.5" />,
  itom:     <Cpu className="w-3.5 h-3.5" />,
  rpa:      <Bot className="w-3.5 h-3.5" />,
  agentops: <Sparkles className="w-3.5 h-3.5" />,
  secops:   <ShieldCheck className="w-3.5 h-3.5" />,
};

const TYPE_BADGE: Record<string, string> = {
  leader:     "bg-blue-500/15 text-blue-400 border-blue-500/30",
  challenger: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  niche:      "bg-slate-500/15 text-slate-400 border-slate-500/30",
  startup:    "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  emerging:   "bg-amber-500/15 text-amber-400 border-amber-500/30",
};

const TYPE_LABEL: Record<string, string> = {
  leader: "Leader", challenger: "Challenger", niche: "Niche",
  startup: "Startup", emerging: "Emerging",
};

/* ─── Flat vendor index (built once) ────────────────────────────────────── */

const ALL_VENDORS: SearchResult[] = allCategories.flatMap((cat) => {
  const entries: VendorEntry[] = [
    ...((cat.vendors as VendorEntry[] | undefined) ?? []),
    ...((cat.startups as VendorEntry[] | undefined) ?? []),
  ];
  return entries.map((v) => {
    const slug = toVendorSlug(v.name);
    return {
      vendorName: v.name,
      vendorSlug: slug,
      categoryId: cat.id,
      categoryTitle: cat.title,
      type: v.type,
      description: v.description,
      hasProfile: !!vendorProfiles[`${cat.id}/${slug}`],
    };
  });
});

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function highlight(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-primary/25 text-foreground rounded px-0.5">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

const SearchModal = ({ open, onClose }: SearchModalProps) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [open]);

  // Escape closes
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return ALL_VENDORS.filter(
      (v) =>
        v.vendorName.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        v.categoryTitle.toLowerCase().includes(q) ||
        v.type.toLowerCase().includes(q)
    ).slice(0, 12);
  }, [query]);

  // Reset active index when results change
  useEffect(() => setActiveIndex(0), [results]);

  const handleSelect = (result: SearchResult) => {
    onClose();
    if (result.hasProfile) {
      navigate(`/vendor/${result.categoryId}/${result.vendorSlug}`);
    } else {
      navigate(`/market/${result.categoryId}`);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[activeIndex]) {
      handleSelect(results[activeIndex]);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -12 }}
            transition={{ duration: 0.18 }}
            className="fixed top-[10vh] left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4"
          >
            <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
              {/* Search input */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
                <Search className="w-5 h-5 text-muted-foreground shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search 500+ vendors across AIOps, ITOM, RPA, AgentOps, SecOps…"
                  className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/50 text-sm outline-none"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <kbd className="hidden sm:inline text-[10px] font-mono text-muted-foreground/50 border border-border rounded px-1.5 py-0.5">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              {query.trim() && (
                <div className="max-h-[55vh] overflow-y-auto">
                  {results.length === 0 ? (
                    <div className="px-5 py-10 text-center text-muted-foreground text-sm">
                      No vendors found for "{query}"
                    </div>
                  ) : (
                    <ul>
                      {results.map((r, i) => (
                        <li key={`${r.categoryId}/${r.vendorSlug}`}>
                          <button
                            onClick={() => handleSelect(r)}
                            onMouseEnter={() => setActiveIndex(i)}
                            className={`w-full text-left px-5 py-3.5 flex items-start gap-4 transition-colors border-b border-border/50 last:border-b-0 ${
                              i === activeIndex ? "bg-secondary/60" : "hover:bg-secondary/30"
                            }`}
                          >
                            {/* Category icon */}
                            <div className="shrink-0 mt-0.5 w-7 h-7 rounded-lg bg-muted/50 border border-border flex items-center justify-center text-muted-foreground">
                              {CATEGORY_ICONS[r.categoryId] ?? <Search className="w-3.5 h-3.5" />}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-sm text-foreground leading-tight">
                                  {highlight(r.vendorName, query.trim())}
                                </span>
                                <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${TYPE_BADGE[r.type] ?? ""}`}>
                                  {TYPE_LABEL[r.type] ?? r.type}
                                </span>
                                <span className="text-[10px] text-muted-foreground/60">
                                  {r.categoryTitle}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 leading-snug">
                                {highlight(r.description, query.trim())}
                              </p>
                            </div>

                            {/* Profile indicator */}
                            <div className="shrink-0 flex items-center gap-1 mt-1">
                              {r.hasProfile ? (
                                <span className="text-[9px] font-medium text-sky-400 flex items-center gap-0.5">
                                  Profile <ArrowUpRight className="w-3 h-3" />
                                </span>
                              ) : (
                                <span className="text-[9px] text-muted-foreground/40">Market page</span>
                              )}
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Footer hint */}
                  <div className="px-5 py-2.5 border-t border-border bg-muted/30 flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground/50">
                      {results.length} result{results.length !== 1 ? "s" : ""} · vendors with profiles open in deep view
                    </span>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground/40">
                      <kbd className="font-mono border border-border rounded px-1 py-0.5">↑↓</kbd> navigate
                      <kbd className="font-mono border border-border rounded px-1 py-0.5">↵</kbd> open
                    </div>
                  </div>
                </div>
              )}

              {/* Empty state hint */}
              {!query.trim() && (
                <div className="px-5 py-6 text-center">
                  <p className="text-xs text-muted-foreground/50">
                    Type to search across 500+ vendors — AIOps, ITOM, RPA, AgentOps, SecOps
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
