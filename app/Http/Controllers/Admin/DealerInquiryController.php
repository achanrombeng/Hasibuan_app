<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DealerInquiry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DealerInquiryController extends Controller
{
    public function index(Request $request): Response
    {
        $query = DealerInquiry::query();

        if ($request->filled('search')) {
            $search = mb_strtolower((string) $request->input('search'));
            $like = "%{$search}%";
            $query->where(function ($q) use ($like) {
                $q->whereRaw('LOWER(name) LIKE ?', [$like])
                    ->orWhereRaw('LOWER(email) LIKE ?', [$like])
                    ->orWhereRaw('LOWER(phone) LIKE ?', [$like])
                    ->orWhereRaw('LOWER(message) LIKE ?', [$like]);
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $inquiries = $query->latest()->paginate(15)->withQueryString();

        $stats = [
            'total' => DealerInquiry::count(),
            'new' => DealerInquiry::where('status', 'new')->count(),
            'contacted' => DealerInquiry::where('status', 'contacted')->count(),
            'resolved' => DealerInquiry::where('status', 'resolved')->count(),
        ];

        return Inertia::render('Admin/DealerInquiries/Index', [
            'inquiries' => $inquiries,
            'filters' => $request->only(['search', 'status']),
            'stats' => $stats,
        ]);
    }

    public function update(Request $request, DealerInquiry $dealerInquiry): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:new,contacted,resolved,archived'],
            'notes' => ['nullable', 'string', 'max:5000'],
        ]);

        $dealerInquiry->update($validated);

        return redirect()->back()->with('success', 'Inquiry status updated successfully.');
    }

    public function destroy(DealerInquiry $dealerInquiry): RedirectResponse
    {
        $dealerInquiry->delete();

        return redirect()->back()->with('success', 'Inquiry deleted successfully.');
    }
}
