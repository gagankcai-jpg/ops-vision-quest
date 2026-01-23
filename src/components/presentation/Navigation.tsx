import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, BarChart3, Cpu, Bot, FileText, LayoutGrid, Download } from "lucide-react";
import { generatePPTX } from "@/utils/generatePPTX";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Summary", href: "#summary", icon: <FileText className="w-4 h-4" /> },
    { label: "Comparison", href: "#comparison", icon: <LayoutGrid className="w-4 h-4" /> },
    { label: "AIOps", href: "#aiops", icon: <BarChart3 className="w-4 h-4" /> },
    { label: "ITOM", href: "#itom", icon: <Cpu className="w-4 h-4" /> },
    { label: "RPA/IA", href: "#rpa", icon: <Bot className="w-4 h-4" /> },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  const handleExportPPTX = async () => {
    setIsExporting(true);
    try {
      await generatePPTX();
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-lg" 
            : "bg-transparent"
        }`}
      >
        <div className="container px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">Market Intelligence</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
              <button
                onClick={handleExportPPTX}
                disabled={isExporting}
                className="flex items-center gap-2 px-4 py-2 ml-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {isExporting ? "Exporting..." : "Export PPTX"}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-foreground"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border md:hidden"
          >
            <div className="container px-6 py-4">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  className="flex items-center gap-3 w-full px-4 py-3 text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
              <button
                onClick={handleExportPPTX}
                disabled={isExporting}
                className="flex items-center gap-3 w-full px-4 py-3 mt-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {isExporting ? "Exporting..." : "Export PPTX"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
