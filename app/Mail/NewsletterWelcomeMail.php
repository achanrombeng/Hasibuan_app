<?php

declare(strict_types=1);

namespace App\Mail;

use App\Models\Setting;
use App\Models\Subscriber;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewsletterWelcomeMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Subscriber $subscriber
    ) {}

    public function envelope(): Envelope
    {
        $siteName = Setting::get('site_name', 'Ronica Outdoor Furniture');

        return new Envelope(
            subject: "Welcome to the {$siteName} Family!",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.newsletter-welcome',
            with: [
                'siteName' => Setting::get('site_name', 'Ronica Outdoor Furniture'),
                'contactEmail' => Setting::get('contact_email', 'contact@ronicaoutdoor.com'),
                'contactPhone' => Setting::get('contact_phone', '+62 812-3456-7890'),
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
