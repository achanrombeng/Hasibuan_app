# Hasibuan Design — Premium Furniture E-Commerce

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-12.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel 12" />
  <img src="https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Inertia.js-2.x-9553E9?style=for-the-badge&logo=inertia&logoColor=white" alt="Inertia.js" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/Vite-7.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 7" />
  <img src="https://img.shields.io/badge/Google_Gemini-AI_Vision-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google Gemini AI" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License MIT" />
</p>

---

## 📌 Deskripsi Singkat

**Hasibuan Design** adalah platform e-commerce monolitik modern full-stack yang dirancang khusus untuk memamerkan dan memasarkan koleksi furnitur outdoor arsitektural kelas dunia.

Aplikasi ini menggabungkan fondasi backend **Laravel 12** yang tangguh, modular, dan terstruktur dengan antarmuka dinamis **React 19 + TypeScript** melalui **Inertia.js 2.0 (SSR Ready)**. Desain visual mengusung estetika *Vitruvian Architectural Monochrome* dengan tipografi klasik modern (*Cormorant Garamond* & *Inter*), menghadirkan pengalaman pengguna layaknya *Single Page Application (SPA)* tanpa kerumitan memelihara REST API terpisah.

---

## ✨ Fitur Utama

### 🛍️ Storefront (Pengalaman Pelanggan)
* **Katalog & Filter Interaktif**: Navigasi produk responsif dengan filter dinamis hierarkis (kategori, rentang harga, ketersediaan stok, pengurutan, dan pencarian instan).
* **Halaman Produk Kaya Detail**: Galeri multi-gambar dengan penampil visual beresolusi tinggi, rincian dimensi teknis, varian finishing material, serta produk terkait (*related products*).
* **Halaman Promo Khusus**: Bagian khusus untuk *Hot Sale*, *Clearance*, dan *Stock Sale* dengan penanda diskon eksklusif.
* **Custom Order System**: Formulir kustomisasi furnitur terpadu untuk pesanan kustom (upload sketsa desain/foto referensi, spesifikasi ukuran kustom, dan pemilihan jenis material).
* **Perbandingan Produk (Compare Matrix)**: Fitur pembanding spesifikasi teknis, dimensi, dan material antar-produk secara berdampingan.
* **Wishlist & Multi-Alamat**: Simpan produk favorit yang otomatis disinkronkan ke akun pengguna, serta kelola banyak alamat pengiriman dengan penanda alamat utama (*default*).
* **Keranjang Belanja Cerdas (Guest Cart Merging)**: Mendukung belanja sebagai tamu (*guest*), yang secara otomatis digabungkan (*merged*) ke akun pengguna begitu masuk (*login*).
* **Interactive 3D E-Catalog (dFlip)**: Penampil katalog digital interaktif berbasis 3D Flipbook responsif dan tautan unduh berkas resmi (.pdf & .docx).
* **Multi-Bahasa (ID / EN) & Mata Uang**: Pengalihan bahasa instan (Bahasa Indonesia & English) untuk seluruh konten toko dan format mata uang lokal.
* **Ulasan & Rating Pelanggan**: Sistem pemberian ulasan bintang 1–5 dengan ulasan pembeli terverifikasi dan moderasi admin.
* **Artikel & Jurnal Craftsmanship**: Halaman blog, panduan perawatan furnitur outdoor, dan cerita dedikasi perajin lokal (*Handicraft Story*).
* **Portal Kemitraan (Dealer Inquiries)**: Formulir kemitraan B2B untuk arsitek, pengembang hotel, dan calon agen/distributor resmi.
* **Dynamic Footer Toko**: Daftar media sosial kustom yang dapat diurutkan secara fleksibel dari panel admin, informasi pabrik (*Factory*), ruang pamer (*Showroom*), dan tautan kebijakan.
* **SEO & Optimasi Performa**: Terintegrasi `SEOHead`, meta tag Open Graph dinamis, *Structured Data (JSON-LD Organization & Product)*, serta generator *Sitemap XML* otomatis (`/sitemap.xml`).

---

### ⚙️ Admin Management Panel
* **Dashboard & Analitik Penjualan**: Ringkasan performa pendapatan, total transaksi, tren pesanan terbaru, statistik pelanggan baru, dan inventaris produk terlaris.
* **Manajemen Produk & AI Vision**:
  * CRUD produk lengkap dengan status *Draft*, *Published*, dan *Archived*.
  * **Google Gemini AI Vision Integration**: Ekstraksi otomatis nama produk, deskripsi pemasaran, material, dan estimasi dimensi hanya dari foto produk.
  * **Pencocokan Gambar Massal (Bulk Image Matcher)**: Upload massal galeri gambar dengan pencocokan nama file produk otomatis.
  * **Impor Produk Excel / CSV**: Unduh template data produk dan impor data katalog dalam sekali klik.
