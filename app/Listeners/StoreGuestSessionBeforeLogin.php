<?php

declare(strict_types=1);

namespace App\Listeners;

use Illuminate\Auth\Events\Attempting;

class StoreGuestSessionBeforeLogin
{
    /**
     * Handle the event.
     * Store the current session ID before login so we can merge guest cart later.
     */
    public function handle(Attempting $event): void
    {
        // Only store if not already authenticated and not already stored
        if (!auth()->check() && !session()->has('guest_cart_session_id')) {
            session()->put('guest_cart_session_id', session()->getId());
        }
    }
}
