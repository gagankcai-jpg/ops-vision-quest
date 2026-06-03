<?php
/**
 * Template Name: Market Intelligence — Full Width
 * Template Post Type: page
 *
 * Bare-bones full-screen template that mounts the Autonomous IT Insights React SPA.
 * WordPress head/foot hooks are intentionally omitted to prevent theme style conflicts.
 */

$plugin_url = plugin_dir_url( dirname( __FILE__ ) );
$app_url    = $plugin_url . 'app/';

/*
 * ── Server-side SEO meta injection (Phase 1 SSR) ──────────────────────────────
 * The SPA is client-rendered, so without this every /market-intelligence/* route
 * would serve identical generic <head> tags to crawlers and social scrapers.
 * route-meta.json (generated at build from the same TS data the React pages use)
 * maps each route to its exact title/description/canonical/OpenGraph/JSON-LD.
 * We resolve the current route here and emit the correct tags below; React +
 * react-helmet-async re-assert identical tags on hydrate (no conflict).
 */
$ait_default_meta = array(
	'title'       => 'Autonomous IT Market Intelligence | aienterpriseit.com',
	'description' => 'Executive market intelligence covering AIOps, ITOM, RPA, Agentic Operations, and Security Operations — 2025–2030 analysis.',
	'canonical'   => 'https://aienterpriseit.com/market-intelligence/',
	'ogType'      => 'website',
);

// Derive the route key: path with the /market-intelligence/ prefix and slashes trimmed.
$ait_raw_path  = parse_url( $_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH ) ?: '';
$ait_route_key = trim( preg_replace( '#^/market-intelligence/?#', '', $ait_raw_path ), '/' );
if ( $ait_route_key === '' ) {
	$ait_route_key = 'overview';
}

/*
 * ── Static build-file passthrough ─────────────────────────────────────────────
 * vite-react-ssg fetches its client-navigation loader-data manifest + per-route data
 * JSON relative to the ROUTER BASENAME (/market-intelligence/), not the Vite asset base.
 * Those paths (e.g. /market-intelligence/static-loader-data-manifest-<hash>.json) would
 * otherwise fall through to the HTML shell below, and the client's res.json() would throw
 * "Unexpected token '<'", crashing the route on client-side navigation. So if the request
 * maps to a real file under app/, serve it with the right Content-Type and stop.
 */
if (
	$ait_route_key !== '' &&
	preg_match( '#^[a-z0-9][a-z0-9/_.\-]*$#', $ait_route_key ) &&
	strpos( $ait_route_key, '..' ) === false
) {
	$ait_static_file = dirname( __DIR__ ) . '/app/' . $ait_route_key;
	if ( is_file( $ait_static_file ) ) {
		$ait_ext   = strtolower( pathinfo( $ait_static_file, PATHINFO_EXTENSION ) );
		$ait_types = array(
			'json' => 'application/json',
			'js'   => 'text/javascript',
			'css'  => 'text/css',
			'svg'  => 'image/svg+xml',
			'map'  => 'application/json',
		);
		if ( isset( $ait_types[ $ait_ext ] ) ) {
			header( 'Content-Type: ' . $ait_types[ $ait_ext ] );
		}
		readfile( $ait_static_file );
		exit;
	}
}

/*
 * ── Phase 2 SSR: serve the prerendered (SSG) page if one exists for this route ──
 * vite-react-ssg emits a fully-rendered app/<route>/index.html per route (real content
 * baked in + per-route <head> from react-helmet-async + the hydration script). If present,
 * serve it verbatim — the client then hydrates. Routes without a prerendered file (e.g.
 * unknown paths) fall through to the Phase 1 shell below (manifest meta + client render).
 * The route key is validated to a safe charset to prevent path traversal.
 */
if ( preg_match( '#^[a-z0-9](?:[a-z0-9/_-]*[a-z0-9])?$#', $ait_route_key ) && strpos( $ait_route_key, '..' ) === false ) {
	$ait_prerender_file = dirname( __DIR__ ) . '/app/' . $ait_route_key . '/index.html';
	if ( is_readable( $ait_prerender_file ) ) {
		readfile( $ait_prerender_file );
		exit;
	}
}

$ait_meta = $ait_default_meta;
$ait_meta_file = dirname( __DIR__ ) . '/app/route-meta.json';
if ( is_readable( $ait_meta_file ) ) {
	$ait_routes = json_decode( file_get_contents( $ait_meta_file ), true );
	if ( is_array( $ait_routes ) && isset( $ait_routes[ $ait_route_key ] ) ) {
		$ait_meta = array_merge( $ait_default_meta, $ait_routes[ $ait_route_key ] );
	}
}
$ait_og_type = $ait_meta['ogType'] ?? 'article';

