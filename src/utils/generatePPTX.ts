import { aiopsData, itomData, rpaData } from "@/data/marketData";

const COLORS = {
  background: "0D0D0E",
  cardBg: "1A1A1C",
  primary: "0EA5E9",
  accent: "8B5CF6",
  green: "22C55E",
  amber: "F59E0B",
  text: "FFFFFF",
  muted: "A1A1AA",
  border: "27272A",
};

// Helper to convert string arrays to TableRow format
const toTableRows = (data: string[][]) => {
  return data.map((row) =>
    row.map((cell) => ({ text: cell }))
  );
};

export const generatePPTX = async () => {
  const { default: pptxgen } = await import("pptxgenjs");
  const pptx = new pptxgen();

  pptx.author = "Enterprise Market Intelligence";
  pptx.title = "AIOps, ITOM & RPA Market Analysis 2024-2030";
  pptx.subject = "Executive Market Intelligence Report";
  pptx.company = "Market Intelligence Division";

  pptx.defineSlideMaster({
    title: "EXECUTIVE_MASTER",
    background: { color: COLORS.background },
  });

  // Slide 1: Title Slide
  const titleSlide = pptx.addSlide({ masterName: "EXECUTIVE_MASTER" });
  titleSlide.addText("Enterprise Technology\nMarket Intelligence", {
    x: 0.5,
    y: 1.5,
    w: 9,
    h: 2,
    fontSize: 44,
    bold: true,
    color: COLORS.text,
    fontFace: "Arial",
  });
  titleSlide.addText("AIOps • IT Operations • Intelligent Automation", {
    x: 0.5,
    y: 3.6,
    w: 9,
    h: 0.5,
    fontSize: 24,
    color: COLORS.primary,
    fontFace: "Arial",
  });
  titleSlide.addText("2024 - 2030 Strategic Analysis", {
    x: 0.5,
    y: 4.2,
    w: 9,
    h: 0.4,
    fontSize: 18,
    color: COLORS.muted,
    fontFace: "Arial",
  });
  titleSlide.addText("Confidential • Executive Summary", {
    x: 0.5,
    y: 5,
    w: 9,
    h: 0.3,
    fontSize: 12,
    color: COLORS.muted,
    fontFace: "Arial",
  });

  // Slide 2: Executive Summary
  const summarySlide = pptx.addSlide({ masterName: "EXECUTIVE_MASTER" });
  summarySlide.addText("Executive Summary", {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.6,
    fontSize: 32,
    bold: true,
    color: COLORS.text,
    fontFace: "Arial",
  });

  const summaryData = [
    ["Category", "TAM 2024", "TAM 2030", "CAGR"],
    ["AIOps & Observability", "$2.23B", "$11.8B (2034)", "20.4%"],
    ["IT Operations Management", "$51.7B", "$105B", "10.9%"],
    ["RPA & Intelligent Automation", "$15.4B", "$32.8B", "16.3%"],
    ["Combined Total", "$69.3B", "$149.6B", "—"],
  ];

  summarySlide.addTable(toTableRows(summaryData), {
    x: 0.5,
    y: 1.2,
    w: 9,
    colW: [3, 2, 2, 2],
    fontFace: "Arial",
    fontSize: 14,
    color: COLORS.text,
    fill: { color: COLORS.cardBg },
    border: { type: "solid", color: COLORS.border, pt: 1 },
  });

  const insights = [
    "Combined TAM grows from $69.3B to $149.6B by 2030",
    "AIOps shows highest growth trajectory at 20.4% CAGR",
    "ServiceNow dominates ITOM with 44% market share",
    "Generative AI integration accelerating across all segments",
  ];

  insights.forEach((insight, idx) => {
    summarySlide.addText(`• ${insight}`, {
      x: 0.5,
      y: 3.5 + idx * 0.4,
      w: 9,
      h: 0.4,
      fontSize: 14,
      color: COLORS.muted,
      fontFace: "Arial",
    });
  });

  // Function to create category slide
  const createCategorySlide = (data: typeof aiopsData, color: string) => {
    // Overview slide
    const overviewSlide = pptx.addSlide({ masterName: "EXECUTIVE_MASTER" });
    overviewSlide.addText(data.title, {
      x: 0.5,
      y: 0.3,
      w: 9,
      h: 0.6,
      fontSize: 32,
      bold: true,
      color: color,
      fontFace: "Arial",
    });
    overviewSlide.addText(data.subtitle, {
      x: 0.5,
      y: 0.9,
      w: 9,
      h: 0.4,
      fontSize: 16,
      color: COLORS.muted,
      fontFace: "Arial",
    });

    // Metrics
    const metrics = [
      { label: "TAM 2024", value: data.tam2024 },
      { label: "TAM 2030", value: data.tam2030 },
      { label: "CAGR", value: data.cagr },
    ];

    metrics.forEach((metric, idx) => {
      overviewSlide.addShape("rect", {
        x: 0.5 + idx * 3,
        y: 1.5,
        w: 2.8,
        h: 1,
        fill: { color: COLORS.cardBg },
        line: { color: COLORS.border, pt: 1 },
      });
      overviewSlide.addText(metric.value, {
        x: 0.5 + idx * 3,
        y: 1.6,
        w: 2.8,
        h: 0.5,
        fontSize: 24,
        bold: true,
        color: color,
        fontFace: "Arial",
        align: "center",
      });
      overviewSlide.addText(metric.label, {
        x: 0.5 + idx * 3,
        y: 2.1,
        w: 2.8,
        h: 0.3,
        fontSize: 12,
        color: COLORS.muted,
        fontFace: "Arial",
        align: "center",
      });
    });

    // Chart data as table
    overviewSlide.addText("Market Growth Trajectory", {
      x: 0.5,
      y: 2.8,
      w: 9,
      h: 0.4,
      fontSize: 16,
      bold: true,
      color: COLORS.text,
      fontFace: "Arial",
    });

    const chartTableData = [
      data.chartData.map((d) => d.year),
      data.chartData.map((d) => `$${d.value}B`),
    ];

    overviewSlide.addTable(toTableRows(chartTableData), {
      x: 0.5,
      y: 3.3,
      w: 9,
      fontFace: "Arial",
      fontSize: 11,
      color: COLORS.text,
      fill: { color: COLORS.cardBg },
      border: { type: "solid", color: COLORS.border, pt: 1 },
    });

    // Vendors slide
    const vendorsSlide = pptx.addSlide({ masterName: "EXECUTIVE_MASTER" });
    vendorsSlide.addText(`${data.title} - Top Vendors`, {
      x: 0.5,
      y: 0.3,
      w: 9,
      h: 0.5,
      fontSize: 28,
      bold: true,
      color: color,
      fontFace: "Arial",
    });

    const vendorTableData = [
      ["#", "Vendor", "Key Metric", "Description"],
      ...data.topVendors.map((v, idx) => [
        String(idx + 1),
        v.name,
        v.metric,
        v.description,
      ]),
    ];

    vendorsSlide.addTable(toTableRows(vendorTableData), {
      x: 0.5,
      y: 1,
      w: 9,
      colW: [0.5, 2.5, 2, 4],
      fontFace: "Arial",
      fontSize: 10,
      color: COLORS.text,
      fill: { color: COLORS.cardBg },
      border: { type: "solid", color: COLORS.border, pt: 1 },
    });

    // Emerging vendors
    vendorsSlide.addText("Emerging Players", {
      x: 0.5,
      y: 4.2,
      w: 9,
      h: 0.4,
      fontSize: 14,
      bold: true,
      color: COLORS.amber,
      fontFace: "Arial",
    });

    data.emergingVendors.forEach((v, idx) => {
      vendorsSlide.addText(`${v.name} (${v.metric})`, {
        x: 0.5 + (idx % 2) * 4.5,
        y: 4.6 + Math.floor(idx / 2) * 0.35,
        w: 4.3,
        h: 0.35,
        fontSize: 11,
        color: COLORS.muted,
        fontFace: "Arial",
      });
    });

    // Use Cases & Trends slide
    const trendsSlide = pptx.addSlide({ masterName: "EXECUTIVE_MASTER" });
    trendsSlide.addText(`${data.title} - Use Cases & Trends`, {
      x: 0.5,
      y: 0.3,
      w: 9,
      h: 0.5,
      fontSize: 28,
      bold: true,
      color: color,
      fontFace: "Arial",
    });

    trendsSlide.addText("Key Use Cases", {
      x: 0.5,
      y: 0.9,
      w: 4,
      h: 0.4,
      fontSize: 16,
      bold: true,
      color: COLORS.text,
      fontFace: "Arial",
    });

    data.useCases.slice(0, 5).forEach((uc, idx) => {
      trendsSlide.addText(`• ${uc.title}`, {
        x: 0.5,
        y: 1.4 + idx * 0.5,
        w: 4.5,
        h: 0.3,
        fontSize: 11,
        bold: true,
        color: COLORS.text,
        fontFace: "Arial",
      });
      trendsSlide.addText(uc.description, {
        x: 0.7,
        y: 1.65 + idx * 0.5,
        w: 4.3,
        h: 0.25,
        fontSize: 9,
        color: COLORS.muted,
        fontFace: "Arial",
      });
    });

    trendsSlide.addText("Latest Trends", {
      x: 5.2,
      y: 0.9,
      w: 4,
      h: 0.4,
      fontSize: 16,
      bold: true,
      color: COLORS.text,
      fontFace: "Arial",
    });

    data.trends.forEach((trend, idx) => {
      trendsSlide.addText(`• ${trend.title}`, {
        x: 5.2,
        y: 1.4 + idx * 0.6,
        w: 4.3,
        h: 0.3,
        fontSize: 11,
        bold: true,
        color: COLORS.text,
        fontFace: "Arial",
      });
      trendsSlide.addText(trend.description, {
        x: 5.4,
        y: 1.65 + idx * 0.6,
        w: 4.1,
        h: 0.35,
        fontSize: 9,
        color: COLORS.muted,
        fontFace: "Arial",
      });
    });

    // Opportunities
    trendsSlide.addText("Growth Opportunities", {
      x: 0.5,
      y: 4,
      w: 9,
      h: 0.35,
      fontSize: 14,
      bold: true,
      color: COLORS.green,
      fontFace: "Arial",
    });

    data.opportunities.forEach((opp, idx) => {
      trendsSlide.addText(`✓ ${opp}`, {
        x: 0.5 + (idx % 3) * 3,
        y: 4.4 + Math.floor(idx / 3) * 0.35,
        w: 3,
        h: 0.35,
        fontSize: 10,
        color: COLORS.muted,
        fontFace: "Arial",
      });
    });
  };

  // Create slides for each category
  createCategorySlide(aiopsData, COLORS.primary);
  createCategorySlide(itomData, COLORS.accent);
  createCategorySlide(rpaData, COLORS.green);

  // Final slide: Sources
  const sourcesSlide = pptx.addSlide({ masterName: "EXECUTIVE_MASTER" });
  sourcesSlide.addText("Data Sources & Methodology", {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.6,
    fontSize: 32,
    bold: true,
    color: COLORS.text,
    fontFace: "Arial",
  });

  const sources = [
    "Gartner Magic Quadrant Reports (2024)",
    "Mordor Intelligence Market Analysis",
    "Fortune Business Insights",
    "QKS Group SPARK Matrix",
    "Company Financial Reports & SEC Filings",
    "Industry Press Releases & Announcements",
  ];

  sources.forEach((source, idx) => {
    sourcesSlide.addText(`• ${source}`, {
      x: 0.5,
      y: 1.2 + idx * 0.4,
      w: 9,
      h: 0.4,
      fontSize: 14,
      color: COLORS.muted,
      fontFace: "Arial",
    });
  });

  sourcesSlide.addText("© 2025 Enterprise Technology Market Analysis", {
    x: 0.5,
    y: 4.5,
    w: 9,
    h: 0.3,
    fontSize: 12,
    color: COLORS.muted,
    fontFace: "Arial",
  });

  // Save the file
  await pptx.writeFile({ fileName: "Market_Intelligence_Report_2024-2030.pptx" });
};
