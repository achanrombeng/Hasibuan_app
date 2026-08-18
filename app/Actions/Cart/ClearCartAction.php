<?php

declare(strict_types=1);

namespace App\Actions\Cart;

use App\Models\Cart;

class ClearCartAction
{
    public function execute(Cart $cart): bool
    {
        return (bool) $cart->items()->delete();
    }
}

