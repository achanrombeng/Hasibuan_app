<?php

declare(strict_types=1);

namespace App\Models;

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
}
