<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * OrderItem Model
 *
 * Item dalam pesanan.
 *
 * @property int $id
 * @property int $order_id
 * @property int $product_id
 * @property string $product_name
 * @property string $product_sku
 * @property int $quantity
 * @property int $unit_price
 * @property int $original_price
 * @property int $discount_amount
 * @property int $subtotal
 * @property array|null $options
 * @property bool $is_reviewed
 */
class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'product_id',
        'product_name',
        'product_sku',
        'quantity',
        'unit_price',
        'original_price',
        'discount_amount',
        'subtotal',
        'options',
        'is_reviewed',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'unit_price' => 'integer',
            'original_price' => 'integer',
            'discount_amount' => 'integer',
            'subtotal' => 'integer',
            'options' => 'array',
            'is_reviewed' => 'boolean',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    // ==================== Accessors ====================

    public function getFormattedUnitPriceAttribute(): string
    {
        return format_rupiah($this->unit_price);
    }

    public function getFormattedOriginalPriceAttribute(): string
    {
        return format_rupiah($this->original_price ?? $this->unit_price);
    }

    public function getFormattedDiscountAmountAttribute(): string
    {
        return format_rupiah($this->discount_amount ?? 0);
    }

    public function getFormattedSubtotalAttribute(): string
    {
        return format_rupiah($this->subtotal);
    }

    public function getHasDiscountAttribute(): bool
    {
        return ($this->discount_amount ?? 0) > 0;
    }

    public function getDiscountPercentageAttribute(): int
    {
        if (!$this->original_price || $this->original_price <= 0) {
            return 0;
        }
        return (int) round((($this->original_price - $this->unit_price) / $this->original_price) * 100);
    }

    // ==================== Helper Methods ====================

    /**
     * Create order item from cart item.
     */
    public static function fromCartItem(Order $order, CartItem $cartItem): self
    {
        /** @var Product $product */
        $product = $cartItem->product;

        // Get original price (before discount) and final price (after discount)
        $originalPrice = $product->price;
        $finalPrice = $product->final_price;
        $discountAmount = $originalPrice - $finalPrice;

        /** @var self $orderItem */
        $orderItem = self::create([
            'order_id' => $order->id,
            'product_id' => $cartItem->product_id,
            'product_name' => $product->name,
            'product_sku' => $product->sku,
            'quantity' => $cartItem->quantity,
            'unit_price' => $finalPrice,
            'original_price' => $originalPrice,
            'discount_amount' => $discountAmount > 0 ? $discountAmount : 0,
            'subtotal' => $finalPrice * $cartItem->quantity,
            'options' => $cartItem->options,
        ]);

        return $orderItem;
    }
}
