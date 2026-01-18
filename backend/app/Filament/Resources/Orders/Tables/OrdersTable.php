<?php

namespace App\Filament\Resources\Orders\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Tables\Columns\ImageColumn;

class OrdersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('user_id')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('invoice_number')
                    ->searchable(),
                TextColumn::make('total_price')
                    ->money()
                    ->sortable(),
                TextColumn::make('status')
                    ->badge(),
                ImageColumn::make('payment_proof')
                ->label('Payment Proof')
                ->disk('public')
                ->square()
                ->height(50)
                ->visibility('public'),

                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('user.name')
                    ->label('Customer Name')
                    ->toggleable(isToggledHiddenByDefault: true),
                textColumn::make('user.email')
                    ->label('Customer Email')
                    ->toggleable(isToggledHiddenByDefault: true),
                textColumn::make('phone')
                    ->label('No. Telepon')
                    ->toggleable(isToggledHiddenByDefault: true),
                textColumn::make('shipping_address')
                    ->label('Alamat Pengiriman')
                    ->toggleable(isToggledHiddenByDefault: true),
                textColumn::make('notes')
                    ->label('Catatan')
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
