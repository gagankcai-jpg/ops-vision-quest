import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { motion } from "framer-motion";

interface MarketChartProps {
  data: Array<{ year: string; value: number; projected?: boolean }>;
  title: string;
  color: string;
  gradientId: string;
}

const MarketChart = ({ data, title, color, gradientId }: MarketChartProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-card border border-border rounded-2xl p-6"
    >
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 47% 16%)" />
            <XAxis 
              dataKey="year" 
              stroke="hsl(215 20% 55%)" 
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="hsl(215 20% 55%)" 
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => `$${value}B`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: "hsl(222 47% 10%)",
                border: "1px solid hsl(222 47% 16%)",
                borderRadius: "8px",
                color: "hsl(210 40% 96%)"
              }}
              formatter={(value: number) => [`$${value}B`, "Market Size"]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

interface ComparisonChartProps {
  data: Array<{ name: string; aiops: number; itom: number; rpa: number }>;
}

export const ComparisonChart = ({ data }: ComparisonChartProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-card border border-border rounded-2xl p-6"
    >
      <h3 className="text-lg font-semibold text-foreground mb-4">Market Comparison ($ Billions)</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 47% 16%)" />
            <XAxis 
              dataKey="name" 
              stroke="hsl(215 20% 55%)" 
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="hsl(215 20% 55%)" 
              fontSize={12}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: "hsl(222 47% 10%)",
                border: "1px solid hsl(222 47% 16%)",
                borderRadius: "8px",
                color: "hsl(210 40% 96%)"
              }}
            />
            <Legend 
              wrapperStyle={{ color: "hsl(210 40% 96%)" }}
            />
            <Bar dataKey="aiops" name="AIOps" fill="hsl(199 89% 48%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="itom" name="ITOM" fill="hsl(262 83% 58%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="rpa" name="RPA/IA" fill="hsl(142 71% 45%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default MarketChart;
