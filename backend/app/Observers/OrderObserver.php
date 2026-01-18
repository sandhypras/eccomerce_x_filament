<?php

namespace App\Observers;

use App\Models\Order;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Mail\OrderConfirmedMail;

class OrderObserver
{
    /**
     * Dipanggil saat order di-update
     */
    public function updated(Order $order): void
    {
        // Cek: status BARU berubah menjadi confirmed
        if (
            $order->isDirty('status') &&
            $order->status === 'confirmed'
        ) {
            DB::transaction(function () use ($order) {

                // Load relasi penting
                $order->load('items.product', 'user');

                // 1️⃣ Kurangi stok produk
                foreach ($order->items as $item) {
                    if ($item->product) {
                        $item->product->decrement('stock', $item->qty);
                    }
                }

                // 2️⃣ Kirim email ke customer
                Mail::to($order->user->email)
                    ->send(new OrderConfirmedMail($order));
            });
        }
    }
}
