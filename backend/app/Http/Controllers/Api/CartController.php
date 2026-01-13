<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    public function index()
    {
        try {
            $cart = Cart::firstOrCreate(['user_id' => Auth::id()]);

            $cartItems = CartItem::with('product.category')
                ->where('cart_id', $cart->id)
                ->get();

            return response()->json([
                'success' => true,
                'cart_id' => $cart->id,
                'items' => $cartItems
            ], 200);
        } catch (\Exception $e) {
            Log::error('Cart index error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error fetching cart',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function add(Request $request)
    {
        try {
            Log::info('Add to cart - START', [
                'user_id' => Auth::id(),
                'request_data' => $request->all()
            ]);

            $validated = $request->validate([
                'product_id' => 'required|exists:products,id',
                'quantity' => 'required|integer|min:1'
            ]);

            $product = Product::findOrFail($validated['product_id']);

            if ($product->stock < $validated['quantity']) {
                return response()->json([
                    'success' => false,
                    'message' => 'Stok tidak mencukupi'
                ], 400);
            }

            DB::beginTransaction();

            $cart = Cart::firstOrCreate(['user_id' => Auth::id()]);
            Log::info('Cart found/created', ['cart_id' => $cart->id]);

            $existingItem = CartItem::where('cart_id', $cart->id)
                ->where('product_id', $validated['product_id'])
                ->first();

            if ($existingItem) {
                $newQty = $existingItem->qty + $validated['quantity'];

                if ($product->stock < $newQty) {
                    DB::rollBack();
                    return response()->json([
                        'success' => false,
                        'message' => 'Stok tidak mencukupi'
                    ], 400);
                }

                $existingItem->qty = $newQty;
                $existingItem->save();

                Log::info('Cart item updated', ['item_id' => $existingItem->id]);
                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Jumlah produk diperbarui',
                    'cart_item' => $existingItem->load('product')
                ], 200);
            } else {
                $cartItem = CartItem::create([
                    'cart_id' => $cart->id,
                    'product_id' => $validated['product_id'],
                    'qty' => $validated['quantity'],
                    'price' => $product->price
                ]);

                Log::info('Cart item created', ['item_id' => $cartItem->id]);
                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Produk berhasil ditambahkan',
                    'cart_item' => $cartItem->load('product')
                ], 201);
            }

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Add to cart ERROR', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error adding to cart',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'quantity' => 'required|integer|min:1'
            ]);

            $cart = Cart::where('user_id', Auth::id())->firstOrFail();
            $cartItem = CartItem::where('cart_id', $cart->id)->where('id', $id)->firstOrFail();

            $cartItem->qty = $validated['quantity'];
            $cartItem->save();

            return response()->json([
                'success' => true,
                'message' => 'Keranjang diperbarui',
                'cart_item' => $cartItem->load('product')
            ], 200);
        } catch (\Exception $e) {
            Log::error('Update cart error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error updating cart',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $cart = Cart::where('user_id', Auth::id())->firstOrFail();
            $cartItem = CartItem::where('cart_id', $cart->id)->where('id', $id)->firstOrFail();
            $cartItem->delete();

            return response()->json([
                'success' => true,
                'message' => 'Item dihapus'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Delete cart error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error removing item',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
