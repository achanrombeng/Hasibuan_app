# cPanel Deployment Guide

This guide explains how to deploy and manage the application on cPanel without SSH access.

## 1. Initial Setup

### 1.1 Add ARTISAN_TOKEN to .env
```env
ARTISAN_TOKEN=your-secure-random-token-here
```

**Generate a secure token:**
- Use a password generator
- Or run locally: `php artisan tinker --execute="echo Str::random(32)"`
- Example: `ARTISAN_TOKEN=8xK2mP9qL5nR7wY3vB6jD4hF1gT0sA9c`

### 1.2 Upload Files via cPanel File Manager
1. Upload all files to your domain's root (usually `public_html`)
2. Make sure `.env` file is uploaded with the correct values
3. Set proper permissions (755 for directories, 644 for files)

## 2. Running Artisan Commands via Browser

All commands require the `?token=YOUR_TOKEN` parameter for security.

### 2.1 First-Time Setup Commands

**Run in this order:**

1. **Populate Locale Settings** (fixes hero section translation)
   ```
   https://yourdomain.com/artisan/populate-locale?token=YOUR_TOKEN
   ```

2. **Create Storage Link**
   ```
   https://yourdomain.com/artisan/storage-link?token=YOUR_TOKEN
   ```

3. **Run Migrations**
   ```
   https://yourdomain.com/artisan/migrate?token=YOUR_TOKEN
   ```

4. **Optimize for Production**
   ```
   https://yourdomain.com/artisan/optimize?token=YOUR_TOKEN
   ```

### 2.2 Maintenance Commands

**Clear Cache** (run after updating code or .env)
```
https://yourdomain.com/artisan/clear-cache?token=YOUR_TOKEN
```

**List All Available Commands**
```
https://yourdomain.com/artisan/list?token=YOUR_TOKEN
```

## 3. Setting Up Cron Jobs in cPanel

### 3.1 Laravel Queue Worker (Required for background jobs)

1. Go to cPanel → Cron Jobs
2. Add new cron job:
   - **Common Settings:** Every Minute `* * * * *`
   - **Command:**
     ```bash
     cd /home/USERNAME/public_html && php artisan queue:work --stop-when-empty
     ```
   - Replace `USERNAME` with your cPanel username

### 3.2 Laravel Scheduler (If you use scheduled tasks)

1. Add another cron job:
   - **Common Settings:** Every Minute `* * * * *`
   - **Command:**
     ```bash
     cd /home/USERNAME/public_html && php artisan schedule:run >> /dev/null 2>&1
     ```

### 3.3 Cache Clearing (Optional - runs daily at midnight)

1. Add cron job:
   - **Common Settings:** Custom
   - **Minute:** 0
   - **Hour:** 0
   - **Day:** *
   - **Month:** *
   - **Weekday:** *
   - **Command:**
     ```bash
     curl -s "https://yourdomain.com/artisan/clear-cache?token=YOUR_TOKEN" > /dev/null
     ```

## 4. Troubleshooting

### 4.1 Hero Section Not Translating

**Cause:** Locale-specific settings not in database

**Solution:**
1. Visit: `https://yourdomain.com/artisan/populate-locale?token=YOUR_TOKEN`
2. Visit: `https://yourdomain.com/artisan/clear-cache?token=YOUR_TOKEN`
3. Switch language and refresh

### 4.2 Check Current Locale

Visit the debug route:
```
https://yourdomain.com/debug-locale
```

**Expected output:**
```json
{
  "app_locale": "id",
  "cookie_locale": "id",
  "settings": {
    "hero_badge_id": "Koleksi Terbaru 2025",
    "hero_badge_en": "Latest Collection 2025"
  }
}
```

### 4.3 500 Internal Server Error

**Common causes:**
1. `.env` file missing or incorrect
2. APP_KEY not generated
3. Storage directory permissions (need 755)
4. Cache not cleared

**Solution:**
1. Check `.env` file exists
2. Visit: `https://yourdomain.com/artisan/clear-cache?token=YOUR_TOKEN`
3. Contact hosting support to check error logs

## 5. Security Notes

### 5.1 Protect Artisan Routes

**IMPORTANT:** The artisan routes are protected by token, but you should:

1. **Use a strong random token** (32+ characters)
2. **Never share your token publicly**
3. **Change token if compromised**
4. **Disable debug routes in production** (remove from routes/web.php):
   ```php
   // Remove this in production:
   Route::get('/debug-locale', function () { ... });
   ```

### 5.2 Remove Debug Route

After confirming everything works, edit `routes/web.php` and remove:
```php
// Debug route - REMOVE AFTER TESTING
Route::get('/debug-locale', function () {
    // ... remove this entire route
});
```

## 6. Production Checklist

- [ ] Set `APP_ENV=production` in .env
- [ ] Set `APP_DEBUG=false` in .env
- [ ] Set strong `ARTISAN_TOKEN` in .env
- [ ] Run populate-locale command
- [ ] Run optimize command
- [ ] Set up queue worker cron job
- [ ] Remove debug routes
- [ ] Test language switching
- [ ] Test hero section translation

## 7. Quick Reference

### Available Artisan Routes

| Command | URL | Purpose |
|---------|-----|---------|
| Populate Locale | `/artisan/populate-locale?token=XXX` | Fix hero translation |
| Clear Cache | `/artisan/clear-cache?token=XXX` | Clear all caches |
| Optimize | `/artisan/optimize?token=XXX` | Cache config/routes/views |
| Migrate | `/artisan/migrate?token=XXX` | Run database migrations |
| Storage Link | `/artisan/storage-link?token=XXX` | Create storage symlink |
| List Commands | `/artisan/list?token=XXX` | Show all available routes |

### Finding Your cPanel Path

Replace `/home/USERNAME/public_html` with your actual path:
- Usually shown in cPanel File Manager
- Or check in cPanel → PHP Info → `_SERVER["DOCUMENT_ROOT"]`
