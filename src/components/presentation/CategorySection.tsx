import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, DollarSign, Target, Users, Sparkles, ArrowUpRight } from "lucide-react";
import MarketChart from "./MarketChart";

interface Vendor {
  name: string;
  type: "leader" | "emerging";
  metric: string;
  description: string;
}

interface UseCase {
  title: string;
  description: string;
}

interface Trend {
  title: string;
  description: string;
}

interface CategoryData {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  colorClass: string;
  tam2024: string;
  tam2030: string;
  cagr: string;
  chartData: Array<{ year: string; value: number }>;
  topVendors: Vendor[];
  emergingVendors: Vendor[];
  useCases: UseCase[];
  trends: Trend[];
  opportunities: string[];
}

interface CategorySectionProps {
  data: CategoryData;
  index: number;
}

const CategorySection = ({ data, index }: CategorySectionProps) => {
  const Icon = data.icon;
  const isEven = index % 2 === 0;

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Accent */}
      <div 
        className={`absolute ${isEven ? 'right-0' : 'left-0'} top-1/2 -translate-y-1/2 w-1/2 h-96 opacity-10 blur-[100px]`}
        style={{ backgroundColor: data.color }}
      />

      <div className="container px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, x: isEven ? -30 : 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-4">
            <div 
              className="p-3 rounded-xl"
              style={{ backgroundColor: `${data.color}20` }}
            >
              <Icon className="w-8 h-8" style={{ color: data.color }} />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-foreground">{data.title}</h2>
              <p className="text-muted-foreground">{data.subtitle}</p>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <MetricCard
            icon={<DollarSign className="w-5 h-5" />}
            label="2024 Market Size"
            value={data.tam2024}
            color={data.color}
            delay={0.1}
          />
          <MetricCard
            icon={<Target className="w-5 h-5" />}
            label="2030 Projection"
            value={data.tam2030}
            color={data.color}
            delay={0.2}
          />
          <MetricCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="CAGR"
            value={data.cagr}
            color={data.color}
            delay={0.3}
          />
        </div>

        {/* Chart and Vendors Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <MarketChart 
            data={data.chartData}
            title="Market Growth Trajectory"
            color={data.color}
            gradientId={`gradient-${data.id}`}
          />
          
          {/* Top Vendors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card border border-border rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-foreground">Top 10 Vendors</h3>
            </div>
            <div className="space-y-3">
              {data.topVendors.map((vendor, i) => (
                <VendorRow key={vendor.name} vendor={vendor} rank={i + 1} color={data.color} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Emerging Vendors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5" style={{ color: data.color }} />
            <h3 className="text-xl font-semibold text-foreground">Emerging Vendors to Watch</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.emergingVendors.map((vendor, i) => (
              <EmergingVendorCard key={vendor.name} vendor={vendor} delay={i * 0.1} color={data.color} />
            ))}
          </div>
        </motion.div>

        {/* Use Cases and Trends Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Use Cases */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card border border-border rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-6">Top Use Cases</h3>
            <div className="space-y-4">
              {data.useCases.map((useCase, i) => (
                <div key={i} className="flex gap-4">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
                    style={{ backgroundColor: `${data.color}20`, color: data.color }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{useCase.title}</h4>
                    <p className="text-sm text-muted-foreground">{useCase.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Trends */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-card border border-border rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-6">Latest Trends</h3>
            <div className="space-y-4">
              {data.trends.map((trend, i) => (
                <div 
                  key={i} 
                  className="p-4 rounded-xl border border-border/50 bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <h4 className="font-medium text-foreground flex items-center gap-2">
                    <ArrowUpRight className="w-4 h-4" style={{ color: data.color }} />
                    {trend.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">{trend.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Growth Opportunities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-6 rounded-2xl border-2"
          style={{ borderColor: `${data.color}40`, backgroundColor: `${data.color}08` }}
        >
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" style={{ color: data.color }} />
            Growth Opportunities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.opportunities.map((opportunity, i) => (
              <div 
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg bg-background/50"
              >
                <div 
                  className="w-2 h-2 rounded-full mt-2 shrink-0"
                  style={{ backgroundColor: data.color }}
                />
                <span className="text-sm text-foreground">{opportunity}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  delay: number;
}

const MetricCard = ({ icon, label, value, color, delay }: MetricCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="p-6 rounded-2xl bg-card border border-border"
  >
    <div className="flex items-center gap-2 text-muted-foreground mb-2">
      {icon}
      <span className="text-sm">{label}</span>
    </div>
    <div className="text-3xl font-bold" style={{ color }}>{value}</div>
  </motion.div>
);

interface VendorRowProps {
  vendor: Vendor;
  rank: number;
  color: string;
}

const VendorRow = ({ vendor, rank, color }: VendorRowProps) => (
  <div className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
    <div 
      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
      style={{ backgroundColor: `${color}20`, color }}
    >
      {rank}
    </div>
    <div className="flex-1 min-w-0">
      <div className="font-medium text-foreground truncate">{vendor.name}</div>
      <div className="text-xs text-muted-foreground truncate">{vendor.description}</div>
    </div>
    <div className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
      {vendor.metric}
    </div>
  </div>
);

interface EmergingVendorCardProps {
  vendor: Vendor;
  delay: number;
  color: string;
}

const EmergingVendorCard = ({ vendor, delay, color }: EmergingVendorCardProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay }}
    whileHover={{ y: -4 }}
    className="p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all cursor-pointer"
  >
    <div className="flex items-center justify-between mb-2">
      <span className="font-semibold text-foreground">{vendor.name}</span>
      <Sparkles className="w-4 h-4" style={{ color }} />
    </div>
    <div className="text-xs text-muted-foreground mb-2">{vendor.description}</div>
    <div 
      className="text-sm font-medium"
      style={{ color }}
    >
      {vendor.metric}
    </div>
  </motion.div>
);

export default CategorySection;
