<?php
/**
 * Plugin Name:       Autonomous IT Insights
 * Plugin URI:        https://aienterpriseit.com
 * Description:       Executive market intelligence dashboard covering AIOps, ITOM, RPA, Agentic Ops, and Security Operations. Includes weekly AI-powered data refresh via Claude API.
 * Version:           2.0.0
 * Author:            AI Enterprise IT
 * License:           GPL-2.0+
 * Text Domain:       autonomous-it-insights
 */

if ( ! defined( 'ABSPATH' ) ) exit;

define( 'AIT_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'AIT_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'AIT_VERSION', '2.0.0' );
define( 'AIT_CRON_HOOK', 'ait_weekly_refresh' );

// ─── Custom Cron Interval ────────────────────────────────────────────────────

add_filter( 'cron_schedules', function( $schedules ) {
    if ( ! isset( $schedules['weekly'] ) ) {
        $schedules['weekly'] = [
            'interval' => 7 * DAY_IN_SECONDS,
            'display'  => __( 'Once Weekly', 'autonomous-it-insights' ),
        ];
    }
    return $schedules;
} );

// ─── Sitemap XML ─────────────────────────────────────────────────────────────
// Serves a sitemap at https://aienterpriseit.com/market-intelligence/sitemap.xml
// covering all SPA routes plus vendor detail pages from the DB.

add_action( 'template_redirect', function() {
    $path = ltrim( parse_url( $_SERVER['REQUEST_URI'], PHP_URL_PATH ), '/' );
    if ( $path !== 'market-intelligence/sitemap.xml' ) return;

    status_header( 200 );

    $base  = 'https://aienterpriseit.com/market-intelligence';
    $slugs = [ 'aiops', 'itom', 'rpa', 'agentops', 'secops' ];

    global $wpdb;
    $vendor_rows = $wpdb->get_results(
        "SELECT category, vendor_slug FROM {$wpdb->prefix}ait_vendor_profiles ORDER BY category, vendor_slug"
    );

    header( 'Content-Type: application/xml; charset=utf-8' );
    header( 'X-Robots-Tag: noindex' );

    $out  = '<?xml version="1.0" encoding="UTF-8"?>';
    $out .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

    $static_routes = [
        [ $base . '/',         '1.0', 'weekly'  ],
        [ $base . '/signals',  '0.8', 'weekly'  ],
        [ $base . '/compare',  '0.7', 'monthly' ],
        [ $base . '/pricing',  '0.6', 'monthly' ],
        [ $base . '/about',    '0.5', 'monthly' ],
    ];
    foreach ( $slugs as $slug ) {
        $static_routes[] = [ $base . '/market/' . $slug, '0.9', 'weekly' ];
    }
    foreach ( $static_routes as [ $loc, $pri, $freq ] ) {
        $out .= "<url><loc>" . esc_url( $loc ) . "</loc><changefreq>{$freq}</changefreq><priority>{$pri}</priority></url>";
    }

    if ( ! empty( $vendor_rows ) ) {
        foreach ( $vendor_rows as $row ) {
            $loc  = $base . '/vendor/' . rawurlencode( $row->category ) . '/' . rawurlencode( $row->vendor_slug );
            $out .= "<url><loc>" . esc_url( $loc ) . "</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>";
        }
    } else {
        // DB not yet seeded — fall back to build-generated vendor-slugs.json
        $json_path = AIT_PLUGIN_DIR . 'app/vendor-slugs.json';
        if ( file_exists( $json_path ) ) {
            $slugs_raw = json_decode( file_get_contents( $json_path ), true ) ?? [];
            foreach ( $slugs_raw as $key ) {
                $parts = explode( '/', $key, 2 );
                if ( count( $parts ) !== 2 ) continue;
                [ $cat, $vslug ] = $parts;
                $loc  = $base . '/vendor/' . rawurlencode( $cat ) . '/' . rawurlencode( $vslug );
                $out .= "<url><loc>" . esc_url( $loc ) . "</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>";
            }
        }
    }

    $out .= '</urlset>';
    echo $out;
    exit;
}, 0 );

// ─── Canonical redirect suppression ──────────────────────────────────────────
// The Market Intelligence page is set as the WordPress front page (page_on_front).
// WordPress redirect_canonical would 301 /market-intelligence/ → / (homepage).
// We suppress that redirect so the SSR theme template renders at its full URL.
add_filter( 'redirect_canonical', function( $redirect_url, $requested_url ) {
    $path = parse_url( $requested_url, PHP_URL_PATH );
    if ( rtrim( $path, '/' ) === '/market-intelligence' ) {
        return false;
    }
    return $redirect_url;
}, 1, 2 );

// ─── Canonical URL fix for SSR page ──────────────────────────────────────────
// Because the page is the WordPress front page, get_canonical_url() returns "/"
// instead of "/market-intelligence/". Fix it so Yoast/WP outputs the correct URL.
add_filter( 'get_canonical_url', function( $canonical_url, $post ) {
    if ( $post && (int) $post->ID === 6 ) {
        return 'https://aienterpriseit.com/market-intelligence/';
    }
    return $canonical_url;
}, 10, 2 );

// Also fix the raw rel_canonical tag output (pre-Yoast fallback).
add_filter( 'pre_get_shortlink', function( $shortlink ) {
    if ( is_front_page() ) return false;
    return $shortlink;
} );

// ─── SPA Route Handler ───────────────────────────────────────────────────────
// Intercepts legacy root-level React Router paths so direct URLs don't 404.
// The app uses HashRouter so /market-intelligence/ itself is served by WordPress.
// The WordPress .htaccess already rewrites unknown paths to index.php.

