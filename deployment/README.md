# CI/CD Deployment Guide (GitHub Actions → cPanel)

Auto-deploy ke cPanel setiap push/merge ke branch `main`.

## Dua Workflow Tersedia

| File | Method | Trigger | Kapan dipakai |
|---|---|---|---|
| `deploy.yml` | **SSH + rsync** (primary) | Auto on push to `main` + manual | Default — cepat, clean, secure |
| `deploy-ftp.yml` | **FTPS + HTTP artisan** (fallback) | **Manual only** (workflow_dispatch) | Kalau SSH bermasalah atau butuh backup path |

> **Kedua workflow punya concurrency group yang sama** (`deploy-production`) — jadi tidak akan jalan bersamaan, menghindari race condition.

## Arsitektur

### Workflow A — SSH (Primary)

```
Push ke main
  ↓
GitHub Actions (ubuntu-latest)
  ├─ composer install --no-dev
  ├─ npm ci && npm run build
  ├─ rsync -avz --delete over SSH → /home/furnit59/public_html
  └─ ssh exec bash deployment/post-deploy.sh
      ├─ php artisan migrate --force
      ├─ php artisan optimize:clear
      ├─ config/route/view/event cache
      └─ php artisan queue:restart
```

### Workflow B — FTPS (Fallback)

```
Manual trigger (Actions tab → Run workflow)
  ↓
GitHub Actions (ubuntu-latest)
  ├─ composer install --no-dev
  ├─ npm ci && npm run build
  ├─ FTP-Deploy-Action (FTPS) → /public_html
  └─ curl dengan ARTISAN_TOKEN:
      ├─ /artisan/test (verify token)
      ├─ /artisan/migrate
      ├─ /artisan/clear-cache
      ├─ /artisan/optimize
      └─ /artisan/storage-link
```

---

## One-Time Setup Checklist

### A. Setup di cPanel (wajib untuk BOTH)

#### A.1. Upgrade PHP ke 8.2+ (WAJIB)

1. Login cPanel → **MultiPHP Manager**
2. Centang domain `ronica.com`
3. Pilih **PHP 8.3 (ea-php83)** atau **PHP 8.2 (ea-php82)**
4. Klik **Apply**

> Saat ini masih di PHP 7.4 — Laravel 12 tidak akan jalan sampai ini di-upgrade.

#### A.2. Isi `.env` Production di Server

File `/home/furnit59/public_html/.env`:

```env
APP_NAME="Ronica"
APP_ENV=production
APP_KEY=base64:xxx          # kalau sudah ada, biarkan
APP_DEBUG=false
APP_URL=https://ronica.com
APP_LOCALE=id

# WAJIB untuk FTP workflow (fallback). Bisa dipakai manual juga.
ARTISAN_TOKEN=GENERATE_TOKEN_PANJANG_RANDOM_32_KARAKTER

DB_CONNECTION=mysql
DB_HOST=localhost
DB_DATABASE=latif_ecommerce
DB_USERNAME=xxx
DB_PASSWORD=xxx

QUEUE_CONNECTION=database
CACHE_STORE=database
SESSION_DRIVER=database

midtrans_server_key=xxx
midtrans_client_key=xxx
midtrans_is_production=true

RAJAONGKIR_API_KEY=xxx
```

Generate `ARTISAN_TOKEN`:
```bash
# Di komputer lokal
php -r "echo bin2hex(random_bytes(32));"
# atau pakai password manager generate 32+ char random string
```

#### A.3. Setup Cron Jobs

cPanel → **Cron Jobs**:

**Cron 1 — Laravel Scheduler (setiap menit)**
```
* * * * * cd /home/furnit59/public_html && /usr/local/bin/ea-php83 artisan schedule:run >> /dev/null 2>&1
```

**Cron 2 — Queue Worker**
```
* * * * * cd /home/furnit59/public_html && /usr/local/bin/ea-php83 artisan queue:work --stop-when-empty --max-time=55 >> /dev/null 2>&1
```

