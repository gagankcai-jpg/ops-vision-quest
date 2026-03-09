# Enterprise Technology Market Intelligence Insights

An interactive executive intelligence report analyzing three high-growth enterprise technology markets — **AIOps & Observability**, **IT Operations Management (ITOM)**, and **RPA & Intelligent Automation** — with projections from 2024 to 2030.

![Built with React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)

## 📊 Overview

This application presents a comprehensive market intelligence dashboard covering:

| Market | TAM 2024 | TAM 2030 | CAGR |
|--------|----------|----------|------|
| AIOps & Observability | $2.23B | $11.8B | 20.4% |
| IT Operations Management | $51.7B | $105B | 10.9% |
| RPA & Intelligent Automation | $15.4B | $32.8B | 16.3% |
| **Combined** | **$69.3B** | **$149.6B** | **15.8%** |

## ✨ Features

- **Executive Summary** — High-level TAM, CAGR, and strategic insights with interactive charts
- **Vendor Comparison Matrix** — 30+ vendors across all three markets with sortable metrics
- **Vendor Detail Modals** — Click any vendor row for deep-dive info including strengths, weaknesses, customers, and recent moves
- **Market Growth Charts** — Recharts-powered visualizations for each category
- **Use Cases & Trends** — Industry adoption data, emerging trends, and strategic opportunities
- **PDF Export** — Download a fully styled, dark-themed PDF report
- **PPTX Export** — Generate a PowerPoint presentation of the full report
- **Responsive Design** — Optimized for desktop and mobile viewing

## 🛠 Tech Stack

- **React 18** + **TypeScript**
- **Vite** — Fast dev server and build tooling
- **Tailwind CSS** — Utility-first styling with custom design tokens
- **shadcn/ui** — Accessible component primitives
- **Recharts** — Data visualization
- **Framer Motion** — Scroll-triggered animations
- **jsPDF** + **jspdf-autotable** — PDF generation
- **PptxGenJS** — PowerPoint export

## 🚀 Getting Started

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start the dev server
npm run dev
```

## 📁 Project Structure

```
src/
├── components/
│   ├── presentation/
│   │   ├── HeroSection.tsx          # Landing hero with key metrics
│   │   ├── ExecutiveSummary.tsx      # Combined market overview
│   │   ├── CategorySection.tsx      # Deep-dive per market category
│   │   ├── VendorComparisonMatrix.tsx # Interactive vendor table + modals
│   │   ├── MarketChart.tsx          # Recharts visualizations
│   │   └── Navigation.tsx           # Top nav with export actions
│   └── ui/                          # shadcn/ui components
├── data/
│   └── marketData.ts                # All market data (vendors, TAM, trends)
├── utils/
│   ├── generatePDF.ts               # PDF export logic
│   └── generatePPTX.ts              # PPTX export logic
└── pages/
    └── Index.tsx                     # Main page layout
```

## 📄 Data Sources

- Gartner Magic Quadrant Reports
- Mordor Intelligence Market Analysis
- Fortune Business Insights
- QKS Group Research

## 📝 License

© 2025 Enterprise Technology Market Analysis. Executive Intelligence Report.
