<?php


use App\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;

Route::get('/products', [ProductController::class, 'index']);

Route::get('/auth/google/redirect', [AuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);

Route::post('/orders/fast', [OrderController::class, 'fastCheckout']);
Route::post('/coupons/validate', [\App\Http\Controllers\Api\CouponController::class, 'validateCode']);

Route::middleware(['auth:api', 'admin'])->prefix('admin')->group(function () {
    Route::get('/orders', [\App\Http\Controllers\Api\AdminController::class, 'getOrders']);
    Route::get('/users', [\App\Http\Controllers\Api\AdminController::class, 'getUsers']);
    Route::post('/products', [\App\Http\Controllers\Api\AdminController::class, 'createProduct']);
    Route::put('/products/{id}', [\App\Http\Controllers\Api\AdminController::class, 'updateProduct']);
    Route::delete('/products/{id}', [\App\Http\Controllers\Api\AdminController::class, 'deleteProduct']);
    
    // Coupons
    Route::get('/coupons', [\App\Http\Controllers\Api\CouponController::class, 'index']);
    Route::post('/coupons', [\App\Http\Controllers\Api\CouponController::class, 'store']);
    Route::put('/coupons/{id}/toggle', [\App\Http\Controllers\Api\CouponController::class, 'toggleStatus']);
    Route::delete('/coupons/{id}', [\App\Http\Controllers\Api\CouponController::class, 'destroy']);
});

Route::middleware('auth:api')->group(function () {
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'add']);
    Route::put('/cart/{productId}', [CartController::class, 'update']);
    Route::delete('/cart/{productId}', [CartController::class, 'remove']);
    
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders/confirm', [OrderController::class, 'confirm']);
});

