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
  <title>Autonomous IT Market Intelligence | aienterpriseit.com</title>
  <meta name="description" content="Executive market intelligence covering AIOps, ITOM, RPA, Agentic Operations, and Security Operations — 2025–2030 analysis.">
  <meta property="og:title" content="Autonomous IT Market Intelligence">
  <meta property="og:description" content="Deep-dive analysis across the five pillars of the Autonomous IT stack.">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
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
  <link rel="stylesheet" crossorigin href="<?php echo esc_url( $app_url ); ?>assets/index-CX3evuaH.css">

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
  <script type="module" crossorigin src="<?php echo esc_url( $app_url ); ?>assets/index-QVbQUspC.js"></script>
</body>
</html>
