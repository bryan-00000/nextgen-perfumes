<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Product;
use Illuminate\Support\Facades\Mail;

class InventoryCheck extends Command
{
    protected $signature = 'inventory:check {--threshold=10 : Stock threshold for low stock alerts}';
    protected $description = 'Check inventory levels and send alerts';

    public function handle()
    {
        $threshold = $this->option('threshold') ?: env('LOW_STOCK_THRESHOLD', 10);
        $lowStockProducts = Product::where('stock', '<', $threshold)->where('stock', '>', 0)->get();
        $outOfStockProducts = Product::where('stock', '<=', 0)->get();

        // Deactivate out of stock products
        foreach ($outOfStockProducts as $product) {
            $product->update(['is_active' => false]);
        }

        // Send low stock alerts
        if ($lowStockProducts->count() > 0) {
            Mail::raw(
                "Low stock alert:\n" . $lowStockProducts->pluck('name', 'stock')->implode("\n"),
                function ($message) {
                    $message->to(env('ADMIN_EMAIL', config('mail.admin_email')))
                           ->subject('Low Stock Alert - NextGen Perfumes');
                }
            );
        }

        $this->info("Inventory check completed. Low stock: {$lowStockProducts->count()}, Out of stock: {$outOfStockProducts->count()}");
    }
}