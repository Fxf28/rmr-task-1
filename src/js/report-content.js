// src/js/report-content.js
// ReportContent: loads report HTML fragments into the page (laporan study-abroad).
// Menggunakan shared loader (component-loader.js): fetch paralel, insert berurutan, cache.
// NOTE: File ini hanya mendefinisikan class. Inisialisasi dilakukan dari report-page.js (satu tempat).

import { loadOrdered } from "./component-loader.js";

class ReportContent {
  constructor() {
    // order of fragments (charts-container should be first so canvases exist)
    this.sections = ["report/charts-container", "report/executive-summary", "report/methodology", "report/platform-analysis", "report/demographics", "report/behavior", "report/business-market", "report/business-opportunities", "report/insights", "report/footnotes"];
    this.basePath = "components"; // folder where components live
    this.initialized = false;
  }

  async loadComponents({ onProgress } = {}) {
    if (this.initialized) return;
    this.initialized = true;

    const chartsContainer = document.getElementById("charts-container");
    const reportSections = document.getElementById("report-sections");

    if (!chartsContainer || !reportSections) {
      console.warn("Missing target containers for report content.");
      return;
    }

    const entries = this.sections.map((section) => ({
      path: section,
      basePath: this.basePath,
      insert: (html) => {
        if (section === "report/charts-container") {
          chartsContainer.innerHTML = html;
        } else {
          // append to report sections, keep existing content
          reportSections.insertAdjacentHTML("beforeend", html);
        }
        // optional callback for progress (useful for showing loading state)
        if (typeof onProgress === "function") {
          onProgress(section);
        }
      },
    }));

    await loadOrdered(entries);

    // Setelah fragment terpasang, mulai lazy-observer chart.
    // (ReportCharts sudah dibuat di DOMContentLoaded; panggilan ini idempotent,
    // setupObservers memakai guard, jadi aman dipanggil berulang.)
    setTimeout(() => {
      if (window.reportCharts && typeof window.reportCharts.initializeAllCharts === "function") {
        window.reportCharts.initializeAllCharts();
      }
    }, 100);
  }
}

export { ReportContent };
