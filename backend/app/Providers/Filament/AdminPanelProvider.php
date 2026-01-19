<?php

namespace App\Providers\Filament;

use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->login()
            ->colors([
                'primary' => Color::Orange, // Ubah ke Orange untuk TokoKu
                // Atau custom:
                // 'primary' => [
                //     50 => '255, 237, 213',
                //     100 => '254, 215, 170',
                //     200 => '253, 186, 116',
                //     300 => '251, 146, 60',
                //     400 => '251, 146, 60',
                //     500 => '249, 115, 22', // Main color
                //     600 => '234, 88, 12',
                //     700 => '194, 65, 12',
                //     800 => '154, 52, 18',
                //     900 => '124, 45, 18',
                //     950 => '67, 20, 7',
                // ],
            ])
            ->font('Inter') // Ubah font
            ->brandName('TokoKu Admin') // Nama brand
            ->brandLogo(asset('images/ChatGPT Image Jan 19, 2026, 12_13_36 AM1.png')) // Logo custom
            ->brandLogoHeight('4rem')
            ->favicon(asset('images/favicon.png'))
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\\Filament\\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\\Filament\\Pages')
            ->pages([
                \Filament\Pages\Dashboard::class,
            ])
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\\Filament\\Widgets')
            ->widgets([])
            ->middleware([
                \Illuminate\Cookie\Middleware\EncryptCookies::class,
                \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
                \Illuminate\Session\Middleware\StartSession::class,
                \Illuminate\View\Middleware\ShareErrorsFromSession::class,
                \Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class,
                \Illuminate\Routing\Middleware\SubstituteBindings::class,
                \Illuminate\Session\Middleware\AuthenticateSession::class,
            ])
            ->authMiddleware([
                \Illuminate\Auth\Middleware\Authenticate::class,
            ]);
    }
}
