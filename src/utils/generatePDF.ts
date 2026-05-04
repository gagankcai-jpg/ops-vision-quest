import type jsPDFType from "jspdf";
import autoTable from "jspdf-autotable";
import { aiopsData, itomData, rpaData } from "@/data/marketData";

const COLORS = {
  background: [13, 13, 14] as [number, number, number],
  cardBg: [26, 26, 28] as [number, number, number],
  primary: [14, 165, 233] as [number, number, number],
  accent: [139, 92, 246] as [number, number, number],
  green: [34, 197, 94] as [number, number, number],
  amber: [245, 158, 11] as [number, number, number],
  text: [255, 255, 255] as [number, number, number],
  muted: [161, 161, 170] as [number, number, number],
  border: [39, 39, 42] as [number, number, number],
};

const addPageBackground = (doc: jsPDFType) => {
  doc.setFillColor(...COLORS.background);
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), "F");
};

const addHeader = (doc: jsPDFType, title: string, color: [number, number, number] = COLORS.text) => {
  doc.setTextColor(...color);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text(title, 20, 30);
};

const addSubheader = (doc: jsPDFType, text: string, y: number) => {
  doc.setTextColor(...COLORS.muted);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(text, 20, y);
};

const addSectionTitle = (doc: jsPDFType, text: string, y: number, color: [number, number, number] = COLORS.text) => {
  doc.setTextColor(...color);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(text, 20, y);
  return y + 8;
};

const addMetricBoxes = (doc: jsPDFType, metrics: { label: string; value: string }[], y: number, color: [number, number, number]) => {
  const boxWidth = 55;
  const gap = 5;
  const startX = 20;

  metrics.forEach((metric, idx) => {
    const x = startX + idx * (boxWidth + gap);
    doc.setFillColor(...COLORS.cardBg);
    doc.setDrawColor(...COLORS.border);
    doc.roundedRect(x, y, boxWidth, 25, 2, 2, "FD");

    doc.setTextColor(...color);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(metric.value, x + boxWidth / 2, y + 12, { align: "center" });

    doc.setTextColor(...COLORS.muted);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(metric.label, x + boxWidth / 2, y + 20, { align: "center" });
  });

  return y + 32;
};

const createCategoryPages = (doc: jsPDFType, data: typeof aiopsData, color: [number, number, number]) => {
  // Page 1: Overview
  doc.addPage();
  addPageBackground(doc);
  addHeader(doc, data.title, color);
  addSubheader(doc, data.subtitle, 40);

  let y = addMetricBoxes(doc, [
    { label: "TAM 2025", value: (data.tam2025 ?? data.tam2024) as string },
    { label: "TAM 2030", value: data.tam2030 },
    { label: "CAGR", value: data.cagr },
  ], 50, color);

  y = addSectionTitle(doc, "Market Growth Trajectory", y + 5);

  autoTable(doc, {
    startY: y,
    head: [data.chartData.map(d => d.year)],
    body: [data.chartData.map(d => `$${d.value}B`)],
    theme: "grid",
    styles: { fillColor: COLORS.cardBg, textColor: COLORS.text, fontSize: 9, cellPadding: 4, lineColor: COLORS.border },
    headStyles: { fillColor: [30, 30, 34], textColor: color, fontStyle: "bold" },
    margin: { left: 20, right: 20 },
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  const topVendors = (data as any).topVendors ?? [];
  const emergingVendors = (data as any).emergingVendors ?? [];

  if (topVendors.length > 0) {
    y = addSectionTitle(doc, "Top Vendors", y);
    autoTable(doc, {
      startY: y,
      head: [["#", "Vendor", "Key Metric", "Description"]],
      body: topVendors.map((v: any, i: number) => [String(i + 1), v.name, v.metric, v.description]),
      theme: "grid",
      styles: { fillColor: COLORS.cardBg, textColor: COLORS.text, fontSize: 8, cellPadding: 3, lineColor: COLORS.border },
      headStyles: { fillColor: [30, 30, 34], textColor: color, fontStyle: "bold" },
      columnStyles: { 0: { cellWidth: 10 }, 1: { cellWidth: 35 }, 2: { cellWidth: 30 } },
      margin: { left: 20, right: 20 },
    });
    y = (doc as any).lastAutoTable.finalY + 8;
  }

  if (emergingVendors.length > 0) {
    y = addSectionTitle(doc, "Emerging Players", y, COLORS.amber);
    emergingVendors.forEach((v: any) => {
      doc.setTextColor(...COLORS.text);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(`• ${v.name}`, 22, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...COLORS.muted);
      doc.text(`(${v.metric}) — ${v.description}`, 22 + doc.getTextWidth(`• ${v.name} `), y);
      y += 6;
    });
  }

  // Page 2: Use Cases & Trends
  doc.addPage();
  addPageBackground(doc);
  addHeader(doc, `${data.title} — Insights`, color);

  y = addSectionTitle(doc, "Key Use Cases", 45);
  data.useCases.forEach((uc) => {
    doc.setTextColor(...COLORS.text);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`• ${uc.title}`, 22, y);
    y += 5;
    doc.setTextColor(...COLORS.muted);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(uc.description, 26, y);
    y += 8;
  });

  y += 4;
  y = addSectionTitle(doc, "Latest Trends", y);
  data.trends.forEach((trend) => {
    doc.setTextColor(...COLORS.text);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`• ${trend.title}`, 22, y);
    y += 5;
    doc.setTextColor(...COLORS.muted);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(trend.description, 160);
    doc.text(lines, 26, y);
    y += lines.length * 4 + 6;
  });

  y += 4;
  y = addSectionTitle(doc, "Growth Opportunities", y, COLORS.green);
  data.opportunities.forEach((opp) => {
    doc.setTextColor(...COLORS.muted);
    doc.setFontSize(9);
    doc.text(`✓  ${opp}`, 22, y);
    y += 6;
  });
};

