// src/js/report-content.js
// ReportContent: loads report HTML fragments into the page.
// Digunakan untuk laporan study-abroad (default) ATAU laporan kustom lain
// melalui <body data-report-sections="sec1,sec2,..."> (sv-mapping dari index/dashboard).
// Menggunakan shared loader (component-loader.js): fetch paralel, insert berurutan, cache.
// NOTE: File ini hanya mendefinisikan class. Inisialisasi dilakukan dari report-page.js (satu tempat).

import { loadOrdered } from "./component-loader.js";

const DEFAULT_SECTIONS = [
  "report/charts-container",
  "report/executive-summary",
  "report/methodology",
  "report/platform-analysis",
  "report/demographics",
  "report/behavior",
  "report/business-market",
  "report/business-opportunities",
  "report/insights",
  "report/footnotes",
];

class ReportContent {
  constructor() {
    // Daftar fragment bisa di-override per halaman via body[data-report-sections].
    // Contoh: behaviour-report.html memakai fragments dashboard
    // ("personas","digital-behavior","lifestyle","education").
    const presets = (document.body.dataset.reportSections || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    this.sections = presets.length ? presets : DEFAULT_SECTIONS;
    this.basePath = "components"; // folder where components live
    this.initialized = false;
  }

  async loadComponents({ onProgress } = {}) {
    if (this.initialized) return;
    this.initialized = true;

    // charts-container & report-sections sama-sama OPSIONAL:
    // - study-abroad: charts-container (report widgets) + report-sections
    // - behaviour-report: hanya report-sections (chart dashboard inisialisasi sendiri)
    const chartsContainer = document.getElementById("charts-container");
    const reportSections = document.getElementById("report-sections");
    if (!reportSections) {
      console.warn("Missing #report-sections target container for report content.");
      return;
    }

    const entries = this.sections.map((section) => ({
      path: section,
      basePath: this.basePath,
      insert: (html) => {
        // fragment khusus widget chart hanya masuk ke charts-container
        const isChartsSection = section === "report/charts-container" && chartsContainer;
        const target = isChartsSection ? chartsContainer : reportSections;
        target.insertAdjacentHTML("beforeend", html);
        if (typeof onProgress === "function") onProgress(section);
      },
    }));

    await loadOrdered(entries);

    // Fragment dashboard memakai .reveal (a11y-safe fallback: paksa tampil).
    document
      .querySelectorAll("#report-sections .reveal:not(.reveal-visible)")
      .forEach((el) => el.classList.add("reveal-visible"));

    // Setelah fragment terpasang, mulai lazy-observer chart.
    setTimeout(() => {
      // Chart report (khusus study-abroad)
      if (window.reportCharts && typeof window.reportCharts.initializeAllCharts === "function") {
        window.reportCharts.initializeAllCharts();
      }
      // Chart dashboard bila ada (mis. kanvas socialMediaChart di behaviour-report)
      if (this.sections.includes("digital-behavior") && typeof window.initializeCharts === "function") {
        window.initializeCharts();
      }
    }, 100);
  }
}

export { ReportContent };