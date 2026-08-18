<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * CartItem Model
 *
 * Item di shopping cart.
 *
 * @property int $id
 * @property int $cart_id
 * @property int $product_id
 * @property int $quantity
 * @property int $unit_price
 * @property array|null $options
 * @property bool $is_saved_for_later
 */
class CartItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'cart_id',
        'product_id',
        'quantity',
        'unit_price',
        'options',
        'is_saved_for_later',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'unit_price' => 'integer',
            'options' => 'array',
            'is_saved_for_later' => 'boolean',
        ];
    }

    public function cart(): BelongsTo
    {
        return $this->belongsTo(Cart::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    // ==================== Accessors ====================

    public function getSubtotalAttribute(): int
    {
        return $this->unit_price * $this->quantity;
    }

    public function getFormattedUnitPriceAttribute(): string
    {
        return format_rupiah($this->unit_price);
    }

    public function getFormattedSubtotalAttribute(): string
    {
        return format_rupiah($this->subtotal);
    }

    // ==================== Helper Methods ====================

    public function updateQuantity(int $quantity): void
    {
        if ($quantity <= 0) {
            $this->delete();

            return;
        }

        $this->update(['quantity' => $quantity]);
    }

    public function syncPriceWithProduct(): void
    {
        /** @var Product $product */
        $product = $this->product;
        $this->update(['unit_price' => $product->final_price]);
    }
}
