/* ─────────────────────────────────────────────────────────────────────────────
   Pricing & TCO Intelligence
   50 profiles covering the Top-5 Leaders + Top-5 To Watch for each of the
   5 market categories: AIOps · ITOM · RPA · AgentOps · SecOps

   This is pricing MODEL intelligence, not company financials.
   Fields answer: how vendors charge, who they charge, and what drives TCO.

   Lookup key format: "${categorySlug}/${vendorSlug}"
   Slug utility: toVendorSlug(vendorName) — same function as vendorProfiles.ts
───────────────────────────────────────────────────────────────────────────── */

export type PricingModel =
  | "consumption"        // pay per host / event / GB ingested
  | "per-seat"           // per user / agent / technician
  | "enterprise-license" // annual site / platform license
  | "module-based"       // base platform + add-on modules
  | "freemium"           // free tier + paid tiers
  | "open-source-plus"   // OSS core + commercial cloud / support
  | "platform-license";  // all-in perpetual or subscription

export type TCOBadge = "low" | "medium" | "high" | "very-high";
export type MarketSegment = "smb" | "mid-market" | "enterprise" | "fortune500";
export type DeploymentModel = "saas" | "on-prem" | "hybrid";
export type PricingTransparency = "public-list" | "limited-public" | "contact-sales";

export interface PricingInfo {
  pricingModel: PricingModel;
  transparency: PricingTransparency;
  /** Publicly known entry point, e.g. "$15/host/month". Only set if confirmed public. */
  startingPrice?: string;
  /** Analyst synthesis of typical annual contract value for a mid-enterprise deal. */
  typicalACV?: string;
  marketSegment: MarketSegment[];
  deploymentModel: DeploymentModel[];
  freeTrialOrTier: boolean;
  tcoBadge: TCOBadge;
  /** 2–3 items describing what unexpectedly drives cost up */
  keyPricingDrivers: string[];
  /** ≤100 chars: one sharp buyer-facing summary of pricing posture */
  bottomLine: string;
}

