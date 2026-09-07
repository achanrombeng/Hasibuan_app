<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\ProductStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * ProductImage Model
 *
 * Gambar produk.
 *
 * @property int $id
 * @property int $product_id
 * @property string $image_path
 * @property string|null $alt_text
 * @property int $sort_order
 * @property bool $is_primary
 */
class ProductImage extends Model
{
    use HasFactory;

    protected static function booted(): void
    {
        static::deleted(function (ProductImage $image) {
            if ($image->product_id) {
                $product = Product::find($image->product_id);
                if ($product && $product->images()->count() === 0 && $product->status !== ProductStatus::DRAFT) {
                    $product->updateQuietly(['status' => ProductStatus::DRAFT]);
                }
            }
        });
    }

    protected $fillable = [
        'product_id',
        'image_path',
        'alt_text',
        'sort_order',
        'is_primary',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'is_primary' => 'boolean',
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get full image URL.
     */
    public function getUrlAttribute(): string
    {
        return asset('storage/'.$this->image_path);
    }

    public function getImageUrlAttribute(): string
    {
        return asset('storage/'.$this->image_path);
    }
}