* **Kategori Hierarkis**: Pengaturan kategori bertingkat (*parent & child*) dengan fitur *drag-and-drop reorder*.
* **Manajemen Pesanan & Status Pelacakan**: Kelola pemrosesan pesanan dari status *Pending*, *Processing*, *Shipped*, *Delivered*, hingga *Cancelled*.
* **Moderasi Review Produk**: Persetujuan (*approve*), penolakan (*reject*), atau penghapusan ulasan pelanggan sebelum tayang publik.
* **Manajemen Calon Dealer (B2B)**: Tindak lanjut data calon agen/distributor yang masuk melalui formulir storefront.
* **Pusat Notifikasi Real-time**: Indikator notifikasi transaksi baru, pesanan belum diproses, dan pesan kemitraan.
* **Laporan & Ekspor**: Ringkasan audit penjualan dan riwayat transaksi toko.
* **Architectural Site Settings Manager**:
  * **Homepage & Hero Builder**: Atur video/gambar banner hero, badge promo, teks highlight, brand values, craftsmanship narrative, dan visibilitas setiap seksi.
  * **Section Backgrounds & Texture Manager**: Personalisasi latar tekstur arsitektur (Slate stone, Dark Charcoal, Marble grain, Light Sand) lengkap dengan slider transparansi (*overlay opacity*).
  * **Dynamic Social Media Manager**: Tambah, urutkan (*reorder*), uji tautan, dan kelola 10+ preset media sosial (Instagram, Facebook, TikTok, LinkedIn, YouTube, WhatsApp, X, Pinterest, Threads, Telegram).
  * **E-Catalog File Manager**: Unggah dan perbarui berkas e-katalog resmi (.pdf / .docx) untuk katalog interaktif storefront.
  * **About Story & Workshop Gallery**: Editor teks cerita sejarah perajin (*Story Title, Subtitle, Paragraphs*) dan galeri visual workshop.
  * **Konfigurasi Google Gemini AI**: Kelola API Key, pilihan model (`gemini-2.5-flash`), dan parameter generasi.

---

## 🛠️ Stack Teknologi

