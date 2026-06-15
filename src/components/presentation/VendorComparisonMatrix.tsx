import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
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
  GitCompare,
  ArrowUpRight,
  Map as MapIcon,
  TableProperties,
  Radio,
  Crown,
  Activity,
} from "lucide-react";
import { vendorProfiles, toVendorSlug } from "@/data/vendorProfiles";
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid,
  Tooltip as RTooltip, ResponsiveContainer, Cell, ReferenceLine, LabelList,
} from "recharts";
import { ClientOnly } from "vite-react-ssg";
import { Surface } from "@/components/ui/surface";
import { Stat } from "@/components/ui/stat";
import { cn } from "@/lib/utils";
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

const MONTHS: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

function parseEventDate(event?: string): number {
  if (!event) return 0;
  const m = event.match(/(\w{3})\s+(\d{4})/);
  if (!m || !(m[1] in MONTHS)) return 0;
  return new Date(+m[2], MONTHS[m[1]], 1).getTime();
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
  recentEvent?: string;
  recentEventTs: number;
  categoryId: string;
  categoryLabel: string;
  color: string;
  marketCapNum: number;
  revenueNum: number;
  growthNum: number;
};

const allVendorRows: VendorRow[] = allCategories.flatMap((cat) => {
  const label = CATEGORY_LABELS[cat.id] ?? cat.id;
  const toRow = (v: { name: string; type: string; marketCap?: string; revenue?: string; growth?: string; highlight?: string; description: string; recentEvent?: string }): VendorRow => ({
    name: v.name,
    type: v.type,
    marketCap: v.marketCap,
    revenue: v.revenue,
    growth: v.growth,
    highlight: v.highlight,
    description: v.description,
    recentEvent: v.recentEvent,
    recentEventTs: parseEventDate(v.recentEvent),
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

// Growth-filter bounds derived from the data — must span negatives (e.g. OpenText -10%)
// and hypergrowth startups (>100%, up to +500%). A fixed [0,100] range excluded ~59 vendors
// AND made them unreachable (the slider couldn't reach below 0 or above 100).
const GROWTH_MIN = Math.min(0, ...allVendorRows.map((v) => v.growthNum));
const GROWTH_MAX = Math.max(100, ...allVendorRows.map((v) => v.growthNum));

// Growth (y) axis: log-compress like the revenue (x) axis. Plotted on a linear axis as
// log10(growth+1) so a few hypergrowth (+200–500%) outliers don't pancake the 0–60% bulk
// against the baseline; the densest low-growth band gets the most vertical room. The tick
// formatter inverts it back to "+N%". (g≤0 floors to 0 → bottom of the axis.)
const gToY = (g: number) => Math.log10(Math.max(0, g) + 1);
const GROWTH_TICKS = [0, 25, 50, 100, 200, 500];

type SortField = "name" | "marketCap" | "revenue" | "growthRate";
type SortDirection = "asc" | "desc";

/* ── Helpers ──────────────────────────────────────────────────────────── */

function formatSignalDate(ts: number): string {
  if (!ts) return "—";
  const d = new Date(ts);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function formatBubbleRevenue(v: number): string {
  if (v >= 1) return `$${v.toFixed(1)}B`;
  return `$${(v * 1000).toFixed(0)}M`;
}

function formatBubbleMarketCap(v: number): string {
  if (v >= 1000) return `$${(v / 1000).toFixed(1)}T`;
  if (v >= 1) return `$${v.toFixed(1)}B`;
  return `$${(v * 1000).toFixed(0)}M`;
}

/* ── Market Map (bubble plot) ─────────────────────────────────────────── */

interface MarketMapPoint extends VendorRow {
  // ScatterChart needs numeric fields under known keys
  x: number;
  y: number;
  z: number;
  /** true when revenue and/or growth was imputed (not disclosed) → render as an approximate position */
  approx?: boolean;
  approxNote?: string;
}

function MarketMapTooltip({ active, payload }: { active?: boolean; payload?: { payload: MarketMapPoint }[] }) {
  if (!active || !payload || payload.length === 0) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-popover p-3 text-xs shadow-lg">
      <div className="mb-1 flex items-center gap-2">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: categoryColors[p.categoryLabel] }}
        />
        <span className="font-semibold text-foreground">{p.name}</span>
      </div>
      <div className="space-y-0.5 text-muted-foreground">
        <div>{p.categoryLabel} · <span className="capitalize">{p.type}</span></div>
        <div>Revenue: <span className="text-foreground tabular-nums">{p.revenue ?? "—"}</span></div>
        <div>Growth: <span className="text-foreground tabular-nums">{p.growth ?? "—"}</span></div>
        <div>Mkt Cap: <span className="text-foreground tabular-nums">{p.marketCap ?? "—"}{p.marketCapNum === 0 ? " · size est. from revenue" : ""}</span></div>
      </div>
      {p.approx && p.approxNote && (
        <p className="mt-2 text-[10px] italic text-amber-400/80">{p.approxNote}</p>
      )}
      <p className="mt-2 border-t border-border pt-2 text-[10px] uppercase tracking-wider text-primary">
        Click to open profile
      </p>
    </div>
  );
}

/* Custom dot renderer — gives leaders a stronger ring; renders clickable circle.
   Bubble radius capped at 14 (9 on mobile via `compact`) so a few mega-cap names don't
   dominate the plot — on a ~390px canvas the desktop sizes overlap into a single blob.
   Leaders keep the largest minimum so important vendors are always visible. */
const MapDot = (props: { cx?: number; cy?: number; payload?: MarketMapPoint; fill?: string; compact?: boolean }) => {
  const { cx, cy, payload, fill, compact } = props;
  if (cx == null || cy == null || !payload) return null;
  const isLeader = payload.type === "leader";
  const isChallenger = payload.type === "challenger";
  const approx = !!payload.approx;
  const minR = (isLeader ? 5.5 : isChallenger ? 4.5 : 3.5) * (compact ? 0.75 : 1);
  const r = Math.max(minR, Math.min(compact ? 9 : 14, Math.sqrt(payload.z) * (compact ? 1.5 : 2.2)));
  return (
    <g style={{ cursor: "pointer" }}>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={fill}
        fillOpacity={approx ? 0.12 : isLeader ? 0.7 : 0.4}
        stroke={fill}
        strokeWidth={isLeader ? 1.5 : 0.75}
        strokeOpacity={approx ? 0.7 : isLeader ? 1 : 0.5}
        strokeDasharray={approx ? "3 2" : undefined}
      />
    </g>
  );
};

type ShowMode = "leaders" | "top50" | "all";

function MarketMap({
  data, totalCount, notPlotted, medians, navigate, onPeek, selectedCategories, onToggleCategory,
}: {
  data: VendorRow[];
  totalCount: number;
  notPlotted: number;
  medians: { x: number; y: number };
  navigate: ReturnType<typeof useNavigate>;
  onPeek: (v: VendorRow) => void;
  selectedCategories: string[];
  onToggleCategory: (cat: string) => void;
}) {
  const [showMode, setShowMode] = useState<ShowMode>("top50");
  const isMobile = useIsMobile();

  /* Apply show-mode declutter on top of upstream filters */
  const { visiblePoints, xDomainMin, xMax } = (() => {
    let rows = data;
    if (showMode === "leaders") {
      rows = data.filter((v) => v.type === "leader");
    } else if (showMode === "top50") {
      // Rank by whatever scale signal exists (revenue, else market-cap proxy) so growth-only
      // platform leaders aren't all sorted to the bottom and cut from the Top 50.
      rows = [...data]
        .sort((a, b) => (b.revenueNum || b.marketCapNum) - (a.revenueNum || a.marketCapNum))
        .slice(0, 50);
    }
    const realGro = rows.map((v) => v.growthNum).filter((g) => g > 0).sort((a, b) => a - b);
    const medGro = realGro.length ? realGro[Math.floor(realGro.length / 2)] : 20;

    // x placement (axis is LINEAR over log10 units — recharts ignores `ticks` on scale="log"):
    //  • disclosed revenue → log10(revenue)
    //  • undisclosed revenue but known market cap / valuation → log10(cap ÷ 8), the inverse of
    //    the z = revenue × 8 valuation proxy, so those vendors land at a plausible scale
    //    instead of piling into one fixed lane
    //  • neither metric → a compact "undisclosed" band just left of the real data, jittered by
    //    index (deterministic — SSG-safe) so entries never stack into a single pole
    const CAP_TO_REV = 1 / 8;
    const revLogs = rows.filter((v) => v.revenueNum > 0).map((v) => Math.log10(v.revenueNum));
    const revHi = revLogs.length ? Math.max(...revLogs) : 1;
    // Clamp the proxy to just past the largest DISCLOSED revenue — a $3T parent cap would
    // otherwise place its division decades beyond every real data point and stretch the axis.
    // Clamped entries (trillion-cap platform divisions) get a small index jitter spreading
    // LEFT into the chart so they don't restack into a pole at the right edge.
    const proxyX = (cap: number, i: number) => {
      const raw = Math.log10(cap * CAP_TO_REV);
      return raw <= revHi + 0.08 ? raw : revHi + 0.08 - (i % 4) * 0.07;
    };
    const realXs = rows
      .filter((v) => v.revenueNum > 0 || v.marketCapNum > 0)
      .map((v, i) => (v.revenueNum > 0 ? Math.log10(v.revenueNum) : proxyX(v.marketCapNum, i)));
    const xLo = realXs.length ? Math.min(...realXs) : -2;
    const xHi = realXs.length ? Math.max(...realXs) : 1;
    const gutterX = xLo - 0.45;

    // Growth strings are coarse (+60/+80/+100%), so identical values stack into horizontal
    // bands. Spread repeats deterministically by occurrence count, capped at ±2.4% — the
    // tooltip always shows the true disclosed string.
    const seenGrowth = new Map<number, number>();

    const pts: MarketMapPoint[] = rows.map((v, i) => {
      const hasRev = v.revenueNum > 0;
      const hasCap = v.marketCapNum > 0;
      const hasGro = v.growthNum > 0;
      const approx = !hasRev || !hasGro;
      const note = !hasRev
        ? (hasCap
          ? "Revenue not disclosed — position estimated from market cap / valuation"
          : "Revenue not disclosed — shown in the left undisclosed band")
        : "Growth not disclosed — vertical position approximate";
      const x = hasRev
        ? Math.log10(v.revenueNum)
        : hasCap
          ? proxyX(v.marketCapNum, i)
          : gutterX + ((i % 5) - 2) * 0.07;
      const gy = hasGro ? v.growthNum : medGro;
      const seen = seenGrowth.get(gy) ?? 0;
      seenGrowth.set(gy, seen + 1);
      const wiggle = seen === 0 ? 0 : (seen % 2 === 1 ? 1 : -1) * Math.min(Math.ceil(seen / 2) * 0.8, 2.4);
      return {
        ...v,
        x,
        y: gToY(Math.max(0.5, gy + wiggle)),
        // Use actual market cap if parseable; fall back to revenue × 8 as a valuation proxy
        // (typical SaaS/enterprise multiple) so bubble size is always meaningful.
        z: Math.max(v.marketCapNum > 0 ? v.marketCapNum : v.revenueNum * 8, 0.01),
        approx,
        approxNote: approx ? note : undefined,
      };
    });
    return {
      visiblePoints: pts,
      xDomainMin: gutterX - 0.25,
      xMax: Math.max(xHi, gutterX + 0.5),
    };
  })();

  const visibleMedians = (() => {
    if (visiblePoints.length === 0) return medians;
    // Median over DISCLOSED values only (ignore imputed zeros) so the quadrant lines
    // reflect the real distribution, not the left/baseline imputation lanes.
    const xs = visiblePoints.map((v) => v.revenueNum).filter((n) => n > 0).sort((a, b) => a - b);
    const ys = visiblePoints.map((v) => v.growthNum).filter((n) => n > 0).sort((a, b) => a - b);
    // x median is expressed in the same log10 units as the plotted points.
    return {
      x: xs.length ? Math.log10(xs[Math.floor(xs.length / 2)]) : (medians.x > 0 ? Math.log10(medians.x) : 0),
      y: gToY(ys.length ? ys[Math.floor(ys.length / 2)] : medians.y),
    };
  })();

  /* Labels: the largest (by bubble size) DISCLOSED vendor in each occupied quadrant —
     spatially spread by construction — then a greedy data-space pass drops any pair
     still close enough to collide near the median lines. */
  const labeledTop = (() => {
    const pool = visiblePoints.filter((p) => !p.approx);
    const source = pool.length >= 2 ? pool : visiblePoints;
    const byQuadrant = new Map<string, MarketMapPoint>();
    for (const p of [...source].sort((a, b) => b.z - a.z)) {
      const k = `${p.x >= visibleMedians.x ? "R" : "L"}${p.y >= visibleMedians.y ? "T" : "B"}`;
      if (!byQuadrant.has(k)) byQuadrant.set(k, p);
    }
    const xSpan = Math.max(xMax - xDomainMin, 0.001);
    const kept: MarketMapPoint[] = [];
    for (const p of [...byQuadrant.values()].sort((a, b) => b.z - a.z)) {
      if (kept.every((q) => Math.abs(q.x - p.x) / xSpan > 0.18 || Math.abs(q.y - p.y) > 0.3)) kept.push(p);
    }
    return kept;
  })();

  const handleClick = (point: MarketMapPoint) => {
    const slug = toVendorSlug(point.name);
    const hasProfile = !!vendorProfiles[`${point.categoryId}/${slug}`];
    if (hasProfile) navigate(`/vendor/${point.categoryId}/${slug}`);
    else onPeek(point);
  };

  const tokens = {
    grid: "hsl(217 24% 22% / 0.4)",
    axis: "hsl(215 20% 80%)",
    tick: "hsl(217 24% 30%)",
    median: "hsl(215 20% 70% / 0.45)",
    label: "hsl(210 40% 98%)",
    labelHalo: "hsl(222 47% 7%)",
  };

  /* Custom label renderer — adds a dark halo behind text + offsets to avoid bubble overlap.
     Used via LabelList content prop. recharts passes (x, y, value, index, ...) per element.
     `index` maps into `labeledTop`, so the data-space position drives edge-aware anchoring:
     points in the right 40% of the domain anchor "end" (text extends left, never clips the
     right edge); points near the top of the plot drop the label BELOW the bubble. */
  const renderTopLabel = (labelProps: { x?: number | string; y?: number | string; value?: string | number; index?: number }) => {
    const { x: rawX, y: rawY, value, index = 0 } = labelProps;
    const x = typeof rawX === "number" ? rawX : parseFloat(rawX ?? "");
    const y = typeof rawY === "number" ? rawY : parseFloat(rawY ?? "");
    if (!isFinite(x) || !isFinite(y) || !value) return <g key={`empty-${index}`} />;
    const point = labeledTop[index];
    const frac = point ? (point.x - xDomainMin) / Math.max(xMax - xDomainMin, 0.001) : 0.5;
    const anchor: "start" | "end" = frac > 0.6 ? "end" : "start";
    const offsetX = anchor === "end" ? -12 : 12;
    const nearTop = y < 48;
    const offsetY = nearTop ? 28 : index % 2 === 0 ? -24 : -38;
    return (
      <g pointerEvents="none" key={`label-${index}`}>
        {/* connector line */}
        <line
          x1={x}
          y1={nearTop ? y + 6 : y - 6}
          x2={x + offsetX}
          y2={y + offsetY + (nearTop ? -10 : 4)}
          stroke={tokens.label}
          strokeOpacity={0.5}
          strokeDasharray="2 2"
        />
        {/* halo */}
        <text
          x={x + offsetX}
          y={y + offsetY}
          textAnchor={anchor}
          fontSize={11}
          fontWeight={700}
          stroke={tokens.labelHalo}
          strokeWidth={4}
          strokeLinejoin="round"
          paintOrder="stroke"
          fill={tokens.label}
        >
          {String(value)}
        </text>
      </g>
    );
  };

  return (
    <Surface variant="default" padding="lg">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-base font-semibold tracking-tight text-foreground sm:text-lg">
            Market map
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Revenue (x) × growth (y), bubble size = market cap. Click a bubble for the full profile.
          </p>
        </div>

        {/* Show-mode toggle (declutter the chart) */}
        <div className="inline-flex items-center gap-1 rounded-lg border border-border bg-card p-0.5 text-[11px]">
          {([
            { id: "leaders", label: "Leaders" },
            { id: "top50",   label: "Top 50" },
            { id: "all",     label: "All" },
          ] as const).map((opt) => (
            <button
              key={opt.id}
              onClick={() => setShowMode(opt.id)}
              className={cn(
                "rounded-md px-2 py-1 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                showMode === opt.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-pressed={showMode === opt.id}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category legend — separate row so labels never collide with chart content */}
      <div className="mb-3 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
        <span className="mr-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/60">
          Filter map
        </span>
        {Object.entries(categoryColors).map(([cat, color]) => {
          const active = selectedCategories.includes(cat);
          return (
            <button
              key={cat}
              onClick={() => onToggleCategory(cat)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active
                  ? "border-border/60 bg-card text-foreground"
                  : "border-dashed border-border/40 bg-transparent text-muted-foreground/50 hover:text-muted-foreground"
              )}
              aria-pressed={active}
              title={active ? `Hide ${cat}` : `Show only ${cat}`}
            >
              <span
                className={cn("h-2 w-2 rounded-full transition-opacity", active ? "opacity-100" : "opacity-25")}
                style={{ backgroundColor: color }}
              />
              {cat}
            </button>
          );
        })}
      </div>

      {visiblePoints.length === 0 ? (
        <div className="flex h-[440px] items-center justify-center text-sm text-muted-foreground">
          No vendors with both revenue and growth in the current filter.
        </div>
      ) : (
        <div className="relative h-[500px] w-full">
          <ClientOnly fallback={<div className="h-full w-full" />}>
          {() => (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 32, right: 36, bottom: 56, left: 56 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={tokens.grid} />
              <XAxis
                type="number"
                dataKey="x"
                name="Revenue"
                /* x is pre-log10'd onto a LINEAR axis. A numeric min with the "dataMax" KEYWORD
                   max (not a fully-numeric domain) is what lets recharts run its nice-tick
                   generator instead of emitting one tick per scatter point. No tickCount/ticks/
                   interval — same as the Y-axis. The min derives from the visible data (gutter
                   edge) so e.g. Leaders mode fills the canvas instead of wasting the left half. */
                domain={[xDomainMin, "dataMax"]}
                tickFormatter={(v: number) => formatBubbleRevenue(Math.pow(10, v))}
                stroke={tokens.axis}
                tick={{ fontSize: 11 }}
                axisLine={{ stroke: tokens.tick }}
                tickLine={false}
                label={{ value: "Revenue (log)", position: "insideBottom", offset: -36, fill: tokens.axis, fontSize: 10, fontWeight: 600 }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Growth"
                domain={[0, "dataMax"]}
                ticks={GROWTH_TICKS.map(gToY)}
                tickFormatter={(v: number) => `+${Math.round(Math.pow(10, v) - 1)}%`}
                stroke={tokens.axis}
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={56}
                label={{ value: "Growth YoY", angle: -90, position: "insideLeft", offset: 8, fill: tokens.axis, fontSize: 10, fontWeight: 600 }}
              />
              <ZAxis type="number" dataKey="z" range={[40, 600]} name="Market cap" />

              {/* Quadrant guides */}
              <ReferenceLine x={visibleMedians.x} stroke={tokens.median} strokeDasharray="4 4" />
              <ReferenceLine y={visibleMedians.y} stroke={tokens.median} strokeDasharray="4 4" />

              <RTooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={<MarketMapTooltip />}
              />

              <Scatter
                data={visiblePoints}
                /* compact dots below the md breakpoint; animation off — recharts animating
                   350+ SVG nodes on every mode/filter switch is the main interaction jank */
                shape={((props: Record<string, unknown>) => (
                  <MapDot {...(props as object)} compact={isMobile} />
                )) as unknown as React.ComponentType<unknown>}
                isAnimationActive={false}
                onClick={(p) => handleClick(p as unknown as MarketMapPoint)}
              >
                {visiblePoints.map((p, i) => (
                  <Cell key={`cell-${i}`} fill={categoryColors[p.categoryLabel]} />
                ))}
              </Scatter>

              {/* Per-quadrant labeled vendors with custom halo + connector to bubble */}
              <Scatter
                data={labeledTop}
                shape={() => <g />}
                isAnimationActive={false}
              >
                <LabelList dataKey="name" content={renderTopLabel as never} />
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          )}
          </ClientOnly>

          {/* Quadrant labels — diagonal corners, positioned inside the plot area clear of
              the axis tick rows (bottom-left previously collided with the first x tick) */}
          <div className="pointer-events-none absolute right-10 top-1 hidden items-center text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/65 sm:flex">
            High growth · Large scale ↗
          </div>
          <div className="pointer-events-none absolute bottom-24 left-32 hidden items-center text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/55 sm:flex">
            ↙ Slowing · Smaller
          </div>
        </div>
      )}

      {/* Footer: bubble-size legend + plot count */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[11px] text-muted-foreground">
        <span className="inline-flex flex-wrap items-center gap-3">
          <span className="font-medium uppercase tracking-wider text-muted-foreground/70">Bubble size</span>
          <span className="text-[10px] text-muted-foreground/60">(mkt cap · est. from revenue if undisclosed)</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="block h-1.5 w-1.5 rounded-full bg-muted-foreground/70" />
            <span className="tabular-nums">$1B</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="block h-2.5 w-2.5 rounded-full bg-muted-foreground/70" />
            <span className="tabular-nums">$10B</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="block h-4 w-4 rounded-full bg-muted-foreground/70" />
            <span className="tabular-nums">$100B+</span>
          </span>
          <span className="ml-2 inline-flex items-center gap-1.5">
            <span className="block h-2 w-2 rounded-full border border-foreground bg-foreground/40" />
            Leader (brighter ring)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="block h-2.5 w-2.5 rounded-full border border-dashed border-muted-foreground/70 bg-transparent" />
            Dashed = position estimated (rev/growth not disclosed)
          </span>
        </span>
        <span>
          <span className="font-semibold tabular-nums text-foreground">{visiblePoints.length}</span> shown ·{" "}
          <span className="tabular-nums">{totalCount}</span> in filter
          {notPlotted > 0 && (
            <>
              {" · "}
              <span className="tabular-nums text-muted-foreground/70" title="Vendors with no disclosed revenue or growth — not enough data to place on the map">
                +{notPlotted} not plotted
              </span>
            </>
          )}
        </span>
      </div>
    </Surface>
  );
}

/* ── Leaderboard card ─────────────────────────────────────────────────── */

function LeaderboardCard({
  title, icon, rows, valueFor, subtitleFor, navigate, onPeek, max = 4,
}: {
  title: string;
  icon: React.ReactNode;
  rows: VendorRow[];
  valueFor: (v: VendorRow) => string;
  subtitleFor?: (v: VendorRow) => string | undefined;
  navigate: ReturnType<typeof useNavigate>;
  onPeek: (v: VendorRow) => void;
  max?: number;
}) {
  const visible = rows.slice(0, max);
  return (
    <Surface variant="default" padding="sm">
      <div className="mb-2 flex items-center gap-1.5 px-1">
        {icon}
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      </div>
      {visible.length === 0 ? (
        <p className="py-3 text-center text-xs text-muted-foreground">No data in current filter.</p>
      ) : (
        <ol className="space-y-0.5">
          {visible.map((v, i) => {
            const slug = toVendorSlug(v.name);
            const hasProfile = !!vendorProfiles[`${v.categoryId}/${slug}`];
            const subtitle = subtitleFor?.(v);
            return (
              <li key={`${v.categoryId}/${v.name}`}>
                <button
                  onClick={() => hasProfile ? navigate(`/vendor/${v.categoryId}/${slug}`) : onPeek(v)}
                  className="group flex w-full items-center gap-2 rounded-md px-1.5 py-1 text-left transition-colors hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="w-3 shrink-0 text-[10px] font-mono font-semibold tabular-nums text-muted-foreground/60">
                    {i + 1}
                  </span>
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: categoryColors[v.categoryLabel] }}
                  />
                  <div className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-medium text-foreground transition-colors group-hover:text-primary">
                      {v.name}
                    </span>
                    {subtitle && (
                      <span className="block truncate text-[10px] text-muted-foreground/80">
                        {subtitle}
                      </span>
                    )}
                  </div>
                  <span className="shrink-0 text-[11px] font-semibold tabular-nums text-foreground">
                    {valueFor(v)}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      )}
    </Surface>
  );
}

const VendorComparisonMatrix = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(ALL_CATEGORIES);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(ALL_TYPES);
  const [sortField, setSortField] = useState<SortField>("marketCap");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [marketCapRange, setMarketCapRange] = useState([0, 100]);
  const [revenueRange, setRevenueRange] = useState([0, 100]);
  const [growthRateRange, setGrowthRateRange] = useState([GROWTH_MIN, GROWTH_MAX]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<VendorRow | null>(null);
  const [viewMode, setViewMode] = useState<"map" | "table">("map");

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

  /* ── Aggregate stats over the filtered set ─────────────────────────── */
  const aggregateStats = useMemo(() => {
    const total = filteredAndSortedVendors.length;
    const leaders = filteredAndSortedVendors.filter((v) => v.type === "leader").length;
    const withGrowth = filteredAndSortedVendors.filter((v) => v.growthNum > 0);
    const avgGrowth = withGrowth.length > 0
      ? withGrowth.reduce((s, v) => s + v.growthNum, 0) / withGrowth.length
      : 0;
    const sixMonthsAgo = Date.now() - 1000 * 60 * 60 * 24 * 30 * 6;
    const recentSignals = filteredAndSortedVendors.filter((v) => v.recentEventTs >= sixMonthsAgo).length;
    return { total, leaders, avgGrowth, recentSignals };
  }, [filteredAndSortedVendors]);

  /* ── Top movers leaderboards (filtered) ────────────────────────────── */
  const topByGrowth = useMemo(
    () => filteredAndSortedVendors.filter((v) => v.growthNum > 0)
      .sort((a, b) => b.growthNum - a.growthNum)
      .slice(0, 5),
    [filteredAndSortedVendors]
  );

  const topByRevenue = useMemo(
    () => filteredAndSortedVendors.filter((v) => v.revenueNum > 0)
      .sort((a, b) => b.revenueNum - a.revenueNum)
      .slice(0, 5),
    [filteredAndSortedVendors]
  );

  const topBySignals = useMemo(
    () => filteredAndSortedVendors.filter((v) => v.recentEventTs > 0)
      .sort((a, b) => b.recentEventTs - a.recentEventTs)
      .slice(0, 5),
    [filteredAndSortedVendors]
  );

  /* ── Map data: vendors with at least one of revenue / growth ───────────
     (the missing axis is imputed + marked "approximate" in MarketMap). Vendors
     with NEITHER signal can't be placed honestly → counted as not-plotted. */
  const mapData = useMemo(
    () => filteredAndSortedVendors.filter((v) => v.revenueNum > 0 || v.growthNum > 0),
    [filteredAndSortedVendors]
  );
  const notPlottedCount = useMemo(
    () => filteredAndSortedVendors.filter((v) => v.revenueNum <= 0 && v.growthNum <= 0).length,
    [filteredAndSortedVendors]
  );

  /* Quadrant medians for the map's reference lines — disclosed values only */
  const mapMedians = useMemo(() => {
    const xs = mapData.map((v) => v.revenueNum).filter((n) => n > 0).sort((a, b) => a - b);
    const ys = mapData.map((v) => v.growthNum).filter((n) => n > 0).sort((a, b) => a - b);
    if (!xs.length || !ys.length) return { x: 0, y: 0 };
    return { x: xs[Math.floor(xs.length / 2)], y: ys[Math.floor(ys.length / 2)] };
  }, [mapData]);

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
    setGrowthRateRange([GROWTH_MIN, GROWTH_MAX]);
  };

  const activeFiltersCount =
    (selectedCategories.length < ALL_CATEGORIES.length ? 1 : 0) +
    (selectedTypes.length < ALL_TYPES.length ? 1 : 0) +
    (marketCapRange[0] > 0 || marketCapRange[1] < 100 ? 1 : 0) +
    (revenueRange[0] > 0 || revenueRange[1] < 100 ? 1 : 0) +
    (growthRateRange[0] > GROWTH_MIN || growthRateRange[1] < GROWTH_MAX ? 1 : 0);

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
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6 text-center"
        >
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            Market intelligence
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Vendor Comparison Matrix
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-sm text-muted-foreground sm:text-base">
            Interactive analysis of {allVendorRows.length} vendors across all five Autonomous IT Ops markets — visualize the landscape, then drill in.
          </p>
        </motion.div>

        {/* Filter bar — predictable two-row layout: controls on top, chips below */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="mb-5 rounded-xl border border-border bg-card/40 p-3 sm:p-4"
        >
          {/* Row 1: search + advanced + clear */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[240px] flex-1 sm:flex-initial sm:w-80">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search vendors…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 border-border bg-card pl-9 text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            <Button
              variant={isFilterOpen ? "default" : "outline"}
              size="sm"
              className="h-9 gap-1.5"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter className="h-3.5 w-3.5" />
              Advanced
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-[10px]">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-9 text-muted-foreground hover:text-foreground"
              onClick={clearFilters}
              disabled={
                selectedCategories.length === ALL_CATEGORIES.length &&
                selectedTypes.length === ALL_TYPES.length &&
                activeFiltersCount === 0 &&
                !searchQuery
              }
            >
              <X className="mr-1 h-3.5 w-3.5" />
              Reset
            </Button>
          </div>

          {/* Row 2: category chips */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="mr-1 w-20 shrink-0 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70">
              Categories
            </span>
            {ALL_CATEGORIES.map((cat) => {
              const active = selectedCategories.includes(cat);
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategories(active
                      ? selectedCategories.filter((c) => c !== cat)
                      : [...selectedCategories, cat]);
                  }}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active
                      ? "shadow-sm"
                      : "border-dashed border-border/60 bg-transparent text-muted-foreground/60 hover:border-border hover:text-muted-foreground"
                  )}
                  style={
                    active
                      ? {
                          backgroundColor: `${categoryColors[cat]}1f`,
                          borderColor: categoryColors[cat],
                          color: categoryColors[cat],
                        }
                      : undefined
                  }
                  aria-pressed={active}
                >
                  <span
                    className={cn("h-2 w-2 rounded-full transition-opacity", active ? "opacity-100" : "opacity-30")}
                    style={{ backgroundColor: categoryColors[cat] }}
                  />
                  {cat}
                </button>
              );
            })}
            <button
              onClick={() => setSelectedCategories([...ALL_CATEGORIES])}
              className="ml-1 text-[10px] font-medium text-muted-foreground/60 underline-offset-2 transition-colors hover:text-foreground hover:underline"
              disabled={selectedCategories.length === ALL_CATEGORIES.length}
            >
              {selectedCategories.length === ALL_CATEGORIES.length ? "" : "All"}
            </button>
          </div>

          {/* Row 3: type chips */}
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="mr-1 w-20 shrink-0 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70">
              Type
            </span>
            {ALL_TYPES.map((t) => {
              const active = selectedTypes.includes(t);
              return (
                <button
                  key={t}
                  onClick={() => {
                    setSelectedTypes(active
                      ? selectedTypes.filter((x) => x !== t)
                      : [...selectedTypes, t]);
                  }}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active
                      ? "border-primary/60 bg-primary/15 text-primary shadow-sm"
                      : "border-dashed border-border/60 bg-transparent text-muted-foreground/60 hover:border-border hover:text-muted-foreground"
                  )}
                  aria-pressed={active}
                >
                  {typeLabel[t]}
                </button>
              );
            })}
            <button
              onClick={() => setSelectedTypes([...ALL_TYPES])}
              className="ml-1 text-[10px] font-medium text-muted-foreground/60 underline-offset-2 transition-colors hover:text-foreground hover:underline"
              disabled={selectedTypes.length === ALL_TYPES.length}
            >
              {selectedTypes.length === ALL_TYPES.length ? "" : "All"}
            </button>
          </div>
        </motion.div>

        {/* Advanced Filters Panel — collapses under the bar above */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mb-5 grid grid-cols-1 gap-6 rounded-xl border border-border bg-card p-6 md:grid-cols-3">
                {/* Market Cap Filter */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <DollarSign className="h-4 w-4 text-primary" />
                      Market Cap / Valuation
                    </label>
                    <span className="text-xs text-muted-foreground">
                      {formatMarketCap(denormalizeValue(marketCapRange[0], maxMarketCap))} – {formatMarketCap(denormalizeValue(marketCapRange[1], maxMarketCap))}
                    </span>
                  </div>
                  <Slider value={marketCapRange} onValueChange={setMarketCapRange} min={0} max={100} step={1} className="w-full" />
                </div>

                {/* Revenue Filter */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <BarChart3 className="h-4 w-4 text-accent" />
                      Annual Revenue
                    </label>
                    <span className="text-xs text-muted-foreground">
                      {formatRevenue(denormalizeValue(revenueRange[0], maxRevenue))} – {formatRevenue(denormalizeValue(revenueRange[1], maxRevenue))}
                    </span>
                  </div>
                  <Slider value={revenueRange} onValueChange={setRevenueRange} min={0} max={100} step={1} className="w-full" />
                </div>

                {/* Growth Rate Filter */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <TrendingUp className="h-4 w-4 text-success" />
                      Growth Rate
                    </label>
                    <span className="text-xs text-muted-foreground">
                      {growthRateRange[0]}% – {growthRateRange[1]}%
                    </span>
                  </div>
                  <Slider value={growthRateRange} onValueChange={setGrowthRateRange} min={GROWTH_MIN} max={GROWTH_MAX} step={1} className="w-full" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats inline strip + view toggle + result count */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-5 flex flex-wrap items-center gap-2 sm:gap-3"
        >
          <Stat icon={<Building2 className="h-3.5 w-3.5" />} label="Tracked" value={aggregateStats.total} />
          <Stat icon={<Crown className="h-3.5 w-3.5" />} label="Leaders" value={aggregateStats.leaders} tone="primary" />
          <Stat
            icon={<TrendingUp className="h-3.5 w-3.5" />}
            label="Avg growth"
            tone="success"
            value={aggregateStats.avgGrowth > 0 ? `+${aggregateStats.avgGrowth.toFixed(1)}%` : "—"}
          />
          <Stat
            icon={<Activity className="h-3.5 w-3.5" />}
            label="Signals (6 mo)"
            tone="warning"
            value={aggregateStats.recentSignals}
          />

          <span className="ml-auto inline-flex items-center gap-3 text-xs text-muted-foreground">
            <span className="hidden sm:inline">
              <span className="font-semibold tabular-nums text-foreground">{filteredAndSortedVendors.length}</span> of <span className="tabular-nums">{allVendorRows.length}</span>
            </span>

            {/* View toggle */}
            <span className="inline-flex items-center gap-1 rounded-lg border border-border bg-card p-1">
              <button
                onClick={() => setViewMode("map")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  viewMode === "map"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-pressed={viewMode === "map"}
              >
                <MapIcon className="h-3.5 w-3.5" />
                Map
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  viewMode === "table"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-pressed={viewMode === "table"}
              >
                <TableProperties className="h-3.5 w-3.5" />
                Table
              </button>
            </span>
          </span>
        </motion.div>

        {/* Top movers leaderboards (after filters + stats so the data is framed by user-controlled filters first) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3"
        >
          <LeaderboardCard
            title="Fastest growing"
            icon={<TrendingUp className="h-3.5 w-3.5 text-success" />}
            rows={topByGrowth}
            valueFor={(v) => v.growth ?? "—"}
            navigate={navigate}
            onPeek={setSelectedVendor}
          />
          <LeaderboardCard
            title="Largest by ARR"
            icon={<DollarSign className="h-3.5 w-3.5 text-primary" />}
            rows={topByRevenue}
            valueFor={(v) => v.revenue ?? "—"}
            navigate={navigate}
            onPeek={setSelectedVendor}
          />
          <LeaderboardCard
            title="Latest signals"
            icon={<Radio className="h-3.5 w-3.5 text-warning" />}
            rows={topBySignals}
            valueFor={(v) => formatSignalDate(v.recentEventTs)}
            subtitleFor={(v) => v.recentEvent}
            navigate={navigate}
            onPeek={setSelectedVendor}
          />
        </motion.div>

        {/* Market Map view */}
        {viewMode === "map" && (
          <motion.div
            key="map-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MarketMap
              data={mapData}
              totalCount={filteredAndSortedVendors.length}
              notPlotted={notPlottedCount}
              medians={mapMedians}
              navigate={navigate}
              onPeek={setSelectedVendor}
              selectedCategories={selectedCategories}
              onToggleCategory={(cat) => {
                setSelectedCategories((prev) =>
                  prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
                );
              }}
            />
          </motion.div>
        )}

        {/* Table view */}
        {viewMode === "table" && (
        <>
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
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="popLayout">
                {filteredAndSortedVendors.map((vendor, index) => {
                  const CategoryIcon = categoryIcons[vendor.categoryLabel] ?? BarChart3;
                  const rowKey = `${vendor.categoryId}-${vendor.name}`;
                  const slug = toVendorSlug(vendor.name);
                  const profileKey = `${vendor.categoryId}/${slug}`;
                  const hasProfile = !!vendorProfiles[profileKey];
                  const profilePath = `/vendor/${vendor.categoryId}/${slug}`;
                  return (
                    <motion.tr
                      key={rowKey}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: Math.min(index * 0.01, 0.3) }}
                      className="border-border hover:bg-secondary/30 transition-colors cursor-pointer"
                      onClick={() => {
                        if (hasProfile) navigate(profilePath);
                        else setSelectedVendor(vendor);
                      }}
                    >
                      <TableCell className="font-medium">
                        {hasProfile ? (
                          <Link
                            to={profilePath}
                            onClick={(e) => e.stopPropagation()}
                            className="text-foreground transition-colors hover:text-primary"
                          >
                            {vendor.name}
                          </Link>
                        ) : (
                          <span className="text-foreground">{vendor.name}</span>
                        )}
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
                            className={cn(
                              "inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm font-medium tabular-nums",
                              vendor.growthNum >= 30
                                ? "bg-success/15 text-success"
                                : vendor.growthNum >= 15
                                ? "bg-info/15 text-info"
                                : vendor.growthNum < 0
                                ? "bg-danger/15 text-danger"
                                : "bg-muted/40 text-muted-foreground"
                            )}
                          >
                            <TrendingUp className="h-3 w-3" />
                            {vendor.growth}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate hidden lg:table-cell">
                        {vendor.highlight ?? "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex items-center justify-end gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/compare?v=${profileKey}`);
                            }}
                            className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            title="Add to compare"
                          >
                            <GitCompare className="h-3 w-3" />
                            <span className="hidden md:inline">Compare</span>
                          </button>
                          {hasProfile ? (
                            <Link
                              to={profilePath}
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary/10 px-2 py-1 text-[11px] font-medium text-primary transition-colors hover:border-primary/50 hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              title="View full profile"
                            >
                              Profile
                              <ArrowUpRight className="h-3 w-3" />
                            </Link>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedVendor(vendor);
                              }}
                              className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              title="Quick view"
                            >
                              Peek
                            </button>
                          )}
                        </div>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
              {filteredAndSortedVendors.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
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
        </>
        )}

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

          {/* Action footer — always present so users can jump to full profile or compare */}
          {selectedVendor && (() => {
            const slug = toVendorSlug(selectedVendor.name);
            const profileKey = `${selectedVendor.categoryId}/${slug}`;
            const hasProfile = !!vendorProfiles[profileKey];
            return (
              <div className="mt-6 flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
                <button
                  onClick={() => {
                    setSelectedVendor(null);
                    navigate(`/compare?v=${profileKey}`);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <GitCompare className="h-4 w-4" />
                  Add to compare
                </button>
                {hasProfile && (
                  <Link
                    to={`/vendor/${selectedVendor.categoryId}/${slug}`}
                    onClick={() => setSelectedVendor(null)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    View full profile
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default VendorComparisonMatrix;
