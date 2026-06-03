# SEO — Rules (apply by default)

- **Every `vendorProfiles.ts` key becomes a public URL + sitemap entry.**
  `scripts/generate-vendor-slugs.js` emits ALL profile keys verbatim (regex over the file),
  with no check that a matching vendor exists in the category data file. A profile key with no
  matching `vendor`/`startup` (by `toVendorSlug(name)`) renders the `VendorDetailPage` not-found
  state AND ships as a live 404 in `vendor-slugs.json` → sitemap. When adding a profile, always
  add the matching vendor entry in the same commit (and vice-versa when removing).

- **Sitemap source order:** `wp_ait_vendor_profiles` DB table if seeded, else fallback to
  `app/vendor-slugs.json`. As of 2026-06-03 the DB table is unseeded, so the sitemap serves from
  the build-generated `vendor-slugs.json` — deploy it to `app/` for sitemap changes to land.

- **Deploy for SEO changes is more than the CLAUDE.md core steps.** Also rsync
  `dist/vendor-slugs.json` and `dist/route-meta.json` → plugin `app/` (route-meta drives per-page
  SSR `<title>`/meta, read from `app/route-meta.json`). Then purge LiteSpeed.

- **Vendor profile key = `${categorySlug}/${toVendorSlug(vendorName)}`.** `toVendorSlug` lowercases,
  strips parentheticals, and hyphenates. "Atlassian Jira SM" → `atlassian-jira-sm`, NOT
  `jira-service-management`. Verify the exact display name slugs to the intended key.
