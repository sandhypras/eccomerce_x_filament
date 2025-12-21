<?php

namespace App\Filament\Resources\Categories;

use App\Models\Category;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Forms\Components\{
    TextInput,
    FileUpload
};
use Filament\Tables\Table;
use Filament\Tables\Columns\{
    TextColumn,
    ImageColumn
};

class CategoryResource extends Resource
{
    protected static ?string $model = Category::class;

    protected static string|BackedEnum|null $navigationIcon =
        Heroicon::OutlinedTag;

    protected static ?string $recordTitleAttribute = 'name';

    /* ================= FORM ================= */
    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            TextInput::make('name')
                ->required()
                ->maxLength(255),

            FileUpload::make('image')
                ->image()
                ->directory('categories')
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

            TextColumn::make('created_at')
                ->dateTime()
                ->label('Created'),
        ]);
    }

    /* ================= PAGES ================= */
    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCategories::route('/'),
            'create' => Pages\CreateCategory::route('/create'),
            'edit' => Pages\EditCategory::route('/{record}/edit'),
        ];
    }
}
