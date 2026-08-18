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

class ReportController extends Controller
{
    public function index(): Response
    {
        $period = request('period', 'month');

        // Sales summary
        $salesQuery = Order::where('payment_status', 'paid');

        if ($period === 'week') {
            $salesQuery->where('created_at', '>=', now()->subWeek());
        } elseif ($period === 'month') {
            $salesQuery->where('created_at', '>=', now()->subMonth());
        } elseif ($period === 'year') {
            $salesQuery->where('created_at', '>=', now()->subYear());
        }

        $totalSales = (float) $salesQuery->sum('total');
        $totalOrders = $salesQuery->count();
        $averageOrderValue = $totalOrders > 0 ? $totalSales / $totalOrders : 0;

        // Sales by day (last 30 days)
        $salesByDay = Order::where('payment_status', 'paid')
            ->where('created_at', '>=', now()->subDays(30))
            ->selectRaw('DATE(created_at) as date, SUM(total) as total, COUNT(*) as orders')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn ($item) => [
                'date' => $item->date,
                'total' => (float) $item->total,
                'orders' => $item->orders,
            ]);

        // Top products
        $topProducts = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->where('orders.payment_status', 'paid')
            ->selectRaw('products.id, products.name, SUM(order_items.quantity) as total_sold, SUM(order_items.subtotal) as revenue')
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('total_sold')
            ->limit(10)
            ->get()
            ->map(fn ($item) => [
                'id' => $item->id,
                'name' => $item->name,
                'total_sold' => (int) $item->total_sold,
                'revenue' => 'Rp ' . number_format((float) $item->revenue, 0, ',', '.'),
            ]);

        // Top customers
        $topCustomers = User::role('customer')
            ->withSum(['orders' => fn ($q) => $q->where('payment_status', 'paid')], 'total')
            ->withCount(['orders' => fn ($q) => $q->where('payment_status', 'paid')])
            ->orderByDesc('orders_sum_total')
            ->limit(10)
            ->get()
            ->map(fn ($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'orders_count' => $user->orders_count,
                'total_spent' => 'Rp ' . number_format((float) ($user->orders_sum_total ?? 0), 0, ',', '.'),
            ]);

        // Orders by status
        $ordersByStatus = Order::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->get()
            ->map(fn ($item) => [
                'status' => $item->status->value,
                'label' => $item->status->label(),
                'count' => $item->count,
            ]);

        return Inertia::render('Admin/Reports/Index', [
            'summary' => [
                'totalSales' => 'Rp ' . number_format($totalSales, 0, ',', '.'),
                'totalOrders' => $totalOrders,
                'averageOrderValue' => 'Rp ' . number_format($averageOrderValue, 0, ',', '.'),
                'totalCustomers' => User::role('customer')->count(),
            ],
            'salesByDay' => $salesByDay,
            'topProducts' => $topProducts,
            'topCustomers' => $topCustomers,
            'ordersByStatus' => $ordersByStatus,
            'period' => $period,
        ]);
    }
}

