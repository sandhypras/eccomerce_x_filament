<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\OrderPaymentController;
use App\Http\Controllers\Api\OtpRegistrationController;
use App\Http\Controllers\Api\ProfileController;
// TAMBAHKAN INI

// ROUTES FOR PUBLIC ACCESS
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/search', [ProductController::class, 'search']);

// Authentication Routes
Route::post('/register', [AuthController::class, 'register']); // Keep for backup
Route::post('/login', [AuthController::class, 'login']);


// OTP REGISTRATION ROUTES (NEW)
Route::prefix('register')->group(function () {
    Route::post('/send-otp', [OtpRegistrationController::class, 'sendOtp']);
    Route::post('/verify-otp', [OtpRegistrationController::class, 'verifyOtpAndRegister']);
    Route::post('/resend-otp', [OtpRegistrationController::class, 'resendOtp']);
});

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/cart', [CartController::class, 'add']);
    Route::get('/cart', [CartController::class, 'index']);
    Route::put('/cart/{id}', [CartController::class, 'update']);
    Route::delete('/cart/{id}', [CartController::class, 'destroy']);
    Route::post('/checkout', [OrderController::class, 'checkout']);
    Route::post('/orders/{order}/upload-payment-proof', [OrderPaymentController::class, 'upload']);
     Route::get('/orders', [OrderController::class, 'index']);
      Route::get('/orders', [OrderController::class, 'index']); // List semua order user
    Route::get('/orders/{order}', [OrderController::class, 'show']);
      Route::put('/profile/update', [ProfileController::class, 'update']);
    Route::put('/profile/change-password', [ProfileController::class, 'changePassword']);

});
