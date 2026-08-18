<?php

declare(strict_types=1);

namespace App\Actions\Cart;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class AddToCartAction
{
    public function execute(Product $product, int $quantity, ?User $user = null, ?string $sessionId = null): CartItem
    {
        return DB::transaction(function () use ($product, $quantity, $user, $sessionId) {
            $cart = $this->getOrCreateCart($user, $sessionId);

            /** @var CartItem|null $existingItem */
            $existingItem = $cart->items()->where('product_id', $product->id)->first();

            if ($existingItem) {
                $existingItem->updateQuantity($existingItem->quantity + $quantity);

                return $existingItem->fresh();
            }

            /** @var CartItem $cartItem */
            $cartItem = $cart->items()->create([
                'product_id' => $product->id,
                'quantity' => $quantity,
                'unit_price' => $product->final_price,
            ]);

            return $cartItem;
        });
    }

    private function getOrCreateCart(?User $user, ?string $sessionId): Cart
    {
        if ($user) {
            return $user->getOrCreateCart();
        }

        /** @var Cart $cart */
        $cart = Cart::firstOrCreate(
            ['session_id' => $sessionId],
            ['session_id' => $sessionId]
        );

        return $cart;
    }
}

