# BacaYukz 📚✨

[![Laravel](https://img.shields.io/badge/Laravel_11-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Bootstrap](https://img.shields.io/badge/Bootstrap_5-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com)

BacaYukz adalah platform bercerita sosial digital (*social storytelling*) berbasis web yang dirancang khusus untuk menghubungkan penulis independen dan pembaca di Indonesia. Terinspirasi oleh konsep Wattpad dan Medium, BacaYukz memungkinkan penulis mempublikasikan karya mereka bab-demi-bab secara gratis, sementara pembaca dapat menikmati, menyukai, mengomentari, dan mendukung penulis favorit mereka secara langsung.

---

## ✨ Fitur Utama

- **Dashboard Penulis**: Ruang kerja bagi penulis untuk membuat buku baru, mengelola naskah, mengatur bab-bab cerita, serta melacak total pembaca secara teratur.
- **Manajemen Draf & Publikasi**: Penulis dapat menyimpan naskah sebagai draf (*draft*) atau langsung menerbitkannya secara publik yang otomatis mengirimkan notifikasi ke pengikut/pembaca.
- **Direct Author Support Widget (Unique Selling Point)**: Pembaca dapat langsung mengapresiasi karya penulis di akhir bab cerita melalui integrasi tautan saweria (mikro-donasi lokal), Instagram, atau Twitter penulis.
- **Fitur Sosial & Interaktif**:
  - Kolom komentar interaktif menggunakan Disqus di setiap halaman buku dan bab.
  - Fitur Suka (*likes*) untuk menambahkan buku ke daftar favorit.
  - Notifikasi interaktif untuk bab baru yang diterbitkan.
- **Mode Gelap/Terang (Theme Toggler)**: Pengaturan tema tampilan gelap (*dark mode*) atau terang (*light mode*) yang disinkronkan secara otomatis.
- **Desain Responsif & Premium**: Tampilan visual modern, bersih, dan estetik yang dioptimalkan baik untuk perangkat mobile maupun desktop.

---

## 🛠️ Spesifikasi Teknologi

- **Backend**: Laravel
- **Frontend**: React (dengan TypeScript) + Inertia.js
- **Styling**: Bootstrap 5 (via CDN untuk antarmuka dasar) & Tailwind CSS
- **Rich Text Editor**: CKEditor 5 (Modern WYSIWYG editor)
- **Komponen Tambahan**: Disqus Comments, SweetAlert2, Notyf

---

## 🚀 Langkah Instalasi & Menjalankan Proyek

### 1. Prasyarat
Pastikan komputer Anda sudah terinstal:
- PHP >= 8.3
- Composer
- Node.js & NPM

### 2. Kloning & Masuk ke Direktori Proyek
```bash
git clone https://github.com/username/BacaYukz.git
cd BacaYukz
```

### 3. Jalankan Script Setup Otomatis
Proyek ini menyediakan perintah setup praktis untuk mempersiapkan seluruh kebutuhan instalasi:
```bash
composer run setup
```
Perintah di atas akan secara otomatis melakukan:
1. Instalasi dependensi PHP (`composer install`).
2. Membuat file konfigurasi `.env` dari `.env.example`.
3. Menghasilkan Application Key (`php artisan key:generate`).
4. Menjalankan migrasi database (`php artisan migrate --force`).
5. Instalasi dependensi JavaScript (`npm install`).
6. Membuat aset produksi awal (`npm run build`).

### 4. Konfigurasi Database (Opsional)
Jika Anda ingin menggunakan database MySQL atau lainnya, edit file `.env` yang baru dibuat:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=bacayukz
DB_USERNAME=root
DB_PASSWORD=
```
Setelah mengubah konfigurasi, jalankan ulang migrasi:
```bash
php artisan migrate:fresh --seed
```

### 5. Jalankan Server Pengembangan
Untuk menjalankan server pengembangan lokal (Laravel Serve & Vite Asset Bundler) secara bersamaan:
```bash
composer run dev
```
Setelah berjalan, akses aplikasi melalui browser pada alamat:
- **Web App**: [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

## 🔑 Akun Uji Coba Default

Untuk menjelajahi Dashboard Penulis dan fitur-fitur interaktif di dalam platform BacaYukz, Anda dapat masuk langsung menggunakan salah satu dari akun uji coba hasil *seeding* berikut:

- **Alamat Email**: `user1@gmail.com` (atau `user2@gmail.com`, `user3@gmail.com`, `user4@gmail.com`, `user5@gmail.com`)
- **Kata Sandi**: `password`

