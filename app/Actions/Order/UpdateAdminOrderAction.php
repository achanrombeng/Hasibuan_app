<?php

declare(strict_types=1);

namespace App\Actions\Order;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;

class UpdateAdminOrderAction
{
    public function __construct(
        protected UpdateOrderStatusAction $statusAction,
        protected CancelOrderAction $cancelAction
    ) {}

    /**
     * Execute admin order update logic.
     *
     * @param Order $order
     * @param array $validated Validated request data
     * @return void
     * @throws \RuntimeException|\InvalidArgumentException
     */
    public function execute(Order $order, array $validated): void
    {
        // 1. Handle Cancellation
        if (isset($validated['status']) && $validated['status'] === OrderStatus::CANCELLED->value) {
            $this->cancelAction->execute(
                $order, 
                $validated['cancellation_reason'] ?? 'Dibatalkan oleh admin'
            );
            return; // Stop here if cancelled
        }

        // 2. Handle Status Update
        if (isset($validated['status'])) {
            $this->statusAction->execute(
                $order,
                OrderStatus::from($validated['status']),
                $validated['tracking_number'] ?? null
            );
        }

        // 3. Handle Payment Status Update
        if (isset($validated['payment_status'])) {
            $newPaymentStatus = PaymentStatus::from($validated['payment_status']);
            
            // Only update if changed
            if ($order->payment_status !== $newPaymentStatus) {
                $order->update([
                    'payment_status' => $newPaymentStatus,
                    'paid_at' => $newPaymentStatus === PaymentStatus::PAID ? now() : $order->paid_at,
                ]);
            }
        }

        // 4. Handle Admin Notes
        if (isset($validated['admin_notes'])) {
            $order->update(['admin_notes' => $validated['admin_notes']]);
        }
    }
}
