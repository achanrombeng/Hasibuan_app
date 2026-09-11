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
            'specifications' => $this->normalizeSpecifications($this->specifications),
            'low_stock_threshold' => $this->low_stock_threshold,
            'track_stock' => $this->track_stock,
            'allow_backorder' => $this->allow_backorder,
            'is_pre_order' => $this->is_pre_order,
            'is_in_stock' => $this->isInStock(),
            'is_low_stock' => $this->isLowStock(),
            'is_new_arrival' => $this->is_new_arrival,
            'weight' => $this->weight,
            'length' => $this->length,
            'width' => $this->width,
            'height' => $this->height,
            'dimensions' => $this->dimensions,
            'shipping_class' => $this->shipping_class,
            'status' => [
                'value' => $this->status->value,
                'label' => $this->status->label(),
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
            'images' => ($this->relationLoaded('images') || $this->relationLoaded('linkedProducts'))
                ? ProductImageResource::collection($this->effective_images)->resolve()
                : [],
            'images_count' => ($this->relationLoaded('images') || $this->relationLoaded('linkedProducts'))
                ? $this->effective_images->count()
                : ($this->images_count ?? $this->images()->count()),
            'primary_image' => ($this->relationLoaded('images') || $this->relationLoaded('linkedProducts')) && $this->primary_image
                ? (new ProductImageResource($this->primary_image))->resolve()
                : null,
            'reviews' => $this->relationLoaded('reviews')
                ? ProductReviewResource::collection($this->reviews)->resolve()
                : [],
            'linked_products' => $this->relationLoaded('linkedProducts')
                ? ProductResource::collection($this->linkedProducts)->resolve()
                : [],
            'linked_product_ids' => $this->relationLoaded('linkedProducts')
                ? $this->linkedProducts->pluck('id')->toArray()
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

    /**
     * Normalize specifications attribute to a key-value associative array.
     *
     * @param  mixed  $specs
     * @return array<string, string>|null
     */
    protected function normalizeSpecifications(mixed $specs): ?array
    {
        if (empty($specs) || ! is_array($specs)) {
            return null;
        }

        $result = [];
        foreach ($specs as $key => $val) {
            if (is_array($val) && isset($val['key'], $val['value'])) {
                $k = trim((string) $val['key']);
                $v = trim((string) $val['value']);
                if ($k !== '' && $v !== '') {
                    $result[$k] = $v;
                }
            } elseif (is_string($key) && (is_string($val) || is_numeric($val))) {
                $k = trim($key);
                $v = trim((string) $val);
                if ($k !== '' && $v !== '') {
                    $result[$k] = $v;
                }
            }
        }

        return $result !== [] ? $result : null;
    }
}
