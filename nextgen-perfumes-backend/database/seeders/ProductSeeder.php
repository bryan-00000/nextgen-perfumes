<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'Velvet Rose',
                'price' => 50.00,
                'description' => 'Timeless elegance meets modern sophistication with notes of Bulgarian rose and vanilla.',
                'category' => 'womens',
                'image_url' => 'images/perfume-2.jpg',
                'is_featured' => true,
                'stock_quantity' => 25
            ],
            [
                'name' => 'Midnight Bloom',
                'price' => 60.00,
                'description' => 'Enchanting fragrances for unforgettable moments with jasmine and sandalwood.',
                'category' => 'womens',
                'image_url' => 'images/perfume-3.jpg',
                'is_featured' => true,
                'stock_quantity' => 30
            ],
            [
                'name' => 'Citrus Zest',
                'price' => 45.00,
                'description' => 'Fresh, vibrant scents that energize your day with bergamot and lemon.',
                'category' => 'unisex',
                'image_url' => 'images/perfume-4.jpg',
                'is_featured' => true,
                'stock_quantity' => 40
            ],
            [
                'name' => 'Ocean Breeze',
                'price' => 55.00,
                'description' => 'Refreshing aquatic notes for the free spirit with sea salt and mint.',
                'category' => 'mens',
                'image_url' => 'images/perfume-5.jpg',
                'is_featured' => true,
                'stock_quantity' => 20
            ],
            [
                'name' => 'Spiced Amber',
                'price' => 65.00,
                'description' => 'Warm and mysterious with amber, cinnamon, and cedar wood.',
                'category' => 'mens',
                'image_url' => 'images/perfume-6.jpg',
                'is_featured' => false,
                'stock_quantity' => 15
            ],
            [
                'name' => 'Jasmine Whisper',
                'price' => 30.00,
                'description' => 'Delicate floral notes perfect for everyday wear.',
                'category' => 'womens',
                'image_url' => 'images/perfume-7.jpg',
                'is_featured' => false,
                'stock_quantity' => 35
            ],
            [
                'name' => 'Rose Whisper',
                'price' => 40.00,
                'description' => 'Elegant rose petals with a hint of musk.',
                'category' => 'womens',
                'image_url' => 'images/perfume-8.jpg',
                'is_featured' => false,
                'stock_quantity' => 28
            ],
            [
                'name' => 'Petals Of Bloom',
                'price' => 10.00,
                'description' => 'Light and airy floral bouquet perfect for spring.',
                'category' => 'womens',
                'image_url' => 'images/perfume-9.jpg',
                'is_featured' => false,
                'stock_quantity' => 50
            ],
            [
                'name' => 'Ocean Mist',
                'price' => 80.00,
                'description' => 'Premium aquatic fragrance with marine accords.',
                'category' => 'unisex',
                'image_url' => 'images/perfume-10.jpg',
                'is_featured' => true,
                'stock_quantity' => 12
            ],
            [
                'name' => 'Noir Essence',
                'price' => 90.00,
                'description' => 'Sophisticated and bold with black pepper and leather.',
                'category' => 'mens',
                'image_url' => 'images/perfume-11.jpg',
                'is_featured' => true,
                'stock_quantity' => 8
            ],
            [
                'name' => 'Luxury Gift Set',
                'price' => 120.00,
                'description' => 'Premium gift set with three 30ml fragrances.',
                'category' => 'gift_sets',
                'image_url' => 'images/gift-set-perfume.jpg',
                'is_featured' => true,
                'stock_quantity' => 10
            ]
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}