// src/js/component-loader.js
// Shared fragment loader, dipakai dashboard (index.html) & laporan (study-abroad-report.html).
// Strategi: fetch paralel (Promise.all) + insert berurutan sesuai urutan deklarasi,
// dengan cache in-memory agar fragment tidak dimuat ulang antar halaman/SPA.

const cache = new Map();

/**
 * Ambil satu fragment HTML.
 * @param {string} basePath folder komponen (default "components")
 * @param {string} path     nama fragment tanpa ekstensi (mis. "exec-summary" atau "report/charts-container")
 * @returns {Promise<string|null>} HTML string, atau null bila gagal
 */
export async function fetchFragment(path, basePath = "components") {
  const url = `${basePath}/${path}.html`;
  if (cache.has(url)) return cache.get(url);
  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const html = await resp.text();
    cache.set(url, html);
    return html;
  } catch (err) {
    console.warn(`Failed to fetch ${path}:`, err);
    return null;
  }
}

/**
 * Muat banyak fragment secara paralel, lalu sisipkan berurutan.
 * @param {Array<{path: string, basePath?: string, insert: (html: string) => void}>} entries
 * @returns {Promise<void>}
 */
export async function loadOrdered(entries) {
  const fetched = await Promise.all(
    entries.map(async (entry) => ({
      entry,
      html: await fetchFragment(entry.path, entry.basePath ?? "components"),
    }))
  );
  for (const { entry, html } of fetched) {
    if (html && typeof entry.insert === "function") entry.insert(html);
  }
}
