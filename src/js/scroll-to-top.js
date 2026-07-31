// src/js/scroll-to-top.js
// Shared scroll-to-top button wiring (dashboard & laporan).
// Mendukung: prefers-reduced-motion, keyboard Enter/Space, sembunyi saat di atas 300px.
// Butuh elemen <button id="scrollToTopBtn"> (statis di study-abroad-report.html,
// dimuat via komponen footer di dashboard).

export function initScrollToTop(btnId = "scrollToTopBtn") {
  const btn = document.getElementById(btnId);
  if (!btn) return;

  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });

  function toggle() {
    const y = window.pageYOffset || document.documentElement.scrollTop;
    btn.classList.toggle("hidden", y <= 300);
    btn.setAttribute("aria-hidden", String(y <= 300));
  }

  window.addEventListener("scroll", () => setTimeout(toggle, 80), { passive: true });
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    scrollToTop();
    btn.blur();
  });
  btn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      scrollToTop();
    }
  });
  toggle();
}
