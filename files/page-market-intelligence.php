<?php
/**
 * Template Name: Market Intelligence
 * Description: SSR template for Autonomous IT Market Intelligence 2025-2030
 * 
 * All content is server-side rendered in the HTML source for SEO.
 * Charts are progressively enhanced via Chart.js after page load.
 */

// Prevent direct access
if (!defined('ABSPATH')) exit;

// ── Data Arrays (update these when new analyst reports publish) ──────────────
$last_updated = '2026-05-12';
$site_url = get_site_url();
$page_url = get_permalink();
$og_image = get_template_directory_uri() . '/assets/img/og-market-intelligence.png';

// Narrow scope (platform-only) — order: AIOps, ITOM, RPA, Agentic, SecOps
$narrow = [
    ['cat' => 'AIOps & Observability',   'tam25' => 36,   'tam30' => 100,  'cagr' => 22, 'driver' => 'AIOps analytics platforms only'],
    ['cat' => 'ITSM · ITAM · FinOps',   'tam25' => 52,   'tam30' => 94,   'cagr' => 13, 'driver' => 'ITSM + ITOM + ITAM + Cloud FinOps platform software'],
    ['cat' => 'RPA & IPA',              'tam25' => 24,   'tam30' => 74,   'cagr' => 25, 'driver' => 'Platform/software only, excl. services'],
    ['cat' => 'Agentic AI for IT Ops',   'tam25' => 1.2,  'tam30' => 8,    'cagr' => 45, 'driver' => 'IT slice of horizontal enterprise agents'],
    ['cat' => 'SecOps Platform',         'tam25' => 21,   'tam30' => 54,   'cagr' => 21, 'driver' => 'SIEM + SOAR + XDR core stack'],
];

// Broad scope (full envelope) — order: AIOps, ITOM, RPA, Agentic, SecOps
$broad = [
    ['cat' => 'AIOps & Observability',   'tam25' => 62,   'tam30' => 170,  'cagr' => 22, 'includes' => '+ OTel, APM, log management, data observability'],
    ['cat' => 'ITSM · ITAM · FinOps',   'tam25' => 52,   'tam30' => 94,   'cagr' => 13, 'includes' => 'Stable — same envelope (ITSM, ITOM, ITAM, FinOps) in both cuts'],
    ['cat' => 'RPA & IPA',              'tam25' => 28,   'tam30' => 99,   'cagr' => 29, 'includes' => '+ implementation and managed services'],
    ['cat' => 'Agentic AI for IT Ops',   'tam25' => 3,    'tam30' => 40,   'cagr' => 68, 'includes' => '+ all horizontal enterprise agents touching IT'],
    ['cat' => 'SecOps Platform',         'tam25' => 38,   'tam30' => 75,   'cagr' => 15, 'includes' => '+ EDR, NDR, UEBA, threat intelligence'],
];

$narrow_total_25 = array_sum(array_column($narrow, 'tam25'));
$narrow_total_30 = array_sum(array_column($narrow, 'tam30'));
$broad_total_25 = array_sum(array_column($broad, 'tam25'));
$broad_total_30 = array_sum(array_column($broad, 'tam30'));

