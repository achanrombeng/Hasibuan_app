<?php

declare(strict_types=1);

namespace App\Actions\Cart;

use App\Models\Cart;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class MergeCartsAction
{
    /**
     * Merge guest cart into user cart after login.
     */
    public function execute(User $user, string $sessionId): Cart
    {
        return DB::transaction(function () use ($user, $sessionId) {
            $userCart = $user->getOrCreateCart();

            /** @var Cart|null $guestCart */
            $guestCart = Cart::where('session_id', $sessionId)
                ->whereNull('user_id')
                ->first();

            if ($guestCart && $guestCart->items->isNotEmpty()) {
                $userCart->mergeWith($guestCart);
                $guestCart->delete();
            }

            return $userCart->fresh()->load('items.product');
        });
    }
}

