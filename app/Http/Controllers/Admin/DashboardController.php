<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Enums\ProductStatus;
use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Category;
use App\Models\DealerInquiry;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductReview;
use App\Models\PromoBanner;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        // Get statistics
        $totalProducts = Product::where('status', '!=', ProductStatus::DRAFT)->count();
        $totalCategories = Category::count();
        $activeBanners = PromoBanner::active()->count();
        $totalInquiries = DealerInquiry::count();
        $totalArticles = Article::count();
        $totalReviews = ProductReview::count();
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
            ->through(fn (Order $order) => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'customer' => $order->user?->name ?? $order->shipping_name,
                'total' => $order->formatted_total,
                'status' => $order->status->value,
                'created_at' => $order->created_at->diffForHumans(),
            ]);

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalProducts' => $totalProducts,
                'totalCategories' => $totalCategories,
                'activeBanners' => $activeBanners,
                'totalInquiries' => $totalInquiries,
                'totalArticles' => $totalArticles,
                'totalReviews' => $totalReviews,
                'totalOrders' => $totalOrders,
                'totalCustomers' => $totalCustomers,
                'totalRevenue' => (float) $totalRevenue,
                'ordersGrowth' => $ordersGrowth,
                'revenueGrowth' => $revenueGrowth,
            ],
            'recentOrders' => $recentOrders,
        ]);
    }
}
