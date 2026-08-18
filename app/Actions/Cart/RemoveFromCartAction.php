<?php

declare(strict_types=1);

namespace App\Actions\Cart;

use App\Models\CartItem;

class RemoveFromCartAction
{
    public function execute(CartItem $cartItem): bool
    {
        return (bool) $cartItem->delete();
    }
}

