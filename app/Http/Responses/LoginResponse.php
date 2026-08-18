<?php

declare(strict_types=1);

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Symfony\Component\HttpFoundation\Response;

class LoginResponse implements LoginResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     */
    public function toResponse($request): Response
    {
        $user = $request->user();

        // Determine redirect path based on user role
        $redirectPath = $this->getRedirectPath($user);

        return $request->wantsJson()
            ? new JsonResponse(['two_factor' => false, 'redirect' => $redirectPath], 200)
            : redirect()->intended($redirectPath);
    }

    /**
     * Get the redirect path based on user role.
     */
    private function getRedirectPath($user): string
    {
        // Admin roles redirect to admin dashboard
        if ($user->hasAnyRole(['super-admin', 'admin', 'manager', 'staff'])) {
            return '/admin';
        }

        // Customer redirects to user dashboard or shop
        return '/';
    }
}

