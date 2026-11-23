<?php

namespace App\Mail;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewInquiryNotification extends Mailable
{
    use Queueable, SerializesModels;

    public Booking $booking;

    public function __construct(Booking $booking)
    {
        $this->booking = $booking;
    }

    public function envelope(): Envelope
    {
        $client = $this->booking->name ?: 'New Client';
        $service = $this->booking->service_type ?: 'Inquiry';

        return new Envelope(
            subject: "New Inquiry from {$client} [{$service}] — Loops Integrated",
            replyTo: $this->booking->email ? [$this->booking->email] : null,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.new_inquiry',
            with: [
                'booking' => $this->booking,
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
