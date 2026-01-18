<?php

namespace App\Filament\Resources\Orders\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class OrderForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('user_id')
                ->required()
                ->numeric(),

            TextInput::make('invoice_number')
                ->required()
                ->disabled(),

            TextInput::make('total_price')
                ->required()
                ->numeric()
                ->prefix('Rp'),

            Select::make('status')
                ->options([
                    'pending_payment' => 'Pending payment',
                    'waiting_confirmation' => 'Waiting confirmation',
                    'paid' => 'Paid',
                    'shipped' => 'Shipped',
                    'completed' => 'Completed',
                    'cancelled' => 'Cancelled',
                ])
                ->required(),

            FileUpload::make('payment_proof')
                ->label('Payment Proof')
                ->image()
                ->disk('public')
                ->directory('payments')
                ->visibility('public')
                ->previewable()
                ->openable()
                ->downloadable()
                ->disabled(fn ($record) => $record?->status === 'paid'),

            TextInput::make('phone')
                ->label('No. Telepon')
                ->tel()
                ->required(),
            TextInput::make('shipping_address')
                ->label('Alamat Pengiriman')
                ->required(),
            TextInput::make('notes')
                ->label('Catatan')
                ->nullable(),
        ]);
    }
}
