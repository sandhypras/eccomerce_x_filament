<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        try {
            $categories = Category::all();

            // Add full image URL
            $categories->transform(function ($category) {
                if ($category->image) {
                    // Generate full URL
                    $category->image_url = url('storage/' . $category->image);
                } else {
                    $category->image_url = null;
                }
                return $category;
            });

            return response()->json($categories, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching categories',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $category = Category::findOrFail($id);

            if ($category->image) {
                $category->image_url = url('storage/' . $category->image);
            } else {
                $category->image_url = null;
            }

            return response()->json($category, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Category not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }
}
