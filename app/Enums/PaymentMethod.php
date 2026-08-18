<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Payment method enum untuk metode pembayaran yang didukung.
 */
enum PaymentMethod: string
{
    case BANK_TRANSFER = 'bank_transfer';
    case COD = 'cod';
    case MIDTRANS = 'midtrans';
    case WHATSAPP = 'whatsapp';

    /**
     * Get label untuk ditampilkan di UI (Bahasa Indonesia).
     */
    public function label(): string
    {
        return __('enums.payment_method.' . $this->value);
    }

    /**
     * Get description untuk UI.
     */
    public function description(): string
    {
        return __('enums.payment_method_description.' . $this->value);
    }

    /**
     * Get icon name untuk UI.
     */
    public function icon(): string
    {
        return match ($this) {
            self::BANK_TRANSFER => 'building-library',
            self::COD => 'banknotes',
        };
    }

    /**
     * Check apakah metode ini memerlukan verifikasi pembayaran manual.
     */
    public function requiresManualVerification(): bool
    {
        return match ($this) {
            self::BANK_TRANSFER, self::COD, self::WHATSAPP => true,
            self::MIDTRANS => false,
        };
    }
}