// Category deep-dive content
$categories = [
    [
        'id'    => 'aiops-observability',
        'title' => 'AIOps & Observability Platforms',
        'icon'  => '📡',
        'narrow_25' => '$36B', 'narrow_30' => '$100B', 'narrow_cagr' => '22%',
        'broad_25'  => '$62B', 'broad_30'  => '$170B', 'broad_cagr'  => '22%',
        'scope_note' => 'Narrow = AIOps analytics platforms. Broad = full observability envelope including OTel-driven APM, log management, and data observability.',
        'description' => 'The most contested category because analysts draw the boundary differently. Mordor Intelligence sizes AIOps at $18.95B in 2026 growing to $37.79B by 2031. Grand View Research takes a narrower cut at $14.60B in 2024 to $36.07B by 2030. Research & Markets captures the broader AIOps+services envelope at $33.78B in 2025 to $99.07B by 2030. Observability platforms alone are sized at $28.5B in 2025 growing to $172.1B by 2035. The variance reflects whether you count OpenTelemetry-era full-stack observability plus AIOps overlays, or just the AIOps analytics layer.',
        'key_signals' => [
            'Palo Alto Networks / Chronosphere acquisition signals SecOps-Observability convergence',
            'SentinelOne / Observo AI deal extends security into telemetry pipelines',
            'OpenTelemetry becoming the de facto collection standard, shifting TAM toward OTel-native platforms',
            'Datadog, Dynatrace, New Relic expanding into AIOps analytics overlays',
        ],
        'sources' => 'Mordor Intelligence, Grand View Research, Research & Markets, Precedence Research',
    ],
    [
        'id'    => 'itsm-itom',
        'title' => 'IT Service, Operations & Asset Management',
        'icon'  => '🔧',
        'narrow_25' => '$52B', 'narrow_30' => '$94B', 'narrow_cagr' => '13%',
        'broad_25'  => '$52B', 'broad_30'  => '$94B', 'broad_cagr'  => '13%',
        'scope_note' => 'Covers ITSM (~$15B) + ITOM (~$36B) + ITAM (~$2B) + Cloud FinOps (~$2B) platform software. Excludes APM/observability (AIOps category) and managed services. Stable envelope in both narrow and broad cuts.',
        'description' => 'The most stable and concentrated category. Mordor Intelligence sizes ITSM at $14.95B in 2026 growing to $32B by 2031 at 16.45% CAGR. ITOM is sized at $36.3B in 2025 forecast to $64.9B by 2030 at 12.30% CAGR. ITAM reaches $3.01B by 2031 at 6.28% CAGR (Mordor 2026). ServiceNow holds roughly 44% ITSM share. FinOps Foundation State of FinOps 2026 (1,192 respondents, $83B+ cloud spend) reports AI cost management at 98% of FinOps teams — up from 63% in 2024 — with 90% now managing SaaS spend, expanding FinOps from cloud to total technology value.',
        'key_signals' => [
            'ServiceNow Moveworks acquisition and AI Agent Orchestrator redefine the ITSM category',
            'Flexera (Gartner Leader for SAM Tools) + Snow Software merger creates largest pure-play ITAM/SAM vendor',
            'FinOps Foundation 2026: AI cost management (GPU/LLM inference) now top new FinOps capability — 98% of teams engaged',
            'ITAM + ITSM convergence: enterprises consolidating asset data into CMDB for AI-driven lifecycle decisions',
        ],
        'sources' => 'Mordor Intelligence (ITSM 2026, ITOM 2025, ITAM 2026), Grand View Research, FinOps Foundation State of FinOps 2026, Gartner Market Guide: Hardware & Software Asset Management Tools (2026)',
    ],
    [
        'id'    => 'rpa-ipa',
        'title' => 'RPA & Intelligent Process Automation',
        'icon'  => '🤖',
        'narrow_25' => '$24B', 'narrow_30' => '$74B', 'narrow_cagr' => '25%',
        'broad_25'  => '$28B', 'broad_30'  => '$99B', 'broad_cagr'  => '29%',
        'scope_note' => 'Narrow = platform/software only. Broad = includes implementation services wrap.',
        'description' => 'Precedence Research puts global RPA at $28.31B in 2025, growing to approximately $247.34B by 2035 at 24.20% CAGR. The critical narrative shift: pure rule-based RPA is being absorbed into agentic automation. Deloitte partnered with UiPath in July 2025 to launch agentic GBS integrating generative AI, workflow orchestration, RPA, and machine learning. UiPath launched its enterprise-grade agentic automation platform with Maestro orchestration in April 2025.',
        'key_signals' => [
            'Category morphing from rule-based RPA into agentic automation — TAM definitions shifting underneath forecast models',
            'UiPath Maestro orchestration platform repositions RPA as AI agent infrastructure',
            'Deloitte-UiPath agentic GBS partnership signals enterprise readiness',
            'Narrow vs. broad spread (~$25B by 2030) reflects services revenue that follows platform adoption',
        ],
        'sources' => 'Precedence Research, Grand View Research, Fortune Business Insights',
    ],
    [
        'id'    => 'agentic-it-ops',
        'title' => 'Agentic AI for IT Operations',
        'icon'  => '🧠',
        'narrow_25' => '$1.2B', 'narrow_30' => '$8B', 'narrow_cagr' => '45%',
        'broad_25'  => '$3B',   'broad_30'  => '$40B', 'broad_cagr'  => '68%',
        'scope_note' => 'Narrow = disciplined carve-out of IT-specific agents. Broad = all horizontal enterprise agents touching IT workflows.',
        'description' => 'The newest and fastest-growing category. Grand View sizes overall enterprise agentic AI at $2.58B in 2024 to $24.50B by 2030 at 46.2% CAGR. MarketsandMarkets projects $40B by 2030 at 47% CAGR. The IT operations slice is much smaller: horizontal enterprise agents in customer operations and IT/security together accounted for $2.18B in 2025, with IT representing roughly half. The strongest ROI is being reported in IT operations (35%) and marketing (30%), and 88% of executives plan to increase AI budgets specifically for agentic AI.',
        'key_signals' => [
            'Fastest-growing category at 45% CAGR (narrow) — did not exist as a named line item two years ago',
            'IT operations showing highest ROI (35%) of any agentic AI use case',
            'Narrow vs. broad spread is the widest (5x) — reflects whether you count just IT agents or all enterprise agents',
            'Vendor taxonomies will keep shifting through 2027 as category boundaries settle',
        ],
        'sources' => 'Grand View Research, MarketsandMarkets, Omdia, Information Matters',
    ],
    [
        'id'    => 'secops-platform',
        'title' => 'Security Operations (SecOps) Platform',
        'icon'  => '🛡️',
        'narrow_25' => '$21B', 'narrow_30' => '$54B', 'narrow_cagr' => '21%',
        'broad_25'  => '$38B', 'broad_30'  => '$75B', 'broad_cagr'  => '15%',
        'scope_note' => 'Narrow = SIEM + SOAR + XDR. Broad = adds EDR, NDR, UEBA, threat intelligence, vulnerability management.',
        'description' => 'The scope question matters most here. Global Growth Insights sizes Security Operations Software at $31.4B in 2025 to $76.2B by 2033 at 11.72% CAGR. Business Research Insights takes a tighter cut at $26.8B in 2024 to $51.68B by 2033. Omdia tracks 10 segments — TH, EDR, NDR, XDR, SIEM, SOAR, RBVM, ASMD, SA & UEBA, and threat intelligence — with forecasts through 2030. The category is being re-segmented: SIEM, SOAR, EDR, XDR, and UEBA are collapsing into unified platforms.',
        'key_signals' => [
            'SIEM/XDR/SOAR collapsing into unified platforms — 10 sub-segments converging',
            'AI SOC startups (Dropzone, Prophet, Radiant, Simbian, Crogl) compete in the narrow SIEM+SOAR+XDR cut',
            'Use narrow for AI SOC disruption thesis; broad for enterprise buyer budget framing',
            'CrowdStrike-Onum deal extends security into data observability',
        ],
        'sources' => 'Global Growth Insights, Business Research Insights, Omdia, MRFR',
    ],
];

// Standalone full-document template — no WordPress theme header/footer.
// OG tags, canonical, and JSON-LD are inlined below; mi_add_meta_tags() in
// functions.php is redundant for this template but kept for sitemap edge-cases.
$og_image_url = 'https://aienterpriseit.com/wp-content/themes/twentytwentyfive/assets/img/og-market-intelligence.png';
?>
<!DOCTYPE html>
<html lang="en-US">
<head>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-FBKDB465ZK"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-FBKDB465ZK');
  </script>

  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Autonomous IT Market Intelligence 2025–2030 | AI Enterprise IT</title>
  <meta name="description" content="TAM analysis across AIOps, ITSM/ITOM, RPA, Agentic IT Ops, and SecOps — narrow and broad scope cuts with source triangulation from 10 analyst firms.">

  <!-- Open Graph -->
  <meta property="og:title" content="Autonomous IT Market Intelligence 2025–2030">
  <meta property="og:description" content="TAM analysis across AIOps, ITSM/ITOM, RPA, Agentic IT Ops, and SecOps — narrow and broad scope cuts with source triangulation.">
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://aienterpriseit.com/market-intelligence/">
  <meta property="og:image" content="<?php echo esc_url($og_image_url); ?>">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="AI Enterprise IT">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Autonomous IT Market Intelligence 2025–2030">
  <meta name="twitter:description" content="TAM analysis across AIOps, ITSM/ITOM, RPA, Agentic IT Ops, and SecOps — narrow and broad scope cuts with source triangulation.">
  <meta name="twitter:image" content="<?php echo esc_url($og_image_url); ?>">
  <link rel="canonical" href="https://aienterpriseit.com/market-intelligence/">
  <meta name="google-site-verification" content="tBqoSsQyBbdV1TlFHF0bimm64jFvrlSOnyrq3P3LOAI">

  <!-- Favicon (reuse plugin hex mark) -->
  <?php
  $favicon_svg = base64_encode('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><linearGradient id="g" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#0EA5E9"/><stop offset="100%" stop-color="#8B5CF6"/></linearGradient></defs><polygon points="20,2 35,11 35,29 20,38 5,29 5,11" fill="url(#g)"/><text x="20" y="25.5" text-anchor="middle" font-size="14" font-weight="800" font-family="Arial,sans-serif" fill="white">AI</text></svg>');
  ?>
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,<?php echo $favicon_svg; ?>">
  <meta name="theme-color" content="#0B1221">

  <!-- Inter font -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap">

  <!-- JSON-LD Structured Data -->
  <script type="application/ld+json">
