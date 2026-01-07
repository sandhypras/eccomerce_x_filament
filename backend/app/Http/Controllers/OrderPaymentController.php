<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;

class OrderPaymentController extends Controller
{
    public function upload(Request $request, Order $order)
    {
        $request->validate([
            'payment_proof' => 'required|image|mimes:jpg,png,jpeg|max:2048',
        ]);

        $path = $request->file('payment_proof')->store('payments', 'public');

        $order->update([
            'payment_proof' => $path,
            'status' => 'waiting_confirmation',
        ]);

        return response()->json([
            'message' => 'Bukti pembayaran berhasil dikirim',
            'data' => $order,
        ]);
    }
}

