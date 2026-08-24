# 🪑 Ronica — Premium Outdoor Furniture E-Commerce

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-12.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel 12" />
  <img src="https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Inertia.js-2.x-9553E9?style=for-the-badge&logo=inertia&logoColor=white" alt="Inertia.js" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/License-MIT-green.style=for-the-badge" alt="License MIT" />
</p>

---

## 📌 Deskripsi Singkat

**Ronica Outdoor Furniture** adalah platform e-commerce modern full-stack yang dirancang khusus untuk memamerkan dan menjual koleksi furnitur outdoor berkualitas tinggi. Aplikasi ini mengintegrasikan performa backend **Laravel 12** yang tangguh dengan antarmuka dinamis **React 19 + TypeScript** via **Inertia.js**, memberikan pengalaman berbelanja tanpa hambatan (*SPA feel*) serta kontrol admin yang komprehensif.

---

## ✨ Fitur Utama

### 🛍️ Storefront (Pengalaman Pelanggan)
* **Katalog & Navigasi**: Katalog interaktif dengan filter dinamis (kategori, kisaran harga, nama, pengurutan).
* **Manajemen Keranjang & Checkout**: Sistem keranjang belanja fleksibel (Guest & Authenticated) dengan kalkulasi otomatis.
* **Informasi & Artikel Toko**: Halaman *About Us*, *Contact Us*, *Dealer Form*, serta modul blog *Artikel & Berita* lengkap dengan pencarian.
* **Whishlist & Pembanding Produk**: Simpan produk favorit dan bandingkan spesifikasi secara berdampingan.
* **Ulasan & Rating**: Fitur evaluasi serta umpan balik transparan dari pembeli.
* **SEO & Responsif**: Terintegrasi `SEOHead`, *structured data breadcrumb*, dan desain *mobile-first* yang anggun.

### ⚙️ Admin Management Panel
* **Dashboard Statistik**: Overview penjualan, aktivitas toko, dan analitik ringkas.
* **Manajemen Produk & Kategori**: CRUD produk lengkap dengan *image cropper*, penanganan varian, spesifikasi, dan status publikasi.
* **Pengaturan Toko Dinamis (Site Settings)**:
  - **Footer Settings**: Pengaturan tautan dinamis kolom 1 & 2, deskripsi toko, copyright, visibilitas kontak, dan sosmed.
  - **Homepage & About Settings**: Pengaturan slider hero banner, video carousel, milestone perusahaan, dan nilai utama.
  - **AI & Payment Settings**: Integrasi AI assistant dan gateway pembayaran.
* **Floating Action Bar**: Bar aksi melayang (*fixed/sticky*) yang konsisten di semua halaman form admin dengan tema warna kayu hangat Ronica (`#a67c52`).
* **Manajemen Artikel & Promo Banner**: Kelola berita toko, panduan furnitur, dan banner promosi pop-up/header.

---

## 🛠️ Stack Teknologi

| Kategori | Teknologi | Deskripsi |
|---|---|---|
| **Backend** | [Laravel 12](https://laravel.com) | Framework PHP modern untuk API, routing, dan ORM |
| **Frontend** | [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org) | UI library modular dengan strict typechecking |
| **Monolith Adapter** | [Inertia.js 2.0](https://inertiajs.com) | Menghubungkan Laravel & React tanpa butuh REST API terpisah |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com) + Lucide Icons | Utility-first CSS & paket ikon modern |
| **Database** | MySQL 8.0+ / MariaDB | Relational Database Management System |
| **Image Engine** | Spatie MediaLibrary | Pengolahan media & transformasi gambar otomatis |
| **Testing** | [Pest PHP](https://pestphp.com) | Elegant Testing Framework |

---

## 🚀 Panduan Instalasi Cepat

### 1. Prasyarat Sistem
* **PHP** `^8.2`
* **Composer** `^2.x`
* **Node.js** `^18.x` / `^20.x` / `^24.x`
* **MySQL / MariaDB**

### 2. Langkah Instalasi

```bash
# 1. Clone repositori
git clone https://github.com/chanrombeng/ronicafurniture2026.git
cd ronica

# 2. Install dependency PHP & Node.js
composer install
npm install

# 3. Konfigurasi Environment
cp .env.example .env
php artisan key:generate

# 4. Migrasi & Seed Database
php artisan migrate --seed

# 5. Buat Storage Symlink
php artisan storage:link

# 6. Jalankan Server Pengembang (Concurrently)
composer dev
```
### 3. Account

| Role | Email | Password |
|---|---|---|
| Admin | [EMAIL_ADDRESS] | password |
| Manager | [EMAIL_ADDRESS] | password |
| Staff | [EMAIL_ADDRESS] | password |
| Customer | [EMAIL_ADDRESS] | password |

> **Catatan**: Perintah `composer dev` akan menjalankan `php artisan serve`, `queue:listen`, dan Vite dev server secara bersamaan.

---

## 📁 Struktur Direktori Utama

```text
ronica/
├── app/
│   ├── Http/
│   │   ├── Controllers/Admin/   # Controller Panel Admin (Products, Settings, Footer, dll)
│   │   ├── Controllers/Shop/    # Controller Storefront (Catalog, Cart, Articles, dll)
│   │   └── Middleware/          # HandleInertiaRequests (Shared siteSettings)
│   └── Models/                  # Eloquent Models (Product, Category, Setting, Article)
├── database/
│   ├── migrations/              # Skema tabel database
│   └── seeders/                 # Seeder data awal & sampel produk
├── resources/
│   └── js/
│       ├── components/          # Komponen UI Reusable (Footer, Header, Dialog, SEO)
│       ├── layouts/             # ShopLayout & AdminLayout
│       └── pages/
│           ├── Admin/           # Halaman Admin React (Settings, Products, Profile, dll)
│           └── Shop/            # Halaman Public Storefront (Home, Contact, Dealer, dll)
└── routes/
    ├── web.php                  # Storefront Routes
    └── admin.php                # Admin Panel Routes
```

---

## ⚡ Perintah CLI Penting

```bash
# Menjalankan Dev Server lengkap
composer dev

# Menjalankan pengecekan TypeScript
npm run types

# Menjalankan pengujian otomatis (Pest)
php artisan test

# Build aset produksi
npm run build
```

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah **[MIT License](LICENSE)**.

---

<p align="center">
  Crafted with ❤️ by <b>Ronica Team</b>
</p>
