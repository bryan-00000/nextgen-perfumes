<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        $query = Review::with(['user', 'product']);

        if ($request->has('product_id')) {
            $query->where('product_id', $request->get('product_id'));
        }

        if ($request->has('rating')) {
            $query->where('rating', $request->get('rating'));
        }

        $reviews = $query->orderBy('created_at', 'desc')->paginate(10);
        
        return response()->json($reviews);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:1000'
        ]);

        // Check if user already reviewed this product
        $existingReview = Review::where('user_id', Auth::id())
                               ->where('product_id', $validated['product_id'])
                               ->first();

        if ($existingReview) {
            return response()->json([
                'message' => 'You have already reviewed this product'
            ], 422);
        }

        $review = Review::create([
            'user_id' => Auth::id(),
            'product_id' => $validated['product_id'],
            'name' => Auth::user()->username,
            'rating' => $validated['rating'],
            'comment' => $validated['comment']
        ]);

        return response()->json([
            'message' => 'Review created successfully',
            'review' => $review->load(['user', 'product'])
        ], 201);
    }

    public function update(Request $request, Review $review)
    {
        if ($review->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'rating' => 'sometimes|integer|min:1|max:5',
            'comment' => 'sometimes|string|max:1000'
        ]);

        $review->update($validated);

        return response()->json([
            'message' => 'Review updated successfully',
            'review' => $review->fresh(['user', 'product'])
        ]);
    }

    public function destroy(Review $review)
    {
        if ($review->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $review->delete();

        return response()->json(['message' => 'Review deleted successfully']);
    }

    public function userReviews()
    {
        $reviews = Auth::user()->reviews()
                      ->with('product')
                      ->orderBy('created_at', 'desc')
                      ->get();

        return response()->json($reviews);
    }
}