/* ────────────────────────────────────────────────────────────────────────────
   Lookup: "${categorySlug}/${vendorSlug}"
   vendorSlug = toVendorSlug(vendor.name) from vendorProfiles.ts
──────────────────────────────────────────────────────────────────────────── */
export const pricingData: Record<string, PricingInfo> = {

  /* ══════════════════════════════════════════════════════════════════════════
     AIOps — Top 5 Leaders
  ══════════════════════════════════════════════════════════════════════════ */

  "aiops/dynatrace": {
    pricingModel: "consumption",
    transparency: "limited-public",
    startingPrice: "$69/month per host (8 GiB, APM + Infra)",
    typicalACV: "$200K–$1M+ for enterprise full-stack",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas", "on-prem", "hybrid"],
    freeTrialOrTier: true,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Host units priced separately per product (APM, Infra, DEM)",
      "Log ingest volume scales steeply at enterprise size",
      "Real User Monitoring billed per session",
    ],
    bottomLine: "Full-stack enterprise observability — budget $500K+ for serious coverage.",
  },

  "aiops/datadog": {
    pricingModel: "consumption",
    transparency: "public-list",
    startingPrice: "$15/host/month (Infrastructure Monitoring)",
    typicalACV: "$150K–$2M for multi-product enterprise",
    marketSegment: ["mid-market", "enterprise", "fortune500"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "high",
    keyPricingDrivers: [
      "APM spans, custom metrics, and log ingestion each billed separately",
      "Multi-product stacking (20+ products) drives bills up quickly",
      "On-demand rates significantly higher than committed contracts",
    ],
    bottomLine: "Transparent list prices — but multi-product stacking drives bills up fast.",
  },

  "aiops/splunk": {
    pricingModel: "consumption",
    transparency: "contact-sales",
    typicalACV: "$250K–$3M ARR for enterprise security + observability",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas", "on-prem", "hybrid"],
    freeTrialOrTier: true,
    tcoBadge: "very-high",
    keyPricingDrivers: [
      "Daily log ingest volume (GB/day) is the primary cost driver",
      "Workload pricing adds compute charges on top of ingest",
      "Post-Cisco acquisition — licensing complexity and premiums increasing",
    ],
    bottomLine: "Industry benchmark with enterprise complexity — expect multi-year negotiations.",
  },

  "aiops/elastic": {
    pricingModel: "freemium",
    transparency: "limited-public",
    startingPrice: "Free (open-source); $95/month (Elastic Cloud Starter)",
    typicalACV: "$50K–$300K for enterprise cloud",
    marketSegment: ["mid-market", "enterprise"],
    deploymentModel: ["saas", "on-prem", "hybrid"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Data ingested and stored (GB) drives Elastic Cloud billing",
      "Retention period multiplies storage costs significantly",
      "Platinum/Enterprise tiers required for ML and security features",
    ],
    bottomLine: "Open-source entry point keeps initial costs low; cloud scale costs grow.",
  },

  "aiops/grafana-labs": {
    pricingModel: "freemium",
    transparency: "public-list",
    startingPrice: "Free (Grafana Cloud: 10K metrics, 50 GB logs)",
    typicalACV: "$12K–$150K ARR for Grafana Cloud enterprise",
    marketSegment: ["smb", "mid-market", "enterprise"],
    deploymentModel: ["saas", "on-prem", "hybrid"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Active metrics series count and cardinality",
      "Log volume ingested per month (GB)",
      "Distributed traces stored",
    ],
    bottomLine: "Best entry-price in the market — usage grows gracefully with the platform.",
  },

  /* ══════════════════════════════════════════════════════════════════════════
     AIOps — Top 5 To Watch
  ══════════════════════════════════════════════════════════════════════════ */

  "aiops/resolve-ai": {
    pricingModel: "consumption",
    transparency: "contact-sales",
    typicalACV: "$200K–$500K for enterprise AI ops agents",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Number of AI agent integrations and runbooks",
      "Incident volume processed autonomously",
      "Enterprise connector and data source count",
    ],
    bottomLine: "Enterprise AI ops pricing still emerging; expect significant investment.",
  },

  "aiops/monte-carlo": {
    pricingModel: "consumption",
    transparency: "contact-sales",
    typicalACV: "$80K–$300K for mid-enterprise",
    marketSegment: ["mid-market", "enterprise"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Number of monitored data assets, tables, and pipelines",
      "Data warehouse query costs passed through",
      "Enterprise SSO, RBAC, and compliance features are top-tier only",
    ],
    bottomLine: "Data observability ROI is clear — pricing scales with your data estate size.",
  },

  "aiops/incident-io": {
    pricingModel: "per-seat",
    transparency: "public-list",
    startingPrice: "Free (up to 5 users); $25/user/month (Team)",
    typicalACV: "$10K–$80K for engineering teams",
    marketSegment: ["smb", "mid-market"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Responder / on-call seat count",
      "Enterprise tier for AI post-mortems and analytics",
      "Slack workspace integration tiers",
    ],
    bottomLine: "Transparent per-seat model — accessible to any engineering team.",
  },

  "aiops/groundcover": {
    pricingModel: "consumption",
    transparency: "contact-sales",
    typicalACV: "$30K–$150K for cloud-native engineering teams",
    marketSegment: ["mid-market", "enterprise"],
    deploymentModel: ["saas", "on-prem"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Cluster node count and pod density",
      "Data ingested and retained",
      "eBPF coverage breadth across services",
    ],
    bottomLine: "Positioned as a 50–70% cheaper Datadog alternative for Kubernetes teams.",
  },

  "aiops/last9": {
    pricingModel: "consumption",
    transparency: "limited-public",
    startingPrice: "From $200/month for 2M metric samples",
    typicalACV: "$10K–$80K",
    marketSegment: ["smb", "mid-market"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Monthly metric samples ingested",
      "Log GB stored and queried",
      "SLO tracking and error budget features in higher tiers",
    ],
    bottomLine: "Developer-friendly pricing — built for SRE teams watching cloud costs.",
  },

  /* ══════════════════════════════════════════════════════════════════════════
     ITOM — Top 5 Leaders
  ══════════════════════════════════════════════════════════════════════════ */

  "itom/servicenow": {
    pricingModel: "enterprise-license",
    transparency: "contact-sales",
    typicalACV: "$300K–$5M+ for large enterprise",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas", "on-prem", "hybrid"],
    freeTrialOrTier: false,
    tcoBadge: "very-high",
    keyPricingDrivers: [
      "Named vs. concurrent user licensing model drives seat costs up",
      "Each module (ITSM, ITOM, ITAM, CSM) licensed separately",
      "Now Assist AI adds 20–40% uplift on top of base platform cost",
    ],
    bottomLine: "Market leader premium — typically 3–5× the cost of alternatives.",
  },

  "itom/microsoft": {
    pricingModel: "platform-license",
    transparency: "public-list",
    startingPrice: "Included with M365 / Azure subscriptions",
    typicalACV: "Bundled; Azure Monitor from $0.31/GB ingested",
    marketSegment: ["mid-market", "enterprise", "fortune500"],
    deploymentModel: ["saas", "on-prem", "hybrid"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Azure Monitor consumption charges at scale",
      "Intune MAU (monthly active users) licensing",
      "Copilot for IT add-on $30/user/month on top of M365",
    ],
    bottomLine: "Lowest TCO for Microsoft shops — ITSM bundled at no extra cost.",
  },

  "itom/atlassian-jira-sm": {
    pricingModel: "per-seat",
    transparency: "public-list",
    startingPrice: "Free (up to 3 agents); $22.05/agent/month (Standard)",
    typicalACV: "$30K–$300K for enterprise",
    marketSegment: ["smb", "mid-market", "enterprise"],
    deploymentModel: ["saas", "on-prem"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Agent seat count (separate from regular Jira user licenses)",
      "Data Center license for on-prem starts at $16,500/year",
      "Premium tier required for advanced AI and automation features",
    ],
    bottomLine: "Most transparent ITSM pricing — lowest entry cost among category leaders.",
  },

  "itom/bmc-helix-itsm": {
    pricingModel: "enterprise-license",
    transparency: "contact-sales",
    typicalACV: "$200K–$2M for large enterprise",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas", "on-prem", "hybrid"],
    freeTrialOrTier: false,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Per-user licensing across ITSM, CMDB, ITOM, and TrueSight modules",
      "Professional services for implementation typically 1–2× license cost",
      "HelixGPT AI features priced as a premium add-on",
    ],
    bottomLine: "Enterprise-grade pricing for enterprise-grade ITOM complexity.",
  },

  "itom/freshservice": {
    pricingModel: "per-seat",
    transparency: "public-list",
    startingPrice: "$19/agent/month (Starter plan)",
    typicalACV: "$15K–$150K for mid-enterprise",
    marketSegment: ["smb", "mid-market"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Agent seat count across plan tiers (Starter / Growth / Pro / Enterprise)",
      "Freddy AI automation credits in higher plans",
      "Additional charges for advanced ITAM and discovery modules",
    ],
    bottomLine: "Best-value ITSM for growing companies — clear pricing, no surprises.",
  },

  /* ══════════════════════════════════════════════════════════════════════════
     ITOM — Top 5 To Watch
  ══════════════════════════════════════════════════════════════════════════ */

  "itom/bettercloud": {
    pricingModel: "per-seat",
    transparency: "contact-sales",
    typicalACV: "$30K–$150K",
    marketSegment: ["mid-market", "enterprise"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Number of managed SaaS user accounts",
      "Connected SaaS application count",
      "Automation workflow volume and complexity",
    ],
    bottomLine: "Per-user SaaS management — clear ROI for M365 and Workspace-heavy orgs.",
  },

  "itom/atomicwork": {
    pricingModel: "per-seat",
    transparency: "contact-sales",
    typicalACV: "$30K–$100K",
    marketSegment: ["mid-market", "enterprise"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Employee headcount or helpdesk agent count",
      "AI resolution volume and knowledge base integrations",
      "Enterprise SSO and advanced workflow features",
    ],
    bottomLine: "Competitive pricing to displace expensive legacy ITSM platforms.",
  },

  "itom/zluri": {
    pricingModel: "per-seat",
    transparency: "contact-sales",
    typicalACV: "$20K–$100K",
    marketSegment: ["mid-market", "enterprise"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Number of employees and managed SaaS licenses",
      "App discovery breadth (OAuth, SSO, agent-based)",
      "License optimization and renewal automation features",
    ],
    bottomLine: "SaaS waste elimination pays for itself — typically 3–10× ROI in year one.",
  },

  "itom/axonius": {
    pricingModel: "consumption",
    transparency: "contact-sales",
    typicalACV: "$80K–$400K for enterprise",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas", "on-prem", "hybrid"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Number of managed devices and assets in scope",
      "Adapter/connector count for discovery sources",
      "Cloud-hosted vs. on-prem deployment overhead",
    ],
    bottomLine: "Asset visibility at scale — pricing grows linearly with device count.",
  },

  "itom/torii": {
    pricingModel: "per-seat",
    transparency: "contact-sales",
    typicalACV: "$20K–$80K",
    marketSegment: ["mid-market", "enterprise"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Employee count and number of tracked SaaS applications",
      "Automated workflow actions per month",
      "Advanced procurement and renewal intelligence features",
    ],
    bottomLine: "Affordable SaaS ops automation with strong ROI on license reclamation.",
  },

  /* ══════════════════════════════════════════════════════════════════════════
     RPA — Top 5 Leaders
  ══════════════════════════════════════════════════════════════════════════ */

  "rpa/uipath": {
    pricingModel: "module-based",
    transparency: "limited-public",
    startingPrice: "Community Edition free; UiPath Pro Cloud from $420/month",
    typicalACV: "$100K–$2M for enterprise automation at scale",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas", "on-prem", "hybrid"],
    freeTrialOrTier: true,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Robot count (attended vs. unattended billed separately)",
      "Studio Developer and Orchestrator seat licenses",
      "AI Center / Document Understanding add-on credits",
    ],
    bottomLine: "RPA market leader pricing — scale past $500K or face ROI challenges.",
  },

  "rpa/microsoft-power-automate": {
    pricingModel: "per-seat",
    transparency: "public-list",
    startingPrice: "$15/user/month (Power Automate Premium)",
    typicalACV: "Bundled with M365; add-ons $15–40/user/month",
    marketSegment: ["smb", "mid-market", "enterprise", "fortune500"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Premium connector usage beyond included allowances",
      "AI Builder credits for document intelligence",
      "Hosted RPA add-on for unattended desktop automation",
    ],
    bottomLine: "Best value for Microsoft shops — RPA at a fraction of UiPath's cost.",
  },

  "rpa/automation-anywhere": {
    pricingModel: "consumption",
    transparency: "contact-sales",
    typicalACV: "$100K–$1.5M for enterprise automation",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas", "on-prem"],
    freeTrialOrTier: true,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Bot count (attended vs. unattended) and concurrent executions",
      "AI processing units (APU) for cognitive automation tasks",
      "IQ Bot document AI licensed per page/transaction",
    ],
    bottomLine: "Cloud-native RPA — enterprise deals require significant investment.",
  },

  "rpa/ss-c-blue-prism": {
    pricingModel: "enterprise-license",
    transparency: "contact-sales",
    typicalACV: "$150K–$1M for regulated enterprise",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas", "on-prem", "hybrid"],
    freeTrialOrTier: false,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Digital Worker license count and execution type",
      "Control Room licenses for centralized management",
      "Blue Prism Cloud hosting fees on top of platform license",
    ],
    bottomLine: "Premium pricing for regulated industries — governance features justify cost at scale.",
  },

  "rpa/appian": {
    pricingModel: "per-seat",
    transparency: "contact-sales",
    startingPrice: "From ~$75/user/month (Appian Platform)",
    typicalACV: "$100K–$500K for enterprise",
    marketSegment: ["mid-market", "enterprise"],
    deploymentModel: ["saas", "on-prem", "hybrid"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Business user and developer seat count",
      "Process Mining add-on licensed per process",
      "Government Cloud and FedRAMP versions carry premium",
    ],
    bottomLine: "Low-code + RPA bundle — mid-range pricing for combined automation capability.",
  },

  /* ══════════════════════════════════════════════════════════════════════════
     RPA — Top 5 To Watch
  ══════════════════════════════════════════════════════════════════════════ */

  "rpa/lindy-ai": {
    pricingModel: "consumption",
    transparency: "public-list",
    startingPrice: "Free (limited tasks); from $49/month (Pro)",
    typicalACV: "$1K–$20K",
    marketSegment: ["smb", "mid-market"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Automation task count and AI model calls per month",
      "Number of connected apps and integrations",
      "Agent concurrency in higher tiers",
    ],
    bottomLine: "Consumer-friendly pricing — accessible to individuals and small teams.",
  },

  "rpa/relay-app": {
    pricingModel: "per-seat",
    transparency: "public-list",
    startingPrice: "Free (1 user, limited steps); $9/user/month (Starter)",
    typicalACV: "$2K–$30K",
    marketSegment: ["smb", "mid-market"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Monthly step runs and workflow complexity",
      "Number of collaborators / users on the platform",
      "Human approval step volume",
    ],
    bottomLine: "Affordable human-in-loop automation for approval workflow teams.",
  },

  "rpa/n8n": {
    pricingModel: "open-source-plus",
    transparency: "public-list",
    startingPrice: "Free (self-hosted, open source); from $20/month (Cloud Starter)",
    typicalACV: "$3K–$50K (cloud); $0 self-hosted",
    marketSegment: ["smb", "mid-market", "enterprise"],
    deploymentModel: ["saas", "on-prem", "hybrid"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Cloud execution credits consumed by workflows",
      "Number of active workflows and team size",
      "Custom node development and enterprise support costs",
    ],
    bottomLine: "Lowest TCO in class — self-hosted option eliminates licensing cost entirely.",
  },

  "rpa/pipedream": {
    pricingModel: "consumption",
    transparency: "public-list",
    startingPrice: "Free (10K events/month); from $19/month (Basic)",
    typicalACV: "$1K–$20K",
    marketSegment: ["smb", "mid-market"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Compute credits (invocations × execution time)",
      "Number of connected accounts and premium app integrations",
      "Concurrency and execution timeout limits",
    ],
    bottomLine: "Developer-native pricing — negligible cost for most automation workloads.",
  },

  "rpa/activepieces": {
    pricingModel: "open-source-plus",
    transparency: "public-list",
    startingPrice: "Free (open-source self-hosted); cloud from $199/month",
    typicalACV: "$0–$10K",
    marketSegment: ["smb", "mid-market"],
    deploymentModel: ["saas", "on-prem"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Cloud task volume in hosted plans",
      "Number of team members and workspaces",
      "Premium piece (connector) access in higher tiers",
    ],
    bottomLine: "True OSS alternative to Zapier/Make — zero licensing cost self-hosted.",
  },

  /* ══════════════════════════════════════════════════════════════════════════
     AgentOps — Top 5 Leaders
  ══════════════════════════════════════════════════════════════════════════ */

  "agentops/servicenow-now-assist": {
    pricingModel: "module-based",
    transparency: "contact-sales",
    typicalACV: "$50K–$500K add-on on existing ServiceNow contract",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas"],
    freeTrialOrTier: false,
    tcoBadge: "very-high",
    keyPricingDrivers: [
      "Now Assist SKU count per product area (ITSM, CSM, HR, etc.)",
      "Underlying ServiceNow platform contract size (substantial baseline)",
      "Usage-based AI interaction volume in enterprise agreements",
    ],
    bottomLine: "AI premium on an already-premium platform — expect 20–40% uplift over base.",
  },

  "agentops/microsoft-copilot-for-it": {
    pricingModel: "per-seat",
    transparency: "public-list",
    startingPrice: "$30/user/month (Microsoft 365 Copilot add-on)",
    typicalACV: "Bundled in M365 enterprise agreements",
    marketSegment: ["mid-market", "enterprise", "fortune500"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "M365 Copilot seat count added to existing M365 license",
      "Azure AI Foundry consumption for custom agent workflows",
      "Copilot Studio per-session charges for tailored agents",
    ],
    bottomLine: "Most affordable AI ops path if you're already all-in on Microsoft.",
  },

  "agentops/moveworks": {
    pricingModel: "per-seat",
    transparency: "contact-sales",
    typicalACV: "$200K–$1M for large enterprise",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas"],
    freeTrialOrTier: false,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Employee headcount covered by the AI helpdesk",
      "LLM inference per interaction at enterprise volume",
      "Integration connector count and custom workflow builds",
    ],
    bottomLine: "Premium AI helpdesk now part of ServiceNow — bundled pricing expected ahead.",
  },

  "agentops/atlassian-intelligence": {
    pricingModel: "per-seat",
    transparency: "limited-public",
    startingPrice: "Included in Atlassian Premium ($22.05+/agent/month)",
    typicalACV: "Bundled with Atlassian enterprise contract",
    marketSegment: ["smb", "mid-market", "enterprise"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "JSM agent count plus Confluence user count for full AI coverage",
      "Premium tier required — Standard tier excludes AI features",
      "Rovo (AI search + agents) priced as a separate add-on",
    ],
    bottomLine: "AI ops bundled at no extra cost for Atlassian Premium subscribers.",
  },

  "agentops/dynatrace-davis-ai": {
    pricingModel: "consumption",
    transparency: "limited-public",
    startingPrice: "Included with Dynatrace platform (no AI surcharge)",
    typicalACV: "Same as Dynatrace platform — $200K–$1M+",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas", "on-prem", "hybrid"],
    freeTrialOrTier: true,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Same host-unit consumption pricing as base Dynatrace platform",
      "Davis AI causal analysis has no separate per-query pricing",
      "AutomationEngine (Davis AI actions) billed as separate capability",
    ],
    bottomLine: "AI operations with no AI surcharge — Davis AI is included in the platform.",
  },

  /* ══════════════════════════════════════════════════════════════════════════
     AgentOps — Top 5 To Watch
  ══════════════════════════════════════════════════════════════════════════ */

  "agentops/torq": {
    pricingModel: "consumption",
    transparency: "contact-sales",
    typicalACV: "$80K–$300K",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Alert and case volume processed per month",
      "Number of autonomous agent workflows deployed",
      "Integration connector count across security and IT tools",
    ],
    bottomLine: "Autonomous case closure — ROI justified by analyst headcount reduction.",
  },

  "agentops/tines": {
    pricingModel: "module-based",
    transparency: "public-list",
    startingPrice: "Free (5 live Stories); from $500/month (Team)",
    typicalACV: "$30K–$150K for enterprise",
    marketSegment: ["mid-market", "enterprise"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Number of live automation workflows (Stories)",
      "Monthly action run volume above plan limits",
      "Credential store and team collaboration features in higher tiers",
    ],
    bottomLine: "One of the rare vendors with a published price list — rare transparency in ops automation.",
  },

  "agentops/atomicwork": {
    pricingModel: "per-seat",
    transparency: "contact-sales",
    typicalACV: "$30K–$120K",
    marketSegment: ["mid-market", "enterprise"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Employee count or helpdesk agent seat count",
      "AI-resolved ticket volume per month",
      "Enterprise knowledge base integration depth",
    ],
    bottomLine: "Disruptive AI-first pricing to displace expensive legacy ITSM platforms.",
  },

  "agentops/shoreline-io": {
    pricingModel: "consumption",
    transparency: "contact-sales",
    typicalACV: "$30K–$150K",
    marketSegment: ["mid-market", "enterprise"],
    deploymentModel: ["saas", "hybrid"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Number of monitored nodes and hosts",
      "Runbook execution count per month",
      "Integrations with cloud providers and alerting systems",
    ],
    bottomLine: "Cloud ops automation — competitive pricing vs. traditional runbook tools.",
  },

  "agentops/causely": {
    pricingModel: "consumption",
    transparency: "contact-sales",
    typicalACV: "$40K–$200K",
    marketSegment: ["enterprise"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Number of monitored services and microservices",
      "Root cause analysis volume and frequency",
      "Integration breadth with observability data sources",
    ],
    bottomLine: "Causal AI for self-healing ops — pricing still maturing for early enterprise deals.",
  },

  /* ══════════════════════════════════════════════════════════════════════════
     SecOps — Top 5 Leaders
  ══════════════════════════════════════════════════════════════════════════ */

  "secops/crowdstrike": {
    pricingModel: "module-based",
    transparency: "limited-public",
    startingPrice: "Falcon Go from $59.99/endpoint/year (SMB)",
    typicalACV: "$200K–$5M for enterprise multi-module Falcon",
    marketSegment: ["mid-market", "enterprise", "fortune500"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Endpoint count is the primary cost lever — every device licensed",
      "Falcon module stack (XDR, SIEM, Identity, SOAR) multiplies per-endpoint cost",
      "Charlotte AI and Next-Gen SIEM are premium add-ons priced separately",
    ],
    bottomLine: "Per-endpoint model scales hard — full Falcon platform at enterprise is very expensive.",
  },

  "secops/palo-alto-networks": {
    pricingModel: "module-based",
    transparency: "contact-sales",
    typicalACV: "$500K–$5M for Cortex platform",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas", "on-prem", "hybrid"],
    freeTrialOrTier: true,
    tcoBadge: "very-high",
    keyPricingDrivers: [
      "Cortex platform module stack (XDR, XSOAR, XSIAM) each licensed separately",
      "Security event and alert volume processed per day",
      "Professional services for implementation (typically 30–50% of license)",
    ],
    bottomLine: "Comprehensive but one of the highest TCO options in SecOps.",
  },

  "secops/microsoft-sentinel": {
    pricingModel: "consumption",
    transparency: "public-list",
    startingPrice: "$2.46/GB ingested (Pay-as-you-go) on Azure",
    typicalACV: "$50K–$500K for enterprise",
    marketSegment: ["mid-market", "enterprise", "fortune500"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Log data ingestion volume (GB/day) is the dominant cost driver",
      "Data retention beyond 90 days billed at archive rates",
      "Copilot for Security add-on $4/SCU (Security Compute Unit)",
    ],
    bottomLine: "Pay-per-GB SIEM — cheapest Azure entry; costs balloon with log volume.",
  },

  "secops/splunk-soar": {
    pricingModel: "consumption",
    transparency: "contact-sales",
    typicalACV: "$200K–$2M for enterprise SIEM + SOAR",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas", "on-prem", "hybrid"],
    freeTrialOrTier: true,
    tcoBadge: "very-high",
    keyPricingDrivers: [
      "Daily log ingest volume in GB/day (primary lever)",
      "Workload pricing model adds compute charges on top of ingest",
      "Cisco acquisition adding bundling complexity and premium pressure",
    ],
    bottomLine: "Buyers negotiating hard post-Cisco acquisition — expect intense license scrutiny.",
  },

  "secops/ibm-qradar-soar": {
    pricingModel: "enterprise-license",
    transparency: "contact-sales",
    typicalACV: "$200K–$3M for enterprise SOC",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas", "on-prem", "hybrid"],
    freeTrialOrTier: false,
    tcoBadge: "very-high",
    keyPricingDrivers: [
      "Events-per-second (EPS) licensing model — scales sharply with log volume",
      "Flows-per-minute (FPM) for network visibility adds significant cost",
      "SOAR automation case volume licensed separately from SIEM",
    ],
    bottomLine: "Legacy EPS-based model — expensive to scale and complex to negotiate.",
  },

  /* ══════════════════════════════════════════════════════════════════════════
     SecOps — Top 5 To Watch
  ══════════════════════════════════════════════════════════════════════════ */

  "secops/snyk": {
    pricingModel: "per-seat",
    transparency: "public-list",
    startingPrice: "Free (limited scans); $25/developer/month (Team)",
    typicalACV: "$30K–$500K for enterprise DevSecOps",
    marketSegment: ["mid-market", "enterprise", "fortune500"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Developer seat count — every developer touching secure code is licensed",
      "Snyk Enterprise tier for RBAC, SSO, and compliance reporting",
      "Container and IaC scanning in higher tiers",
    ],
    bottomLine: "Developer-native AppSec pricing — one of the most transparent in the category.",
  },

  "secops/tines": {
    pricingModel: "module-based",
    transparency: "public-list",
    startingPrice: "Free (5 live Stories); from $500/month (Team)",
    typicalACV: "$30K–$200K for enterprise security automation",
    marketSegment: ["mid-market", "enterprise"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Number of live automation workflows (Stories) across security use cases",
      "Monthly action run volume above plan limits",
      "AI Story Builder usage in Enterprise tier",
    ],
    bottomLine: "Published price list is rare in security tooling — exceptional transparency.",
  },

  "secops/torq": {
    pricingModel: "consumption",
    transparency: "contact-sales",
    typicalACV: "$80K–$350K for enterprise SecOps automation",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Alert and security case volume processed per month",
      "Number of autonomous agent integrations deployed",
      "HyperSOC case closure breadth and integration depth",
    ],
    bottomLine: "AI-native SOAR — tier-1 alert closure reduces analyst headcount costs.",
  },

  "secops/radiant-security": {
    pricingModel: "consumption",
    transparency: "contact-sales",
    typicalACV: "$80K–$300K",
    marketSegment: ["enterprise"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Alert volume investigated by the autonomous SOC analyst",
      "SIEM integration breadth and data source count",
      "Analyst seat displacement and escalation volume",
    ],
    bottomLine: "Autonomous SOC built to replace MDR cost rather than add to it.",
  },

  "secops/stairwell": {
    pricingModel: "enterprise-license",
    transparency: "contact-sales",
    typicalACV: "$50K–$200K",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas", "hybrid"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "File volume submitted for continuous malware fingerprinting",
      "Threat intelligence feed breadth and historical lookback",
      "Endpoint agent coverage scope",
    ],
    bottomLine: "Specialized malware intelligence — niche but defensible for mature SOCs.",
  },

  // ── AIOps Established ────────────────────────────────────────────────────

  "aiops/new-relic": {
    pricingModel: "consumption",
    transparency: "public-list",
    startingPrice: "Free tier (100 GB/month)",
    typicalACV: "$30K–$300K",
    marketSegment: ["mid-market", "enterprise", "fortune500"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Data ingest volume (GB/month) after free tier",
      "Number of full-platform users versus basic users",
      "Add-on modules: Vulnerability Management, CodeStream, Infinite Tracing",
    ],
    bottomLine: "Consumption model rewards lean telemetry practices; costs scale predictably with ingest discipline.",
  },

  "aiops/pagerduty": {
    pricingModel: "per-seat",
    transparency: "public-list",
    startingPrice: "$21/user/month (Professional)",
    typicalACV: "$20K–$200K",
    marketSegment: ["mid-market", "enterprise", "fortune500"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Number of full users versus stakeholder (view-only) users",
      "Tier selection: Professional vs Business vs Enterprise Digital Operations",
      "Add-on: AIOps, Runbook Automation, Process Automation",
    ],
    bottomLine: "Per-seat pricing is predictable; AIOps and automation add-ons are where enterprise budgets expand.",
  },

  "aiops/logicmonitor": {
    pricingModel: "per-seat",
    transparency: "contact-sales",
    typicalACV: "$40K–$400K",
    marketSegment: ["mid-market", "enterprise", "fortune500"],
    deploymentModel: ["saas", "hybrid"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Number of monitored devices and dynamic units",
      "Data retention duration beyond default window",
      "Add-on modules: LM Envision, AIOps anomaly detection, cloud resource monitoring",
    ],
    bottomLine: "Device-based pricing rewards infrastructure consolidation; cloud resource counts can surprise buyers.",
  },

  "aiops/cribl": {
    pricingModel: "consumption",
    transparency: "public-list",
    startingPrice: "Free (1 GB/day Cribl Stream)",
    typicalACV: "$50K–$500K",
    marketSegment: ["mid-market", "enterprise", "fortune500"],
    deploymentModel: ["saas", "on-prem", "hybrid"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Daily data throughput volume (GB/day) across Stream, Search, and Edge",
      "Deployment model: Cribl.Cloud versus self-managed adds infrastructure costs",
      "Number of Cribl Edge nodes for distributed collection",
    ],
    bottomLine: "Cribl ROI story is data reduction savings; total cost depends on volume and competitive SIEM displacement.",
  },

  "aiops/bigpanda": {
    pricingModel: "consumption",
    transparency: "contact-sales",
    typicalACV: "$80K–$500K",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas"],
    freeTrialOrTier: false,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Alert volume ingested per month across integrated monitoring tools",
      "Number of integrated monitoring and observability data sources",
      "Users: NOC analysts, operators, and service owners",
    ],
    bottomLine: "Premium for large enterprise NOC use cases — ROI realized through on-call reduction and MTTR improvement.",
  },

  // ── AIOps Startups ───────────────────────────────────────────────────────

  "aiops/rootly": {
    pricingModel: "per-seat",
    transparency: "public-list",
    startingPrice: "$19/user/month",
    typicalACV: "$10K–$80K",
    marketSegment: ["mid-market", "enterprise"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Number of responders and on-call users",
      "Slack/Teams workspace size driving automation volume",
      "Add-ons: Analytics, AI summaries, custom integrations",
    ],
    bottomLine: "Affordable Slack-native incident management — low barrier for engineering teams already in Slack.",
  },

  "aiops/komodor": {
    pricingModel: "per-seat",
    transparency: "public-list",
    startingPrice: "Free tier (up to 10 users)",
    typicalACV: "$15K–$100K",
    marketSegment: ["mid-market", "enterprise"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Number of Kubernetes clusters monitored",
      "Number of platform engineering and DevOps users",
      "Add-ons: AI-driven root cause analysis, advanced audit trail",
    ],
    bottomLine: "Purpose-built Kubernetes troubleshooting at low cost — best ROI for high-Kubernetes-cluster-count environments.",
  },

  "aiops/better-stack": {
    pricingModel: "consumption",
    transparency: "public-list",
    startingPrice: "Free tier (10 monitors, 3 team members)",
    typicalACV: "$5K–$60K",
    marketSegment: ["smb", "mid-market"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Number of uptime monitors and check frequency",
      "Log volume ingested and retention period",
      "On-call schedules and team member seats",
    ],
    bottomLine: "Best-in-class value for SMB and scale-up engineering teams — grows cleanly with the team.",
  },

  "aiops/signoz": {
    pricingModel: "open-source-plus",
    transparency: "public-list",
    startingPrice: "Free (self-hosted open-source)",
    typicalACV: "$10K–$80K",
    marketSegment: ["smb", "mid-market", "enterprise"],
    deploymentModel: ["saas", "on-prem"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Data ingest volume for traces, metrics, and logs (GB/month on Cloud)",
      "Self-hosted infrastructure costs (compute + storage) for open-source deployments",
      "Enterprise support and SSO add-ons",
    ],
    bottomLine: "Open-source optionality keeps costs low — cloud tier adds convenience without punishing ingest discipline.",
  },

  "aiops/dash0": {
    pricingModel: "consumption",
    transparency: "public-list",
    startingPrice: "Free developer tier",
    typicalACV: "$10K–$60K",
    marketSegment: ["smb", "mid-market"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "OpenTelemetry data ingest volume (spans, metrics, logs) per month",
      "Data retention duration beyond default window",
      "Team seats and collaboration features",
    ],
    bottomLine: "OpenTelemetry-native observability priced for developer teams — minimal vendor lock-in at competitive TCO.",
  },

  // ── ITOM Established ─────────────────────────────────────────────────────

  "itom/ivanti": {
    pricingModel: "module-based",
    transparency: "contact-sales",
    typicalACV: "$50K–$500K",
    marketSegment: ["mid-market", "enterprise", "fortune500"],
    deploymentModel: ["saas", "on-prem", "hybrid"],
    freeTrialOrTier: false,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Module selection: ITSM, UEM, patch management, security controls",
      "Device count under management (endpoints, mobile, servers)",
      "Deployment model: SaaS versus on-prem adds licensing complexity",
    ],
    bottomLine: "Full suite pricing rewards consolidation but module sprawl adds up — careful scoping essential.",
  },

  "itom/manageengine-sd-plus": {
    pricingModel: "per-seat",
    transparency: "public-list",
    startingPrice: "$13/technician/month (Standard)",
    typicalACV: "$10K–$100K",
    marketSegment: ["smb", "mid-market", "enterprise"],
    deploymentModel: ["saas", "on-prem"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Number of IT technician seats",
      "Add-on modules: asset management, problem management, change management",
      "Requestors are unlimited; pricing is technician-only",
    ],
    bottomLine: "Best price-to-feature ratio in ITSM — Zoho ecosystem buyers get additional bundling leverage.",
  },

  "itom/solarwinds-service-desk": {
    pricingModel: "per-seat",
    transparency: "public-list",
    startingPrice: "$39/agent/month (Essentials)",
    typicalACV: "$15K–$120K",
    marketSegment: ["smb", "mid-market", "enterprise"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Number of IT agent seats",
      "Tier selection: Essentials vs Advanced vs Premier",
      "Asset and discovery node count for ITAM capabilities",
    ],
    bottomLine: "Straightforward agent-based pricing with strong ITAM bundling — accessible for mid-market IT teams.",
  },

  "itom/atera": {
    pricingModel: "per-seat",
    transparency: "public-list",
    startingPrice: "$149/technician/month (Professional)",
    typicalACV: "$10K–$60K",
    marketSegment: ["smb", "mid-market"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Number of technician seats (endpoints managed are unlimited)",
      "Tier: Professional vs Expert vs Master",
      "AI Action Items and advanced automation add-ons",
    ],
    bottomLine: "Unlimited endpoints per technician is uniquely disruptive for MSPs — cost scales with headcount, not device sprawl.",
  },

  "itom/sysaid": {
    pricingModel: "per-seat",
    transparency: "contact-sales",
    typicalACV: "$15K–$150K",
    marketSegment: ["mid-market", "enterprise"],
    deploymentModel: ["saas", "on-prem"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Number of IT admin and agent seats",
      "Deployment model: cloud versus on-prem adds licensing tiers",
      "AI-powered modules: Copilot, ticket classification, automated routing",
    ],
    bottomLine: "Competitive ITSM with strong AI augmentation — on-prem option appeals to compliance-heavy mid-market buyers.",
  },

  // ── ITOM Startups ────────────────────────────────────────────────────────

  "itom/productiv": {
    pricingModel: "enterprise-license",
    transparency: "contact-sales",
    typicalACV: "$80K–$400K",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas"],
    freeTrialOrTier: false,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Number of employees and SaaS applications managed",
      "Depth of engagement analytics and business unit reporting",
      "Integrations: Okta, Workday, Slack, and SSO providers",
    ],
    bottomLine: "Premium SaaS management with ROI measured in license reclamation savings — typically 3–5x payback claimed.",
  },

  "itom/zylo": {
    pricingModel: "enterprise-license",
    transparency: "contact-sales",
    typicalACV: "$60K–$300K",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas"],
    freeTrialOrTier: false,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Total SaaS spend under management",
      "Number of employees and applications tracked",
      "Optimization advisory and benchmark services included",
    ],
    bottomLine: "ROI story centers on SaaS waste elimination — buyer needs $5M+ SaaS spend to justify investment.",
  },

  "itom/lansweeper": {
    pricingModel: "per-seat",
    transparency: "public-list",
    startingPrice: "Free (up to 100 assets, Community)",
    typicalACV: "$10K–$100K",
    marketSegment: ["smb", "mid-market", "enterprise"],
    deploymentModel: ["saas", "on-prem"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Number of scanned assets (devices, users, cloud resources)",
      "Cloud versus on-prem deployment tier",
      "Add-ons: Risk Insights, Technology Intelligence, Connector integrations",
    ],
    bottomLine: "Asset discovery at competitive price — free tier drives adoption; enterprise scale is predictably priced.",
  },

  "itom/genuity": {
    pricingModel: "platform-license",
    transparency: "public-list",
    startingPrice: "$29,999/year (flat)",
    typicalACV: "$30K–$60K",
    marketSegment: ["smb", "mid-market"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Flat annual fee covers unlimited users and assets up to tier",
      "Add-on: telecom expense management module",
      "Professional services for initial data import and training",
    ],
    bottomLine: "Radically transparent flat pricing removes per-seat anxiety — best value for cost-conscious IT teams under 500 seats.",
  },

  "itom/aisera": {
    pricingModel: "enterprise-license",
    transparency: "contact-sales",
    typicalACV: "$150K–$800K",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas"],
    freeTrialOrTier: false,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Number of employees receiving AI service desk capabilities",
      "Domains deployed: IT, HR, finance, facilities",
      "Integration depth with ServiceNow, Workday, SAP for fulfillment automation",
    ],
    bottomLine: "Enterprise-grade AI service desk with premium TCO justified by measurable ticket deflection above 80%.",
  },

  // ── RPA Established ──────────────────────────────────────────────────────

  "rpa/pega": {
    pricingModel: "platform-license",
    transparency: "contact-sales",
    typicalACV: "$200K–$2M",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas", "on-prem", "hybrid"],
    freeTrialOrTier: false,
    tcoBadge: "very-high",
    keyPricingDrivers: [
      "Named and concurrent user licensing tiers",
      "Case volume and process execution counts",
      "Platform modules: BPM, CRM, DPA, low-code app development",
    ],
    bottomLine: "Strategic platform investment — TCO is high but justified for enterprises unifying BPM, CRM, and AI on one stack.",
  },

  "rpa/celonis": {
    pricingModel: "consumption",
    transparency: "contact-sales",
    typicalACV: "$150K–$1M",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas", "hybrid"],
    freeTrialOrTier: false,
    tcoBadge: "very-high",
    keyPricingDrivers: [
      "Data volume ingested from ERP and operational systems",
      "Number of process apps and Actions deployed",
      "Connectors to SAP, Oracle, Salesforce, ServiceNow systems",
    ],
    bottomLine: "Premium for enterprise process mining — ROI measured in ERP efficiency gains, typically 6–18 month payback.",
  },

  "rpa/tungsten-automation": {
    pricingModel: "module-based",
    transparency: "contact-sales",
    typicalACV: "$80K–$500K",
    marketSegment: ["mid-market", "enterprise", "fortune500"],
    deploymentModel: ["saas", "on-prem", "hybrid"],
    freeTrialOrTier: false,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Bot runtime licenses (attended vs unattended robots)",
      "Document processing volume for intelligent capture modules",
      "TotalAgility BPM user and case volume licensing",
    ],
    bottomLine: "Strong for document-heavy automation — module complexity requires careful scoping to avoid license sprawl.",
  },

  "rpa/nintex": {
    pricingModel: "per-seat",
    transparency: "contact-sales",
    startingPrice: "Contact sales (Pro from ~$25K/year)",
    typicalACV: "$30K–$200K",
    marketSegment: ["mid-market", "enterprise"],
    deploymentModel: ["saas", "on-prem"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Workflow and process builder user seats",
      "Document generation and e-signature volume",
      "Nintex RPA bot runtime and attended automation seats",
    ],
    bottomLine: "Mid-market process automation at accessible price — Microsoft 365 and Salesforce integration is key differentiator.",
  },

  "rpa/sap-build-process": {
    pricingModel: "platform-license",
    transparency: "contact-sales",
    typicalACV: "$100K–$1M",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas", "hybrid"],
    freeTrialOrTier: false,
    tcoBadge: "very-high",
    keyPricingDrivers: [
      "SAP BTP credits consumed by process automation workloads",
      "Bundling with existing SAP S/4HANA, SuccessFactors, or Ariba licenses",
      "Number of workflow and RPA bot executions",
    ],
    bottomLine: "Compelling for SAP-heavy enterprises — licensing bundled into BTP credits but credit consumption requires careful monitoring.",
  },

  // ── RPA Startups ─────────────────────────────────────────────────────────

  "rpa/nango": {
    pricingModel: "consumption",
    transparency: "public-list",
    startingPrice: "Free (3 integrations, development)",
    typicalACV: "$5K–$60K",
    marketSegment: ["smb", "mid-market"],
    deploymentModel: ["saas", "on-prem"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Number of active OAuth integrations and monthly API operations",
      "Self-hosted versus Nango Cloud deployment",
      "Enterprise: dedicated infrastructure and SLA tiers",
    ],
    bottomLine: "Developer-first integration infrastructure at startup-friendly pricing — open-source option keeps lock-in minimal.",
  },

  "rpa/paragon": {
    pricingModel: "consumption",
    transparency: "contact-sales",
    typicalACV: "$20K–$150K",
    marketSegment: ["smb", "mid-market", "enterprise"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Number of end-user integrations enabled in the product",
      "Monthly active users connecting third-party apps",
      "Premium connectors and enterprise workflow steps",
    ],
    bottomLine: "Embedded integration infrastructure priced per end-user adoption — costs scale with product success, not headcount.",
  },

  "rpa/merge-dev": {
    pricingModel: "consumption",
    transparency: "public-list",
    startingPrice: "Free (Launch plan, limited linked accounts)",
    typicalACV: "$10K–$120K",
    marketSegment: ["smb", "mid-market", "enterprise"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Number of linked customer accounts (API connections)",
      "Unified API categories: HRIS, ATS, CRM, accounting, etc.",
      "Advanced features: Field Mapping, Selective Sync, Webhooks",
    ],
    bottomLine: "Unified API removes the N×M integration problem — per-linked-account pricing aligns cost directly with customer growth.",
  },

  "rpa/retool": {
    pricingModel: "per-seat",
    transparency: "public-list",
    startingPrice: "Free (5 users, 5 apps)",
    typicalACV: "$10K–$150K",
    marketSegment: ["smb", "mid-market", "enterprise"],
    deploymentModel: ["saas", "on-prem"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Number of editor (builder) seats versus end-user seats",
      "Self-hosted deployment adds infrastructure costs",
      "Retool Workflows: automation step execution volume",
    ],
    bottomLine: "Developer-friendly internal tool builder — free tier drives adoption; predictable per-seat growth model.",
  },

  "rpa/superblocks": {
    pricingModel: "per-seat",
    transparency: "public-list",
    startingPrice: "Free (unlimited internal users)",
    typicalACV: "$10K–$120K",
    marketSegment: ["smb", "mid-market", "enterprise"],
    deploymentModel: ["saas", "on-prem"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Number of developer/builder seats",
      "Self-hosted on-prem deployment tier for compliance buyers",
      "Enterprise: SSO, audit logs, granular RBAC, dedicated support",
    ],
    bottomLine: "Free unlimited end-users is a strong differentiator — costs driven by developer seat count, not user scale.",
  },

  // ── AgentOps Established ─────────────────────────────────────────────────

  "agentops/ibm-watson-orchestrate": {
    pricingModel: "per-seat",
    transparency: "contact-sales",
    typicalACV: "$100K–$600K",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas", "hybrid"],
    freeTrialOrTier: false,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Number of employees accessing AI assistant capabilities",
      "Agent execution volume and workflow automation steps",
      "IBM Cloud Pak for Business Automation bundling",
    ],
    bottomLine: "IBM enterprise pricing — value justified for organizations already invested in IBM middleware and watsonx platform.",
  },

  "agentops/pagerduty-copilot": {
    pricingModel: "per-seat",
    transparency: "contact-sales",
    typicalACV: "$20K–$150K",
    marketSegment: ["mid-market", "enterprise", "fortune500"],
    deploymentModel: ["saas"],
    freeTrialOrTier: false,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "PagerDuty base platform seats required before Copilot add-on",
      "Number of users leveraging AI Copilot features",
      "Copilot add-on priced on top of Digital Operations or AIOps tier",
    ],
    bottomLine: "Requires existing PagerDuty investment — incremental add-on pricing is accessible for current customers.",
  },

  "agentops/freshservice-freddy-ai": {
    pricingModel: "per-seat",
    transparency: "public-list",
    startingPrice: "Included in Growth ($49/agent/month) and above",
    typicalACV: "$20K–$200K",
    marketSegment: ["smb", "mid-market", "enterprise"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Freshservice agent seat tier (Starter/Growth/Pro/Enterprise)",
      "Freddy AI Copilot add-on for advanced generative capabilities",
      "Freddy AI Agent for end-user self-service automation",
    ],
    bottomLine: "Best AI-ITSM value at scale — Freddy AI bundled in mid tiers makes per-agent TCO highly competitive.",
  },

  "agentops/aws-bedrock-agents": {
    pricingModel: "consumption",
    transparency: "public-list",
    startingPrice: "Pay per API call (no minimum)",
    typicalACV: "$20K–$500K",
    marketSegment: ["mid-market", "enterprise", "fortune500"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Foundation model inference tokens (input + output) per agent invocation",
      "Knowledge base storage and retrieval calls for RAG",
      "Agent orchestration steps and tool invocation volume",
    ],
    bottomLine: "Pure consumption pricing aligns cost with value — total spend can be unpredictable at scale without rate controls.",
  },

  "agentops/kore-ai": {
    pricingModel: "consumption",
    transparency: "contact-sales",
    typicalACV: "$80K–$500K",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas", "on-prem", "hybrid"],
    freeTrialOrTier: true,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Session and interaction volume across virtual assistant deployments",
      "Number of channels and enterprise system integrations",
      "Training and NLP model customization services",
    ],
    bottomLine: "Enterprise conversational AI at premium — broad deployment flexibility justifies cost for regulated industry buyers.",
  },

  // ── AgentOps Startups ────────────────────────────────────────────────────

  "agentops/leena-ai": {
    pricingModel: "per-seat",
    transparency: "contact-sales",
    typicalACV: "$50K–$300K",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas"],
    freeTrialOrTier: false,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Number of employees accessing AI assistant (per-employee pricing)",
      "Domains deployed: IT, HR, finance self-service",
      "Integrations: ServiceNow, Workday, SAP SuccessFactors",
    ],
    bottomLine: "Per-employee pricing model makes ROI transparent — deflection rate directly maps to cost avoidance.",
  },

  "agentops/espressive-barista": {
    pricingModel: "per-seat",
    transparency: "contact-sales",
    typicalACV: "$60K–$350K",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas"],
    freeTrialOrTier: false,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Employee count accessing Barista virtual agent",
      "Domains: IT, HR, facilities, finance service coverage",
      "Integrations with ITSM, HCM, and enterprise knowledge systems",
    ],
    bottomLine: "ROI narrative driven by help desk call deflection — customers targeting 50%+ deflection rates before purchase.",
  },

  "agentops/rezolve-ai": {
    pricingModel: "per-seat",
    transparency: "contact-sales",
    typicalACV: "$40K–$250K",
    marketSegment: ["mid-market", "enterprise"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Number of employees using AI self-service capabilities",
      "Microsoft Teams integration depth and bot framework usage",
      "AI resolution automation breadth across IT and HR workflows",
    ],
    bottomLine: "Teams-native AI service desk with mid-market pricing — compelling for Microsoft-first organizations.",
  },

  "agentops/gaspar-ai": {
    pricingModel: "per-seat",
    transparency: "contact-sales",
    typicalACV: "$20K–$120K",
    marketSegment: ["smb", "mid-market"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Number of employee seats for Slack/Teams AI assistant",
      "Ticket automation volume and knowledge base articles indexed",
      "ITSM integration connectors (Jira, Zendesk, ServiceNow)",
    ],
    bottomLine: "Affordable AI helpdesk for Slack-first organizations — fast time to value with minimal implementation complexity.",
  },

  "agentops/workativ-assistant": {
    pricingModel: "per-seat",
    transparency: "public-list",
    startingPrice: "Starter from $1,530/month (150 users)",
    typicalACV: "$18K–$100K",
    marketSegment: ["smb", "mid-market"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Number of employees using the AI chatbot",
      "Workflow automation steps and app integrations",
      "Channels: Slack, Teams, web widget deployment",
    ],
    bottomLine: "Transparent tiered pricing makes budgeting easy — strong entry point for SMB IT teams automating common requests.",
  },

  // ── SecOps Established ───────────────────────────────────────────────────

  "secops/sentinelone": {
    pricingModel: "per-seat",
    transparency: "contact-sales",
    startingPrice: "Core from ~$6/endpoint/month",
    typicalACV: "$50K–$600K",
    marketSegment: ["mid-market", "enterprise", "fortune500"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Number of protected endpoints across Core/Control/Complete/Commercial tiers",
      "Add-on modules: Singularity Identity, Cloud Workload, DataLake retention",
      "Purple AI and threat hunting add-ons on Enterprise tiers",
    ],
    bottomLine: "Competitive per-endpoint pricing at Core tier; XDR and AI capabilities at higher tiers drive enterprise ACV up.",
  },

  "secops/servicenow-secops": {
    pricingModel: "module-based",
    transparency: "contact-sales",
    typicalACV: "$80K–$500K",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas"],
    freeTrialOrTier: false,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Existing ServiceNow ITSM tier (required base platform)",
      "Security Operations module: Vulnerability Response, Threat Intelligence, SecOps",
      "Number of security users and IT operations users",
    ],
    bottomLine: "Add-on cost on top of ServiceNow ITSM — ROI strongest for organizations with mature CMDB and existing platform investment.",
  },

  "secops/exabeam": {
    pricingModel: "enterprise-license",
    transparency: "contact-sales",
    typicalACV: "$100K–$800K",
    marketSegment: ["mid-market", "enterprise", "fortune500"],
    deploymentModel: ["saas"],
    freeTrialOrTier: false,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Data ingest volume (EPS or GB/day) for Fusion SIEM",
      "Number of UEBA users and entity profiles monitored",
      "Data retention duration and threat hunting lookback window",
    ],
    bottomLine: "Cloud-native SIEM at enterprise pricing — TCO competitive versus on-prem Splunk but requires careful ingest scoping.",
  },

  "secops/securonix": {
    pricingModel: "enterprise-license",
    transparency: "contact-sales",
    typicalACV: "$120K–$900K",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas", "hybrid"],
    freeTrialOrTier: false,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Unlimited data ingest pricing tier (volume bands)",
      "BYOC cloud storage costs (customer pays own S3/GCS/ADLS)",
      "User and entity count for UEBA behavioral models",
    ],
    bottomLine: "Unlimited ingest model eliminates per-GB anxiety — BYOC storage costs shift but give compliance sovereignty.",
  },

  "secops/google-chronicle": {
    pricingModel: "per-seat",
    transparency: "contact-sales",
    startingPrice: "Per-user pricing (contact Google Cloud sales)",
    typicalACV: "$150K–$1.5M",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas"],
    freeTrialOrTier: false,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Number of users (flat per-user model with unlimited data ingestion)",
      "Threat Intelligence add-on: VirusTotal and Mandiant intelligence feeds",
      "Committed use discounts available for multi-year Google Cloud agreements",
    ],
    bottomLine: "Unlimited ingest per-user pricing transforms SIEM economics — TCO competitive versus Splunk for high-volume organizations.",
  },

  // ── SecOps Startups ──────────────────────────────────────────────────────

  "secops/sublime-security": {
    pricingModel: "per-seat",
    transparency: "contact-sales",
    startingPrice: "Free (up to 25 mailboxes, Community)",
    typicalACV: "$20K–$200K",
    marketSegment: ["mid-market", "enterprise"],
    deploymentModel: ["saas", "on-prem"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Number of protected mailboxes",
      "Deployment model: Sublime Cloud vs self-hosted on-prem",
      "Enterprise features: multi-tenant, SOAR integrations, advanced reporting",
    ],
    bottomLine: "Competitive email security pricing — free community tier drives adoption; per-mailbox scaling is predictable.",
  },

  "secops/anomali": {
    pricingModel: "enterprise-license",
    transparency: "contact-sales",
    typicalACV: "$80K–$600K",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas", "on-prem"],
    freeTrialOrTier: false,
    tcoBadge: "high",
    keyPricingDrivers: [
      "ThreatStream platform license plus TI feed subscription costs",
      "Match platform data volume for retroactive IOC correlation",
      "Professional services for feed onboarding and platform tuning",
    ],
    bottomLine: "Total cost includes platform plus feed licensing — ROI measured by threat detection improvements and analyst time saved.",
  },

  "secops/revelstoke": {
    pricingModel: "enterprise-license",
    transparency: "contact-sales",
    typicalACV: "$40K–$250K",
    marketSegment: ["mid-market", "enterprise"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Number of analyst seats and automation playbook executions",
      "Integrations with SIEM, EDR, and ticketing platforms",
      "Case management and reporting volume",
    ],
    bottomLine: "Competitive SOAR pricing versus XSOAR — transparent model with no per-action fees is the key differentiator.",
  },

  "secops/eclecticiq": {
    pricingModel: "enterprise-license",
    transparency: "contact-sales",
    typicalACV: "$60K–$400K",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas", "on-prem"],
    freeTrialOrTier: false,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Deployment model: SaaS versus on-prem or air-gapped",
      "Number of analyst workbench users",
      "Intelligence sharing community feeds and ISAC memberships",
    ],
    bottomLine: "Enterprise TIP pricing with on-prem flexibility — air-gapped deployment adds significant infrastructure investment.",
  },

  "secops/feedly-ai": {
    pricingModel: "per-seat",
    transparency: "public-list",
    startingPrice: "$12/user/month (Pro, annual)",
    typicalACV: "$5K–$60K",
    marketSegment: ["smb", "mid-market", "enterprise"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Number of analyst seats on Pro vs Business vs Enterprise plan",
      "AI Leo model usage: custom threat models and alert volume",
      "Team collaboration features and SSO on Enterprise tier",
    ],
    bottomLine: "Best value for open-source threat intelligence monitoring — affordable per-seat model accessible to any security team.",
  },


  /* ══════════════════════════════════════════════════════════════════════════
     AIOps — Tier 1 Expansion: Leaders & Challengers
  ══════════════════════════════════════════════════════════════════════════ */

  "aiops/servicenow-itom": {
    pricingModel: "module-based",
    transparency: "contact-sales",
    typicalACV: "$150K–$800K",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas"],
    freeTrialOrTier: false,
    tcoBadge: "very-high",
    keyPricingDrivers: [
      "Priced per managed CI (configuration item) in the CMDB",
      "Event Management and Discovery are separate modules with separate licensing",
      "Professional services engagement nearly always required for initial CMDB population",
    ],
    bottomLine: "Justified only for organisations already on ServiceNow ITSM; standalone AIOps cost far exceeds best-of-breed alternatives.",
  },

  "aiops/ibm-instana": {
    pricingModel: "consumption",
    transparency: "limited-public",
    startingPrice: "$75/host/month",
    typicalACV: "$80K–$400K",
    marketSegment: ["mid-market", "enterprise"],
    deploymentModel: ["saas", "on-prem"],
    freeTrialOrTier: true,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Per-host pricing; containers and pods count as fractional hosts",
      "Trace volume overages can add significant cost in high-throughput environments",
      "Enterprise on-prem deployment requires IBM support tier uplift",
    ],
    bottomLine: "Competitive with Dynatrace on per-host cost but IBM enterprise support tiers push total cost up for large deployments.",
  },

  "aiops/appdynamics": {
    pricingModel: "consumption",
    transparency: "contact-sales",
    typicalACV: "$200K–$1.5M",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas", "on-prem", "hybrid"],
    freeTrialOrTier: true,
    tcoBadge: "very-high",
    keyPricingDrivers: [
      "Per-agent licensing model; agent count multiplies with microservices architectures",
      "Business iQ and analytics features are separately licensed premium add-ons",
      "Cisco enterprise agreement bundles can obscure true AppDynamics-specific cost",
    ],
    bottomLine: "Premium-priced legacy APM; best value when bundled into a Cisco enterprise agreement and justified by Business iQ revenue correlation.",
  },

  "aiops/bmc-truesight": {
    pricingModel: "enterprise-license",
    transparency: "contact-sales",
    typicalACV: "$300K–$2M",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["on-prem", "hybrid"],
    freeTrialOrTier: false,
    tcoBadge: "very-high",
    keyPricingDrivers: [
      "Licensed per monitored device or node; large estates create large contracts",
      "Significant professional services required for implementation and tuning",
      "Annual maintenance and support fees on top of license cost",
    ],
    bottomLine: "Highest TCO in the AIOps market — justified only for hybrid mainframe + distributed enterprises with no viable cloud-native alternative.",
  },

  "aiops/solarwinds": {
    pricingModel: "per-seat",
    transparency: "public-list",
    startingPrice: "$2,955/year (NPM Essentials)",
    typicalACV: "$15K–$150K",
    marketSegment: ["smb", "mid-market", "enterprise"],
    deploymentModel: ["on-prem", "saas", "hybrid"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Modules priced separately — network, server, and application monitoring require separate licenses",
      "Node/element licensing; costs increase as monitored device count grows",
      "Professional services and training fees add 15-30% to first-year cost",
    ],
    bottomLine: "Most cost-effective enterprise infrastructure monitoring available — mid-market IT teams get Gartner-recognised capability at a fraction of Datadog pricing.",
  },

  "aiops/sumo-logic": {
    pricingModel: "consumption",
    transparency: "limited-public",
    startingPrice: "Free tier (500MB/day)",
    typicalACV: "$50K–$300K",
    marketSegment: ["mid-market", "enterprise"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Credits model: each product feature (log analytics, metrics, traces) consumes different credit rates",
      "Log retention beyond 30 days requires additional credits — compliance use cases add cost",
      "Spike protection helps but unexpected log volume surges can exhaust credits",
    ],
    bottomLine: "Flexible credits model makes cost predictable for stable workloads; compliance-driven log retention is the primary cost driver at enterprise scale.",
  },

  "aiops/sysdig": {
    pricingModel: "consumption",
    transparency: "limited-public",
    startingPrice: "$20/node/month (Sysdig Monitor)",
    typicalACV: "$80K–$500K",
    marketSegment: ["mid-market", "enterprise"],
    deploymentModel: ["saas", "on-prem"],
    freeTrialOrTier: true,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Separate licensing for Monitor (observability) and Secure (security) modules",
      "Node count in Kubernetes environments can grow rapidly — autoscaling affects cost",
      "Forensics and capture features are premium tier only",
    ],
    bottomLine: "High but justifiable for teams that need both Kubernetes observability and runtime security in one agent — eliminates cost of separate CNAPP tool.",
  },

  "aiops/coralogix": {
    pricingModel: "consumption",
    transparency: "public-list",
    startingPrice: "$0.15/GB ingested (TCO Optimizer)",
    typicalACV: "$30K–$200K",
    marketSegment: ["mid-market", "enterprise"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Three storage tiers (Frequent Search, Monitoring, Compliance) priced differently",
      "In-stream processing reduces indexed volume — actual cost depends on data type",
      "Archive restore queries incur additional cost for cold-tier data",
    ],
    bottomLine: "Best cost-per-GB in the market for log-heavy workloads — teams migrating from Splunk or Datadog typically see 50-70% cost reduction.",
  },

  "aiops/sentry": {
    pricingModel: "consumption",
    transparency: "public-list",
    startingPrice: "$0 (free tier: 5K errors/month)",
    typicalACV: "$10K–$100K",
    marketSegment: ["smb", "mid-market", "enterprise"],
    deploymentModel: ["saas", "on-prem"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Error event volume is the primary cost driver — high-traffic apps generate errors rapidly",
      "Performance monitoring units (transactions) billed separately from errors",
      "Session Replay adds additional storage and processing cost per session captured",
    ],
    bottomLine: "Most affordable entry point for developer-centric error monitoring — free tier covers small apps and paid tiers scale linearly with product usage.",
  },



  /* ══════════════════════════════════════════════════════════════════════════
     ITOM — Tier 1 Expansion: Challengers
  ══════════════════════════════════════════════════════════════════════════ */

  "itom/ibm-smartcloud-control-desk": {
    pricingModel: "enterprise-license",
    transparency: "contact-sales",
    typicalACV: "$200K–$1.5M",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["on-prem", "hybrid"],
    freeTrialOrTier: false,
    tcoBadge: "very-high",
    keyPricingDrivers: [
      "Per-user licensing; authorised user vs concurrent user tiers add complexity",
      "IBM Software Subscription and Support fees add 20-25% annually on top of license",
      "Maximo integration and advanced modules require separate licensing",
    ],
    bottomLine: "Highest TCO in ITSM market — only justified for IBM mainframe-dependent enterprises with no alternative CMDB strategy.",
  },

  "itom/broadcom": {
    pricingModel: "enterprise-license",
    transparency: "contact-sales",
    typicalACV: "$100K–$800K",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["on-prem", "hybrid", "saas"],
    freeTrialOrTier: false,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Broadcom has significantly increased list prices post-CA acquisition",
      "Advantage subscription bundle required for current pricing — no module-level purchase",
      "Support tier changes mean reduced access to Broadcom engineers without premium tier",
    ],
    bottomLine: "Post-Broadcom acquisition pricing has made CA Service Desk uncompetitive for new evaluations — primarily retained by existing customers locked into multi-year agreements.",
  },

  "itom/cherwell": {
    pricingModel: "per-seat",
    transparency: "limited-public",
    typicalACV: "$40K–$300K",
    marketSegment: ["mid-market", "enterprise"],
    deploymentModel: ["saas", "on-prem", "hybrid"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Named technician licensing; concurrent user licensing available at premium",
      "Modules (ITAM, project management, ESM) priced separately",
      "Ivanti consolidation may change pricing model — check current terms",
    ],
    bottomLine: "Strong mid-market value proposition with lower implementation cost than ServiceNow — but Ivanti acquisition creates pricing uncertainty for new buyers.",
  },

  "itom/topdesk": {
    pricingModel: "per-seat",
    transparency: "limited-public",
    typicalACV: "$30K–$250K",
    marketSegment: ["mid-market", "enterprise"],
    deploymentModel: ["saas", "on-prem"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Operator (technician) and self-service (end user) seats priced separately",
      "ESM modules (HR, facilities) priced as add-ons per module",
      "Fixed-price implementation removes professional services overage risk",
    ],
    bottomLine: "Best total-cost predictability in ITSM for European mid-market — fixed implementation fees and transparent per-seat pricing eliminate typical ServiceNow budget surprises.",
  },

  "itom/easyvista": {
    pricingModel: "per-seat",
    transparency: "contact-sales",
    typicalACV: "$25K–$150K",
    marketSegment: ["mid-market", "enterprise"],
    deploymentModel: ["saas", "on-prem"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Named analyst licensing model; end-user self-service portal included",
      "Self Help digital adoption module priced separately",
      "Multi-instance pricing for organisations needing geographic data residency",
    ],
    bottomLine: "Competitive mid-market ITSM pricing with fast deployment — typically 40-60% lower total 3-year cost vs ServiceNow for comparable organisations.",
  },

  "itom/axios-assyst": {
    pricingModel: "per-seat",
    transparency: "limited-public",
    typicalACV: "$20K–$120K",
    marketSegment: ["mid-market", "enterprise"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Named analyst and end-user seats; asset management module included in standard tier",
      "Business Impact Analysis and financial management included in base platform",
      "Professional services required for CMDB population and discovery configuration",
    ],
    bottomLine: "Integrated ITSM + ITAM at mid-market pricing — eliminates separate asset management tool cost and delivers unique business impact analysis capability.",
  },



  /* ══════════════════════════════════════════════════════════════════════════
     RPA — Tier 1 Expansion: Leaders & Challengers (batch 1 of 2)
  ══════════════════════════════════════════════════════════════════════════ */

  "rpa/servicenow-rpa": {
    pricingModel: "module-based",
    transparency: "contact-sales",
    typicalACV: "$30K–$200K",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas"],
    freeTrialOrTier: false,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Priced per bot licence on top of existing ServiceNow platform subscription",
      "Document Intelligence and AI capabilities require separate module licensing",
      "Value tied to ServiceNow investment — limited standalone ROI",
    ],
    bottomLine: "Cost-effective for existing ServiceNow enterprise customers — effectively free if unused bot capacity is already licensed; poor value as a standalone purchase.",
  },

  "rpa/ibm-rpa": {
    pricingModel: "consumption",
    transparency: "contact-sales",
    typicalACV: "$80K–$600K",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas", "on-prem"],
    freeTrialOrTier: true,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Bot execution hours priced based on concurrent bot runner count",
      "watsonx AI capabilities require additional IBM Cloud consumption pricing",
      "Enterprise support tier required for production SLA guarantees",
    ],
    bottomLine: "Premium pricing justified primarily by watsonx AI integration and mainframe automation — expensive for general-purpose RPA compared to UiPath or Microsoft.",
  },

  "rpa/workfusion": {
    pricingModel: "enterprise-license",
    transparency: "contact-sales",
    typicalACV: "$100K–$500K",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas", "on-prem"],
    freeTrialOrTier: false,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Domain-specific AI model licensing for AML/KYC adds premium over base automation",
      "Human-in-the-loop review volumes affect per-task pricing",
      "UiPath acquisition may change pricing model — verify current terms",
    ],
    bottomLine: "Premium pricing for pre-trained financial compliance AI — cost justified only for organisations with high-volume AML/KYC document workflows.",
  },

  "rpa/opentext": {
    pricingModel: "enterprise-license",
    transparency: "contact-sales",
    typicalACV: "$100K–$800K",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["on-prem", "saas", "hybrid"],
    freeTrialOrTier: false,
    tcoBadge: "high",
    keyPricingDrivers: [
      "ECM, AppWorks, and RPA licensed separately — bundled pricing negotiated per deal",
      "Capture and OCR processing volumes affect variable cost",
      "Professional services required for integration and deployment",
    ],
    bottomLine: "High but justified for content-intensive enterprises needing ECM + RPA in one governed platform — eliminates separate document management tool cost.",
  },

  "rpa/laserfiche": {
    pricingModel: "per-seat",
    transparency: "limited-public",
    typicalACV: "$15K–$150K",
    marketSegment: ["smb", "mid-market", "enterprise"],
    deploymentModel: ["saas", "on-prem"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Named user licensing for full users; read-only and public portal users priced differently",
      "Repository storage priced separately above base licence volume",
      "Professional services for records management configuration required",
    ],
    bottomLine: "Best value in government records management + workflow automation — mid-range pricing with compliance capabilities that eliminate separate GovRecords tool cost.",
  },

  "rpa/hyland": {
    pricingModel: "enterprise-license",
    transparency: "contact-sales",
    typicalACV: "$80K–$600K",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["on-prem", "saas", "hybrid"],
    freeTrialOrTier: false,
    tcoBadge: "high",
    keyPricingDrivers: [
      "OnBase licensing per named user or per concurrent user — complex tier structures",
      "Epic and EHR integration connectors priced as premium add-ons",
      "Annual maintenance fees on perpetual licenses are a significant ongoing cost",
    ],
    bottomLine: "High TCO justified for healthcare — eliminates separate records management system and delivers Epic integration that most RPA vendors cannot match.",
  },

  "rpa/nice-rpa": {
    pricingModel: "consumption",
    transparency: "contact-sales",
    typicalACV: "$60K–$400K",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas", "on-prem"],
    freeTrialOrTier: false,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Priced per attended bot seat or concurrent unattended bot session",
      "CXone platform subscription prerequisite adds to total acquisition cost",
      "Real-Time Guidance premium feature priced above base attended automation",
    ],
    bottomLine: "High cost but measurably reduces agent handle time — ROI proven in contact centres; poor value for back-office-only automation without CXone.",
  },

  "rpa/redwood-software": {
    pricingModel: "consumption",
    transparency: "contact-sales",
    typicalACV: "$80K–$500K",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas", "on-prem"],
    freeTrialOrTier: false,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Bot execution minutes and process template licences priced separately",
      "RunMyJobs workload automation licensed per workflow job count",
      "SAP Endorsed certification commands premium pricing in SAP-specific deals",
    ],
    bottomLine: "Premium cost justified only for SAP-heavy finance automation — dramatically accelerates period close automation where general-purpose RPA requires months of custom development.",
  },



  /* ══════════════════════════════════════════════════════════════════════════
     RPA — Tier 1 Expansion: Challengers (batch 2 of 2)
  ══════════════════════════════════════════════════════════════════════════ */

  "rpa/fortra": {
    pricingModel: "per-seat",
    transparency: "limited-public",
    typicalACV: "$10K–$80K",
    marketSegment: ["smb", "mid-market"],
    deploymentModel: ["on-prem", "saas"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Bot runner licences priced per concurrent session",
      "Module add-ons for file transfer and ERP connectors",
      "Annual maintenance included in subscription pricing",
    ],
    bottomLine: "Best value for IT operations batch scheduling and legacy system automation — 60-70% lower than enterprise RPA for comparable simple automation use cases.",
  },

  "rpa/kryon": {
    pricingModel: "consumption",
    transparency: "contact-sales",
    typicalACV: "$50K–$300K",
    marketSegment: ["enterprise"],
    deploymentModel: ["saas", "on-prem"],
    freeTrialOrTier: false,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Process Discovery recording requires endpoint agent licensing per device",
      "NICE CXone subscription prerequisite for attended contact centre use cases",
      "Premium tier required for full analytics and process optimisation features",
    ],
    bottomLine: "Premium cost justified for NICE CXone customers automating contact centre workflows — poor value as standalone RPA without CXone context.",
  },

  "rpa/workato": {
    pricingModel: "consumption",
    transparency: "limited-public",
    startingPrice: "$10K/year",
    typicalACV: "$30K–$250K",
    marketSegment: ["mid-market", "enterprise"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Recipe tasks priced on consumption model; complex recipes consume more tasks",
      "Workato Team and Business plans include connection and recipe limits",
      "Premium connectors for ERPs and specialist tools priced as add-ons",
    ],
    bottomLine: "Best value enterprise iPaaS for business-owned automation — higher than Zapier but significantly lower TCO than MuleSoft for comparable non-developer use cases.",
  },

  "rpa/boomi": {
    pricingModel: "consumption",
    transparency: "limited-public",
    startingPrice: "$550/month (Professional)",
    typicalACV: "$25K–$200K",
    marketSegment: ["mid-market", "enterprise"],
    deploymentModel: ["saas", "hybrid"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Connection count drives cost — each integrated application counts against limits",
      "Atom Cloud (Boomi-hosted runtime) vs customer-hosted Atom has different pricing",
      "EDI and B2B trading partner features in higher tiers",
    ],
    bottomLine: "Mid-range iPaaS pricing with strong EDI and legacy system value — 40-50% lower TCO than MuleSoft for organisations not needing Anypoint Platform depth.",
  },

  "rpa/mulesoft": {
    pricingModel: "consumption",
    transparency: "contact-sales",
    typicalACV: "$150K–$2M",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas", "on-prem", "hybrid"],
    freeTrialOrTier: true,
    tcoBadge: "very-high",
    keyPricingDrivers: [
      "vCores (processing capacity) drive runtime cost — scales with message throughput",
      "Anypoint Platform subscription plus CloudHub runtime plus premium connectors",
      "Professional services for complex implementations regularly exceed licence cost",
    ],
    bottomLine: "Highest TCO in iPaaS — justified only for global enterprises requiring API governance, reusable asset catalogues, and Salesforce ecosystem depth.",
  },

  "rpa/tray-ai": {
    pricingModel: "consumption",
    transparency: "contact-sales",
    typicalACV: "$30K–$200K",
    marketSegment: ["mid-market", "enterprise"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Operation count (workflow step executions) drives consumption-based pricing",
      "AI model call steps billed separately from standard workflow operations",
      "Premium connectors for enterprise ERP systems priced as add-ons",
    ],
    bottomLine: "Competitive mid-market pricing with AI-native differentiation — best value for organisations adopting agentic automation patterns from the ground up.",
  },

  "rpa/make": {
    pricingModel: "consumption",
    transparency: "public-list",
    startingPrice: "$0 (free: 1,000 ops/month)",
    typicalACV: "$2K–$50K",
    marketSegment: ["smb", "mid-market"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Operations (individual module executions) consumed per workflow run",
      "Data transfer volume billed separately above free tier allowance",
      "Enterprise SSO and advanced permissions require top Business tier",
    ],
    bottomLine: "Most cost-effective automation for complex no-code workflows — 3-5x cheaper than Workato for comparable operations with better logic capabilities than Zapier.",
  },

  "rpa/zapier": {
    pricingModel: "consumption",
    transparency: "public-list",
    startingPrice: "$0 (free: 100 tasks/month)",
    typicalACV: "$1K–$25K",
    marketSegment: ["smb", "mid-market"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Task count (each Zap step that runs) drives pricing — multi-step Zaps multiply cost",
      "Premium app connectors limited to paid tiers",
      "Team and Company plans required for multi-user governance and sharing",
    ],
    bottomLine: "Most accessible automation entry point — free tier provides real value; costs escalate at scale making Workato or Make better value for high-volume enterprise use.",
  },



  /* ══════════════════════════════════════════════════════════════════════════
     AgentOps — Tier 1 Expansion: Leaders & Challengers
  ══════════════════════════════════════════════════════════════════════════ */

  "agentops/bmc-helixgpt": {
    pricingModel: "module-based",
    transparency: "contact-sales",
    typicalACV: "$40K–$300K",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas"],
    freeTrialOrTier: false,
    tcoBadge: "high",
    keyPricingDrivers: [
      "HelixGPT licensed as add-on module to BMC Helix ITSM subscription",
      "Change volume and incident volume affect AI processing consumption",
      "Professional services required for AI model tuning and knowledge base preparation",
    ],
    bottomLine: "Justified only for BMC Helix customers — adds AI change risk intelligence without new tooling; poor value as a standalone AI purchase.",
  },

  "agentops/salesforce-agentforce": {
    pricingModel: "consumption",
    transparency: "limited-public",
    startingPrice: "$2/conversation (Agentforce Service Agent)",
    typicalACV: "$50K–$500K",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas"],
    freeTrialOrTier: false,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Per-conversation pricing; complex agentic interactions trigger more AI actions",
      "Data Cloud subscription required for memory and context grounding",
      "Einstein platform add-on on top of existing Salesforce contracts",
    ],
    bottomLine: "Premium per-conversation model adds up quickly — justified for Salesforce-centric organisations where agent actions directly reduce human service cost.",
  },

  "agentops/google-vertex-ai-agents": {
    pricingModel: "consumption",
    transparency: "public-list",
    typicalACV: "$30K–$500K",
    marketSegment: ["mid-market", "enterprise", "fortune500"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Gemini model token pricing plus grounding query charges for Google Search",
      "Vertex AI infrastructure runtime costs separate from model API calls",
      "Agent Builder orchestration and storage add to baseline model cost",
    ],
    bottomLine: "Cost-competitive entry for GCP-native organisations — total cost grows significantly with Google Search grounding queries at scale.",
  },

  "agentops/aisera": {
    pricingModel: "per-seat",
    transparency: "contact-sales",
    typicalACV: "$50K–$400K",
    marketSegment: ["mid-market", "enterprise"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Per active user seat plus conversation volume tier",
      "Multi-domain licensing (IT + HR + finance) priced separately per domain",
      "Knowledge graph population and integration setup requires professional services",
    ],
    bottomLine: "Premium pricing for pre-trained domain AI — justified by higher out-of-the-box resolution rates reducing human agent costs faster than general-purpose LLM alternatives.",
  },

  "agentops/amelia": {
    pricingModel: "enterprise-license",
    transparency: "contact-sales",
    typicalACV: "$100K–$800K",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas", "on-prem"],
    freeTrialOrTier: false,
    tcoBadge: "very-high",
    keyPricingDrivers: [
      "Enterprise platform licence plus conversation volume tiers",
      "Significant professional services required for implementation and tuning",
      "Voice channel activation requires additional licensing",
    ],
    bottomLine: "High TCO justified only for regulated enterprises needing compliance-aware AI — general-purpose conversational needs better served by Aisera or Moveworks at lower cost.",
  },

  "agentops/uniphore": {
    pricingModel: "per-seat",
    transparency: "contact-sales",
    typicalACV: "$60K–$400K",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas", "on-prem"],
    freeTrialOrTier: false,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Per-seat licensing for agent assistant features; per-minute for voice analytics",
      "Meeting intelligence platform priced separately from contact centre AI",
      "Real-time features require lower latency cloud infrastructure at premium tier",
    ],
    bottomLine: "Premium pricing for multimodal CX AI — strong ROI proof when measured against after-call work reduction and compliance monitoring cost savings.",
  },

  "agentops/cognigy": {
    pricingModel: "consumption",
    transparency: "contact-sales",
    typicalACV: "$100K–$600K",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas", "on-prem"],
    freeTrialOrTier: false,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Per-conversation or per-session licensing based on interaction volume",
      "Voice AI channel licensing priced separately from digital chat",
      "Agent Copilot seats for human-assisted interactions add to base platform cost",
    ],
    bottomLine: "High but proven ROI for large contact centres — automation rate improvements justify cost within 6-12 months for 1M+ interaction environments.",
  },

  "agentops/intercom-fin-ai": {
    pricingModel: "consumption",
    transparency: "public-list",
    startingPrice: "$0.99/resolution (Fin AI)",
    typicalACV: "$10K–$150K",
    marketSegment: ["smb", "mid-market", "enterprise"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Per-resolution pricing for Fin AI autonomous handling",
      "Intercom base platform subscription required alongside Fin add-on",
      "Conversation volume peaks in seasonal businesses can spike cost",
    ],
    bottomLine: "Transparent per-resolution model makes ROI calculation straightforward — typically cheaper than human agent cost when resolution rate exceeds 40%.",
  },

  "agentops/glean": {
    pricingModel: "per-seat",
    transparency: "contact-sales",
    typicalACV: "$100K–$1M",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas"],
    freeTrialOrTier: false,
    tcoBadge: "very-high",
    keyPricingDrivers: [
      "Per active user pricing at enterprise rates",
      "Connector count and knowledge graph size affect platform tier",
      "Premium enterprise features (advanced analytics, custom models) in top tier",
    ],
    bottomLine: "Highest per-seat pricing in enterprise search — justified at large scale where knowledge worker productivity gains and ITSM deflection offset significant licence cost.",
  },



  "secops/elastic-security": {
    pricingModel: "consumption",
    transparency: "limited-public",
    startingPrice: "$95/month for 1 GB/day on Elastic Cloud",
    typicalACV: "$50K–$500K",
    marketSegment: ["mid-market", "enterprise", "fortune500"],
    deploymentModel: ["saas", "on-prem", "hybrid"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Data ingestion volume (GB/day or compute units)",
      "Retention duration for searchable vs. archived data tiers",
      "Elastic Cloud managed vs. self-managed infrastructure cost",
    ],
    bottomLine: "Elastic's consumption model is cost-competitive for cloud-native deployments but infrastructure management costs in self-hosted environments can rival legacy SIEM TCO.",
  },
  "secops/wiz": {
    pricingModel: "consumption",
    transparency: "contact-sales",
    typicalACV: "$200K–$2M+",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Cloud resource count (virtual machines, containers, serverless functions)",
      "Cloud spend or workload volume across AWS, Azure, GCP",
      "Module add-ons: DSPM, Code Security, CIEM above base CSPM",
    ],
    bottomLine: "Wiz commands a significant premium vs. point-solution CSPMs, justified by consolidated CNAPP coverage — but cost can be shocking for large cloud footprints.",
  },
  "secops/rapid7-insightidr": {
    pricingModel: "per-seat",
    transparency: "limited-public",
    startingPrice: "$5.77/asset/month for InsightIDR",
    typicalACV: "$50K–$300K",
    marketSegment: ["mid-market", "enterprise"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Asset count (servers, endpoints, cloud workloads monitored)",
      "InsightVM (vulnerability management) add-on licensing",
      "MDR managed services overlay pricing per asset",
    ],
    bottomLine: "Rapid7's per-asset pricing is predictable and mid-market friendly — the combined InsightIDR + MDR bundle delivers strong value vs. assembling separate SIEM, UEBA, and managed service contracts.",
  },
  "secops/fortinet-fortisiem": {
    pricingModel: "enterprise-license",
    transparency: "contact-sales",
    typicalACV: "$40K–$300K",
    marketSegment: ["mid-market", "enterprise"],
    deploymentModel: ["saas", "on-prem", "hybrid"],
    freeTrialOrTier: false,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Events per second (EPS) volume for on-premises licensing",
      "Number of managed devices in the CMDB",
      "Multi-tenant node count for MSSP deployments",
    ],
    bottomLine: "FortiSIEM offers 40–60% lower licensing cost than Splunk or IBM QRadar for comparable event volumes, making it attractive in Fortinet-centric environments but requiring careful TCO analysis in multi-vendor stacks.",
  },
  "secops/arcsight": {
    pricingModel: "enterprise-license",
    transparency: "contact-sales",
    typicalACV: "$200K–$2M+",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["on-prem", "saas", "hybrid"],
    freeTrialOrTier: false,
    tcoBadge: "very-high",
    keyPricingDrivers: [
      "Events per second (EPS) licensing tier for on-premises ESM",
      "ArcSight Intelligence (UEBA) add-on licensing per user",
      "Support and professional services as percentage of license",
    ],
    bottomLine: "ArcSight carries very-high TCO driven by legacy on-premises infrastructure, professional services, and analyst talent requirements — justified only by compliance depth and existing deployment inertia.",
  },
  "secops/rsa-netwitness": {
    pricingModel: "enterprise-license",
    transparency: "contact-sales",
    typicalACV: "$300K–$3M+",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["on-prem", "hybrid"],
    freeTrialOrTier: false,
    tcoBadge: "very-high",
    keyPricingDrivers: [
      "Packet capture storage volume and retention period",
      "Events per second (EPS) ingestion tier",
      "Professional services for deployment and integration engineering",
    ],
    bottomLine: "RSA NetWitness is among the most expensive SIEM+NDR platforms with very-high infrastructure and staffing TCO — the forensic-grade packet capture capability is the only justification at this price point.",
  },
  "secops/levelblue": {
    pricingModel: "per-seat",
    transparency: "limited-public",
    startingPrice: "$1,075/month for USM Anywhere Essentials",
    typicalACV: "$13K–$75K",
    marketSegment: ["smb", "mid-market"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Assets monitored (servers, endpoints, network devices)",
      "Log events per second (EPS) tier selected",
      "Add-on modules: vulnerability scanning, compliance reporting",
    ],
    bottomLine: "LevelBlue USM Anywhere (formerly AT&T AlienVault) is one of the most affordable all-in-one SIEM+IDS+VM platforms for mid-market — the Essentials tier provides strong value at a price point accessible for 100–500 employee organizations.",
  },
  "secops/sumo-logic": {
    pricingModel: "consumption",
    transparency: "limited-public",
    startingPrice: "$108/month for Cloud Flex Credits",
    typicalACV: "$50K–$400K",
    marketSegment: ["mid-market", "enterprise"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Cloud Flex Credits consumed based on data ingestion and query volume",
      "Cloud SOAR automation playbook execution volume",
      "Tiered retention: hot vs. infrequent vs. archive data pricing",
    ],
    bottomLine: "Sumo Logic's transparent consumption model is cost-predictable at moderate log volumes but can escalate significantly for high-throughput environments — value is highest when SIEM and SOAR modules are used together.",
  },
  "secops/swimlane": {
    pricingModel: "platform-license",
    transparency: "contact-sales",
    typicalACV: "$100K–$500K",
    marketSegment: ["enterprise", "mid-market"],
    deploymentModel: ["saas", "on-prem", "hybrid"],
    freeTrialOrTier: false,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Number of automation actions or playbook executions per month",
      "User seats for analyst access to case management",
      "Turbine compute tier for high-volume event processing",
    ],
    bottomLine: "Swimlane's platform license is higher than bundled SIEM-embedded SOAR but significantly lower TCO than Splunk SOAR or Palo Alto XSOAR for organizations needing vendor-agnostic orchestration.",
  },
  "secops/cybereason": {
    pricingModel: "per-seat",
    transparency: "contact-sales",
    typicalACV: "$50K–$500K",
    marketSegment: ["mid-market", "enterprise"],
    deploymentModel: ["saas", "on-prem"],
    freeTrialOrTier: false,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Endpoint count (agents deployed across servers and workstations)",
      "XDR module add-ons beyond endpoint protection",
      "MDR service overlay pricing per endpoint",
    ],
    bottomLine: "Cybereason's per-endpoint pricing is competitive with mid-tier XDR vendors, but financial uncertainty has prompted buyers to negotiate harder at renewal — creating atypical pricing variability.",
  },
  "secops/arctic-wolf": {
    pricingModel: "platform-license",
    transparency: "contact-sales",
    typicalACV: "$50K–$300K",
    marketSegment: ["smb", "mid-market"],
    deploymentModel: ["saas"],
    freeTrialOrTier: false,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Asset count (endpoints, servers, cloud resources monitored)",
      "Service tier: MDR vs. MDR + Managed Risk vs. full platform",
      "Security Operations Warranty coverage level",
    ],
    bottomLine: "Arctic Wolf's all-inclusive MDR pricing is higher than self-managed SIEM but eliminates analyst headcount cost — making TCO favorable for organizations that would otherwise need 2–4 new security hires.",
  },
  "secops/expel": {
    pricingModel: "platform-license",
    transparency: "contact-sales",
    typicalACV: "$75K–$400K",
    marketSegment: ["mid-market", "enterprise"],
    deploymentModel: ["saas"],
    freeTrialOrTier: false,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Asset count (endpoints, cloud, network, SaaS sources monitored)",
      "Service tier: MDR vs. MDR + Phishing vs. full platform",
      "Integration complexity and number of technology connectors",
    ],
    bottomLine: "Expel's premium MDR pricing is justified by its transparency model and automation depth — buyers who value operational visibility and want to build internal capability over time get strong long-term ROI.",
  },
  "secops/deepwatch": {
    pricingModel: "platform-license",
    transparency: "contact-sales",
    typicalACV: "$100K–$600K",
    marketSegment: ["enterprise", "mid-market"],
    deploymentModel: ["saas"],
    freeTrialOrTier: false,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Splunk license volume (GB/day ingestion) included in managed service",
      "Squad service tier: essential vs. advanced vs. elite",
      "Add-on: Managed Vulnerability Management module pricing",
    ],
    bottomLine: "Deepwatch bundles Splunk licensing and management into MDR pricing — creating high ACV but strong TCO for organizations that would otherwise pay separate Splunk enterprise license plus managed service fees.",
  },
  "secops/hunters-ai": {
    pricingModel: "consumption",
    transparency: "contact-sales",
    typicalACV: "$100K–$500K",
    marketSegment: ["enterprise", "mid-market"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Data ingestion volume (events/day or GB/day to the security data lake)",
      "Query compute credits for hot-tier analytics",
      "Snowflake compute costs if using Hunters-on-Snowflake architecture",
    ],
    bottomLine: "Hunters.ai's consumption model eliminates per-EPS tax of legacy SIEM — cost scales predictably with data volume and the unlimited ingestion model avoids the log source prioritization trade-offs.",
  },
  "secops/anvilogic": {
    pricingModel: "platform-license",
    transparency: "contact-sales",
    typicalACV: "$75K–$400K",
    marketSegment: ["enterprise", "mid-market"],
    deploymentModel: ["saas"],
    freeTrialOrTier: false,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Number of data platform targets (Splunk, Snowflake, Databricks instances)",
      "Detection library tier: standard vs. advanced Armory access",
      "User seats for SOC analyst access",
    ],
    bottomLine: "Anvilogic's platform license is additive to existing SIEM cost but justifiable as migration insurance — enabling SIEM modernization without rewriting detections, which avoids multi-million dollar migration risk.",
  },
  "secops/stellar-cyber": {
    pricingModel: "platform-license",
    transparency: "contact-sales",
    typicalACV: "$50K–$400K",
    marketSegment: ["mid-market", "enterprise"],
    deploymentModel: ["saas", "on-prem", "hybrid"],
    freeTrialOrTier: false,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Asset count (endpoints, servers, cloud workloads, network devices)",
      "Data ingestion volume across all connected security tools",
      "MSSP multi-tenant node count for managed service providers",
    ],
    bottomLine: "Stellar Cyber's converged Open XDR pricing replaces 4–6 separate point solution licenses — total platform cost is higher than any single tool but significantly lower than the combined licensing of SIEM + NDR + UEBA + SOAR.",
  },



  "aiops/honeycomb": {
    pricingModel: "consumption",
    transparency: "public-list",
    startingPrice: "$100/month for 20M events/month",
    typicalACV: "$25K–$200K",
    marketSegment: ["mid-market", "enterprise"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Events per month ingested into the high-cardinality store",
      "Data retention duration — 60-day vs. 90-day vs. 1-year tiers",
      "Team seat count for collaborative investigation access",
    ],
    bottomLine: "Honeycomb's event-volume pricing is transparent and scales predictably — cost is significantly lower than Datadog for equivalent engineering productivity when teams instrument thoughtfully.",
  },
  "aiops/nexthink": {
    pricingModel: "per-seat",
    transparency: "contact-sales",
    typicalACV: "$200K–$1.5M",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas"],
    freeTrialOrTier: false,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Managed endpoint count (devices with Nexthink collector deployed)",
      "Module add-ons: Adopt, Engage, Act beyond base Experience module",
      "Professional services for initial DEX program rollout and baselining",
    ],
    bottomLine: "Nexthink commands a significant per-endpoint premium vs. basic monitoring tools — justified by documented help desk ticket reduction and DEX productivity improvement at large enterprise scale.",
  },
  "aiops/sciencelogic": {
    pricingModel: "per-seat",
    transparency: "contact-sales",
    typicalACV: "$100K–$600K",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas", "on-prem", "hybrid"],
    freeTrialOrTier: false,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Monitored device count across network, server, storage, and cloud resources",
      "Data collector node count for distributed enterprise and MSP deployments",
      "Professional services for topology discovery and initial AIOps configuration",
    ],
    bottomLine: "ScienceLogic's per-device pricing is competitive for large hybrid infrastructure estates — value is highest for organizations with complex topology where event correlation delivers measurable NOC cost reduction.",
  },
  "aiops/chronosphere": {
    pricingModel: "consumption",
    transparency: "contact-sales",
    typicalACV: "$100K–$600K",
    marketSegment: ["enterprise", "mid-market"],
    deploymentModel: ["saas"],
    freeTrialOrTier: false,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Metrics series stored (active time series count)",
      "Trace and log volume ingested through the control plane",
      "Data retention duration across hot, warm, and cold tiers",
    ],
    bottomLine: "Chronosphere's consumption model is additive to existing observability spend but pays back within months for large-scale Datadog customers through measurable 30–60% telemetry cost reduction.",
  },
  "aiops/kentik": {
    pricingModel: "consumption",
    transparency: "contact-sales",
    typicalACV: "$100K–$800K",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Flow volume (flows per second ingested from routers and network devices)",
      "Synthetic test frequency and number of vantage point locations",
      "BGP monitoring node count for routing intelligence features",
    ],
    bottomLine: "Kentik commands a premium for its internet-scale network analytics — cost is high but justified for ISPs, large enterprise network teams, and organizations where network performance directly impacts revenue.",
  },
  "aiops/observe-inc": {
    pricingModel: "consumption",
    transparency: "contact-sales",
    typicalACV: "$75K–$400K",
    marketSegment: ["enterprise", "mid-market"],
    deploymentModel: ["saas"],
    freeTrialOrTier: false,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Snowflake compute credits consumed by Observe queries",
      "Telemetry data volume stored in Snowflake under the Observe data model",
      "OPAL pipeline complexity and processing compute usage",
    ],
    bottomLine: "Observe's cost is additive to existing Snowflake contracts — the Snowflake economics make long-term retention significantly cheaper than dedicated observability stores, delivering strong ROI for high-retention use cases.",
  },
  "aiops/opsramp": {
    pricingModel: "per-seat",
    transparency: "contact-sales",
    typicalACV: "$100K–$600K",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas", "on-prem", "hybrid"],
    freeTrialOrTier: false,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Managed resource count (servers, VMs, cloud instances, network devices)",
      "Module add-ons: CMDB, service mapping, automation beyond base monitoring",
      "Multi-tenant node count for MSP deployments",
    ],
    bottomLine: "OpsRamp's per-resource pricing is competitive for HPE-heavy environments where hardware telemetry integration delivers monitoring ROI not available from cloud-native competitors.",
  },
  "aiops/turbonomic": {
    pricingModel: "consumption",
    transparency: "contact-sales",
    typicalACV: "$150K–$1M",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas", "on-prem", "hybrid"],
    freeTrialOrTier: false,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Managed virtual machine and container count across all clouds and on-premises",
      "Cloud spend volume under management for FinOps optimization",
      "IBM Cloud Pak for Watson AIOps integration licensing",
    ],
    bottomLine: "Turbonomic's high ACV is directly offset by documented cloud cost savings — customer ROI cases consistently show 3–6x return on investment through workload right-sizing and automation within 12 months.",
  },
  "aiops/catchpoint": {
    pricingModel: "consumption",
    transparency: "contact-sales",
    typicalACV: "$50K–$400K",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Test frequency × number of vantage points (test credits consumed)",
      "BGP monitoring node count for routing intelligence",
      "API transaction volume for third-party API performance monitoring",
    ],
    bottomLine: "Catchpoint's consumption model scales with monitoring coverage — higher test frequency and broader vantage point selection drives cost, but the internet performance visibility justifies premium for revenue-critical digital businesses.",
  },
  "aiops/netscout": {
    pricingModel: "enterprise-license",
    transparency: "contact-sales",
    typicalACV: "$200K–$2M",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["on-prem", "hybrid"],
    freeTrialOrTier: false,
    tcoBadge: "very-high",
    keyPricingDrivers: [
      "Monitoring probe hardware and software license count",
      "Traffic volume (Gbps) instrumented across network segments",
      "DDoS protection (Arbor) add-on licensing tier",
    ],
    bottomLine: "NETSCOUT commands very-high TCO driven by hardware probe infrastructure and professional services — justified only for large enterprise and service provider environments where packet-level visibility is operationally essential.",
  },



  "itom/zendesk": {
    pricingModel: "per-seat",
    transparency: "public-list",
    startingPrice: "$55/agent/month for Suite Team",
    typicalACV: "$25K–$300K",
    marketSegment: ["smb", "mid-market", "enterprise"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Agent seat count at the selected Suite tier (Team, Growth, Professional, Enterprise)",
      "AI Agents automation add-on for autonomous resolution capabilities",
      "Advanced AI package for predictive analytics and intelligent triage",
    ],
    bottomLine: "Zendesk's per-agent pricing is straightforward but AI add-ons can double the effective cost — strong value at mid-market scale where the polished UX reduces training overhead and improves agent efficiency.",
  },
  "itom/connectwise": {
    pricingModel: "per-seat",
    transparency: "contact-sales",
    typicalACV: "$15K–$150K",
    marketSegment: ["smb", "mid-market"],
    deploymentModel: ["saas", "on-prem"],
    freeTrialOrTier: false,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Technician seat count across PSA, Automate RMM, and Manage modules",
      "Managed endpoint count for ConnectWise Automate RMM licensing",
      "Security module add-ons: EDR, MDR, Fortify beyond base PSA+RMM",
    ],
    bottomLine: "ConnectWise total platform cost is significant but delivers strong MSP economics when PSA + RMM + security modules replace separate vendor contracts — professional services implementation cost must be factored into total investment.",
  },
  "itom/ninjarmm": {
    pricingModel: "per-seat",
    transparency: "limited-public",
    startingPrice: "$3/device/month",
    typicalACV: "$5K–$75K",
    marketSegment: ["smb", "mid-market"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Managed endpoint count (Windows, Mac, Linux devices monitored)",
      "Data backup storage volume for NinjaOne Data Protection add-on",
      "Remote access session volume beyond included limits",
    ],
    bottomLine: "NinjaRMM delivers excellent per-device economics — among the most cost-effective modern RMM platforms with transparent pricing that scales predictably with managed endpoint growth.",
  },
  "itom/kaseya-vsa": {
    pricingModel: "per-seat",
    transparency: "contact-sales",
    typicalACV: "$10K–$100K",
    marketSegment: ["smb", "mid-market"],
    deploymentModel: ["saas", "on-prem"],
    freeTrialOrTier: false,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Managed endpoint count across VSA RMM licensing tiers",
      "Kaseya 365 bundle tier covering RMM, BDR, EDR, and PSA modules",
      "Additional Kaseya IT Complete product add-ons beyond base RMM",
    ],
    bottomLine: "Kaseya VSA's cost-per-endpoint is competitive but the Kaseya 365 bundle model can create pricing complexity — best evaluated as a complete IT Complete stack investment rather than standalone RMM comparison.",
  },
  "itom/teamdynamix": {
    pricingModel: "per-seat",
    transparency: "contact-sales",
    typicalACV: "$30K–$200K",
    marketSegment: ["mid-market", "enterprise"],
    deploymentModel: ["saas"],
    freeTrialOrTier: false,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Named technician seat count for ITSM agent licensing",
      "PPM project management module add-on for portfolio management capabilities",
      "Number of departments in ESM expansion beyond IT service desk",
    ],
    bottomLine: "TeamDynamix pricing is competitive for higher education and public sector where the vertical-specific templates and no-code administration reduce implementation costs vs. ServiceNow-level alternatives.",
  },
  "itom/jira-service-management": {
    pricingModel: "per-seat",
    transparency: "public-list",
    startingPrice: "$21/agent/month for Standard tier",
    typicalACV: "$15K–$200K",
    marketSegment: ["mid-market", "enterprise"],
    deploymentModel: ["saas", "on-prem"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Agent seat count at Standard, Premium, or Enterprise tier",
      "Atlassian Intelligence AI usage included in Premium and above",
      "Data Center self-hosted licensing for regulated industries requiring on-premises deployment",
    ],
    bottomLine: "Jira Service Management's per-agent pricing is among the most competitive in the enterprise ITSM category — the Premium tier's AI features and unlimited storage deliver strong value for Atlassian-native organizations.",
  },
  "itom/spiceworks": {
    pricingModel: "freemium",
    transparency: "public-list",
    startingPrice: "Free",
    marketSegment: ["smb"],
    deploymentModel: ["saas", "on-prem"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Ad impressions and data sharing with vendor advertisers (the actual cost model)",
      "No licensing cost — unlimited agents, tickets, and devices in the free tier",
      "Optional Spiceworks Cloud-hosted version vs. self-hosted desktop deployment",
    ],
    bottomLine: "Spiceworks is free in exchange for advertising exposure and aggregate IT data insights — the lowest possible TCO for basic ITSM, but the advertising model and feature ceiling create a natural upgrade trigger as organizations grow.",
  },
  "itom/haloitsm": {
    pricingModel: "platform-license",
    transparency: "limited-public",
    startingPrice: "£75/agent/month — unlimited agents available",
    typicalACV: "$15K–$150K",
    marketSegment: ["mid-market", "enterprise"],
    deploymentModel: ["saas", "on-prem"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Agent seat count (or flat unlimited license for full team access)",
      "HaloITSM vs. HaloPSA module selection",
      "On-premises vs. cloud deployment model",
    ],
    bottomLine: "HaloITSM's unlimited agent model is the most compelling pricing in the enterprise ITSM market — organizations replacing per-seat ServiceNow or Freshservice see 50–70% license cost reduction for equivalent ITIL functionality.",
  },
  "itom/invgate-service-desk": {
    pricingModel: "per-seat",
    transparency: "contact-sales",
    typicalACV: "$15K–$100K",
    marketSegment: ["mid-market", "enterprise"],
    deploymentModel: ["saas", "on-prem"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Agent seat count for ITSM access",
      "InvGate Assets add-on for asset management and CMDB capabilities",
      "On-premises vs. cloud hosting model",
    ],
    bottomLine: "InvGate positions as premium-capable ITSM at mid-market pricing — strong value for LATAM and EMEA organizations seeking enterprise ITIL depth without ServiceNow cost and complexity.",
  },
  "itom/zoho-desk": {
    pricingModel: "per-seat",
    transparency: "public-list",
    startingPrice: "$14/agent/month for Standard",
    typicalACV: "$5K–$75K",
    marketSegment: ["smb", "mid-market"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Agent seat count at Standard, Professional, or Enterprise tier",
      "Zoho One bundle pricing for organizations using multiple Zoho applications",
      "Zia AI feature tier access at Professional and above",
    ],
    bottomLine: "Zoho Desk delivers the strongest price-to-feature ratio in the category — best value for Zoho One customers who get deep suite integration, and compelling standalone for cost-conscious SMB and mid-market IT teams.",
  },



  "rpa/abbyy": {
    pricingModel: "consumption",
    transparency: "contact-sales",
    typicalACV: "$50K–$500K",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas", "on-prem", "hybrid"],
    freeTrialOrTier: true,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Transaction volume (pages or documents processed per month)",
      "Document skill complexity and custom model training",
      "Deployment model: cloud vs. on-premises server licensing",
    ],
    bottomLine: "ABBYY's premium pricing is justified for mission-critical document workflows where accuracy directly impacts financial or regulatory outcomes — hard to justify for simple document types where commodity OCR is sufficient.",
  },
  "rpa/hyperscience": {
    pricingModel: "consumption",
    transparency: "contact-sales",
    typicalACV: "$150K–$1M",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas", "on-prem", "hybrid"],
    freeTrialOrTier: false,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Document volume (pages processed per month across all document types)",
      "Automation rate threshold SLA commitment",
      "Professional services for initial model training and deployment",
    ],
    bottomLine: "Hyperscience commands an enterprise premium justified by its continuous learning model and proven high-volume accuracy — best evaluated as a total automation program investment rather than per-page unit cost comparison.",
  },
  "rpa/nanonets": {
    pricingModel: "consumption",
    transparency: "public-list",
    startingPrice: "$499/month for up to 5,000 pages",
    typicalACV: "$6K–$60K",
    marketSegment: ["smb", "mid-market"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Pages processed per month across all document models",
      "Number of custom document models created",
      "API call volume for real-time extraction integrations",
    ],
    bottomLine: "Nanonets' transparent per-page pricing makes IDP accessible for mid-market organizations — the free trial and quick model training reduce evaluation risk vs. enterprise IDP platforms with multi-month POC requirements.",
  },
  "rpa/instabase": {
    pricingModel: "enterprise-license",
    transparency: "contact-sales",
    typicalACV: "$200K–$1.5M",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas", "on-prem"],
    freeTrialOrTier: false,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Document processing volume and workflow complexity",
      "AI Hub application development seats for builders",
      "Professional services for financial services-specific model configuration",
    ],
    bottomLine: "Instabase targets large financial services deals where the accuracy and compliance requirements justify premium pricing — ROI is measured in regulatory risk reduction and manual review headcount savings.",
  },
  "rpa/rossum": {
    pricingModel: "consumption",
    transparency: "contact-sales",
    startingPrice: "From $2,000/month",
    typicalACV: "$25K–$200K",
    marketSegment: ["mid-market", "enterprise"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Document volume (invoices and transactional documents processed per month)",
      "Number of document queues and workflow configurations",
      "ERP integration complexity for AP and procurement system connections",
    ],
    bottomLine: "Rossum's consumption pricing is competitive for AP automation with transparent per-document economics — strong ROI for organizations processing 1,000+ invoices per month where manual processing cost clearly exceeds platform investment.",
  },
  "rpa/signavio": {
    pricingModel: "enterprise-license",
    transparency: "contact-sales",
    typicalACV: "$100K–$800K",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Process mining data volume (SAP transaction events processed)",
      "Collaboration user seats for process modeling access",
      "Module selection: process mining vs. journey management vs. workflow",
    ],
    bottomLine: "SAP Signavio pricing reflects enterprise platform value — justified for S/4HANA transformation programs where process intelligence directly informs migration scope and automation prioritization decisions.",
  },
  "rpa/laiye": {
    pricingModel: "per-seat",
    transparency: "contact-sales",
    typicalACV: "$30K–$300K",
    marketSegment: ["enterprise", "mid-market"],
    deploymentModel: ["saas", "on-prem"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Bot license count for RPA automation execution",
      "IDP document processing volume add-on",
      "Conversational AI platform tier for chatbot automation",
    ],
    bottomLine: "Laiye offers 30–50% lower licensing cost than UiPath or Automation Anywhere for comparable bot and IDP capabilities — strongest value for APAC-headquartered enterprises and cost-sensitive organizations seeking automation platform alternatives.",
  },
  "rpa/processmaker": {
    pricingModel: "platform-license",
    transparency: "limited-public",
    startingPrice: "Open-source Community edition free; Enterprise from $1,495/month",
    typicalACV: "$18K–$120K",
    marketSegment: ["mid-market", "enterprise"],
    deploymentModel: ["saas", "on-prem", "hybrid"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Process and task execution volume per month",
      "API connector count and integration complexity",
      "User seats for business-user task participation",
    ],
    bottomLine: "ProcessMaker's open-source edition reduces evaluation risk to zero — the commercial platform pricing is competitive vs. enterprise BPM vendors and delivers strong value for API-embedded workflow automation use cases.",
  },
  "rpa/coupa-software": {
    pricingModel: "platform-license",
    transparency: "contact-sales",
    typicalACV: "$200K–$2M",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas"],
    freeTrialOrTier: false,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Spend under management volume and BSM module selection",
      "User seat count across procurement, AP, and T&E modules",
      "Professional services for ERP integration and configuration",
    ],
    bottomLine: "Coupa BSM platform investment is significant but TCO is favorable vs. assembling separate procurement, AP, and T&E systems — ROI is demonstrated through Community.ai-benchmarked savings and manual processing cost elimination.",
  },



  "agentops/writer": {
    pricingModel: "platform-license",
    transparency: "contact-sales",
    startingPrice: "$18/user/month for Team",
    typicalACV: "$50K–$500K",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "User seat count at Team vs. Enterprise tier",
      "Knowledge Graph index size and document ingestion volume",
      "AI app usage volume beyond base platform access",
    ],
    bottomLine: "Writer's platform pricing is justified for organizations where brand consistency and compliance accuracy have direct business value — particularly regulated industries where AI hallucination costs exceed Writer licensing by orders of magnitude.",
  },
  "agentops/forethought": {
    pricingModel: "consumption",
    transparency: "contact-sales",
    typicalACV: "$50K–$300K",
    marketSegment: ["mid-market", "enterprise"],
    deploymentModel: ["saas"],
    freeTrialOrTier: false,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Conversation volume processed per month across all AI modules",
      "Module selection: Solve (autonomous), Triage (routing), Assist (copilot) packages",
      "Deflection rate SLA commitment and performance guarantee tier",
    ],
    bottomLine: "Forethought ROI is directly calculable from deflection rate × average handle time × agent cost — buyers can model payback in a spreadsheet before signing, making the investment decision straightforward.",
  },
  "agentops/assembled": {
    pricingModel: "per-seat",
    transparency: "contact-sales",
    typicalACV: "$30K–$150K",
    marketSegment: ["mid-market", "enterprise"],
    deploymentModel: ["saas"],
    freeTrialOrTier: false,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Agent seat count in the workforce being managed",
      "Channel count (email, chat, phone, social queues) included in the plan",
      "Integration complexity with CCaaS and ITSM platforms",
    ],
    bottomLine: "Assembled pricing is per-managed-agent and competitive with Genesys or NICE WFM for mid-market contact centers — ROI is demonstrated through overstaffing reduction and SLA improvement metrics.",
  },
  "agentops/crewai": {
    pricingModel: "freemium",
    transparency: "limited-public",
    startingPrice: "Open-source free; Enterprise pricing on request",
    typicalACV: "$50K–$300K",
    marketSegment: ["enterprise", "mid-market"],
    deploymentModel: ["saas", "on-prem"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Agent execution credits for managed cloud deployment",
      "Monitoring and observability platform access for production agent oversight",
      "Enterprise support SLA tier",
    ],
    bottomLine: "CrewAI's open-source tier enables zero-risk evaluation before Enterprise commitment — total cost includes significant engineering investment for production deployment beyond licensing fees.",
  },
  "agentops/botpress": {
    pricingModel: "freemium",
    transparency: "limited-public",
    startingPrice: "Community free; Team from $495/month",
    typicalACV: "$6K–$100K",
    marketSegment: ["mid-market", "enterprise"],
    deploymentModel: ["saas", "on-prem"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Monthly active users (MAU) interacting with deployed bots",
      "AI credits consumed for LLM API calls within the platform",
      "Self-hosted vs. Botpress Cloud managed deployment",
    ],
    bottomLine: "Botpress delivers strong value with transparent consumption pricing — open-source community edition enables evaluation without risk and commercial tier scales cost predictably with conversation volume.",
  },
  "agentops/voiceflow": {
    pricingModel: "per-seat",
    transparency: "public-list",
    startingPrice: "$50/editor/month for Team",
    typicalACV: "$10K–$100K",
    marketSegment: ["mid-market", "enterprise"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Editor seat count for team members building and managing agent flows",
      "Workspaces needed for multi-project or multi-brand agent portfolios",
      "Integration and API usage volume beyond included limits",
    ],
    bottomLine: "Voiceflow's editor-seat model is accessible for teams building AI agents collaboratively — the free tier enables meaningful evaluation and the team tier pricing is competitive vs. engineering-only platforms.",
  },
  "agentops/rasa": {
    pricingModel: "open-source-plus",
    transparency: "limited-public",
    startingPrice: "Open-source free; Rasa Pro pricing on request",
    typicalACV: "$50K–$400K",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["on-prem", "hybrid"],
    freeTrialOrTier: true,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Rasa Pro subscription for enterprise support and CALM framework access",
      "Infrastructure and ML operations overhead for on-premises deployment",
      "Professional services for initial deployment and model training",
    ],
    bottomLine: "Rasa's total cost is high due to significant ML engineering and infrastructure requirements — the premium is justified for regulated industries where cloud AI data sovereignty risk exceeds on-premises operational cost.",
  },
  "agentops/relevance-ai": {
    pricingModel: "consumption",
    transparency: "public-list",
    startingPrice: "$19/month for Starter",
    typicalACV: "$5K–$80K",
    marketSegment: ["smb", "mid-market"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "AI credits consumed by agent task executions",
      "User seat count for business team access",
      "Storage and knowledge base size for agent grounding",
    ],
    bottomLine: "Relevance AI's consumption pricing is accessible for mid-market teams — the free trial and Starter tier enable genuine evaluation before commitment, with cost scaling predictably with agent usage volume.",
  },
  "agentops/polyai": {
    pricingModel: "consumption",
    transparency: "contact-sales",
    typicalACV: "$200K–$2M",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas"],
    freeTrialOrTier: false,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Conversation minutes processed per month across all deployed voice agents",
      "Language and dialect count for multi-market deployments",
      "Custom voice and persona development professional services",
    ],
    bottomLine: "PolyAI's high ACV reflects voice AI complexity — ROI is justified by deflecting 50–70% of inbound calls that would otherwise require live agents, with documented cost savings in the $500K–$5M range for large contact centers.",
  },
  "agentops/guru": {
    pricingModel: "per-seat",
    transparency: "public-list",
    startingPrice: "$15/user/month for Starter",
    typicalACV: "$10K–$100K",
    marketSegment: ["mid-market", "enterprise"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "User seat count (agents and knowledge contributors)",
      "Knowledge base size (cards and documents stored)",
      "AI Answers feature tier and usage volume",
    ],
    bottomLine: "Guru's per-seat pricing is accessible and ROI is measurable through agent handle time reduction — knowledge management programs with active SME participation show 20–30% reduction in time spent searching for information.",
  },



  "secops/darktrace": {
    pricingModel: "enterprise-license",
    transparency: "contact-sales",
    typicalACV: "$100K–$1M",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas", "on-prem", "hybrid"],
    freeTrialOrTier: false,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Bandwidth or asset count monitored across network, cloud, and email surfaces",
      "Module selection: Detect, Respond, Heal packages across different attack surfaces",
      "OT/ICS deployment complexity for industrial network monitoring",
    ],
    bottomLine: "Darktrace commands a significant premium reflecting its AI research investment and enterprise deployment complexity — organizations compare cost against eliminating 2–3 separate point tools the AI platform replaces.",
  },
  "secops/recorded-future": {
    pricingModel: "module-based",
    transparency: "contact-sales",
    typicalACV: "$100K–$1M",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas"],
    freeTrialOrTier: false,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Module selection: Threat Intelligence, Identity, SecOps, Third Party Risk, Fraud Intelligence",
      "API volume and SIEM/SOAR integration call volume",
      "User analyst seat count for the intelligence portal",
    ],
    bottomLine: "Recorded Future's modular pricing enables buyers to start with core threat intelligence and expand — total investment can be significant for full platform activation but ROI is measurable through analyst time savings and breach prevention.",
  },
  "secops/cyberark": {
    pricingModel: "module-based",
    transparency: "contact-sales",
    typicalACV: "$200K–$2M",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas", "on-prem", "hybrid"],
    freeTrialOrTier: false,
    tcoBadge: "very-high",
    keyPricingDrivers: [
      "Privileged account count across all vaulted credentials",
      "Session recording and monitoring volume",
      "Identity module add-ons: SSO, MFA, Lifecycle Management beyond PAM core",
    ],
    bottomLine: "CyberArk is the most expensive PAM platform in the market — total deployment cost including infrastructure, professional services, and licensing regularly exceeds $1M for enterprise deployments, justified by proven breach prevention ROI.",
  },
  "secops/beyondtrust": {
    pricingModel: "module-based",
    transparency: "contact-sales",
    typicalACV: "$100K–$800K",
    marketSegment: ["enterprise", "mid-market"],
    deploymentModel: ["saas", "on-prem"],
    freeTrialOrTier: false,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Managed asset count for Password Safe privileged account vaulting",
      "Endpoint privilege management seat count for EPM deployment",
      "Privileged Remote Access session count for vendor access management",
    ],
    bottomLine: "BeyondTrust delivers 30–40% lower TCO than CyberArk for equivalent PAM functionality — particularly compelling for the mid-market enterprise segment where CyberArk's premium is difficult to justify.",
  },
  "secops/varonis": {
    pricingModel: "per-seat",
    transparency: "contact-sales",
    typicalACV: "$100K–$800K",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas", "on-prem"],
    freeTrialOrTier: false,
    tcoBadge: "high",
    keyPricingDrivers: [
      "User count (employees whose data access is monitored)",
      "Data storage volume under management across file shares, M365, and SaaS",
      "MDDR managed service overlay pricing beyond platform licensing",
    ],
    bottomLine: "Varonis pricing is per-user with data volume influence — organizations typically see immediate ROI from discovered data exposure findings that, if exploited, would cost orders of magnitude more than the platform investment.",
  },
  "secops/orca-security": {
    pricingModel: "consumption",
    transparency: "contact-sales",
    typicalACV: "$80K–$500K",
    marketSegment: ["enterprise", "mid-market"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Cloud workload count (VMs, containers, serverless functions) across all connected accounts",
      "Module add-ons: DSPM, secrets scanning beyond base CSPM+CWPP",
      "Remediation workflow integration complexity",
    ],
    bottomLine: "Orca positions 20–30% below Wiz for comparable CNAPP coverage — strong value for cost-conscious cloud security buyers who don't need Wiz's Google marketplace distribution advantage.",
  },
  "secops/lacework": {
    pricingModel: "consumption",
    transparency: "contact-sales",
    typicalACV: "$75K–$500K",
    marketSegment: ["enterprise", "mid-market"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Cloud resource count and workload telemetry volume",
      "Container and Kubernetes cluster count for CWPP coverage",
      "IaC scanning pipeline volume for developer security features",
    ],
    bottomLine: "Lacework's consumption model is competitive with Orca and Wiz — Fortinet partnership may offer bundled pricing advantages for Fortinet customers, reducing total cost vs. standalone CNAPP procurement.",
  },
  "secops/threatconnect": {
    pricingModel: "platform-license",
    transparency: "contact-sales",
    typicalACV: "$50K–$400K",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas", "on-prem"],
    freeTrialOrTier: false,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Intelligence user seat count and API access tier",
      "SOAR playbook execution volume",
      "CAL intelligence sharing tier (community vs. enterprise feeds)",
    ],
    bottomLine: "ThreatConnect's unified TIP+SOAR platform price is competitive vs. purchasing separate best-of-breed TIP and SOAR solutions — strongest value for organizations that can fully operationalize intelligence-driven automation.",
  },
  "secops/vectra-ai": {
    pricingModel: "consumption",
    transparency: "contact-sales",
    typicalACV: "$100K–$600K",
    marketSegment: ["enterprise", "mid-market"],
    deploymentModel: ["saas", "on-prem"],
    freeTrialOrTier: false,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Network traffic volume (bandwidth monitored per day)",
      "Cloud account and identity source count for cloud and identity detection",
      "Vectra MXDR managed service overlay pricing",
    ],
    bottomLine: "Vectra AI's consumption pricing scales with network and cloud coverage — value is highest for organizations where lateral movement detection has direct breach prevention ROI that can be quantified against insurance and response costs.",
  },
  "aiops/moogsoft": {
    pricingModel: "enterprise-license",
    transparency: "contact-sales",
    typicalACV: "$150K–$800K",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas", "on-prem", "hybrid"],
    freeTrialOrTier: false,
    tcoBadge: "high",
    keyPricingDrivers: [
      "Event volume and number of monitored nodes across hybrid infrastructure",
      "Deployment model — on-prem and hybrid add professional services and infrastructure cost",
      "APEX Observability bundling vs. standalone Moogsoft licensing from Dell",
    ],
    bottomLine: "Enterprise-tier pricing bundled into Dell APEX Observability; best value for existing Dell infrastructure customers who can leverage bundle pricing against standalone AIOps spend.",
  },

  "rpa/ramp": {
    pricingModel: "freemium",
    transparency: "public-list",
    startingPrice: "Free (core card + expense)",
    typicalACV: "$20K–$150K",
    marketSegment: ["smb", "mid-market", "enterprise"],
    deploymentModel: ["saas"],
    freeTrialOrTier: true,
    tcoBadge: "low",
    keyPricingDrivers: [
      "Employee count and card volume — premium tiers priced per user for advanced AP and analytics features",
      "AP automation module adoption — invoice processing and vendor payments are premium add-ons",
      "Interchange revenue model — Ramp earns from card transactions, subsidizing software pricing",
    ],
    bottomLine: "Ramp's freemium corporate card eliminates upfront software cost — core expense management is free with revenue from interchange fees, making it the lowest TCO option in the finance automation category.",
  },

  "secops/abnormal-security": {
    pricingModel: "per-seat",
    transparency: "contact-sales",
    typicalACV: "$50K–$500K",
    marketSegment: ["enterprise", "fortune500"],
    deploymentModel: ["saas"],
    freeTrialOrTier: false,
    tcoBadge: "medium",
    keyPricingDrivers: [
      "Mailbox count (employees protected across email and collaboration platforms)",
      "Platform expansion: email + Slack + Zoom + collaboration platforms",
      "Enterprise vs. Enterprise Plus feature tier selection",
    ],
    bottomLine: "Abnormal's per-mailbox pricing is premium vs. Microsoft Defender for Office 365 but its BEC and vendor fraud detection quality justifies cost for organizations with $500K+ exposure from a single compromised wire transfer.",
  },


};
