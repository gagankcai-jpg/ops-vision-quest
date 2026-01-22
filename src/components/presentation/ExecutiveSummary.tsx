import { motion } from "framer-motion";
import { ComparisonChart } from "./MarketChart";
import { Lightbulb, Globe, Zap, Shield } from "lucide-react";

const ExecutiveSummary = () => {
  const comparisonData = [
    { name: "2024", aiops: 2.2, itom: 51.7, rpa: 15.4 },
    { name: "2026", aiops: 3.5, itom: 65, rpa: 20 },
    { name: "2028", aiops: 6, itom: 82, rpa: 26 },
    { name: "2030", aiops: 11.8, itom: 105, rpa: 32.8 },
  ];

  const keyInsights = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "AI-First Transformation",
      description: "80% of vendors integrating GenAI capabilities by 2025. Agentic AI emerges as the next frontier across all three markets.",
      color: "hsl(199 89% 48%)",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Cloud Dominance",
      description: "Cloud deployments capture 54.5%+ market share. SaaS models enable SME market penetration with 22% CAGR growth.",
      color: "hsl(262 83% 58%)",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Convergence Trend",
      description: "AIOps, ITOM, and RPA are converging into unified Hyperautomation platforms. Single-pane-of-glass solutions gaining traction.",
      color: "hsl(142 71% 45%)",
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Investment Surge",
      description: "Record funding in 2024-2025: LogicMonitor ($800M), Moveworks ($315M), Celonis continuing expansion in process mining.",
      color: "hsl(38 92% 50%)",
    },
  ];

  return (
    <section className="py-24 bg-background relative">
      <div className="container px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-foreground mb-4">Executive Summary</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            The enterprise technology market is undergoing a paradigm shift driven by AI integration, 
            cloud adoption, and the convergence of automation technologies.
          </p>
        </motion.div>

        {/* Combined Market TAM */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-primary/10 via-accent/10 to-executive-green/10 p-8 rounded-3xl border border-border mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-sm text-muted-foreground mb-2">Combined TAM 2024</div>
              <div className="text-4xl font-bold text-foreground">$69.3B</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-2">Combined TAM 2030</div>
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">$149.6B</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-2">Total Growth</div>
              <div className="text-4xl font-bold text-executive-green">+116%</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-2">Avg. CAGR</div>
              <div className="text-4xl font-bold text-executive-amber">15.8%</div>
            </div>
          </div>
        </motion.div>

        {/* Comparison Chart */}
        <div className="mb-12">
          <ComparisonChart data={comparisonData} />
        </div>

        {/* Key Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {keyInsights.map((insight, index) => (
            <motion.div
              key={insight.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all"
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${insight.color}20`, color: insight.color }}
              >
                {insight.icon}
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{insight.title}</h3>
              <p className="text-muted-foreground">{insight.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExecutiveSummary;
