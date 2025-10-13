<?php

namespace Database\Seeders;

use App\Models\Review;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        $reviews = [
            [
                'user_id' => 1,
                'product_id' => 1,
                'name' => 'Sarah Johnson',
                'rating' => 5,
                'comment' => 'Absolutely love this perfume! The scent lasts all day and I get compliments everywhere I go.'
            ],
            [
                'user_id' => 2,
                'product_id' => 2,
                'name' => 'Mike Chen',
                'rating' => 4,
                'comment' => 'Great fragrance, very sophisticated. Perfect for evening events.'
            ],
            [
                'user_id' => 1,
                'product_id' => 3,
                'name' => 'Emma Davis',
                'rating' => 5,
                'comment' => 'Fresh and energizing! Perfect for daily wear, not too overpowering.'
            ],
            [
                'user_id' => 2,
                'product_id' => 4,
                'name' => 'Alex Rodriguez',
                'rating' => 4,
                'comment' => 'Clean and refreshing scent. Reminds me of ocean vacations.'
            ]
        ];

        foreach ($reviews as $review) {
            Review::create($review);
        }
    }
}