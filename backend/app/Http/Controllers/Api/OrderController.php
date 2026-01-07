<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class OrderController extends Controller
{
    public function checkout(Request $request)
    {
        $user = $request->user();
        $cart = $user->cart()->with('items.product')->first();

        if (!$cart || $cart->items->count() == 0) {
            return response()->json(['message' => 'Cart kosong'], 400);
        }

        DB::beginTransaction();

        $total = $cart->items->sum(fn($item) =>
            $item->product->price * $item->qty
        );

        $order = Order::create([
            'user_id' => $user->id,
            'invoice_number' => 'INV-' . time(),
            'total_price' => $total,
            'status' => 'pending_payment'
        ]);

        foreach ($cart->items as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item->product_id,
                'qty' => $item->qty,
                'price' => $item->product->price
            ]);
        }

        $cart->items()->delete();

        DB::commit();

        return response()->json($order);
    }
    public function uploadPaymentProof(Request $request, Order $order)
    {
        $request->validate([
            'payment_proof' => 'required|image|max:2048',
        ]);

        if ($request->user()->id !== $order->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $path = $request->file('payment_proof')->store('payment_proofs', 'public');

        $order->update([
            'payment_proof' => $path,
            'status' => 'waiting_confirmation'
        ]);

        return response()->json(['message' => 'Payment proof uploaded successfully']);
    }
}

