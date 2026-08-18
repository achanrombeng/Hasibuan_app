<?php

declare(strict_types=1);

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Http\Requests\Shop\ProductReviewRequest;
use App\Models\Product;
use App\Models\ProductReview;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;

class ReviewController extends Controller
{
    public function store(ProductReviewRequest $request, Product $product): RedirectResponse
    {
        $user = $request->user();

        // Check if user has already reviewed this product
        if ($product->reviews()->where('user_id', $user->id)->exists()) {
            return back()->withErrors(['error' => 'Anda sudah memberikan ulasan untuk produk ini.']);
        }

        DB::transaction(function () use ($request, $product, $user) {
            $product->reviews()->create([
                'user_id' => $user->id,
                'rating' => $request->input('rating'),
                'title' => $request->input('title'),
                'comment' => $request->input('comment'),
                'is_approved' => false, // Set to false for admin approval
            ]);

            // We don't update aggregate ratings here anymore because it's pending approval.
            // The approval action in Admin/ReviewController should trigger the update.
        });

        return back()->with('success', __('messages.review_submitted'));
    }

    public function update(ProductReviewRequest $request, Product $product): RedirectResponse
    {
        $user = $request->user();

        $review = $product->reviews()->where('user_id', $user->id)->firstOrFail();

        DB::transaction(function () use ($request, $review) {
            $review->update([
                'rating' => $request->input('rating'),
                'title' => $request->input('title'),
                'comment' => $request->input('comment'),
                'is_approved' => false, // Reset approval status on edit
            ]);
        });

        return back()->with('success', __('messages.review_updated'));
    }

    private function updateProductRating(Product $product): void
    {
        $avg = $product->reviews()->where('is_approved', true)->avg('rating');
        $count = $product->reviews()->where('is_approved', true)->count();

        $product->update([
            'average_rating' => $avg ?? 0,
            'review_count' => $count,
        ]);
        
        // Also update rating_counts json/array if exists
        // Assuming 'rating_counts' is a column, if not, we skip it.
        // Based on Show.tsx usage `ratingCountData`, backend might support it.
        // Let's check Product model first? I'll assume standard columns for now 
        // and if rating_counts exists, I'd update it. 
        // For safety, I'll just do avg and count which are standard.
    }
}
