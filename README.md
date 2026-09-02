# 🪑 Ronica — Premium Outdoor Furniture E-Commerce

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-12.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel 12" />
  <img src="https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Inertia.js-2.x-9553E9?style=for-the-badge&logo=inertia&logoColor=white" alt="Inertia.js" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/Vite-7.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 7" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License MIT" />
</p>

---

## 📌 Deskripsi Singkat

**Ronica Outdoor Furniture** adalah platform e-commerce modern full-stack yang dirancang khusus untuk memamerkan dan menjual koleksi furnitur outdoor berkualitas premium (kayu jati Perhutani Blora & anyaman rotan sintetis pilihan).

Aplikasi ini menggabungkan performa backend **Laravel 12** yang tangguh dengan antarmuka dinamis **React 19 + TypeScript** via **Inertia.js 2.0**, menghasilkan pengalaman pengguna layaknya *Single Page Application (SPA)* tanpa kerumitan membangun REST API terpisah.

---

## ✨ Fitur Utama

### 🛍️ Storefront (Pengalaman Pelanggan)
* **Katalog & Filter Interaktif**: Navigasi produk responsif dengan filter dinamis (kategori, harga, pengurutan, pencarian instan).
* **Multi-bahasa & Mata Uang**: Dukungan bahasa (ID / EN) serta format harga yang rapi.
* **Keranjang Belanja & Checkout**: Keranjang belanja interaktif dengan kalkulasi instan.
* **Footer Toko Dinamis**:
  - Menampilkan daftar media sosial yang dipilih dan diatur secara dinamis dari panel admin.
  - Tautan navigasi kolom kustom, informasi pabrik (*Factory*), ruang pamer (*Showroom*), kontak, dan hak cipta.
* **Informasi & Artikel Toko**: Halaman *About Us*, *Craftsmanship*, *Contact Us*, formulir kemitraan *Dealer Inquiries*, serta artikel & blog inspirasi outdoor.
* **SEO & Performa Tinggi**: Terintegrasi `SEOHead`, meta tags dinamis, serta *Structured Data (JSON-LD Organization)* untuk optimasi mesin pencari Google.

### ⚙️ Admin Management Panel
* **Dashboard & Analitik**: Ringkasan performa penjualan, pesanan, statistik pelanggan, dan produk terlaris.
* **Manajemen Produk & Kategori**: CRUD produk lengkap dengan varian, galeri foto, spesifikasi teknis, dan integrasi Google Gemini AI Vision untuk auto-fill data.
* **Pengaturan Toko Fleksibel (Site Settings)**:
  - **Adjustable Social Media**: Pengaturan media sosial dinamis—pilih platform dari preset (Instagram, Facebook, TikTok, LinkedIn, YouTube, WhatsApp, X/Twitter, Pinterest, Threads, Telegram, Custom), atur urutan (reorder), tes tautan langsung, dan tambah/hapus akun sesuka hati.
  - **E-Catalog Management**: Upload dan kelola berkas katalog resmi produk dalam format **PDF (.pdf)** maupun **Word (.docx, .doc)**.
  - **Footer Settings**: Atur judul kolom, daftar tautan kustom, visibilitas alamat pabrik, showroom, WhatsApp, dan email.
  - **Homepage & Hero Settings**: Banner video/gambar hero, carousel, brand values, craftsmanship stories, dan visibilitas section.
* **Floating Action Bar**: Bar aksi melayang (*sticky footer*) yang konsisten dengan palet warna Ronica (`#a67c52`).
* **Manajemen Artikel & Berita**: Editor konten lengkap dengan preview dan tagging.

---

## 🛠️ Stack Teknologi

