<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Enums\ProductStatus;
use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Category;
use App\Models\DealerInquiry;
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
        // Get showcase statistics
        $totalProducts = Product::where('status', '!=', ProductStatus::DRAFT)->count();
        $totalCategories = Category::count();
        $activeBanners = PromoBanner::active()->count();
        $totalInquiries = DealerInquiry::count();
        $totalArticles = Article::count();
        $totalReviews = ProductReview::count();
        $totalCustomers = User::role('customer')->count();

        // Recent dealer & trade inquiries
        $recentInquiries = DealerInquiry::latest()
            ->take(6)
            ->get()
            ->map(fn (DealerInquiry $inquiry) => [
                'id' => $inquiry->id,
                'name' => $inquiry->name,
                'email' => $inquiry->email,
                'phone' => $inquiry->phone,
                'message' => $inquiry->message,
                'status' => $inquiry->status ?? 'new',
                'created_at' => $inquiry->created_at ? $inquiry->created_at->diffForHumans() : '-',
            ]);

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalProducts' => $totalProducts,
                'totalCategories' => $totalCategories,
                'activeBanners' => $activeBanners,
                'totalInquiries' => $totalInquiries,
                'totalArticles' => $totalArticles,
                'totalReviews' => $totalReviews,
                'totalCustomers' => $totalCustomers,
            ],
            'recentInquiries' => $recentInquiries,
        ]);
    }
}
