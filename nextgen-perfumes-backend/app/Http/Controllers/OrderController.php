<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with(['user', 'products']);

        // Only show user's own orders unless admin
        $userId = (int) auth()->id();
        if ($userId > 0) {
            $query->where('user_id', $userId);
        } else {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email',
            'customer_phone' => 'required|string',
            'customer_location' => 'required|string',
            'products' => 'required|array',
            'products.*.id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
        ]);

        $totalAmount = 0;
        $orderProducts = [];

        foreach ($request->products as $productData) {
            $product = Product::find($productData['id']);
            $quantity = $productData['quantity'];
            $price = $product->price;
            
            $totalAmount += $price * $quantity;
            $orderProducts[$product->id] = [
                'quantity' => $quantity,
                'price' => $price,
            ];
        }

        $order = Order::create([
            'user_id' => auth()->id(),
            'customer_name' => $request->customer_name,
            'customer_email' => $request->customer_email,
            'customer_phone' => $request->customer_phone,
            'customer_location' => $request->customer_location,
            'total_amount' => $totalAmount,
        ]);

        $order->products()->attach($orderProducts);

        return response()->json($order->load(['user', 'products']), 201);
    }

    public function show(Order $order)
    {
        return response()->json($order->load(['user', 'products']));
    }

    public function update(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'in:pending,confirmed,shipped,delivered,cancelled',
        ]);

        $order->update($request->only(['status']));

        return response()->json($order->load(['user', 'products']));
    }

    public function destroy(Order $order)
    {
        $order->delete();

        return response()->json(['message' => 'Order deleted successfully']);
    }
}