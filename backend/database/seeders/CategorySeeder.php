<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing categories (optional)
        // Category::truncate();

        $categories = [
            [
                'name' => 'CCTV',
                'image' => 'categories/made-in-china.webp',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'MONITOR',
                'image' => 'categories/Xiaomi-LED-24-A24i-P24FBARAGL.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'KOMPONEN KOMPUTER',
                'image' => 'categories/Spesifikasi-dan-Fungsi-Mainboard.webp',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'JARINGAN',
                'image' =>'categories/TL-WR940N_UN_6_1702019032.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['name' => $category['name']], // Check by name
                $category // Update or create with this data
            );
        }

        $this->command->info('✅ Category seeder berhasil dijalankan!');
        $this->command->info('📦 Total kategori: ' . Category::count());
    }
}
