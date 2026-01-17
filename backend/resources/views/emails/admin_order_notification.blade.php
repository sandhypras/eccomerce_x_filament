<!DOCTYPE html>
<html>
<head>
    <title>Pesanan Baru</title>
</head>
<body>
    <h2>Ada Pesanan Baru Masuk!</h2>
    <p>Halo Admin, berikut adalah detail pesanan terbaru:</p>

    <table border="1" cellpadding="10" cellspacing="0">
        <tr><td><strong>Invoice</strong></td><td>{{ $this->order->invoice_number }}</td></tr>
        <tr><td><strong>Pelanggan</strong></td><td>{{ $this->order->user->name }}</td></tr>
        <tr><td><strong>No. Telp / WA</strong></td><td>{{ $this->order->phone }}</td></tr>
        <tr><td><strong>Alamat Lengkap</strong></td><td>{{ $this->order->shipping_address }}</td></tr>
        <tr><td><strong>Total Bayar</strong></td><td>Rp {{ number_format($this->order->total_price, 0, ',', '.') }}</td></tr>
        <tr><td><strong>Catatan</strong></td><td>{{ $this->order->notes ?? '-' }}</td></tr>
    </table>

    <p>Silakan cek dashboard Filament untuk konfirmasi pembayaran.</p>
</body>
</html>
