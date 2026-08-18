<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Payment status enum untuk tracking status pembayaran.
 */
enum PaymentStatus: string
{
    case PENDING = 'pending';
    case PAID = 'paid';
    case FAILED = 'failed';
    case EXPIRED = 'expired';
    case REFUNDED = 'refunded';

    /**
     * Get label untuk ditampilkan di UI (Bahasa Indonesia).
     */
    public function label(): string
    {
        return __('enums.payment_status.' . $this->value);
    }

    /**
     * Get warna untuk badge di UI.
     */
    public function color(): string
    {
        return match ($this) {
            self::PENDING => 'yellow',
            self::PAID => 'green',
            self::FAILED => 'red',
            self::EXPIRED => 'gray',
            self::REFUNDED => 'blue',
        };
    }

    /**
     * Check apakah pembayaran berhasil.
     */
    public function isSuccessful(): bool
    {
        return $this === self::PAID;
    }
}

