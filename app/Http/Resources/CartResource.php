<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Cart
 */
class CartResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        // Separate active items and saved for later items
        $allItems = $this->whenLoaded('items');
        $activeItems = [];
        $savedItems = [];

        if ($allItems) {
            foreach ($this->items as $item) {
                if ($item->is_saved_for_later) {
                    $savedItems[] = $item;
                } else {
                    $activeItems[] = $item;
                }
            }
        }

        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'session_id' => $this->session_id,
            'items_count' => $this->item_count,
            'saved_items_count' => $this->saved_item_count,
            'subtotal' => $this->subtotal,
            'subtotal_formatted' => $this->formatted_subtotal,
            'items' => CartItemResource::collection($activeItems)->resolve(),
            'saved_items' => CartItemResource::collection($savedItems)->resolve(),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
