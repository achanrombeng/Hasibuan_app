<?php

declare(strict_types=1);

namespace App\Actions\Order;

use App\Enums\PaymentStatus;
use App\Models\Order;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class CancelOrderAction
{
    public function execute(Order $order, string $reason): Order
    {
        if (! $order->status->isCancellable()) {
            throw new InvalidArgumentException('Pesanan tidak dapat dibatalkan.');
        }

        return DB::transaction(function () use ($order, $reason) {
            $wasPaid = $order->payment_status === PaymentStatus::PAID;

            // Restore stock and adjust sold_count for each item
            /** @var \Illuminate\Database\Eloquent\Collection<int, \App\Models\OrderItem> $orderItems */
            $orderItems = $order->items;

            foreach ($orderItems as $item) {
                /** @var \App\Models\Product|null $product */
                $product = $item->product;
                if ($product) {
                    // Restore stock
                    if ($product->track_stock) {
                        $product->addStock($item->quantity);
                    }
                    // Decrement sold_count only if order was already paid
                    if ($wasPaid) {
                        $product->decrementSoldCount($item->quantity);
                    }
                }
            }

            $order->cancel($reason);

            return $order->fresh();
        });
    }
}

