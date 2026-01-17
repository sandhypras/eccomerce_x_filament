<!-- resources/views/emails/otp.blade.php -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .container {
            background: #ffffff;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 2px solid #f97316;
        }
        .logo {
            font-size: 32px;
            font-weight: bold;
            color: #f97316;
        }
        .content {
            padding: 30px 0;
        }
        .otp-box {
            background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
            color: white;
            font-size: 36px;
            font-weight: bold;
            letter-spacing: 8px;
            text-align: center;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
        }
        .info {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🛒 TokoKu</div>
        </div>

        <div class="content">
            <h2>Kode Verifikasi OTP Anda</h2>

            @if($name)
            <p>Halo {{ $name }},</p>
            @else
            <p>Halo,</p>
            @endif

            <p>Terima kasih telah mendaftar di TokoKu. Gunakan kode OTP berikut untuk menyelesaikan registrasi Anda:</p>

            <div class="otp-box">
                {{ $otp }}
            </div>

            <div class="info">
                <strong>⚠️ Penting:</strong>
                <ul>
                    <li>Kode OTP ini berlaku selama <strong>5 menit</strong></li>
                    <li>Jangan bagikan kode ini kepada siapapun</li>
                    <li>Jika Anda tidak melakukan registrasi, abaikan email ini</li>
                </ul>
            </div>

            <p>Jika Anda mengalami kesulitan, silakan hubungi customer service kami.</p>
        </div>

        <div class="footer">
            <p>&copy; {{ date('Y') }} TokoKu. All rights reserved.</p>
            <p>Email ini dikirim secara otomatis, mohon tidak membalas.</p>
        </div>
    </div>
</body>
</html>
