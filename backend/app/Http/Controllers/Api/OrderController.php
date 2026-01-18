<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Mail;
use App\Mail\OrderNotificationMail;

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
                'shipping_address' => $order->shipping_address ?? null,
                'phone' => $order->phone ?? null,
                'notes' => $order->notes ?? null,
                'payment_method' => $order->payment_method ?? 'transfer',
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
                        'qty' => $item->qty,
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
     * Checkout - membuat order baru dari cart dengan info pengiriman
     */
    public function checkout(Request $request)
    {
        // Validasi input
        $validated = $request->validate([
            'shipping_address' => 'required|string|max:500',
            'phone' => 'required|string|max:20',
            'notes' => 'nullable|string|max:500',
            'payment_method' => 'nullable|string|in:transfer,cod',
        ]);

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

            // Generate invoice number
            $invoiceNumber = 'INV-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -6));

            $order = Order::create([
                'user_id' => $user->id,
                'invoice_number' => $invoiceNumber,
                'total_price' => $total,
                'shipping_address' => $validated['shipping_address'],
                'phone' => $validated['phone'],
                'notes' => $validated['notes'] ?? null,
                'payment_method' => $validated['payment_method'] ?? 'transfer',
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

            // Load relationships untuk response
            $order->load(['items.product', 'user']);

            return response()->json([
                'success' => true,
                'message' => 'Checkout berhasil',
                'order' => [
                    'id' => $order->id,
                    'order_number' => $order->invoice_number,
                    'total' => $order->total_price,
                    'status' => $order->status,
                ],
                'data' => $order
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Checkout error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Checkout gagal: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload bukti pembayaran dan kirim email ke admin
     */
    public function uploadPaymentProof(Request $request, Order $order)
    {
        $request->validate([
            'payment_proof' => 'required|image|mimes:jpeg,jpg,png|max:5120', // max 5MB
        ]);

        if ($request->user()->id !== $order->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            // Hapus file lama jika ada
            if ($order->payment_proof) {
                Storage::disk('public')->delete($order->payment_proof);
            }

            // Simpan file baru
            $path = $request->file('payment_proof')->store('payment_proofs', 'public');

            // Update order
            $order->update([
                'payment_proof' => $path,
                'status' => 'waiting_confirmation'
            ]);

            // Load relationships untuk email
            $order->load(['user', 'items.product']);

            // Kirim email ke admin
            $adminEmail = env('ADMIN_EMAIL', 'sandhyprasetyo41@gmail.com');

            try {
                Mail::to($adminEmail)->send(new OrderNotificationMail($order, $path));
                \Log::info('✅ Email berhasil dikirim ke admin: ' . $adminEmail . ' untuk order: ' . $order->invoice_number);
            } catch (\Exception $mailError) {
                // Log error tapi jangan gagalkan request
                \Log::error('❌ Gagal mengirim email: ' . $mailError->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => 'Bukti pembayaran berhasil diupload dan notifikasi dikirim ke admin',
                'data' => [
                    'payment_proof_url' => asset('storage/' . $path),
                    'status' => $order->status
                ]
            ]);

        } catch (\Exception $e) {
            \Log::error('Upload payment proof error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengupload bukti pembayaran: ' . $e->getMessage()
            ], 500);
        }
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