add_action( 'template_redirect', function() {
    // Redirect www → non-www before serving the SPA.
    // This hook runs at priority 1, before redirect_canonical (priority 10), so we must
    // handle the www canonicalization ourselves for any path we intercept.
    if ( isset( $_SERVER['HTTP_HOST'] ) && str_starts_with( $_SERVER['HTTP_HOST'], 'www.' ) ) {
        $canonical_host = substr( $_SERVER['HTTP_HOST'], 4 );
        $redirect_url   = 'https://' . $canonical_host . $_SERVER['REQUEST_URI'];
        wp_redirect( $redirect_url, 301 );
        exit;
    }

    // Redirect bare root → market-intelligence landing page.
    // From there users can enter the interactive SPA via the "Explore" CTA.
    $raw_path = parse_url( $_SERVER['REQUEST_URI'], PHP_URL_PATH );
    if ( $raw_path === '/' || $raw_path === '' ) {
        wp_redirect( home_url( '/market-intelligence/' ), 301 );
        exit;
    }

    // Canonicalize the legacy /overview alias onto the bare homepage. The React
    // index route and /overview render the same <Index /> component; the bare
    // /market-intelligence/ is now the canonical homepage, so 301 /overview → it
    // to avoid duplicate-content. (Client-side nav stays in-app; this only fires
    // on direct hits and crawlers.)
    if ( rtrim( $raw_path, '/' ) === '/market-intelligence/overview' ) {
        wp_redirect( home_url( '/market-intelligence/' ), 301 );
        exit;
    }

    // The SPA uses BrowserRouter with basename="/market-intelligence".
    // Serve the SPA for ANY /market-intelligence/* sub-path AND the bare
    // /market-intelligence/ — the bare route now serves the prerendered React
    // overview (the interactive dashboard) as the homepage. page-market-intel.php
    // maps the empty route key to the prerendered app/overview/index.html.
    if ( rtrim( $raw_path, '/' ) === '/market-intelligence'
        || str_starts_with( $raw_path, '/market-intelligence/' ) ) {
        status_header( 200 );
        include AIT_PLUGIN_DIR . 'templates/page-market-intel.php';
        exit;
    }

    // Legacy root-level paths kept for direct-link fallback (e.g. /market/aiops).
    $spa_prefixes = [ 'market', 'vendor', 'signals', 'compare', 'about', 'pricing' ];
    $path  = ltrim( $raw_path, '/' );
    $first = strtok( $path, '/' );
    if ( $first && in_array( $first, $spa_prefixes, true ) ) {
        status_header( 200 );
        include AIT_PLUGIN_DIR . 'templates/page-market-intel.php';
        exit;
    }
}, 1 );

// ─── Page Template Registration ──────────────────────────────────────────────

add_filter( 'theme_page_templates', function( $templates ) {
    $templates['templates/page-market-intel.php'] = __( 'Market Intelligence — Full Width', 'autonomous-it-insights' );
    return $templates;
} );

add_filter( 'template_include', function( $template ) {
    if ( is_page() && get_page_template_slug() === 'templates/page-market-intel.php' ) {
        return AIT_PLUGIN_DIR . 'templates/page-market-intel.php';
    }
    return $template;
} );

add_action( 'wp_enqueue_scripts', function() {
    if ( is_page() && get_page_template_slug() === 'templates/page-market-intel.php' ) {
        wp_dequeue_style( 'wp-block-library' );
    }
} );

// ─── REST API ─────────────────────────────────────────────────────────────────

add_action( 'rest_api_init', function() {

    // GET /wp-json/ait/v1/status
    register_rest_route( 'ait/v1', '/status', [
        'methods'             => 'GET',
        'callback'            => 'ait_api_status',
        'permission_callback' => '__return_true',
    ] );

    // GET /wp-json/ait/v1/markets — returns latest snapshot for all markets
    register_rest_route( 'ait/v1', '/markets', [
        'methods'             => 'GET',
        'callback'            => 'ait_api_get_markets',
        'permission_callback' => '__return_true',
    ] );

    // GET /wp-json/ait/v1/markets/(?P<slug>[a-z0-9_-]+) — single market snapshot
    register_rest_route( 'ait/v1', '/markets/(?P<slug>[a-z0-9_-]+)', [
        'methods'             => 'GET',
        'callback'            => 'ait_api_get_market',
        'permission_callback' => '__return_true',
        'args'                => [
            'slug' => [ 'required' => true, 'sanitize_callback' => 'sanitize_key' ],
        ],
    ] );

    // GET /wp-json/ait/v1/vendor-profile/{category}/{vendor}
    register_rest_route( 'ait/v1', '/vendor-profile/(?P<category>[a-z0-9_-]+)/(?P<vendor>[a-z0-9_-]+)', [
        'methods'             => 'GET',
        'callback'            => 'ait_api_get_vendor_profile',
        'permission_callback' => '__return_true',
        'args'                => [
            'category' => [ 'required' => true, 'sanitize_callback' => 'sanitize_key' ],
            'vendor'   => [ 'required' => true, 'sanitize_callback' => 'sanitize_key' ],
        ],
    ] );

    // POST /wp-json/ait/v1/refresh — trigger manual refresh (admin only)
    register_rest_route( 'ait/v1', '/refresh', [
        'methods'             => 'POST',
        'callback'            => 'ait_api_trigger_refresh',
        'permission_callback' => function() {
            return current_user_can( 'manage_options' );
        },
    ] );

} );

function ait_api_status() {
    return rest_ensure_response( [
        'status'       => 'ok',
        'version'      => AIT_VERSION,
        'last_refresh' => get_option( 'ait_last_refresh', 'Never' ),
        'next_refresh' => ait_next_refresh_time(),
        'markets'      => [ 'aiops', 'itom', 'rpa', 'agentops', 'secops' ],
    ] );
}

function ait_api_get_markets() {
    global $wpdb;
    $table   = $wpdb->prefix . 'ait_snapshots';
    $markets = [ 'aiops', 'itom', 'rpa', 'agentops', 'secops' ];
    $result  = [];

    foreach ( $markets as $slug ) {
        $row = $wpdb->get_row(
            $wpdb->prepare(
                "SELECT data_json, snapshot_at FROM $table WHERE market_slug = %s ORDER BY snapshot_at DESC LIMIT 1",
                $slug
            )
        );
        if ( $row ) {
            $result[ $slug ] = [
                'data'        => json_decode( $row->data_json, true ),
                'snapshot_at' => $row->snapshot_at,
            ];
        }
    }

    if ( empty( $result ) ) {
        return new WP_Error( 'no_data', 'No market data available yet. Trigger a refresh first.', [ 'status' => 404 ] );
    }

    return rest_ensure_response( $result );
}

function ait_api_get_market( WP_REST_Request $request ) {
    global $wpdb;
    $slug  = $request->get_param( 'slug' );
    $table = $wpdb->prefix . 'ait_snapshots';

    $row = $wpdb->get_row(
        $wpdb->prepare(
            "SELECT data_json, snapshot_at FROM $table WHERE market_slug = %s ORDER BY snapshot_at DESC LIMIT 1",
            $slug
        )
    );

    if ( ! $row ) {
        return new WP_Error( 'not_found', "No snapshot found for market: $slug", [ 'status' => 404 ] );
    }

    return rest_ensure_response( [
        'market'      => $slug,
        'data'        => json_decode( $row->data_json, true ),
        'snapshot_at' => $row->snapshot_at,
    ] );
}

