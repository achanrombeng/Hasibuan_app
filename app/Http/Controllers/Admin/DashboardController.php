<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        // Get statistics
        $totalProducts = Product::count();
        $totalOrders = Order::count();
        $totalCustomers = User::role('customer')->count();
        $totalRevenue = Order::where('payment_status', 'paid')->sum('total');

        // Calculate growth (comparing this month vs last month)
        $thisMonthOrders = Order::whereMonth('created_at', now()->month)->count();
        $lastMonthOrders = Order::whereMonth('created_at', now()->subMonth()->month)->count();
        $ordersGrowth = $lastMonthOrders > 0
            ? round((($thisMonthOrders - $lastMonthOrders) / $lastMonthOrders) * 100, 1)
            : 0;

        $thisMonthRevenue = Order::where('payment_status', 'paid')
            ->whereMonth('created_at', now()->month)
            ->sum('total');
        $lastMonthRevenue = Order::where('payment_status', 'paid')
            ->whereMonth('created_at', now()->subMonth()->month)
            ->sum('total');
        $revenueGrowth = $lastMonthRevenue > 0
            ? round((($thisMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100, 1)
            : 0;

        // Recent orders
        $recentOrders = Order::with('user')
            ->latest()
            ->paginate(5, ['*'], 'orders_page')
            ->through(fn(Order $order) => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'customer' => $order->user?->name ?? $order->shipping_name,
                'total' => $order->formatted_total,
                'status' => $order->status->value,
                'created_at' => $order->created_at->diffForHumans(),
            ]);

        // Low stock products
        $lowStockProducts = Product::where('track_stock', true)
            ->whereColumn('stock_quantity', '<=', 'low_stock_threshold')
            ->orderBy('stock_quantity')
            ->paginate(5, ['*'], 'products_page')
            ->through(fn(Product $product) => [
                'id' => $product->id,
                'name' => $product->name,
                'stock' => $product->stock_quantity,
                'sku' => $product->sku,
            ]);

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalProducts' => $totalProducts,
                'totalOrders' => $totalOrders,
                'totalCustomers' => $totalCustomers,
                'totalRevenue' => (float) $totalRevenue,
                'ordersGrowth' => $ordersGrowth,
                'revenueGrowth' => $revenueGrowth,
            ],
            'recentOrders' => $recentOrders,
            'lowStockProducts' => $lowStockProducts,
        ]);
    }
}

