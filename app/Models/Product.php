<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\ProductStatus;
use App\Enums\SaleType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Translatable\HasTranslations;

/**
 * Product Model
 *
 * Model untuk produk furniture.
 *
 * @property int $id
 * @property int $category_id
 * @property string $sku
 * @property string $name
 * @property string $slug
 * @property string|null $short_description
 * @property string|null $description
 * @property int $price
 * @property int|null $compare_price
 * @property int|null $cost_price
 * @property int $stock_quantity
 * @property int $low_stock_threshold
 * @property bool $track_stock
 * @property bool $allow_backorder
 * @property float|null $weight
 * @property float|null $length
 * @property float|null $width
 * @property float|null $height
 * @property string|null $material
 * @property string|null $color
 * @property array|null $specifications
 * @property ProductStatus $status
 * @property SaleType $sale_type
 * @property bool $is_featured
 * @property bool $is_new_arrival
 * @property int|null $discount_percentage
 * @property \Illuminate\Support\Carbon|null $discount_starts_at
 * @property \Illuminate\Support\Carbon|null $discount_ends_at
 * @property string|null $meta_title
 * @property string|null $meta_description
 * @property string|null $meta_keywords
 * @property string|null $shipping_class
 * @property bool $is_pre_order
 * @property int $view_count
 * @property int $sold_count
 * @property float $average_rating
 * @property int $review_count
 */
class Product extends Model implements HasMedia
{
    use HasFactory;
    use HasTranslations;
    use InteractsWithMedia;
    use SoftDeletes;

    public array $translatable = [
        'name',
        'short_description',
        'description',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'material',
        'color',
    ];

    protected static function booted(): void
    {
        static::creating(function (Product $product) {
            if (empty($product->slug)) {
                $product->slug = static::generateUniqueSlug($product->name);
            }
        });

        static::updating(function (Product $product) {
            if ($product->isDirty('name') && ! $product->isDirty('slug')) {
                $product->slug = static::generateUniqueSlug($product->name, $product->id);
            }
        });
    }

    /**
     * Generate unique slug for product.
     */
    protected static function generateUniqueSlug(string $name, ?int $excludeId = null): string
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $counter = 1;

        $query = static::withTrashed()->where('slug', $slug);
        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        while ($query->exists()) {
            $slug = $originalSlug.'-'.$counter;
            $counter++;
            $query = static::withTrashed()->where('slug', $slug);
            if ($excludeId) {
                $query->where('id', '!=', $excludeId);
            }
        }

