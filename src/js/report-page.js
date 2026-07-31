// src/js/report-page.js
// Wiring halaman laporan (study-abroad-report.html):
//  - scroll progress bar (berbasis report-content)
//  - smooth scroll item TOC (pill nav)
//  - tombol kembali ke atas (a11y: keyboard + prefers-reduced-motion)
//  - inisialisasi ReportContent (fragment report + chart lazy)
// Guard: hanya berjalan bila target halaman (#report-content) ada.

import { ReportContent } from "./report-content.js";
import { initScrollToTop } from "./scroll-to-top.js";

function initScrollProgress() {
  window.addEventListener(
    "scroll",
    () => {
      const content = document.getElementById("report-content");
      if (!content) return;
      const contentHeight = content.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const progress = Math.min(100, Math.max(0, ((scrollTop + windowHeight) / (contentHeight + windowHeight)) * 100));
      const bar = document.getElementById("progress-bar");
      const pct = document.getElementById("progress-percent");
      if (bar) bar.style.width = progress + "%";
      if (pct) pct.textContent = Math.round(progress) + "%";
    },
    { passive: true }
  );
}

function initToc() {
  document.querySelectorAll(".toc-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(item.getAttribute("href"));
      if (target) {
        const offset = window.innerWidth < 768 ? 80 : 100;
        window.scrollTo({ top: target.offsetTop - offset, behavior: "smooth" });
      }
    });
  });
}

function initReportContent() {
  const rc = new ReportContent();
  rc.loadComponents();
}

function initReportPage() {
  if (!document.getElementById("report-content")) return; // bukan halaman laporan
  initScrollProgress();
  initToc();
  initScrollToTop();
  initReportContent();
}

initReportPage();
