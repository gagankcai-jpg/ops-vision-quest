/* Canonical vendor-name → URL-slug mapping. Lives in its own tiny module so
   light components (nav search, market tables, signals) can slugify without
   pulling the ~1MB vendorProfiles data module into their chunk. */
export function toVendorSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s*\(.*?\)/g, "")   // strip parentheticals
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
