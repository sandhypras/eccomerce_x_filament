<?php

namespace App\Filament\Widgets;

use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;

class MyWidget extends StatsOverviewWidget
{
    protected function getStats(): array
    {
        return [

            // 💰 Total Pendapatan (order selesai)
            Stat::make(
                'Total Pendapatan',
                'Rp ' . number_format(
                    Order::where('status', 'completed')->sum('total_price'),
                    0,
                    ',',
                    '.'
                )
            )
                ->description('Dari transaksi selesai')
                ->descriptionIcon('heroicon-m-currency-dollar')
                ->color('success'),

            // 📅 Pesanan Hari Ini
            Stat::make(
                'Pesanan Hari Ini',
                Order::whereDate('created_at', Carbon::today())->count()
            )
                ->description('Total order masuk hari ini')
                ->descriptionIcon('heroicon-m-shopping-cart')
                ->color('primary'),

            // ⏳ Pesanan Pending (FIX — SESUAI DB)
            Stat::make(
                'Pesanan Pending',
                Order::whereIn('status', [
                    'pending_payment',
                    'waiting_confirmation',
                ])->count()
            )
                ->description('Menunggu pembayaran / konfirmasi')
                ->descriptionIcon('heroicon-m-clock')
                ->color('warning'),

            // ⚠️ Produk Stok Habis
            Stat::make(
                'Produk Stok Habis',
                Product::where('stock', '<=', 0)->count()
            )
                ->description('Perlu restock')
                ->descriptionIcon('heroicon-m-exclamation-triangle')
                ->color('danger'),

            // 📦 Total Produk
            Stat::make(
                'Total Produk',
                Product::count()
            )
                ->description('Semua produk elektronik')
                ->descriptionIcon('heroicon-m-cube')
                ->color('info'),

            // 👤 Total User
            Stat::make(
                'Total User',
                User::where('role', 'user')->count()
            )
                ->description('Pelanggan terdaftar')
                ->descriptionIcon('heroicon-m-users')
                ->color('secondary'),
        ];
    }
}
