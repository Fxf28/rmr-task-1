// src/js/report-nav.js
// Hero navigation antar tiga laporan utama:
//   1. Market Intelligence (index.html)
//   2. Study Abroad     (study-abroad-report.html)
//   3. Behaviour        (behaviour-report.html)
// Fragment dimuat dari components/report-nav.html ke #report-nav-container.
// Halaman aktif ditandai lewat <body data-report="market|study|behaviour">.

import { fetchFragment } from "./component-loader.js";

function markActive(container) {
  const active = document.body.dataset.report || "";
  container.querySelectorAll("[data-report]").forEach((link) => {
    if (link.dataset.report === active) {
      link.classList.add("border-brand-500", "bg-brand-50");
      link.dataset.active = "";
    }
  });
}

function initReportNav() {
  const el = document.getElementById("report-nav-container");
  if (!el) return;
  fetchFragment("report-nav").then((html) => {
    if (!html) return;
    el.innerHTML = html;
    markActive(el);
  });
}

initReportNav();