<?php

declare(strict_types=1);

use App\Http\Controllers\Shop\AddressController;
use App\Http\Controllers\Shop\ArticleController;
use App\Http\Controllers\Shop\CartController;
use App\Http\Controllers\Shop\CheckoutController;
use App\Http\Controllers\Shop\HomeController;
use App\Http\Controllers\Shop\NewsletterController;
use App\Http\Controllers\Shop\OrderController;
use App\Http\Controllers\Shop\ProductController;
use App\Http\Controllers\Shop\WishlistController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Shop Routes
|--------------------------------------------------------------------------
|
| Routes untuk toko online. Beberapa routes memerlukan autentikasi.
|
*/

// Public routes - Produk
Route::prefix('shop')->name('shop.')->middleware('share.cart')->group(function () {
    // Homepage - Landing page with products
    Route::get('/', [HomeController::class, 'index'])->name('home');
    Route::get('/catalogs', function () {
        $categories = \App\Models\Category::where('is_active', true)
            ->whereNull('parent_id')
            ->withCount('products')
            ->orderBy('sort_order')
            ->get();

        return \Inertia\Inertia::render('Shop/Catalog', [
            'categories' => \App\Http\Resources\CategoryResource::collection($categories),
        ]);
    })->name('catalogs');

    // Products
    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
    Route::get('/products/{product:slug}', [ProductController::class, 'show'])->name('products.show');

    // Categories
    Route::get('/categories', function () {
        $categories = \App\Models\Category::where('is_active', true)
            ->whereNull('parent_id')
            ->with('children')
            ->withCount('products')
            ->orderBy('sort_order')
            ->get();

        return \Inertia\Inertia::render('Shop/Categories/Index', [
            'categories' => \App\Http\Resources\CategoryResource::collection($categories),
        ]);
    })->name('categories.index');
    Route::get('/category/{category:slug}', [ProductController::class, 'byCategory'])->name('products.category');

    // Sale Pages
    Route::get('/hot-sale', [ProductController::class, 'hotSale'])->name('products.hot-sale');
    Route::get('/clearance', [ProductController::class, 'clearance'])->name('products.clearance');
    Route::get('/stock-sale', [ProductController::class, 'stockSale'])->name('products.stock-sale');

    // Custom Order
    Route::get('/custom-order', fn () => \Inertia\Inertia::render('Shop/CustomOrder'))->name('custom-order');

    // Articles
    Route::get('/articles', [ArticleController::class, 'index'])->name('articles.index');
    Route::get('/articles/{slug}', [ArticleController::class, 'show'])->name('articles.show');

    // Static Pages
    Route::get('/about', function () {
        $settings = \App\Models\Setting::all()->pluck('value', 'key')->toArray();
        return \Inertia\Inertia::render('Shop/About', [
            'aboutSettings' => [
                'hero_title' => $settings['about_hero_title'] ?? 'Welcome to Ronica Outdoor Furniture',
                'hero_subtitle' => $settings['about_hero_subtitle'] ?? 'Delivering premium quality furniture with the touch of traditional Indonesian craftsmanship',
                'story_title' => $settings['about_story_title'] ?? 'Our Story',
                'story_p1' => $settings['about_story_p1'] ?? 'Ronica Outdoor Furniture was born from a love for high-quality furniture and traditional craftsmanship.',
                'story_p2' => $settings['about_story_p2'] ?? 'Every product we create is the result of a perfect blend of traditional techniques and modern design.',
                'story_p3' => $settings['about_story_p3'] ?? 'At Ronica Outdoor Furniture, we believe that furniture is not just an item, but a long-term investment.',
                'story_image' => $settings['about_story_image'] ?? '/images/placeholder-about.svg',
                'years_experience' => $settings['about_years_experience'] ?? '14+',
                'years_experience_label' => $settings['about_years_experience_label'] ?? 'Years of Experience',
                'vision_title' => $settings['about_vision_title'] ?? 'Our Vision',
                'vision_text' => $settings['about_vision_text'] ?? 'To become a pioneer in Indonesia\'s premium furniture industry by combining traditional craftsmanship with modern innovation.',
                'mission_title' => $settings['about_mission_title'] ?? 'Our Mission',
                'mission_1' => $settings['about_mission_1'] ?? 'Deliver premium quality furniture at competitive prices',
                'mission_2' => $settings['about_mission_2'] ?? 'Preserve traditional Indonesian craftsmanship techniques',
                'mission_3' => $settings['about_mission_3'] ?? 'Use sustainable and environmentally friendly materials',
                'mission_4' => $settings['about_mission_4'] ?? 'Provide the best service to every customer',
            ],
        ]);
    })->name('about');

    Route::get('/dealer', fn () => \Inertia\Inertia::render('Shop/Dealer'))->name('dealer');
    Route::get('/contact', fn () => \Inertia\Inertia::render('Shop/Contact'))->name('contact');
    Route::get('/faq', fn () => \Inertia\Inertia::render('Shop/FAQ'))->name('faq');
    Route::get('/privacy-policy', fn () => \Inertia\Inertia::render('Shop/PrivacyPolicy'))->name('privacy');
    Route::get('/terms', fn () => \Inertia\Inertia::render('Shop/Terms'))->name('terms');
    Route::get('/shipping-policy', fn () => \Inertia\Inertia::render('Shop/ShippingPolicy'))->name('shipping');
    Route::get('/return-policy', fn () => \Inertia\Inertia::render('Shop/ReturnPolicy'))->name('returns');

    // Compare Products
    // Compare Products
    Route::get('/compare', [ProductController::class, 'compare'])->name('products.compare');

    // Reviews
    Route::post('/products/{product}/reviews', [\App\Http\Controllers\Shop\ReviewController::class, 'store'])->name('products.reviews.store');
    Route::put('/products/{product}/reviews', [\App\Http\Controllers\Shop\ReviewController::class, 'update'])->name('products.reviews.update');

    // Newsletter
    Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe'])->name('newsletter.subscribe');
    Route::post('/newsletter/unsubscribe', [NewsletterController::class, 'unsubscribe'])->name('newsletter.unsubscribe');

    // Cart (accessible by guests and authenticated users)
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
    Route::put('/cart/{cartItem}', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/{cartItem}', [CartController::class, 'destroy'])->name('cart.destroy');
    Route::delete('/cart', [CartController::class, 'clear'])->name('cart.clear');
    Route::post('/cart/merge', [CartController::class, 'merge'])->name('cart.merge');
    Route::post('/cart/{cartItem}/save-for-later', [CartController::class, 'saveForLater'])->name('cart.saveForLater');
    Route::post('/cart/{cartItem}/move-to-cart', [CartController::class, 'moveToCart'])->name('cart.moveToCart');

    // Authenticated routes
    Route::middleware(['auth', 'verified'])->group(function () {
        // Wishlist
        Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist.index');
        Route::post('/wishlist/{product}', [WishlistController::class, 'toggle'])->name('wishlist.toggle');
        Route::delete('/wishlist/{product}', [WishlistController::class, 'destroy'])->name('wishlist.destroy');
        Route::get('/wishlist/check/{product}', [WishlistController::class, 'check'])->name('wishlist.check');

        // Checkout
        Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
        Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
        Route::get('/checkout/success', [CheckoutController::class, 'success'])->name('checkout.success');

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
