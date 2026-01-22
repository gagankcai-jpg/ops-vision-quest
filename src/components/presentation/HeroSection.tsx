import { motion } from "framer-motion";
import { TrendingUp, BarChart3, Cpu, Bot } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:60px_60px] opacity-30" />
      
      {/* Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[128px] animate-pulse delay-1000" />
      
      <div className="container relative z-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-5xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary mb-8"
          >
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">Executive Market Intelligence Report</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 font-display"
          >
            <span className="text-foreground">Enterprise Technology</span>
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[size:200%_auto] animate-gradient">
              Market Analysis 2025-2030
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12"
          >
            Comprehensive analysis of AIOps, IT Operations Management, and Intelligent Automation markets
          </motion.p>

          {/* Category Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            <CategoryCard
              icon={<BarChart3 className="w-8 h-8" />}
              title="AIOps & Observability"
              value="$11.8B"
              label="2034 TAM"
              color="primary"
              delay={0.8}
            />
            <CategoryCard
              icon={<Cpu className="w-8 h-8" />}
              title="IT Operations Management"
              value="$105B"
              label="2030 TAM"
              color="accent"
              delay={0.9}
            />
            <CategoryCard
              icon={<Bot className="w-8 h-8" />}
              title="RPA & Intelligent Automation"
              value="$32.8B"
              label="2030 TAM"
              color="executive-green"
              delay={1.0}
            />
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <span className="text-sm">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-primary rounded-full"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

interface CategoryCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  label: string;
  color: string;
  delay: number;
}

const CategoryCard = ({ icon, title, value, label, color, delay }: CategoryCardProps) => {
  const colorClasses: Record<string, string> = {
    primary: "text-primary border-primary/30 bg-primary/5",
    accent: "text-accent border-accent/30 bg-accent/5",
    "executive-green": "text-executive-green border-executive-green/30 bg-executive-green/5",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className={`p-6 rounded-2xl border backdrop-blur-sm ${colorClasses[color]} transition-all duration-300 cursor-pointer`}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-sm font-medium text-muted-foreground mb-2">{title}</h3>
      <div className="text-3xl font-bold text-foreground mb-1">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </motion.div>
  );
};

export default HeroSection;