function ait_api_get_vendor_profile( WP_REST_Request $request ): WP_REST_Response|WP_Error {
    global $wpdb;
    $category    = $request->get_param( 'category' );
    $vendor      = $request->get_param( 'vendor' );
    $profile_key = "$category/$vendor";
    $table       = $wpdb->prefix . 'ait_vendor_profiles';

    $row = $wpdb->get_row(
        $wpdb->prepare(
            "SELECT profile_json, refreshed_at FROM $table WHERE profile_key = %s",
            $profile_key
        )
    );

    if ( ! $row ) {
        return new WP_Error( 'not_found', "No profile found for: $profile_key", [ 'status' => 404 ] );
    }

    return rest_ensure_response( [
        'profile_key'  => $profile_key,
        'profile'      => json_decode( $row->profile_json, true ),
        'refreshed_at' => $row->refreshed_at,
    ] );
}

function ait_api_trigger_refresh() {
    $result = ait_run_refresh();
    if ( is_wp_error( $result ) ) {
        return $result;
    }
    return rest_ensure_response( [
        'status'       => 'refreshed',
        'last_refresh' => get_option( 'ait_last_refresh' ),
        'markets'      => array_keys( $result ),
    ] );
}

// ─── Claude API Refresh Logic ─────────────────────────────────────────────────

/**
 * Step 2 monitor — pinned coverage + ranking baseline.
 *
 * MIRRORS scripts/data-baseline.json (the build-time source of truth) — keep the two in
 * sync. Pinned to ACTUAL current data (2026-06): secops intentionally carries 54 established
 * vendors, not 50. `*_min` values are floors that catch a collapse without false-flagging
 * benign rebalancing; `anchors` are normalized lowercase substrings that must remain present
 * AND tier leader|challenger.
 */
function ait_snapshot_baseline(): array {
    return [
        'startups_min' => 50,
        'markets'      => [
            'aiops'    => [ 'established_min' => 50, 'leader_min' => 4, 'challenger_min' => 5,  'niche_min' => 1, 'anchors' => [ 'dynatrace', 'datadog', 'splunk', 'new relic' ] ],
            'itom'     => [ 'established_min' => 50, 'leader_min' => 3, 'challenger_min' => 4,  'niche_min' => 1, 'anchors' => [ 'servicenow', 'bmc', 'atlassian', 'microsoft' ] ],
            'rpa'      => [ 'established_min' => 50, 'leader_min' => 3, 'challenger_min' => 7,  'niche_min' => 1, 'anchors' => [ 'uipath', 'automation anywhere', 'power automate', 'celonis' ] ],
            'agentops' => [ 'established_min' => 50, 'leader_min' => 4, 'challenger_min' => 8,  'niche_min' => 1, 'anchors' => [ 'servicenow', 'copilot', 'agentforce', 'glean' ] ],
            'secops'   => [ 'established_min' => 54, 'leader_min' => 5, 'challenger_min' => 10, 'niche_min' => 1, 'anchors' => [ 'crowdstrike', 'palo alto', 'sentinel', 'splunk' ] ],
        ],
    ];
}

/**
 * Validate one market snapshot (as returned by Claude) against the pinned baseline.
 * Returns [ 'ok' => bool, 'errors' => string[] ]. Deterministic, no network/tokens.
 */
function ait_validate_snapshot( string $slug, array $data ): array {
    $baseline = ait_snapshot_baseline();
    $rule     = $baseline['markets'][ $slug ] ?? null;
    $errors   = [];

    if ( $rule === null ) {
        // Unknown market — accept (nothing to compare against) rather than block.
        return [ 'ok' => true, 'errors' => [] ];
    }

    $vendors  = isset( $data['vendors'] ) && is_array( $data['vendors'] ) ? $data['vendors'] : null;
    $startups = isset( $data['startups'] ) && is_array( $data['startups'] ) ? $data['startups'] : null;

    if ( $vendors === null ) {
        $errors[] = 'vendors[] missing or not an array';
    }
    if ( $startups === null ) {
        $errors[] = 'startups[] missing or not an array';
    }
    if ( $errors ) {
        return [ 'ok' => false, 'errors' => $errors ];
    }

    // Coverage
    if ( count( $vendors ) < $rule['established_min'] ) {
        $errors[] = sprintf( 'established %d < min %d', count( $vendors ), $rule['established_min'] );
    }
    if ( count( $startups ) < $baseline['startups_min'] ) {
        $errors[] = sprintf( 'startups %d < min %d', count( $startups ), $baseline['startups_min'] );
    }

    // Enum integrity + tier floors over established vendors
    $est_types = [ 'leader', 'challenger', 'niche' ];
    $counts    = [ 'leader' => 0, 'challenger' => 0, 'niche' => 0 ];
    foreach ( $vendors as $v ) {
        $t = $v['type'] ?? '';
        if ( ! in_array( $t, $est_types, true ) ) {
            $errors[] = sprintf( 'established "%s" has invalid type "%s"', $v['name'] ?? '?', $t );
        } else {
            $counts[ $t ]++;
        }
    }
    foreach ( $startups as $s ) {
        $t = $s['type'] ?? '';
        if ( ! in_array( $t, [ 'startup', 'emerging' ], true ) ) {
            $errors[] = sprintf( 'startup "%s" has invalid type "%s"', $s['name'] ?? '?', $t );
        }
    }
    if ( $counts['leader'] < $rule['leader_min'] ) {
        $errors[] = sprintf( 'leader %d < min %d', $counts['leader'], $rule['leader_min'] );
    }
    if ( $counts['challenger'] < $rule['challenger_min'] ) {
        $errors[] = sprintf( 'challenger %d < min %d', $counts['challenger'], $rule['challenger_min'] );
    }
    if ( $counts['niche'] < $rule['niche_min'] ) {
        $errors[] = sprintf( 'niche %d < min %d', $counts['niche'], $rule['niche_min'] );
    }

    // Ranking anchors: present AND tier leader|challenger (never dropped or demoted to niche)
    foreach ( $rule['anchors'] as $anchor ) {
        $hit = null;
        foreach ( $vendors as $v ) {
            if ( strpos( strtolower( $v['name'] ?? '' ), $anchor ) !== false ) {
                $hit = $v;
                break;
            }
        }
        if ( $hit === null ) {
            $errors[] = sprintf( 'anchor "%s" missing from established vendors', $anchor );
        } elseif ( ( $hit['type'] ?? '' ) === 'niche' ) {
            $errors[] = sprintf( 'anchor "%s" demoted to niche (was leader/challenger)', $anchor );
        }
    }

    return [ 'ok' => empty( $errors ), 'errors' => $errors ];
}