> Ganti `ea-php83` sesuai versi PHP yang dipilih di A.1.

---

### B. Setup untuk Workflow A (SSH)

#### B.1. SSH Key — SUDAH DIBUAT ✅

Key `gha_deploy` sudah di-generate (RSA 4096) dan sudah **authorized** di cPanel.

**Yang Boss perlu lakukan — download & strip passphrase:**

1. Login cPanel → **SSH Access** → **Manage SSH Keys** → Private Keys → `gha_deploy` → **View/Download**
2. Download file private key
3. Strip passphrase (wajib agar GitHub Actions bisa auto-login):

```bash
# Jalankan di komputer lokal setelah download key
ssh-keygen -p \
  -f gha_deploy \
  -P "TempPass-Ronica-2026-StripAfter!9x7K" \
  -N ""

# Hasilnya: key tanpa passphrase, siap di-paste ke GitHub Secret
cat gha_deploy
```

4. Copy **seluruh output** `cat gha_deploy` (termasuk `-----BEGIN OPENSSH PRIVATE KEY-----` s/d `-----END OPENSSH PRIVATE KEY-----`) → paste ke GitHub Secret `SSH_PRIVATE_KEY`
5. **Hapus file `gha_deploy` dari komputer lokal** setelah di-copy ke GitHub Secret

#### B.2. Catat SSH Connection Info

- **SSH Host**: `wirobrajan.idweb.host`
- **SSH Port**: biasanya `22`, kadang custom (`2222`, `7822`) — tanya provider
- **SSH User**: `furnit59`
- **Deploy Path**: `/home/furnit59/public_html`

Test koneksi dari laptop:
```bash
ssh -i ~/.ssh/deploy_key -p <PORT> furnit59@wirobrajan.idweb.host
```

#### B.3. GitHub Secrets untuk SSH Workflow

Repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**:

| Secret Name | Isi |
|---|---|
| `SSH_HOST` | `wirobrajan.idweb.host` |
| `SSH_PORT` | `22` (atau port custom) |
| `SSH_USER` | `furnit59` |
| `SSH_PRIVATE_KEY` | Full isi private key dari B.1 |
| `DEPLOY_PATH` | `/home/furnit59/public_html` |

---

### C. Setup untuk Workflow B (FTP Fallback)

#### C.1. Buat FTP Account Khusus

> **Jangan pakai main cPanel account untuk FTP**. Buat account terpisah dengan akses terbatas supaya kalau bocor, blast radius kecil.

1. cPanel → **FTP Accounts** → **Add FTP Account**
2. Isi:
   - **Log In**: `deploy` (hasilnya: `deploy@ronica.com`)
   - **Domain**: `ronica.com`
   - **Password**: generate password kuat 20+ karakter (pakai password manager, jangan reuse)
   - **Directory**: `/home/furnit59/public_html` *(penting — jangan kosongkan, biar akses terbatas)*
   - **Quota**: `Unlimited` (atau sesuai disk available)
3. Klik **Create FTP Account**

#### C.2. Catat FTP Connection Info

Klik **Configure FTP Client** di account yang baru dibuat untuk lihat info:
- **FTP Server / Host**: `ftp.ronica.com` atau `wirobrajan.idweb.host`
- **FTP Port (TLS/FTPS)**: `21` (FTPS explicit TLS, direkomendasikan)
- **FTP User**: `deploy@ronica.com`
- **FTP Password**: yang di-set di C.1

#### C.3. GitHub Secrets untuk FTP Workflow

Tambahkan secrets ini (selain SSH secrets kalau mau dua-duanya aktif):

| Secret Name | Isi |
|---|---|
| `FTP_HOST` | `wirobrajan.idweb.host` |
| `FTP_PORT` | `21` |
| `FTP_USER` | `deploy@ronica.com` |
| `FTP_PASSWORD` | Password FTP dari C.1 |
| `FTP_SERVER_DIR` | `/` (karena FTP account sudah jailed ke public_html) |
| `APP_URL` | `https://ronica.com` |
| `ARTISAN_TOKEN` | Sama dengan yang di `.env` server (A.2) |

