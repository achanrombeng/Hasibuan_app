<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\ProductStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;
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
 * @property bool $is_featured
 * @property bool $is_new_arrival
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
        'is_featured',
        'is_new_arrival',
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
            'is_featured' => 'boolean',
            'is_new_arrival' => 'boolean',
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

    /**
     * Get products linked/included inside this collection/product.
     */
    public function linkedProducts(): BelongsToMany
    {
        return $this->belongsToMany(
            Product::class,
            'product_links',
            'parent_product_id',
            'linked_product_id'
        )
            ->withPivot('sort_order')
            ->orderByPivot('sort_order')
            ->withTimestamps();
    }

    /**
     * Get parent products/collections that link to this product.
     */
    public function parentProducts(): BelongsToMany
    {
        return $this->belongsToMany(
            Product::class,
            'product_links',
            'linked_product_id',
            'parent_product_id'
        )
            ->withPivot('sort_order')
            ->orderByPivot('sort_order')
            ->withTimestamps();
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

    public function scopeInStock($query)
    {
        return $query->where('status', ProductStatus::ACTIVE);
    }

    public function scopeStock($query, $status)
    {
        return $query;
    }

    // ==================== Accessors & Helpers ====================

    /**
     * Check whether this product belongs to the Living Collection category.
     */
    public function isLivingCollection(): bool
    {
        if ($this->relationLoaded('category') && $this->category) {
            $catSlug = $this->category->slug ?? '';
            $catNameEn = $this->category->getTranslation('name', 'en', false) ?: '';
            $catNameId = $this->category->getTranslation('name', 'id', false) ?: '';
            $catNameRaw = is_string($this->category->name) ? $this->category->name : '';

            return $catSlug === 'living-collection'
                || strtolower(trim($catNameEn)) === 'living collection'
                || strtolower(trim($catNameId)) === 'living collection'
                || strtolower(trim($catNameRaw)) === 'living collection';
        }

        if ($this->category_id) {
            $category = Category::find($this->category_id);
            if ($category) {
                $catSlug = $category->slug ?? '';
                $catNameEn = $category->getTranslation('name', 'en', false) ?: '';
                $catNameId = $category->getTranslation('name', 'id', false) ?: '';
                $catNameRaw = is_string($category->name) ? $category->name : '';

                return $catSlug === 'living-collection'
                    || strtolower(trim($catNameEn)) === 'living collection'
                    || strtolower(trim($catNameId)) === 'living collection'
                    || strtolower(trim($catNameRaw)) === 'living collection';
            }
        }

        return false;
    }

    /**
     * Automatically populate images for Living Collection products from the primary images of all linked products.
     */
    public function syncLivingCollectionImages(): void
    {
        if (! $this->isLivingCollection()) {
            return;
        }

        // Fetch linked products in their sort order
        $linkedProducts = $this->linkedProducts()
            ->with(['images' => fn ($q) => $q->orderBy('sort_order')])
            ->get();

        $primaryImages = [];
        foreach ($linkedProducts as $linked) {
            $primary = $linked->images->where('is_primary', true)->first() ?? $linked->images->first();
            if ($primary) {
                $primaryImages[] = [
                    'image_path' => $primary->image_path,
                    'alt_text' => is_array($linked->name)
                        ? ($linked->name['en'] ?? $linked->name['id'] ?? (is_array($this->name) ? ($this->name['en'] ?? $this->name['id']) : (string) $this->name))
                        : (string) $linked->name,
                ];
            }
        }

        if (empty($primaryImages)) {
            // If none of the linked products have images, remove any inherited images
            $this->images()->delete();
            if ($this->status !== ProductStatus::DRAFT) {
                $this->updateQuietly(['status' => ProductStatus::DRAFT]);
            }

            return;
        }

        // Clear existing collection image records before recreating them from linked products
        $this->images()->delete();

        foreach ($primaryImages as $index => $imgData) {
            $this->images()->create([
                'image_path' => $imgData['image_path'],
                'alt_text' => $imgData['alt_text'],
                'sort_order' => $index,
                'is_primary' => ($index === 0),
            ]);
        }

        // Mark collection as active if it was draft
        if ($this->status === ProductStatus::DRAFT) {
            $this->updateQuietly(['status' => ProductStatus::ACTIVE]);
        }
    }

    /**
     * Sync living collection images for all products in the Living Collection category.
     *
     * @return int Number of collections synced
     */
    public static function syncAllLivingCollections(): int
    {
        $livingCategory = Category::where('slug', 'living-collection')
            ->orWhereRaw("LOWER(JSON_UNQUOTE(JSON_EXTRACT(name, '$.en'))) = 'living collection'")
            ->orWhereRaw("LOWER(JSON_UNQUOTE(JSON_EXTRACT(name, '$.id'))) = 'living collection'")
            ->first();

        if (! $livingCategory) {
            return 0;
        }

        $collections = static::where('category_id', $livingCategory->id)->get();
        $count = 0;

        foreach ($collections as $collection) {
            $collection->syncLivingCollectionImages();
            $count++;
        }

        return $count;
    }

    /**
     * Check if product has direct images or inherited images from linked products.
     */
    public function hasImages(): bool
    {
        if ($this->images()->exists()) {
            return true;
        }

        if ($this->isLivingCollection()) {
            return $this->linkedProducts()->whereHas('images')->exists();
        }

        return false;
    }

    /**
     * Get primary image attribute.
     * For Living Collection products with no direct images, fallback to the primary image of the first connected product.
     */
    public function getPrimaryImageAttribute(): ?ProductImage
    {
        /** @var Collection<int, ProductImage> $images */
        $images = $this->images;

        /** @var ProductImage|null $primary */
        $primary = $images->firstWhere('is_primary', true) ?? $images->first();

        if (! $primary && $this->isLivingCollection()) {
            foreach ($this->linkedProducts as $linkedProduct) {
                if ($linkedPrimary = $linkedProduct->primary_image) {
                    return $linkedPrimary;
                }
            }
        }

        return $primary;
    }

    /**
     * Get effective images collection for the product.
     * For Living Collection products with no direct images, takes the primary image of each connected product.
     *
     * @return Collection<int, ProductImage>
     */
    public function getEffectiveImagesAttribute(): Collection
    {
        if ($this->images->isNotEmpty()) {
            return $this->images;
        }

        if ($this->isLivingCollection()) {
            $collected = new Collection();
            foreach ($this->linkedProducts as $linkedProduct) {
                if ($linkedPrimary = $linkedProduct->primary_image) {
                    $collected->push($linkedPrimary);
                }
            }

            return $collected;
        }

        return $this->images;
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

    public function isInStock(): bool
    {
        return true;
    }

    public function isLowStock(): bool
    {
        return false;
    }

    public function isSellable(): bool
    {
        return $this->status->isSellable();
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
        // No-op without stock_quantity column
    }

    /**
     * Add stock quantity.
     */
    public function addStock(int $quantity): void
    {
        // No-op without stock_quantity column
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
