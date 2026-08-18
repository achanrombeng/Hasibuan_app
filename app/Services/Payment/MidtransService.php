<?php

declare(strict_types=1);

namespace App\Services\Payment;

use App\Models\Order;
use Midtrans\Config;
use Midtrans\Snap;

class MidtransService
{
    public function __construct()
    {
        $this->configureBase();
    }

    protected function configureBase(): void
    {
        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized = config('midtrans.is_sanitized');
        Config::$is3ds = config('midtrans.is_3ds');
    }

    public function getSnapToken(Order $order): string
    {
        $params = [
            'transaction_details' => [
                'order_id' => $order->order_number,
                'gross_amount' => (int) $order->total,
            ],
            'customer_details' => [
                'first_name' => $order->shipping_name,
                'email' => $order->shipping_email,
                'phone' => $order->shipping_phone,
                'shipping_address' => $order->full_shipping_address, // Ensure accessor exists or string
            ],
            // 'item_details' => $this->formatItems($order), // Disabled to prevent validation error on mismatch
        ];

        return Snap::getSnapToken($params);
    }

    protected function formatItems(Order $order): array
    {
        $items = [];

        foreach ($order->items as $item) {
            $items[] = [
                'id' => $item->product_id,
                'price' => (int) $item->unit_price,
                'quantity' => $item->quantity,
                'name' => substr($item->product->name, 0, 50), // Midtrans max char limit
            ];
        }

        // Add Shipping Cost as an item
        if ($order->shipping_cost > 0) {
            $items[] = [
                'id' => 'SHIPPING',
                'price' => (int) $order->shipping_cost,
                'quantity' => 1,
                'name' => 'Biaya Pengiriman',
            ];
        }

        // Add/Subtract Discount (Midtrans doesn't support negative distinct item, so we might need to adjust logic or just send gross amount if simple)
        // Best practice: Ensure sum of items equals `gross_amount`
        
        // Note: For simplicity and to avoid rounding issues, if discount exists, we might need to distribute it or send as negative item if allowed? 
        // Midtrans DOES NOT support negative prices. 
        // Strategy: Verify totals matching. If not matching, simplistic approach is sending only transaction_details (no item_details),
        // but for better UX we want item details. 
        // Alternative: Just send Shipping Cost.
        
        // Let's stick to simple transaction_details first to ensure success, 
        // OR handle logic strictly.
        
        // For now, let's include basic items. 
        // IMPORTANT: Midtrans compares sum(items) vs gross_amount. MUST MATCH.
        
        return $items;
    }
}
