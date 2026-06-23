# Dokumentasi Proyek BacaYukz 📖⚙️

Dokumen ini menyediakan penjelasan mendalam tentang arsitektur sistem, struktur database, logika navigasi, serta detail implementasi fitur-fitur utama di aplikasi BacaYukz.

---

## 1. Arsitektur Aplikasi

BacaYukz dibangun menggunakan pola arsitektur **Monolith Modern** dengan stack berikut:
- **Backend (Laravel)**: Menangani perutean (*routing*), otentikasi, validasi data, interaksi database, dan otorisasi.
- **Frontend (React + TypeScript)**: Bertindak sebagai layer presentasi SPA (Single Page Application) yang dinamis.
- **Inertia.js**: Bertindak sebagai jembatan (*adapter*) yang mengirimkan data dari Controller Laravel langsung ke komponen React sebagai *Props*, mengeliminasi kebutuhan pembuatan REST API terpisah.

---

## 2. Skema & Model Database

Sistem ini memiliki 6 entitas utama di database:

1. **User (`users`)**
   - Menampung informasi akun pengguna.
   - Kolom penting: `name`, `email`, `password`, `role` (`pembaca` atau `penulis`), `avatar`, `instagram`, `twitter`, `saweria`.
2. **Book (`books`)**
   - Menyimpan metadata dari cerita yang dibuat oleh penulis.
   - Kolom penting: `title`, `slug`, `cover`, `description`, `user_id` (pemilik/penulis).
3. **Chapter (`chapters`)**
   - Menyimpan isi bab cerita dari sebuah buku.
   - Kolom penting: `book_id`, `title`, `slug`, `content`, `view`, `is_draft` (status rilis).
4. **Genre (`genres`)**
   - Kategori genre buku (seperti Fantasi, Romantis, Komedi, dll).
   - Hubungan Many-to-Many dengan `books` melalui tabel *pivot* `book_genre`.
5. **Like (`likes` / Pivot)**
   - Menghubungkan pembaca dengan buku yang mereka sukai.
   - Tabel *pivot* Many-to-Many antara `users` dan `books`.
6. **Notification (`notifications`)**
   - Menyimpan riwayat notifikasi sistem untuk pembaca (misal, saat penulis mengunggah bab baru).
   - Kolom penting: `user_id`, `book_id`, `chapter_id`, `message`, `is_read`.

---

## 3. Logika Perutean & Kontroler (Routing & Controllers)

### Route Publik (Tanpa Login)
Dikelola oleh `HomeController.php`:
- `GET /` $\rightarrow$ Merender `Home/Index.tsx` (Daftar semua buku terbaru dan filter genre).
- `GET /book/{slug}` $\rightarrow$ Merender `Home/Book.tsx` (Halaman detail sinopsis buku, daftar bab rilis, dan komentar).
- `GET /book/{book_slug}/{chapter_slug}` $\rightarrow$ Merender `Home/Chapter.tsx` (Halaman pembacaan konten bab).
- `GET /author/{id}` $\rightarrow$ Merender `Home/Author.tsx` (Profil penulis dan karya-karya miliknya).

### Route Privat (Perlu Login)
Menggunakan middleware `auth`, dikelola oleh `BookController`, `ChapterController`, & `ProfileController`:
- `GET /dashboard` $\rightarrow$ Halaman utama penulis, menampilkan daftar ringkasan buku.
- `GET /dashboard/books/create` $\rightarrow$ Formulir pembuatan buku baru.
- `GET /dashboard/books/{id}/chapters` $\rightarrow$ Manajemen bab cerita dari satu buku tertentu.
- `GET /dashboard/profile` $\rightarrow$ Pengaturan edit foto profil, nama, serta tautan donasi/sosial media.

---

## 4. Penjelasan Implementasi Fitur Utama

### A. Widget Dukungan Penulis (*Author Support Card*)
- **Lokasi**: [Chapter.tsx](resources/js/pages/Home/Chapter.tsx)
- **Cara Kerja**: Ketika controller memuat halaman bab, ia memuat relasi `user` pemilik buku tersebut. Jika penulis menyetel informasi donasi (`saweria`) atau media sosial (`instagram`/`twitter`) di profilnya, sebuah widget khusus akan muncul di akhir teks bab cerita untuk memudahkan pembaca memberikan apresiasi finansial atau mengikuti penulis.

### B. Indikator Persentase Membaca (*Reading Progress Bar*)
- **Lokasi**: [Chapter.tsx](resources/js/pages/Home/Chapter.tsx)
- **Cara Kerja**: Aplikasi mendeteksi pergeseran koordinat gulir halaman (*scroll position*) menggunakan event listener JavaScript `window.addEventListener('scroll')` dan membagi jarak gulir dengan tinggi total dokumen yang bisa digulirkan. Nilai persentase ini diikat ke state `scrollPercent` yang memicu bar kemajuan setinggi `4px` berwarna oranye di bagian paling atas layar.

### C. Editor Teks Kaya (*CKEditor 5 WYSIWYG*)
- **Lokasi**: `resources/js/components/dashboard/CKEditorBab.tsx`
- **Cara Kerja**: Terintegrasi langsung dengan CKEditor Classic Build agar penulis dapat mengetik cerita dengan format kaya (seperti teks tebal, miring, daftar poin, draf tabel) yang disimpan dalam bentuk HTML murni ke kolom `content` di database.

### D. Notifikasi Real-time & Dropdown Notifikasi
- **Lokasi**: [Navbar.tsx](resources/js/components/home/Navbar.tsx)
- **Cara Kerja**: Memanfaatkan Inertia shared props untuk mendistribusikan daftar notifikasi pengguna yang login. Navbar menampilkan lencana merah berisi jumlah notifikasi belum dibaca (*unread count*). Pengguna dapat mengeklik untuk membuka dropdown, menandai semua sebagai dibaca, atau mengeklik salah satu notifikasi untuk dialihkan langsung ke halaman bab terbaru.

### E. Sinkronisasi Tema Tampilan (Light/Dark Mode)
- **Lokasi**: `resources/views/app.blade.php` & [Navbar.tsx](resources/js/components/home/Navbar.tsx)
- **Cara Kerja**: Tema disimpan di `localStorage` peramban. Saat halaman dimuat, skrip inline kecil di `head` HTML langsung menerapkan atribut `data-bs-theme="dark"` atau `"light"` sebelum React merender halaman untuk menghindari efek kedipan putih (*FOUC*). Gaya CSS kustom di `app.blade.php` menimpa gaya dasar Bootstrap ketika tema gelap diaktifkan.
