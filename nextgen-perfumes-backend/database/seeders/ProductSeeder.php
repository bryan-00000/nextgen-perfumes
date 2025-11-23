<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run()
    {
        $products = [
            [
                'name' => 'Chanel No. 5',
                'description' => 'Iconic floral fragrance with notes of ylang-ylang, rose, and sandalwood',
                'price' => 120.00,
                'category' => 'womens',
                'image' => 'chanel-no5.jpg',
                'stock' => 50
            ],
            [
                'name' => 'Dior Sauvage',
                'description' => 'Fresh and raw fragrance with bergamot and pepper notes',
                'price' => 95.00,
                'category' => 'mens',
                'image' => 'dior-sauvage.jpg',
                'stock' => 30
            ],
            [
                'name' => 'Tom Ford Black Orchid',
                'description' => 'Luxurious unisex fragrance with dark chocolate and vanilla',
                'price' => 150.00,
                'category' => 'unisex',
                'image' => 'tom-ford-black-orchid.jpg',
                'stock' => 25
            ],
            [
                'name' => 'Luxury Gift Set',
                'description' => 'Premium collection featuring 3 bestselling fragrances',
                'price' => 200.00,
                'category' => 'gift_sets',
                'image' => 'luxury-gift-set.jpg',
                'stock' => 15
            ]
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}