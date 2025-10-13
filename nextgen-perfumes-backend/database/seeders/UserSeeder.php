<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'username' => 'admin',
            'email' => 'admin@nextgenperfumes.com',
            'password' => Hash::make('password123')
        ]);

        User::create([
            'username' => 'testuser',
            'email' => 'test@example.com',
            'password' => Hash::make('password123')
        ]);
    }
}