| Kategori | Teknologi | Deskripsi |
|---|---|---|
| **Backend** | [Laravel 12](https://laravel.com) | Framework PHP modern untuk routing, controller, service layer, dan ORM Eloquent |
| **Frontend** | [React 19](https://react.dev) + [TypeScript 5](https://www.typescriptlang.org) | UI library modern dan modular dengan strict typechecking |
| **Monolith Adapter** | [Inertia.js 2.0](https://inertiajs.com) | Menghubungkan Laravel & React secara reaktif tanpa REST API manual |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com) + Lucide Icons | Mesin CSS generasi terbaru (@tailwindcss/vite) dan pustaka ikon vektor |
| **Build Tool** | [Vite 7](https://vitejs.dev) | Hot Module Replacement (HMR) dan bundler ultra cepat |
| **Database** | MySQL 8.0+ / MariaDB | Relational Database untuk data toko, session, cache, dan queue |
| **Media Engine** | Spatie MediaLibrary | Penanganan berkas gambar produk dan media |
| **AI Integration** | Google Gemini AI | Vision auto-fill untuk ekstraksi atribut produk dari gambar |
| **Testing** | [Pest PHP 3](https://pestphp.com) | Framework pengujian unit dan fitur yang elegan |

---

## 🚀 Panduan Instalasi & Menjalankan

### 1. Prasyarat Sistem
* **PHP** `^8.2` (ekstensi: pdo_mysql, mbstring, gd/imagick, curl)
* **Composer** `^2.x`
* **Node.js** `^18.x`, `^20.x`, atau `^24.x` & **npm**
* **MySQL** `^8.0` atau **MariaDB**

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

# 4. Sesuaikan konfigurasi database di .env:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=ronica_db
# DB_USERNAME=root
# DB_PASSWORD=

# 5. Jalankan Migrasi & Database Seeder
php artisan migrate --seed

# 6. Buat Storage Symlink untuk berkas publik
php artisan storage:link

# 7. Jalankan Server Pengembangan
composer dev
```

> **Catatan**: Perintah `composer dev` menggunakan `concurrently` untuk sekaligus menjalankan:
> 1. `php artisan serve` (Backend Laravel di `http://127.0.0.1:8000`)
> 2. `php artisan queue:listen --tries=1` (Worker antrean database)
> 3. `npm run dev` (Vite dev server di `http://127.0.0.1:5173`)

---

### 3. Akun Pengguna Bawaan (Seeder)

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@example.com` | `password` |
| **Manager** | `manager@example.com` | `password` |
| **Staff** | `staff@example.com` | `password` |
| **Customer** | `customer@example.com` | `password` |

---

## 📁 Struktur Direktori Utama

```text
ronica/
├── app/
│   ├── Http/
│   │   ├── Controllers/Admin/     # Controller Panel Admin (Settings, Products, Footer, dll)
│   │   ├── Controllers/Shop/      # Controller Storefront (Catalog, Cart, Articles, Checkout, dll)
│   │   └── Middleware/            # HandleInertiaRequests (Shared siteSettings & auth props)
│   ├── Models/                    # Eloquent Models (Product, Category, Setting, Article, dll)
│   └── Services/                  # Service Layer (ImageService, ProductQuery, dll)
├── config/                        # Konfigurasi aplikasi Laravel
├── database/
│   ├── migrations/                # Skema tabel database (MySQL)
│   └── seeders/                   # Data master awal & sampel produk
├── lang/
│   ├── en.json / en/              # Terjemahan Bahasa Inggris
│   └── id.json / id/              # Terjemahan Bahasa Indonesia
├── resources/
│   └── js/
│       ├── components/            # Komponen UI Reusable (Footer, Navbar, Modals, SEO)
│       ├── layouts/               # ShopLayout & AdminLayout
│       ├── pages/
│       │   ├── Admin/             # Halaman React Admin (Settings, Products, Profile, dll)
│       │   └── Shop/              # Halaman React Storefront (Home, Catalog, Contact, dll)
│       └── types/                 # Definisi tipe data TypeScript (SiteSettings, SocialLinkItem, dll)
└── routes/
    ├── web.php                    # Rute publik storefront
    ├── admin.php                  # Rute panel administrasi
    └── api.php                    # Rute API internal
```

---

## ⚡ Perintah CLI Penting

```bash
# Menjalankan Dev Server lengkap (Laravel + Queue + Vite)
composer dev

# Menjalankan pengecekan TypeScript (Typechecking)
npm run types

# Menjalankan linter kode
npm run lint

# Menjalankan formatting Prettier
npm run format

# Menjalankan pengujian otomatis (Pest)
php artisan test

# Membersihkan cache konfigurasi & view
php artisan config:clear
php artisan cache:clear

# Kompilasi aset untuk produksi
npm run build
```

---

## 📄 Lisensi

Proyek ini dirilis di bawah lisensi **[MIT License](LICENSE)**.

---

<p align="center">
  Crafted with ❤️ by <b>Ronica Team</b>
</p>
