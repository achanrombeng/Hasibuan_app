<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Payment Model
 *
 * Pembayaran untuk pesanan.
 *
 * @property int $id
 * @property int $order_id
 * @property string $payment_number
 * @property PaymentMethod $payment_method
 * @property PaymentStatus $status
 * @property int $amount
 * @property string|null $gateway_transaction_id
 * @property array|null $gateway_response
 * @property string|null $bank_name
 * @property string|null $account_number
 * @property string|null $account_name
 * @property string|null $transfer_proof_path
 * @property \Illuminate\Support\Carbon|null $paid_at
 * @property \Illuminate\Support\Carbon|null $verified_at
 * @property int|null $verified_by
 * @property \Illuminate\Support\Carbon|null $expires_at
 * @property string|null $notes
 */
class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'payment_number',
        'payment_method',
        'status',
        'amount',
        'gateway_transaction_id',
        'gateway_response',
        'bank_name',
        'account_number',
        'account_name',
        'transfer_proof_path',
        'paid_at',
        'verified_at',
        'verified_by',
        'expires_at',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'payment_method' => PaymentMethod::class,
            'status' => PaymentStatus::class,
            'amount' => 'integer',
            'gateway_response' => 'array',
            'paid_at' => 'datetime',
            'verified_at' => 'datetime',
            'expires_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Payment $payment) {
            if (empty($payment->payment_number)) {
                $payment->payment_number = static::generatePaymentNumber();
            }
        });
    }

    // ==================== Relationships ====================

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    // ==================== Scopes ====================

    public function scopePending($query)
    {
        return $query->where('status', PaymentStatus::PENDING);
    }

    public function scopePaid($query)
    {
        return $query->where('status', PaymentStatus::PAID);
    }

    public function scopeExpired($query)
    {
        return $query->where('status', PaymentStatus::EXPIRED);
    }

    public function scopeNeedsVerification($query)
    {
        return $query->where('status', PaymentStatus::PENDING)
            ->whereNotNull('transfer_proof_path');
    }

    // ==================== Accessors ====================

    public function getFormattedAmountAttribute(): string
    {
        return format_rupiah($this->amount);
    }

    public function getTransferProofUrlAttribute(): ?string
    {
        if (! $this->transfer_proof_path) {
            return null;
        }

        return asset('storage/'.$this->transfer_proof_path);
    }

    // ==================== Helper Methods ====================

    public static function generatePaymentNumber(): string
    {
        $prefix = 'PAY';
        $date = now()->format('Ymd');
        $random = strtoupper(substr(uniqid(), -6));

        return "{$prefix}-{$date}-{$random}";
    }

    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    public function isPending(): bool
    {
        return $this->status === PaymentStatus::PENDING;
    }

    public function isPaid(): bool
    {
        return $this->status === PaymentStatus::PAID;
    }

    public function verify(User $verifier): void
    {
        $this->update([
            'status' => PaymentStatus::PAID,
            'verified_at' => now(),
            'verified_by' => $verifier->id,
            'paid_at' => now(),
        ]);

        /** @var Order $order */
        $order = $this->order;
        $order->markAsPaid();
    }

    public function reject(string $reason): void
    {
        $this->update([
            'status' => PaymentStatus::FAILED,
            'notes' => $reason,
        ]);
    }

    public function markAsExpired(): void
    {
        $this->update(['status' => PaymentStatus::EXPIRED]);
    }
}
