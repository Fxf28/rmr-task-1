// Entry module, di-load oleh index.html & study-abroad-report.html.
// Memuat modul wiring per halaman; masing-masing punya guard sendiri,
// sehingga bundle yang sama aman untuk kedua halaman.
import "./charts.js"; // chart dashboard (register window.initializeCharts)
import "./report/chart.js"; // ReportCharts (auto-init hanya bila #charts-container ada)
import "./dashboard.js"; // wiring dashboard (guard: #header-container)
import "./report-page.js"; // wiring laporan (guard: #report-content)
import "./report-nav.js"; // navigasi antar tiga laporan (guard: #report-nav-container)
