<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\AdminController;

// Public routes
Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:5,1');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

// Products (public read access)
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);

// Reviews (public read access)
Route::get('/reviews', [ReviewController::class, 'index']);
Route::get('/reviews/{review}', [ReviewController::class, 'show']);

// Contact form (public)
Route::post('/contacts', [ContactController::class, 'store'])->middleware('throttle:3,1');

// Newsletter subscription (public)
Route::post('/newsletters', [NewsletterController::class, 'store'])->middleware('throttle:2,1');

// Protected routes
Route::middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Products (admin only for CUD operations)
    Route::post('/products', [ProductController::class, 'store'])->middleware('verified');
    Route::put('/products/{product}', [ProductController::class, 'update'])->middleware('verified');
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);

    // Reviews
    Route::post('/reviews', [ReviewController::class, 'store']);
    Route::put('/reviews/{review}', [ReviewController::class, 'update']);
    Route::delete('/reviews/{review}', [ReviewController::class, 'destroy']);

    // Orders
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store'])->middleware('verified');
    Route::get('/orders/{order}', [OrderController::class, 'show']);
    Route::put('/orders/{order}', [OrderController::class, 'update'])->middleware('verified');
    Route::delete('/orders/{order}', [OrderController::class, 'destroy']);

    // Contacts (admin access)
    Route::get('/contacts', [ContactController::class, 'index']);
    Route::get('/contacts/{contact}', [ContactController::class, 'show'])->middleware('verified');
    Route::put('/contacts/{contact}', [ContactController::class, 'update'])->middleware('verified');
    Route::delete('/contacts/{contact}', [ContactController::class, 'destroy']);

    // Newsletters (admin access)
    Route::get('/newsletters', [NewsletterController::class, 'index'])->middleware('verified');
    Route::get('/newsletters/{newsletter}', [NewsletterController::class, 'show'])->middleware('verified');
    Route::put('/newsletters/{newsletter}', [NewsletterController::class, 'update'])->middleware('verified');
    Route::delete('/newsletters/{newsletter}', [NewsletterController::class, 'destroy']);

    // Admin dashboard
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])->middleware('verified');
    Route::get('/admin/users', [AdminController::class, 'getUsers'])->middleware('verified');
    Route::post('/admin/users/{user}/suspend', [AdminController::class, 'suspendUser'])->middleware('verified');
    Route::post('/admin/users/{user}/logout', [AdminController::class, 'forceLogout'])->middleware('verified');
    Route::post('/admin/upload-image', [AdminController::class, 'uploadImage'])->middleware('verified');
});