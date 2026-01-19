<?php

namespace App\Filament\Widgets;

use Filament\Widgets\ChartWidget;
use Carbon\Carbon;
use App\Models\Order;

class SalesChartWidget extends ChartWidget
{
    // ⬇️ WAJIB public
    public function getHeading(): string
    {
        return 'Grafik Penjualan Bulanan';
    }

    protected function getData(): array
    {
        $months = collect(range(1, 12))->map(fn ($m) =>
            Carbon::create()->month($m)->format('M')
        );

        $sales = collect(range(1, 12))->map(fn ($m) =>
            Order::whereMonth('created_at', $m)
                ->whereIn('status', ['paid', 'completed'])
                ->sum('total_price')
        );

        return [
            'datasets' => [
                [
                    'label' => 'Pendapatan',
                    'data' => $sales,
                ],
            ],
            'labels' => $months,
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