// Resolve the current client entry (JS + CSS) from the Vite manifest so the fallback shell
// (rendered only for routes without a prerendered file) always references the right hashed
// assets after any rebuild. Falls back to known names if the manifest is unreadable.
$ait_entry_js  = 'assets/app.js';
$ait_entry_css = 'assets/app.css';
$ait_manifest_file = dirname( __DIR__ ) . '/app/.vite/manifest.json';
if ( is_readable( $ait_manifest_file ) ) {
	$ait_manifest = json_decode( file_get_contents( $ait_manifest_file ), true );
	if ( is_array( $ait_manifest ) ) {
		foreach ( $ait_manifest as $entry ) {
			if ( ! empty( $entry['isEntry'] ) ) {
				if ( ! empty( $entry['file'] ) )      $ait_entry_js  = $entry['file'];
				if ( ! empty( $entry['css'][0] ) )    $ait_entry_css = $entry['css'][0];
				break;
			}
		}
	}
}
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-FBKDB465ZK"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-FBKDB465ZK');
  </script>

  <meta charset="<?php bloginfo( 'charset' ); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?php echo esc_html( $ait_meta['title'] ); ?></title>
  <meta name="description" content="<?php echo esc_attr( $ait_meta['description'] ); ?>">
  <link rel="canonical" href="<?php echo esc_url( $ait_meta['canonical'] ); ?>">
  <meta property="og:title" content="<?php echo esc_attr( $ait_meta['title'] ); ?>">
  <meta property="og:description" content="<?php echo esc_attr( $ait_meta['description'] ); ?>">
  <meta property="og:url" content="<?php echo esc_url( $ait_meta['canonical'] ); ?>">
  <meta property="og:type" content="<?php echo esc_attr( $ait_og_type ); ?>">
  <meta property="og:site_name" content="AI Enterprise IT">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="<?php echo esc_attr( $ait_meta['title'] ); ?>">
  <meta name="twitter:description" content="<?php echo esc_attr( $ait_meta['description'] ); ?>">
  <?php if ( ! empty( $ait_meta['jsonld'] ) ) : ?>
  <script type="application/ld+json"><?php echo wp_json_encode( $ait_meta['jsonld'] ); ?></script>
  <?php endif; ?>
  <meta name="google-site-verification" content="tBqoSsQyBbdV1TlFHF0bimm64jFvrlSOnyrq3P3LOAI">
  <?php
  // SVG favicon — hexagonal circuit-chip mark, gradient #0EA5E9 → #8B5CF6
  // Encoded inline so it's independent of the WordPress site-icon setting.
  $favicon_svg = base64_encode( '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><linearGradient id="g" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#0EA5E9"/><stop offset="100%" stop-color="#8B5CF6"/></linearGradient></defs><polygon points="20,2 35,11 35,29 20,38 5,29 5,11" fill="url(#g)"/><polygon points="20,7.5 30.5,13.75 30.5,26.25 20,32.5 9.5,26.25 9.5,13.75" fill="none" stroke="white" stroke-opacity="0.2" stroke-width="1"/><circle cx="20" cy="2" r="2.2" fill="#38BDF8"/><circle cx="35" cy="11" r="2.2" fill="#67E8F9"/><circle cx="35" cy="29" r="2.2" fill="#A78BFA"/><circle cx="20" cy="38" r="2.2" fill="#8B5CF6"/><circle cx="5" cy="29" r="2.2" fill="#A78BFA"/><circle cx="5" cy="11" r="2.2" fill="#38BDF8"/><text x="20" y="25.5" text-anchor="middle" font-size="14" font-weight="800" font-family="Arial,sans-serif" fill="white" letter-spacing="0.5">AI</text></svg>' );
  ?>
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,<?php echo $favicon_svg; ?>">
  <link rel="apple-touch-icon" href="data:image/svg+xml;base64,<?php echo $favicon_svg; ?>">
  <meta name="theme-color" content="#0EA5E9">

  <!-- React App Styles -->
  <link rel="stylesheet" crossorigin href="<?php echo esc_url( $app_url . $ait_entry_css ); ?>">

  <style>
    *, *::before, *::after { box-sizing: border-box; }
    html, body, #root { margin: 0; padding: 0; height: 100%; }
    /* Pre-paint background matches design-token --background to avoid white flash before React mounts */
    html { background: hsl(222 47% 7%); color-scheme: dark; }
    body { background: hsl(222 47% 7%); }
  </style>
</head>
<body>
  <div id="root"></div>

  <!-- WordPress REST API base for vendor profile live data -->
  <script>window.AIT_REST_URL = '<?php echo esc_js( rest_url( "ait/v1" ) ); ?>';</script>

  <!-- React App Bundle -->
  <script type="module" crossorigin src="<?php echo esc_url( $app_url . $ait_entry_js ); ?>"></script>
</body>
</html>
