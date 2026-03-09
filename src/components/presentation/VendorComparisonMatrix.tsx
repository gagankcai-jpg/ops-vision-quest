import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Filter, 
  SortAsc, 
  SortDesc, 
  TrendingUp, 
  DollarSign, 
  Building2,
  BarChart3,
  Cpu,
  Bot,
  X,
  Search,
  ChevronDown,
  ExternalLink,
  Globe,
  Users,
  Calendar,
  Award,
  Zap,
  Target,
  Shield
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Extended vendor detail info
const vendorDetails: Record<string, { founded: string; hq: string; employees: string; ceo: string; description: string; strengths: string[]; weaknesses: string[]; keyProducts: string[]; recentMoves: string[]; customers: string[] }> = {
  "Dynatrace": { founded: "2005", hq: "Waltham, MA", employees: "5,000+", ceo: "Rick McConnell", description: "AI-powered full-stack observability platform providing automatic and intelligent monitoring for cloud ecosystems.", strengths: ["Davis AI engine for root cause analysis", "Full-stack auto-instrumentation", "15-year Gartner MQ Leader"], weaknesses: ["Premium pricing", "Complex initial setup for hybrid environments"], keyProducts: ["Dynatrace Platform", "Davis AI", "Grail Data Lakehouse"], recentMoves: ["Launched Davis CoPilot (GenAI)", "Acquired Rookout for code-level debugging"], customers: ["SAP", "Kroger", "Samsung", "Air Canada"] },
  "Splunk (Cisco)": { founded: "2003", hq: "San Francisco, CA", employees: "8,500+", ceo: "Gary Steele", description: "Industry-leading SIEM and observability platform, acquired by Cisco in 2024 for $28B to create an end-to-end security and observability powerhouse.", strengths: ["Massive ecosystem & SPL query language", "Cisco integration synergies", "Strong in security analytics"], weaknesses: ["Expensive at scale", "Complex licensing model"], keyProducts: ["Splunk Enterprise", "Splunk Cloud", "SOAR", "ITSI"], recentMoves: ["$28B Cisco acquisition closed March 2024", "Integrating with Cisco's networking telemetry"], customers: ["92 of Fortune 100", "US DoD", "Airbus", "Heineken"] },
  "Datadog": { founded: "2010", hq: "New York, NY", employees: "6,500+", ceo: "Olivier Pomel", description: "Cloud-native monitoring and analytics platform unifying infrastructure metrics, APM, logs, and security in a single SaaS platform.", strengths: ["Best-in-class cloud-native monitoring", "Rapid product expansion (20+ products)", "35% revenue growth"], weaknesses: ["Costs can escalate with data volume", "Less suited for on-prem environments"], keyProducts: ["Infrastructure Monitoring", "APM", "Log Management", "Cloud SIEM", "Bits AI"], recentMoves: ["Launched Bits AI copilot", "Expanded into cloud cost management", "LLM Observability product"], customers: ["Samsung", "Peloton", "Whole Foods", "Comcast"] },
  "New Relic": { founded: "2008", hq: "San Francisco, CA", employees: "2,800+", ceo: "Arun Samudrala", description: "Full-stack observability platform offering consumption-based pricing model with 30+ capabilities on a single platform.", strengths: ["Transparent consumption pricing", "Strong developer experience", "Full-stack coverage"], weaknesses: ["Market share pressure from Datadog", "Slower growth vs. peers"], keyProducts: ["New Relic One", "APM 360", "Vulnerability Management", "AI Monitoring"], recentMoves: ["Taken private by Francisco Partners & TPG", "AI monitoring for LLM apps"], customers: ["ZenDesk", "REI", "Domino's", "Epic Games"] },
  "Grafana Labs": { founded: "2014", hq: "New York, NY", employees: "1,200+", ceo: "Raj Dutt", description: "Open-source observability platform powering visualization and monitoring with the most popular dashboarding tool in the industry.", strengths: ["Open-source community (20M+ users)", "50% growth rate", "Composable architecture"], weaknesses: ["Revenue still scaling", "Enterprise features catching up"], keyProducts: ["Grafana", "Loki", "Tempo", "Mimir", "Grafana Cloud"], recentMoves: ["$240M Series D at $6B valuation", "Launched Grafana SLO and Incident"], customers: ["Bloomberg", "JP Morgan", "eBay", "PayPal"] },
  "ServiceNow ITOM": { founded: "2003", hq: "Santa Clara, CA", employees: "22,000+", ceo: "Bill McDermott", description: "Enterprise ITOM suite within the Now Platform delivering IT operations management, AIOps, and cloud management.", strengths: ["44% ITSM market share", "Platform stickiness", "Strong AI investments"], weaknesses: ["High total cost of ownership", "Complex implementation"], keyProducts: ["ITOM Visibility", "ITOM Health", "Cloud Management", "AIOps"], recentMoves: ["Now Assist GenAI across platform", "Acquired G2K for cloud observability"], customers: ["85% of Fortune 500", "Deloitte", "NASA"] },
  "Elastic": { founded: "2012", hq: "San Francisco, CA", employees: "3,500+", ceo: "Ash Kulkarni", description: "Search-powered observability and security analytics platform built on the Elasticsearch engine.", strengths: ["ELK Stack ubiquity", "Strong in log analytics and search", "Open-source roots"], weaknesses: ["Licensing changes created friction", "Competitive pressure from Datadog"], keyProducts: ["Elastic Observability", "Elastic Security", "Elasticsearch", "Kibana"], recentMoves: ["Re-licensed to AGPL", "Elastic AI Assistant launch"], customers: ["Cisco", "Uber", "Netflix", "Adobe"] },
  "Sumo Logic": { founded: "2010", hq: "Redwood City, CA", employees: "1,000+", ceo: "Keith Nealon", description: "Cloud-native machine data analytics platform providing log management, infrastructure monitoring, and cloud SIEM.", strengths: ["Cloud-native architecture", "Integrated SIEM capabilities", "Strong compliance features"], weaknesses: ["Smaller scale vs. competitors", "Limited APM capabilities"], keyProducts: ["Cloud SIEM", "Cloud SOAR", "Log Analytics", "Infrastructure Monitoring"], recentMoves: ["Acquired by Francisco Partners (2023)", "Focus on security analytics"], customers: ["Anheuser-Busch", "Airbnb", "Samsung", "Zuora"] },
  "LogicMonitor": { founded: "2007", hq: "Santa Barbara, CA", employees: "1,200+", ceo: "Christina Kosmowski", description: "AI-powered hybrid observability platform providing unified monitoring across cloud and on-prem infrastructure.", strengths: ["$800M in total funding", "45% growth rate", "Strong hybrid cloud monitoring"], weaknesses: ["Not yet profitable", "Narrower product portfolio"], keyProducts: ["LM Envision", "LM Logs", "LM Container Monitoring"], recentMoves: ["$800M growth round at $2.4B valuation", "Launched Edwin AI"], customers: ["Uber", "Spotify", "Sony", "Instacart"] },
  "Chronosphere": { founded: "2019", hq: "New York, NY", employees: "300+", ceo: "Martin Mao", description: "Cloud-native observability platform focused on controlling costs and complexity of monitoring data at scale.", strengths: ["80% growth rate", "Cost optimization focus", "Founded by ex-Uber engineers"], weaknesses: ["Early-stage revenue", "Limited brand recognition"], keyProducts: ["Chronosphere Platform", "Telemetry Pipeline", "Change Intelligence"], recentMoves: ["Named Gartner MQ Leader 2024", "Raised $343M total"], customers: ["DoorDash", "Snap", "Abnormal Security"] },
  "ServiceNow": { founded: "2003", hq: "Santa Clara, CA", employees: "22,000+", ceo: "Bill McDermott", description: "The dominant enterprise platform for IT service management and digital workflows, expanding aggressively into AI-powered operations.", strengths: ["Dominant ITSM market position (44%)", "$8.9B revenue scale", "Platform lock-in"], weaknesses: ["Premium pricing deters SMBs", "Complex implementation timelines"], keyProducts: ["ITSM", "ITOM", "ITAM", "CSM", "Now Platform", "Now Assist"], recentMoves: ["Now Assist GenAI rollout", "Vancouver release with AI features", "$100B+ market cap"], customers: ["85% of Fortune 500", "NASA", "Deloitte", "US Army"] },
  "Microsoft": { founded: "1975", hq: "Redmond, WA", employees: "228,000+", ceo: "Satya Nadella", description: "Tech giant with Azure-based ITOM capabilities including Azure Monitor, Azure Arc, and System Center for hybrid operations management.", strengths: ["Azure ecosystem integration", "Copilot AI across products", "Massive enterprise footprint"], weaknesses: ["Fragmented ITOM tooling", "Less specialized than pure-play vendors"], keyProducts: ["Azure Monitor", "Azure Arc", "System Center", "Intune", "Sentinel"], recentMoves: ["Copilot for IT Operations", "Azure AI integration", "$3.1T market cap"], customers: ["95% of Fortune 500", "Every major enterprise globally"] },
  "Broadcom (CA)": { founded: "1961", hq: "Palo Alto, CA", employees: "20,000+", ceo: "Hock Tan", description: "Infrastructure software giant following $61B VMware acquisition, consolidating legacy CA Technologies ITOM products.", strengths: ["Massive installed base", "VMware + CA + Symantec portfolio", "Cost optimization focus"], weaknesses: ["Customer friction from license changes", "Innovation pace concerns"], keyProducts: ["DX NetOps", "DX APM", "VMware vRealize", "Automic"], recentMoves: ["$61B VMware acquisition (2023)", "Aggressive bundling strategy", "Subscription transition"], customers: ["Major global banks", "Telcos", "Government agencies"] },
  "IBM": { founded: "1911", hq: "Armonk, NY", employees: "280,000+", ceo: "Arvind Krishna", description: "Legacy IT powerhouse with Watson AIOps and Cloud Pak for operations, focusing on hybrid cloud and AI-driven automation.", strengths: ["Deep enterprise relationships", "Watson AI brand", "Consulting arm"], weaknesses: ["Slow organic growth (3%)", "Complex product portfolio"], keyProducts: ["Watson AIOps", "Instana", "Turbonomic", "Cloud Pak"], recentMoves: ["Acquired Apptio for $4.6B", "WatsonX AI platform launch", "Divested Weather Company"], customers: ["70% of Fortune 50", "BNP Paribas", "Vodafone"] },
  "Atlassian": { founded: "2002", hq: "Sydney, Australia", employees: "12,000+", ceo: "Mike Cannon-Brookes", description: "Collaboration and ITSM platform known for Jira Service Management, expanding into IT operations with Compass and Statuspage.", strengths: ["28% growth rate", "Strong developer community", "Cloud migration momentum"], weaknesses: ["Less mature ITOM capabilities", "Server product sunset concerns"], keyProducts: ["Jira Service Management", "Compass", "Statuspage", "Opsgenie"], recentMoves: ["Cloud-only strategy", "AI-powered Atlassian Intelligence", "Acquired Loom"], customers: ["NASA", "Tesla", "Spotify", "Samsung"] },
  "BMC Software": { founded: "1980", hq: "Houston, TX", employees: "6,500+", ceo: "Ayman Sayed", description: "Enterprise IT management vendor with Helix ITSM and TrueSight operations management for large-scale environments.", strengths: ["Strong mainframe management", "Enterprise-grade reliability", "BMC Helix platform"], weaknesses: ["Slow cloud transition", "Declining market mindshare"], keyProducts: ["BMC Helix ITSM", "TrueSight", "Control-M", "MainView"], recentMoves: ["BMC Helix with GenAI", "HelixGPT launch", "KKR ownership"], customers: ["80% of Forbes Global 50", "Major banks", "Airlines"] },
  "SolarWinds": { founded: "1999", hq: "Austin, TX", employees: "2,500+", ceo: "Sudhakar Ramakrishna", description: "Mid-market IT monitoring and management platform known for affordable, easy-to-deploy network and systems monitoring.", strengths: ["Strong mid-market position", "Affordable pricing", "Easy deployment"], weaknesses: ["Brand damage from 2020 breach", "4% slow growth"], keyProducts: ["SolarWinds Observability", "Network Performance Monitor", "Server & Application Monitor"], recentMoves: ["SolarWinds Observability SaaS launch", "Recovered from supply chain attack", "Thoma Bravo take-private"], customers: ["499 of Fortune 500 (historically)", "US Military", "Universities"] },
  "Ivanti": { founded: "1985", hq: "South Jordan, UT", employees: "3,500+", ceo: "Jeff Abbott", description: "Unified IT platform combining endpoint management, IT service management, and security into a single solution.", strengths: ["Unified IT approach", "Strong endpoint management", "Government sector presence"], weaknesses: ["Recent security vulnerabilities in products", "Integration complexity"], keyProducts: ["Ivanti Neurons", "Endpoint Manager", "Service Manager", "Connect Secure"], recentMoves: ["Ivanti Neurons AI platform", "Addressed critical VPN vulnerabilities", "Unified platform push"], customers: ["US DoD", "96 of Fortune 100", "UK NHS"] },
  "Freshworks": { founded: "2010", hq: "San Mateo, CA", employees: "5,500+", ceo: "Dennis Woodside", description: "SME-focused business software platform providing affordable ITSM, CRM, and customer support solutions.", strengths: ["22% growth rate", "SME-friendly pricing", "Modern UX"], weaknesses: ["Limited enterprise penetration", "Smaller scale vs ServiceNow"], keyProducts: ["Freshservice", "Freshdesk", "Freshsales", "Freddy AI"], recentMoves: ["Freddy AI copilot launch", "Focus on profitability", "IPO in 2021"], customers: ["Bridgestone", "Databricks", "PhonePe", "Blue Nile"] },
  "Atera": { founded: "2016", hq: "Tel Aviv, Israel", employees: "500+", ceo: "Gil Pekelman", description: "AI-powered IT management platform for MSPs and IT departments with rapid deployment and per-technician pricing.", strengths: ["65% growth rate", "Unique per-technician pricing", "Fast 5-min setup"], weaknesses: ["Early revenue stage ($80M)", "Limited enterprise features"], keyProducts: ["Atera Platform", "Action AI", "Copilot", "Network Discovery"], recentMoves: ["$77M Series B funding", "Action AI autonomous resolution", "MSP market expansion"], customers: ["10,000+ MSPs globally", "Mid-market IT teams"] },
  "UiPath": { founded: "2005", hq: "New York, NY", employees: "4,000+", ceo: "Daniel Dines", description: "Leading enterprise RPA platform with AI-powered automation capabilities, process mining, and end-to-end automation suite.", strengths: ["6x Gartner MQ Leader", "Largest pure-play RPA vendor", "Strong community (3M+ developers)"], weaknesses: ["Path to profitability concerns", "Competition from hyperscalers"], keyProducts: ["UiPath Platform", "AI Center", "Process Mining", "Document Understanding", "Autopilot"], recentMoves: ["Autopilot GenAI assistant", "Acquired Re:infer for NLP", "CEO transition and return"], customers: ["CrowdStrike", "Uber", "NASA", "Deutsche Post"] },
  "MS Power Automate": { founded: "2016 (as Flow)", hq: "Redmond, WA", employees: "Part of Microsoft", ceo: "Satya Nadella", description: "Microsoft's low-code automation platform integrated into the Power Platform and M365 ecosystem with the fastest growth in RPA.", strengths: ["45% growth rate (fastest)", "M365 ecosystem integration", "10M+ monthly active users"], weaknesses: ["Less sophisticated for complex automations", "Enterprise governance challenges"], keyProducts: ["Power Automate Desktop", "Cloud Flows", "Process Mining", "AI Builder"], recentMoves: ["Copilot in Power Automate", "Process mining integration", "Generative AI flow creation"], customers: ["Every M365 enterprise customer", "T-Mobile", "Coca-Cola"] },
  "Automation Anywhere": { founded: "2003", hq: "San Jose, CA", employees: "2,800+", ceo: "Mihir Shukla", description: "Cloud-native intelligent automation platform combining RPA, AI, and process discovery for enterprise automation.", strengths: ["Cloud-native architecture", "Strong AI integration", "Generative AI early mover"], weaknesses: ["Revenue scale behind UiPath", "Market share pressure"], keyProducts: ["Automation 360", "AARI", "Process Discovery", "Document Automation"], recentMoves: ["Generative AI-powered automation", "$2.5B+ total funding", "Google Cloud partnership"], customers: ["Dell", "Goldman Sachs", "Juniper Networks", "Siemens"] },
  "SS&C Blue Prism": { founded: "2001", hq: "London, UK", employees: "1,500+", ceo: "Bill Stone (SS&C)", description: "Enterprise-grade RPA platform acquired by SS&C Technologies, focused on regulated industries and complex process automation.", strengths: ["Enterprise security focus", "Strong in regulated industries", "Centralized management"], weaknesses: ["8% slow growth", "Integration into SS&C ongoing"], keyProducts: ["Blue Prism Cloud", "Digital Workers", "Process Intelligence", "Decision"], recentMoves: ["SS&C acquisition completed", "Cloud migration push", "AI integration roadmap"], customers: ["Pfizer", "Coca-Cola European Partners", "Zurich Insurance"] },
  "Appian": { founded: "1999", hq: "McLean, VA", employees: "2,200+", ceo: "Matt Calkins", description: "Low-code automation platform combining process mining, RPA, and AI for enterprise workflow automation.", strengths: ["Low-code leader", "Process mining + RPA combo", "Government sector strength"], weaknesses: ["Smaller revenue scale", "18% moderate growth"], keyProducts: ["Appian Platform", "Process Mining", "RPA", "AI Process Designer"], recentMoves: ["AI Process Designer launch", "Data fabric architecture", "Government cloud expansion"], customers: ["US Army", "Fannie Mae", "T-Mobile", "Roche"] },
  "IBM RPA": { founded: "2020 (WDG acq.)", hq: "Armonk, NY", employees: "Part of IBM", ceo: "Arvind Krishna", description: "IBM's automation division offering RPA integrated with Watson AI and Cloud Pak for Business Automation.", strengths: ["Watson AI integration", "IBM consulting leverage", "Enterprise relationships"], weaknesses: ["Late RPA market entry", "Fragmented automation portfolio"], keyProducts: ["IBM RPA", "Watson Orchestrate", "Cloud Pak for Business Automation"], recentMoves: ["WatsonX AI integration", "Orchestrate digital worker", "Consulting-led automation"], customers: ["Vodafone", "BNP Paribas", "Telefonica"] },
  "Pega": { founded: "1983", hq: "Cambridge, MA", employees: "6,500+", ceo: "Alan Trefler", description: "Enterprise application platform combining BPM, CRM, and intelligent automation with AI-driven decisioning.", strengths: ["Deep CRM integration", "AI-powered decisioning", "40+ years enterprise experience"], weaknesses: ["10% slow growth", "Complex platform learning curve"], keyProducts: ["Pega Platform", "Customer Decision Hub", "Robotic Automation", "Process Fabric"], recentMoves: ["Pega GenAI Blueprint", "Auto-generated workflows", "Blueprint free tool viral growth"], customers: ["HSBC", "Pfizer", "Cigna", "Vodafone"] },
  "WorkFusion": { founded: "2010", hq: "New York, NY", employees: "500+", ceo: "Adam Devine", description: "AI-powered intelligent automation platform specialized in financial crime compliance and AML/KYC automation.", strengths: ["AML/KYC specialization", "Pre-built compliance bots", "AI-native platform"], weaknesses: ["Narrow vertical focus", "Small revenue base"], keyProducts: ["WorkFusion Platform", "Turabot (SAR)", "Evelyn (KYC)", "Isaac (Transaction Monitoring)"], recentMoves: ["$340M total funding", "Expanded to fraud detection", "Named AI bot personas"], customers: ["Standard Chartered", "Deutsche Bank", "HSBC", "Top 10 US banks"] },
  "Celonis": { founded: "2011", hq: "Munich, Germany", employees: "3,000+", ceo: "Alex Rinke", description: "Process mining and execution management platform helping enterprises discover, improve, and automate business processes.", strengths: ["60% growth rate", "Process mining market leader", "$13B valuation"], weaknesses: ["Not yet profitable", "Category still maturing"], keyProducts: ["Celonis EMS", "Process Intelligence", "Action Engine", "Process Copilot"], recentMoves: ["Process Copilot GenAI launch", "Object-centric process mining", "Industry-specific solutions"], customers: ["Uber", "Siemens", "L'Oréal", "ABB", "Dell"] },
  "Moveworks": { founded: "2016", hq: "Mountain View, CA", employees: "550+", ceo: "Bhavin Shah", description: "AI-powered employee experience platform using LLMs to automate IT support, HR, and enterprise service desk interactions.", strengths: ["85% growth rate (highest)", "GenAI-native architecture", "$315M raised"], weaknesses: ["Pre-revenue scale ($100M)", "Narrow IT support focus expanding"], keyProducts: ["Moveworks Platform", "Creator Studio", "Employee Experience Insights"], recentMoves: ["GPT-powered copilot", "Expanded beyond IT to HR/Finance", "Creator Studio for custom AI bots"], customers: ["Hearst", "DocuSign", "Broadcom", "Palo Alto Networks"] },
};

