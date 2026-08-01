// src/js/chart-utils.js
// Utilitas bersama untuk kedua sistem chart (dashboard `charts.js` & laporan `report/chart.js`).
// Sumber warna & font tunggal: CSS custom properties di src/css/main.css (design system).

/**
 * Baca CSS custom property dengan fallback (aman terhadap getComputedStyle yang gagal).
 * @param {string} name     nama variabel CSS (mis. "--chart-1")
 * @param {string} fallback nilai default bila tidak tersedia
 * @returns {string}
 */
export function readCssVar(name, fallback = "") {
  try {
    const val = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return val || fallback;
  } catch (e) {
    return fallback;
  }
}

/**
 * Konversi hex (#rrggbb) ke rgba dengan alpha.
 * @param {string} hex
 * @param {number} alpha 0-1
 * @returns {string}
 */
export function hexToRgba(hex, alpha = 1) {
  if (!hex || hex[0] !== "#") return hex;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Font keluarga yang dipakai chart, baca dari design system (--font-sans).
 * @returns {string}
 */
export function fontFamily() {
  const f = readCssVar("--font-sans");
  return f || "'Inter', ui-sans-serif, system-ui, sans-serif";
}

/**
 * Klasifikasi breakpoint layar (mobile/tablet/desktop).
 * @param {number} width
 * @returns {"mobile"|"tablet"|"desktop"}
 */
export function getBreakpoint(width = window.innerWidth) {
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}
