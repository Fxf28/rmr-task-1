// report-skeleton.js — skeleton overlay untuk chart report (lazy-loaded oleh ReportCharts)
// Dipanggil dari study-abroad-report.html; bekerja sama dengan event "chart:ready".

(function () {
  const CHART_IDS = [
    "platform-usage-chart",
    "country-distribution-chart",
    "motivation-chart",
    "scholarship-interest-chart",
    "decision-journey-chart",
    "concerns-chart",
    "timeline-chart",
    "demographic-chart",
  ];
  const PRIORITY = new Set(["platform-usage-chart", "decision-journey-chart", "demographic-chart"]);

  function ensureSkeletonOn(container, canvasId) {
    if (!container) return;
    if (!container.dataset.chartId) container.dataset.chartId = canvasId || container.querySelector("canvas")?.id || "";
    if (PRIORITY.has(container.dataset.chartId)) container.dataset.chartPriority = "high";

    if (!container.querySelector(".chart-skeleton")) {
      const sk = document.createElement("div");
      sk.className = "chart-skeleton";
      sk.innerHTML = '<div class="pulse" aria-hidden="true"></div><div class="label">Memuat visual…</div>';
      container.appendChild(sk);
    } else {
      container.querySelector(".chart-skeleton").classList.remove("hidden");
    }
  }

  function annotateExisting(root) {
    const containers = root.querySelectorAll(".chart-container");
    containers.forEach((cont) => {
      const canvas = cont.querySelector("canvas");
      const canvasId = canvas?.id || cont.dataset.chartId || "";
      if (canvasId) ensureSkeletonOn(cont, canvasId);
    });
    CHART_IDS.forEach((id) => {
      const canvas = root.querySelector("#" + id);
      if (canvas) {
        const cont = canvas.closest(".chart-container") || canvas.parentElement;
        ensureSkeletonOn(cont, id);
      }
    });
  }

  function startObserver(root) {
    if (window.__skeletonObserver) return;
    const observer = new MutationObserver(() => {
      annotateExisting(root);
      if (root.querySelector("canvas")) {
        setTimeout(() => {
          try {
            observer.disconnect();
          } catch (e) {}
        }, 800);
      }
    });
    observer.observe(root, { childList: true, subtree: true });
    window.__skeletonObserver = observer;
  }

  document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("charts-container");
    if (!root) return;
    annotateExisting(root);
    startObserver(root);

    document.addEventListener("chart:ready", (e) => {
      const id = e?.detail?.id;
      if (!id) return;
      const container = document.querySelector('[data-chart-id="' + id + '"]');
      const skeleton = container?.querySelector(".chart-skeleton");
      if (skeleton) skeleton.classList.add("hidden");
    });

    const tryHideFromInstances = () => {
      const rc = window.reportCharts;
      if (!rc || !rc.charts) return;
      Object.keys(rc.charts).forEach((k) => {
        const container = document.querySelector('[data-chart-id="' + k + '"]');
        const skeleton = container?.querySelector(".chart-skeleton");
        if (skeleton) skeleton.classList.add("hidden");
      });
    };

    let tries = 0;
    const poll = setInterval(() => {
      tries++;
      tryHideFromInstances();
      if ((window.reportCharts && Object.keys(window.reportCharts.charts || {}).length >= 3) || tries > 10) {
        clearInterval(poll);
      }
    }, 300);

    // Fallback keamanan
    setTimeout(() => {
      document.querySelectorAll(".chart-skeleton").forEach((s) => s.classList.add("hidden"));
    }, 6000);
  });
})();