/**
 * Record rejected snapshots: append to a capped audit option and email the site admin.
 * No DB schema change (avoids a migration); the option holds the 50 most recent rejections.
 */
function ait_record_refresh_rejection( array $rejected ): void {
    $log = get_option( 'ait_refresh_audit', [] );
    if ( ! is_array( $log ) ) {
        $log = [];
    }
    $entry = [
        'at'       => gmdate( 'Y-m-d H:i:s' ),
        'rejected' => $rejected, // [ slug => [ error strings ] ]
    ];
    array_unshift( $log, $entry );
    $log = array_slice( $log, 0, 50 );
    update_option( 'ait_refresh_audit', $log, false );

    $lines = [];
    foreach ( $rejected as $slug => $errs ) {
        $lines[] = strtoupper( $slug ) . ':';
        foreach ( $errs as $e ) {
            $lines[] = '  - ' . $e;
        }
    }
    $body = "The weekly market-data refresh produced snapshot(s) that FAILED the coverage/ranking guard "
        . "and were REJECTED. The previous good snapshot keeps serving for these markets.\n\n"
        . implode( "\n", $lines )
        . "\n\nReview: wp-admin → Autonomous IT. Re-run the refresh once the upstream data looks right.";
    $admin = get_option( 'admin_email' );
    if ( $admin ) {
        wp_mail( $admin, '[AI Enterprise IT] Market refresh rejected by regression guard', $body );
    }
}

function ait_run_refresh() {
    // The refresh makes up to 5 sequential Claude calls (60s timeout each). When WP-Cron
    // fires inside a web request, the default PHP/php-fpm execution limit kills the job
    // before it finishes — which froze the live snapshot for weeks. Lift the limit and keep
    // running if the spawning request disconnects. (A system cron running wp-cli is the more
    // robust trigger; this is defense-in-depth so even a web-triggered fire can complete.)
    @set_time_limit( 0 );
    @ignore_user_abort( true );

    $api_key = get_option( 'ait_claude_api_key', '' );
    if ( empty( $api_key ) ) {
        return new WP_Error( 'no_api_key', 'Claude API key not configured. Set it in Settings → Autonomous IT.', [ 'status' => 500 ] );
    }

    $markets = [
        'aiops'    => 'AIOps & Observability',
        'itom'     => 'IT Operations Management (ITOM)',
        'rpa'      => 'RPA & Intelligent Automation',
        'agentops' => 'Agentic IT Operations',
        'secops'   => 'Security Operations (SecOps/SOAR)',
    ];

    $saved    = [];
    $rejected = [];
    foreach ( $markets as $slug => $market_name ) {
        $data = ait_fetch_market_from_claude( $api_key, $slug, $market_name );
        if ( is_wp_error( $data ) ) {
            continue;
        }
        // Step 2 monitor: gate each snapshot on coverage + ranking invariants BEFORE it
        // becomes the served LATEST. Fail-closed — a regressed snapshot is rejected and the
        // prior good snapshot keeps serving. Zero extra API calls / tokens.
        $verdict = ait_validate_snapshot( $slug, $data );
        if ( $verdict['ok'] ) {
            ait_save_snapshot( $slug, $data );
            $saved[ $slug ] = $data;
        } else {
            $rejected[ $slug ] = $verdict['errors'];
        }
    }

    if ( ! empty( $rejected ) ) {
        ait_record_refresh_rejection( $rejected );
    }

    if ( ! empty( $saved ) ) {
        update_option( 'ait_last_refresh', gmdate( 'Y-m-d H:i:s' ) );
    }

    // Refresh vendor drill-down profiles (SWOT, sentiment, ICP, future focus)
    ait_refresh_vendor_profiles();

    return $saved;
}

