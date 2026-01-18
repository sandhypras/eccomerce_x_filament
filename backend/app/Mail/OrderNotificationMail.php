<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Queue\SerializesModels;

class OrderNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $order;
    public $paymentProofPath;

    /**
     * Create a new message instance.
     */
    public function __construct(Order $order, $paymentProofPath = null)
    {
        $this->order = $order;
        $this->paymentProofPath = $paymentProofPath;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Pesanan Baru - ' . $this->order->order_number,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.order-notification',
            with: [
                'order' => $this->order,
                'customerName' => $this->order->user->name,
                'customerEmail' => $this->order->user->email,
                'phone' => $this->order->phone,
                'shippingAddress' => $this->order->shipping_address,
                'notes' => $this->order->notes,
                'total' => $this->order->total,
                'items' => $this->order->items,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     */
    public function attachments(): array
    {
        $attachments = [];

        // Attach payment proof if exists
        if ($this->paymentProofPath && \Storage::disk('public')->exists($this->paymentProofPath)) {
            $attachments[] = Attachment::fromStorageDisk('public', $this->paymentProofPath)
                ->as('Bukti_Pembayaran_' . $this->order->order_number . '.jpg')
                ->withMime('image/jpeg');
        }

        return $attachments;
    }
}
