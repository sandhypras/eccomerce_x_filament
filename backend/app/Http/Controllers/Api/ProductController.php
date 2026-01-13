<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Product::with('category');

            // Filter by category if provided
            if ($request->has('category_id')) {
                $query->where('category_id', $request->category_id);
            }

            $products = $query->get();

            // Add full image URL
            $products->transform(function ($product) {
                if ($product->image) {
                    $product->image_url = asset('storage/' . $product->image);
                } else {
                    $product->image_url = null;
                }
                return $product;
            });

            return response()->json($products, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching products',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $product = Product::with('category')->findOrFail($id);

            if ($product->image) {
                $product->image_url = asset('storage/' . $product->image);
            } else {
                $product->image_url = null;
            }

            return response()->json($product, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Product not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

   public function search(Request $request)
{
    try {
        $query = $request->input('q');

        if (!$query) {
            return response()->json([], 200);
        }

        $products = Product::with('category')
            ->where('name', 'LIKE', "%{$query}%")
            ->orWhere('description', 'LIKE', "%{$query}%")
            ->get();

        // Add full image URL
        $products->transform(function ($product) {
            if ($product->image) {
                $product->image_url = asset('storage/' . $product->image);
            } else {
                $product->image_url = null;
            }
            return $product;
        });

        return response()->json($products, 200);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Error searching products',
            'error' => $e->getMessage()
        ], 500);
    }
}
}