        return $slug;
    }

    protected $fillable = [
        'category_id',
        'sku',
        'name',
        'slug',
        'short_description',
        'description',
        'price',
        'compare_price',
        'cost_price',
        'stock_quantity',
        'low_stock_threshold',
        'track_stock',
        'allow_backorder',
        'is_pre_order',
        'weight',
        'length',
        'width',
        'height',
        'shipping_class',
        'material',
        'color',
        'specifications',
        'status',
        'sale_type',
        'is_featured',
        'is_new_arrival',
        'discount_percentage',
        'discount_starts_at',
        'discount_ends_at',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'view_count',
        'sold_count',
        'average_rating',
        'review_count',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'integer',
            'compare_price' => 'integer',
            'cost_price' => 'integer',
            'stock_quantity' => 'integer',
            'low_stock_threshold' => 'integer',
            'track_stock' => 'boolean',
            'allow_backorder' => 'boolean',
            'is_pre_order' => 'boolean',
            'weight' => 'decimal:2',
            'length' => 'decimal:2',
            'width' => 'decimal:2',
            'height' => 'decimal:2',
            'specifications' => 'array',
            'status' => ProductStatus::class,
            'sale_type' => SaleType::class,
            'is_featured' => 'boolean',
            'is_new_arrival' => 'boolean',
            'discount_percentage' => 'integer',
            'discount_starts_at' => 'datetime',
            'discount_ends_at' => 'datetime',
            'view_count' => 'integer',
            'sold_count' => 'integer',
            'average_rating' => 'decimal:2',
            'review_count' => 'integer',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(ProductReview::class);
    }

    public function approvedReviews(): HasMany
    {
        return $this->reviews()->where('is_approved', true);
    }

    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function wishlists(): HasMany
    {
        return $this->hasMany(Wishlist::class);
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('images');
        $this->addMediaCollection('thumbnail')->singleFile();
    }

    // ==================== Scopes ====================

    public function scopeActive($query)
    {
        return $query->where('status', ProductStatus::ACTIVE);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeNewArrivals($query)
    {
        return $query->where('is_new_arrival', true);
    }

    public function scopeOnSale($query)
    {
        return $query->whereNotNull('discount_percentage')
            ->where('discount_percentage', '>', 0)
            ->where(function ($q) {
                $q->whereNull('discount_starts_at')
                    ->orWhere('discount_starts_at', '<=', now());
            })
            ->where(function ($q) {
                $q->whereNull('discount_ends_at')
                    ->orWhere('discount_ends_at', '>=', now());
            });
    }

    public function scopeBySaleType($query, SaleType $saleType)
    {
        return $query->where('sale_type', $saleType);
    }

    public function scopeInStock($query)
    {
        return $query->where(function ($q) {
            $q->where('track_stock', false)
                ->orWhere('stock_quantity', '>', 0)
                ->orWhere('allow_backorder', true);
        });
    }

    /**
     * @param  \Illuminate\Database\Eloquent\Builder<Product>  $query
     * @return \Illuminate\Database\Eloquent\Builder<Product>
     */
    public function scopePriceMin($query, int $minPrice)
    {
        return $query->where('price', '>=', $minPrice);
    }

    /**
     * @param  \Illuminate\Database\Eloquent\Builder<Product>  $query
     * @return \Illuminate\Database\Eloquent\Builder<Product>
     */
    public function scopePriceMax($query, int $maxPrice)
    {
        return $query->where('price', '<=', $maxPrice);
    }

    public function scopeStock($query, $status)
    {
        if ($status === 'low') {
            return $query->where('track_stock', true)
                ->whereColumn('stock_quantity', '<=', 'low_stock_threshold');
        }

        return $query;
    }

    // ==================== Accessors ====================

    public function getFinalPriceAttribute(): int
    {
        if (! $this->hasActiveDiscount()) {
            return $this->price;
        }

        return (int) round($this->price * (1 - $this->discount_percentage / 100));
    }

    public function getSavingsAttribute(): int
    {
        return $this->price - $this->final_price;
    }

    public function getFormattedPriceAttribute(): string
    {
        return format_rupiah($this->price);
    }

    public function getFormattedComparePriceAttribute(): ?string
    {
        return $this->compare_price ? format_rupiah($this->compare_price) : null;
    }

    public function getFormattedFinalPriceAttribute(): string
    {
        return format_rupiah($this->final_price);
    }

    public function getPrimaryImageAttribute(): ?ProductImage
    {
        /** @var \Illuminate\Database\Eloquent\Collection<int, ProductImage> $images */
        $images = $this->images;

        /** @var ProductImage|null $primary */
        $primary = $images->firstWhere('is_primary', true) ?? $images->first();

        return $primary;
    }

    /**
     * Get product dimensions as array.
     *
     * @return array<string, float|null>
     */
    public function getDimensionsAttribute(): array
    {
        return [
            'length' => $this->length,
            'width' => $this->width,
            'height' => $this->height,
        ];
    }

    // ==================== Helper Methods ====================

    public function hasActiveDiscount(): bool
    {
        if (! $this->discount_percentage || $this->discount_percentage <= 0) {
            return false;
        }

        $now = now();

        if ($this->discount_starts_at && $this->discount_starts_at > $now) {
            return false;
        }

        if ($this->discount_ends_at && $this->discount_ends_at < $now) {
            return false;
        }

        return $this->sale_type->hasDiscount();
    }

    public function isInStock(): bool
    {
        if (! $this->track_stock) {
            return true;
        }

        if ($this->stock_quantity > 0) {
            return true;
        }

        return $this->allow_backorder;
    }

    public function isLowStock(): bool
    {
        return $this->track_stock && $this->stock_quantity <= $this->low_stock_threshold;
    }

    public function isSellable(): bool
    {
        return $this->status->isSellable() && $this->isInStock();
    }

    public function incrementViewCount(): void
    {
        $this->increment('view_count');
    }

    public function updateRatingStats(): void
    {
        $stats = $this->approvedReviews()
            ->selectRaw('AVG(rating) as avg_rating, COUNT(*) as count')
            ->first();

        $this->update([
            'average_rating' => $stats->avg_rating ?? 0,
            'review_count' => $stats->count ?? 0,
        ]);
    }

    // ==================== Stock Management ====================

    /**
     * Reduce stock quantity.
     */
    public function reduceStock(int $quantity): void
    {
        if ($this->track_stock && $this->stock_quantity >= $quantity) {
            $this->decrement('stock_quantity', $quantity);
        }
    }

    /**
     * Add stock quantity.
     */
    public function addStock(int $quantity): void
    {
        if ($this->track_stock) {
            $this->increment('stock_quantity', $quantity);
        }
    }

    /**
     * Increment sold count when order is paid.
     */
    public function incrementSoldCount(int $quantity): void
    {
        $this->increment('sold_count', $quantity);
    }

    /**
     * Decrement sold count when order is cancelled (after payment).
     */
    public function decrementSoldCount(int $quantity): void
    {
        if ($this->sold_count >= $quantity) {
            $this->decrement('sold_count', $quantity);
        }
    }
}
