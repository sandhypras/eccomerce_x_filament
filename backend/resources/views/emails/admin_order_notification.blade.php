<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pesanan Baru</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 650px;
            margin: 20px auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
        }
        .content {
            padding: 30px;
        }
        .order-info {
            background: #fff7ed;
            border-left: 4px solid #f97316;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
        }
        .info-row {
            display: flex;
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid #e5e7eb;
        }
        .info-row:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }
        .info-label {
            font-weight: 600;
            color: #6b7280;
            min-width: 150px;
            font-size: 14px;
        }
        .info-value {
            color: #1f2937;
            font-weight: 500;
        }
        .section-title {
            font-size: 18px;
            font-weight: 700;
            color: #f97316;
            margin: 25px 0 15px 0;
            padding-bottom: 10px;
            border-bottom: 2px solid #fed7aa;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }
        .items-table th {
            background: #f3f4f6;
            padding: 12px;
            text-align: left;
            font-weight: 600;
            color: #374151;
            font-size: 14px;
        }
        .items-table td {
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 14px;
        }
        .items-table tr:last-child td {
            border-bottom: none;
        }
        .total-section {
            background: #fef3c7;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: right;
        }
        .total-label {
            font-size: 18px;
            font-weight: 600;
            color: #78350f;
        }
        .total-value {
            font-size: 28px;
            font-weight: 700;
            color: #f97316;
            margin-top: 5px;
        }
        .alert {
            background: #dbeafe;
            border-left: 4px solid #3b82f6;
            padding: 15px;
            margin: 20px 0;
            border-radius: 8px;
            font-size: 14px;
        }
        .footer {
            background: #f9fafb;
            padding: 20px;
            text-align: center;
            color: #6b7280;
            font-size: 13px;
            border-top: 1px solid #e5e7eb;
        }
        .badge {
            display: inline-block;
            background: #dcfce7;
            color: #166534;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🛒 Pesanan Baru Diterima</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">{{ $order->order_number }}</p>
        </div>

        <div class="content">
            <div class="alert">
                <strong>📢 Notifikasi Admin:</strong> Pesanan baru telah diterima dan menunggu konfirmasi. Harap segera menghubungi pelanggan untuk konfirmasi pengiriman.
            </div>

            <h2 class="section-title">📋 Informasi Pelanggan</h2>
            <div class="order-info">
                <div class="info-row">
                    <div class="info-label">Nama Lengkap:</div>
                    <div class="info-value">{{ $customerName }}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Email:</div>
                    <div class="info-value">{{ $customerEmail }}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">No. Telepon:</div>
                    <div class="info-value"><strong>{{ $phone }}</strong></div>
                </div>
                <div class="info-row">
                    <div class="info-label">Alamat Pengiriman:</div>
                    <div class="info-value">{{ $shippingAddress }}</div>
                </div>
                @if($notes)
                <div class="info-row">
                    <div class="info-label">Catatan:</div>
                    <div class="info-value" style="font-style: italic; color: #6b7280;">"{{ $notes }}"</div>
                </div>
                @endif
            </div>

            <h2 class="section-title">📦 Detail Pesanan</h2>
            <table class="items-table">
                <thead>
                    <tr>
                        <th>Produk</th>
                        <th style="text-align: center;">Qty</th>
                        <th style="text-align: right;">Harga</th>
                        <th style="text-align: right;">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($items as $item)
                    <tr>
                        <td>
                            <strong>{{ $item->product->name ?? 'Produk' }}</strong>
                        </td>
                        <td style="text-align: center;">{{ $item->quantity }}</td>
                        <td style="text-align: right;">Rp {{ number_format($item->price, 0, ',', '.') }}</td>
                        <td style="text-align: right; font-weight: 600;">
                            Rp {{ number_format($item->price * $item->quantity, 0, ',', '.') }}
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>

            <div class="total-section">
                <div class="total-label">Total Pembayaran</div>
                <div class="total-value">Rp {{ number_format($total, 0, ',', '.') }}</div>
                <div style="margin-top: 10px;">
                    <span class="badge">Transfer Bank</span>
                </div>
            </div>

            <h2 class="section-title">💳 Bukti Pembayaran</h2>
            <div class="alert">
                @if($order->payment_proof)
                    ✅ Bukti pembayaran telah dilampirkan pada email ini sebagai attachment.
                @else
                    ⏳ Bukti pembayaran belum diupload oleh pelanggan.
                @endif
            </div>

            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <strong>⚡ Action Required:</strong>
                <ol style="margin: 10px 0; padding-left: 20px;">
                    <li>Verifikasi bukti pembayaran (terlampir)</li>
                    <li>Hubungi pelanggan di: <strong>{{ $phone }}</strong></li>
                    <li>Konfirmasi detail pengiriman</li>
                    <li>Update status pesanan di admin panel</li>
                </ol>
            </div>
        </div>

        <div class="footer">
            <p style="margin: 0;">Email dikirim otomatis dari sistem TokoKu Electronics</p>
            <p style="margin: 5px 0 0 0;">{{ now()->format('d F Y, H:i') }} WIB</p>
        </div>
    </div>
</body>
</html>
