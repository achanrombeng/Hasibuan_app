<?php

declare(strict_types=1);

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Subscriber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class NewsletterController extends Controller
{
    public function subscribe(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255'],
            'name' => ['nullable', 'string', 'max:255'],
        ]);

        // Check if email already exists
        $existingSubscriber = Subscriber::where('email', $validated['email'])->first();

        if ($existingSubscriber) {
            if ($existingSubscriber->is_active) {
                throw ValidationException::withMessages([
                    'email' => ['Email ini sudah terdaftar sebagai subscriber.'],
                ]);
            }

            // Reactivate subscriber
            $existingSubscriber->update([
                'is_active' => true,
                'subscribed_at' => now(),
                'unsubscribed_at' => null,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Selamat datang kembali! Anda telah berlangganan kembali.',
            ]);
        }

        // Create new subscriber
        Subscriber::create([
            'email' => $validated['email'],
            'name' => $validated['name'] ?? null,
            'is_active' => true,
            'subscribed_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Terima kasih telah berlangganan! Anda akan menerima update terbaru dari kami.',
        ]);
    }

    public function unsubscribe(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
        ]);

        $subscriber = Subscriber::where('email', $validated['email'])->first();

        if (!$subscriber) {
            return response()->json([
                'success' => false,
                'message' => 'Email tidak ditemukan.',
            ], 404);
        }

        $subscriber->unsubscribe();

        return response()->json([
            'success' => true,
            'message' => 'Anda telah berhenti berlangganan.',
        ]);
    }
}
