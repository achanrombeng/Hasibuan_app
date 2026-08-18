<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Order status enum untuk tracking status pesanan.
 */
enum OrderStatus: string
{
    case PENDING = 'pending';
    case CONFIRMED = 'confirmed';
    case PROCESSING = 'processing';
    case SHIPPED = 'shipped';
    case DELIVERED = 'delivered';
    case CANCELLED = 'cancelled';
    case REFUNDED = 'refunded';

    /**
     * Get label untuk ditampilkan di UI (Bahasa Indonesia).
     */
    public function label(): string
    {
        return __('enums.order_status.' . $this->value);
    }

    /**
     * Get warna untuk badge di UI.
     */
    public function color(): string
    {
        return match ($this) {
            self::PENDING => 'yellow',
            self::CONFIRMED => 'blue',
            self::PROCESSING => 'indigo',
            self::SHIPPED => 'purple',
            self::DELIVERED => 'green',
            self::CANCELLED => 'red',
            self::REFUNDED => 'gray',
        };
    }

    /**
     * Check apakah order masih bisa dibatalkan.
     */
    public function isCancellable(): bool
    {
        return in_array($this, [self::PENDING, self::CONFIRMED, self::PROCESSING]);
    }

    /**
     * Check apakah order sudah selesai.
     */
    public function isCompleted(): bool
    {
        return in_array($this, [self::DELIVERED, self::CANCELLED, self::REFUNDED]);
    }
}
