import Navigation from "@/components/presentation/Navigation";
import HeroSection from "@/components/presentation/HeroSection";
import ExecutiveSummary from "@/components/presentation/ExecutiveSummary";
import CategorySection from "@/components/presentation/CategorySection";
import { aiopsData, itomData, rpaData } from "@/data/marketData";

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Navigation />
      
      <main>
        <HeroSection />
        
        <div id="summary">
          <ExecutiveSummary />
        </div>
        
        <div id="aiops">
          <CategorySection data={aiopsData} index={0} />
        </div>
        
        <div id="itom">
          <CategorySection data={itomData} index={1} />
        </div>
        
        <div id="rpa">
          <CategorySection data={rpaData} index={2} />
        </div>

        {/* Footer */}
        <footer className="py-12 border-t border-border bg-card">
          <div className="container px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                © 2025 Enterprise Technology Market Analysis. Executive Intelligence Report.
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Sources: Gartner, Mordor Intelligence, Fortune Business Insights, QKS Group</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