function ait_get_market_prompt( string $slug ): string {
    $current_month_year = date( 'F Y' );
    $scopes = [
        'aiops' => [
            'name'    => 'AIOps & Observability',
            'scope'   => 'AI-powered anomaly detection, ML-driven event correlation, Application Performance Monitoring (APM), distributed tracing, infrastructure monitoring with ML, log analytics platforms, and commercial observability suites.',
            'exclude' => 'IT service desk/ticketing (ITSM/ITOM), pure endpoint security, RPA/automation tools, open-source-only tooling.',
            'tam'     => 'approx $22.0B in 2025, growing to $52.5B by 2030 at ~19.0% CAGR. Sources: Grand View Research AIOps Platform (2025), Gartner MQ Observability Platforms (Jul 2025).',
            'vendors' => 'Dynatrace, Datadog, Splunk (Cisco), New Relic, IBM Instana, Grafana Labs, AppDynamics (Cisco), Elastic Observability, PagerDuty, LogicMonitor, Chronosphere, Honeycomb.',
        ],
        'itom'  => [
            'name'    => 'IT Service & Operations Management (ITSM/ITOM)',
            'scope'   => 'IT service desk platforms, incident/change/problem management, CMDB, IT asset management, configuration automation, event management, cloud ops, workload automation.',
            'exclude' => 'APM and observability monitoring (covered in AIOps), cloud IaaS provisioning, pure network monitoring, RPA bots, managed services.',
            'tam'     => 'approx $31.8B in 2025, growing to $54.8B by 2030 at ~11.5% CAGR. Sources: Grand View Research ITSM (2025), Mordor Intelligence ITOM (2025), Gartner ITOM Market Share (2025).',
            'vendors' => 'ServiceNow, BMC Software (Helix), Ivanti, Atlassian (Jira Service Management), Freshservice, Microsoft (System Center/SCSM), SolarWinds Service Desk, ManageEngine, TOPdesk, Cherwell.',
        ],
        'rpa'   => [
            'name'    => 'RPA & Intelligent Process Automation (IPA)',
            'scope'   => 'Robotic Process Automation (attended + unattended bots), AI/ML-augmented intelligent automation, process mining, document intelligence (IDP), NLP-powered workflow automation.',
            'exclude' => 'Conversational AI assistants (Agentic Ops), pure BPM suites without automation bots, ERP systems, standalone low-code/iPaaS platforms.',
            'tam'     => 'approx $17.8B in 2025 (IPA scope), growing to $44.7B by 2030 at ~20.2% CAGR. Note: pure RPA software alone is ~$3.6B (Gartner 2024). Sources: Grand View Research IPA (2025), Forrester AI Reshaping Automation (2024).',
            'vendors' => 'UiPath, Automation Anywhere, Microsoft Power Automate, SS&C Blue Prism, Appian, Celonis, Pega, SAP Build Process Automation, IBM RPA, WorkFusion, Kofax (Tungsten).',
        ],
        'agentops' => [
            'name'    => 'Agentic IT Operations',
            'scope'   => 'Autonomous AI agents for IT operations — LLM-native ITSM copilots, self-healing infrastructure agents, multi-agent orchestration, AI-powered zero-touch service desk, agentic workflow platforms.',
            'exclude' => 'Traditional chatbots without LLM reasoning, pure RPA bots, standard ITSM workflow automation, generic LLM APIs.',
            'tam'     => 'approx $7.8B in 2025, growing to ~$49.8B by 2030 at ~44.8% CAGR. High growth but risk caveat: Gartner (Oct 2025) warns 40%+ of agentic AI projects may be cancelled by 2027 due to ROI uncertainty. Sources: MarketsandMarkets AI Agents (2025), Grand View Research AI Agents (May 2025).',
            'vendors' => 'ServiceNow (Now Assist), Microsoft (Copilot for IT), Moveworks, Aisera, PagerDuty Copilot, Freshservice Freddy AI, BMC HelixGPT, Dynatrace Davis AI, IBM Watson Orchestrate, Salesforce Agentforce.',
        ],
        'secops' => [
            'name'    => 'Security Operations (SecOps)',
            'scope'   => 'SOC technology stack: SIEM, SOAR, XDR, threat intelligence platforms, SOC automation. XDR is fastest-growing sub-segment at ~31% CAGR.',
            'exclude' => 'Standalone endpoint antivirus, network firewalls, IAM/PAM (unless bundled), vulnerability management (~$16B separate market), MDR/MSSP managed services.',
            'tam'     => 'approx $28.2B in 2025, growing to $54.1B by 2030 at ~13.9% CAGR. Sources: MarketsandMarkets XDR (Aug 2025), Threat Intelligence (2025); Grand View Research SOAR/SIEM (2025).',
            'vendors' => 'CrowdStrike (Falcon/Charlotte AI), Palo Alto Networks (Cortex XSOAR/XSIAM), Microsoft Sentinel, Splunk Enterprise Security/SOAR, IBM QRadar SOAR, Google Chronicle (SIEM), Exabeam, Securonix, SentinelOne, Rapid7.',
        ],
    ];

    $s = $scopes[ $slug ] ?? $scopes['aiops'];

    return <<<PROMPT
You are a senior enterprise technology market analyst. Provide an accurate JSON snapshot for the "{$s['name']}" market as of {$current_month_year}.

MARKET SCOPE (strictly follow this):
- INCLUDE: {$s['scope']}
- EXCLUDE: {$s['exclude']}
- TAM GUIDANCE (use credible analyst data near this range): {$s['tam']}
- KEY VENDORS TO CONSIDER: {$s['vendors']}

Return ONLY valid JSON matching this exact structure (no markdown fences, no explanation):
{
  "title": "short market title (max 6 words)",
  "subtitle": "one-line description of scope",
  "tam2025": "\$X.XB",
  "tam2030": "\$XX.XB",
  "cagr": "XX.X%",
  "tamScope": "one sentence: what is included and what is explicitly excluded from this TAM",
  "sources": ["Analyst Firm — Report Name (Year)", "Analyst Firm — Report Name (Year)", "Analyst Firm — Report Name (Year)"],
  "chartData": [
    {"year": "2025", "value": X.X},
    {"year": "2026", "value": X.X},
    {"year": "2027", "value": X.X},
    {"year": "2028", "value": X.X},
    {"year": "2029", "value": X.X},
    {"year": "2030", "value": X.X}
  ],
  "vendors": [
    {
      "name": "VendorName",
      "type": "leader|challenger|niche",
      "marketCap": "\$XX.XB or Private \$X.XB val or Div. of ParentCo or —",
      "revenue": "\$X.XB ARR or \$XXXM Rev or Est. \$XXM ARR or —",
      "growth": "+XX% YoY or —",
      "highlight": "short badge ≤18 chars e.g. Gartner Leader, 44% Share",
      "description": "one crisp differentiator sentence (≤80 characters)",
      "recentEvent": "(OPTIONAL) Omit this key entirely if no notable event in the past 12 months. Only include for a confirmed major acquisition, funding round >$50M, or landmark product launch. Format: 'Mon YYYY: brief description' (≤90 chars total)"
    }
    ... 50 total established vendors ordered by market prominence ...
  ],
  "startups": [
    {
      "name": "StartupName",
      "type": "startup|emerging",
      "marketCap": "Private \$XXM val or Private or Open Source or —",
      "revenue": "Est. \$XXM ARR or Early Stage or Pre-rev or —",
      "growth": "+XX% YoY or —",
      "highlight": "short badge ≤18 chars e.g. YC W24, 120% Growth, AI-Native",
      "description": "one crisp differentiator sentence (≤80 characters)",
      "recentEvent": "(OPTIONAL) Omit this key entirely if no notable event in the past 12 months. Only include for a confirmed major acquisition, funding round >$50M, or landmark product launch. Format: 'Mon YYYY: brief description' (≤90 chars total)"
    }
    ... 50 total startups/emerging players ordered by momentum ...
  ],
  "useCases": [
    {"title": "Use Case Name", "description": "one sentence with adoption stats if known"},
    {"title": "...", "description": "..."},
    {"title": "...", "description": "..."},
    {"title": "...", "description": "..."},
    {"title": "...", "description": "..."}
  ],
  "trends": [
    {"title": "Trend Name", "description": "one sentence on impact and timeline"},
    {"title": "...", "description": "..."},
    {"title": "...", "description": "..."},
    {"title": "...", "description": "..."}
  ],
  "opportunities": ["opportunity 1", "opportunity 2", "opportunity 3", "opportunity 4", "opportunity 5", "opportunity 6"]
}

Rules:
- chartData values must compound consistently with the stated CAGR. Series starts at 2025.
- tam2025 must match chartData year "2025" value. tam2030 must match chartData year "2030" value.
- tamScope must be a single sentence clearly stating what is in and out of the TAM.
- sources must list 2-4 real analyst reports. Format: "Firm — Report Title (Year)".
- Use real vendor and startup names only — no fictional companies.
- vendors array: 50 entries, ordered from highest to lowest market prominence (leaders first, then challengers, then niche).
- startups array: 50 entries, ordered by momentum and funding (hottest first).
- For public companies use real market caps. For private unicorns use known valuations. For smaller privates use "Est. \$XM ARR". Use "—" only when truly unknown.
- type field must be exactly one of: "leader", "challenger", "niche", "startup", "emerging".
- FORMATTING (UI renders in constrained layouts — strict limits prevent clipping):
  - description: ≤80 characters. One sentence. No semicolons chaining two thoughts.
  - highlight: ≤18 characters. Badge label only — no punctuation.
  - recentEvent: ≤90 characters total including the 'Mon YYYY: ' prefix. Omit key entirely if no confirmed notable event.
PROMPT;
}

