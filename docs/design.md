# Ronica Web Marketplace – Design Guideline

Dokumen ini menjadi **acuan utama (single source of truth)** untuk AI atau desainer dalam memperbarui **desain UI/UX** web marketplace **Ronica**, tanpa mengubah stack teknis (Laravel + Inertia.js + React).

Fokus dokumen ini adalah **visual design, layout, tone, dan konsistensi brand**.

---

## 1. Brand Identity

### 1.1 Brand Overview

**Ronica** adalah marketplace furnitur dengan karakter:

- Modern
- Hangat
- Profesional
- Berorientasi kualitas & craftsmanship

Brand harus terasa **premium namun tetap ramah**, tidak terlalu mewah, dan cocok untuk pasar furnitur rumah.

---

### 1.2 Logo & Warna

Logo Ronica menggunakan kombinasi:

- **Primary Teal / Green-Blue** → #02545f
- **Accent Yellow** → aksen hangat & penarik perhatian #ffdb56
- **Dark Neutral (Hitam / Abu gelap)** → teks & kontras

#### Color Roles (bukan angka absolut, tapi peran):

- **Primary Color**: digunakan untuk navbar, link aktif, highlight
- **Secondary / Accent**: CTA utama, badge promo, hover penting
- **Neutral Light**: background halaman (light mode)
- **Neutral Dark**: teks utama

⚠️ Hindari warna terlalu mencolok atau neon. Semua warna harus **soft, mature, dan natural**.

---

## 2. Typography

### 2.1 Font Family

Gunakan **Sans-serif modern**, contoh preferensi:

- Inter
- Plus Jakarta Sans
- Manrope
- SF Pro (fallback)

> Karakter font: bersih, readable, tidak dekoratif

### 2.2 Hierarki Teks

- **Hero Heading**: besar, bold, clean
- **Section Title**: semi-bold
- **Body Text**: regular, relaxed line-height
- **Caption / Meta**: kecil, light

Tidak menggunakan font serif.

---

## 3. Design References & Interpretasi

### 3.1 OH Architecture

**Diambil:**

- Hero full screen
- Foto besar sebagai statement
- Copywriting singkat & elegan

**Dihindari:**

- Terlalu minimal sampai menghilangkan konteks produk

---

### 3.2 Real Teak Furniture

**Diambil:**

- Nuansa natural
- Penggunaan whitespace
- Penekanan pada material & foto produk

---

### 3.3 Pottery Barn

**Menjadi acuan utama marketplace layout**

**Diambil:**

- Grid produk rapi
- Card produk bersih
- Navigasi kategori jelas
- Fokus ke eksplorasi produk

---

### 3.4 Mark Ashima

**Diambil:**

- Modern web feel
- Spacing yang lega
- Komposisi layout yang seimbang

---

## 4. Layout Global

### 4.1 Mode Tampilan

- **Light Mode only**
- Background dominan putih / off-white

---

### 4.2 Grid & Spacing

- Layout berbasis grid
- Spacing lega (tidak padat)
- Section dipisahkan jelas

---

## 5. Hero Section (Landing Page)

### 5.1 Visual

- Full screen (100vh)
- 1 foto utama furnitur (interior / lifestyle)
- Foto **tidak ditimpa banyak elemen UI**

### 5.2 Copywriting

- Kalimat pendek
- Elegan
- Fokus pada kualitas & kenyamanan

**Contoh tone (bukan teks final):**

> Crafted furniture for modern living

### 5.3 Elemen

- Heading
- Subheading pendek
- 1 CTA utama (Explore Collection)

---

## 6. Marketplace / Product Listing

### 6.1 Product Card

Setiap card berisi:

- Foto produk (dominant)
- Nama produk
- Harga
- Optional badge (New / Best Seller)

**Style:**

- Sharp corners tidak rounded
- Shadow tipis
- Hover subtle (scale / shadow)

---

### 6.2 Grid Produk

- 3–4 kolom desktop
- 2 kolom tablet
- 1 kolom mobile

---

## 7. Product Detail Page (PDP)

### 7.1 Layout

- Foto besar di kiri
- Detail produk di kanan

### 7.2 Informasi

- Nama produk (bold)
- Harga jelas
- Deskripsi singkat
- Spesifikasi material

### 7.3 CTA

- Add to Cart → warna accent
- Tidak terlalu besar, tapi jelas

---

## 8. Navigation & Header

### 8.1 Header Style

- Clean
- Sticky
- Logo kiri
- Menu kategori tengah / kanan
- Cart & profile icon minimalis

---

## 9. Interaction & Motion

- Animasi ringan
- Hover lembut
- Tidak berlebihan

Tujuan: **terasa modern tapi tenang**.

---

## 10. AI Design Prompt (Ringkas)

Gunakan prompt berikut saat generate desain UI:

> Design a light-mode furniture marketplace website named Ronica. Use a modern sans-serif font, a clean and warm color palette inspired by teal and soft yellow accents, and a premium yet friendly feel. The hero section should be full-screen with a large furniture lifestyle photo and minimal elegant copywriting similar to OH Architecture and Real Teak Furniture. Product listing and marketplace layout should be inspired by Pottery Barn with clean grids, spacious layout, and subtle interactions. Overall design should feel modern, professional, and natural.

---

## 11. Catatan Teknis

- Desain harus **mudah diimplementasikan** di React + Tailwind / CSS modern
- Tidak bergantung pada efek berat
- Komponen reusable

---

**Dokumen ini menjadi acuan tetap untuk semua iterasi desain Ronica.**
