import { motion, useReducedMotion } from "framer-motion";
import { Building2, Rocket, Mail, Linkedin } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { PageMeta } from "@/components/seo/PageMeta";
import { AmbientBackground } from "@/components/layout/AmbientBackground";
import { Surface } from "@/components/ui/surface";
import { LogoMark } from "@/components/Logo";

const SERVICES = [
  {
    icon: <Building2 className="h-7 w-7" />,
    title: "Enterprise IT Transformation",
    description:
      "Advising enterprises on the path to Autonomous Enterprise IT. We provide independent strategic guidance — AI-readiness assessment, phased transformation roadmaps, and vendor-selection advice — from first pilots through autonomous operations. Advisory, not implementation.",
    tags: ["Transformation Strategy", "AI Readiness", "Advisory"],
    accent: "text-executive-cyan",
  },
  {
    icon: <Rocket className="h-7 w-7" />,
    title: "AI Startup & Vendor Advisory",
    description:
      "Independent product and GTM advisory for AI-native startups and vendors in the Autonomous IT Ops space — market intelligence, competitive analysis, and positioning strategy to sharpen how you go to market. Advisory, not execution.",
    tags: ["Product Advisory", "GTM Strategy", "Market Intelligence", "Competitive Intel"],
    accent: "text-executive-purple",
  },
];

const AboutPage = () => {
  const reduceMotion = useReducedMotion();

  return (
    <PageShell footerLogoId="about-footer">
      <PageMeta
        title="About AI Enterprise IT"
        description="AI Enterprise IT provides analyst-grade market intelligence on autonomous IT — AIOps, ITOM, RPA, AgentOps, and SecOps. 500+ vendors profiled, updated weekly."
        canonical="https://aienterpriseit.com/market-intelligence/about"
      />
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60 pt-24 pb-16 sm:pt-28">
        <AmbientBackground variant="hero" />
        <div className="container relative z-10 px-6">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-6 flex justify-center">
              <LogoMark size={48} id="about-hero" />
            </div>

            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              About
            </p>

            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              We help companies navigate the shift to{" "}
              <span className="bg-gradient-brand bg-clip-text text-transparent">
                Autonomous IT
              </span>
              .
            </h1>

            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              An independent research practice covering AIOps, ITOM, RPA, Agentic Operations, and SecOps —
              with hands-on advisory for both buyers and the vendors building the next generation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20">
        <div className="container px-6">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              What we do
            </p>
            <h2 className="font-display text-3xl font-semibold text-foreground">
              Two service lines, one focus
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground">
              For enterprises on the transformation journey, and for the startups and vendors building the future.
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-2">
            {SERVICES.map((svc, i) => (
              <motion.div
                key={svc.title}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Surface variant="default" padding="lg" className="h-full">
                  <div className={`mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-card ${svc.accent}`}>
                    {svc.icon}
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    {svc.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {svc.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {svc.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border bg-muted/30 px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Surface>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact strip */}
      <section className="border-t border-border/60 bg-card/30 py-20">
        <div className="container px-6">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Get in touch
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground">
              Whether you're starting an AI transformation or sharpening your market position — we'd love to connect.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="mailto:info@aienterpriseit.com"
                className="inline-flex items-center gap-2.5 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Mail className="h-4 w-4" />
                info@aienterpriseit.com
              </a>
              <a
                href="https://www.linkedin.com/in/gagankchawla/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-lg border border-border bg-card/40 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </PageShell>
  );
};

export default AboutPage;
