<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;

class CartController extends Controller
{
    /* ===================== ADD TO CART ===================== */
    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'qty' => 'required|integer|min:1',
        ]);

        $user = $request->user();

        // 1️⃣ ambil atau buat cart
        $cart = Cart::firstOrCreate([
            'user_id' => $user->id
        ]);

        // 2️⃣ cek apakah item sudah ada
        $item = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $request->product_id)
            ->first();

        if ($item) {
            // update qty
            $item->update([
                'qty' => $item->qty + $request->qty,
            ]);
        } else {
            // ambil harga produk
            $product = Product::findOrFail($request->product_id);

            CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $product->id,
                'qty' => $request->qty,
                'price' => $product->price,
            ]);
        }

        return response()->json([
            'message' => 'Produk berhasil ditambahkan ke cart'
        ]);
    }
    /* ===================== VIEW CART ===================== */
    public function index(Request $request)
{
    $cart = Cart::with('items.product')
        ->where('user_id', $request->user()->id)
        ->first();

    if (!$cart) {
        return response()->json([
            'items' => [],
            'total' => 0,
        ]);
    }

    $total = $cart->items->sum(fn ($item) => $item->qty * $item->price);

    return response()->json([
        'items' => $cart->items,
        'total' => $total,
    ]);
}
    /* ===================== UPDATE CART ITEM ===================== */
    public function update(Request $request, $id)
    {
        $request->validate([
            'qty' => 'required|integer|min:1',
        ]);

        $user = $request->user();

        $cart = Cart::where('user_id', $user->id)->firstOrFail();

        $item = CartItem::where('cart_id', $cart->id)
            ->where('id', $id)
            ->firstOrFail();

        $item->update([
            'qty' => $request->qty,
        ]);

        return response()->json([
            'message' => 'Cart item berhasil diperbarui'
        ]);
    }
    /* ===================== DELETE CART ITEM ===================== */
    public function destroy(Request $request, $id)
{
    $item = CartItem::whereHas('cart', function ($q) use ($request) {
        $q->where('user_id', $request->user()->id);
    })->findOrFail($id);

    $item->delete();

    return response()->json([
        'message' => 'Item berhasil dihapus dari cart',
    ]);
}
}
