<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\PromoBanner
 */
class PromoBannerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'cta_text' => $this->cta_text,
            'cta_link' => $this->cta_link,
            'icon' => $this->icon,
            'bg_gradient' => $this->bg_gradient,
            'display_type' => $this->display_type,
            'is_active' => $this->is_active,
            'priority' => $this->priority,
            'starts_at' => $this->starts_at?->toISOString(),
            'ends_at' => $this->ends_at?->toISOString(),
            'is_currently_active' => $this->isCurrentlyActive(),
            'status_label' => $this->getStatusLabel(),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
