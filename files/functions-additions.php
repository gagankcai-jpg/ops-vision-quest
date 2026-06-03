<?php
/**
 * Add to your active theme's functions.php (or create a child theme)
 * These functions add proper OG/meta tags for the market intelligence page
 * and enqueue the Inter font.
 */

// ── Add OG and meta tags for market intelligence page ──────────
add_action('wp_head', 'mi_add_meta_tags', 1);
function mi_add_meta_tags() {
    if (!is_page_template('page-market-intelligence.php')) return;
    
    $page_url   = get_permalink();
    $site_url   = get_site_url();
    $og_image   = get_template_directory_uri() . '/assets/img/og-market-intelligence.png';
    $title      = 'Autonomous IT Market Intelligence 2025–2030';
    $desc       = 'TAM analysis across AIOps, ITSM/ITOM, RPA, Agentic IT Ops, and SecOps — narrow and broad scope cuts with source triangulation.';
    
    echo '
    <!-- Autonomous IT Market Intelligence - OG Tags -->
    <meta property="og:title" content="' . esc_attr($title) . '" />
    <meta property="og:description" content="' . esc_attr($desc) . '" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="' . esc_url($page_url) . '" />
    <meta property="og:image" content="' . esc_url($og_image) . '" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="AI Enterprise IT" />
    
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="' . esc_attr($title) . '" />
    <meta name="twitter:description" content="' . esc_attr($desc) . '" />
    <meta name="twitter:image" content="' . esc_url($og_image) . '" />
    
    <link rel="canonical" href="' . esc_url($page_url) . '" />
    ';
}

// ── Enqueue Inter font for market intelligence page ────────────
add_action('wp_enqueue_scripts', 'mi_enqueue_fonts');
function mi_enqueue_fonts() {
    if (!is_page_template('page-market-intelligence.php')) return;
    
    wp_enqueue_style(
        'inter-font',
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
        [],
        null
    );
}

// ── Remove WordPress emoji scripts on MI page (performance) ────
add_action('init', 'mi_cleanup_head');
function mi_cleanup_head() {
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('wp_print_styles', 'print_emoji_styles');
}
