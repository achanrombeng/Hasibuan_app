<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Product status enum untuk status produk.
 */
enum ProductStatus: string
{
    case DRAFT = 'draft';
    case ACTIVE = 'active';
    case INACTIVE = 'inactive';
    case OUT_OF_STOCK = 'out_of_stock';
    case DISCONTINUED = 'discontinued';

    /**
     * Get label untuk ditampilkan di UI (Bahasa Indonesia).
     */
    public function label(): string
    {
        return __('enums.product_status.' . $this->value);
    }

    /**
     * Get badge color untuk UI.
     */
    public function color(): string
    {
        return match ($this) {
            self::DRAFT => 'gray',
            self::ACTIVE => 'green',
            self::INACTIVE => 'yellow',
            self::OUT_OF_STOCK => 'orange',
            self::DISCONTINUED => 'red',
        };
    }

    /**
     * Check apakah produk bisa dijual.
     */
    public function isSellable(): bool
    {
        return $this === self::ACTIVE;
    }

    /**
     * Check apakah produk visible di frontend.
     */
    public function isVisible(): bool
    {
        return in_array($this, [self::ACTIVE, self::OUT_OF_STOCK]);
    }
}

