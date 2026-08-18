<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Actions\Cart\MergeCartsAction;
use Illuminate\Auth\Events\Login;

class MergeCartAfterLogin
{
    /**
     * Handle the event.
     */
    public function handle(Login $event): void
    {
        // Get the old session ID that was stored before authentication
        $oldSessionId = session()->pull('guest_cart_session_id');

        if ($oldSessionId) {
            // Merge guest cart to user cart
            $action = new MergeCartsAction();
            $action->execute($event->user, $oldSessionId);
        }
    }
}
