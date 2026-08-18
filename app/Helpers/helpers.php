<?php

if (!function_exists('format_rupiah')) {
    /**
     * Format number as Indonesian Rupiah currency.
     *
     * @param int|float|null $amount
     * @param bool $withSymbol
     * @return string
     */
    function format_rupiah(int|float|null $amount, bool $withSymbol = true): string
    {
        if ($amount === null) {
            return $withSymbol ? 'Rp 0' : '0';
        }

        $formatted = number_format($amount, 0, ',', '.');

        return $withSymbol ? 'Rp ' . $formatted : $formatted;
    }
}

if (!function_exists('parse_rupiah')) {
    /**
     * Parse formatted rupiah string back to integer.
     *
     * @param string $formatted
     * @return int
     */
    function parse_rupiah(string $formatted): int
    {
        // Remove "Rp", spaces, and dots
        $cleaned = preg_replace('/[^0-9]/', '', $formatted);

        return (int) $cleaned;
    }
}
