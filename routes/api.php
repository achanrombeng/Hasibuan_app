<?php

use App\Http\Controllers\Api\MidtransController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/midtrans/notification', [MidtransController::class, 'notification'])->name('api.midtrans.notification');

use App\Http\Controllers\Api\ShippingController;

Route::get('/shipping/provinces', [ShippingController::class, 'provinces']);
Route::get('/shipping/search', [ShippingController::class, 'search']);
Route::post('/shipping/cost', [ShippingController::class, 'cost']);
