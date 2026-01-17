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
    /**
     * Menampilkan semua order milik user yang login
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // Ambil semua order user dengan relasi items dan product
        $orders = Order::where('user_id', $user->id)
            ->with(['items.product']) // Eager load untuk performa
            ->orderBy('created_at', 'desc')
            ->get();

        // Transform data untuk response yang lebih sesuai dengan frontend
        $transformedOrders = $orders->map(function ($order) {
            return [
                'id' => $order->id,
                'order_number' => $order->invoice_number,
                'user_id' => $order->user_id,
                'total_amount' => $order->total_price,
                'total' => $order->total_price, // Alias
                'status' => $order->status,
                'payment_proof' => $order->payment_proof ? url('storage/' . str_replace('storage/', '', $order->payment_proof)) : null,
                'created_at' => $order->created_at,
                'updated_at' => $order->updated_at,
                'items' => $order->items->map(function ($item) {

                    // --- PERBAIKAN LOGIKA GAMBAR DISINI ---
                    $product = $item->product;

                    // 1. Cek berbagai kemungkinan nama kolom di database (image atau image_url)
                    $dbImage = $product->image ?? $product->image_url ?? null;
                    $finalImageUrl = null;

                    if ($dbImage) {
                        // Jika di database sudah tersimpan link lengkap (https://...)
                        if (str_starts_with($dbImage, 'http')) {
                            $finalImageUrl = $dbImage;
                        } else {
                            // Bersihkan path dari 'public/' atau 'storage/' agar tidak double saat digabung
                            $cleanPath = str_replace(['public/', 'storage/'], '', $dbImage);
                            // Generate URL lengkap localhost:8000/storage/...
                            $finalImageUrl = asset('storage/' . $cleanPath);
                        }
                    }
                    // --------------------------------------

                    return [
                        'id' => $item->id,
                        'product_id' => $item->product_id,
                        'product_name' => $product->name ?? 'Unknown Product',
                        'name' => $product->name ?? 'Unknown Product',
                        'quantity' => $item->qty,
                        'price' => $item->price,
                        'image_url' => $finalImageUrl, // Kirim URL yang sudah diproses
                        'image' => $finalImageUrl,     // Kirim sebagai 'image' juga untuk jaga-jaga
                    ];
                })
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $transformedOrders
        ]);
    }

    /**
     * Checkout - membuat order baru dari cart
     */
    public function checkout(Request $request)
    {
        $user = $request->user();
        $cart = $user->cart()->with('items.product')->first();

        if (!$cart || $cart->items->count() == 0) {
            return response()->json(['message' => 'Cart kosong'], 400);
        }

        DB::beginTransaction();

        try {
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

            // Hapus cart items setelah checkout
            $cart->items()->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Checkout berhasil',
                'data' => $order->load('items.product')
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Checkout gagal: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload bukti pembayaran
     */
    public function uploadPaymentProof(Request $request, Order $order)
    {
        $request->validate([
            'payment_proof' => 'required|image|max:2048',
        ]);

        if ($request->user()->id !== $order->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($order->payment_proof) {
            Storage::disk('public')->delete($order->payment_proof);
        }

        // Simpan file
        $path = $request->file('payment_proof')->store('payment_proofs', 'public');

        $order->update([
            'payment_proof' => $path,
            'status' => 'waiting_confirmation'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Payment proof uploaded successfully',
            'data' => [
                'payment_proof_url' => asset('storage/' . $path),
                'status' => $order->status
            ]
        ]);
    }

    /**
     * Menampilkan detail order tertentu
     */
    public function show(Request $request, Order $order)
    {
        if ($request->user()->id !== $order->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $order->load('items.product');

        return response()->json([
            'success' => true,
            'data' => $order
        ]);
    }
}