function ait_fetch_market_from_claude( string $api_key, string $slug, string $market_name ): array|WP_Error {
    $prompt = ait_get_market_prompt( $slug );

    $response = wp_remote_post( 'https://api.anthropic.com/v1/messages', [
        'timeout' => 60,
        'headers' => [
            'x-api-key'         => $api_key,
            'anthropic-version' => '2023-06-01',
            'content-type'      => 'application/json',
        ],
        'body' => wp_json_encode( [
            'model'      => 'claude-haiku-4-5-20251001',
            'max_tokens' => 8192,
            'messages'   => [
                [ 'role' => 'user', 'content' => $prompt ],
            ],
        ] ),
    ] );

    if ( is_wp_error( $response ) ) {
        return $response;
    }

    $code = wp_remote_retrieve_response_code( $response );
    $body = json_decode( wp_remote_retrieve_body( $response ), true );

    if ( $code !== 200 ) {
        $msg = $body['error']['message'] ?? "Claude API returned HTTP $code";
        return new WP_Error( 'claude_error', $msg, [ 'status' => 500 ] );
    }

    $text = $body['content'][0]['text'] ?? '';
    // Strip any accidental markdown fences
    $text = preg_replace( '/^```json\s*/i', '', trim( $text ) );
    $text = preg_replace( '/\s*```$/', '', $text );

    $data = json_decode( $text, true );
    if ( ! is_array( $data ) ) {
        return new WP_Error( 'parse_error', "Claude returned non-JSON for $slug", [ 'status' => 500 ] );
    }

    return $data;
}

function ait_save_snapshot( string $slug, array $data ): void {
    global $wpdb;
    $wpdb->insert(
        $wpdb->prefix . 'ait_snapshots',
        [
            'market_slug' => $slug,
            'data_json'   => wp_json_encode( $data ),
            'snapshot_at' => current_time( 'mysql', true ),
        ],
        [ '%s', '%s', '%s' ]
    );
}

// ─── WP-Cron: Weekly Refresh ─────────────────────────────────────────────────

add_action( AIT_CRON_HOOK, 'ait_run_refresh' );

function ait_schedule_cron(): void {
    if ( ! wp_next_scheduled( AIT_CRON_HOOK ) ) {
        wp_schedule_event( time(), 'weekly', AIT_CRON_HOOK );
    }
}

function ait_unschedule_cron(): void {
    $timestamp = wp_next_scheduled( AIT_CRON_HOOK );
    if ( $timestamp ) {
        wp_unschedule_event( $timestamp, AIT_CRON_HOOK );
    }
}

function ait_next_refresh_time(): string {
    $ts = wp_next_scheduled( AIT_CRON_HOOK );
    return $ts ? gmdate( 'Y-m-d H:i:s', $ts ) : 'Not scheduled';
}

// ─── Admin Settings Page ─────────────────────────────────────────────────────

add_action( 'admin_menu', function() {
    add_options_page(
        'Autonomous IT Settings',
        'Autonomous IT',
        'manage_options',
        'autonomous-it-insights',
        'ait_render_settings_page'
    );
} );

add_action( 'admin_init', function() {
    register_setting( 'ait_settings', 'ait_claude_api_key', [
        'sanitize_callback' => 'sanitize_text_field',
    ] );
} );

function ait_render_settings_page(): void {
    $last_refresh  = get_option( 'ait_last_refresh', 'Never' );
    $next_refresh  = ait_next_refresh_time();
    $api_key       = get_option( 'ait_claude_api_key', '' );
    $masked_key    = $api_key ? substr( $api_key, 0, 8 ) . str_repeat( '•', max( 0, strlen( $api_key ) - 12 ) ) . substr( $api_key, -4 ) : '';

    // Handle manual refresh trigger
    if ( isset( $_POST['ait_trigger_refresh'] ) && check_admin_referer( 'ait_manual_refresh' ) ) {
        $result = ait_run_refresh();
        if ( is_wp_error( $result ) ) {
            echo '<div class="notice notice-error"><p>' . esc_html( $result->get_error_message() ) . '</p></div>';
        } else {
            echo '<div class="notice notice-success"><p>Refresh complete. Updated ' . count( $result ) . ' markets.</p></div>';
            $last_refresh = get_option( 'ait_last_refresh', 'Never' );
        }
    }
    ?>
    <div class="wrap">
        <h1>Autonomous IT Market Intelligence</h1>

        <form method="post" action="options.php">
            <?php settings_fields( 'ait_settings' ); ?>
            <table class="form-table">
                <tr>
                    <th scope="row"><label for="ait_claude_api_key">Claude API Key</label></th>
                    <td>
                        <input type="password" id="ait_claude_api_key" name="ait_claude_api_key"
                               value="<?php echo esc_attr( $api_key ); ?>"
                               class="regular-text" autocomplete="off" />
                        <?php if ( $masked_key ): ?>
                            <p class="description">Current: <code><?php echo esc_html( $masked_key ); ?></code></p>
                        <?php endif; ?>
                        <p class="description">
                            Get your key at <a href="https://console.anthropic.com/" target="_blank">console.anthropic.com</a>.
                            Used for weekly AI-powered market data refresh (claude-haiku-4-5-20251001).
                        </p>
                    </td>
                </tr>
            </table>
            <?php submit_button( 'Save Settings' ); ?>
        </form>

        <hr>
        <h2>Data Refresh Status</h2>
        <table class="form-table">
            <tr><th>Last Refresh</th><td><?php echo esc_html( $last_refresh ); ?></td></tr>
            <tr><th>Next Scheduled Refresh</th><td><?php echo esc_html( $next_refresh ); ?></td></tr>
            <tr><th>Refresh Cadence</th><td>Weekly (every 7 days, via WP-Cron)</td></tr>
        </table>

        <form method="post">
            <?php wp_nonce_field( 'ait_manual_refresh' ); ?>
            <input type="hidden" name="ait_trigger_refresh" value="1" />
            <?php submit_button( 'Trigger Manual Refresh Now', 'secondary' ); ?>
        </form>

        <hr>
        <h2>API Endpoints</h2>
        <table class="widefat striped" style="max-width:800px">
            <thead><tr><th>Method</th><th>Endpoint</th><th>Description</th></tr></thead>
            <tbody>
                <tr><td>GET</td><td><code><?php echo esc_url( rest_url( 'ait/v1/status' ) ); ?></code></td><td>Health check + refresh schedule</td></tr>
                <tr><td>GET</td><td><code><?php echo esc_url( rest_url( 'ait/v1/markets' ) ); ?></code></td><td>All latest market snapshots</td></tr>
                <tr><td>GET</td><td><code><?php echo esc_url( rest_url( 'ait/v1/markets/{slug}' ) ); ?></code></td><td>Single market (aiops, itom, rpa, agentops, secops)</td></tr>
                <tr><td>POST</td><td><code><?php echo esc_url( rest_url( 'ait/v1/refresh' ) ); ?></code></td><td>Trigger refresh via API (admin auth required)</td></tr>
            </tbody>
        </table>
    </div>
    <?php
}

