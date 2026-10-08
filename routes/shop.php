<?php

declare(strict_types=1);

use App\Http\Controllers\Shop\AddressController;
use App\Http\Controllers\Shop\ArticleController;
use App\Http\Controllers\Shop\DealerController;
use App\Http\Controllers\Shop\HomeController;
use App\Http\Controllers\Shop\NewsletterController;
use App\Http\Controllers\Shop\OrderController;
use App\Http\Controllers\Shop\ProductController;
use App\Http\Controllers\Shop\ReviewController;
use App\Http\Controllers\Shop\WishlistController;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Models\Setting;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Shop Routes
|--------------------------------------------------------------------------
|
| Routes untuk toko online. Beberapa routes memerlukan autentikasi.
|
*/

// Public routes - Produk
Route::prefix('shop')->name('shop.')->group(function () {
    // Homepage - Landing page with products
    Route::get('/', [HomeController::class, 'index'])->name('home');
    Route::get('/catalogs', function () {
        $categories = Category::where('is_active', true)
            ->whereNull('parent_id')
            ->withProductsCount()
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('Shop/Catalog', [
            'categories' => CategoryResource::collection($categories),
        ]);
    })->name('catalogs');

    // Products
    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
    Route::get('/products/search', [ProductController::class, 'search'])->name('products.search');
    Route::get('/products/{product:slug}', [ProductController::class, 'show'])->name('products.show');

    // Categories
    Route::get('/categories', function () {
        $categories = Category::where('is_active', true)
            ->whereNull('parent_id')
            ->with(['children' => fn ($q) => $q->withProductsCount()->orderBy('sort_order')])
            ->withProductsCount()
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('Shop/Categories/Index', [
            'categories' => CategoryResource::collection($categories),
        ]);
    })->name('categories.index');
    Route::get('/category/{category:slug}', [ProductController::class, 'byCategory'])->name('products.category');

    // Sale Pages
    Route::get('/hot-sale', [ProductController::class, 'hotSale'])->name('products.hot-sale');
    Route::get('/clearance', [ProductController::class, 'clearance'])->name('products.clearance');
    Route::get('/stock-sale', [ProductController::class, 'stockSale'])->name('products.stock-sale');

    // Custom Order
    Route::get('/custom-order', fn () => Inertia::render('Shop/CustomOrder'))->name('custom-order');

    // Articles
    Route::get('/articles', [ArticleController::class, 'index'])->name('articles.index');
    Route::get('/articles/{slug}', [ArticleController::class, 'show'])->name('articles.show');

    // Static Pages
    Route::get('/about', function () {
        $settings = Setting::all()->pluck('value', 'key')->toArray();

        $storyContent = $settings['about_story_content'] ?? null;
        if (empty($storyContent)) {
            $paragraphs = array_filter([
                $settings['about_story_p1'] ?? null,
                $settings['about_story_p2'] ?? null,
                $settings['about_story_p3'] ?? null,
                $settings['about_story_p4'] ?? null,
                $settings['about_story_p5'] ?? null,
            ]);
            if (! empty($paragraphs)) {
                $storyContent = implode("\n\n", $paragraphs);
            }
        }

        $storyImages = json_decode($settings['about_story_images'] ?? '[]', true);
        if (empty($storyImages) || ! is_array($storyImages)) {
            $storyImages = array_values(array_filter([
                $settings['about_story_image_1'] ?? ($settings['about_story_image'] ?? '/images/about/hasibuan-profile-1.webp'),
                $settings['about_story_image_2'] ?? '/images/about/hasibuan-profile-2.webp',
                $settings['about_story_image_3'] ?? '/images/about/hasibuan-workshop.jpg',
            ]));
        }

        return Inertia::render('Shop/About', [
            'aboutSettings' => [
                'story_title' => $settings['about_story_title'] ?? 'Company Profile',
                'story_subtitle' => $settings['about_story_subtitle'] ?? 'Hasibuan Designs Furniture & Craftsmanship - Jepara, Indonesia',
                'story_content' => $storyContent,
                'story_images' => $storyImages,
            ],
        ]);
    })->name('about');

    Route::get('/dealer', [DealerController::class, 'index'])->name('dealer');
    Route::post('/dealer', [DealerController::class, 'store'])->name('dealer.store');
    Route::get('/contact', fn () => Inertia::render('Shop/Contact'))->name('contact');
    Route::get('/faq', fn () => Inertia::render('Shop/FAQ'))->name('faq');
    Route::get('/privacy-policy', fn () => Inertia::render('Shop/PrivacyPolicy'))->name('privacy');
    Route::get('/terms', fn () => Inertia::render('Shop/Terms'))->name('terms');
    Route::get('/shipping-policy', fn () => Inertia::render('Shop/ShippingPolicy'))->name('shipping');
    Route::get('/return-policy', fn () => Inertia::render('Shop/ReturnPolicy'))->name('returns');

    // Compare Products
    // Compare Products
    Route::get('/compare', [ProductController::class, 'compare'])->name('products.compare');

    // Reviews
    Route::post('/products/{product}/reviews', [ReviewController::class, 'store'])->name('products.reviews.store');
    Route::put('/products/{product}/reviews', [ReviewController::class, 'update'])->name('products.reviews.update');

    // Newsletter
    Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe'])->name('newsletter.subscribe');
    Route::post('/newsletter/unsubscribe', [NewsletterController::class, 'unsubscribe'])->name('newsletter.unsubscribe');

    // Authenticated routes
    Route::middleware(['auth', 'verified'])->group(function () {
        // Wishlist
        Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist.index');
        Route::post('/wishlist/{product}', [WishlistController::class, 'toggle'])->name('wishlist.toggle');
        Route::delete('/wishlist/{product}', [WishlistController::class, 'destroy'])->name('wishlist.destroy');
        Route::get('/wishlist/check/{product}', [WishlistController::class, 'check'])->name('wishlist.check');

        // Orders
        Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
        Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
        Route::post('/orders/{order}/cancel', [OrderController::class, 'cancel'])->name('orders.cancel');

        // Addresses
        Route::resource('addresses', AddressController::class)->except(['create', 'show', 'edit']);
        Route::post('/addresses/{address}/default', [AddressController::class, 'setDefault'])->name('addresses.default');
    });
});

// Fallback root aliases
Route::get('/dealer', fn () => redirect('/shop/dealer'));
Route::get('/contact', fn () => redirect('/shop/contact'));
