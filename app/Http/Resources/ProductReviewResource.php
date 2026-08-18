<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\ProductReview;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin ProductReview
 */
class ProductReviewResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'product_id' => $this->product_id,
            'rating' => $this->rating,
            'title' => $this->title,
            'comment' => $this->comment,
            'is_verified_purchase' => $this->is_verified_purchase,
            'is_approved' => $this->is_approved,
            'user' => $this->when(
                $this->relationLoaded('user'),
                function () {
                    /** @var \App\Models\User|null $user */
                    $user = $this->user;

                    return $user ? [
                        'id' => $user->id,
                        'name' => $user->name,
                    ] : null;
                }
            ),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
