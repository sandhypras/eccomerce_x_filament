<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Otp;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class OtpAuthController extends Controller
{
    // Kirim OTP ke email
    public function sendOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        // Cek apakah user ada
        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Email tidak terdaftar'
            ], 404);
        }

        // Generate OTP 6 digit
        $otpCode = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Simpan OTP ke database (berlaku 5 menit)
        Otp::create([
            'email' => $request->email,
            'otp' => $otpCode,
            'expires_at' => now()->addMinutes(5),
            'is_used' => false
        ]);

        // Kirim email (PENTING: Setup mail config dulu!)
        try {
            Mail::raw(
                "Kode OTP Anda adalah: {$otpCode}\n\nKode berlaku selama 5 menit.",
                function ($message) use ($request) {
                    $message->to($request->email)
                            ->subject('Kode OTP Login - TokoKu');
                }
            );

            return response()->json([
                'success' => true,
                'message' => 'Kode OTP telah dikirim ke email Anda',
                // HANYA UNTUK DEVELOPMENT - HAPUS DI PRODUCTION!
                'otp_debug' => config('app.debug') ? $otpCode : null
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengirim email. ' . $e->getMessage(),
                // HANYA UNTUK DEVELOPMENT - HAPUS DI PRODUCTION!
                'otp_debug' => config('app.debug') ? $otpCode : null
            ], 500);
        }
    }

    // Verifikasi OTP dan login
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string|size:6'
        ]);

        // Cari OTP yang valid
        $otpRecord = Otp::where('email', $request->email)
            ->where('otp', $request->otp)
            ->where('is_used', false)
            ->where('expires_at', '>', now())
            ->first();

        if (!$otpRecord) {
            return response()->json([
                'success' => false,
                'message' => 'Kode OTP tidak valid atau sudah kadaluarsa'
            ], 401);
        }

        // Tandai OTP sebagai sudah digunakan
        $otpRecord->is_used = true;
        $otpRecord->save();

        // Login user
        $user = User::where('email', $request->email)->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil',
            'token' => $token,
            'user' => $user
        ], 200);
    }
}
