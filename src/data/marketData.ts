// Backward-compat re-export — import from individual category files for better tree-shaking
export { allCategories } from "./index";
export { aiopsData } from "./aiops";
export { itomData } from "./itom";
export { rpaData } from "./rpa";
export { agentopsData } from "./agentops";
export { secopsData } from "./secops";
export type { MarketData } from "./index";
export type { VendorEntry } from "@/components/presentation/CategorySection";