// ─── Vendor Profile Refresh ───────────────────────────────────────────────────

/**
 * PHP equivalent of the TypeScript toVendorSlug() utility.
 * Strips parentheticals, lowercases, replaces non-alphanumeric chars with hyphens.
 */
function ait_vendor_slug( string $name ): string {
    $name = preg_replace( '/\s*\(.*?\)/u', '', $name );
    $name = trim( strtolower( $name ) );
    $name = preg_replace( '/[^a-z0-9]+/', '-', $name );
    return trim( $name, '-' );
}

/**
 * The 50 vendors (10 per category) that have drill-down pages.
 * Matches the spotlight + towatch lists in the React SPA exactly.
 */
function ait_get_profiled_vendors(): array {
    return [
        'aiops'    => [
            // Original 10
            'Dynatrace', 'Datadog', 'Splunk (Cisco)', 'Elastic', 'Grafana Labs',
            'Resolve.AI', 'Monte Carlo', 'Incident.io', 'Groundcover', 'Last9',
            // Tier-3 expansion (+10)
            'New Relic', 'PagerDuty', 'LogicMonitor', 'Cribl', 'BigPanda',
            'Rootly', 'Komodor', 'Better Stack', 'SigNoz', 'Dash0',
        ],
        'itom'     => [
            // Original 10
            'ServiceNow', 'Microsoft (SCSM/Azure)', 'Atlassian Jira SM', 'BMC Helix ITSM', 'Freshservice',
            'BetterCloud', 'Atomicwork', 'Zluri', 'Axonius', 'Torii',
            // Tier-3 expansion (+10)
            'Ivanti', 'ManageEngine SD Plus', 'SolarWinds Service Desk', 'Atera', 'SysAid',
            'Productiv', 'Zylo', 'Lansweeper', 'Genuity', 'Aisera',
        ],
        'rpa'      => [
            // Original 10
            'UiPath', 'Microsoft Power Automate', 'Automation Anywhere', 'SS&C Blue Prism', 'Appian',
            'Lindy.ai', 'Relay.app', 'n8n', 'Pipedream', 'Activepieces',
            // Tier-3 expansion (+10)
            'Pega', 'Celonis', 'Kofax', 'Nintex', 'SAP Build Process',
            'Nango', 'Paragon', 'Merge.dev', 'Retool', 'Superblocks',
        ],
        'agentops' => [
            // Original 10
            'ServiceNow Now Assist', 'Microsoft Copilot for IT', 'Moveworks', 'Atlassian Intelligence', 'Dynatrace Davis AI',
            'Torq (Agentic)', 'Tines (IT)', 'Atomicwork', 'Shoreline.io', 'Causely',
            // Tier-3 expansion (+10)
            'IBM Watson Orchestrate', 'PagerDuty Copilot', 'Freshservice Freddy AI', 'AWS Bedrock Agents', 'Kore.ai',
            'Leena AI', 'Espressive Barista', 'Rezolve.ai', 'Gaspar AI', 'Workativ Assistant',
        ],
        'secops'   => [
            // Original 10
            'CrowdStrike', 'Palo Alto Networks', 'Microsoft Sentinel', 'Splunk SOAR', 'IBM QRadar',
            'Snyk', 'Tines', 'Torq', 'Radiant Security', 'Stairwell',
            // Tier-3 expansion (+10)
            'SentinelOne', 'ServiceNow SecOps', 'Exabeam', 'Securonix', 'Google Chronicle',
            'Sublime Security', 'Anomali', 'Revelstoke', 'EclecticIQ', 'Feedly AI',
        ],
    ];
}

/**
 * Build a prompt that asks Claude to return all 10 vendor profiles for one category as JSON.
 */
