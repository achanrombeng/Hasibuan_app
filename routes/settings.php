<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\TwoFactorAuthenticationController;
use App\Http\Controllers\Shop\AddressController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::redirect('settings', '/settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('user-password.edit');

    Route::put('settings/password', [PasswordController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('user-password.update');

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance.edit');

    Route::get('settings/two-factor', [TwoFactorAuthenticationController::class, 'show'])
        ->name('two-factor.show');

    // Address management
    Route::get('settings/addresses', function () {
        $addresses = auth()->user()->addresses()->orderByDesc('is_default')->get();
        return Inertia::render('settings/addresses', [
            'addresses' => $addresses->map(function ($addr) {
                return [
                    'id' => $addr->id,
                    'label' => $addr->label,
                    'recipient_name' => $addr->recipient_name,
                    'phone' => $addr->phone,
                    'address' => $addr->address,
                    'city' => $addr->city,
                    'province' => $addr->province,
                    'postal_code' => $addr->postal_code,
                    'is_default' => $addr->is_default,
                    'full_address' => "{$addr->address}, {$addr->city}, {$addr->province} {$addr->postal_code}",
                ];
            }),
        ]);
    })->name('settings.addresses.index');
    Route::post('settings/addresses', [AddressController::class, 'store'])->name('settings.addresses.store');
    Route::put('settings/addresses/{address}', [AddressController::class, 'update'])->name('settings.addresses.update');
    Route::delete('settings/addresses/{address}', [AddressController::class, 'destroy'])->name('settings.addresses.destroy');
    Route::post('settings/addresses/{address}/set-default', [AddressController::class, 'setDefault'])->name('settings.addresses.set-default');
});

