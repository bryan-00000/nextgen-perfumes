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
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'category' => 'required|in:mens,womens,unisex,gift_sets',
            'description' => 'nullable|string|max:1000',
            'image_url' => 'nullable|string',
            'stock_quantity' => 'integer|min:0',
        ]);

        $product = Product::create($request->all());

        return response()->json($product, 201);
    }

    public function show(Product $product)
    {
        return response()->json($product->load('reviews'));
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'string|max:255',
            'price' => 'numeric|min:0',
            'category' => 'in:mens,womens,unisex,gift_sets',
            'description' => 'nullable|string|max:1000',
            'image_url' => 'nullable|string',
            'stock_quantity' => 'integer|min:0',
        ]);

        $product->update($request->all());

        return response()->json($product);
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }
}