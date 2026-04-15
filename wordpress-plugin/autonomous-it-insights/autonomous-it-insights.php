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

function ait_run_refresh() {
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

    $saved = [];
    foreach ( $markets as $slug => $market_name ) {
        $data = ait_fetch_market_from_claude( $api_key, $slug, $market_name );
        if ( ! is_wp_error( $data ) ) {
            ait_save_snapshot( $slug, $data );
            $saved[ $slug ] = $data;
        }
    }

    if ( ! empty( $saved ) ) {
        update_option( 'ait_last_refresh', gmdate( 'Y-m-d H:i:s' ) );
    }

    return $saved;
}

function ait_get_market_prompt( string $slug ): string {
    $scopes = [
        'aiops' => [
            'name'    => 'AIOps & Observability',
            'scope'   => 'AI-powered anomaly detection, ML-driven event correlation, Application Performance Monitoring (APM), distributed tracing, infrastructure monitoring with ML, log analytics platforms.',
            'exclude' => 'IT service desk/ticketing (that is ITSM/ITOM), pure endpoint security, RPA/automation tools.',
            'tam'     => 'approx $4B in 2024, growing to $16-20B by 2030 at ~25% CAGR.',
            'vendors' => 'Dynatrace, Datadog, Splunk (Cisco), New Relic, IBM Instana, Grafana Labs, AppDynamics (Cisco), Elastic Observability, LogicMonitor, Chronosphere.',
        ],
        'itom'  => [
            'name'    => 'IT Service & Operations Management (ITSM/ITOM)',
            'scope'   => 'IT service desk platforms, incident/change/problem management, CMDB (Configuration Management Database), IT asset management, endpoint management, unified ITSM suites.',
            'exclude' => 'APM and observability monitoring (that is AIOps), cloud infrastructure provisioning (IaaS), pure network monitoring, RPA bots.',
            'tam'     => 'approx $13-14B in 2024, growing to $26-30B by 2030 at ~12-13% CAGR.',
            'vendors' => 'ServiceNow, BMC Software (Helix), Ivanti, Atlassian (Jira Service Management), Freshservice, Microsoft (System Center/SCSM), SolarWinds Service Desk, ManageEngine.',
        ],
        'rpa'   => [
            'name'    => 'RPA & Intelligent Process Automation',
            'scope'   => 'Robotic Process Automation (attended + unattended bots), intelligent automation platforms, process mining, document intelligence (IDP), low-code workflow automation.',
            'exclude' => 'Conversational AI assistants (AgentOps), pure BPM suites without automation, ERP systems.',
            'tam'     => 'approx $14-16B in 2024 (broader IA market), growing to $30-38B by 2030 at ~15-18% CAGR.',
            'vendors' => 'UiPath, Automation Anywhere, Microsoft Power Automate, SS&C Blue Prism, Appian, Celonis, Pega, SAP Build Process Automation, IBM RPA, WorkFusion.',
        ],
        'agentops' => [
            'name'    => 'Agentic IT Operations',
            'scope'   => 'Autonomous AI agents for IT operations — LLM-native ITSM copilots, self-healing infrastructure agents, AI-powered zero-touch service desk, multi-agent orchestration for IT workflows. This is a nascent market that emerged in 2023-2024.',
            'exclude' => 'Traditional chatbots without reasoning (pre-GPT era), pure RPA bots, standard ITSM workflow automation.',
            'tam'     => 'approx $2-3B in 2024 (nascent/emerging), growing rapidly to $18-25B by 2030 at ~40-50% CAGR.',
            'vendors' => 'ServiceNow (Now Assist), Microsoft (Copilot for IT), Moveworks, Aisera, PagerDuty Copilot, Freshservice Freddy AI, BMC HelixGPT, Dynatrace Davis AI, IBM Watson Orchestrate, Leena AI.',
        ],
        'secops' => [
            'name'    => 'Security Operations (SecOps)',
            'scope'   => 'Full SOC technology stack: SIEM (Security Information & Event Management), SOAR (Security Orchestration Automation & Response), XDR (Extended Detection & Response), Managed Detection & Response (MDR) platforms, threat intelligence platforms, SOC automation.',
            'exclude' => 'Standalone endpoint antivirus, network firewalls, IAM/PAM (unless bundled in SecOps platform), vulnerability scanners.',
            'tam'     => 'approx $21-24B in 2024, growing to $48-58B by 2030 at ~15-17% CAGR.',
            'vendors' => 'CrowdStrike (Falcon/Charlotte AI), Palo Alto Networks (Cortex XSOAR/XSIAM), Microsoft Sentinel, Splunk Enterprise Security/SOAR, IBM QRadar SOAR, Google Chronicle (SIEM), Exabeam, Securonix, Tines, Torq.',
        ],
    ];

    $s = $scopes[ $slug ] ?? $scopes['aiops'];

    return <<<PROMPT
You are a senior enterprise technology market analyst. Provide an accurate JSON snapshot for the "{$s['name']}" market as of April 2026.

MARKET SCOPE (strictly follow this):
- INCLUDE: {$s['scope']}
- EXCLUDE: {$s['exclude']}
- TAM GUIDANCE (use credible analyst data near this range): {$s['tam']}
- KEY VENDORS TO CONSIDER: {$s['vendors']}

Return ONLY valid JSON matching this exact structure (no markdown fences, no explanation):
{
  "title": "short market title (max 6 words)",
  "subtitle": "one-line description of scope",
  "tam2024": "\$X.XB",
  "tam2030": "\$XX.XB",
  "cagr": "XX.X%",
  "chartData": [
    {"year": "2024", "value": X.X},
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
      "highlight": "short badge e.g. Gartner Leader, 44% Share, Fastest Growth",
      "description": "one crisp sentence differentiator"
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
      "highlight": "short badge e.g. YC W24, 120% Growth, AI-Native",
      "description": "one crisp sentence differentiator"
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
- chartData values must compound consistently with the stated CAGR.
- TAM values must match chartData 2024 and 2030 entries.
- Use real vendor and startup names only — no fictional companies.
- vendors array: 50 entries, ordered from highest to lowest market prominence (leaders first, then challengers, then niche).
- startups array: 50 entries, ordered by momentum and funding (hottest first).
- For public companies use real market caps. For private unicorns use known valuations. For smaller privates use "Est. \$XM ARR". Use "—" only when truly unknown.
- type field must be exactly one of: "leader", "challenger", "niche", "startup", "emerging".
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
            'max_tokens' => 2048,
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

    require_once ABSPATH . 'wp-admin/includes/upgrade.php';
    dbDelta( $sql );

    add_option( 'ait_version', AIT_VERSION );
    add_option( 'ait_last_refresh', '' );
    add_option( 'ait_claude_api_key', '' );

    ait_schedule_cron();
}

function ait_deactivate() {
    ait_unschedule_cron();
}