[
{
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Autonomous IT Market Intelligence 2025–2030",
    "description": "TAM analysis across AIOps, ITSM/ITOM, RPA, Agentic IT Ops, and SecOps — narrow and broad scope cuts with source triangulation from 10 analyst firms.",
    "url": "https://aienterpriseit.com/market-intelligence/",
    "datePublished": "2025-01-01",
    "dateModified": "<?php echo $last_updated; ?>",
    "image": "https://aienterpriseit.com/wp-content/themes/twentytwentyfive/assets/img/og-market-intelligence.png",
    "author": {
        "@type": "Organization",
        "name": "AI Enterprise IT",
        "url": "https://aienterpriseit.com"
    },
    "publisher": {
        "@type": "Organization",
        "name": "AI Enterprise IT",
        "url": "https://aienterpriseit.com",
        "logo": {
            "@type": "ImageObject",
            "url": "https://aienterpriseit.com/wp-content/themes/twentytwentyfive/assets/img/og-market-intelligence.png"
        }
    },
    "about": [
        {"@type": "Thing", "name": "AIOps"},
        {"@type": "Thing", "name": "IT Operations Management"},
        {"@type": "Thing", "name": "Robotic Process Automation"},
        {"@type": "Thing", "name": "Agentic AI"},
        {"@type": "Thing", "name": "Security Operations"}
    ],
    "keywords": "AIOps, ITSM, ITOM, RPA, Agentic IT, SecOps, market intelligence, TAM, enterprise software"
},
{
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": "Autonomous IT Market Size Data 2025–2030",
    "description": "TAM and CAGR data across AIOps ($36B–$100B), ITSM/ITOM ($52B–$94B), RPA ($24B–$74B), Agentic IT Ops ($1.2B–$8B), and SecOps ($21B–$54B) — narrow scope platform-only projections.",
    "url": "https://aienterpriseit.com/market-intelligence/",
    "license": "https://creativecommons.org/licenses/by/4.0/",
    "temporalCoverage": "2025/2030",
    "creator": {
        "@type": "Organization",
        "name": "AI Enterprise IT",
        "url": "https://aienterpriseit.com"
    },
    "variableMeasured": [
        {"@type": "PropertyValue", "name": "AIOps Narrow TAM 2025", "value": "36", "unitCode": "BIL"},
        {"@type": "PropertyValue", "name": "AIOps Narrow TAM 2030", "value": "100", "unitCode": "BIL"},
        {"@type": "PropertyValue", "name": "ITSM+ITOM TAM 2025", "value": "52", "unitCode": "BIL"},
        {"@type": "PropertyValue", "name": "ITSM+ITOM TAM 2030", "value": "94", "unitCode": "BIL"},
        {"@type": "PropertyValue", "name": "RPA Narrow TAM 2025", "value": "24", "unitCode": "BIL"},
        {"@type": "PropertyValue", "name": "RPA Narrow TAM 2030", "value": "74", "unitCode": "BIL"},
        {"@type": "PropertyValue", "name": "Agentic IT Ops TAM 2025", "value": "1.2", "unitCode": "BIL"},
        {"@type": "PropertyValue", "name": "Agentic IT Ops TAM 2030", "value": "8", "unitCode": "BIL"},
        {"@type": "PropertyValue", "name": "SecOps Narrow TAM 2025", "value": "21", "unitCode": "BIL"},
        {"@type": "PropertyValue", "name": "SecOps Narrow TAM 2030", "value": "54", "unitCode": "BIL"}
    ]
}
]
  </script>
</head>
<body>

<style>
/* ── Base layout ──────────────────────────────────────────────── */
:root {
    --mi-bg: #0F172A;
    --mi-surface: #1E293B;
    --mi-surface-alt: #334155;
    --mi-border: #475569;
    --mi-text: #F1F5F9;
    --mi-text-muted: #94A3B8;
    --mi-accent: #0EA5E9;
    --mi-accent-light: #38BDF8;
    --mi-green: #10B981;
    --mi-amber: #F59E0B;
    --mi-pink: #EC4899;
    --mi-purple: #8B5CF6;
    --mi-red: #EF4444;
    --mi-max-width: 1120px;
}

.mi-page {
    background: var(--mi-bg);
    color: var(--mi-text);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    line-height: 1.6;
    padding: 0;
    margin: 0;
    -webkit-font-smoothing: antialiased;
}

.mi-page *, .mi-page *::before, .mi-page *::after {
    box-sizing: border-box;
}

.mi-container {
    max-width: var(--mi-max-width);
    margin: 0 auto;
    padding: 0 24px;
}

/* ── Hero ─────────────────────────────────────────────────────── */
.mi-hero {
    padding: 64px 0 48px;
    border-bottom: 1px solid var(--mi-border);
}

.mi-hero h1 {
    font-size: clamp(28px, 4vw, 42px);
    font-weight: 700;
    letter-spacing: -0.02em;
    margin: 0 0 12px;
    color: #fff;
}

.mi-hero .mi-subtitle {
    font-size: 18px;
    color: var(--mi-text-muted);
    margin: 0 0 24px;
    max-width: 640px;
}

.mi-hero .mi-meta {
    font-size: 13px;
    color: var(--mi-text-muted);
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: center;
}

.mi-hero .mi-meta span {
    display: flex;
    align-items: center;
    gap: 6px;
}

.mi-badge {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.mi-badge--accent {
    background: rgba(14, 165, 233, 0.15);
    color: var(--mi-accent-light);
}

/* ── KPI cards ────────────────────────────────────────────────── */
.mi-kpi-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    padding: 40px 0 32px;
}

.mi-kpi {
    background: var(--mi-surface);
    border: 1px solid var(--mi-border);
    border-radius: 12px;
    padding: 20px;
}

.mi-kpi__label {
    font-size: 12px;
    color: var(--mi-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin: 0 0 8px;
}

.mi-kpi__value {
    font-size: 28px;
    font-weight: 700;
    color: #fff;
    margin: 0;
}

.mi-kpi__value--accent { color: var(--mi-accent-light); }
.mi-kpi__value--green  { color: var(--mi-green); }
.mi-kpi__value--amber  { color: var(--mi-amber); }
.mi-kpi__value--pink   { color: var(--mi-pink); }

.mi-kpi__note {
    font-size: 12px;
    color: var(--mi-text-muted);
    margin: 4px 0 0;
}

/* ── Section styling ──────────────────────────────────────────── */
.mi-section {
    padding: 48px 0;
    border-bottom: 1px solid rgba(71, 85, 105, 0.5);
}

.mi-section:last-child {
    border-bottom: none;
}

.mi-section__title {
    font-size: 24px;
    font-weight: 600;
    margin: 0 0 8px;
    color: #fff;
}

.mi-section__desc {
    font-size: 15px;
    color: var(--mi-text-muted);
    margin: 0 0 32px;
    max-width: 720px;
}

/* ── Tables ───────────────────────────────────────────────────── */
.mi-table-wrap {
    overflow-x: auto;
    margin: 0 0 24px;
    border-radius: 12px;
    border: 1px solid var(--mi-border);
}

.mi-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
    min-width: 640px;
}

