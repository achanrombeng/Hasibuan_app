<?php

declare(strict_types=1);

namespace App\Mail;

use App\Models\DealerInquiry;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class DealerInquiryReceived extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public DealerInquiry $inquiry
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "New Dealer Partnership Inquiry from {$this->inquiry->name}",
            replyTo: [$this->inquiry->email],
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.dealer-inquiry',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
