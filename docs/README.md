# SIBANTU — Portal Informasi Bantuan Sosial Terpadu

Situs statis 12 halaman untuk Dinas Sosial Provinsi Sulawesi Barat. Tanpa database dan tanpa build step: HTML + Bootstrap 5 (CDN) + satu file JSON.

Redesign mengikuti identitas logo resmi: royal blue, navy, ivory, aksen merah & gold.

## Struktur

```
web/
├── index.html            Beranda: hero, 4 nilai, pengenalan, program, alur, berita, sosialisasi, galeri, transparansi, kontak
├── profil.html           Latar, peran 5 pihak, prinsip, logo resmi
├── persyaratan.html      Dokumen wajib, kriteria, kondisi di luar kriteria, FAQ
├── alur.html             8 langkah + bagan resmi 5 tahap + jadwal + kendala
├── program.html          3 program bantuan + mekanisme pendaftaran
├── sosialisasi.html      Materi sosialisasi + nilai + edukasi anti-pungli
├── pengumuman.html       Daftar pengumuman resmi
├── berita.html           Daftar berita (dari JSON)
├── berita-detail.html    Detail berita dibaca dari ?id= (tanpa halaman per artikel)
├── galeri.html           Galeri dokumentasi
├── transparansi.html     Metrik penyaluran + tabel dokumen legalitas
├── kontak.html           Helpdesk provinsi & kabupaten, peta, FAQ
├── data/informasi.json   SATU-SATUNYA tempat mengubah isi
├── css/sibantu.css       Design system (token, komponen)
├── js/sibantu.js         Render JSON, pencarian, menu, dropdown, reveal
├── aset/                 logo-sibantu.webp, logo-pemda.webp, maskot-sibantu.svg, alur-penetapan.webp
└── robots.txt, sitemap.xml
```

## Token desain (`css/sibantu.css`)

| Token | Nilai | Pemakaian |
|---|---|---|
| `--blue` | `#155B91` | Tombol utama, tautan, menu |
| `--navy` | `#102F55` | Judul, band, footer |
| `--sky` | `#397FAE` | Aksen, garis, progres |
| `--ivory` | `#F5F5F0` | Latar halaman |
| `--red` | `#B52F3D` | Peringatan (hemat) |
| `--gold` / `--gold-ink` | `#D9A441` / `#7A5610` | Garis & aksen / teks kecil di putih |
| Tipografi | Plus Jakarta Sans (judul) + Inter (isi) | |

Mengganti palet = ubah blok `:root` saja.

## Menjalankan lokal

```bash
cd web
python3 -m http.server 8099
# buka http://localhost:8099
```

`fetch` JSON gagal di `file://`, jadi pratinjau wajib lewat server. Deploy: unggah seluruh isi `docs/` ke Netlify / Vercel / GitHub Pages / cPanel.

## Mengubah isi

Semua angka, jadwal, berita, galeri, dan kontak ada di `data/informasi.json`.

| Objek | Tampil di |
|---|---|
| `meta.diperbarui` | Beranda, Pengumuman |
| `meta.draf: true` | Spanduk "data contoh" di semua halaman |
| `periode` | Kartu status beranda, alur, transparansi |
| `nilai[]`, `nilaiIntro` | Empat nilai resmi pada logo (beranda, sosialisasi, profil) |
| `standar` | Lima prinsip pelayanan di halaman Profil |
| `programBantuan[]` | Beranda (3 kartu), halaman Program |
| `berita[]` | Beranda (3 teratas), halaman Berita, detail `?id=` |
| `sosialisasi[]` | Halaman Sosialisasi |
| `galeri[]` | Beranda + halaman Galeri |
| `pengumuman[]` | Ticker + daftar pengumuman |
| `jadwal[]` | Tabel jadwal di halaman Alur |
| `transparansi.dokumen[]` | Tabel dokumen di halaman Transparansi |
| `kontak`, `kabupaten[]` | Footer, halaman Kontak |

Tanggal `YYYY-MM-DD`; angka diformat `id-ID` otomatis.

### Menambah berita

1. Tambah objek di `berita` (`id`, `tanggal`, `kategori`, `judul`, `ringkas`, `isi[]`).
2. Opsional: letakkan foto di `aset/foto/nama.webp` lalu isi `foto: "aset/foto/nama.webp"`.
3. Berita otomatis masuk daftar, beranda, pencarian, dan sitemap-silang. Detail dibuka via `berita-detail.html?id=<id>`.

### Foto & maskot

- **Foto kegiatan sudah tersedia** (15 foto + 1 video) di `aset/galeri/`. Field `foto`/`video` pada JSON sudah terisi; kotak placeholder hanya tampil bila kosong.
- **Logo** `aset/logo-sibantu.webp` dipakai di navbar, panel hero (di atas kartu status), footer, favicon, dan halaman Profil. `aset/logo-pemda.webp` tampil di topbar, footer, dan Profil.
- **Maskot** `aset/maskot-sibantu.svg` adalah ilustrasi sementara buatan sendiri, hanya dipakai di bagian sosialisasi dan edukasi. Ganti dengan berkas maskot resmi bila sudah ada.

