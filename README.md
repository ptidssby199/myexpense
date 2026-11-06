# MyExpense (MVP offline)

## Menjalankan di komputer
1. Install Node.js 20 atau lebih baru.
2. Ekstrak folder proyek.
3. Jalankan `npm install`.
4. Jalankan `npm run dev`.
5. Buka URL lokal yang ditampilkan Vite.

## Build
`npm run build`

## Catatan penting
- Database disimpan di IndexedDB browser dengan nama `MyExpenseDB`.
- Gunakan origin/domain yang sama secara konsisten. Data pada localhost, alamat IP, dan domain produksi merupakan penyimpanan terpisah.
- Backup otomatis membuat snapshot di IndexedDB setiap 5 menit ketika aplikasi aktif dan saat tab disembunyikan. Snapshot ini tetap berada pada perangkat/browser yang sama dan bukan cadangan eksternal.
- Backup manual mengunduh file JSON. Simpan file tersebut di tempat aman di luar perangkat.
- Restore mengganti data lokal yang ada.
- MVP ini belum menerapkan PIN per profil, edit/hapus transaksi, laporan periode lengkap, atau analisis interval full-tank lanjutan. Modul BBM dan listrik perlu dilengkapi sebelum digunakan sebagai pencatat akuntansi final.
- Untuk PWA offline penuh, lakukan build dan deploy ke HTTPS terlebih dahulu; service worker meng-cache halaman dan aset yang diminta.
