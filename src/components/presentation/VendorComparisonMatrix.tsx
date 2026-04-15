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
  Shield,
  Sparkles,
  ShieldCheck,
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
import { allCategories } from "@/data/marketData";

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
  "Aisera": { founded: "2017", hq: "Palo Alto, CA", employees: "300+", ceo: "Muddu Sudhakar", description: "Generative AI service management platform delivering autonomous IT and HR support through conversational AI and proactive resolution.", strengths: ["GenAI-native architecture", "$150M raised", "95% first-contact resolution"], weaknesses: ["Smaller scale vs. incumbents", "Brand recognition still growing"], keyProducts: ["Aisera AISM", "AI Copilot", "AiseraGPT", "Workflow Automation"], recentMoves: ["AiseraGPT enterprise launch", "Expanded to HR & Finance agents", "Partnered with ServiceNow"], customers: ["Zoom", "Autodesk", "Dartmouth Health", "Condé Nast"] },
  "PagerDuty Copilot": { founded: "2009", hq: "San Francisco, CA", employees: "900+", ceo: "Jennifer Tejada", description: "AI-powered incident management platform that autonomously detects, triages, and coordinates response to operational incidents.", strengths: ["AIOps + copilot integration", "Largest on-call customer base", "Strong enterprise footprint"], weaknesses: ["Slowing growth (~7%)", "Competitive pressure from observability vendors"], keyProducts: ["PagerDuty Operations Cloud", "AIOps", "Copilot", "Automation Actions"], recentMoves: ["Copilot for incident summarization", "Automation Actions GA", "Operations Cloud launch"], customers: ["GE Healthcare", "Comcast", "DoorDash", "Twilio"] },
  "Leena AI": { founded: "2018", hq: "San Francisco, CA", employees: "300+", ceo: "Adit Jain", description: "Autonomous employee IT and HR helpdesk powered by a fine-tuned LLM that resolves 95%+ of employee queries without human escalation.", strengths: ["95% auto-resolution rate", "MS Teams & Slack native", "60+ enterprise connectors"], weaknesses: ["Early revenue stage", "Limited brand recognition outside APAC"], keyProducts: ["Leena AI Autonomous Agent", "WorkLM", "HR Helpdesk", "IT Helpdesk"], recentMoves: ["WorkLM enterprise LLM launch", "Series C funding ($30M)", "Expanded to North America"], customers: ["Coca-Cola", "Nestlé", "Air Asia", "Puma"] },
  "Espressive": { founded: "2018", hq: "Santa Clara, CA", employees: "150+", ceo: "Pat Calhoun", description: "Enterprise virtual support agent (Barista) providing personalized, AI-driven self-service for IT, HR, and facilities management.", strengths: ["Fortune 500 customers", "Omnichannel support (Teams, Slack, web)", "Deep ITSM integrations"], weaknesses: ["Smaller team limits roadmap speed", "$75M raised (needs more scale)"], keyProducts: ["Espressive Barista", "Barista for IT", "Barista for HR"], recentMoves: ["$75M Series C funding", "Barista AI native upgrade", "Expanded HR & facilities modules"], customers: ["Dell", "Abbott", "Hewlett Packard Enterprise", "Levi Strauss"] },
  "CrowdStrike": { founded: "2011", hq: "Austin, TX", employees: "10,000+", ceo: "George Kurtz", description: "Leading cloud-native endpoint protection and extended detection & response (XDR) platform with AI-powered threat intelligence and automated response.", strengths: ["$3.1B ARR, 33% growth", "Falcon platform breadth (EDR to SIEM)", "Threat Graph AI processes 1T events/day"], weaknesses: ["Premium pricing", "2024 global IT outage reputational impact"], keyProducts: ["Falcon XDR", "Falcon Fusion SOAR", "Charlotte AI", "Threat Graph", "Next-Gen SIEM"], recentMoves: ["Charlotte AI general availability", "Next-Gen SIEM launch", "Acquired Bionic for ASPM"], customers: ["AMD", "Goldman Sachs", "AWS", "Berkshire Hathaway"] },
  "Palo Alto XSOAR": { founded: "2005", hq: "Santa Clara, CA", employees: "15,000+", ceo: "Nikesh Arora", description: "Industry-leading SOAR platform (Cortex XSOAR) and unified security operations suite combining SIEM, SOAR, and XDR into Cortex.", strengths: ["Most deployed SOAR platform globally", "Cortex platform breadth", "$8B+ security revenue"], weaknesses: ["High total cost", "Platform complexity for mid-market"], keyProducts: ["Cortex XSOAR", "Cortex XDR", "XSIAM", "Cortex Copilot"], recentMoves: ["XSIAM AI-driven SOC platform launch", "Cortex Copilot GA", "Acquired Talon Cyber Security"], customers: ["British Telecom", "Orange", "US Air Force", "Generali Insurance"] },
  "Exabeam": { founded: "2013", hq: "Foster City, CA", employees: "900+", ceo: "Adam Geller", description: "Cloud-native SIEM and security operations platform built on user and entity behavior analytics (UEBA) to detect insider threats and compromised accounts.", strengths: ["UEBA market leader", "28% growth rate", "Behavior-based detection reduces false positives"], weaknesses: ["Revenue scale vs. Microsoft/Splunk", "Competitive from XDR platforms"], keyProducts: ["Exabeam Security Operations Platform", "Smart Timelines", "Threat Center", "UEBA"], recentMoves: ["Merged with LogRhythm (2024)", "New-Scale SIEM launch", "AI-Analyst release"], customers: ["Fidelity", "Intel", "Stanford Health", "City of San Jose"] },
  "Securonix": { founded: "2008", hq: "Addison, TX", employees: "700+", ceo: "Nayaki Nayyar", description: "Cloud-native open XDR platform combining SIEM, SOAR, and UEBA with Spotter AI for natural language threat investigation.", strengths: ["Open XDR architecture", "Spotter AI natural language queries", "Strong MSSPs channel"], weaknesses: ["Not publicly traded (private)", "Brand awareness behind Splunk/Microsoft"], keyProducts: ["Securonix Unified Defense SIEM", "SOAR", "UEBA", "Spotter AI"], recentMoves: ["Spotter AI GA for NL threat hunting", "Acquired Cybersponse (SOAR)", "US$1B+ valuation"], customers: ["Pfizer", "US Army Corps", "Santander", "Fannie Mae"] },
  "Tines": { founded: "2018", hq: "Dublin, Ireland", employees: "300+", ceo: "Eoin Hinchy", description: "No-code security automation platform enabling security teams to build powerful workflows without engineering support, with AI-assisted automation builder.", strengths: ["110% NRR growth rate", "No-code accessibility", "AI Story Builder for workflow creation"], weaknesses: ["Early revenue stage", "Still building enterprise brand"], keyProducts: ["Tines Automation Platform", "AI Story Builder", "Tines Library (1000+ templates)"], recentMoves: ["AI Story Builder launch", "Raised $50M Series B", "1,000+ pre-built workflow library"], customers: ["OpenAI", "Canva", "Intercom", "PagerDuty"] },
  "Torq": { founded: "2020", hq: "Denver, CO", employees: "200+", ceo: "Ofer Smadari", description: "AI-powered security hyperautomation platform that autonomously handles tier-1 SOC alerts end-to-end, reducing analyst workload by 90%+.", strengths: ["120% growth rate", "Autonomous tier-1 case closure", "AI-first architecture"], weaknesses: ["Very early stage ($100M total raised)", "Limited brand outside security-native buyers"], keyProducts: ["Torq HyperSOC", "Autonomous Cases", "Torq AI Security Agents"], recentMoves: ["HyperSOC autonomous case platform launch", "$70M Series B funding", "AI Security Agents release"], customers: ["Wiz", "Semrush", "Fiverr", "Applied Systems"] },
};

