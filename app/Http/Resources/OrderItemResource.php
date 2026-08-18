<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin OrderItem
 */
class OrderItemResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'product_name' => $this->product_name,
            'product_sku' => $this->product_sku,
            'quantity' => $this->quantity,
            // Prices
            'unit_price' => $this->unit_price,
            'unit_price_formatted' => $this->formatted_unit_price,
            'original_price' => $this->original_price ?? $this->unit_price,
            'original_price_formatted' => $this->formatted_original_price,
            'discount_amount' => $this->discount_amount ?? 0,
            'discount_amount_formatted' => $this->formatted_discount_amount,
            'discount_percentage' => $this->discount_percentage,
            'has_discount' => $this->has_discount,
            // Subtotals
            'subtotal' => $this->subtotal,
            'subtotal_formatted' => $this->formatted_subtotal,
            // Legacy aliases
            'price' => $this->unit_price,
            'price_formatted' => $this->formatted_unit_price,
            // Options and product
            'options' => $this->options,
            'is_reviewed' => $this->is_reviewed ?? false,
            'product' => $this->relationLoaded('product') && $this->product
                ? (new ProductResource($this->product))->resolve()
                : null,
        ];
    }
}
