<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;

class CategoryController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'message' => 'List categories',
            'data' => Category::select('id', 'name', 'image')
                ->latest()
                ->get(),
        ], 200);
    }
}
