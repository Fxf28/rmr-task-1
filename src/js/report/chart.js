// src/js/report/chart.js
// ReportCharts: mobile-first, lazy-load, priority, animation tweaks, chart:ready dispatch
// Utilitas warna/font diambil dari chart-utils.js (sumber tunggal: token CSS design system).

import Chart from "chart.js/auto";
import { readCssVar, hexToRgba, fontFamily, getBreakpoint } from "../chart-utils.js";

class ReportCharts {
  constructor({ lazyLoad = true, eager = false, animationDuration = 400 } = {}) {
    // color tokens, read once from CSS custom properties (design system palette)
    this.colors = {
      primary: readCssVar("--chart-1", "#4f46e5"),
      secondary: readCssVar("--chart-2", "#10b981"),
      accent: readCssVar("--chart-3", "#f59e0b"),
      danger: readCssVar("--chart-4", "#f43f5e"),
      warning: readCssVar("--chart-3", "#f59e0b"),
      info: readCssVar("--chart-5", "#0ea5e9"),
      facebook: "#1877f2",
      instagram: "#e4405f",
      tiktok: "#000000",
      twitter: "#111827",
      chart4: readCssVar("--chart-4", "#f43f5e"),
      chart6: readCssVar("--chart-6", "#8b5cf6"),
      chart8: readCssVar("--chart-8", "#64748b"),
    };

    // runtime state
    this.charts = {}; // keyed by canvas id
    this.observers = {}; // intersection and resize observers
    this.lazyLoad = !!lazyLoad;
    this.eager = !!eager;
    this.animationDuration = typeof animationDuration === "number" ? animationDuration : 400;

    // responsive flags
    this.breakpoint = getBreakpoint();
    this.isMobile = this.breakpoint === "mobile";
    this.isTablet = this.breakpoint === "tablet";
    this.isDesktop = this.breakpoint === "desktop";

    // registry mapping (id -> factory)
    this.chartRegistry = {
      "platform-usage-chart": () => this.buildPlatformUsageConfig(),
      "country-distribution-chart": () => this.buildCountryDistributionConfig(),
      "motivation-chart": () => this.buildMotivationConfig(),
      "decision-journey-chart": () => this.buildDecisionJourneyConfig(),
      "concerns-chart": () => this.buildConcernsConfig(),
      "timeline-chart": () => this.buildTimelineConfig(),
      "demographic-chart": () => this.buildDemographicConfig(),
      "scholarship-interest-chart": () => this.buildScholarshipConfig(),
    };

    // bind
    this.handleResize = this.handleResize.bind(this);

    // lifecycle init
    window.addEventListener("resize", this.handleResize);
    if (this.eager || !this.lazyLoad) {
      // create all right away
      this.forceInitializeAllCharts();
    } else {
      this.setupObservers();
    }
  }

  /* ===== responsive helpers ===== */
  updateResponsiveFlags() {
    const newBp = getBreakpoint();
    if (newBp !== this.breakpoint) {
      this.breakpoint = newBp;
      this.isMobile = newBp === "mobile";
      this.isTablet = newBp === "tablet";
      this.isDesktop = newBp === "desktop";
      // rebuild charts so they adopt new sizes/labels
      this.rebuildAllCharts();
    }
  }

  handleResize() {
    // debounce lightly
    if (this._resizeTimer) clearTimeout(this._resizeTimer);
    this._resizeTimer = setTimeout(() => {
      this.updateResponsiveFlags();
      // attempt to call resize on existing charts
      Object.values(this.charts).forEach((c) => {
        try {
          c.resize();
          c.update("none");
        } catch (e) {}
      });
    }, 120);
  }

  destroy() {
    window.removeEventListener("resize", this.handleResize);
    Object.values(this.charts).forEach((c) => {
      try {
        c.destroy();
      } catch (e) {}
    });
    this.charts = {};

    Object.values(this.observers).forEach((o) => {
      try {
        o.disconnect();
      } catch (e) {}
    });
    this.observers = {};
  }

