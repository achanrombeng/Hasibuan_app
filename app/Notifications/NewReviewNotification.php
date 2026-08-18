<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\ProductReview;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewReviewNotification extends Notification
{
    use Queueable;

    public function __construct(
        public ProductReview $review
    ) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'new_review',
            'title' => 'Ulasan Baru',
            'message' => "Ulasan baru untuk {$this->review->product?->name} (Rating: {$this->review->rating}/5)",
            'review_id' => $this->review->id,
            'product_id' => $this->review->product_id,
            'product_name' => $this->review->product?->name,
            'customer_name' => $this->review->user?->name ?? 'Customer',
            'rating' => $this->review->rating,
            'url' => '/admin/reviews',
        ];
    }
}
