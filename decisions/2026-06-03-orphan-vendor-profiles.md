## Decision: Resolve 6 orphan vendor profiles — add 4 SecOps vendors, remove 2 profiles

## Context
6 keys in `src/data/vendorProfiles.ts` 404'd on the live site because `VendorDetailPage`
resolves the vendor from `allCategories` via `toVendorSlug(name)`; with no matching vendor in
the category's data file it renders the not-found state. Critically, `scripts/generate-vendor-slugs.js`
emits **every** `vendorProfiles` key regardless of whether a vendor exists, so all 6 were live
404 URLs in `/market-intelligence/sitemap.xml` (DB-unseeded → served from `app/vendor-slugs.json`).

The 6: secops/{snyk,cyberark,beyondtrust,varonis}, rpa/ramp, itom/jira-service-management.

## Alternatives considered
1. Add a proper vendor entry to the matching category data file (profile renders).
2. Remove the orphan profile (no longer emitted into slug manifest / sitemap).
3. Re-key the orphan profile to an existing vendor's slug.

## Reasoning (per vendor)
- **Snyk, CyberArk, BeyondTrust, Varonis** → option 1. Real, major SecOps-adjacent vendors
  (PAM, data security, developer security). Added to `secops.ts` `vendors[]` with accurate
  type/marketCap/revenue. Exact display names slug 1:1 to the profile keys.
- **rpa/ramp** → option 2 (remove). No `Ramp` vendor exists anywhere (earlier "matches" were
  `OpsRamp`). Ramp is FinOps/corporate-spend — the profile body itself states "Not a traditional
  RPA platform." It fits none of the 5 covered markets (AIOps/ITOM/RPA/AgentOps/SecOps); forcing
  it into `itom` would just relocate the scope violation.
- **itom/jira-service-management** → option 2 (remove). Redundant duplicate: the real vendor
  "Atlassian Jira SM" already resolves to a working `itom/atlassian-jira-sm` profile. The
  jira-service-management key had no matching vendor and duplicated existing coverage.

## Trade-offs accepted
- `secops.ts` `vendors[]` grew from 50 → 54, breaking the soft "50 established + 50 startups"
  convention, and the 4 adds (PAM/data/dev-sec) sit slightly outside the file's stated
  SIEM+XDR+SOAR+TI scope note. Accepted: stopping live 404s and strengthening coverage outweighs
  the convention; analyst SecOps framings routinely include these categories.

## Supersedes
None.
