<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;

// Health check endpoint for deployment automation
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'timestamp' => now(),
        'version' => '1.0.0'
    ]);
});

// Public routes with rate limiting
Route::middleware('throttle:60,1')->group(function () {
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{product}', [ProductController::class, 'show']);
});

// Authentication routes with stricter rate limiting
Route::middleware('throttle:5,1')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Protected routes
Route::middleware(['auth:sanctum', 'throttle:120,1'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Product management (admin only)
    Route::middleware('admin')->group(function () {
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{product}', [ProductController::class, 'update']);
        Route::delete('/products/{product}', [ProductController::class, 'destroy']);
    });
});

// Admin routes with rate limiting
Route::prefix('admin')->middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard']);
    Route::get('/users', [AdminController::class, 'getUsers']);
    Route::post('/users/{id}/suspend', [AdminController::class, 'suspendUser']);
    Route::post('/users/{id}/unsuspend', [AdminController::class, 'unsuspendUser']);
    Route::post('/users/{id}/logout', [AdminController::class, 'logoutUser']);
    Route::post('/upload-image', [AdminController::class, 'uploadImage']);
});