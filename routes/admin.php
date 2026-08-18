<?php

declare(strict_types=1);

use App\Http\Controllers\Admin\ArticleController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\PromoBannerController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\ReviewController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
|
| Routes untuk admin panel. Semua routes di sini memerlukan autentikasi
| dan role admin.
|
*/

Route::middleware(['auth', 'verified', 'role:admin|super-admin|manager|staff'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/search', [\App\Http\Controllers\Admin\GlobalSearchController::class, 'index'])->name('global.search');

    // Notifications
    Route::get('/notifications/unread', [\App\Http\Controllers\Admin\NotificationController::class, 'getUnread'])->name('notifications.unread');
    Route::get('/notifications', [\App\Http\Controllers\Admin\NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/mark-all-read', [\App\Http\Controllers\Admin\NotificationController::class, 'markAllRead'])->name('notifications.mark-all-read');
    Route::delete('/notifications/clear-all', [\App\Http\Controllers\Admin\NotificationController::class, 'clearAll'])->name('notifications.clear-all');
    Route::patch('/notifications/{id}/read', [\App\Http\Controllers\Admin\NotificationController::class, 'markAsRead'])->name('notifications.read');

    // Profile
    Route::get('/profile', [\App\Http\Controllers\Admin\ProfileController::class, 'edit'])->name('profile.edit');

    // Categories
    Route::resource('categories', CategoryController::class)->except(['show']);

    // Products
    Route::post('products/ai-extract', [ProductController::class, 'extractFromImage'])
        ->name('products.ai-extract');
    Route::resource('products', ProductController::class);

    // Orders
    Route::resource('orders', OrderController::class)->only(['index', 'show', 'update']);

    // Customers (view only)
    Route::get('/customers', [CustomerController::class, 'index'])->name('customers.index');
    Route::get('/customers/{customer}', [CustomerController::class, 'show'])->name('customers.show');

    // Reviews (ProductReview model)
    Route::get('/reviews', [ReviewController::class, 'index'])->name('reviews.index');
    Route::patch('/reviews/{review}/approve', [ReviewController::class, 'approve'])->name('reviews.approve');
    Route::patch('/reviews/{review}/reject', [ReviewController::class, 'reject'])->name('reviews.reject');
    Route::delete('/reviews/{review}', [ReviewController::class, 'destroy'])->name('reviews.destroy');

    // Articles
    Route::resource('articles', ArticleController::class);

    // Reports
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
});

// Super Admin only routes
Route::middleware(['auth', 'verified', 'role:super-admin|admin'])->prefix('admin')->name('admin.')->group(function () {
    // User Management
    Route::resource('users', UserController::class);

    // Settings
    Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
    Route::post('/settings', [SettingsController::class, 'update'])->name('settings.update');

    // Homepage Settings
    Route::get('/settings/homepage', [SettingsController::class, 'homepage'])->name('settings.homepage');
    Route::post('/settings/homepage', [SettingsController::class, 'updateHomepage'])->name('settings.homepage.update');

    // Payment Settings
    Route::get('/settings/payment', [SettingsController::class, 'payment'])->name('settings.payment');
    Route::post('/settings/payment', [SettingsController::class, 'updatePayment'])->name('settings.payment.update');

    // AI Settings
    Route::get('/settings/ai', [SettingsController::class, 'ai'])->name('settings.ai');
    Route::post('/settings/ai', [SettingsController::class, 'updateAi'])->name('settings.ai.update');

    // Promo Banners
    Route::resource('promo-banners', PromoBannerController::class)->except(['show']);
    Route::patch('/promo-banners/{promo_banner}/toggle', [PromoBannerController::class, 'toggleActive'])
        ->name('promo-banners.toggle');
});

