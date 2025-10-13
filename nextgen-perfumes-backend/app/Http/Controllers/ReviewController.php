<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        $query = Review::with(['user', 'product']);

        if ($request->has('product_id')) {
            $validated = $request->validate(['product_id' => 'integer|exists:products,id']);
            // ensure a typed scalar value is used for the query parameter
            $productId = (int) $validated['product_id'];
            $query->where('product_id', $productId);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'nullable|exists:products,id',
            'name' => 'required|string|max:255',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string',
        ]);

        $review = Review::create([
            'user_id' => auth()->id(),
            'product_id' => $request->product_id,
            'name' => $request->name,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return response()->json($review->load(['user', 'product']), 201);
    }

    public function show(Review $review)
    {
        return response()->json($review->load(['user', 'product']));
    }

    public function update(Request $request, Review $review)
    {
        $request->validate([
            'rating' => 'integer|min:1|max:5',
            'comment' => 'string',
        ]);

        $review->update($request->only(['rating', 'comment']));

        return response()->json($review->load(['user', 'product']));
    }

    public function destroy(Review $review)
    {
        $review->delete();

        return response()->json(['message' => 'Review deleted successfully']);
    }
}