# Claude Code Prompt: Deploy SSR Market Intelligence Page on Hostinger WordPress

## Objective
Replace the current JavaScript-rendered `/market-intelligence` page on `aienterpriseit.com` (Hostinger WordPress) with a server-side rendered (SSR) WordPress custom page template. The current page is invisible to search engines because all content is injected via client-side JS. This fix ensures Googlebot, LinkedIn previews, and all crawlers see the full content in the HTML source.

## Context
- Site: https://aienterpriseit.com (Hostinger WordPress)
- Current problem: Page body is empty in HTML source; all content is JS-rendered
- Goal: Full SSR HTML with progressive enhancement (charts load via JS after HTML is rendered)
- The page covers 5 Autonomous IT market categories with TAM data for 2025-2030
- Must support both narrow (platform-only) and broad (full envelope) scope cuts

## Files to Deploy

### 1. WordPress Custom Page Template
**File:** `page-market-intelligence.php`
**Location:** Upload to active theme directory (e.g., `/wp-content/themes/{active-theme}/page-market-intelligence.php`)

This template:
- Renders all TAM data, category descriptions, and tables as server-side HTML
- Includes Chart.js for interactive charts as progressive enhancement
- Has proper semantic HTML (h1, h2, h3, sections, tables)
- Includes JSON-LD structured data
- Includes Open Graph and Twitter Card meta tags
- Is mobile-responsive
- Uses CSS custom properties for theming

### 2. Open Graph Image
**Action:** Generate a 1200x630px OG image showing:
- Title: "Autonomous IT Market Intelligence 2025-2030"
- Subtitle: "TAM Analysis Across 5 Categories"
- Key stat: "$134B → $330B (Narrow) | $181B → $441B (Broad)"
- Brand: aienterpriseit.com
- Save as `/wp-content/uploads/og-market-intelligence.png`
- Update the og:image meta tag URL in the template

### 3. WordPress Page Assignment
After uploading the template:
```bash
# Via WP-CLI (if available on Hostinger)
wp post list --post_type=page --fields=ID,post_title,post_name
# Find the market-intelligence page ID, then:
wp post meta update <PAGE_ID> _wp_page_template page-market-intelligence.php

# OR manually in WordPress Admin:
# 1. Go to Pages → Market Intelligence → Edit
# 2. In Page Attributes (right sidebar), select "Market Intelligence" template
# 3. Update/Publish
```

### 4. Sitemap and SEO Setup
```bash
# Verify robots.txt allows crawling
curl https://aienterpriseit.com/robots.txt

# If using Yoast or RankMath, sitemap is auto-generated
# Otherwise create/update sitemap.xml to include:
# - /market-intelligence/
# - / (homepage)
# Submit sitemap via Google Search Console
```

### 5. Sub-page Structure (Phase 2)
After the main page works, create child pages for each category:
- `/market-intelligence/aiops-observability/`
- `/market-intelligence/itsm-itom/`
- `/market-intelligence/rpa-ipa/`
- `/market-intelligence/agentic-it-ops/`
- `/market-intelligence/secops-platform/`

Each child page uses the same template structure but with expanded single-category content.

## Validation Checklist
After deployment, verify:
- [ ] `curl -s https://aienterpriseit.com/market-intelligence/ | grep "Autonomous IT"` returns content
- [ ] `curl -s https://aienterpriseit.com/market-intelligence/ | grep "og:image"` returns image URL
- [ ] `curl -s https://aienterpriseit.com/market-intelligence/ | grep "application/ld+json"` returns structured data
- [ ] Page renders correctly in browser with charts
- [ ] LinkedIn Post Inspector (https://www.linkedin.com/post-inspector/) shows card preview with image
- [ ] Google Rich Results Test (https://search.google.com/test/rich-results) passes
- [ ] Mobile responsive (test at 375px width)
- [ ] Page loads under 3 seconds on Hostinger

## Important Notes
- Do NOT delete the existing page — update it to use the new template
- Keep any existing WordPress page content as fallback in the editor
- The template is self-contained — it doesn't depend on page editor content
- Chart.js loads from CDN; if CSP blocks it, host locally in theme assets
- Update the data in the PHP arrays when new analyst reports are published
- The "Last updated" timestamp in the template should reflect actual data refresh date