// Comprehensive vendor data with numeric metrics for filtering
const vendorData = [
  // AIOps & Observability
  { name: "Dynatrace", category: "AIOps", marketCap: 15.2, revenue: 1.4, growthRate: 25, type: "leader", highlight: "15yr Gartner Leader" },
  { name: "Splunk (Cisco)", category: "AIOps", marketCap: 28.0, revenue: 3.7, growthRate: 12, type: "leader", highlight: "Acquired by Cisco 2024" },
  { name: "Datadog", category: "AIOps", marketCap: 42.5, revenue: 2.1, growthRate: 35, type: "leader", highlight: "Cloud-native leader" },
  { name: "New Relic", category: "AIOps", marketCap: 5.8, revenue: 0.9, growthRate: 18, type: "leader", highlight: "Full-stack platform" },
  { name: "Grafana Labs", category: "AIOps", marketCap: 6.0, revenue: 0.35, growthRate: 50, type: "leader", highlight: "Open-source leader" },
  { name: "ServiceNow ITOM", category: "AIOps", marketCap: 165.0, revenue: 8.9, growthRate: 24, type: "leader", highlight: "44% market share" },
  { name: "Elastic", category: "AIOps", marketCap: 8.5, revenue: 1.2, growthRate: 15, type: "leader", highlight: "ELK ecosystem" },
  { name: "Sumo Logic", category: "AIOps", marketCap: 1.7, revenue: 0.3, growthRate: 10, type: "leader", highlight: "Cloud SIEM" },
  { name: "LogicMonitor", category: "AIOps", marketCap: 2.4, revenue: 0.22, growthRate: 45, type: "emerging", highlight: "$800M funding" },
  { name: "Chronosphere", category: "AIOps", marketCap: 1.6, revenue: 0.08, growthRate: 80, type: "emerging", highlight: "Gartner Leader 2024" },
  
  // ITOM
  { name: "ServiceNow", category: "ITOM", marketCap: 165.0, revenue: 8.9, growthRate: 24, type: "leader", highlight: "Dominant platform" },
  { name: "Microsoft", category: "ITOM", marketCap: 3100.0, revenue: 62.0, growthRate: 16, type: "leader", highlight: "Azure Stack" },
  { name: "Broadcom (CA)", category: "ITOM", marketCap: 680.0, revenue: 38.0, growthRate: 8, type: "leader", highlight: "Legacy infrastructure" },
  { name: "IBM", category: "ITOM", marketCap: 175.0, revenue: 14.5, growthRate: 3, type: "leader", highlight: "Watson AIOps" },
  { name: "Atlassian", category: "ITOM", marketCap: 52.0, revenue: 3.5, growthRate: 28, type: "leader", highlight: "High growth" },
  { name: "BMC Software", category: "ITOM", marketCap: 8.5, revenue: 2.2, growthRate: 5, type: "leader", highlight: "Helix ITSM" },
  { name: "SolarWinds", category: "ITOM", marketCap: 2.8, revenue: 0.75, growthRate: 4, type: "leader", highlight: "Mid-market" },
  { name: "Ivanti", category: "ITOM", marketCap: 3.2, revenue: 0.95, growthRate: 12, type: "leader", highlight: "Unified IT" },
  { name: "Freshworks", category: "ITOM", marketCap: 4.5, revenue: 0.58, growthRate: 22, type: "leader", highlight: "SME focus" },
  { name: "Atera", category: "ITOM", marketCap: 0.5, revenue: 0.08, growthRate: 65, type: "emerging", highlight: "Fast deploy" },
  
  // RPA & Intelligent Automation
  { name: "UiPath", category: "RPA", marketCap: 12.5, revenue: 1.31, growthRate: 24, type: "leader", highlight: "6x Gartner Leader" },
  { name: "MS Power Automate", category: "RPA", marketCap: 3100.0, revenue: 4.5, growthRate: 45, type: "leader", highlight: "#1 growth rate" },
  { name: "Automation Anywhere", category: "RPA", marketCap: 6.8, revenue: 0.7, growthRate: 22, type: "leader", highlight: "Pure-play leader" },
  { name: "SS&C Blue Prism", category: "RPA", marketCap: 1.6, revenue: 0.18, growthRate: 8, type: "leader", highlight: "Enterprise focus" },
  { name: "Appian", category: "RPA", marketCap: 2.8, revenue: 0.55, growthRate: 18, type: "leader", highlight: "Low-code leader" },
  { name: "IBM RPA", category: "RPA", marketCap: 175.0, revenue: 0.4, growthRate: 15, type: "leader", highlight: "Watson AI" },
  { name: "Pega", category: "RPA", marketCap: 3.5, revenue: 1.35, growthRate: 10, type: "leader", highlight: "CRM focus" },
  { name: "WorkFusion", category: "RPA", marketCap: 0.8, revenue: 0.12, growthRate: 35, type: "leader", highlight: "AML/KYC bots" },
  { name: "Celonis", category: "RPA", marketCap: 13.0, revenue: 0.5, growthRate: 60, type: "emerging", highlight: "Process mining" },
  { name: "Moveworks", category: "RPA", marketCap: 2.1, revenue: 0.1, growthRate: 85, type: "emerging", highlight: "$315M raised" },
];

