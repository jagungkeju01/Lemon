# Atlas Bumi — Website edukasi visual

Project statis HTML, CSS, dan JavaScript untuk dipublikasikan melalui GitHub Pages.

## Konsep baru
Versi ini beralih dari dashboard data real-time yang rentan gagal menjadi jurnal visual / ensiklopedia mini tentang sistem Bumi. Konten referensi diberi label yang jelas; tidak ada angka cuaca atau gempa palsu yang ditampilkan seolah-olah real-time.

## Fitur
- Beranda visual dengan foto Bumi lokal.
- Jelajah Bumi: atmosfer, lautan, hutan, dan geologi.
- Arsip alam dengan filter topik dan pencarian lokal.
- Jam digital delapan kota/zona waktu, tanpa API.
- Timer hitung mundur dengan mulai, jeda, lanjut, reset, dan mode angka tersembunyi.
- Stopwatch dengan catatan putaran.
- Penghitung durasi kunjungan menggunakan `sessionStorage`.
- Tautan ke Earth Nullschool, NASA FIRMS, BMKG, NASA Earth, dan NOAA Ocean Service.
- Navigasi responsif untuk ponsel dan desktop.

## Struktur
```text
Atlas-Bumi/
├── index.html
├── jelajah.html
├── arsip.html
├── waktu.html
├── sumber-data.html
├── style.css
├── assets/
│   └── earth-hero.webp
└── js/
    ├── app.js
    ├── arsip.js
    └── waktu.js
```

## Menjalankan
1. Ekstrak ZIP.
2. Untuk uji lokal, buka folder di VS Code dan gunakan Live Server, atau buka `index.html` langsung di browser.
3. Untuk GitHub Pages, unggah **isi folder** ke root repository. Pastikan `index.html`, `style.css`, `assets/`, dan `js/` berada sejajar pada tingkat root.
4. Di GitHub: Settings → Pages → pilih branch dan `/(root)`.

## Catatan
- Jam digital menggunakan zona waktu browser via `Intl.DateTimeFormat`; tidak memerlukan koneksi internet.
- Timer dan stopwatch berjalan di sisi klien. Jika tab/perangkat ditutup atau browser menghentikan JavaScript, pembaruan layar berhenti.
- Konten pengetahuan adalah materi pengantar, bukan pembaruan kondisi langsung atau peringatan darurat. Untuk informasi terkini, periksa sumber resmi.
- Tautan eksternal memerlukan internet.