// ── Parsers ──────────────────────────────────────────────────────────────────
function parseMarketCapNum(s?: string): number {
  if (!s || s === "—" || s.startsWith("Pre-") || s.startsWith("Early") || s === "Open Source") return 0;
  const m = s.match(/\$(\d+(?:\.\d+)?)\s*([TBM])/i);
  if (!m) return 0;
  const v = parseFloat(m[1]);
  const u = m[2].toUpperCase();
  if (u === "T") return v * 1000;
  if (u === "M") return v / 1000;
  return v; // B
}

function parseRevenueNum(s?: string): number {
  if (!s || s === "—" || s.startsWith("Pre-") || s.startsWith("Early")) return 0;
  const m = s.match(/\$(\d+(?:\.\d+)?)\s*([TBM])/i);
  if (!m) return 0;
  const v = parseFloat(m[1]);
  const u = m[2].toUpperCase();
  if (u === "T") return v * 1000;
  if (u === "M") return v / 1000;
  return v;
}

function parseGrowthNum(s?: string): number {
  if (!s || s === "—") return 0;
  const m = s.match(/([+-]?\d+(?:\.\d+)?)/);
  return m ? parseFloat(m[1]) : 0;
}

// ── Category mappings ─────────────────────────────────────────────────────────
const CATEGORY_LABELS: Record<string, string> = {
  aiops: "AIOps",
  itom: "ITOM",
  rpa: "RPA",
  agentops: "AgentOps",
  secops: "SecOps",
};

