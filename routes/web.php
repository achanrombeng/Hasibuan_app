<?php

use App\Http\Controllers\Customer\DashboardController;
use App\Http\Controllers\LocaleController;
use App\Http\Controllers\SitemapController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

// Locale switching
Route::post('/locale', [LocaleController::class, 'update'])->name('locale.update');

// Debug route - REMOVE AFTER TESTING
Route::get('/debug-locale', function () {
    return response()->json([
        'app_locale' => app()->getLocale(),
        'cookie_locale' => request()->cookie('locale'),
        'config_locale' => config('app.locale'),
        'settings' => [
            'hero_badge_id' => \App\Models\Setting::get('hero_badge_id'),
            'hero_badge_en' => \App\Models\Setting::get('hero_badge_en'),
            'hero_badge' => \App\Models\Setting::get('hero_badge'),
        ],
    ]);
});

// Quick populate route - BACKUP (remove after testing)
Route::get('/quick-populate', function () {
    $token = config('app.artisan_token');
    if (!$token || request()->input('token') !== $token) {
        abort(403, 'Unauthorized');
    }

    try {
        $settings = [
            // Hero Badge
            'hero_badge_id' => 'Koleksi Terbaru 2025',
            'hero_badge_en' => 'Latest Collection 2025',

            // Hero Title
            'hero_title_id' => 'Desain yang',
            'hero_title_en' => 'Design that',

            // Hero Title Highlight
            'hero_title_highlight_id' => 'bernafas.',
            'hero_title_highlight_en' => 'breathes.',

            // Hero Description
            'hero_description_id' => 'Furniture minimalis dari bahan berkelanjutan. Dibuat untuk mereka yang menemukan kemewahan dalam kesederhanaan.',
            'hero_description_en' => 'Minimalist furniture from sustainable materials. Made for those who find luxury in simplicity.',

            // Hero Product Name
            'hero_product_name_id' => 'Kursi Santai Premium',
            'hero_product_name_en' => 'Premium Lounge Chair',

            // Home Values (Indonesian)
            'home_values_id' => json_encode([
                ['icon' => 'leaf', 'title' => 'Bahan Berkelanjutan', 'desc' => 'Setiap produk menggunakan kayu dari hutan yang dikelola secara bertanggung jawab dan bahan daur ulang.'],
                ['icon' => 'truck', 'title' => 'Gratis Pengiriman', 'desc' => 'Pengiriman gratis untuk pembelian di atas Rp 5 juta ke seluruh Indonesia.'],
                ['icon' => 'shield-check', 'title' => 'Garansi Selamanya', 'desc' => 'Garansi seumur hidup untuk semua kerusakan struktural karena kami percaya dengan kualitas kami.'],
            ]),

            // Home Values (English)
            'home_values_en' => json_encode([
                ['icon' => 'leaf', 'title' => 'Sustainable Materials', 'desc' => 'Every product uses wood from responsibly managed forests and recycled materials.'],
                ['icon' => 'truck', 'title' => 'Free Shipping', 'desc' => 'Free shipping for purchases over Rp 5 million throughout Indonesia.'],
                ['icon' => 'shield-check', 'title' => 'Lifetime Warranty', 'desc' => 'Lifetime warranty for all structural damage because we believe in our quality.'],
            ]),
        ];

        $updated = [];
        foreach ($settings as $key => $value) {
            \App\Models\Setting::set($key, $value);
            $updated[] = $key;
        }

        // Clear cache
        \Illuminate\Support\Facades\Artisan::call('cache:clear');

        return response()->json([
            'success' => true,
            'message' => 'Locale settings populated and cache cleared!',
            'updated_settings' => $updated,
            'count' => count($settings),
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => $e->getMessage(),
            'line' => $e->getLine(),
            'file' => $e->getFile(),
            'trace' => $e->getTraceAsString(),
        ], 500);
    }
});

// Redirect root to shop homepage
Route::get('/', fn() => redirect()->route('shop.home'))->name('home');

// Sitemap Routes
Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');
Route::get('/sitemap-pages.xml', [SitemapController::class, 'pages'])->name('sitemap.pages');
Route::get('/sitemap-products.xml', [SitemapController::class, 'products'])->name('sitemap.products');
Route::get('/sitemap-categories.xml', [SitemapController::class, 'categories'])->name('sitemap.categories');

// Keep welcome page for reference (optional)
Route::get('/welcome', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('welcome');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        // Redirect admin users to admin dashboard
        if (auth()->user()->hasAnyRole(['super-admin', 'admin', 'manager', 'staff'])) {
            return redirect('/admin');
        }
        return app(DashboardController::class)->index(request());
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/shop.php';
require __DIR__.'/admin.php';
require __DIR__.'/artisan.php';
