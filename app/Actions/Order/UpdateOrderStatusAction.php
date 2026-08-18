<?php

declare(strict_types=1);

namespace App\Actions\Order;

use App\Enums\OrderStatus;
use App\Models\Order;
use InvalidArgumentException;

class UpdateOrderStatusAction
{
    public function execute(Order $order, OrderStatus $newStatus, ?string $trackingNumber = null): Order
    {
        return match ($newStatus) {
            OrderStatus::CONFIRMED => $this->confirm($order),
            OrderStatus::PROCESSING => $this->process($order),
            OrderStatus::SHIPPED => $this->ship($order, $trackingNumber),
            OrderStatus::DELIVERED => $this->deliver($order),
            OrderStatus::CANCELLED => throw new InvalidArgumentException('Use CancelOrderAction to cancel orders'),
            default => $this->updateStatus($order, $newStatus),
        };
    }

    private function confirm(Order $order): Order
    {
        $order->update([
            'status' => OrderStatus::CONFIRMED,
        ]);

        return $order->fresh();
    }

    private function process(Order $order): Order
    {
        $order->update([
            'status' => OrderStatus::PROCESSING,
        ]);

        return $order->fresh();
    }

    private function ship(Order $order, ?string $trackingNumber): Order
    {
        $order->markAsShipped($trackingNumber);

        return $order->fresh();
    }

    private function deliver(Order $order): Order
    {
        $order->markAsDelivered();

        return $order->fresh();
    }

    private function updateStatus(Order $order, OrderStatus $status): Order
    {
        $order->update(['status' => $status]);

        return $order->fresh();
    }
}

