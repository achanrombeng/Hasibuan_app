<?php

declare(strict_types=1);

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Order statistics
        $totalOrders = Order::where('user_id', $user->id)->count();
        $pendingOrders = Order::where('user_id', $user->id)
            ->whereIn('status', ['pending', 'confirmed', 'processing'])
            ->count();
        $completedOrders = Order::where('user_id', $user->id)
            ->where('status', 'delivered')
            ->count();
        $totalSpent = Order::where('user_id', $user->id)
            ->where('payment_status', 'paid')
            ->sum('total');

        // Recent orders
        $recentOrders = Order::where('user_id', $user->id)
            ->latest()
            ->take(5)
            ->get()
            ->map(fn (Order $order) => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'total' => 'Rp ' . number_format($order->total, 0, ',', '.'),
                'status' => [
                    'value' => $order->status->value,
                    'label' => $order->status->label(),
                    'color' => $order->status->color(),
                ],
                'created_at' => $order->created_at->format('d M Y'),
            ]);

        // Wishlist count
        $wishlistCount = Wishlist::where('user_id', $user->id)->count();

        return Inertia::render('Customer/Dashboard', [
            'stats' => [
                'totalOrders' => $totalOrders,
                'pendingOrders' => $pendingOrders,
                'completedOrders' => $completedOrders,
                'totalSpent' => 'Rp ' . number_format($totalSpent, 0, ',', '.'),
                'wishlistCount' => $wishlistCount,
            ],
            'recentOrders' => $recentOrders,
        ]);
    }
}

