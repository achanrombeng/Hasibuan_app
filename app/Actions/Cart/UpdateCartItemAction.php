<?php

declare(strict_types=1);

namespace App\Actions\Cart;

use App\Models\CartItem;

class UpdateCartItemAction
{
    public function execute(CartItem $cartItem, int $quantity): CartItem
    {
        $cartItem->updateQuantity($quantity);

        return $cartItem->fresh();
    }
}

