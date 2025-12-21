<?php

namespace App\Filament\Resources\Products;

use App\Models\Product;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Forms\Components\{
    TextInput,
    Textarea,
    Select,
    FileUpload
};
use Filament\Tables\Table;
use Filament\Tables\Columns\{
    TextColumn,
    ImageColumn
};

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    // ✅ ICON ENUM (WAJIB FILAMENT v3)
    protected static string|BackedEnum|null $navigationIcon =
        Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'name';

    /* ================= FORM ================= */
    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            Select::make('category_id')
                ->label('Category')
                ->relationship('category', 'name')
                ->required(),

            TextInput::make('name')
                ->required()
                ->maxLength(255),

            TextInput::make('price')
                ->numeric()
                ->required(),

            TextInput::make('stock')
                ->numeric()
                ->required(),

            Textarea::make('description')
                ->columnSpanFull(),

            FileUpload::make('image')
                ->image()
                ->directory('products')
                ->disk('public')
                ->nullable(),
        ]);
    }

    /* ================= TABLE ================= */
    public static function table(Table $table): Table
    {
        return $table->columns([
            ImageColumn::make('image')
                ->disk('public')
                ->height(50),

            TextColumn::make('name')
                ->searchable()
                ->sortable(),

            TextColumn::make('category.name')
                ->label('Category'),

            TextColumn::make('price')
                ->money('IDR'),

            TextColumn::make('stock'),

            TextColumn::make('created_at')
                ->dateTime()
                ->label('Created'),
        ]);
    }

    /* ================= PAGES ================= */
    public static function getPages(): array
    {
        return [
            'index' => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'edit' => Pages\EditProduct::route('/{record}/edit'),
        ];
    }
}
