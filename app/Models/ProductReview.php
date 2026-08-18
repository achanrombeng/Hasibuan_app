<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * ProductReview Model
 *
 * Ulasan produk dari customer.
 *
 * @property int $id
 * @property int $product_id
 * @property int $user_id
 * @property int|null $order_id
 * @property int $rating
 * @property string|null $title
 * @property string|null $comment
 * @property bool $is_verified_purchase
 * @property bool $is_approved
 * @property \Illuminate\Support\Carbon|null $approved_at
 */
class ProductReview extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected static function booted(): void
    {
        static::created(function (ProductReview $review) {
            // Notify all admin users about new review
            $admins = User::role('admin')->get();
            foreach ($admins as $admin) {
                $admin->notify(new \App\Notifications\NewReviewNotification($review));
            }
        });

        static::saved(function (ProductReview $review) {
            $review->product->updateRatingStats();
        });

        static::deleted(function (ProductReview $review) {
            $review->product->updateRatingStats();
        });

        static::restored(function (ProductReview $review) {
            $review->product->updateRatingStats();
        });
    }

    protected $fillable = [
        'product_id',
        'user_id',
        'order_id',
        'rating',
        'title',
        'comment',
        'is_verified_purchase',
        'is_approved',
        'approved_at',
    ];

    protected function casts(): array
    {
        return [
            'rating' => 'integer',
            'is_verified_purchase' => 'boolean',
            'is_approved' => 'boolean',
            'approved_at' => 'datetime',
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    // ==================== Scopes ====================

    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }

    public function scopePending($query)
    {
        return $query->where('is_approved', false);
    }

    public function scopeVerifiedPurchase($query)
    {
        return $query->where('is_verified_purchase', true);
    }

    // ==================== Helper Methods ====================

    public function approve(): void
    {
        $this->update([
            'is_approved' => true,
            'approved_at' => now(),
        ]);

        /** @var Product $product */
        $product = $this->product;
        $product->updateRatingStats();
    }

    public function reject(): void
    {
        /** @var Product $product */
        $product = $this->product;

        $this->delete();
        $product->updateRatingStats();
    }
}
