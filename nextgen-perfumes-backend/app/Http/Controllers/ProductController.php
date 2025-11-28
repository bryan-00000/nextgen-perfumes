<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['reviews']);

        // Search functionality
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%")
                  ->orWhere('brand', 'LIKE', "%{$search}%");
            });
        }

        // Category filter
        if ($request->has('category')) {
            $validated = $request->validate(['category' => 'in:mens,womens,unisex,gift_sets']);
            $query->where('category', '=', $validated['category']);
        }

        // Price range filter
        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->get('min_price'));
        }
        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->get('max_price'));
        }

        // Brand filter
        if ($request->has('brand')) {
            $query->where('brand', $request->get('brand'));
        }

        // Rating filter
        if ($request->has('min_rating')) {
            $minRating = $request->get('min_rating');
            $query->whereHas('reviews', function($q) use ($minRating) {
                $q->havingRaw('AVG(rating) >= ?', [$minRating]);
            });
        }

        // Featured filter
        if ($request->has('featured')) {
            $query->where('is_featured', true);
        }

        // Sorting
        $sort = $request->get('sort');
        if ($sort === 'price_asc') {
            $query->orderBy('price', 'asc');
        } elseif ($sort === 'price_desc') {
            $query->orderBy('price', 'desc');
        } else {
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            
            if ($sortBy === 'rating') {
                $query->withAvg('reviews', 'rating')->orderBy('reviews_avg_rating', $sortOrder);
            } elseif ($sortBy === 'price') {
                $query->orderBy('price', $sortOrder);
            } else {
                $query->orderBy($sortBy, $sortOrder);
            }
        }

        $perPage = $request->get('per_page', 12);
        $products = $query->paginate($perPage);
        
        // Add average rating to each product
        $products->getCollection()->transform(function ($product) {
            $product->average_rating = $product->averageRating();
            $product->review_count = $product->reviewCount();
            return $product;
        });
        
        return response()->json($products);
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
                'gallery_images' => 'nullable|array',
                'brand' => 'nullable|string|max:100',
                'size' => 'nullable|string|max:50',
                'fragrance_notes' => 'nullable|array',
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
        $product->load(['reviews.user']);
        $product->average_rating = $product->averageRating();
        $product->review_count = $product->reviewCount();
        
        return response()->json($product);
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
                'gallery_images' => 'nullable|array',
                'brand' => 'nullable|string|max:100',
                'size' => 'nullable|string|max:50',
                'fragrance_notes' => 'nullable|array',
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

    public function random(Request $request)
    {
        $query = Product::with(['reviews']);

        // Category filter
        if ($request->has('category')) {
            $validated = $request->validate(['category' => 'in:mens,womens,unisex,gift_sets']);
            $query->where('category', '=', $validated['category']);
        }

        $limit = $request->get('limit', 10);
        $products = $query->inRandomOrder()->limit($limit)->get();
        
        // Add average rating to each product
        $products->transform(function ($product) {
            $product->average_rating = $product->averageRating();
            $product->review_count = $product->reviewCount();
            return $product;
        });
        
        return response()->json([
            'data' => $products,
            'total' => $products->count()
        ]);
    }
}