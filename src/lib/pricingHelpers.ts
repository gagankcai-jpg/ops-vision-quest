import type { PricingModel, TCOBadge } from "@/data/pricingData";

export const MODEL_LABELS: Record<PricingModel, string> = {
  "consumption":        "Consumption",
  "per-seat":           "Per Seat",
  "enterprise-license": "Enterprise License",
  "module-based":       "Module-Based",
  "freemium":           "Freemium",
  "open-source-plus":   "Open Source+",
  "platform-license":   "Platform License",
};

export const MODEL_COLORS: Record<PricingModel, string> = {
  "consumption":        "bg-sky-500/15 text-sky-400 border-sky-500/30",
  "per-seat":           "bg-violet-500/15 text-violet-400 border-violet-500/30",
  "enterprise-license": "bg-slate-500/15 text-slate-400 border-slate-500/30",
  "module-based":       "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
  "freemium":           "bg-teal-500/15 text-teal-400 border-teal-500/30",
  "open-source-plus":   "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  "platform-license":   "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
};

export const TCO_COLORS: Record<TCOBadge, string> = {
  "low":       "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  "medium":    "bg-amber-500/15 text-amber-400 border-amber-500/30",
  "high":      "bg-orange-500/15 text-orange-400 border-orange-500/30",
  "very-high": "bg-rose-500/15 text-rose-400 border-rose-500/30",
};

export const TCO_LABELS: Record<TCOBadge, string> = {
  "low": "Low TCO", "medium": "Medium TCO", "high": "High TCO", "very-high": "Very High TCO",
};

export const SEGMENT_LABELS: Record<string, string> = {
  smb: "SMB", "mid-market": "Mid-Market", enterprise: "Enterprise", fortune500: "Fortune 500",
};

export const DEPLOY_LABELS: Record<string, string> = {
  saas: "SaaS", "on-prem": "On-Prem", hybrid: "Hybrid",
};

export const TRANSPARENCY_LABELS: Record<string, string> = {
  "public-list": "Public Pricing", "limited-public": "Limited Public", "contact-sales": "Contact Sales",
};

export const TYPE_BADGE: Record<string, string> = {
  leader:     "bg-blue-500/15 text-blue-400 border-blue-500/30",
  challenger: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  niche:      "bg-slate-500/15 text-slate-400 border-slate-500/30",
  startup:    "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  emerging:   "bg-amber-500/15 text-amber-400 border-amber-500/30",
};

export const TYPE_LABEL: Record<string, string> = {
  leader: "Leader", challenger: "Challenger", niche: "Niche",
  startup: "Startup", emerging: "Emerging",
};

export const CATEGORY_ICONS_TEXT: Record<string, string> = {
  aiops:    "AIOps",
  itom:     "ITOM",
  rpa:      "RPA",
  agentops: "AgentOps",
  secops:   "SecOps",
};
