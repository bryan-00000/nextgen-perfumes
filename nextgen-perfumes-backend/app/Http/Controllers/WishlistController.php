<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{
    public function index()
    {
        $wishlists = Auth::user()->wishlists()->with('product')->get();
        return response()->json($wishlists);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id'
        ]);

        $wishlist = Wishlist::firstOrCreate([
            'user_id' => Auth::id(),
            'product_id' => $request->product_id
        ]);

        return response()->json([
            'message' => 'Product added to wishlist',
            'wishlist' => $wishlist->load('product')
        ]);
    }

    public function destroy($productId)
    {
        $wishlist = Wishlist::where('user_id', Auth::id())
                           ->where('product_id', $productId)
                           ->first();

        if (!$wishlist) {
            return response()->json(['message' => 'Product not in wishlist'], 404);
        }

        $wishlist->delete();
        return response()->json(['message' => 'Product removed from wishlist']);
    }

    public function check($productId)
    {
        $exists = Wishlist::where('user_id', Auth::id())
                         ->where('product_id', $productId)
                         ->exists();

        return response()->json(['in_wishlist' => $exists]);
    }
}