.mi-table thead {
    background: var(--mi-surface);
}

.mi-table th {
    padding: 14px 16px;
    text-align: left;
    font-weight: 600;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--mi-text-muted);
    border-bottom: 1px solid var(--mi-border);
}

.mi-table th:not(:first-child) {
    text-align: right;
}

.mi-table td {
    padding: 14px 16px;
    border-bottom: 1px solid rgba(71, 85, 105, 0.4);
    color: var(--mi-text);
}

.mi-table td:not(:first-child) {
    text-align: right;
    font-variant-numeric: tabular-nums;
}

.mi-table td:first-child {
    font-weight: 500;
}

.mi-table tbody tr:last-child td {
    border-bottom: none;
}

.mi-table tfoot {
    background: var(--mi-surface);
}

.mi-table tfoot td {
    padding: 14px 16px;
    font-weight: 600;
    border-top: 1px solid var(--mi-border);
    border-bottom: none;
}

/* ── Chart container ──────────────────────────────────────────── */
.mi-chart-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin: 32px 0;
}

@media (max-width: 768px) {
    .mi-chart-row { grid-template-columns: 1fr; }
}

.mi-chart-box {
    background: var(--mi-surface);
    border: 1px solid var(--mi-border);
    border-radius: 12px;
    padding: 20px;
}

.mi-chart-box__title {
    font-size: 14px;
    font-weight: 600;
    color: var(--mi-text-muted);
    margin: 0 0 16px;
}

.mi-chart-box canvas {
    width: 100% !important;
    height: 280px !important;
}

/* ── Category cards ───────────────────────────────────────────── */
.mi-cat-card {
    background: var(--mi-surface);
    border: 1px solid var(--mi-border);
    border-radius: 12px;
    padding: 28px;
    margin: 0 0 24px;
}

.mi-cat-card__header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 0 0 16px;
}

.mi-cat-card__icon {
    font-size: 28px;
    line-height: 1;
}

.mi-cat-card__title {
    font-size: 20px;
    font-weight: 600;
    color: #fff;
    margin: 0;
}

.mi-cat-card__kpis {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 12px;
    margin: 0 0 20px;
}

.mi-cat-kpi {
    background: rgba(15, 23, 42, 0.5);
    border-radius: 8px;
    padding: 12px;
}

.mi-cat-kpi__label {
    font-size: 11px;
    color: var(--mi-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0 0 4px;
}

.mi-cat-kpi__value {
    font-size: 18px;
    font-weight: 600;
    color: var(--mi-accent-light);
}

.mi-cat-card__scope {
    font-size: 13px;
    color: var(--mi-amber);
    background: rgba(245, 158, 11, 0.08);
    border-left: 3px solid var(--mi-amber);
    padding: 10px 14px;
    border-radius: 0 8px 8px 0;
    margin: 0 0 16px;
}

.mi-cat-card__desc {
    font-size: 15px;
    color: var(--mi-text-muted);
    margin: 0 0 16px;
    line-height: 1.7;
}

.mi-cat-card__signals {
    list-style: none;
    padding: 0;
    margin: 0 0 12px;
}

.mi-cat-card__signals li {
    font-size: 14px;
    color: var(--mi-text);
    padding: 6px 0 6px 20px;
    position: relative;
}

.mi-cat-card__signals li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 14px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--mi-accent);
}

.mi-cat-card__sources {
    font-size: 12px;
    color: var(--mi-text-muted);
    font-style: italic;
}

/* ── Scope comparison boxes ───────────────────────────────────── */
.mi-scope-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin: 32px 0;
}

@media (max-width: 640px) {
    .mi-scope-grid { grid-template-columns: 1fr; }
}

.mi-scope-box {
    border-radius: 12px;
    padding: 20px;
}

.mi-scope-box--narrow {
    background: rgba(139, 92, 246, 0.08);
    border: 1px solid rgba(139, 92, 246, 0.25);
}

.mi-scope-box--broad {
    background: rgba(16, 185, 129, 0.08);
    border: 1px solid rgba(16, 185, 129, 0.25);
}

.mi-scope-box__label {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin: 0 0 8px;
}

.mi-scope-box--narrow .mi-scope-box__label { color: var(--mi-purple); }
.mi-scope-box--broad  .mi-scope-box__label { color: var(--mi-green); }

.mi-scope-box__text {
    font-size: 14px;
    color: var(--mi-text-muted);
    line-height: 1.6;
    margin: 0;
}

/* ── Methodology / footer ─────────────────────────────────────── */
.mi-methodology {
    background: var(--mi-surface);
    border: 1px solid var(--mi-border);
    border-radius: 12px;
    padding: 24px;
    margin: 32px 0 0;
}

.mi-methodology__title {
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    margin: 0 0 12px;
}

.mi-methodology__text {
    font-size: 14px;
    color: var(--mi-text-muted);
    line-height: 1.7;
    margin: 0;
}

.mi-footer {
    padding: 32px 0;
    text-align: center;
    font-size: 13px;
    color: var(--mi-text-muted);
}

