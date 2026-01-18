<h2>Pembayaran Berhasil Dikonfirmasi</h2>

<p>Halo <strong>{{ $order->user->name }}</strong>,</p>

<p>
Pembayaran untuk pesanan <strong>{{ $order->invoice_number }}</strong> telah dikonfirmasi.
</p>

<p>
Total Pembayaran: <strong>Rp {{ number_format($order->total_price) }}</strong>
</p>

<p>
Pesanan akan segera kami proses 🚚
</p>

<hr>
<p>Toko Elektroniku</p>
