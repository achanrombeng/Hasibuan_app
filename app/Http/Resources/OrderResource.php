<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Order
 */
class OrderResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'status' => [
                'value' => $this->status->value,
                'label' => $this->status->label(),
                'color' => $this->status->color(),
            ],
            'payment_status' => [
                'value' => $this->payment_status->value,
                'label' => $this->payment_status->label(),
                'color' => $this->payment_status->color(),
            ],
            'payment_method' => [
                'value' => $this->payment_method->value,
                'label' => $this->payment_method->label(),
            ],
            'subtotal' => $this->subtotal,
            'subtotal_formatted' => $this->formatted_subtotal,
            'discount_amount' => $this->discount_amount,
            'discount_formatted' => $this->formatted_discount,
            'shipping_cost' => $this->shipping_cost,
            'shipping_cost_formatted' => $this->formatted_shipping_cost,
            'tax_amount' => $this->tax_amount,
            'total' => $this->total,
            'total_formatted' => $this->formatted_total,
            'coupon_code' => $this->coupon_code,
            'shipping_name' => $this->shipping_name,
            'shipping_phone' => $this->shipping_phone,
            'shipping_email' => $this->shipping_email,
            'shipping_address' => $this->shipping_address,
            'shipping_city' => $this->shipping_city,
            'shipping_province' => $this->shipping_province,
            'shipping_postal_code' => $this->shipping_postal_code,
            'shipping_method' => $this->shipping_method,
            'tracking_number' => $this->tracking_number,
            'customer_notes' => $this->customer_notes,
            'admin_notes' => $this->admin_notes,
            'shipped_at' => $this->shipped_at?->toISOString(),
            'delivered_at' => $this->delivered_at?->toISOString(),
            'cancelled_at' => $this->cancelled_at?->toISOString(),
            'cancellation_reason' => $this->cancellation_reason,
            'items' => $this->relationLoaded('items')
                ? OrderItemResource::collection($this->items)->resolve()
                : [],
            'user' => $this->when(
                $this->relationLoaded('user'),
                function () {
                    /** @var \App\Models\User|null $user */
                    $user = $this->user;

                    return $user ? [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                    ] : null;
                }
            ),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            'snap_token' => $this->snap_token,
        ];
    }
}
