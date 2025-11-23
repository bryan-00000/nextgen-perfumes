<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Order;
use App\Models\User;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function dashboard()
    {
        $stats = [
            'total_sales' => Order::sum('total_amount') ?? 0,
            'total_orders' => Order::count() ?? 0,
            'total_customers' => User::count() ?? 0,
            'total_stock' => Product::sum('stock_quantity') ?? 0,
            'sales_growth' => $this->getSalesGrowth(),
            'orders_growth' => $this->getOrdersGrowth(),
            'customers_growth' => $this->getCustomersGrowth(),
        ];

        $bestSelling = Product::select('products.*', DB::raw('COALESCE(SUM(order_product.quantity), 0) as total_sold'))
            ->leftJoin('order_product', 'products.id', '=', 'order_product.product_id')
            ->groupBy('products.id')
            ->orderBy('total_sold', 'desc')
            ->limit(5)
            ->get();

        $categoryStats = Product::select('category', DB::raw('COUNT(*) as count'))
            ->groupBy('category')
            ->get();

        $recentOrders = Order::with(['user', 'products'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return response()->json([
            'stats' => $stats,
            'best_selling' => $bestSelling,
            'category_stats' => $categoryStats,
            'recent_orders' => $recentOrders,
        ]);
    }

    private function getSalesGrowth()
    {
        $currentMonth = Order::whereMonth('created_at', now()->month)->sum('total_amount') ?? 0;
        $lastMonth = Order::whereMonth('created_at', now()->subMonth()->month)->sum('total_amount') ?? 0;
        
        return $lastMonth > 0 ? (($currentMonth - $lastMonth) / $lastMonth) * 100 : 0;
    }

    private function getOrdersGrowth()
    {
        $currentMonth = Order::whereMonth('created_at', now()->month)->count() ?? 0;
        $lastMonth = Order::whereMonth('created_at', now()->subMonth()->month)->count() ?? 0;
        
        return $lastMonth > 0 ? (($currentMonth - $lastMonth) / $lastMonth) * 100 : 0;
    }

    private function getCustomersGrowth()
    {
        $currentMonth = User::whereMonth('created_at', now()->month)->count() ?? 0;
        $lastMonth = User::whereMonth('created_at', now()->subMonth()->month)->count() ?? 0;
        
        return $lastMonth > 0 ? (($currentMonth - $lastMonth) / $lastMonth) * 100 : 0;
    }

    public function getUsers()
    {
        $users = User::select('id', 'username', 'email', 'created_at', 'is_suspended', 'last_login')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($users);
    }

    public function suspendUser(User $user)
    {
        $user->update(['is_suspended' => !$user->is_suspended]);
        
        // Revoke all tokens if suspending
        if ($user->is_suspended) {
            $user->tokens()->delete();
        }

        return response()->json([
            'message' => $user->is_suspended ? 'User suspended' : 'User unsuspended',
            'user' => $user
        ]);
    }

    public function forceLogout(User $user)
    {
        $user->tokens()->delete();
        $user->update(['last_login' => null]);

        return response()->json(['message' => 'User logged out successfully']);
    }

    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $filename = time() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('images'), $filename);
            
            return response()->json([
                'success' => true,
                'image_url' => 'images/' . $filename
            ]);
        }

        return response()->json(['success' => false, 'message' => 'No image uploaded'], 400);
    }
}