const categoryColors: Record<string, string> = {
  "AIOps":    "hsl(199 89% 48%)",
  "ITOM":     "hsl(262 83% 58%)",
  "RPA":      "hsl(142 71% 45%)",
  "AgentOps": "hsl(38 92% 50%)",
  "SecOps":   "hsl(346 77% 49%)",
};

const categoryIcons: Record<string, typeof BarChart3> = {
  "AIOps":    BarChart3,
  "ITOM":     Cpu,
  "RPA":      Bot,
  "AgentOps": Sparkles,
  "SecOps":   ShieldCheck,
};

// ── Build derived vendor rows from allCategories ──────────────────────────────
type VendorRow = {
  name: string;
  type: string;
  marketCap?: string;
  revenue?: string;
  growth?: string;
  highlight?: string;
  description: string;
  categoryId: string;
  categoryLabel: string;
  color: string;
  marketCapNum: number;
  revenueNum: number;
  growthNum: number;
};

const allVendorRows: VendorRow[] = allCategories.flatMap((cat) => {
  const label = CATEGORY_LABELS[cat.id] ?? cat.id;
  const toRow = (v: { name: string; type: string; marketCap?: string; revenue?: string; growth?: string; highlight?: string; description: string }): VendorRow => ({
    name: v.name,
    type: v.type,
    marketCap: v.marketCap,
    revenue: v.revenue,
    growth: v.growth,
    highlight: v.highlight,
    description: v.description,
    categoryId: cat.id,
    categoryLabel: label,
    color: cat.color,
    marketCapNum: parseMarketCapNum(v.marketCap),
    revenueNum: parseRevenueNum(v.revenue),
    growthNum: parseGrowthNum(v.growth),
  });
  return [
    ...((cat.vendors ?? []) as Parameters<typeof toRow>[0][]).map(toRow),
    ...((cat.startups ?? []) as Parameters<typeof toRow>[0][]).map(toRow),
  ];
});

const ALL_CATEGORIES = ["AIOps", "ITOM", "RPA", "AgentOps", "SecOps"];
const ALL_TYPES = ["leader", "challenger", "niche", "startup", "emerging"];

type SortField = "name" | "marketCap" | "revenue" | "growthRate";
type SortDirection = "asc" | "desc";

