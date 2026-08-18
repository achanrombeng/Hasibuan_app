<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Product
 */
class ProductResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'category_id' => $this->category_id,
            'sku' => $this->sku,
            'name' => $this->getTranslation('name', app()->getLocale(), true),
            'slug' => $this->slug,
            'short_description' => $this->getTranslation('short_description', app()->getLocale(), true),
            'description' => $this->getTranslation('description', app()->getLocale(), true),
            'specifications' => $this->specifications,
            'price' => $this->price,
            'price_formatted' => $this->formatted_price,
            'compare_price' => $this->compare_price,
            'compare_price_formatted' => $this->compare_price ? format_rupiah($this->compare_price) : null,
            'cost_price' => $this->cost_price,
            'cost_price_formatted' => $this->cost_price ? format_rupiah($this->cost_price) : null,
            'discount_percentage' => $this->discount_percentage,
            'discount_starts_at' => $this->discount_starts_at?->toISOString(),
            'discount_ends_at' => $this->discount_ends_at?->toISOString(),
            'final_price' => $this->final_price,
            'final_price_formatted' => $this->formatted_final_price,
            'has_discount' => $this->hasActiveDiscount(),
            'stock_quantity' => $this->stock_quantity,
            'low_stock_threshold' => $this->low_stock_threshold,
            'track_stock' => $this->track_stock,
            'allow_backorder' => $this->allow_backorder,
            'is_pre_order' => $this->is_pre_order,
            'is_in_stock' => $this->isInStock(),
            'is_low_stock' => $this->isLowStock(),
            'is_new_arrival' => $this->is_new_arrival,
            'weight' => $this->weight,
            'dimensions' => $this->dimensions,
            'shipping_class' => $this->shipping_class,
            'status' => [
                'value' => $this->status->value,
                'label' => $this->status->label(),
            ],
            'sale_type' => [
                'value' => $this->sale_type->value,
                'label' => $this->sale_type->label(),
            ],
            'is_featured' => $this->is_featured,
            'average_rating' => $this->average_rating,
            'review_count' => $this->review_count,
            'view_count' => $this->view_count,
            'sold_count' => $this->sold_count,
            'material' => $this->material ? $this->getTranslation('material', app()->getLocale(), true) : null,
            'color' => $this->color ? $this->getTranslation('color', app()->getLocale(), true) : null,
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
            'meta_keywords' => $this->meta_keywords,
            'category' => $this->relationLoaded('category') && $this->category
                ? (new CategoryResource($this->category))->resolve()
                : null,
            'images' => $this->relationLoaded('images')
                ? ProductImageResource::collection($this->images)->resolve()
                : [],
            'primary_image' => $this->relationLoaded('images') && $this->primary_image
                ? (new ProductImageResource($this->primary_image))->resolve()
                : null,
            'reviews' => $this->relationLoaded('reviews')
                ? ProductReviewResource::collection($this->reviews)->resolve()
                : [],
            'is_wishlisted' => $request->user()?->hasProductInWishlist($this->resource) ?? false,
            'rating_counts' => $this->reviews()
                ->where('is_approved', true) // Filter ulasan yang disetujui
                ->toBase()
                ->selectRaw('rating as star, count(*) as count')
                ->groupBy('star')
                ->get()
                ->map(fn ($item) => [
                    'star' => (int) $item->star,
                    'count' => (int) $item->count,
                ])
                ->values() // Ensure it's a list, not keyed object
                ->toArray(),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
