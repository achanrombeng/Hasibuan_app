<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin CartItem
 */
class CartItemResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'quantity' => $this->quantity,
            'unit_price' => $this->unit_price,
            'price' => $this->unit_price, // Alias for sidebar compatibility
            'unit_price_formatted' => $this->formatted_unit_price,
            'subtotal' => $this->subtotal,
            'subtotal_formatted' => $this->formatted_subtotal,
            'options' => $this->options,
            'is_saved_for_later' => $this->is_saved_for_later,
            'product' => $this->relationLoaded('product') ? (new ProductResource($this->product))->resolve() : null,
        ];
    }
}
