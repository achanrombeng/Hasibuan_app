<?php

declare(strict_types=1);

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Mail\NewsletterWelcomeMail;
use App\Models\Subscriber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;

class NewsletterController extends Controller
{
    public function subscribe(Request $request): JsonResponse|RedirectResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255'],
            'name' => ['nullable', 'string', 'max:255'],
        ], [
            'email.required' => 'Email address is required.',
            'email.email' => 'Please provide a valid email address.',
        ]);

        // Check if email already exists
        $existingSubscriber = Subscriber::where('email', $validated['email'])->first();

        if ($existingSubscriber) {
            if ($existingSubscriber->is_active) {
                if ($request->wantsJson() && ! $request->header('X-Inertia')) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Email ini sudah terdaftar sebagai subscriber.',
                    ], 422);
                }

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

            $message = 'Selamat datang kembali! Anda telah berlangganan kembali.';

            // Send welcome email on reactivation
            try {
                Mail::to($existingSubscriber->email)->send(new NewsletterWelcomeMail($existingSubscriber));
            } catch (\Throwable $e) {
                Log::error('Failed to send newsletter welcome email: ' . $e->getMessage());
            }

            if ($request->wantsJson() && ! $request->header('X-Inertia')) {
                return response()->json([
                    'success' => true,
                    'message' => $message,
                ]);
            }

            return redirect()->back()->with('success', $message);
        }

        // Create new subscriber
        $subscriber = Subscriber::create([
            'email' => $validated['email'],
            'name' => $validated['name'] ?? null,
            'is_active' => true,
            'subscribed_at' => now(),
        ]);

        // Send welcome email to subscriber
        try {
            Mail::to($subscriber->email)->send(new NewsletterWelcomeMail($subscriber));
        } catch (\Throwable $e) {
            Log::error('Failed to send newsletter welcome email: ' . $e->getMessage());
        }

        $message = 'Terima kasih telah berlangganan! Anda akan menerima update terbaru dari kami.';

        if ($request->wantsJson() && ! $request->header('X-Inertia')) {
            return response()->json([
                'success' => true,
                'message' => $message,
            ]);
        }

        return redirect()->back()->with('success', $message);
    }

    public function unsubscribe(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
        ]);

        $subscriber = Subscriber::where('email', $validated['email'])->first();

        if (! $subscriber) {
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
