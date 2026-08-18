<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProductReview;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\QueryBuilder\QueryBuilder;

class ReviewController extends Controller
{
    public function index(): Response
    {
        $paginator = QueryBuilder::for(ProductReview::class)
            ->allowedFilters(['rating', 'is_approved'])
            ->allowedSorts(['rating', 'created_at'])
            ->defaultSort('-created_at')
            ->with(['user', 'product.images'])
            ->paginate(15);

        $reviews = collect($paginator->items())->map(fn(ProductReview $review) => [
            'id' => $review->id,
            'user' => $review->user ? [
                'id' => $review->user->id,
                'name' => $review->user->name,
            ] : null,
            'product' => $review->product ? [
                'id' => $review->product->id,
                'name' => $review->product->name,
                'image' => $review->product->primaryImage?->image_url,
            ] : null,
            'rating' => $review->rating,
            'title' => $review->title,
            'comment' => $review->comment,
            'is_approved' => $review->is_approved,
            'created_at' => $review->created_at->format('d M Y'),
        ]);

        return Inertia::render('Admin/Reviews/Index', [
            'reviews' => Inertia::merge($reviews),
            'next_page_url' => $paginator->nextPageUrl(),
            'filters' => request()->only(['filter', 'sort']),
        ]);
    }

    public function approve(ProductReview $review): RedirectResponse
    {
        $review->approve();

        return back()->with('success', __('messages.review_approved'));
    }

    public function reject(ProductReview $review): RedirectResponse
    {
        $review->update(['is_approved' => false]);

        return back()->with('success', __('messages.review_rejected'));
    }

    public function destroy(ProductReview $review): RedirectResponse
    {
        $review->forceDelete();

        return back()->with('success', __('messages.review_deleted'));
    }
}

