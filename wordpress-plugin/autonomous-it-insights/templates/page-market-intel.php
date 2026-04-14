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
  <meta charset="<?php bloginfo( 'charset' ); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Autonomous IT Market Intelligence | aienterpriseit.com</title>
  <meta name="description" content="Executive market intelligence covering AIOps, ITOM, RPA, Agentic Operations, and Security Operations — 2025–2030 analysis.">
  <meta property="og:title" content="Autonomous IT Market Intelligence">
  <meta property="og:description" content="Deep-dive analysis across the five pillars of the Autonomous IT stack.">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="<?php echo esc_url( get_site_icon_url() ); ?>">

  <!-- React App Styles -->
  <link rel="stylesheet" crossorigin href="<?php echo esc_url( $app_url ); ?>assets/index-D3txkmmw.css">

  <style>
    *, *::before, *::after { box-sizing: border-box; }
    html, body, #root { margin: 0; padding: 0; height: 100%; }
    body { background: hsl(222, 47%, 11%); }
  </style>
</head>
<body>
  <div id="root"></div>

  <!-- React App Bundle -->
  <script type="module" crossorigin src="<?php echo esc_url( $app_url ); ?>assets/index-CUVZPfET.js"></script>
</body>
</html>
