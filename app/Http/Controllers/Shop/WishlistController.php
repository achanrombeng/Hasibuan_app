<?php

declare(strict_types=1);

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Inertia\Response;

class WishlistController extends Controller implements HasMiddleware
{
    /** @return array<int, Middleware> */
    public static function middleware(): array
    {
        return [
            new Middleware('auth'),
        ];
    }

    /**
     * Display the user's wishlist.
     */
    public function index(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();

        $wishlistProducts = $user->wishlists()
            ->with(['product' => fn ($q) => $q->with(['category', 'images'])])
            ->latest()
            ->get()
            ->pluck('product')
            ->filter(); // Remove null products (deleted)

        \Illuminate\Support\Facades\Log::info('Wishlist index', [
            'user_id' => $user->id,
            'raw_count' => $user->wishlists()->count(),
            'filtered_count' => $wishlistProducts->count(),
        ]);

        return Inertia::render('Shop/Wishlist/Index', [
            'products' => ProductResource::collection($wishlistProducts)->resolve(),
        ]);
    }

    /**
     * Toggle product in wishlist.
     */
    public function toggle(Request $request, Product $product): \Illuminate\Http\RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        \Illuminate\Support\Facades\Log::info('Wishlist toggle request', [
            'user_id' => $user->id,
            'product_id' => $product->id,
            'product_name' => $product->name
        ]);

        $isInWishlist = $user->toggleWishlist($product);

        \Illuminate\Support\Facades\Log::info('Wishlist toggle result', ['in_wishlist' => $isInWishlist]);

        return redirect()->back()->with('flash', [
            'type' => 'success',
            'message' => $isInWishlist
                ? 'Produk ditambahkan ke wishlist'
                : 'Produk dihapus dari wishlist',
        ]);
    }

    /**
     * Remove product from wishlist.
     */
    public function destroy(Request $request, Product $product): \Illuminate\Http\RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        $user->wishlists()->where('product_id', $product->id)->delete();

        return redirect()->back()->with('flash', [
            'type' => 'success',
            'message' => 'Produk dihapus dari wishlist',
        ]);
    }

    /**
     * Check if product is in wishlist.
     */
    public function check(Request $request, Product $product): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        return response()->json([
            'is_in_wishlist' => $user->hasProductInWishlist($product),
        ]);
    }
}

