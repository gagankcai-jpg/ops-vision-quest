import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Filter, 
  SortAsc, 
  SortDesc, 
  TrendingUp, 
  DollarSign, 
  Building2,
  BarChart3,
  Cpu,
  Bot,
  X,
  Search,
  ChevronDown,
  ExternalLink,
  Globe,
  Users,
  Calendar,
  Award,
  Zap,
  Target,
  Shield
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Comprehensive vendor data with numeric metrics for filtering
const vendorData = [
  // AIOps & Observability
  { name: "Dynatrace", category: "AIOps", marketCap: 15.2, revenue: 1.4, growthRate: 25, type: "leader", highlight: "15yr Gartner Leader" },
  { name: "Splunk (Cisco)", category: "AIOps", marketCap: 28.0, revenue: 3.7, growthRate: 12, type: "leader", highlight: "Acquired by Cisco 2024" },
  { name: "Datadog", category: "AIOps", marketCap: 42.5, revenue: 2.1, growthRate: 35, type: "leader", highlight: "Cloud-native leader" },
  { name: "New Relic", category: "AIOps", marketCap: 5.8, revenue: 0.9, growthRate: 18, type: "leader", highlight: "Full-stack platform" },
  { name: "Grafana Labs", category: "AIOps", marketCap: 6.0, revenue: 0.35, growthRate: 50, type: "leader", highlight: "Open-source leader" },
  { name: "ServiceNow ITOM", category: "AIOps", marketCap: 165.0, revenue: 8.9, growthRate: 24, type: "leader", highlight: "44% market share" },
  { name: "Elastic", category: "AIOps", marketCap: 8.5, revenue: 1.2, growthRate: 15, type: "leader", highlight: "ELK ecosystem" },
  { name: "Sumo Logic", category: "AIOps", marketCap: 1.7, revenue: 0.3, growthRate: 10, type: "leader", highlight: "Cloud SIEM" },
  { name: "LogicMonitor", category: "AIOps", marketCap: 2.4, revenue: 0.22, growthRate: 45, type: "emerging", highlight: "$800M funding" },
  { name: "Chronosphere", category: "AIOps", marketCap: 1.6, revenue: 0.08, growthRate: 80, type: "emerging", highlight: "Gartner Leader 2024" },
  
  // ITOM
  { name: "ServiceNow", category: "ITOM", marketCap: 165.0, revenue: 8.9, growthRate: 24, type: "leader", highlight: "Dominant platform" },
  { name: "Microsoft", category: "ITOM", marketCap: 3100.0, revenue: 62.0, growthRate: 16, type: "leader", highlight: "Azure Stack" },
  { name: "Broadcom (CA)", category: "ITOM", marketCap: 680.0, revenue: 38.0, growthRate: 8, type: "leader", highlight: "Legacy infrastructure" },
  { name: "IBM", category: "ITOM", marketCap: 175.0, revenue: 14.5, growthRate: 3, type: "leader", highlight: "Watson AIOps" },
  { name: "Atlassian", category: "ITOM", marketCap: 52.0, revenue: 3.5, growthRate: 28, type: "leader", highlight: "High growth" },
  { name: "BMC Software", category: "ITOM", marketCap: 8.5, revenue: 2.2, growthRate: 5, type: "leader", highlight: "Helix ITSM" },
  { name: "SolarWinds", category: "ITOM", marketCap: 2.8, revenue: 0.75, growthRate: 4, type: "leader", highlight: "Mid-market" },
  { name: "Ivanti", category: "ITOM", marketCap: 3.2, revenue: 0.95, growthRate: 12, type: "leader", highlight: "Unified IT" },
  { name: "Freshworks", category: "ITOM", marketCap: 4.5, revenue: 0.58, growthRate: 22, type: "leader", highlight: "SME focus" },
  { name: "Atera", category: "ITOM", marketCap: 0.5, revenue: 0.08, growthRate: 65, type: "emerging", highlight: "Fast deploy" },
  
  // RPA & Intelligent Automation
  { name: "UiPath", category: "RPA", marketCap: 12.5, revenue: 1.31, growthRate: 24, type: "leader", highlight: "6x Gartner Leader" },
  { name: "MS Power Automate", category: "RPA", marketCap: 3100.0, revenue: 4.5, growthRate: 45, type: "leader", highlight: "#1 growth rate" },
  { name: "Automation Anywhere", category: "RPA", marketCap: 6.8, revenue: 0.7, growthRate: 22, type: "leader", highlight: "Pure-play leader" },
  { name: "SS&C Blue Prism", category: "RPA", marketCap: 1.6, revenue: 0.18, growthRate: 8, type: "leader", highlight: "Enterprise focus" },
  { name: "Appian", category: "RPA", marketCap: 2.8, revenue: 0.55, growthRate: 18, type: "leader", highlight: "Low-code leader" },
  { name: "IBM RPA", category: "RPA", marketCap: 175.0, revenue: 0.4, growthRate: 15, type: "leader", highlight: "Watson AI" },
  { name: "Pega", category: "RPA", marketCap: 3.5, revenue: 1.35, growthRate: 10, type: "leader", highlight: "CRM focus" },
  { name: "WorkFusion", category: "RPA", marketCap: 0.8, revenue: 0.12, growthRate: 35, type: "leader", highlight: "AML/KYC bots" },
  { name: "Celonis", category: "RPA", marketCap: 13.0, revenue: 0.5, growthRate: 60, type: "emerging", highlight: "Process mining" },
  { name: "Moveworks", category: "RPA", marketCap: 2.1, revenue: 0.1, growthRate: 85, type: "emerging", highlight: "$315M raised" },
];

