// src/js/charts.js
// Chart dashboard: palette tunggal dari CSS variables (src/css/main.css).
// Hanya chart yang benar-benar dipakai: socialMediaChart (kanal digital).
// initializeCharts diekspos ke window untuk dipanggil dashboard.js setelah komponen dimuat.

import Chart from "chart.js/auto";
import { readCssVar, fontFamily } from "./chart-utils.js";

// Warna dari token chart design system (fallback bila token tidak terbaca)
const chartColors = {
  brand: readCssVar("--chart-1", "#4f46e5"),
  ok: readCssVar("--chart-2", "#10b981"),
  warn: readCssVar("--chart-3", "#f59e0b"),
  bad: readCssVar("--chart-4", "#f43f5e"),
  sky: readCssVar("--chart-5", "#0ea5e9"),
  violet: readCssVar("--chart-6", "#8b5cf6"),
  teal: readCssVar("--chart-7", "#14b8a6"),
  slate: readCssVar("--chart-8", "#64748b"),
  orange: readCssVar("--chart-9", "#f97316"),
  pink: readCssVar("--chart-10", "#ec4899"),
};

const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        font: { family: fontFamily(), size: 12 },
        color: "#475569",
        padding: 14,
        usePointStyle: true,
        boxWidth: 8,
      },
    },
    tooltip: {
      backgroundColor: "rgba(15, 23, 42, 0.95)",
      titleFont: { family: fontFamily(), size: 13, weight: "600" },
      bodyFont: { family: fontFamily(), size: 12 },
      padding: 12,
      cornerRadius: 8,
      displayColors: true,
      boxPadding: 4,
    },
  },
};

// 1. Platform digital: DataReportal Digital 2025: Indonesia (Jan 2025), audiens iklan (juta)
function createSocialMediaChart() {
  const canvas = document.getElementById("socialMediaChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const data = [
    { label: "YouTube", value: 143 },
    { label: "Facebook", value: 122 },
    { label: "TikTok (18+)", value: 108 },
    { label: "Instagram", value: 103 },
    { label: "X / Twitter", value: 25.2 },
  ];

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.map((d) => d.label),
      datasets: [
        {
          label: "Audiens iklan (juta)",
          data: data.map((d) => d.value),
          backgroundColor: [chartColors.violet, chartColors.sky, chartColors.bad, chartColors.brand, chartColors.slate],
          borderRadius: 6,
          borderSkipped: false,
          barThickness: 26,
        },
      ],
    },
    options: {
      ...commonOptions,
      indexAxis: "y",
      plugins: {
        ...commonOptions.plugins,
        legend: { display: false },
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: { color: "rgba(15,23,42,0.06)" },
          ticks: {
            font: { family: fontFamily(), size: 11 },
            callback: (v) => v + " jt",
          },
        },
        y: {
          grid: { display: false },
          ticks: { font: { family: fontFamily(), size: 12, weight: "600" }, color: "#334155" },
        },
      },
    },
  });
}

// Tunggu hingga canvas tersedia (komponen dimuat asinkron), lalu render.
// Retry dibatasi (10 detik) agar tidak berjalan selamanya bila fragment gagal dimuat.
function initializeCharts(tries = 0) {
  if (!document.getElementById("socialMediaChart")) {
    if (tries < 50) setTimeout(() => initializeCharts(tries + 1), 200);
    return;
  }
  createSocialMediaChart();
}

if (typeof window !== "undefined") {
  window.initializeCharts = initializeCharts;
}
