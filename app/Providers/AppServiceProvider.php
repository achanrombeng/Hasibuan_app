<?php

namespace App\Providers;

use App\Http\Responses\LoginResponse;
use App\Listeners\MergeCartAfterLogin;
use App\Listeners\StoreGuestSessionBeforeLogin;
use Illuminate\Auth\Events\Attempting;
use Illuminate\Auth\Events\Login;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Override Fortify's login response to redirect based on user role
        $this->app->singleton(LoginResponseContract::class, LoginResponse::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Store guest session ID before login attempt (for cart merge)
        Event::listen(Attempting::class, StoreGuestSessionBeforeLogin::class);

        // Merge guest cart after successful login
        Event::listen(Login::class, MergeCartAfterLogin::class);
    }
}
