<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;

class ProductController extends Controller
{
    // GET /api/products
    public function index()
    {
        return response()->json([
            'success' => true,
            'message' => 'List products',
            'data' => Product::with('category:id,name')
                ->select('id', 'category_id', 'name', 'price', 'stock', 'image')
                ->latest()
                ->get(),
        ], 200);
    }

    // GET /api/products/{id}
    public function show($id)
    {
        $product = Product::with('category:id,name')->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Product detail',
            'data' => $product,
        ], 200);
    }
}
