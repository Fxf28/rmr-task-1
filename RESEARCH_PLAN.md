# Tahap 3 — Research Plan: Penggantian Data dengan Fokus Solo Raya

> Status: rencana kerja untuk eksekusi bertahap
> Coverage: Kota Surakarta, Kab. Sukoharjo, Karanganyar, Boyolali, Klaten, Sragen, Wonogiri
> Prinsip: tidak ada angka nasional sebagai data utama tanpa label; tidak ada angka tanpa sumber.

---

## 1. Tujuan

1. Ganti seluruh data nasional, umum, atau asumsi dengan data spesifik Solo Raya.
2. Data nasional hanya boleh muncul sebagai **konteks berlabel** ("proksi nasional") dan tidak pernah menggantikan data lokal.
3. Setiap angka baru wajib memiliki: **Sumber** + **Confidence** + **Coverage Area** + **Last Updated**.
4. Data yang tidak tersedia ditulis sebagai insight kualitatif berlabel, bukan dikarang.

## 2. Inventori Data yang Harus Diganti (Prioritas)

| # | Klaim saat ini | Masalah | Pengganti yang dicari |
|---|----------------|---------|----------------------|
| 1 | 80,5% penetrasi internet (nasional, Okt 2025) | Nasional | Penetrasi internet Jateng/Solo Raya (APJII, Diskominfo) |
| 2 | TikTok 108 jt, YT 143 jt, FB 122 jt, IG 103 jt (18+) | Nasional | Ukuran audiens iklan geotarget Solo Raya (Meta Ads Library) + APJII per provinsi |
| 3 | 3 jam 8 menit media sosial/hari (nasional) | Nasional | Waktu digital per segmen via wawancara/netnografi; proksi berlabel bila perlu |
| 4 | Durasi engagement "per bulan" di timeline-chart | Asumsi | Kalibrasi dengan jadwal LPDP + pola pendaftaran kampus Solo Raya (wawancara agen/bimba) |
| 5 | Skor indikatif radar/radar platform (95/90/85...) | Asumsi | Re-score dari bukti: jumlah post geotag, review, wawancara, Ads Library |
| 6 | Driver motivasi & faktor keputusan (ordinal) | Observasi umum | Hasil wawancara siswa/mahasiswa Solo Raya + agen edukasi lokal |
| 7 | Persona 9 segmen (observasi) | Observasi umum | Netnografi grup lokal + wawancara informan + (opsional) survei terbatas |
| 8 | UMK/PDRB/UMKM/LPDP/UNS/UMS | Sudah terverifikasi | Pertahankan; refresh tanggal rilis bila ada pembaruan |
| 9 | "Jateng 5,37%" | Konteks regional | Pertahankan sebagai konteks, bukan data utama |

## 3. Prinsip & Rubrik Validasi

- **Aturan 2 sumber:** angka kunci perlu 2 sumber independen (mis. BPS kabupaten + rilis media resmi) sebelum di-label High.
- **Confidence:**
  - `High` — data resmi (BPS, Dapodik, PDDIKTI, SK Gubernur, LKPJ) dari 2+ sumber.
  - `Med` — data resmi 1 sumber + interpretasi, atau data platform (Ads Library, Google Trends) yang bersifat estimasi.
  - `Low` — indikasi kualitatif (observasi, netnografi, wawancara terbatas).
- **Coverage Area:** cantumkan wilayah yang dicakup (mis. "Surakarta saja" vs "7 wilayah").
- **Research Log:** setiap perubahan data dicatat (komponen, angka lama → baru, sumber, tanggal, confidence).
- **Gate review:** setiap 2–3 domain selesai, hasil dipresentasikan ke user sebelum lanjut.

## 4. Metodologi per Domain

Format umum per domain: tujuan → research questions → sumber → metode → output → target confidence.

### 4.1 Demografi
- **Tujuan:** struktur penduduk 7 wilayah yang akurat dan termutakhir.
- **RQ:** Berapa jumlah & proyeksi penduduk per wilayah? Struktur umur dan sex ratio? Laju pertumbuhan & migrasi? Komposisi keluarga (RT rata-rata)?
- **Sumber:** BPS per kabupaten (publikasi "Dalam Angka 2025/2026"), BPS Jateng, Dukcapil, Satu Data Klaten, PPID/Bappeda tiap daerah, LKPJ Wali Kota.
- **Metode:** desk research; cross-check 2+ sumber per angka.
- **Output:** KPI penduduk, tabel per wilayah (populasi, umur, kepadatan), piramida penduduk.
- **Target:** `High`.

