// src/js/dashboard.js
// Wiring halaman dashboard (index.html):
//  - memuat 12 fragment komponen via shared loader (fetch paralel, cache)
//  - reveal-on-scroll antar section (fallback polling 6 detik)
//  - memicu chart dashboard setelah komponen terpasang
// Guard: hanya berjalan bila target loader (#header-container) ada di halaman.

import { loadOrdered } from "./component-loader.js";

// Urutan komponen = urutan tampilan (satu container per section, aman dimuat paralel)
const COMPONENTS = [
  { file: "header", target: "header-container" },
  { file: "exec-summary", target: "exec-summary-container" },
  { file: "demographics", target: "demographics-container" },
  { file: "personas", target: "personas-container" },
  { file: "digital-behavior", target: "digital-behavior-container" },
  { file: "lifestyle", target: "lifestyle-container" },
  { file: "education", target: "education-container" },
  { file: "business-opportunities", target: "business-container" },
  { file: "study-abroad", target: "study-abroad-container" },
  { file: "marketing-strategy", target: "marketing-container" },
  { file: "data-sources", target: "data-sources-container" },
  { file: "footer", target: "footer-container" },
];

// Reveal-on-scroll — transformasi halus antar section.
// Dinonaktifkan pada prefers-reduced-motion; tanpa IntersectionObserver semua langsung tampil.
function initReveal() {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const targets = document.querySelectorAll(".reveal:not(.reveal-visible)");
  if (!targets.length) return;
  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("reveal-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -5% 0px" }
  );
  targets.forEach((el) => io.observe(el));
}

// Polling: amati elemen .reveal yang baru dimuat oleh loader komponen.
// IO di-observe ulang dengan aman (tidak membuat observer ganda);
// setelah 6 detik, semua elemen ditampilkan sebagai fallback.
function startRevealPolling() {
  const stopAt = Date.now() + 6000;
  const timer = setInterval(() => {
    initReveal();
    if (Date.now() > stopAt) {
      clearInterval(timer);
      document.querySelectorAll(".reveal:not(.reveal-visible)").forEach((el) => el.classList.add("reveal-visible"));
    }
  }, 200);
}

function initDashboard() {
  if (!document.getElementById("header-container")) return; // bukan halaman dashboard

  startRevealPolling();

  const entries = COMPONENTS.map(({ file, target }) => ({
    path: file,
    insert: (html) => {
      const el = document.getElementById(target);
      if (el) el.innerHTML = html;
    },
  }));

  loadOrdered(entries).then(() => {
    initReveal();
    // chart dashboard (initializeCharts punya retry internal hingga canvas tersedia)
    setTimeout(() => {
      if (typeof window.initializeCharts === "function") window.initializeCharts();
    }, 100);
  });
}

initDashboard();
