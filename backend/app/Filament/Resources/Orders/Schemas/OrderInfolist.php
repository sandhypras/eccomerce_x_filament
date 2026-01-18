<?php

namespace App\Filament\Resources\Orders\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Components\ImageEntry;
use Filament\Schemas\Schema;

class OrderInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([

            // ================= USER =================
            TextEntry::make('user.name')
                ->label('Nama Customer')
                ->placeholder('-'),

            TextEntry::make('user.email')
                ->label('Email Customer')
                ->placeholder('-'),

            // ================= ORDER =================
            TextEntry::make('invoice_number')
                ->label('Invoice')
                ->copyable(),

            TextEntry::make('total_price')
                ->label('Total Pembayaran')
                ->money('IDR'),

            TextEntry::make('status')
                ->badge()
                ->color(fn (string $state) => match ($state) {
                    'pending_payment' => 'gray',
                    'waiting_confirmation' => 'warning',
                    'confirmed' => 'success',
                    'cancelled' => 'danger',
                    default => 'secondary',
                }),

            // ================= PAYMENT =================
            ImageEntry::make('payment_proof')
                ->label('Bukti Pembayaran')
                ->disk('public')
                ->visibility('public')
                ->height(250)
                ->url(fn ($state) => $state
                    ? asset('storage/' . $state)
                    : null
                )
                ->openUrlInNewTab()
                ->placeholder('Belum upload'),

            // ================= SHIPPING =================
            TextEntry::make('phone')
                ->label('No. Telepon'),

            TextEntry::make('shipping_address')
                ->label('Alamat Pengiriman'),

            TextEntry::make('notes')
                ->label('Catatan')
                ->placeholder('-'),

            // ================= TIME =================
            TextEntry::make('created_at')
                ->label('Tanggal Order')
                ->dateTime(),

            TextEntry::make('updated_at')
                ->label('Terakhir Update')
                ->dateTime(),
        ]);
    }
}