const VendorComparisonMatrix = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(ALL_CATEGORIES);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(ALL_TYPES);
  const [sortField, setSortField] = useState<SortField>("marketCap");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [marketCapRange, setMarketCapRange] = useState([0, 100]);
  const [revenueRange, setRevenueRange] = useState([0, 100]);
  const [growthRateRange, setGrowthRateRange] = useState([0, 100]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<VendorRow | null>(null);

  const maxMarketCap = 3200;
  const maxRevenue = 65;
  const maxGrowth = 250;

  const normalizeValue = (value: number, max: number) => (Math.log10(value + 1) / Math.log10(max + 1)) * 100;
  const denormalizeValue = (normalized: number, max: number) => Math.pow(10, (normalized / 100) * Math.log10(max + 1)) - 1;

  const filteredAndSortedVendors = useMemo(() => {
    return allVendorRows
      .filter((vendor) => {
        if (searchQuery && !vendor.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        if (!selectedCategories.includes(vendor.categoryLabel)) return false;
        if (!selectedTypes.includes(vendor.type)) return false;
        const normalizedMC = normalizeValue(vendor.marketCapNum, maxMarketCap);
        if (normalizedMC < marketCapRange[0] || normalizedMC > marketCapRange[1]) return false;
        const normalizedRev = normalizeValue(vendor.revenueNum, maxRevenue);
        if (normalizedRev < revenueRange[0] || normalizedRev > revenueRange[1]) return false;
        if (vendor.growthNum < growthRateRange[0] || vendor.growthNum > growthRateRange[1]) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortField === "name") {
          return sortDirection === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        }
        if (sortField === "marketCap") {
          return sortDirection === "asc" ? a.marketCapNum - b.marketCapNum : b.marketCapNum - a.marketCapNum;
        }
        if (sortField === "revenue") {
          return sortDirection === "asc" ? a.revenueNum - b.revenueNum : b.revenueNum - a.revenueNum;
        }
        if (sortField === "growthRate") {
          return sortDirection === "asc" ? a.growthNum - b.growthNum : b.growthNum - a.growthNum;
        }
        return 0;
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
    setSelectedCategories(ALL_CATEGORIES);
    setSelectedTypes(ALL_TYPES);
    setMarketCapRange([0, 100]);
    setRevenueRange([0, 100]);
    setGrowthRateRange([0, 100]);
  };

  const activeFiltersCount =
    (selectedCategories.length < ALL_CATEGORIES.length ? 1 : 0) +
    (selectedTypes.length < ALL_TYPES.length ? 1 : 0) +
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

  const typeLabel: Record<string, string> = {
    leader: "Leader",
    challenger: "Challenger",
    niche: "Niche",
    startup: "Startup",
    emerging: "Emerging",
  };

  const typeBadgeClass: Record<string, string> = {
    leader: "bg-primary/10 text-primary border-primary/30",
    challenger: "bg-accent/10 text-accent border-accent/30",
    niche: "bg-muted text-muted-foreground border-border",
    startup: "bg-executive-amber/10 text-executive-amber border-executive-amber/30",
    emerging: "bg-executive-green/10 text-executive-green border-executive-green/30",
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
            Interactive analysis of {allVendorRows.length} vendors across all five Autonomous IT markets
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
                    {selectedCategories.length < ALL_CATEGORIES.length && (
                      <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                        {selectedCategories.length}
                      </Badge>
                    )}
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {ALL_CATEGORIES.map((cat) => (
                    <DropdownMenuCheckboxItem
                      key={cat}
                      checked={selectedCategories.includes(cat)}
                      onCheckedChange={(checked) => {
                        setSelectedCategories(checked
                          ? [...selectedCategories, cat]
                          : selectedCategories.filter((c) => c !== cat)
                        );
                      }}
                    >
                      <span className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: categoryColors[cat] }} />
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
                    {selectedTypes.length < ALL_TYPES.length && (
                      <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                        {selectedTypes.length}
                      </Badge>
                    )}
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {ALL_TYPES.map((t) => (
                    <DropdownMenuCheckboxItem
                      key={t}
                      checked={selectedTypes.includes(t)}
                      onCheckedChange={(checked) => {
                        setSelectedTypes(checked
                          ? [...selectedTypes, t]
                          : selectedTypes.filter((x) => x !== t)
                        );
                      }}
                    >
                      {typeLabel[t]}
                    </DropdownMenuCheckboxItem>
                  ))}
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
                        Market Cap / Valuation
                      </label>
                      <span className="text-xs text-muted-foreground">
                        {formatMarketCap(denormalizeValue(marketCapRange[0], maxMarketCap))} – {formatMarketCap(denormalizeValue(marketCapRange[1], maxMarketCap))}
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
                        {formatRevenue(denormalizeValue(revenueRange[0], maxRevenue))} – {formatRevenue(denormalizeValue(revenueRange[1], maxRevenue))}
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
                        {growthRateRange[0]}% – {growthRateRange[1]}%
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
          <span>
            Showing <strong className="text-foreground">{filteredAndSortedVendors.length}</strong> of {allVendorRows.length} entries
          </span>
          {selectedCategories.length < ALL_CATEGORIES.length && (
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
                <TableHead>Type</TableHead>
                <TableHead
                  className="cursor-pointer hover:text-foreground transition-colors text-right hidden md:table-cell"
                  onClick={() => handleSort("marketCap")}
                >
                  <div className="flex items-center justify-end gap-2">
                    Mkt Cap / Val
                    <SortIcon field="marketCap" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-foreground transition-colors text-right hidden md:table-cell"
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
                <TableHead className="hidden lg:table-cell">Highlight</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="popLayout">
                {filteredAndSortedVendors.map((vendor, index) => {
                  const CategoryIcon = categoryIcons[vendor.categoryLabel] ?? BarChart3;
                  const rowKey = `${vendor.categoryId}-${vendor.name}`;
                  return (
                    <motion.tr
                      key={rowKey}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: Math.min(index * 0.01, 0.3) }}
                      className="border-border hover:bg-secondary/30 transition-colors cursor-pointer"
                      onClick={() => setSelectedVendor(vendor)}
                    >
                      <TableCell className="font-medium">
                        <span className="text-foreground">{vendor.name}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CategoryIcon
                            className="w-4 h-4"
                            style={{ color: categoryColors[vendor.categoryLabel] }}
                          />
                          <span
                            className="text-sm"
                            style={{ color: categoryColors[vendor.categoryLabel] }}
                          >
                            {vendor.categoryLabel}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-xs ${typeBadgeClass[vendor.type] ?? ""}`}
                        >
                          {typeLabel[vendor.type] ?? vendor.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm hidden md:table-cell">
                        {vendor.marketCap ?? "—"}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm hidden md:table-cell">
                        {vendor.revenue ?? "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        {vendor.growth && vendor.growth !== "—" ? (
                          <div
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium"
                            style={{
                              backgroundColor:
                                vendor.growthNum >= 30
                                  ? "hsl(142 71% 45% / 0.15)"
                                  : vendor.growthNum >= 15
                                  ? "hsl(199 89% 48% / 0.15)"
                                  : "hsl(var(--muted))",
                              color:
                                vendor.growthNum >= 30
                                  ? "hsl(142 71% 45%)"
                                  : vendor.growthNum >= 15
                                  ? "hsl(199 89% 48%)"
                                  : "hsl(var(--muted-foreground))",
                            }}
                          >
                            <TrendingUp className="w-3 h-3" />
                            {vendor.growth}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate hidden lg:table-cell">
                        {vendor.highlight ?? "—"}
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
              {filteredAndSortedVendors.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
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
            <span>15–30% (Moderate)</span>
          </div>
        </motion.div>
      </div>

      {/* Vendor Detail Modal */}
      <Dialog open={!!selectedVendor} onOpenChange={(open) => !open && setSelectedVendor(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-card border-border">
          {selectedVendor && (() => {
            const details = vendorDetails[selectedVendor.name];
            const CategoryIcon = categoryIcons[selectedVendor.categoryLabel] ?? BarChart3;
            if (!details) return (
              <DialogHeader>
                <div className="flex items-center gap-3 mb-1">
                  <CategoryIcon className="w-5 h-5" style={{ color: categoryColors[selectedVendor.categoryLabel] }} />
                  <Badge variant="outline" style={{ borderColor: categoryColors[selectedVendor.categoryLabel], color: categoryColors[selectedVendor.categoryLabel] }}>
                    {selectedVendor.categoryLabel}
                  </Badge>
                  <Badge variant="outline" className={`text-xs ${typeBadgeClass[selectedVendor.type] ?? ""}`}>
                    {typeLabel[selectedVendor.type] ?? selectedVendor.type}
                  </Badge>
                </div>
                <DialogTitle className="text-foreground">{selectedVendor.name}</DialogTitle>
                <p className="text-muted-foreground text-sm mt-1">{selectedVendor.description}</p>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="bg-secondary/50 rounded-lg p-3 text-center">
                    <DollarSign className="w-4 h-4 mx-auto mb-1 text-primary" />
                    <div className="text-sm font-bold text-foreground">{selectedVendor.marketCap ?? "—"}</div>
                    <div className="text-xs text-muted-foreground">Mkt Cap / Val</div>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-3 text-center">
                    <BarChart3 className="w-4 h-4 mx-auto mb-1 text-accent" />
                    <div className="text-sm font-bold text-foreground">{selectedVendor.revenue ?? "—"}</div>
                    <div className="text-xs text-muted-foreground">Revenue</div>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-3 text-center">
                    <TrendingUp className="w-4 h-4 mx-auto mb-1 text-executive-green" />
                    <div className="text-sm font-bold text-foreground">{selectedVendor.growth ?? "—"}</div>
                    <div className="text-xs text-muted-foreground">Growth</div>
                  </div>
                </div>
                {selectedVendor.highlight && (
                  <p className="text-xs text-muted-foreground mt-3">Highlight: {selectedVendor.highlight}</p>
                )}
              </DialogHeader>
            );
            return (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-3 mb-1">
                    <CategoryIcon className="w-5 h-5" style={{ color: categoryColors[selectedVendor.categoryLabel] }} />
                    <Badge variant="outline" style={{ borderColor: categoryColors[selectedVendor.categoryLabel], color: categoryColors[selectedVendor.categoryLabel] }}>
                      {selectedVendor.categoryLabel}
                    </Badge>
                    <Badge variant="outline" className={`text-xs ${typeBadgeClass[selectedVendor.type] ?? ""}`}>
                      {typeLabel[selectedVendor.type] ?? selectedVendor.type}
                    </Badge>
                  </div>
                  <DialogTitle className="text-2xl text-foreground">{selectedVendor.name}</DialogTitle>
                  <p className="text-muted-foreground text-sm mt-1">{details.description}</p>
                </DialogHeader>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="bg-secondary/50 rounded-lg p-3 text-center">
                    <DollarSign className="w-4 h-4 mx-auto mb-1 text-primary" />
                    <div className="text-sm font-bold text-foreground">{selectedVendor.marketCap ?? "—"}</div>
                    <div className="text-xs text-muted-foreground">Mkt Cap / Val</div>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-3 text-center">
                    <BarChart3 className="w-4 h-4 mx-auto mb-1 text-accent" />
                    <div className="text-sm font-bold text-foreground">{selectedVendor.revenue ?? "—"}</div>
                    <div className="text-xs text-muted-foreground">Revenue</div>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-3 text-center">
                    <TrendingUp className="w-4 h-4 mx-auto mb-1 text-executive-green" />
                    <div className="text-sm font-bold text-foreground">{selectedVendor.growth ?? "—"}</div>
                    <div className="text-xs text-muted-foreground">Growth</div>
                  </div>
                </div>

                {/* Company Info */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="flex items-center gap-2 text-sm"><Calendar className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground">Founded:</span><span className="text-foreground">{details.founded}</span></div>
                  <div className="flex items-center gap-2 text-sm"><Globe className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground">HQ:</span><span className="text-foreground">{details.hq}</span></div>
                  <div className="flex items-center gap-2 text-sm"><Users className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground">Employees:</span><span className="text-foreground">{details.employees}</span></div>
                  <div className="flex items-center gap-2 text-sm"><Shield className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground">CEO:</span><span className="text-foreground">{details.ceo}</span></div>
                </div>

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-2 gap-4 mt-5">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2"><Award className="w-4 h-4 text-executive-green" />Strengths</h4>
                    <ul className="space-y-1">
                      {details.strengths.map((s, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                          <span className="text-executive-green mt-0.5">•</span>{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2"><Target className="w-4 h-4 text-executive-amber" />Weaknesses</h4>
                    <ul className="space-y-1">
                      {details.weaknesses.map((w, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                          <span className="text-executive-amber mt-0.5">•</span>{w}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Key Products */}
                <div className="mt-5">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2"><Cpu className="w-4 h-4 text-primary" />Key Products</h4>
                  <div className="flex flex-wrap gap-2">
                    {details.keyProducts.map((p, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">{p}</Badge>
                    ))}
                  </div>
                </div>

                {/* Recent Moves */}
                <div className="mt-5">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2"><Zap className="w-4 h-4 text-executive-amber" />Recent Strategic Moves</h4>
                  <ul className="space-y-1">
                    {details.recentMoves.map((m, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                        <ExternalLink className="w-3 h-3 mt-0.5 text-primary shrink-0" />{m}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Customers */}
                <div className="mt-5">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2"><Building2 className="w-4 h-4 text-accent" />Key Customers</h4>
                  <div className="flex flex-wrap gap-2">
                    {details.customers.map((c, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{c}</Badge>
                    ))}
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default VendorComparisonMatrix;
