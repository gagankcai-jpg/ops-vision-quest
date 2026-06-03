<?php
/**
 * ALTERNATIVE APPROACH: WordPress Shortcode
 * 
 * If your Hostinger theme doesn't support custom page templates,
 * or if you prefer to keep the content in the WordPress editor,
 * add this to functions.php and use the shortcode [market_intelligence]
 * in the page editor.
 * 
 * Usage: 
 * 1. Add this code to functions.php
 * 2. Edit the Market Intelligence page in WordPress
 * 3. Add just: [market_intelligence]
 * 4. Publish
 */

add_shortcode('market_intelligence', 'mi_render_shortcode');
function mi_render_shortcode($atts) {
    // Start output buffer — shortcodes must return, not echo
    ob_start();
    
    // Include the template (without get_header/get_footer)
    // Copy the content between <div class="mi-page"> and the closing </div>
    // from page-market-intelligence.php into a separate file:
    include get_template_directory() . '/includes/market-intelligence-content.php';
    
    return ob_get_clean();
}

/**
 * ALTERNATIVE 2: WordPress Custom HTML Block
 * 
 * If neither templates nor shortcodes work well with your Hostinger setup,
 * you can paste the rendered HTML directly into a Custom HTML block
 * in the WordPress block editor. This is the simplest approach:
 * 
 * 1. Open the page in WordPress block editor
 * 2. Delete all existing blocks
 * 3. Add a single "Custom HTML" block
 * 4. Paste the static HTML version (see static-fallback.html)
 * 5. The HTML includes inline CSS and a Chart.js script tag
 * 6. Publish
 * 
 * Pros: Works with any theme, no PHP needed, fully SSR
 * Cons: Harder to update data (edit raw HTML), no PHP templating
 */
