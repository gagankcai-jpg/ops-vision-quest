# Autonomous IT Market Intelligence — SSR WordPress Template

## Problem
The current `/market-intelligence` page on aienterpriseit.com is JavaScript-rendered. 
Search engines (Google, Bing) and social platforms (LinkedIn, Twitter) see an empty page 
because the content is injected client-side after JS executes. This makes the page 
invisible to crawlers and produces blank social preview cards.

## Solution
A server-side rendered (SSR) WordPress page template that outputs all content as HTML 
in the initial page response. Interactive charts are added as progressive enhancement — 
they render after the page loads via Chart.js, but the core data (tables, text, KPIs) 
is fully visible in the HTML source without any JavaScript.

## Files

```
market-intelligence-ssr/
├── CLAUDE_CODE_PROMPT.md              # Full prompt for Claude Code deployment
├── README.md                          # This file
├── page-market-intelligence.php       # WordPress custom page template (primary)
├── functions-additions.php            # OG tags, font loading, head cleanup
├── shortcode-alternative.php          # Alt: WordPress shortcode approach
```

## Deployment options (choose one)

### Option A: Custom page template (recommended)
Best for: Full control, clean code, proper WordPress integration

1. Upload `page-market-intelligence.php` to your active theme directory:
   `/wp-content/themes/{your-theme}/page-market-intelligence.php`

2. Add the contents of `functions-additions.php` to your theme's `functions.php`

3. In WordPress Admin → Pages → Market Intelligence → Edit:
   - In Page Attributes sidebar, select "Market Intelligence" template
   - Update/Publish

4. Create OG image (1200x630px) and upload to:
   `/wp-content/themes/{your-theme}/assets/img/og-market-intelligence.png`

### Option B: Shortcode
Best for: Themes that don't support custom page templates

1. Add contents of `shortcode-alternative.php` to `functions.php`
2. Extract the content section from `page-market-intelligence.php` into
   `/wp-content/themes/{your-theme}/includes/market-intelligence-content.php`
3. Edit the page and add shortcode: `[market_intelligence]`

### Option C: Custom HTML block (simplest)
Best for: Quick deployment with any theme, no PHP needed

1. Open the page in WordPress block editor
2. Delete existing blocks
3. Add a Custom HTML block
4. Paste the HTML from the template (CSS + HTML + Script)
5. Publish

## After deployment

### Verify SSR
```bash
# Should return actual content, not empty body
curl -s https://aienterpriseit.com/market-intelligence/ | grep "Autonomous IT"
curl -s https://aienterpriseit.com/market-intelligence/ | grep "ITSM"
curl -s https://aienterpriseit.com/market-intelligence/ | grep "application/ld+json"
```

### Submit to search engines
1. Go to Google Search Console → URL Inspection
2. Enter: https://aienterpriseit.com/market-intelligence/
3. Click "Request Indexing"
4. Submit sitemap.xml if not already done

### Test social previews
1. LinkedIn: https://www.linkedin.com/post-inspector/
2. Twitter: https://cards-dev.twitter.com/validator
3. Facebook: https://developers.facebook.com/tools/debug/

## Updating data
All market data is stored in PHP arrays at the top of `page-market-intelligence.php`.
When new analyst reports publish:

1. Update the `$narrow` and `$broad` arrays with new TAM/CAGR figures
2. Update the `$categories` array descriptions and key_signals
3. Update `$last_updated` to the current date
4. The charts auto-update from the PHP arrays (no separate JS data file)

## Design decisions

- **Dark theme**: Matches the existing site aesthetic and differentiates from 
  generic WordPress pages. The dark palette (Slate/Sky from Tailwind) signals 
  "data intelligence" rather than "blog post."

- **Two-table layout**: Narrow and broad scope tables are both fully rendered 
  in HTML. This is intentional — Google indexes both, giving you keyword 
  coverage for both "AIOps market size" and "observability platform TAM."

- **Chart.js as enhancement**: Charts load from CDN after HTML renders. If JS 
  fails or a crawler doesn't execute it, all data is still visible in tables.

- **JSON-LD structured data**: Helps Google understand this is a market research 
  page about specific technology topics. May surface in rich results.

- **Inline CSS**: All styles are in the template file, not a separate stylesheet.
  This avoids an extra HTTP request and ensures styles load with the HTML.
  For production, consider moving to a compiled CSS file.

## Phase 2: Category sub-pages
After the main page is deployed and indexed, create child pages:
- `/market-intelligence/aiops-observability/`
- `/market-intelligence/itsm-itom/`
- `/market-intelligence/rpa-ipa/`
- `/market-intelligence/agentic-it-ops/`
- `/market-intelligence/secops-platform/`

Each would use the same template with a category parameter to render 
expanded single-category content with more detailed vendor analysis.
