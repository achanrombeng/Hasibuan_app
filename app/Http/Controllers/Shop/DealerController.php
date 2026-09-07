<?php

declare(strict_types=1);

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDealerInquiryRequest;
use App\Mail\DealerInquiryReceived;
use App\Models\DealerInquiry;
use App\Models\Setting;
use App\Models\User;
use App\Notifications\NewDealerInquiryNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class DealerController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Shop/Dealer');
    }

    public function store(StoreDealerInquiryRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $validated['ip_address'] = $request->ip();

        $contact = $validated['contact'] ?? '';
        unset($validated['contact']);

        if (empty($validated['email']) && empty($validated['phone'])) {
            if (filter_var($contact, FILTER_VALIDATE_EMAIL)) {
                $validated['email'] = $contact;
            } else {
                $validated['phone'] = $contact;
            }
        }

        $inquiry = DealerInquiry::create($validated);

        // Notify Admins
        try {
            $admins = User::role('admin')->get();
            foreach ($admins as $admin) {
                $admin->notify(new NewDealerInquiryNotification($inquiry));
            }
        } catch (\Throwable $e) {
            Log::error('Failed to notify admins of new dealer inquiry: '.$e->getMessage());
        }

        // Send Email Notification to Admin if recipient is configured
        try {
            $adminEmail = env('DEALER_NOTIFICATION_EMAIL') ?: config('mail.from.address') ?: Setting::get('contact_email');
            if ($adminEmail) {
                Mail::to($adminEmail)->send(new DealerInquiryReceived($inquiry));
            }
        } catch (\Throwable $e) {
            Log::error('Failed to send dealer inquiry notification email: '.$e->getMessage());
        }

        return redirect()->back()->with('success', 'Your dealer partnership inquiry has been submitted successfully.');
    }
}
