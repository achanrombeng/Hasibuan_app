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
    Route::get('/about', fn () => \Inertia\Inertia::render('Shop/About'))->name('about');
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
