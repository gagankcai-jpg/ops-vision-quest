import { aiopsData } from "./aiops";
import { itomData } from "./itom";
import { rpaData } from "./rpa";
import { agentopsData } from "./agentops";
import { secopsData } from "./secops";

export { aiopsData };
export { itomData };
export { rpaData };
export { agentopsData };
export { secopsData };

export const allCategories = [aiopsData, itomData, rpaData, agentopsData, secopsData];

export type MarketData = typeof aiopsData;
export type { VendorEntry } from "@/components/presentation/CategorySection";