| Lapisan | Teknologi | Peran & Deskripsi |
|---|---|---|
| **Backend Core** | [Laravel 12](https://laravel.com) | Framework PHP modern untuk routing, controller, action classes, dan Eloquent ORM |
| **Frontend UI** | [React 19](https://react.dev) + [TypeScript 5](https://www.typescriptlang.org) | Antarmuka komponen modular dengan React Compiler dan strict type safety |
| **Monolith Bridge** | [Inertia.js 2.0](https://inertiajs.com) | Arsitektur SPA modern berbasis Laravel tanpa perlu memisahkan backend REST API |
| **Styling & Icons** | [Tailwind CSS 4](https://tailwindcss.com) + [Lucide Icons](https://lucide.dev) | Mesin CSS generasi terbaru (`@tailwindcss/vite`) dan pustaka ikon vektor modern |
| **Build & Tooling** | [Vite 7](https://vitejs.dev) | Bundler berkas ultra cepat dengan HMR dan dukungan server SSR |
| **Routing Helper** | [Laravel Wayfinder](https://github.com/laravel/vite-plugin-wayfinder) | Type-safe route & action generation untuk TypeScript di sisi frontend |
| **AI Vision Engine** | [Google Gemini AI](https://ai.google.dev/) | Ekstraksi otomatis atribut dan deskripsi produk dari gambar menggunakan AI |
| **Media Handling** | Spatie MediaLibrary | Pengelolaan berkas gambar produk, galeri, dan aset statis |
| **Role & Permission** | Spatie Laravel Permission | Kontrol hak akses berbasis peran (Admin, Manager, Staff, Customer) |
| **Animation & UI** | Radix UI + Framer Motion | Komponen aksesibilitas (dialog, dropdown, popover) dan animasi halus |
| **Database** | MySQL 8.0+ / MariaDB | Penyimpanan relasional untuk data produk, transaksi, setting, dan antrean |
| **Testing** | [Pest PHP 3](https://pestphp.com) + Playwright | Framework pengujian unit/fitur PHP dan end-to-end browser testing |

---

## 🚀 Panduan Instalasi & Menjalankan

### 1. Prasyarat Sistem
* **PHP** `^8.2` atau lebih baru (ekstensi wajib: `pdo_mysql`, `mbstring`, `gd` / `imagick`, `curl`, `fileinfo`, `zip`)
* **Composer** `^2.x`
* **Node.js** `^20.x` atau `^22.x` & **npm**
* **MySQL** `^8.0` atau **MariaDB** `^10.6`

---

### 2. Langkah Instalasi

```bash
# 1. Clone repositori
git clone https://github.com/chanrombeng/ronicafurniture2026.git
cd ronica

# 2. Pasang dependensi backend & frontend
composer install
npm install

# 3. Siapkan file konfigurasi environment
cp .env.example .env
php artisan key:generate

# 4. Konfigurasi koneksi database di file .env:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=hasibuan_db
# DB_USERNAME=root
# DB_PASSWORD=

# (Opsional) Tambahkan Google Gemini API Key untuk fitur Vision AI:
# GEMINI_API_KEY=your_gemini_api_key_here
# GEMINI_MODEL=gemini-2.5-flash

# 5. Jalankan migrasi dan isi database dengan data awal
php artisan migrate --seed

# 6. Buat tautan symlink storage untuk berkas publik
php artisan storage:link

# 7. Jalankan server pengembangan
composer dev
```

> 💡 **Informasi `composer dev`**: Perintah ini secara bersamaan menjalankan:
> 1. Server Laravel (`php artisan serve` di `http://127.0.0.1:8000`)
> 2. Antrean latar belakang (`php artisan queue:listen --tries=1`)
> 3. Bundler Vite (`npm run dev` di `http://127.0.0.1:5173`)

---

### 3. Akun Pengguna Bawaan (Database Seeders)

Setelah menjalankan `php artisan migrate --seed`, akun berikut siap digunakan:

| Role | Email | Password | Hak Akses |
|---|---|---|---|
| **Super Admin / Admin** | `admin@example.com` | `password` | Akses penuh: manajemen produk, pesanan, pengguna, dan seluruh pengaturan sistem |
| **Manager** | `manager@example.com` | `password` | Akses operasional: katalog, stok, ulasan, pesanan, artikel, dan laporan |
| **Staff** | `staff@example.com` | `password` | Akses staf gudang: pembaruan status stok, pemrosesan pesanan, dan review |
| **Customer (Demo)** | `customer@example.com` | `password` | Akun pembeli: riwayat pesanan, profil, wishlist, dan multi-alamat |

---

## 📁 Struktur Direktori Utama

```text
ronica/
├── app/
│   ├── Actions/                   # Action Classes berprinsip SRP (Cart, Checkout, Order, Product)
│   ├── Enums/                     # Type-safe Enums (OrderStatus, PaymentMethod, ProductStatus)
│   ├── Helpers/                   # Helper utilitas global (format_rupiah, parse_rupiah)
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Admin/             # Controller panel admin (Products, Settings, Orders, AI, dll)
│   │   │   ├── Customer/          # Controller portal pelanggan (Dashboard)
│   │   │   └── Shop/              # Controller storefront publik (Catalog, Cart, Dealer, Articles)
│   │   ├── Middleware/            # HandleInertiaRequests, ShareCartData, Locale
│   │   └── Resources/             # Laravel API Resources (ProductResource, CategoryResource)
│   ├── Models/                    # Eloquent Models (Product, Category, Order, Setting, dll)
│   └── Services/                  # Service Layer (GeminiService, ImageService, ProductQuery)
├── config/                        # Konfigurasi aplikasi, layanan pihak ketiga, dan auth
├── database/
│   ├── migrations/                # Skema struktur tabel database
│   └── seeders/                   # Data master awal & data demo produk
├── lang/
│   ├── en.json / en/              # Terjemahan Bahasa Inggris
│   └── id.json / id/              # Terjemahan Bahasa Indonesia
├── resources/
│   ├── css/
│   │   └── app.css                # Desain sistem Tailwind CSS v4 & tema warna arsitektural
│   └── js/
│       ├── components/            # Komponen UI reusable (Navbar, Footer, SEOHead, Dialog, Table)
│       ├── layouts/               # ShopLayout, AdminLayout, AppLayout, AuthLayout
│       ├── pages/
│       │   ├── Admin/             # Tampilan panel admin (Dashboard, Products, Settings, Reports)
│       │   ├── Customer/          # Tampilan portal akun pembeli
│       │   └── Shop/              # Tampilan toko (Home, Catalog, Products, Cart, CustomOrder, Sale)
│       ├── types/                 # Definisi tipe TypeScript (Shop, Settings, Navigation, User)
│       └── wayfinder/             # Tipe rute dan aksi yang digenerate oleh Laravel Wayfinder
└── routes/
    ├── web.php                    # Rute utama, sitemap, dan alur autentikasi
    ├── shop.php                   # Rute publik etalase toko dan checkout
    ├── admin.php                  # Rute panel administrasi terproteksi
    └── settings.php               # Rute pengaturan akun profil pembeli/admin
```

---

## ⚡ Perintah CLI Penting

```bash
# Menjalankan server pengembangan lengkap (Laravel + Queue + Vite)
composer dev

# Menjalankan server dalam mode SSR (Server-Side Rendering)
composer dev:ssr

# Pengecekan tipe statis TypeScript
npm run types

# Pengecekan dan perbaikan gaya kode JavaScript/TypeScript (ESLint)
npm run lint

# Format otomatis berkas kode dengan Prettier
npm run format

# Format dan standar kode PHP dengan Laravel Pint
./vendor/bin/pint

# Analisis statis PHP dengan PHPStan
./vendor/bin/phpstan analyse

# Menjalankan rangkaian pengujian otomatis (Pest PHP)
php artisan test
# atau
./vendor/bin/pest

# Membersihkan cache aplikasi dan konfigurasi
php artisan optimize:clear

# Kompilasi aset frontend untuk lingkungan produksi
npm run build
```

---

## 📄 Lisensi

Proyek ini dirilis dan dilindungi di bawah lisensi **[MIT License](LICENSE)**.

---

<p align="center">
  Didesain & Dikembangkan dengan penuh dedikasi oleh <b>Ronica Team</b>
</p>
