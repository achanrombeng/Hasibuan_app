<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\QueryBuilder\QueryBuilder;

class CustomerController extends Controller
{
    public function index(Request $request): Response
    {
        $customers = QueryBuilder::for(User::class)
            ->role('customer')
            ->allowedFilters(['name', 'email'])
            ->allowedSorts(['name', 'email', 'created_at'])
            ->defaultSort('-created_at')
            ->withCount('orders')
            ->with(['orders' => fn($q) => $q->latest()->take(1)])
            ->paginate($request->input('per_page', 15))
            ->onEachSide(1)
            ->withQueryString()
            ->through(fn(User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'orders_count' => $user->orders_count,
                'last_order' => $user->orders->first()?->created_at?->format('d M Y'),
                'total_spent' => 'Rp ' . number_format($user->orders->sum('total'), 0, ',', '.'),
                'created_at' => $user->created_at->format('d M Y'),
            ]);

        return Inertia::render('Admin/Customers/Index', [
            'customers' => $customers,
            'filters' => request()->only(['filter', 'sort']),
        ]);
    }

    public function show(User $customer): Response
    {
        $customer->load(['orders' => fn($q) => $q->latest()->take(10)]);

        return Inertia::render('Admin/Customers/Show', [
            'customer' => [
                'id' => $customer->id,
                'name' => $customer->name,
                'email' => $customer->email,
                'phone' => $customer->phone,
                'address' => $customer->address,
                'city' => $customer->city,
                'province' => $customer->province,
                'postal_code' => $customer->postal_code,
                'orders_count' => $customer->orders()->count(),
                'total_spent' => 'Rp ' . number_format((float) $customer->orders()->sum('total'), 0, ',', '.'),
                'created_at' => $customer->created_at->format('d M Y'),
                'orders' => $customer->orders->map(fn($order) => [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'total_formatted' => $order->formatted_total,
                    'status' => [
                        'value' => $order->status->value,
                        'label' => $order->status->label(),
                    ],
                    'created_at' => $order->created_at->format('d M Y'),
                ]),
            ],
        ]);
    }
}