> **Kenapa `FTP_SERVER_DIR = /`?** Karena FTP account di C.1 di-set directory ke `public_html`, jadi root FTP-nya sudah `public_html`.

---

### D. Verifikasi Setup

#### D.1. Test Workflow SSH

1. GitHub → repo → **Actions** tab
2. Pilih **Deploy to cPanel** → **Run workflow** → branch `main`
3. Tunggu selesai, cek logs

#### D.2. Test Workflow FTP (manual)

1. Actions tab → **Deploy to cPanel (FTP fallback)**
2. **Run workflow** → pilih branch `main` → centang `run_migrations` kalau perlu
3. Perhatikan: FTP deploy pertama akan **lambat** (upload semua file, ~10 menit). Subsequent deploy lebih cepat karena ada state file yang track perubahan.

#### D.3. Smoke Test Manual

```bash
# Homepage harus 200/302
curl -I https://ronica.com

# Artisan token harus valid
curl "https://ronica.com/artisan/test?token=YOUR_TOKEN"
```

---

## Cara Kerja Day-to-Day

**Normal flow:**
- Push ke `main` → `deploy.yml` (SSH) auto-trigger → deploy selesai dalam 2-3 menit

**Kalau SSH bermasalah:**
- Actions tab → **Deploy to cPanel (FTP fallback)** → **Run workflow**
- Pilih apakah migrate di-run atau tidak
- Deploy selesai dalam 10-15 menit (FTP selalu lebih lambat)

**Kalau perlu trigger SSH deploy manual:**
- Actions tab → **Deploy to cPanel** → **Run workflow**

---

## Troubleshooting

### SSH deploy gagal di step "Configure SSH"

- Cek `SSH_PRIVATE_KEY` di GitHub Secrets — pastikan **full** key (termasuk BEGIN/END lines dan newlines)
- Pastikan key sudah di-**Authorize** di cPanel SSH Access

### FTP deploy gagal dengan "530 Login incorrect"

- Username FTP harus full: `deploy@ronica.com`, bukan hanya `deploy`
- Cek password tidak mengandung karakter yang perlu escape di GitHub Secrets

### Migrate gagal via HTTP (FTP workflow)

- Cek `ARTISAN_TOKEN` di `.env` server **sama persis** dengan secret di GitHub
- Cek response: `curl "https://ronica.com/artisan/test?token=xxx"` harus return 200 OK JSON

### Homepage 500 setelah deploy

```bash
ssh -p <PORT> furnit59@wirobrajan.idweb.host
cd public_html
tail -100 storage/logs/laravel.log
```

Common causes:
- `.env` salah / missing
- PHP version masih 7.4
- Folder permission — `chmod 775 storage bootstrap/cache`

### Rollback

```bash
git revert <commit-sha>
git push origin main
# Auto-deploy akan jalan, restore versi sebelumnya
```

---

## Security Checklist

- [ ] Password cPanel **sudah diganti** (yang lama pernah di-share di chat)
- [ ] SSH key passphrase kosong hanya untuk deploy key, tidak untuk SSH user lain
- [ ] FTP account `deploy@ronica.com` di-jail ke `public_html` (tidak bisa akses `/home/furnit59` penuh)
- [ ] `ARTISAN_TOKEN` 32+ karakter random
- [ ] `.env` production **tidak pernah** di-commit atau di-deploy via workflow
- [ ] GitHub Secrets hanya accessible oleh repo maintainer
- [ ] Kalau ada yang bocor:
  - SSH key bocor → cPanel → SSH Keys → **Deauthorize** → generate ulang
  - FTP password bocor → cPanel → FTP Accounts → **Change Password**
  - ARTISAN_TOKEN bocor → update `.env` + GitHub Secret