export const generatePDF = async () => {
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  // Title page
  addPageBackground(doc);
  doc.setTextColor(...COLORS.text);
  doc.setFontSize(40);
  doc.setFont("helvetica", "bold");
  doc.text("Enterprise Technology", 20, 60);
  doc.text("Market Intelligence", 20, 78);

  doc.setTextColor(...COLORS.primary);
  doc.setFontSize(20);
  doc.text("AIOps  •  IT Operations  •  Intelligent Automation", 20, 100);

  doc.setTextColor(...COLORS.muted);
  doc.setFontSize(14);
  doc.text("2024 – 2030 Strategic Analysis", 20, 115);
  doc.setFontSize(10);
  doc.text("Confidential  •  Executive Summary", 20, 130);

  // Executive Summary page
  doc.addPage();
  addPageBackground(doc);
  addHeader(doc, "Executive Summary");

  autoTable(doc, {
    startY: 42,
    head: [["Category", "TAM 2025", "TAM 2030", "CAGR"]],
    body: [
      ["AIOps & Observability", "$22.0B", "$52.5B", "19.0%"],
      ["IT Service & Operations Mgmt", "$31.8B", "$54.8B", "11.5%"],
      ["RPA & Intelligent Automation", "$17.8B", "$44.7B", "20.2%"],
      ["Agentic IT Operations", "$7.8B", "$49.8B", "44.8%"],
      ["Security Operations (SecOps)", "$28.2B", "$54.1B", "13.9%"],
      ["Combined Total", "$107.6B", "$255.9B", "~21.9% avg"],
    ],
    theme: "grid",
    styles: { fillColor: COLORS.cardBg, textColor: COLORS.text, fontSize: 10, cellPadding: 5, lineColor: COLORS.border },
    headStyles: { fillColor: [30, 30, 34], textColor: COLORS.primary, fontStyle: "bold" },
    margin: { left: 20, right: 20 },
  });

  let y = (doc as any).lastAutoTable.finalY + 12;
  y = addSectionTitle(doc, "Key Strategic Insights", y);

  const insights = [
    "Combined TAM grows from $69.3B to $149.6B by 2030",
    "AIOps shows highest growth trajectory at 20.4% CAGR",
    "ServiceNow dominates ITOM with 44% market share",
    "Generative AI integration accelerating across all segments",
  ];

  insights.forEach((insight) => {
    doc.setTextColor(...COLORS.muted);
    doc.setFontSize(11);
    doc.text(`•  ${insight}`, 22, y);
    y += 8;
  });

  // Category pages
  createCategoryPages(doc, aiopsData, COLORS.primary);
  createCategoryPages(doc, itomData, COLORS.accent);
  createCategoryPages(doc, rpaData, COLORS.green);

  // Sources page
  doc.addPage();
  addPageBackground(doc);
  addHeader(doc, "Data Sources & Methodology");

  const sources = [
    "Gartner Magic Quadrant Reports (2024)",
    "Mordor Intelligence Market Analysis",
    "Fortune Business Insights",
    "QKS Group SPARK Matrix",
    "Company Financial Reports & SEC Filings",
    "Industry Press Releases & Announcements",
  ];

  y = 50;
  sources.forEach((source) => {
    doc.setTextColor(...COLORS.muted);
    doc.setFontSize(12);
    doc.text(`•  ${source}`, 22, y);
    y += 10;
  });

  doc.setTextColor(...COLORS.muted);
  doc.setFontSize(10);
  doc.text("© 2025 Enterprise Technology Market Analysis", 20, 170);

  // Page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setTextColor(...COLORS.muted);
    doc.setFontSize(8);
    doc.text(`${i} / ${pageCount}`, doc.internal.pageSize.getWidth() - 20, doc.internal.pageSize.getHeight() - 8, { align: "right" });
  }

  doc.save("Market_Intelligence_Report_2024-2030.pdf");
};
