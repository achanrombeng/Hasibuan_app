<?php

namespace App\Http\Middleware;

use App\Models\Cart;
use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class ShareCartData
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $cart = null;

        if (auth()->check()) {
            $cart = Cart::with(['items.product.images', 'items.product.category'])
                ->where('user_id', auth()->id())
                ->first();
        } else {
            $sessionId = session()->getId();
            $cart = Cart::with(['items.product.images', 'items.product.category'])
                ->where('session_id', $sessionId)
                ->whereNull('user_id')
                ->first();
        }

        Inertia::share('cart', $cart ? [
            'id' => $cart->id,
            'items_count' => $cart->items->sum('quantity'),
            'items' => $cart->items->map(function ($item) {
                // Use final_price which already includes discount calculation
                $price = $item->product->final_price;
                
                // Get primary image from loaded images relation
                $primaryImage = $item->product->images->firstWhere('is_primary', true) 
                    ?? $item->product->images->first();
                
                return [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $price,
                    'subtotal' => $price * $item->quantity,
                    'product' => $item->product ? [
                        'id' => $item->product->id,
                        'name' => $item->product->name,
                        'slug' => $item->product->slug,
                        'price' => $item->product->price,
                        'final_price' => $item->product->final_price,
                        'has_discount' => $item->product->hasActiveDiscount(),
                        'discount_percentage' => $item->product->discount_percentage,
                        'primary_image' => $primaryImage ? [
                            'image_url' => asset('storage/' . $primaryImage->image_path),
                        ] : null,
                        'category' => $item->product->category ? [
                            'name' => $item->product->category->name,
                        ] : null,
                    ] : null,
                ];
            }),
            'subtotal' => $cart->items->sum(function ($item) {
                return $item->product->final_price * $item->quantity;
            }),
        ] : [
            'id' => null,
            'items_count' => 0,
            'items' => [],
            'subtotal' => 0,
        ]);

        return $next($request);
    }
}
