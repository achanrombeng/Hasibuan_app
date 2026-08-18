#!/usr/bin/env bash
set -euo pipefail

echo "==> Setting file permissions"
find storage -type d -exec chmod 775 {} \;
find storage -type f -exec chmod 664 {} \;
find bootstrap/cache -type d -exec chmod 775 {} \;

echo "==> Running database migrations"
php artisan migrate --force --no-interaction

echo "==> Ensuring storage symlink exists"
php artisan storage:link || true

echo "==> Clearing stale caches"
php artisan optimize:clear

echo "==> Rebuilding production caches"
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

echo "==> Restarting queue workers"
php artisan queue:restart

echo "==> Deployment complete"
