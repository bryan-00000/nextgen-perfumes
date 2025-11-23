<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query();

        if ($request->has('category')) {
            $validated = $request->validate(['category' => 'in:mens,womens,unisex,gift_sets']);
            $query->where('category', '=', $validated['category']);
        }

        if ($request->has('featured')) {
            $query->where('is_featured', true);
        }

        $perPage = $request->get('per_page', 10);
        
        return response()->json($query->paginate($perPage));
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'price' => 'required|numeric|min:0',
                'category' => 'required|in:mens,womens,unisex,gift_sets',
                'description' => 'nullable|string|max:1000',
                'image_url' => 'nullable|string',
                'stock_quantity' => 'sometimes|integer|min:0',
            ]);

            $product = Product::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Product created successfully',
                'product' => $product
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create product: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show(Product $product)
    {
        return response()->json($product->load('reviews'));
    }

    public function update(Request $request, Product $product)
    {
        try {
            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'price' => 'sometimes|numeric|min:0',
                'category' => 'sometimes|in:mens,womens,unisex,gift_sets',
                'description' => 'nullable|string|max:1000',
                'image_url' => 'nullable|string',
                'stock_quantity' => 'sometimes|integer|min:0',
            ]);

            $product->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Product updated successfully',
                'product' => $product->fresh()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update product: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }
}