function ait_get_vendor_profile_batch_prompt( string $category_slug, array $vendors ): string {
    $vendor_list        = implode( ', ', $vendors );
    $current_month_year = date( 'F Y' );
    $slug_mapping = [];
    foreach ( $vendors as $name ) {
        $slug_mapping[] = '"' . ait_vendor_slug( $name ) . '" (for "' . $name . '")';
    }
    $slug_list = implode( ', ', $slug_mapping );

    return <<<PROMPT
You are a senior enterprise technology analyst specializing in the {$category_slug} market ({$current_month_year}).

Produce an accurate, research-quality vendor profile for each of the following vendors:
{$vendor_list}

Return ONLY a valid JSON object (no markdown fences, no explanation) structured as:
{
  "<vendor-slug>": {
    "swot": {
      "strengths":     ["<specific sentence ≤100 chars>", "<≤100 chars>", "<≤100 chars>", "<≤100 chars>"],
      "weaknesses":    ["<specific sentence ≤100 chars>", "<≤100 chars>", "<≤100 chars>"],
      "opportunities": ["<specific sentence ≤100 chars>", "<≤100 chars>", "<≤100 chars>"],
      "threats":       ["<specific sentence ≤100 chars>", "<≤100 chars>", "<≤100 chars>"]
    },
    "userLikes":      ["<G2/Gartner Peer Insights theme ≤100 chars>", "<≤100 chars>", "<≤100 chars>", "<≤100 chars>"],
    "userComplaints": ["<common complaint ≤100 chars>", "<≤100 chars>", "<≤100 chars>"],
    "customerProfile": {
      "segments":    ["<specific company tier or industry ≤50 chars>", "<≤50 chars>"],
      "typicalBuyer": "<title only e.g. VP IT Operations — ≤40 chars>",
      "topUseCases": ["<use case ≤80 chars>", "<≤80 chars>", "<≤80 chars>"]
    },
    "futureAreas": ["<roadmap focus ≤80 chars>", "<≤80 chars>", "<≤80 chars>", "<≤80 chars>"],
    "competitiveEdge": "<One sharp differentiator sentence ≤120 characters>"
  }
}

Vendor slug keys to use: {$slug_list}

Rules:
- Use the exact slug keys listed above
- Every string must be a complete, specific sentence — not a vague 2-word phrase
- userLikes and userComplaints must reflect real G2 / Gartner Peer Insights review themes
- customerProfile.segments must be specific (e.g. "Fortune 500 financial services", "Mid-market DevOps teams")
- Do not add any keys not defined in the structure above
- Ensure JSON is valid and parseable
- HARD LIMITS (UI renders in tight layouts): swot items ≤100 chars, userLikes/Complaints ≤100 chars, futureAreas ≤80 chars, topUseCases ≤80 chars, competitiveEdge ≤120 chars. Truncate or rephrase — never exceed these limits.
PROMPT;
}

/**
 * Call Claude API to refresh all 50 vendor profiles (one batch API call per category).
 */
function ait_refresh_vendor_profiles(): void {
    $api_key = get_option( 'ait_claude_api_key', '' );
    if ( empty( $api_key ) ) {
        return;
    }

    $vendors_by_category = ait_get_profiled_vendors();

    foreach ( $vendors_by_category as $category_slug => $vendors ) {
        $prompt = ait_get_vendor_profile_batch_prompt( $category_slug, $vendors );

        $response = wp_remote_post( 'https://api.anthropic.com/v1/messages', [
            'timeout' => 90,
            'headers' => [
                'x-api-key'         => $api_key,
                'anthropic-version' => '2023-06-01',
                'content-type'      => 'application/json',
            ],
            'body' => wp_json_encode( [
                'model'      => 'claude-haiku-4-5-20251001',
                'max_tokens' => 8192,
                'messages'   => [
                    [ 'role' => 'user', 'content' => $prompt ],
                ],
            ] ),
        ] );

        if ( is_wp_error( $response ) ) {
            continue;
        }

        $code = wp_remote_retrieve_response_code( $response );
        $body = json_decode( wp_remote_retrieve_body( $response ), true );

        if ( $code !== 200 ) {
            continue;
        }

        $text = $body['content'][0]['text'] ?? '';
        $text = preg_replace( '/^```json\s*/i', '', trim( $text ) );
        $text = preg_replace( '/\s*```$/', '', $text );

        $profiles = json_decode( $text, true );
        if ( ! is_array( $profiles ) ) {
            continue;
        }

        ait_upsert_vendor_profiles( $category_slug, $profiles );
    }
}

/**
 * Upsert vendor profiles into the DB (insert or update on duplicate key).
 */
function ait_upsert_vendor_profiles( string $category_slug, array $profiles ): void {
    global $wpdb;
    $table = $wpdb->prefix . 'ait_vendor_profiles';
    $now   = current_time( 'mysql', true );

    foreach ( $profiles as $vendor_slug => $profile ) {
        $profile_key = "$category_slug/$vendor_slug";
        $wpdb->query(
            $wpdb->prepare(
                "INSERT INTO $table (profile_key, profile_json, refreshed_at)
                 VALUES (%s, %s, %s)
                 ON DUPLICATE KEY UPDATE profile_json = VALUES(profile_json), refreshed_at = VALUES(refreshed_at)",
                $profile_key,
                wp_json_encode( $profile ),
                $now
            )
        );
    }
}

// ─── DB Migration: create ait_vendor_profiles on existing installs ────────────

add_action( 'plugins_loaded', function() {
    if ( get_option( 'ait_db_version', '0' ) !== '2.1.0' ) {
        global $wpdb;
        $charset_collate = $wpdb->get_charset_collate();
        $sql = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}ait_vendor_profiles (
            id           BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            profile_key  VARCHAR(128)        NOT NULL,
            profile_json LONGTEXT            NOT NULL,
            refreshed_at DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY profile_key (profile_key),
            KEY refreshed_at (refreshed_at)
        ) $charset_collate;";
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta( $sql );
        update_option( 'ait_db_version', '2.1.0' );
    }
} );

// ─── Activation / Deactivation ───────────────────────────────────────────────

register_activation_hook( __FILE__, 'ait_activate' );
register_deactivation_hook( __FILE__, 'ait_deactivate' );

function ait_activate() {
    global $wpdb;
    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}ait_snapshots (
        id          BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        snapshot_at DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
        market_slug VARCHAR(64)         NOT NULL,
        data_json   LONGTEXT            NOT NULL,
        PRIMARY KEY (id),
        KEY market_slug (market_slug),
        KEY snapshot_at (snapshot_at)
    ) $charset_collate;";

    $sql2 = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}ait_vendor_profiles (
        id           BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        profile_key  VARCHAR(128)        NOT NULL,
        profile_json LONGTEXT            NOT NULL,
        refreshed_at DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY profile_key (profile_key),
        KEY refreshed_at (refreshed_at)
    ) $charset_collate;";

    require_once ABSPATH . 'wp-admin/includes/upgrade.php';
    dbDelta( $sql );
    dbDelta( $sql2 );

    add_option( 'ait_version', AIT_VERSION );
    add_option( 'ait_last_refresh', '' );
    add_option( 'ait_claude_api_key', '' );

    ait_schedule_cron();
}

function ait_deactivate() {
    ait_unschedule_cron();
}