type SortField = "name" | "marketCap" | "revenue" | "growthRate";
type SortDirection = "asc" | "desc";

const categoryColors: Record<string, string> = {
  "AIOps": "hsl(199 89% 48%)",
  "ITOM": "hsl(262 83% 58%)",
  "RPA": "hsl(142 71% 45%)",
};

const categoryIcons: Record<string, typeof BarChart3> = {
  "AIOps": BarChart3,
  "ITOM": Cpu,
  "RPA": Bot,
};

const VendorComparisonMatrix = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["AIOps", "ITOM", "RPA"]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["leader", "emerging"]);
  const [sortField, setSortField] = useState<SortField>("marketCap");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [marketCapRange, setMarketCapRange] = useState([0, 100]);
  const [revenueRange, setRevenueRange] = useState([0, 100]);
  const [growthRateRange, setGrowthRateRange] = useState([0, 100]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<typeof vendorData[0] | null>(null);

  // Normalize values for slider (log scale for market cap and revenue)
  const normalizeValue = (value: number, max: number) => (Math.log10(value + 1) / Math.log10(max + 1)) * 100;
  const denormalizeValue = (normalized: number, max: number) => Math.pow(10, (normalized / 100) * Math.log10(max + 1)) - 1;

  const maxMarketCap = 3200;
  const maxRevenue = 65;
  const maxGrowth = 100;

  const filteredAndSortedVendors = useMemo(() => {
    return vendorData
      .filter((vendor) => {
        // Search filter
        if (searchQuery && !vendor.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
        // Category filter
        if (!selectedCategories.includes(vendor.category)) {
          return false;
        }
        // Type filter
        if (!selectedTypes.includes(vendor.type)) {
          return false;
        }
        // Market cap range
        const normalizedMC = normalizeValue(vendor.marketCap, maxMarketCap);
        if (normalizedMC < marketCapRange[0] || normalizedMC > marketCapRange[1]) {
          return false;
        }
        // Revenue range
        const normalizedRev = normalizeValue(vendor.revenue, maxRevenue);
        if (normalizedRev < revenueRange[0] || normalizedRev > revenueRange[1]) {
          return false;
        }
        // Growth rate range
        if (vendor.growthRate < growthRateRange[0] || vendor.growthRate > growthRateRange[1]) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        if (typeof aVal === "string" && typeof bVal === "string") {
          return sortDirection === "asc" 
            ? aVal.localeCompare(bVal) 
            : bVal.localeCompare(aVal);
        }
        return sortDirection === "asc" 
          ? (aVal as number) - (bVal as number) 
          : (bVal as number) - (aVal as number);
      });
  }, [searchQuery, selectedCategories, selectedTypes, sortField, sortDirection, marketCapRange, revenueRange, growthRateRange]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategories(["AIOps", "ITOM", "RPA"]);
    setSelectedTypes(["leader", "emerging"]);
    setMarketCapRange([0, 100]);
    setRevenueRange([0, 100]);
    setGrowthRateRange([0, 100]);
  };

  const activeFiltersCount = 
    (selectedCategories.length < 3 ? 1 : 0) +
    (selectedTypes.length < 2 ? 1 : 0) +
    (marketCapRange[0] > 0 || marketCapRange[1] < 100 ? 1 : 0) +
    (revenueRange[0] > 0 || revenueRange[1] < 100 ? 1 : 0) +
    (growthRateRange[0] > 0 || growthRateRange[1] < 100 ? 1 : 0);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <SortAsc className="w-4 h-4 opacity-30" />;
    return sortDirection === "asc" 
      ? <SortAsc className="w-4 h-4 text-primary" />
      : <SortDesc className="w-4 h-4 text-primary" />;
  };

  const formatMarketCap = (value: number) => {
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}T`;
    if (value >= 1) return `$${value.toFixed(1)}B`;
    return `$${(value * 1000).toFixed(0)}M`;
  };

  const formatRevenue = (value: number) => {
    if (value >= 1) return `$${value.toFixed(2)}B`;
    return `$${(value * 1000).toFixed(0)}M`;
  };

  return (
    <section id="comparison" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
      <div className="container px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Vendor Comparison Matrix
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Interactive analysis of {vendorData.length} vendors across AIOps, ITOM, and RPA markets
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search vendors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-card border-border"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap gap-3">
              {/* Category Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Building2 className="w-4 h-4" />
                    Categories
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {["AIOps", "ITOM", "RPA"].map((cat) => (
                    <DropdownMenuCheckboxItem
                      key={cat}
                      checked={selectedCategories.includes(cat)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCategories([...selectedCategories, cat]);
                        } else {
                          setSelectedCategories(selectedCategories.filter((c) => c !== cat));
                        }
                      }}
                    >
                      <span className="flex items-center gap-2">
                        <div 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: categoryColors[cat] }} 
                        />
                        {cat}
                      </span>
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Type Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Type
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuCheckboxItem
                    checked={selectedTypes.includes("leader")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedTypes([...selectedTypes, "leader"]);
                      } else {
                        setSelectedTypes(selectedTypes.filter((t) => t !== "leader"));
                      }
                    }}
                  >
                    Market Leaders
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedTypes.includes("emerging")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedTypes([...selectedTypes, "emerging"]);
                      } else {
                        setSelectedTypes(selectedTypes.filter((t) => t !== "emerging"));
                      }
                    }}
                  >
                    Emerging Vendors
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Advanced Filters Toggle */}
              <Button 
                variant={isFilterOpen ? "default" : "outline"} 
                className="gap-2"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter className="w-4 h-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>

              {activeFiltersCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Advanced Filters Panel */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 mt-4 bg-card border border-border rounded-xl">
                  {/* Market Cap Filter */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-primary" />
                        Market Cap
                      </label>
                      <span className="text-xs text-muted-foreground">
                        {formatMarketCap(denormalizeValue(marketCapRange[0], maxMarketCap))} - {formatMarketCap(denormalizeValue(marketCapRange[1], maxMarketCap))}
                      </span>
                    </div>
                    <Slider
                      value={marketCapRange}
                      onValueChange={setMarketCapRange}
                      min={0}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  {/* Revenue Filter */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-accent" />
                        Annual Revenue
                      </label>
                      <span className="text-xs text-muted-foreground">
                        {formatRevenue(denormalizeValue(revenueRange[0], maxRevenue))} - {formatRevenue(denormalizeValue(revenueRange[1], maxRevenue))}
                      </span>
                    </div>
                    <Slider
                      value={revenueRange}
                      onValueChange={setRevenueRange}
                      min={0}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  {/* Growth Rate Filter */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-executive-green" />
                        Growth Rate
                      </label>
                      <span className="text-xs text-muted-foreground">
                        {growthRateRange[0]}% - {growthRateRange[1]}%
                      </span>
                    </div>
                    <Slider
                      value={growthRateRange}
                      onValueChange={setGrowthRateRange}
                      min={0}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-4 mb-4 text-sm text-muted-foreground"
        >
          <span>Showing <strong className="text-foreground">{filteredAndSortedVendors.length}</strong> of {vendorData.length} vendors</span>
          {selectedCategories.length < 3 && (
            <div className="flex gap-2">
              {selectedCategories.map((cat) => (
                <Badge 
                  key={cat} 
                  variant="outline" 
                  className="text-xs"
                  style={{ borderColor: categoryColors[cat], color: categoryColors[cat] }}
                >
                  {cat}
                </Badge>
              ))}
            </div>
          )}
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-2xl overflow-hidden"
        >
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead 
                  className="cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-2">
                    Vendor
                    <SortIcon field="name" />
                  </div>
                </TableHead>
                <TableHead>Category</TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-foreground transition-colors text-right"
                  onClick={() => handleSort("marketCap")}
                >
                  <div className="flex items-center justify-end gap-2">
                    Market Cap
                    <SortIcon field="marketCap" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-foreground transition-colors text-right"
                  onClick={() => handleSort("revenue")}
                >
                  <div className="flex items-center justify-end gap-2">
                    Revenue
                    <SortIcon field="revenue" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-foreground transition-colors text-right"
                  onClick={() => handleSort("growthRate")}
                >
                  <div className="flex items-center justify-end gap-2">
                    Growth
                    <SortIcon field="growthRate" />
                  </div>
                </TableHead>
                <TableHead>Highlight</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="popLayout">
                {filteredAndSortedVendors.map((vendor, index) => {
                  const CategoryIcon = categoryIcons[vendor.category];
                  return (
                    <motion.tr
                      key={vendor.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.02 }}
                      className="border-border hover:bg-secondary/30 transition-colors group cursor-pointer"
                      onClick={() => setSelectedVendor(vendor)}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <span className="text-foreground">{vendor.name}</span>
                          {vendor.type === "emerging" && (
                            <Badge variant="outline" className="text-xs bg-executive-amber/10 text-executive-amber border-executive-amber/30">
                              Emerging
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CategoryIcon 
                            className="w-4 h-4" 
                            style={{ color: categoryColors[vendor.category] }} 
                          />
                          <span 
                            className="text-sm"
                            style={{ color: categoryColors[vendor.category] }}
                          >
                            {vendor.category}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {formatMarketCap(vendor.marketCap)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {formatRevenue(vendor.revenue)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div 
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium"
                          style={{ 
                            backgroundColor: vendor.growthRate >= 30 
                              ? "hsl(142 71% 45% / 0.15)" 
                              : vendor.growthRate >= 15 
                                ? "hsl(199 89% 48% / 0.15)" 
                                : "hsl(var(--muted))",
                            color: vendor.growthRate >= 30 
                              ? "hsl(142 71% 45%)" 
                              : vendor.growthRate >= 15 
                                ? "hsl(199 89% 48%)" 
                                : "hsl(var(--muted-foreground))"
                          }}
                        >
                          <TrendingUp className="w-3 h-3" />
                          {vendor.growthRate}%
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">
                        {vendor.highlight}
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
              {filteredAndSortedVendors.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Filter className="w-8 h-8 opacity-50" />
                      <span>No vendors match your filters</span>
                      <Button variant="ghost" size="sm" onClick={clearFilters}>
                        Clear all filters
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
        >
          <span className="font-medium">Categories:</span>
          {Object.entries(categoryColors).map(([cat, color]) => (
            <div key={cat} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span>{cat}</span>
            </div>
          ))}
          <span className="mx-4 h-4 w-px bg-border" />
          <span className="font-medium">Growth:</span>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-executive-green" />
            <span>≥30% (High)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span>15-30% (Moderate)</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VendorComparisonMatrix;