/* ── Navigation — matches SPA Navigation component ──────────── */
.mi-nav {
    position: sticky;
    top: 0;
    z-index: 50;
    border-bottom: 1px solid rgba(71,85,105,0.45);
    background: rgba(11,17,33,0.88);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    transition: background 0.3s, border-color 0.3s;
}
.mi-nav__inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 24px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}
/* Logo */
.mi-nav__logo {
    display: flex; align-items: center; gap: 10px;
    text-decoration: none; flex-shrink: 0;
    border-radius: 6px; outline: none;
    opacity: 1; transition: opacity 0.15s;
}
.mi-nav__logo:hover { opacity: 0.9; }
.mi-nav__logo-wordmark { display: flex; flex-direction: column; gap: 3px; }
.mi-nav__logo-name {
    font-size: 13px; font-weight: 700; color: #F8FAFC;
    letter-spacing: -0.01em; white-space: nowrap; line-height: 1;
}
.mi-nav__logo-sub {
    font-size: 9px; font-weight: 600; color: #94A3B8;
    letter-spacing: 0.15em; text-transform: uppercase; white-space: nowrap; line-height: 1;
}
/* Desktop links container */
.mi-nav__desktop {
    display: none; align-items: center; gap: 2px;
}
@media (min-width: 768px) { .mi-nav__desktop { display: flex; } }
/* Shared nav button/link style */
.mi-nav__btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 12px; border-radius: 6px;
    font-size: 13px; font-weight: 500; color: #94A3B8;
    text-decoration: none; background: none; border: none; cursor: pointer;
    font-family: inherit; white-space: nowrap;
    transition: background 0.15s, color 0.15s;
}
.mi-nav__btn:hover { background: rgba(71,85,105,0.3); color: #F8FAFC; }
/* Dropdown */
.mi-nav__dd { position: relative; }
.mi-nav__dd-menu {
    display: none; position: absolute; top: calc(100% + 8px); left: 0;
    min-width: 224px; background: #111827;
    border: 1px solid rgba(71,85,105,0.55); border-radius: 10px;
    padding: 6px; z-index: 200;
    box-shadow: 0 8px 32px rgba(0,0,0,0.45);
}
.mi-nav__dd:hover .mi-nav__dd-menu,
.mi-nav__dd:focus-within .mi-nav__dd-menu { display: block; }
.mi-nav__dd-label {
    font-size: 10px; font-weight: 600; color: #64748B;
    text-transform: uppercase; letter-spacing: 0.15em;
    padding: 6px 10px 4px; display: block;
}
.mi-nav__dd-item {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 10px; border-radius: 6px;
    font-size: 13px; font-weight: 500; color: #F1F5F9;
    text-decoration: none; transition: background 0.1s;
}
.mi-nav__dd-item:hover { background: rgba(71,85,105,0.4); }
.mi-nav__dd-dot {
    width: 16px; height: 16px; border-radius: 4px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
/* Primary (Export/CTA) button — matches SPA bg-primary */
.mi-nav__primary {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 6px;
    font-size: 13px; font-weight: 600;
    background: hsl(198,93%,60%); color: hsl(222,47%,7%);
    text-decoration: none; white-space: nowrap; flex-shrink: 0;
    border: none; cursor: pointer; font-family: inherit;
    outline: none; transition: opacity 0.15s;
}
.mi-nav__primary:hover { opacity: 0.9; }
/* Chevron icon */
.mi-nav__chevron {
    width: 14px; height: 14px; opacity: 0.6;
    flex-shrink: 0;
}
/* Mobile hamburger */
.mi-nav__mobile-btn {
    display: flex; align-items: center; justify-content: center;
    width: 40px; height: 40px; border-radius: 6px;
    border: none; background: none; color: #F1F5F9; cursor: pointer;
    flex-shrink: 0; font-size: 22px; line-height: 1;
}
.mi-nav__mobile-btn:hover { background: rgba(71,85,105,0.3); }
@media (min-width: 768px) { .mi-nav__mobile-btn { display: none; } }
/* Mobile slide-down menu */
.mi-nav__mobile-menu {
    display: none; background: #0B1121;
    border-bottom: 1px solid rgba(71,85,105,0.35);
    padding: 12px 16px 20px;
}
.mi-nav__mobile-menu.is-open { display: block; }
.mi-nav__mobile-section {
    font-size: 10px; font-weight: 600; color: #64748B;
    text-transform: uppercase; letter-spacing: 0.15em;
    padding: 10px 8px 4px; display: block;
}
.mi-nav__mobile-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 8px; border-radius: 6px;
    font-size: 13px; font-weight: 500; color: #F1F5F9;
    text-decoration: none; transition: background 0.1s;
}
.mi-nav__mobile-item:hover { background: rgba(71,85,105,0.3); }
</style>

<div class="mi-page">

<!-- ════ NAVIGATION — matches SPA Navigation component ════ -->
<header class="mi-nav" id="mi-nav-header">
    <nav class="mi-nav__inner">

        <!-- Logo (hexagonal mark + wordmark) -->
        <a href="/market-intelligence/" class="mi-nav__logo" aria-label="AI Enterprise IT — Market Intelligence Home">
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <defs>
                    <linearGradient id="nav-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stop-color="#0EA5E9"/>
                        <stop offset="100%" stop-color="#8B5CF6"/>
                    </linearGradient>
                </defs>
                <polygon points="20,2 35,11 35,29 20,38 5,29 5,11" fill="url(#nav-grad)"/>
                <polygon points="20,7.5 30.5,13.75 30.5,26.25 20,32.5 9.5,26.25 9.5,13.75" fill="none" stroke="white" stroke-opacity="0.18" stroke-width="1"/>
                <circle cx="20" cy="2"  r="2.2" fill="#38BDF8"/>
                <circle cx="35" cy="11" r="2.2" fill="#67E8F9"/>
                <circle cx="35" cy="29" r="2.2" fill="#A78BFA"/>
                <circle cx="20" cy="38" r="2.2" fill="#8B5CF6"/>
                <circle cx="5"  cy="29" r="2.2" fill="#A78BFA"/>
                <circle cx="5"  cy="11" r="2.2" fill="#38BDF8"/>
                <text x="20" y="25.5" text-anchor="middle" font-size="14" font-weight="800" font-family="Arial,system-ui,sans-serif" fill="white" letter-spacing="0.5">AI</text>
            </svg>
            <span class="mi-nav__logo-wordmark">
                <span class="mi-nav__logo-name">AI Enterprise IT</span>
                <span class="mi-nav__logo-sub">Market Intelligence</span>
            </span>
        </a>

        <!-- Desktop nav -->
        <div class="mi-nav__desktop">

            <!-- Markets dropdown -->
            <div class="mi-nav__dd">
                <button class="mi-nav__btn" aria-haspopup="true">
                    <svg class="mi-nav__chevron" style="width:16px;height:16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                    Markets
                    <svg class="mi-nav__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                </button>
                <div class="mi-nav__dd-menu" role="menu">
                    <span class="mi-nav__dd-label">Markets</span>
                    <a href="/market-intelligence/market/aiops" class="mi-nav__dd-item" role="menuitem">
                        <span class="mi-nav__dd-dot" style="background:rgba(56,189,248,0.15);">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" stroke-width="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                        </span>
                        AIOps &amp; Observability
                    </a>
                    <a href="/market-intelligence/market/itom" class="mi-nav__dd-item" role="menuitem">
                        <span class="mi-nav__dd-dot" style="background:rgba(16,185,129,0.15);">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><rect x="4" y="4" width="16" height="16" rx="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>
                        </span>
                        IT Service &amp; Ops Mgmt
                    </a>
                    <a href="/market-intelligence/market/rpa" class="mi-nav__dd-item" role="menuitem">
                        <span class="mi-nav__dd-dot" style="background:rgba(245,158,11,0.15);">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><circle cx="12" cy="6" r="3"/><line x1="12" y1="9" x2="12" y2="11"/></svg>
                        </span>
                        RPA &amp; Intelligent Auto.
                    </a>
                    <a href="/market-intelligence/market/agentops" class="mi-nav__dd-item" role="menuitem">
                        <span class="mi-nav__dd-dot" style="background:rgba(236,72,153,0.15);">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#EC4899" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        </span>
                        Agentic Operations
                    </a>
                    <a href="/market-intelligence/market/secops" class="mi-nav__dd-item" role="menuitem">
                        <span class="mi-nav__dd-dot" style="background:rgba(139,92,246,0.15);">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        </span>
                        Security Operations
                    </a>
                </div>
            </div>

            <!-- Resources -->
            <a href="/market-intelligence/signals" class="mi-nav__btn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></svg>
                Signals
            </a>
            <a href="/market-intelligence/pricing" class="mi-nav__btn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                Pricing
            </a>
            <a href="/market-intelligence/compare" class="mi-nav__btn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                Compare
            </a>
            <a href="/market-intelligence/about" class="mi-nav__btn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                About
            </a>

            <!-- Open Dashboard button — matches SPA bg-primary -->
            <a href="/market-intelligence/overview/" class="mi-nav__primary" style="margin-left:6px;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Open Dashboard
            </a>
        </div>

        <!-- Mobile hamburger -->
        <button class="mi-nav__mobile-btn" id="mi-mobile-btn" aria-label="Open menu" aria-expanded="false">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
    </nav>

    <!-- Mobile menu panel -->
    <div class="mi-nav__mobile-menu" id="mi-mobile-menu" role="navigation" aria-label="Mobile navigation">
        <span class="mi-nav__mobile-section">Markets</span>
        <a href="/market-intelligence/market/aiops"    class="mi-nav__mobile-item">AIOps &amp; Observability</a>
        <a href="/market-intelligence/market/itom"     class="mi-nav__mobile-item">IT Service &amp; Ops Mgmt</a>
        <a href="/market-intelligence/market/rpa"      class="mi-nav__mobile-item">RPA &amp; Intelligent Auto.</a>
        <a href="/market-intelligence/market/agentops" class="mi-nav__mobile-item">Agentic Operations</a>
        <a href="/market-intelligence/market/secops"   class="mi-nav__mobile-item">Security Operations</a>
        <span class="mi-nav__mobile-section">Resources</span>
        <a href="/market-intelligence/signals"  class="mi-nav__mobile-item">Signals</a>
        <a href="/market-intelligence/pricing"  class="mi-nav__mobile-item">Pricing</a>
        <a href="/market-intelligence/compare"  class="mi-nav__mobile-item">Compare</a>
        <a href="/market-intelligence/about"    class="mi-nav__mobile-item">About</a>
        <span class="mi-nav__mobile-section">Dashboard</span>
        <a href="/market-intelligence/overview/" class="mi-nav__mobile-item" style="color:hsl(198,93%,60%);">Open interactive dashboard →</a>
    </div>
</header>

<script>
(function() {
    var btn = document.getElementById('mi-mobile-btn');
    var menu = document.getElementById('mi-mobile-menu');
    if (btn && menu) {
        btn.addEventListener('click', function() {
            var open = menu.classList.toggle('is-open');
            btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }
})();
</script>

<div class="mi-container">

    <!-- ════ HERO ════ -->
    <header class="mi-hero">
        <span class="mi-badge mi-badge--accent">2025–2030 analysis</span>
        <h1>Autonomous IT Market Intelligence</h1>
        <p class="mi-subtitle">
            TAM analysis across five categories — AIOps, ITSM/ITOM, RPA, Agentic IT Ops, and SecOps — 
            with narrow (platform-only) and broad (full envelope) scope cuts for different IT Ops use cases.
        </p>
        <div class="mi-meta">
            <span>Last updated: <?php echo date('F j, Y', strtotime($last_updated)); ?></span>
            <span>|</span>
            <span>Sources: Gartner, IDC, Mordor Intelligence, Grand View Research, MarketsandMarkets, Omdia, Precedence Research</span>
        </div>
    </header>

    <!-- ════ KPI SUMMARY ════ -->
    <div class="mi-kpi-grid">
        <div class="mi-kpi">
            <p class="mi-kpi__label">Narrow 2025 TAM</p>
            <p class="mi-kpi__value mi-kpi__value--accent">~$<?php echo number_format($narrow_total_25, 1); ?>B</p>
            <p class="mi-kpi__note">Platform-only scope</p>
        </div>
        <div class="mi-kpi">
            <p class="mi-kpi__label">Narrow 2030 TAM</p>
            <p class="mi-kpi__value mi-kpi__value--accent">~$<?php echo number_format($narrow_total_30, 1); ?>B</p>
        </div>
        <div class="mi-kpi">
            <p class="mi-kpi__label">Broad 2025 TAM</p>
            <p class="mi-kpi__value mi-kpi__value--green">~$<?php echo number_format($broad_total_25, 1); ?>B</p>
            <p class="mi-kpi__note">Full envelope scope</p>
        </div>
        <div class="mi-kpi">
            <p class="mi-kpi__label">Broad 2030 TAM</p>
            <p class="mi-kpi__value mi-kpi__value--green">~$<?php echo number_format($broad_total_30, 1); ?>B</p>
        </div>
        <div class="mi-kpi">
            <p class="mi-kpi__label">Scope delta 2030</p>
            <p class="mi-kpi__value mi-kpi__value--amber">~$<?php echo number_format($broad_total_30 - $narrow_total_30, 0); ?>B</p>
            <p class="mi-kpi__note">Where category boundaries shift</p>
        </div>
        <div class="mi-kpi">
            <p class="mi-kpi__label">Fastest growing</p>
            <p class="mi-kpi__value mi-kpi__value--pink">Agentic IT</p>
            <p class="mi-kpi__note">~45% CAGR (narrow)</p>
        </div>
    </div>

    <!-- ════ EXPLORE DASHBOARD CTA ════ -->
    <section class="mi-section" id="explore" style="padding:28px 0;">
        <div style="background:linear-gradient(135deg,rgba(14,165,233,0.10) 0%,rgba(139,92,246,0.12) 100%);border:1px solid rgba(14,165,233,0.30);border-radius:16px;padding:28px 32px 24px;">
            <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:24px;flex-wrap:wrap;margin-bottom:20px;">
                <div>
                    <h2 style="font-size:18px;font-weight:700;color:#fff;margin:0 0 6px;letter-spacing:-0.01em;">Explore the interactive vendor dashboard</h2>
                    <p style="font-size:14px;color:var(--mi-text-muted);margin:0;max-width:520px;line-height:1.5;">500+ vendors across all 5 categories — sortable tables, SWOT profiles, market signals, and head-to-head comparison.</p>
                </div>
                <a href="/market-intelligence/overview/" style="display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,#0EA5E9,#8B5CF6);color:#fff;font-weight:700;font-size:14px;padding:11px 24px;border-radius:8px;text-decoration:none;white-space:nowrap;flex-shrink:0;letter-spacing:0.01em;margin-top:2px;">
                    Explore dashboard &rarr;
                </a>
            </div>
            <!-- Quick market links -->
            <div style="display:flex;flex-wrap:wrap;gap:8px;">
                <a href="/market-intelligence/market/aiops" style="display:inline-flex;align-items:center;gap:6px;background:rgba(14,165,233,0.12);border:1px solid rgba(14,165,233,0.35);color:#38BDF8;font-size:13px;font-weight:500;padding:6px 14px;border-radius:20px;text-decoration:none;">
                    <span style="width:6px;height:6px;border-radius:50%;background:#38BDF8;display:inline-block;"></span>AIOps &amp; Observability
                </a>
                <a href="/market-intelligence/market/itom" style="display:inline-flex;align-items:center;gap:6px;background:rgba(16,185,129,0.10);border:1px solid rgba(16,185,129,0.30);color:#10B981;font-size:13px;font-weight:500;padding:6px 14px;border-radius:20px;text-decoration:none;">
                    <span style="width:6px;height:6px;border-radius:50%;background:#10B981;display:inline-block;"></span>ITSM / ITOM
                </a>
                <a href="/market-intelligence/market/rpa" style="display:inline-flex;align-items:center;gap:6px;background:rgba(245,158,11,0.10);border:1px solid rgba(245,158,11,0.30);color:#F59E0B;font-size:13px;font-weight:500;padding:6px 14px;border-radius:20px;text-decoration:none;">
                    <span style="width:6px;height:6px;border-radius:50%;background:#F59E0B;display:inline-block;"></span>RPA &amp; IPA
                </a>
                <a href="/market-intelligence/market/agentops" style="display:inline-flex;align-items:center;gap:6px;background:rgba(236,72,153,0.10);border:1px solid rgba(236,72,153,0.30);color:#EC4899;font-size:13px;font-weight:500;padding:6px 14px;border-radius:20px;text-decoration:none;">
                    <span style="width:6px;height:6px;border-radius:50%;background:#EC4899;display:inline-block;"></span>Agentic IT Ops
                </a>
                <a href="/market-intelligence/market/secops" style="display:inline-flex;align-items:center;gap:6px;background:rgba(139,92,246,0.10);border:1px solid rgba(139,92,246,0.30);color:#8B5CF6;font-size:13px;font-weight:500;padding:6px 14px;border-radius:20px;text-decoration:none;">
                    <span style="width:6px;height:6px;border-radius:50%;background:#8B5CF6;display:inline-block;"></span>SecOps Platform
                </a>
                <a href="/market-intelligence/signals" style="display:inline-flex;align-items:center;gap:6px;background:rgba(71,85,105,0.25);border:1px solid rgba(71,85,105,0.40);color:#94A3B8;font-size:13px;font-weight:500;padding:6px 14px;border-radius:20px;text-decoration:none;">
                    Market Signals
                </a>
                <a href="/market-intelligence/compare" style="display:inline-flex;align-items:center;gap:6px;background:rgba(71,85,105,0.25);border:1px solid rgba(71,85,105,0.40);color:#94A3B8;font-size:13px;font-weight:500;padding:6px 14px;border-radius:20px;text-decoration:none;">
                    Compare Vendors
                </a>
            </div>
        </div>
    </section>

    <!-- ════ SCOPE COMPARISON ════ -->
    <section class="mi-section" id="scope-comparison">
        <h2 class="mi-section__title">Narrow vs. broad scope</h2>
        <p class="mi-section__desc">
            Every TAM number in Autonomous IT Ops depends on where you draw the category boundary. 
            We present both cuts so you can choose the right framing for your audience.
        </p>

        <div class="mi-scope-grid">
            <div class="mi-scope-box mi-scope-box--narrow">
                <p class="mi-scope-box__label">Narrow cut — when to use</p>
                <p class="mi-scope-box__text">
                    AI SOC disruption thesis, vendor competitive analysis, isolating the displaceable market. 
                    Strips out commoditized adjacencies like EDR, NDR, managed services, broader observability tooling.
                </p>
            </div>
            <div class="mi-scope-box mi-scope-box--broad">
                <p class="mi-scope-box__label">Broad cut — when to use</p>
                <p class="mi-scope-box__text">
                    Buyer-budget framing, CIO decks, platform consolidation narratives. 
                    Reflects how enterprises actually line-item spend across telemetry, security, and service management.
                </p>
            </div>
        </div>

        <!-- Narrow table (SSR — visible before JS) -->
        <h3 style="font-size:16px; font-weight:600; color:var(--mi-text-muted); margin:32px 0 12px;">Narrow scope (platform-only)</h3>
        <div class="mi-table-wrap">
            <table class="mi-table">
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>2025 TAM</th>
                        <th>2030 TAM</th>
                        <th>CAGR</th>
                        <th>Scope basis</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($narrow as $row): ?>
                    <tr>
                        <td><?php echo esc_html($row['cat']); ?></td>
                        <td>$<?php echo number_format($row['tam25'], 1); ?>B</td>
                        <td>$<?php echo number_format($row['tam30'], 1); ?>B</td>
                        <td><?php echo $row['cagr']; ?>%</td>
                        <td style="text-align:left; font-size:12px; color:var(--mi-text-muted);"><?php echo esc_html($row['driver']); ?></td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
                <tfoot>
                    <tr>
                        <td>Combined</td>
                        <td>~$<?php echo number_format($narrow_total_25, 1); ?>B</td>
                        <td>~$<?php echo number_format($narrow_total_30, 1); ?>B</td>
                        <td>~20%</td>
                        <td></td>
                    </tr>
                </tfoot>
            </table>
        </div>

        <!-- Broad table -->
        <h3 style="font-size:16px; font-weight:600; color:var(--mi-text-muted); margin:32px 0 12px;">Broad scope (full envelope)</h3>
        <div class="mi-table-wrap">
            <table class="mi-table">
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>2025 TAM</th>
                        <th>2030 TAM</th>
                        <th>CAGR</th>
                        <th>What changes</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($broad as $row): ?>
                    <tr>
                        <td><?php echo esc_html($row['cat']); ?></td>
                        <td>$<?php echo number_format($row['tam25'], 1); ?>B</td>
                        <td>$<?php echo number_format($row['tam30'], 1); ?>B</td>
                        <td><?php echo $row['cagr']; ?>%</td>
                        <td style="text-align:left; font-size:12px; color:var(--mi-text-muted);"><?php echo esc_html($row['includes']); ?></td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
                <tfoot>
                    <tr>
                        <td>Combined</td>
                        <td>~$<?php echo number_format($broad_total_25, 1); ?>B</td>
                        <td>~$<?php echo number_format($broad_total_30, 1); ?>B</td>
                        <td>~20%</td>
                        <td></td>
                    </tr>
                </tfoot>
            </table>
        </div>

        <!-- Charts (progressive enhancement — JS renders after HTML) -->
        <div class="mi-chart-row">
            <div class="mi-chart-box">
                <p class="mi-chart-box__title">2030 TAM: narrow vs. broad</p>
                <canvas id="mi-chart-scope" aria-label="Bar chart comparing narrow and broad 2030 TAM across five categories"></canvas>
            </div>
            <div class="mi-chart-box">
                <p class="mi-chart-box__title">CAGR by category (narrow scope)</p>
                <canvas id="mi-chart-cagr" aria-label="Horizontal bar chart of CAGR for five Autonomous IT categories"></canvas>
            </div>
        </div>
    </section>

    <!-- ════ CATEGORY DEEP DIVES ════ -->
    <section class="mi-section" id="categories">
        <h2 class="mi-section__title">Category deep dives</h2>
        <p class="mi-section__desc">
            Each category includes narrow and broad TAM, key market signals, and source citations.
        </p>

        <?php foreach ($categories as $cat): ?>
        <article class="mi-cat-card" id="<?php echo esc_attr($cat['id']); ?>">
            <div class="mi-cat-card__header">
                <span class="mi-cat-card__icon"><?php echo $cat['icon']; ?></span>
                <h3 class="mi-cat-card__title"><?php echo esc_html($cat['title']); ?></h3>
            </div>
            <div class="mi-cat-card__kpis">
                <div class="mi-cat-kpi">
                    <p class="mi-cat-kpi__label">Narrow 2025</p>
                    <p class="mi-cat-kpi__value"><?php echo $cat['narrow_25']; ?></p>
                </div>
                <div class="mi-cat-kpi">
                    <p class="mi-cat-kpi__label">Narrow 2030</p>
                    <p class="mi-cat-kpi__value"><?php echo $cat['narrow_30']; ?></p>
                </div>
                <div class="mi-cat-kpi">
                    <p class="mi-cat-kpi__label">Broad 2025</p>
                    <p class="mi-cat-kpi__value"><?php echo $cat['broad_25']; ?></p>
                </div>
                <div class="mi-cat-kpi">
                    <p class="mi-cat-kpi__label">Broad 2030</p>
                    <p class="mi-cat-kpi__value"><?php echo $cat['broad_30']; ?></p>
                </div>
                <div class="mi-cat-kpi">
                    <p class="mi-cat-kpi__label">CAGR (narrow)</p>
                    <p class="mi-cat-kpi__value"><?php echo $cat['narrow_cagr']; ?></p>
                </div>
            </div>
            <div class="mi-cat-card__scope">
                <?php echo esc_html($cat['scope_note']); ?>
            </div>
            <p class="mi-cat-card__desc"><?php echo esc_html($cat['description']); ?></p>
            <h4 style="font-size:14px; font-weight:600; color:var(--mi-accent-light); margin:0 0 8px;">Key market signals</h4>
            <ul class="mi-cat-card__signals">
                <?php foreach ($cat['key_signals'] as $signal): ?>
                <li><?php echo esc_html($signal); ?></li>
                <?php endforeach; ?>
            </ul>
            <p class="mi-cat-card__sources">Sources: <?php echo esc_html($cat['sources']); ?></p>
        </article>
        <?php endforeach; ?>
    </section>

    <!-- ════ SCOPE ARBITRAGE ════ -->
    <section class="mi-section" id="scope-arbitrage">
        <h2 class="mi-section__title">The scope arbitrage zone</h2>
        <p class="mi-section__desc">
            The ~$<?php echo number_format($broad_total_30 - $narrow_total_30, 0); ?>B delta between narrow and broad 2030 TAM 
            is where category definitions are actively shifting.
        </p>
        <div class="mi-methodology">
            <h3 class="mi-methodology__title">Why scope cuts matter</h3>
            <p class="mi-methodology__text">
                Observability platforms are absorbing AIOps. SecOps is absorbing telemetry pipelines. 
                Agentic AI is absorbing RPA. ITSM is extending into ITOM and AIOps via ServiceNow's AI Agent Orchestrator.
                The clean TAM charts are a 2024-era artifact — by 2027 the analyst houses will be forced to re-cut.
                Whichever platforms own "AI-native ITOM" and "unified SecOps" by 2027 capture both pools.
            </p>
        </div>
    </section>

    <!-- ════ METHODOLOGY ════ -->
    <section class="mi-section" id="methodology">
        <h2 class="mi-section__title">Methodology</h2>
        <div class="mi-methodology">
            <h3 class="mi-methodology__title">Source triangulation</h3>
            <p class="mi-methodology__text">
                Each category is sized using 3–5 independent analyst sources (Mordor Intelligence, Grand View Research, 
                MarketsandMarkets, Precedence Research, Omdia, Global Growth Insights, Fortune Business Insights, 
                Business Research Insights, MRFR, Information Matters). We take the midpoint of credible estimates 
                after normalizing for scope differences. Narrow and broad cuts are not different sources — they 
                reflect different category boundary definitions applied to the same underlying data.
                All figures are in USD. 2025 is the base year; 2030 is the projection year. CAGRs are calculated 
                from the midpoint estimates. Numbers are rounded and should be treated as order-of-magnitude guidance, 
                not precision forecasts.
            </p>
        </div>
    </section>

    <!-- ════ FOOTER ════ -->
    <footer class="mi-footer">
        <p>&copy; <?php echo date('Y'); ?> aienterpriseit.com — Autonomous IT Market Intelligence</p>
        <p style="margin:8px 0 0;">Data last refreshed: <?php echo date('F j, Y', strtotime($last_updated)); ?></p>
    </footer>

</div><!-- .mi-container -->

<!-- ════ CHART.JS (progressive enhancement) ════ -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function () {
    var labels = <?php echo json_encode(array_column($narrow, 'cat')); ?>;
    var narrow30 = <?php echo json_encode(array_column($narrow, 'tam30')); ?>;
    var broad30  = <?php echo json_encode(array_column($broad, 'tam30')); ?>;
    var cagrs    = <?php echo json_encode(array_column($narrow, 'cagr')); ?>;

    var chartDefaults = {
        color: '#94A3B8',
        borderColor: 'rgba(71,85,105,0.4)',
        font: { family: 'Inter, sans-serif', size: 11 }
    };
    Chart.defaults.color = chartDefaults.color;
    Chart.defaults.borderColor = chartDefaults.borderColor;

    /* Scope comparison bar chart */
    var ctxScope = document.getElementById('mi-chart-scope');
    if (ctxScope) {
        new Chart(ctxScope, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    { label: 'Narrow 2030', data: narrow30, backgroundColor: '#8B5CF6', borderRadius: 4 },
                    { label: 'Broad 2030',  data: broad30,  backgroundColor: '#10B981', borderRadius: 4 }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { padding: 16, usePointStyle: true, pointStyle: 'rectRounded' } },
                    tooltip: { callbacks: { label: function(c) { return c.dataset.label + ': $' + c.parsed.y + 'B'; } } }
                },
                scales: {
                    x: { ticks: { font: { size: 10 } }, grid: { display: false } },
                    y: { ticks: { callback: function(v) { return '$' + v + 'B'; } } }
                }
            }
        });
    }

    /* CAGR horizontal bar */
    var ctxCagr = document.getElementById('mi-chart-cagr');
    if (ctxCagr) {
        new Chart(ctxCagr, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'CAGR 2025-2030',
                    data: cagrs,
                    backgroundColor: cagrs.map(function(v) { return v >= 40 ? '#EC4899' : v >= 20 ? '#8B5CF6' : '#475569'; }),
                    borderRadius: 4
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { callbacks: { label: function(c) { return c.parsed.x + '% CAGR'; } } }
                },
                scales: {
                    x: { max: 55, ticks: { callback: function(v) { return v + '%'; } } },
                    y: { grid: { display: false }, ticks: { font: { size: 10 } } }
                }
            }
        });
    }
});
</script>
</div><!-- .mi-page -->
</body>
</html>