### 4.2 Digital Behaviour
- **Tujuan:** platform, perangkat, dan kebiasaan digital per segmen usia di Solo Raya.
- **RQ:** Platform dominan per segmen? Berapa porsi pengguna per platform yang bisa di-target di area Solo Raya? Perangkat & kanal belanja? Waktu online? Konten lokal apa yang paling terlibat?
- **Sumber:** Meta Ads Library (estimasi audiens iklan area Solo Raya), Google Trends (geo Solo/Jateng), APJII 2025 (penetrasi per provinsi), DataReportal (proksi nasional berlabel), SimilarWeb (trafik situs lokal), Diskominfo (SPBE, wifi publik), observasi konten ber-label (#KulinerSolo, #SoloRaya, #UNS, #UMS).
- **Metode:** desk + trend tools + netnografi.
- **Output:** peta platform per segmen, estimasi audiens per kanal, tren pencarian.
- **Target:** `High` (APJII), `Med` (Ads Library/Google Trends).

### 4.3 Consumer Behaviour
- **Tujuan:** pola belanja dan pengeluaran rumah tangga per wilayah.
- **RQ:** Rata-rata pengeluaran per kapita per bulan per wilayah? Proporsi makanan/non-makanan? Channel (offline/online)? Sensitivitas harga? Waktu belanja?
- **Sumber:** SUSENAS 2024/2025 (pengeluaran per kapita per kabupaten), rilis inflasi bulanan BPS per kabupaten, BI Jateng (Kajian Ekonomi & Keuangan Regional, survei konsumen), UMK 2026 (sudah ada), observasi ritel (pasar tradisional vs mal/plaza di Solo).
- **Metode:** desk + observasi lapangan + wawancara pelaku toko.
- **Output:** komposisi pengeluaran, basket belanja, sensitivitas harga per segmen.
- **Target:** `High`.

### 4.4 Lifestyle
- **Tujuan:** aktivitas leisure, event, dan komunitas yang dominan.
- **RQ:** Aktivitas leisure apa yang tumbuh? Event tetap apa saja per tahun? Seberapa padat venue per kategori per kabupaten? Komunitas mana yang aktif?
- **Sumber:** Solopos/Espos (rubrik lifestyle & event), kalender event (Solo Batik Fashion, JMF, Kirab Budaya, Solo City Walk), Google Maps (jumlah listing gym/kafe/studio per kabupaten), Instagram/TikTok geotag, komunitas lokal.
- **Metode:** desk + enumerasi geotag + wawancara pengurus komunitas.
- **Output:** matriks lifestyle per segmen, kalender event, peta densitas venue.
- **Target:** `Med`.

### 4.5 Education
- **Tujuan:** pipeline pendidikan dari SD sampai PT per kabupaten.
- **RQ:** Jumlah siswa per jenjang per kabupaten? PTN/PTS mana saja yang aktif dan berapa mahasiswanya? Seberapa padat bimbel/kursus? Tren penerimaan (SNBP/SNBT)?
- **Sumber:** Dapodik/Kemendikdasmen (data pokok per kabupaten), PDDIKTI (mahasiswa aktif per PT/prodi), SNPMB, LPDP (sudah terverifikasi), Dinas Pendidikan kabupaten, berita lokal.
- **Metode:** desk.
- **Output:** pipeline SD→PT, peta supply pendidikan (sekolah, bimbel, kursus).
- **Target:** `High`.

### 4.6 Hangout Culture
- **Tujuan:** tempat, waktu, dan nilai transaksi nongkrong.
- **RQ:** Tipologi venue (kafe, co-working, food court, taman)? Jam ramai? Rata-rata spend per kunjungan? Ukuran grup? Aktivitas utama?
- **Sumber:** Google Maps (listing + review + rating), Instagram/TikTok geotag (#KulinerSolo, #NgopiSolo), wawancara pengelola 10–15 venue, observasi jam ramai.
- **Metode:** enumerasi + review mining + wawancara + observasi.
- **Output:** tipologi venue, jam puncak, rentang harga per segmen.
- **Target:** `Med`.

### 4.7 Business Opportunity
- **Tujuan:** peta sektor tumbuh dan peluang per kabupaten berbasis bukti.
- **RQ:** Sektor mana yang tumbuh tertinggi per kabupaten (PDRB 2025)? Struktur UMKM per kabupaten? Distribusi KUR & investasi? Sektor dengan gap suplai?
- **Sumber:** BPS (PDRB per sektor per kabupaten, rilis 2025/2026), Dinas Koperasi/UMKM (jumlah UMKM per kabupaten), BI Jateng (KUR), DPMPTSP (perizinan baru), Espos bisnis.
- **Metode:** desk + wawancara dinas bila perlu.
- **Output:** heatmap sektor per kabupaten, scorecard peluang (rubrik kuat/sedang berbasis bukti).
- **Target:** `High`/`Med`.

### 4.8 Marketing Trend
- **Tujuan:** kanal, format, dan biaya pemasaran efektif di Solo Raya.
- **RQ:** Kanal mana yang dipakai brand lokal? Format konten apa yang perform? Indikasi budget/CPM? Tren pencarian yang naik? Berapa banyak agency/digital marketer lokal?
- **Sumber:** Meta Ads Library (jumlah & format iklan per kategori di area Solo), Google Trends (rising queries), TikTok Creative Center, wawancara 5–8 pelaku (agency, UMKM marketer, media lokal), program digitalisasi UMKM pemerintah daerah.
- **Metode:** desk + trend + wawancara.
- **Output:** rekomendasi kanal per segmen, format konten, indikasi budget.
- **Target:** `Med`/`Low`.

### 4.9 Study Abroad Opportunity
- **Tujuan:** mempertajam riset study abroad dengan sinyal lokal.
- **RQ:** Berapa agen edukasi & kursus bahasa (IELTS/TOEFL) di Solo Raya? Sekolah internasional/berlabel? Permintaan per jenjang & negara tujuan? Kekhawatiran orang tua?
- **Sumber:** LPDP (sudah terverifikasi: Surakarta 21, Klaten 24, Semarang 50, Jateng 374), Google Maps (listing agen edukasi), pusat kursus bahasa, Pemkot (Beasiswa ASEAN Singapura), wawancara 3–5 agen edukasi lokal, sekolah menengah.
- **Metode:** desk + enumerasi + wawancara.
- **Output:** peta lanskap layanan, pembaruan SWOT, segmen prioritas.
- **Target:** `High` (LPDP), `Med` (lanskap).

### 4.10 Consumer Persona
- **Tujuan:** persona berbasis bukti Solo Raya untuk 9 segmen.
- **RQ:** Per segmen: media, spending, tempat, aktivitas, digital habits, motivasi, gatekeeper keputusan?
- **Sumber:** sintesis domain 4.2–4.9 + netnografi (grup Facebook/WhatsApp lokal) + wawancara informan (3–5 per segmen) + observasi venue.
- **Metode:** netnografi + wawancara semi-terstruktur + observasi.
- **Output:** 9 kartu persona + analisis cross-persona.
- **Target:** `Med`; naik ke `High` bila survei primer dilakukan.

## 5. Riset per Persona (9 Segmen)

| Segmen | Fokus riset | Lokasi riset | Metode |
|--------|-------------|--------------|--------|
| **Anak-anak (6–12)** | Aktivitas, hiburan, makanan, edukasi, screen time | SDN/SD swasta, taman kota, event anak | Wawancara orang tua, observasi, diskusi guru |
| **Remaja SMP (13–15)** | Media sosial, game, fashion, komunitas, nongkrong | SMP, komunitas olahraga remaja | Wawancara, netnografi TikTok/IG, observasi |
| **Siswa SMA laki-laki** | Tren, lifestyle, cita-cita, digital habit, belanja online | SMA negeri/swasta, komunitas game & olahraga | Wawancara, netnografi, observasi kantin/venue |
| **Siswa SMA perempuan** | Tren, fashion, beauty, cita-cita, belanja online | SMA, komunitas, venue kecantikan | Wawancara, netnografi, observasi |
| **Mahasiswa (laki-laki)** | Spending, nongkrong, teknologi, side hustle, AI usage | UNS (Kentingan/Jebres), UMS (Gonilan/Pabelan), kosan | Wawancara, observasi venue, netnografi kampus |
| **Mahasiswi** | Spending, kuliner, beauty, nongkrong, side hustle, AI | Kampus, kosan, venue kecantikan | Wawancara, observasi, netnografi |
| **Bapak-bapak** | Bisnis, otomotif, olahraga, komunitas, keputusan keluarga | Pasar, klub motor/mobil, komunitas futsal | Wawancara, observasi, komunitas |
| **Ibu-ibu** | Kuliner, parenting, UMKM, fashion, beauty, media sosial | PKK, arisan, pasar, grup WhatsApp | Wawancara, netnografi grup, observasi |
| **Lansia** | Aktivitas, kesehatan, komunitas, adopsi digital | Posyandu lansia, pengajian, senam | Wawancara, observasi |

## 6. Master Sumber

**Resmi (Solo Raya):**
- BPS: 7 BPS kabupaten/kota + BPS Provinsi Jateng (PDRB, SUSENAS, inflasi, proyeksi penduduk, "Dalam Angka")
- Dukcapil per daerah; Satu Data Klaten; PPID & Bappeda masing-masing daerah; LKPJ Wali Kota/Bupati
- Diskominfo Jateng & kabupaten (SPBE, penetrasi, program digital)
- Dinas Koperasi/UMKM, Perindag, DPMPTSP (perizinan), Dinas Pendidikan
- PDDIKTI (mahasiswa aktif), Dapodik (siswa per jenjang), SNPMB, Kemenag (madrasah)
- Bank Indonesia Jateng (KEKR, survei konsumen, KUR)
- LPDP (awardee per daerah)

**Media lokal:**
- Solopos.com, Espos.id (ekonomi/bisnis), Suara Merdeka Soloraya, Radar Solo, Jateng Pos

**Alat digital (estimasi):**
- Google Trends (geo), Meta Ads Library, TikTok Creative Center, SimilarWeb, Google Maps API (listing/review)

**Primer:**
- Wawancara informan (pelaku usaha, pengelola venue, agen edukasi, guru, pengurus komunitas)
- Netnografi (grup Facebook/WhatsApp lokal, geotag)
- Observasi venue dan pasar
- (Opsional) Survei terbatas 300–500 responden terstratifikasi per wilayah untuk spending, media, willingness-to-pay — syarat menaikkan confidence persona ke `High`

## 7. Workflow Eksekusi

1. Per domain: desk research → draft angka → cross-verify (2 sumber) → label confidence/coverage/last-updated → update komponen HTML → `npm run build`.
2. Catat setiap perubahan di Research Log (komponen, lama → baru, sumber, tanggal, confidence).
3. Gate review ke user setiap 2–3 domain.
4. Aturan: bila data tidak ditemukan → tulis insight kualitatif berlabel, jangan mengarang.

## 8. Timeline

| Fase | Isi | Output |
|------|-----|--------|
| Minggu 1 | Demografi, Education, Business Opportunity | Data resmi 3 domain, refresh KPI & tabel |
| Minggu 2 | Digital Behaviour, Consumer Behaviour, Lifestyle, Hangout Culture | Peta platform, pengeluaran, venue, event |
| Minggu 3 | Marketing Trend, Study Abroad, Persona (netnografi + wawancara) | Lanskap pemasaran, study abroad, 9 persona |
| Minggu 4 (opsional) | Survei primer terbatas + finalisasi label | Konfirmasi persona, confidence naik |

## 9. Antrian Eksekusi (10 Langkah Pertama)

1. BPS — proyeksi penduduk 2025 per kabupaten/kota (7 rilis)
2. BPS — SUSENAS pengeluaran per kapita 2024/2025 per kabupaten
3. BPS — PDRB per sektor 2025 per kabupaten (7 rilis)
4. Dapodik — jumlah siswa per jenjang per kabupaten 2025
5. PDDIKTI — mahasiswa aktif per PT di Solo Raya 2025
6. Meta Ads Library — estimasi audiens iklan per platform area Solo Raya
7. Google Trends — topik kuliner/edukasi/fashion area Solo (12 bulan)
8. APJII 2025 — penetrasi internet Jawa Tengah
9. Google Maps — densitas venue per kategori per kabupaten
10. Media lokal — tren ekonomi & konsumen 2025–2026 (Espos/Solopos)

## 10. Definisi Selesai

- Setiap komponen memiliki `source-line` + confidence + coverage + last-updated.
- Tidak ada angka nasional sebagai data utama tanpa label "proksi nasional".
- Semua 9 persona punya basis data Solo Raya (wawancara/netnografi minimal).
- `npm run build` sukses tanpa error.
