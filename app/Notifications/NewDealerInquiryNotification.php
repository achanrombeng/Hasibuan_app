<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\DealerInquiry;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewDealerInquiryNotification extends Notification
{
    use Queueable;

    public function __construct(
        public DealerInquiry $inquiry
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
            'type' => 'new_dealer_inquiry',
            'title' => 'Dealer Inquiry Baru',
            'message' => "Pengajuan kemitraan baru dari {$this->inquiry->name} ({$this->inquiry->email})",
            'inquiry_id' => $this->inquiry->id,
            'name' => $this->inquiry->name,
            'email' => $this->inquiry->email,
            'phone' => $this->inquiry->phone,
            'url' => '/admin/dealer-inquiries',
        ];
    }
}