  rebuildAllCharts() {
    // destroy all and re-register observers
    Object.values(this.charts).forEach((c) => {
      try {
        c.destroy();
      } catch (e) {}
    });
    this.charts = {};
    Object.values(this.observers).forEach((o) => {
      try {
        o.disconnect();
      } catch (e) {}
    });
    this.observers = {};
    // re-setup
    if (this.lazyLoad && !this.eager) {
      this.setupObservers();
    } else {
      this.forceInitializeAllCharts();
    }
  }

  /* ===== utilities ===== */
  getResponsiveOptions() {
    return {
      fontSizes: {
        title: this.isMobile ? 15 : 14,
        legend: this.isMobile ? 12 : 13,
        ticks: this.isMobile ? 11 : 12,
        tooltip: this.isMobile ? 12 : 13,
      },
      legendPosition: this.isMobile ? "top" : "right",
      pointRadius: 4,
      borderWidth: 2.5,
      cutout: this.isMobile ? "58%" : "68%",
      animationDuration: this.animationDuration,
    };
  }

  /* ===== registry & lazy-load ===== */
  setupObservers() {
    // observe each registered chart id
    Object.keys(this.chartRegistry).forEach((id) => {
      // skip jika observer (atau chart) sudah ada, cegah duplikasi pada re-init
      if (this.charts[id] || this.observers[`io-${id}`]) return;

      // If chart already created in DOM (canvas exists and container marked priority), create directly
      const container = document.querySelector(`[data-chart-id="${id}"]`);
      const canvas = document.getElementById(id) || (container && container.querySelector("canvas"));

      // If container has explicit priority, create immediately
      if (container && container.dataset.chartPriority === "high") {
        this.createChartById(id);
        return;
      }

      // If canvas exists, use intersection observer on canvas; else observe container if exists
      const targetEl = canvas || container;
      if (!targetEl) {
        // nothing to observe in DOM now, skip, maybe injected later by report-content.js
        return;
      }

      const io = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting || entry.intersectionRatio > 0) {
              this.createChartById(id);
              try {
                obs.unobserve(entry.target);
              } catch (e) {}
            }
          });
        },
        { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
      );

      io.observe(targetEl);
      this.observers[`io-${id}`] = io;
    });

    // Also watch for dynamic injection into a parent charts container
    const chartsRoot = document.getElementById("charts-container");
    if (chartsRoot && !this.observers["mut"]) {
      const mut = new MutationObserver(() => {
        // re-run setup for any newly added canvases
        Object.keys(this.chartRegistry).forEach((id) => {
          if (!this.charts[id]) {
            const container = document.querySelector(`[data-chart-id="${id}"]`);
            const canvas = document.getElementById(id) || (container && container.querySelector("canvas"));
            if (canvas) {
              // if priority, create now
              if (container && container.dataset.chartPriority === "high") {
                this.createChartById(id);
              } else {
                // ensure an observer exists (avoid duplicates)
                if (!this.observers[`io-${id}`]) {
                  const io = new IntersectionObserver(
                    (entries, obs) => {
                      entries.forEach((entry) => {
                        if (entry.isIntersecting || entry.intersectionRatio > 0) {
                          this.createChartById(id);
                          try {
                            obs.unobserve(entry.target);
                          } catch (e) {}
                        }
                      });
                    },
                    { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
                  );
                  io.observe(canvas);
                  this.observers[`io-${id}`] = io;
                }
              }
            }
          }
        });
      });
      mut.observe(chartsRoot, { childList: true, subtree: true });
      this.observers["mut"] = mut;
    }
  }

  forceInitializeAllCharts() {
    Object.keys(this.chartRegistry).forEach((id) => this.createChartById(id));
  }

  createChartById(id) {
    // safety
    if (!this.chartRegistry[id]) return;

    // avoid double-creating
    if (this.charts[id]) return;

    const canvas = document.getElementById(id) || document.querySelector(`[data-chart-id="${id}"] canvas`);
    const container = document.querySelector(`[data-chart-id="${id}"]`) || (canvas && canvas.parentElement);

    if (!canvas) return;

    // build config from factory
    const cfg = this.chartRegistry[id]();

    // ensure animation duration & mobile adjustment
    cfg.options = cfg.options || {};
    cfg.options.animation = cfg.options.animation || {};
    cfg.options.animation.duration = cfg.options.animation.duration ?? this.getResponsiveOptions().animationDuration;
    // shorten animations on mobile slightly
    if (this.isMobile) cfg.options.animation.duration = Math.min(cfg.options.animation.duration, 300);

    // create chart instance
    try {
      const chart = new Chart(canvas, cfg);
      this.charts[id] = chart;

      // ensure container flagged ready so skeleton logic elsewhere can hide overlays
      if (container) {
        try {
          container.dataset.chartReady = "1";
        } catch (e) {}
      }

      // dispatch "chart:ready"
      try {
        document.dispatchEvent(new CustomEvent("chart:ready", { detail: { id } }));
      } catch (e) {}

      // add resize observer to keep chart responsive if container size changes
      this.addChartResizeObserver(chart, id);
    } catch (err) {
      console.error("Failed to initialize chart:", id, err);
    }
  }

  addChartResizeObserver(chart, chartId) {
    try {
      const canvas = document.getElementById(chartId);
      const container = document.querySelector(`[data-chart-id="${chartId}"]`) || (canvas && canvas.parentElement);
      if (!container) return;

      const ro = new ResizeObserver(() => {
        try {
          if (chart && typeof chart.resize === "function") {
            chart.resize();
            chart.update("none");
          }
        } catch (e) {}
      });

      ro.observe(container);
      this.observers[`ro-${chartId}`] = ro;
    } catch (e) {
      // noop
    }
  }

  /* ====== chart config factories (mobile-aware) ====== */
  buildPlatformUsageConfig() {
    const opts = this.getResponsiveOptions();
    const isMobile = this.isMobile;
    const labels = ["Keterlibatan", "Konten Visual", "Interaksi", "Kecepatan", "Keakuratan"];

    return {
      type: "radar",
      data: {
        labels,
        datasets: [
          {
            label: "Instagram",
            data: [95, 90, 85, 75, 70],
            borderColor: this.colors.instagram,
            backgroundColor: hexToRgba(this.colors.instagram, 0.12),
            pointBackgroundColor: this.colors.instagram,
            pointRadius: opts.pointRadius,
            borderWidth: opts.borderWidth,
          },
          {
            label: "TikTok",
            data: [98, 95, 90, 85, 65],
            borderColor: this.colors.tiktok,
            backgroundColor: hexToRgba(this.colors.tiktok, 0.12),
            pointBackgroundColor: this.colors.tiktok,
            pointRadius: opts.pointRadius,
            borderWidth: opts.borderWidth,
          },
          {
            label: "Facebook",
            data: [45, 60, 70, 65, 85],
            borderColor: this.colors.facebook,
            backgroundColor: hexToRgba(this.colors.facebook, 0.12),
            pointBackgroundColor: this.colors.facebook,
            pointRadius: opts.pointRadius,
            borderWidth: opts.borderWidth,
          },
          {
            label: "Twitter/X",
            data: [32, 40, 55, 80, 75],
            borderColor: this.colors.twitter,
            backgroundColor: hexToRgba(this.colors.twitter, 0.12),
            pointBackgroundColor: this.colors.twitter,
            pointRadius: opts.pointRadius,
            borderWidth: opts.borderWidth,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: { display: true, lineWidth: 1, color: "rgba(0,0,0,0.05)" },
            suggestedMin: 0,
            suggestedMax: 100,
            ticks: {
              display: true,
              stepSize: 20,
              font: { size: isMobile ? 12 : opts.fontSizes.ticks, family: fontFamily() },
              callback: (v) => `${v}%`,
            },
            pointLabels: {
              font: { size: isMobile ? 12 : opts.fontSizes.ticks, family: fontFamily() },
              color: "#475569",
            },
          },
        },
        plugins: {
          legend: {
            position: isMobile ? "top" : "bottom",
            labels: { font: { size: isMobile ? 13 : opts.fontSizes.legend }, usePointStyle: true, boxWidth: isMobile ? 12 : 14, color: "#334155" },
          },
          tooltip: {
            callbacks: { label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}%` },
            bodyFont: { size: opts.fontSizes.tooltip, family: fontFamily() },
            backgroundColor: "rgba(15, 23, 42, 0.92)",
            borderColor: "#e2e8f0",
            borderWidth: 1,
          },
        },
      },
    };
  }

  buildCountryDistributionConfig() {
    const opts = this.getResponsiveOptions();
    const isMobile = this.isMobile;
    const dataArr = [28, 22, 18, 15, 8, 5, 3, 1];
    const labels = ["Australia", "Singapura", "Jepang", "Amerika Serikat", "Inggris", "Korea Selatan", "Jerman", "Lainnya"];

    return {
      type: "doughnut",
      data: {
        labels,
        datasets: [
          {
            data: dataArr,
            backgroundColor: [this.colors.info, this.colors.secondary, this.colors.danger, this.colors.chart6, this.colors.accent, "#ec4899", this.colors.primary, this.colors.chart8],
            borderColor: "#FFFFFF",
            borderWidth: isMobile ? 3 : opts.borderWidth,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: isMobile ? "55%" : "65%",
        plugins: {
          legend: { position: isMobile ? "bottom" : "right", labels: { font: { size: isMobile ? 13 : opts.fontSizes.legend }, color: "#334155" } },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const label = ctx.label || "";
                const value = ctx.parsed;
                const total = dataArr.reduce((a, b) => a + b, 0);
                const pct = Math.round((value / total) * 100);
                return `${label}: ${pct}% (${value})`;
              },
            },
            bodyFont: { size: opts.fontSizes.tooltip, family: fontFamily() },
            backgroundColor: "rgba(15, 23, 42, 0.92)",
            borderColor: "#e2e8f0",
            borderWidth: 1,
          },
        },
      },
    };
  }

  buildMotivationConfig() {
    const opts = this.getResponsiveOptions();
    const isMobile = this.isMobile;
    const labels = isMobile
      ? ["Kualitas Pendidikan", "Peluang Karir", "Pengalaman Internasional", "Prestise", "Biaya Terjangkau", "Lingkungan Riset"]
      : ["Kualitas Pendidikan", "Peluang Karir", "Pengalaman Internasional", "Prestise", "Biaya Lebih Terjangkau", "Lingkungan Riset"];
    const dataValues = [95, 88, 82, 65, 42, 38];

    const base = {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Skor kepentingan (indikatif)",
            data: dataValues,
            backgroundColor: [
              hexToRgba(this.colors.primary, 0.9),
              hexToRgba(this.colors.secondary, 0.9),
              hexToRgba(this.colors.accent, 0.9),
              hexToRgba(this.colors.info, 0.9),
              hexToRgba(this.colors.warning, 0.9),
              hexToRgba(this.colors.danger, 0.9),
            ],
            borderColor: [this.colors.primary, this.colors.secondary, this.colors.accent, this.colors.info, this.colors.warning, this.colors.danger],
            borderWidth: opts.borderWidth,
            borderRadius: isMobile ? 8 : 10,
            borderSkipped: false,
          },
        ],
      },
      options: {
        indexAxis: isMobile ? "y" : "x",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}` },
            bodyFont: { family: fontFamily() },
            backgroundColor: "rgba(15, 23, 42, 0.92)",
            borderColor: "#e2e8f0",
            borderWidth: 1,
          },
        },
        scales: {},
      },
    };

    if (isMobile) {
      base.options.scales = {
        x: {
          beginAtZero: true,
          max: 100,
          ticks: {
            font: { size: 13, family: fontFamily() },
            callback: (value) => (value % 20 === 0 ? value : null),
          },
          grid: { display: true, drawBorder: false },
        },
        y: {
          ticks: { autoSkip: false, font: { size: 13, family: fontFamily() } },
          grid: { display: false },
        },
      };
    } else {
      base.options.scales = {
        x: { ticks: { autoSkip: false, font: { size: opts.fontSizes.ticks, family: fontFamily() } }, grid: { display: false } },
        y: { beginAtZero: true, max: 100, ticks: { font: { size: opts.fontSizes.ticks, family: fontFamily() } }, grid: { display: true } },
      };
    }

    return base;
  }

  buildDecisionJourneyConfig() {
    const opts = this.getResponsiveOptions();
    const isMobile = this.isMobile;

    return {
      type: "line",
      data: {
        labels: ["Bulan 1-2", "Bulan 3-4", "Bulan 5-6", "Bulan 7-8", "Bulan 9-10", "Bulan 11-12"],
        datasets: [
          { label: "Kesadaran & Inspirasi", data: [85, 90, 75, 50, 30, 20], borderColor: this.colors.primary, backgroundColor: hexToRgba(this.colors.primary, 0.08), fill: true, tension: 0.4, pointRadius: opts.pointRadius },
          { label: "Pencarian Informasi", data: [20, 75, 95, 85, 60, 40], borderColor: this.colors.secondary, backgroundColor: hexToRgba(this.colors.secondary, 0.08), fill: true, tension: 0.4, pointRadius: opts.pointRadius },
          { label: "Persiapan & Aplikasi", data: [5, 30, 60, 85, 95, 80], borderColor: this.colors.accent, backgroundColor: hexToRgba(this.colors.accent, 0.08), fill: true, tension: 0.4, pointRadius: opts.pointRadius },
          { label: "Keputusan & Realisasi", data: [0, 10, 25, 45, 70, 85], borderColor: this.colors.danger, backgroundColor: hexToRgba(this.colors.danger, 0.08), fill: true, tension: 0.4, pointRadius: opts.pointRadius },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { intersect: false, mode: "index" },
        scales: { y: { beginAtZero: true, max: 100, ticks: { callback: (v) => `${v}%`, font: { size: opts.fontSizes.ticks, family: fontFamily() } } } },
        plugins: {
          legend: { position: "top", labels: { font: { size: opts.fontSizes.legend }, color: "#334155" } },
          tooltip: {
            callbacks: { label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}%` },
            bodyFont: { family: fontFamily() },
            backgroundColor: "rgba(15, 23, 42, 0.92)",
            borderColor: "#e2e8f0",
            borderWidth: 1,
          },
        },
      },
    };
  }

  buildConcernsConfig() {
    const opts = this.getResponsiveOptions();
    const isMobile = this.isMobile;
    const isTablet = this.isTablet;
    const isDesktop = this.isDesktop;

    const labels = isMobile
      ? ["Biaya Hidup", "Biaya Kuliah", "Bahasa", "Visa", "Kultur", "Dukungan", "Karir"]
      : isTablet
      ? ["Biaya Hidup", "Biaya Kuliah", "Persyaratan Bahasa", "Proses Visa", "Kultur & Adaptasi", "Dukungan Keluarga", "Prospek Karir"]
      : ["Biaya Hidup", "Biaya Kuliah", "Persyaratan Bahasa", "Proses Visa", "Kultur & Adaptasi", "Dukungan Keluarga", "Prospek Karir Pasca Studi"];

    return {
      type: "polarArea",
      data: {
        labels,
        datasets: [
          {
            data: [95, 90, 85, 80, 75, 70, 65],
            backgroundColor: [
              hexToRgba(this.colors.danger, 0.85),
              hexToRgba(this.colors.warning, 0.85),
              hexToRgba(this.colors.accent, 0.85),
              hexToRgba(this.colors.info, 0.85),
              hexToRgba(this.colors.primary, 0.85),
              hexToRgba(this.colors.secondary, 0.85),
              hexToRgba(this.colors.chart6, 0.85),
            ],
            borderColor: "#ffffff",
            borderWidth: isMobile ? 3 : opts.borderWidth,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { animateRotate: true, animateScale: true, duration: Math.min(1000, this.animationDuration * 2), easing: "easeOutQuart" },
        plugins: {
          legend: {
            position: isMobile ? "top" : isDesktop ? "right" : "bottom",
            labels: { font: { size: isMobile ? 13 : opts.fontSizes.legend }, color: "#334155", usePointStyle: true },
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const value = ctx.parsed?.r ?? 0;
                return `${ctx.label}: ${value}%`;
              },
            },
            bodyFont: {
              size: opts.fontSizes.tooltip,
              family: fontFamily(),
            },
            backgroundColor: "rgba(15, 23, 42, 0.92)",
            borderColor: "#e2e8f0",
            borderWidth: 1,
          },
        },
        scales: {
          r: {
            beginAtZero: true,
            min: 0,
            max: 100,
            ticks: { stepSize: 20, callback: (v) => `${v}%`, font: { size: isMobile ? 12 : opts.fontSizes.ticks, family: fontFamily() } },
          },
        },
      },
    };
  }

  buildTimelineConfig() {
    const opts = this.getResponsiveOptions();
    const isMobile = this.isMobile;
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const engagementData = [45, 52, 58, 65, 72, 78, 85, 92, 90, 82, 70, 58];
    const applicationData = [10, 15, 25, 40, 60, 75, 90, 95, 90, 80, 60, 45];
    const applicationWindow = [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0];

    return {
      type: "bar",
      data: {
        labels: months,
        datasets: [
          {
            type: "line",
            label: "Engagement media sosial",
            data: engagementData,
            borderColor: this.colors.primary,
            backgroundColor: hexToRgba(this.colors.primary, 0.08),
            fill: true,
            tension: 0.4,
            pointRadius: opts.pointRadius,
            borderWidth: opts.borderWidth,
            order: 1,
          },
          {
            type: "bar",
            label: "Aplikasi beasiswa",
            data: applicationData,
            backgroundColor: hexToRgba(this.colors.secondary, 0.85),
            borderRadius: isMobile ? 4 : 6,
            borderSkipped: false,
            order: 2,
          },
          {
            type: "bar",
            label: "Periode pendaftaran utama",
            data: applicationWindow,
            backgroundColor: hexToRgba(this.colors.primary, 0.12),
            borderWidth: 0,
            barPercentage: 1,
            categoryPercentage: 1,
            order: 3,
            yAxisID: "yWindow",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { intersect: false, mode: "index" },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: "Skor indikatif (0-100)",
              font: { size: isMobile ? 12 : opts.fontSizes.ticks, family: fontFamily() },
              color: "#64748b",
            },
            ticks: {
              callback: (v) => v,
              font: { size: isMobile ? 12 : opts.fontSizes.ticks, family: fontFamily() },
            },
            grid: { display: true },
          },
          yWindow: { beginAtZero: true, max: 1, display: false },
          x: {
            ticks: { font: { size: isMobile ? 12 : opts.fontSizes.ticks, family: fontFamily() } },
            grid: { display: false },
          },
        },
        plugins: {
          legend: { position: "top", labels: { font: { size: isMobile ? 13 : opts.fontSizes.legend }, color: "#334155", usePointStyle: true, boxWidth: isMobile ? 12 : 14 } },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                if (ctx.dataset.yAxisID === "yWindow") return "Periode pendaftaran utama (indikatif)";
                return `${ctx.dataset.label}: ${ctx.parsed.y} (skor indikatif)`;
              },
            },
            bodyFont: { size: opts.fontSizes.tooltip, family: fontFamily() },
            backgroundColor: "rgba(15, 23, 42, 0.92)",
            borderColor: "#e2e8f0",
            borderWidth: 1,
          },
        },
      },
    };
  }

  buildDemographicConfig() {
    const opts = this.getResponsiveOptions();
    const isMobile = this.isMobile;
    const labels = isMobile ? ["SMA", "S1", "Fresh Grad", "Pro <5th", "Pro >5th"] : ["SMA/Sederajat", "Mahasiswa S1", "Fresh Graduate", "Profesional <5th", "Profesional >5th"];

    return {
      type: "bar",
      data: {
        labels,
        datasets: [
          { label: "Usia 17-19", data: [85, 10, 3, 1, 1], backgroundColor: hexToRgba(this.colors.primary, 0.9), borderRadius: isMobile ? 6 : 8 },
          { label: "Usia 20-22", data: [15, 70, 10, 3, 2], backgroundColor: hexToRgba(this.colors.secondary, 0.9), borderRadius: isMobile ? 6 : 8 },
          { label: "Usia 23-25", data: [0, 15, 60, 20, 5], backgroundColor: hexToRgba(this.colors.accent, 0.9), borderRadius: isMobile ? 6 : 8 },
          { label: "Usia 26+", data: [0, 5, 27, 50, 18], backgroundColor: hexToRgba(this.colors.info, 0.9), borderRadius: isMobile ? 6 : 8 },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { x: { stacked: true, ticks: { font: { size: opts.fontSizes.ticks, family: fontFamily() } } }, y: { stacked: true, ticks: { callback: (v) => `${v}%`, font: { size: opts.fontSizes.ticks, family: fontFamily() } } } },
        plugins: {
          legend: { position: "top", labels: { font: { size: opts.fontSizes.legend }, color: "#334155" } },
          tooltip: { bodyFont: { family: fontFamily() }, backgroundColor: "rgba(15, 23, 42, 0.92)", borderColor: "#e2e8f0", borderWidth: 1 },
        },
      },
    };
  }

  buildScholarshipConfig() {
    const opts = this.getResponsiveOptions();
    const isMobile = this.isMobile;

    const labels = isMobile ? ["Penuh", "Parsial", "Pinjaman", "Mandiri", "Sponsor"] : ["Beasiswa Penuh", "Beasiswa Parsial", "Pinjaman Pendidikan", "Biaya Mandiri", "Sponsor Perusahaan"];

    const data = [65, 20, 10, 3, 2];

    return {
      type: "pie",
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: [hexToRgba(this.colors.primary, 0.9), hexToRgba(this.colors.secondary, 0.9), hexToRgba(this.colors.accent, 0.9), hexToRgba(this.colors.info, 0.9), hexToRgba(this.colors.danger, 0.9)],
            borderColor: "#FFF",
            borderWidth: isMobile ? 3 : opts.borderWidth,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: isMobile ? "bottom" : "right",
            labels: {
              font: { size: isMobile ? 13 : opts.fontSizes.legend },
              color: "#334155",
            },
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const dataset = ctx.dataset.data;
                const total = dataset.reduce((a, b) => a + b, 0);
                const value = ctx.parsed;
                const percentage = ((value / total) * 100).toFixed(1);

                return `${ctx.label}: ${percentage}%`;
              },
            },
            bodyFont: {
              size: opts.fontSizes.tooltip,
              family: fontFamily(),
            },
            backgroundColor: "rgba(15, 23, 42, 0.92)",
            borderColor: "#e2e8f0",
            borderWidth: 1,
          },
        },
      },
    };
  }

  /* ===== public helpers ===== */
  initializeAllCharts() {
    // If lazyLoad disabled, create all now. Otherwise ensure observers set.
    if (!this.lazyLoad) {
      this.forceInitializeAllCharts();
    } else {
      this.setupObservers();
    }
  }
}

/* ===== AUTO INIT ===== */
document.addEventListener("DOMContentLoaded", () => {
  // Halaman laporan saja (dashboard tidak punya charts-container; hindari kerja sia-sia)
  if (!document.getElementById("charts-container")) return;

  // instantiate with sensible defaults for your report
  const reportCharts = new ReportCharts({ lazyLoad: true, eager: false, animationDuration: 300 });

  // expose for debug / manual control
  window.reportCharts = reportCharts;

  // initialize all (observers are already set in constructor). Keep a safe deferred call
  // to ensure any dynamically injected DOM has time to appear.
  setTimeout(() => {
    try {
      reportCharts.initializeAllCharts();
    } catch (e) {}
  }, 350);

  // teardown on unload
  window.addEventListener("beforeunload", () => reportCharts.destroy());
});
