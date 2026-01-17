<?php
// app/Http/Controllers/Api/OtpRegistrationController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EmailOtp;
use App\Models\User;
use App\Mail\OtpMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class OtpRegistrationController extends Controller
{
    /**
     * Step 1: Send OTP to email
     */
    public function sendOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string|max:20',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Check if user already exists
            if (User::where('email', $request->email)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email sudah terdaftar'
                ], 422);
            }

            // Generate OTP
            $otp = EmailOtp::generateOtp();

            // Delete old OTPs for this email
            EmailOtp::where('email', $request->email)->delete();

            // Save OTP to database
            EmailOtp::create([
                'email' => $request->email,
                'otp' => $otp,
                'expires_at' => Carbon::now()->addMinutes(5) // OTP valid for 5 minutes
            ]);

            // Send email
            Mail::to($request->email)->send(new OtpMail($otp, $request->name));

            return response()->json([
                'success' => true,
                'message' => 'Kode OTP telah dikirim ke email Anda',
                'data' => [
                    'email' => $request->email,
                    'expires_in_seconds' => 300 // 5 minutes
                ]
            ], 200);

        } catch (\Exception $e) {
            \Log::error('OTP Send Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Gagal mengirim OTP: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Step 2: Verify OTP and Create User
     */
    public function verifyOtpAndRegister(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'required|string|max:20',
            'password' => 'required|string|min:6',
            'otp' => 'required|string|size:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Find OTP record
            $otpRecord = EmailOtp::where('email', $request->email)
                                ->where('otp', $request->otp)
                                ->where('is_used', false)
                                ->first();

            if (!$otpRecord) {
                return response()->json([
                    'success' => false,
                    'message' => 'Kode OTP tidak valid'
                ], 422);
            }

            // Check if OTP is expired
            if (!$otpRecord->isValid()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Kode OTP sudah kadaluarsa'
                ], 422);
            }

            // Check if user already exists
            if (User::where('email', $request->email)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email sudah terdaftar'
                ], 422);
            }

            // Create user
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'password' => Hash::make($request->password),
                'email_verified_at' => now() // Auto verify email
            ]);

            // Mark OTP as used
            $otpRecord->markAsUsed();

            // Generate token
            $token = $user->createToken('auth_token')->plainTextToken;

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Registrasi berhasil',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'phone' => $user->phone,
                    ],
                    'access_token' => $token,
                    'token_type' => 'Bearer'
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('OTP Verification Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Gagal memverifikasi OTP: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Resend OTP
     */
    public function resendOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'name' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Check if user already exists
            if (User::where('email', $request->email)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email sudah terdaftar'
                ], 422);
            }

            // Generate new OTP
            $otp = EmailOtp::generateOtp();

            // Delete old OTPs
            EmailOtp::where('email', $request->email)->delete();

            // Save new OTP
            EmailOtp::create([
                'email' => $request->email,
                'otp' => $otp,
                'expires_at' => Carbon::now()->addMinutes(5)
            ]);

            // Send email
            Mail::to($request->email)->send(new OtpMail($otp, $request->name));

            return response()->json([
                'success' => true,
                'message' => 'Kode OTP baru telah dikirim',
                'data' => [
                    'email' => $request->email,
                    'expires_in_seconds' => 300
                ]
            ], 200);

        } catch (\Exception $e) {
            \Log::error('OTP Resend Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Gagal mengirim ulang OTP'
            ], 500);
        }
    }
}