## Dokumen pengajuan (halaman Persyaratan)

Tiga kelengkapan yang diserahkan warga ke desa/kelurahan, lalu diunggah Operator SIBANTU:

1. Fotokopi atau asli KTP dan KK.
2. Pakta Integritas sesuai form yang disediakan desa/kelurahan.
3. Tangkapan layar Desil dari pengecekan resmi: `cekbansos.kemensos.go.id`, aplikasi Cek Bansos (Play Store), atau SIKS-NG di desa/kelurahan.

Dokumen saat pencairan (KTP asli, KK, surat undangan, surat kuasa) tetap dicantumkan terpisah agar tidak tertukar dengan dokumen pengajuan.

## Dokumen pengajuan (halaman Persyaratan)

Tiga kelengkapan yang diserahkan warga ke desa/kelurahan, lalu diunggah Operator SIBANTU:

1. Fotokopi atau asli KTP dan KK.
2. Pakta Integritas sesuai form yang disediakan desa/kelurahan (contoh format: `aset/form/pakta-integritas.docx`).
3. Tangkapan layar Desil dari pengecekan resmi: `cekbansos.kemensos.go.id`, aplikasi Cek Bansos (Play Store), atau SIKS-NG di desa/kelurahan.

Pencairan bantuan murni Rp 0 — termasuk pembukaan rekening dan seluruh administrasi. Pernyataan ini ditegaskan di Persyaratan, Alur, Pengumuman, Sosialisasi, Berita, dan Kontak.

## Data resmi yang sudah dipakai (tahun anggaran 2026)

- Tahap I: 1.266 KPM · Tahap II: 985 KPM (total 2.251 KPM).
- Asumsi nilai bantuan Rp 2.000.000 per KPM (total Rp 4.502.000.000).
- Lokus: 285 desa/kelurahan di 6 kabupaten.
- Status penyaluran: masih berproses di BPKAD.

Angka tersebut tercatat di `data/informasi.json` (`periode`, `jadwal`, `pengumuman`). Ubah bila ada pemutakhiran.

## Wajib diganti sebelum publikasi

1. `data/informasi.json` — angka, jadwal, nomor telepon (`XXXX`), email, alamat.
2. `meta.draf` → `false`.
3. `sitemap.xml`, `robots.txt` — domain final.
4. Foto kegiatan di `aset/foto/` + isi kolom `foto`.
5. Maskot resmi (bila tersedia) untuk menggantikan `aset/maskot-sibantu.svg`.

## Keputusan desain yang disengaja

- **Editorial, bukan dashboard.** Tanpa sidebar admin, tanpa tabel data warga. Beranda memakai hero + strip nilai + rail alur + kartu berita, bukan grid fitur setara.
- **Tanpa data pribadi.** Nama/NIK/alamat tidak pernah tampil; dinyatakan di Profil dan Transparansi.
- **Tanpa formulir.** Hosting statis tidak menyimpan kiriman; kanal resmi telepon/WhatsApp/email.
- **Pencarian sisi klien** atas indeks halaman + berita + program (tombol kaca pembesar, pintasan `/`).
- **Satu detail berita** (`berita-detail.html?id=`) alih-alih satu berkas per artikel.
- **Data contoh ditandai** spanduk kuning selama `meta.draf: true`.
- **Tanpa gradient dekoratif**, radius 6–32 px proporsional, shadow halus, animasi 120–550 ms, `prefers-reduced-motion` dihormati.

## Verifikasi yang sudah dijalankan

- 12 halaman + aset: HTTP 200; `periksa-situs-statis.py`: 12/12 OK (lang, satu h1, tanpa ID duplikat, alt, heading, tautan internal).
- Chromium headless 360 / 768 / 1024 / 1440 px: tidak ada overflow horizontal, tidak ada error konsol, tidak ada gambar gagal muat.
- Render JSON: 4 nilai, 3 program, 5 berita, 6 galeri, 3 jadwal, 5 dokumen, 4 pengumuman; status 78% dan kartu status terisi.
- Detail berita `?id=pencairan-tahap-3`: judul, meta, dan isi berganti sesuai id.
- Pencarian: kata "jadwal" → 1 hasil; Escape menutup; fokus otomatis ke input.
- Dropdown Informasi (5 item), menu mobile (`aria-expanded` berubah), tombol kembali ke atas.
- Kontras terverifikasi: `#155B91` 6.54:1, `#102F55` 12.31:1, `#55636F` 5.65:1, putih di `#155B91` 7.15:1, `#7A5610` 6.63:1, `#B52F3D` 6.11:1.
- Bobot kritis (gzip): HTML 5,7 KB + CSS 7,1 KB + JS 4,9 KB + JSON 3,8 KB ≈ 21,5 KB, di luar Bootstrap/Font CDN.
- **Belum diverifikasi:** tampilan visual sesungguhnya (tidak ada pembacaan gambar) — hanya metrik DOM, kontras, dan ukuran terukur.

## Kredit

Struktur visual awal diadaptasi dari tema Nexora (MIT, Harshad Mahadik / ThemeWagon). Warna, tipografi, komposisi, dan CSS ditulis ulang untuk SIBANTU.