type SortField = "name" | "marketCap" | "revenue" | "growthRate";
type SortDirection = "asc" | "desc";

const categoryColors: Record<string, string> = {
  "AIOps": "hsl(199 89% 48%)",
  "ITOM": "hsl(262 83% 58%)",
  "RPA": "hsl(142 71% 45%)",
};

const categoryIcons: Record<string, typeof BarChart3> = {
  "AIOps": BarChart3,
  "ITOM": Cpu,
  "RPA": Bot,
};

const VendorComparisonMatrix = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["AIOps", "ITOM", "RPA"]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["leader", "emerging"]);
  const [sortField, setSortField] = useState<SortField>("marketCap");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [marketCapRange, setMarketCapRange] = useState([0, 100]);
  const [revenueRange, setRevenueRange] = useState([0, 100]);
  const [growthRateRange, setGrowthRateRange] = useState([0, 100]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Normalize values for slider (log scale for market cap and revenue)
  const normalizeValue = (value: number, max: number) => (Math.log10(value + 1) / Math.log10(max + 1)) * 100;
  const denormalizeValue = (normalized: number, max: number) => Math.pow(10, (normalized / 100) * Math.log10(max + 1)) - 1;

  const maxMarketCap = 3200;
  const maxRevenue = 65;
  const maxGrowth = 100;

  const filteredAndSortedVendors = useMemo(() => {
    return vendorData
      .filter((vendor) => {
        // Search filter
        if (searchQuery && !vendor.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
        // Category filter
        if (!selectedCategories.includes(vendor.category)) {
          return false;
        }
        // Type filter
        if (!selectedTypes.includes(vendor.type)) {
          return false;
        }
        // Market cap range
        const normalizedMC = normalizeValue(vendor.marketCap, maxMarketCap);
        if (normalizedMC < marketCapRange[0] || normalizedMC > marketCapRange[1]) {
          return false;
        }
        // Revenue range
        const normalizedRev = normalizeValue(vendor.revenue, maxRevenue);
        if (normalizedRev < revenueRange[0] || normalizedRev > revenueRange[1]) {
          return false;
        }
        // Growth rate range
        if (vendor.growthRate < growthRateRange[0] || vendor.growthRate > growthRateRange[1]) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        if (typeof aVal === "string" && typeof bVal === "string") {
          return sortDirection === "asc" 
            ? aVal.localeCompare(bVal) 
            : bVal.localeCompare(aVal);
        }
        return sortDirection === "asc" 
          ? (aVal as number) - (bVal as number) 
          : (bVal as number) - (aVal as number);
      });
  }, [searchQuery, selectedCategories, selectedTypes, sortField, sortDirection, marketCapRange, revenueRange, growthRateRange]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategories(["AIOps", "ITOM", "RPA"]);
    setSelectedTypes(["leader", "emerging"]);
    setMarketCapRange([0, 100]);
    setRevenueRange([0, 100]);
    setGrowthRateRange([0, 100]);
  };

  const activeFiltersCount = 
    (selectedCategories.length < 3 ? 1 : 0) +
    (selectedTypes.length < 2 ? 1 : 0) +
    (marketCapRange[0] > 0 || marketCapRange[1] < 100 ? 1 : 0) +
    (revenueRange[0] > 0 || revenueRange[1] < 100 ? 1 : 0) +
    (growthRateRange[0] > 0 || growthRateRange[1] < 100 ? 1 : 0);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <SortAsc className="w-4 h-4 opacity-30" />;
    return sortDirection === "asc" 
      ? <SortAsc className="w-4 h-4 text-primary" />
      : <SortDesc className="w-4 h-4 text-primary" />;
  };

  const formatMarketCap = (value: number) => {
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}T`;
    if (value >= 1) return `$${value.toFixed(1)}B`;
    return `$${(value * 1000).toFixed(0)}M`;
  };

  const formatRevenue = (value: number) => {
    if (value >= 1) return `$${value.toFixed(2)}B`;
    return `$${(value * 1000).toFixed(0)}M`;
  };

  return (
    <section id="comparison" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
      <div className="container px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Vendor Comparison Matrix
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Interactive analysis of {vendorData.length} vendors across AIOps, ITOM, and RPA markets
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search vendors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-card border-border"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap gap-3">
              {/* Category Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Building2 className="w-4 h-4" />
                    Categories
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {["AIOps", "ITOM", "RPA"].map((cat) => (
                    <DropdownMenuCheckboxItem
                      key={cat}
                      checked={selectedCategories.includes(cat)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCategories([...selectedCategories, cat]);
                        } else {
                          setSelectedCategories(selectedCategories.filter((c) => c !== cat));
                        }
                      }}
                    >
                      <span className="flex items-center gap-2">
                        <div 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: categoryColors[cat] }} 
                        />
                        {cat}
                      </span>
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Type Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Type
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuCheckboxItem
                    checked={selectedTypes.includes("leader")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedTypes([...selectedTypes, "leader"]);
                      } else {
                        setSelectedTypes(selectedTypes.filter((t) => t !== "leader"));
                      }
                    }}
                  >
                    Market Leaders
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedTypes.includes("emerging")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedTypes([...selectedTypes, "emerging"]);
                      } else {
                        setSelectedTypes(selectedTypes.filter((t) => t !== "emerging"));
                      }
                    }}
                  >
                    Emerging Vendors
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Advanced Filters Toggle */}
              <Button 
                variant={isFilterOpen ? "default" : "outline"} 
                className="gap-2"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter className="w-4 h-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>

              {activeFiltersCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Advanced Filters Panel */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 mt-4 bg-card border border-border rounded-xl">
                  {/* Market Cap Filter */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-primary" />
                        Market Cap
                      </label>
                      <span className="text-xs text-muted-foreground">
                        {formatMarketCap(denormalizeValue(marketCapRange[0], maxMarketCap))} - {formatMarketCap(denormalizeValue(marketCapRange[1], maxMarketCap))}
                      </span>
                    </div>
                    <Slider
                      value={marketCapRange}
                      onValueChange={setMarketCapRange}
                      min={0}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  {/* Revenue Filter */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-accent" />
                        Annual Revenue
                      </label>
                      <span className="text-xs text-muted-foreground">
                        {formatRevenue(denormalizeValue(revenueRange[0], maxRevenue))} - {formatRevenue(denormalizeValue(revenueRange[1], maxRevenue))}
                      </span>
                    </div>
                    <Slider
                      value={revenueRange}
                      onValueChange={setRevenueRange}
                      min={0}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  {/* Growth Rate Filter */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-executive-green" />
                        Growth Rate
                      </label>
                      <span className="text-xs text-muted-foreground">
                        {growthRateRange[0]}% - {growthRateRange[1]}%
                      </span>
                    </div>
                    <Slider
                      value={growthRateRange}
                      onValueChange={setGrowthRateRange}
                      min={0}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-4 mb-4 text-sm text-muted-foreground"
        >
          <span>Showing <strong className="text-foreground">{filteredAndSortedVendors.length}</strong> of {vendorData.length} vendors</span>
          {selectedCategories.length < 3 && (
            <div className="flex gap-2">
              {selectedCategories.map((cat) => (
                <Badge 
                  key={cat} 
                  variant="outline" 
                  className="text-xs"
                  style={{ borderColor: categoryColors[cat], color: categoryColors[cat] }}
                >
                  {cat}
                </Badge>
              ))}
            </div>
          )}
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-2xl overflow-hidden"
        >
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead 
                  className="cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-2">
                    Vendor
                    <SortIcon field="name" />
                  </div>
                </TableHead>
                <TableHead>Category</TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-foreground transition-colors text-right"
                  onClick={() => handleSort("marketCap")}
                >
                  <div className="flex items-center justify-end gap-2">
                    Market Cap
                    <SortIcon field="marketCap" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-foreground transition-colors text-right"
                  onClick={() => handleSort("revenue")}
                >
                  <div className="flex items-center justify-end gap-2">
                    Revenue
                    <SortIcon field="revenue" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-foreground transition-colors text-right"
                  onClick={() => handleSort("growthRate")}
                >
                  <div className="flex items-center justify-end gap-2">
                    Growth
                    <SortIcon field="growthRate" />
                  </div>
                </TableHead>
                <TableHead>Highlight</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="popLayout">
                {filteredAndSortedVendors.map((vendor, index) => {
                  const CategoryIcon = categoryIcons[vendor.category];
                  return (
                    <motion.tr
                      key={vendor.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.02 }}
                      className="border-border hover:bg-secondary/30 transition-colors group"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <span className="text-foreground">{vendor.name}</span>
                          {vendor.type === "emerging" && (
                            <Badge variant="outline" className="text-xs bg-executive-amber/10 text-executive-amber border-executive-amber/30">
                              Emerging
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CategoryIcon 
                            className="w-4 h-4" 
                            style={{ color: categoryColors[vendor.category] }} 
                          />
                          <span 
                            className="text-sm"
                            style={{ color: categoryColors[vendor.category] }}
                          >
                            {vendor.category}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {formatMarketCap(vendor.marketCap)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {formatRevenue(vendor.revenue)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div 
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium"
                          style={{ 
                            backgroundColor: vendor.growthRate >= 30 
                              ? "hsl(142 71% 45% / 0.15)" 
                              : vendor.growthRate >= 15 
                                ? "hsl(199 89% 48% / 0.15)" 
                                : "hsl(var(--muted))",
                            color: vendor.growthRate >= 30 
                              ? "hsl(142 71% 45%)" 
                              : vendor.growthRate >= 15 
                                ? "hsl(199 89% 48%)" 
                                : "hsl(var(--muted-foreground))"
                          }}
                        >
                          <TrendingUp className="w-3 h-3" />
                          {vendor.growthRate}%
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">
                        {vendor.highlight}
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
              {filteredAndSortedVendors.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Filter className="w-8 h-8 opacity-50" />
                      <span>No vendors match your filters</span>
                      <Button variant="ghost" size="sm" onClick={clearFilters}>
                        Clear all filters
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
        >
          <span className="font-medium">Categories:</span>
          {Object.entries(categoryColors).map(([cat, color]) => (
            <div key={cat} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span>{cat}</span>
            </div>
          ))}
          <span className="mx-4 h-4 w-px bg-border" />
          <span className="font-medium">Growth:</span>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-executive-green" />
            <span>≥30% (High)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span>15-30% (Moderate)</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VendorComparisonMatrix;
