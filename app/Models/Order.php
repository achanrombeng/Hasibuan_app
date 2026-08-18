<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Order Model
 *
 * Pesanan customer.
 *
 * @property int $id
 * @property int $user_id
 * @property string $order_number
 * @property OrderStatus $status
 * @property PaymentStatus $payment_status
 * @property PaymentMethod $payment_method
 * @property int $subtotal
 * @property int $discount_amount
 * @property int $shipping_cost
 * @property int $tax_amount
 * @property int $total
 * @property string|null $coupon_code
 * @property string $shipping_name
 * @property string $shipping_phone
 * @property string $shipping_email
 * @property string $shipping_address
 * @property string $shipping_city
 * @property string $shipping_province
 * @property string $shipping_postal_code
 * @property string|null $shipping_method
 * @property string|null $tracking_number
 * @property string|null $customer_notes
 * @property string|null $admin_notes
 * @property \Illuminate\Support\Carbon|null $paid_at
 * @property \Illuminate\Support\Carbon|null $shipped_at
 * @property \Illuminate\Support\Carbon|null $delivered_at
 * @property \Illuminate\Support\Carbon|null $cancelled_at
 * @property string|null $cancellation_reason
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 */
class Order extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'order_number',
        'status',
        'payment_status',
        'payment_method',
        'subtotal',
        'discount_amount',
        'shipping_cost',
        'tax_amount',
        'total',
        'coupon_code',
        'shipping_name',
        'shipping_phone',
        'shipping_email',
        'shipping_address',
        'shipping_city',
        'shipping_province',
        'shipping_postal_code',
        'shipping_method',
        'tracking_number',
        'customer_notes',
        'admin_notes',
        'paid_at',
        'shipped_at',
        'delivered_at',
        'cancelled_at',
        'cancellation_reason',
        'snap_token',
    ];

    protected function casts(): array
    {
        return [
            'status' => OrderStatus::class,
            'payment_status' => PaymentStatus::class,
            'payment_method' => PaymentMethod::class,
            'subtotal' => 'integer',
            'discount_amount' => 'integer',
            'shipping_cost' => 'integer',
            'tax_amount' => 'integer',
            'total' => 'integer',
            'paid_at' => 'datetime',
            'shipped_at' => 'datetime',
            'delivered_at' => 'datetime',
            'cancelled_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Order $order) {
            if (empty($order->order_number)) {
                $order->order_number = static::generateOrderNumber();
            }
        });
    }

    // ==================== Relationships ====================

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(ProductReview::class);
    }

    // ==================== Scopes ====================

    public function scopeByStatus($query, OrderStatus $status)
    {
        return $query->where('status', $status);
    }

    public function scopePending($query)
    {
        return $query->where('status', OrderStatus::PENDING);
    }

    public function scopeProcessing($query)
    {
        return $query->whereIn('status', [
            OrderStatus::CONFIRMED,
            OrderStatus::PROCESSING,
            OrderStatus::SHIPPED,
        ]);
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', OrderStatus::DELIVERED);
    }

    // ==================== Accessors ====================

    public function getItemCountAttribute(): int
    {
        return $this->items->sum('quantity');
    }

    public function getFullShippingAddressAttribute(): string
    {
        return implode(', ', array_filter([
            $this->shipping_address,
            $this->shipping_city,
            $this->shipping_province,
            $this->shipping_postal_code,
        ]));
    }

    public function getFormattedSubtotalAttribute(): string
    {
        return format_rupiah($this->subtotal);
    }

    public function getFormattedTotalAttribute(): string
    {
        return format_rupiah($this->total);
    }

    public function getFormattedShippingCostAttribute(): string
    {
        return format_rupiah($this->shipping_cost);
    }

    public function getFormattedDiscountAttribute(): string
    {
        return format_rupiah($this->discount_amount);
    }

    // ==================== Helper Methods ====================

    public static function generateOrderNumber(): string
    {
        $prefix = 'ORD';
        $date = now()->format('Ymd');
        $random = strtoupper(substr(uniqid(), -6));

        return "{$prefix}-{$date}-{$random}";
    }

    public function isPaid(): bool
    {
        return $this->payment_status === PaymentStatus::PAID;
    }

    public function isCancellable(): bool
    {
        return $this->status->isCancellable();
    }

    public function isCompleted(): bool
    {
        return $this->status->isCompleted();
    }

    public function markAsPaid(): void
    {
        $this->update([
            'payment_status' => PaymentStatus::PAID,
            'paid_at' => now(),
        ]);
    }

    public function markAsShipped(?string $trackingNumber = null): void
    {
        $data = [
            'status' => OrderStatus::SHIPPED,
            'shipped_at' => now(),
        ];

        if ($trackingNumber) {
            $data['tracking_number'] = $trackingNumber;
        }

        $this->update($data);
    }

    public function markAsDelivered(): void
    {
        $this->update([
            'status' => OrderStatus::DELIVERED,
            'delivered_at' => now(),
        ]);
    }

    public function cancel(string $reason): void
    {
        if (! $this->isCancellable()) {
            throw new \RuntimeException('Order tidak dapat dibatalkan.');
        }

        $this->update([
            'status' => OrderStatus::CANCELLED,
            'cancelled_at' => now(),
            'cancellation_reason' => $reason,
        ]);
    }

    // ==================== Scopes ====================

    /**
     * @param \Illuminate\Database\Eloquent\Builder<Order> $query
     * @param string $date
     * @return \Illuminate\Database\Eloquent\Builder<Order>
     */
    public function scopeCreatedAfter($query, string $date)
    {
        return $query->whereDate('created_at', '>=', $date);
    }

    /**
     * @param \Illuminate\Database\Eloquent\Builder<Order> $query
     * @param string $date
     * @return \Illuminate\Database\Eloquent\Builder<Order>
     */
    public function scopeCreatedBefore($query, string $date)
    {
        return $query->whereDate('created_at', '<=', $date);
    }
}
