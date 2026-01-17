<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::all();

        $products = [
            'Laptop' => [
                ['Laptop ASUS VivoBook 14', 7500000, 15, 'Laptop ringan untuk kerja dan kuliah dengan prosesor Intel i5 dan SSD cepat.', 'laptop1.jpg'],
                ['Laptop Acer Aspire 5', 8200000, 12, 'Laptop performa tinggi dengan layar Full HD dan desain elegan.', 'laptop2.jpg'],
                ['Laptop Lenovo IdeaPad', 7000000, 20, 'Laptop hemat daya cocok untuk mahasiswa.', 'laptop3.jpg'],
                ['Laptop HP Pavilion', 9200000, 10, 'Laptop multimedia dengan grafis mumpuni.', 'laptop4.jpg'],
                ['Laptop Dell Inspiron', 8900000, 9, 'Laptop tangguh untuk pekerjaan kantor.', 'laptop5.jpg'],
                ['Laptop MSI Gaming', 15000000, 7, 'Laptop gaming dengan VGA dedicated.', 'laptop6.jpg'],
                ['Laptop ASUS TUF', 14500000, 5, 'Laptop gaming tahan banting.', 'laptop7.jpg'],
                ['MacBook Air M1', 16500000, 6, 'Laptop premium dengan performa tinggi.', 'laptop8.jpg'],
                ['Laptop Lenovo ThinkPad', 13000000, 8, 'Laptop bisnis profesional.', 'laptop9.jpg'],
                ['Laptop HP Envy', 14000000, 4, 'Laptop stylish untuk kreator.', 'laptop10.jpg'],
            ],

            'Printer' => [
                ['Printer Epson L3110', 2500000, 20, 'Printer ink tank hemat tinta.', 'printer1.jpg'],
                ['Printer Canon IP2770', 1200000, 25, 'Printer inkjet berkualitas tinggi.', 'printer2.jpg'],
                ['Printer HP Deskjet', 1400000, 18, 'Printer ringkas untuk rumah.', 'printer3.jpg'],
                ['Printer Epson L805', 3500000, 10, 'Printer foto profesional.', 'printer4.jpg'],
                ['Printer Brother DCP', 2800000, 12, 'Printer multifungsi scan & copy.', 'printer5.jpg'],
                ['Printer LaserJet HP', 4200000, 7, 'Printer laser cepat dan efisien.', 'printer6.jpg'],
                ['Printer Canon G3010', 3200000, 9, 'Printer tinta isi ulang.', 'printer7.jpg'],
                ['Printer Epson L120', 1900000, 14, 'Printer murah dan awet.', 'printer8.jpg'],
                ['Printer Thermal', 1100000, 30, 'Printer struk kasir.', 'printer9.jpg'],
                ['Printer Barcode', 1800000, 20, 'Printer label barcode.', 'printer10.jpg'],
            ],

            'Computer' => [
                ['PC Gaming Ryzen 5', 12000000, 6, 'PC gaming performa tinggi.', 'pc1.jpg'],
                ['PC Office Intel i3', 6500000, 10, 'PC kantor hemat daya.', 'pc2.jpg'],
                ['PC Editing', 15000000, 5, 'PC untuk desain dan video.', 'pc3.jpg'],
                ['PC Rakitan Murah', 5500000, 12, 'PC ekonomis untuk kerja.', 'pc4.jpg'],
                ['PC Server Mini', 18000000, 4, 'Server skala kecil.', 'pc5.jpg'],
                ['PC Gaming RTX', 22000000, 3, 'PC gaming high-end.', 'pc6.jpg'],
                ['PC All in One', 9000000, 7, 'PC tanpa CPU terpisah.', 'pc7.jpg'],
                ['PC Kasir', 6000000, 10, 'PC untuk kasir toko.', 'pc8.jpg'],
                ['PC Desain Grafis', 17000000, 4, 'PC untuk editing profesional.', 'pc9.jpg'],
                ['PC Multimedia', 8000000, 6, 'PC hiburan keluarga.', 'pc10.jpg'],
            ],

            'Penyimpanan' => [
                ['SSD 256GB', 450000, 40, 'SSD cepat untuk sistem operasi.', 'ssd1.jpg'],
                ['SSD 512GB', 750000, 30, 'SSD kapasitas besar.', 'ssd2.jpg'],
                ['HDD 1TB', 650000, 25, 'Harddisk penyimpanan data.', 'hdd1.jpg'],
                ['HDD 2TB', 950000, 15, 'Harddisk kapasitas besar.', 'hdd2.jpg'],
                ['Flashdisk 32GB', 60000, 50, 'Flashdisk praktis.', 'fd1.jpg'],
                ['Flashdisk 64GB', 90000, 40, 'Flashdisk cepat.', 'fd2.jpg'],
                ['SSD NVMe 1TB', 1500000, 10, 'SSD super cepat.', 'ssd3.jpg'],
                ['Memory Card 64GB', 85000, 35, 'Kartu memori kamera.', 'mc1.jpg'],
                ['External HDD 1TB', 950000, 12, 'Harddisk eksternal.', 'ehdd1.jpg'],
                ['SSD External', 1300000, 8, 'SSD portable.', 'ssd4.jpg'],
            ],
            'Aksesoris' => [
    ['Mouse Wireless Logitech', 150000, 30, 'Mouse wireless nyaman dan responsif.', 'aksesoris1.jpg'],
    ['Keyboard Mechanical', 450000, 20, 'Keyboard mechanical RGB.', 'aksesoris2.jpg'],
    ['Headset Gaming', 350000, 18, 'Headset suara jernih untuk gaming.', 'aksesoris3.jpg'],
    ['Cooling Pad Laptop', 120000, 25, 'Pendingin laptop agar tidak panas.', 'aksesoris4.jpg'],
    ['Webcam HD', 280000, 15, 'Webcam HD untuk meeting.', 'aksesoris5.jpg'],
    ['Mouse Pad Gaming', 90000, 40, 'Mousepad ukuran besar.', 'aksesoris6.jpg'],
    ['USB Hub 4 Port', 85000, 30, 'Menambah port USB.', 'aksesoris7.jpg'],
    ['Stand Laptop', 175000, 20, 'Dudukan laptop ergonomis.', 'aksesoris8.jpg'],
    ['Kabel HDMI', 60000, 50, 'Kabel HDMI kualitas tinggi.', 'aksesoris9.jpg'],
    ['Charger Universal', 120000, 25, 'Charger multi port.', 'aksesoris10.jpg'],
],

'HP' => [
    ['iPhone 13', 12000000, 8, 'Smartphone premium Apple.', 'hp1.jpg'],
    ['Samsung Galaxy S22', 11000000, 10, 'HP flagship Samsung.', 'hp2.jpg'],
    ['Xiaomi Redmi Note 12', 2800000, 25, 'HP murah performa tinggi.', 'hp3.jpg'],
    ['Oppo A57', 2500000, 20, 'HP kamera jernih.', 'hp4.jpg'],
    ['Vivo Y20', 2300000, 18, 'HP baterai besar.', 'hp5.jpg'],
    ['Realme C55', 2600000, 22, 'HP cepat dan ringan.', 'hp6.jpg'],
    ['Samsung A14', 2900000, 15, 'HP layar besar.', 'hp7.jpg'],
    ['iPhone 11', 8500000, 7, 'iPhone populer.', 'hp8.jpg'],
    ['Infinix Hot 30', 2100000, 20, 'HP gaming murah.', 'hp9.jpg'],
    ['Poco X5', 3200000, 12, 'HP performa tinggi.', 'hp10.jpg'],
],

'CCTV' => [
    ['CCTV Indoor 2MP', 350000, 20, 'Kamera pengawas dalam ruangan.', 'cctv1.jpg'],
    ['CCTV Outdoor', 450000, 15, 'Kamera tahan air.', 'cctv2.jpg'],
    ['CCTV Wireless', 550000, 12, 'CCTV tanpa kabel.', 'cctv3.jpg'],
    ['DVR 4 Channel', 650000, 10, 'Perekam CCTV.', 'cctv4.jpg'],
    ['DVR 8 Channel', 950000, 8, 'DVR kapasitas besar.', 'cctv5.jpg'],
    ['Paket CCTV 4 Kamera', 2500000, 5, 'Paket lengkap CCTV.', 'cctv6.jpg'],
    ['CCTV Night Vision', 500000, 12, 'Rekaman malam hari.', 'cctv7.jpg'],
    ['CCTV IP Camera', 600000, 10, 'CCTV berbasis internet.', 'cctv8.jpg'],
    ['Bracket CCTV', 50000, 30, 'Dudukan kamera.', 'cctv9.jpg'],
    ['Kabel CCTV 20M', 120000, 25, 'Kabel CCTV panjang.', 'cctv10.jpg'],
],

'Monitor' => [
    ['Monitor LG 24"', 1800000, 15, 'Monitor Full HD.', 'monitor1.jpg'],
    ['Monitor Samsung 24"', 1900000, 12, 'Monitor IPS.', 'monitor2.jpg'],
    ['Monitor Gaming 144Hz', 3200000, 8, 'Monitor gaming cepat.', 'monitor3.jpg'],
    ['Monitor ASUS 27"', 2800000, 10, 'Monitor layar besar.', 'monitor4.jpg'],
    ['Monitor Dell', 2600000, 9, 'Monitor profesional.', 'monitor5.jpg'],
    ['Monitor Curved', 3500000, 6, 'Monitor lengkung.', 'monitor6.jpg'],
    ['Monitor Office', 1500000, 14, 'Monitor kerja.', 'monitor7.jpg'],
    ['Monitor 4K', 5500000, 4, 'Resolusi tinggi.', 'monitor8.jpg'],
    ['Monitor LED', 1700000, 16, 'Hemat daya.', 'monitor9.jpg'],
    ['Monitor Portable', 2200000, 7, 'Monitor portable.', 'monitor10.jpg'],
],

'Komponen Komputer' => [
    ['Processor Ryzen 5', 2800000, 10, 'Prosesor gaming.', 'komp1.jpg'],
    ['Processor Intel i5', 3000000, 8, 'CPU performa tinggi.', 'komp2.jpg'],
    ['RAM 8GB DDR4', 450000, 30, 'RAM cepat.', 'komp3.jpg'],
    ['RAM 16GB DDR4', 850000, 20, 'RAM besar.', 'komp4.jpg'],
    ['Motherboard ASUS', 1800000, 12, 'Motherboard handal.', 'komp5.jpg'],
    ['VGA RTX 3060', 6500000, 5, 'VGA gaming.', 'komp6.jpg'],
    ['Power Supply 600W', 750000, 15, 'PSU stabil.', 'komp7.jpg'],
    ['Casing Gaming', 650000, 10, 'Casing RGB.', 'komp8.jpg'],
    ['Fan Processor', 250000, 20, 'Pendingin CPU.', 'komp9.jpg'],
    ['SSD NVMe 512GB', 950000, 18, 'Storage cepat.', 'komp10.jpg'],
],

'Jaringan' => [
    ['Router TP-Link', 450000, 20, 'Router WiFi cepat.', 'net1.jpg'],
    ['Router Tenda', 350000, 25, 'Router ekonomis.', 'net2.jpg'],
    ['Access Point', 650000, 12, 'Jangkauan luas.', 'net3.jpg'],
    ['Switch 8 Port', 300000, 15, 'Switch jaringan.', 'net4.jpg'],
    ['Switch 16 Port', 550000, 10, 'Switch besar.', 'net5.jpg'],
    ['Kabel LAN 20m', 80000, 30, 'Kabel jaringan.', 'net6.jpg'],
    ['Repeater WiFi', 250000, 18, 'Penguat sinyal.', 'net7.jpg'],
    ['Modem Router', 650000, 8, 'Modem internet.', 'net8.jpg'],
    ['Crimping Tool', 90000, 20, 'Alat pasang LAN.', 'net9.jpg'],
    ['LAN Tester', 120000, 15, 'Tester kabel LAN.', 'net10.jpg'],
],


            // LANJUTKAN: Aksesoris, HP, CCTV, Monitor, Komponen, Jaringan
        ];

        foreach ($products as $categoryName => $items) {
            $category = Category::where('name', $categoryName)->first();

            foreach ($items as $item) {
                Product::create([
                    'category_id' => $category->id,
                    'name' => $item[0],
                    'price' => $item[1],
                    'stock' => $item[2],
                    'description' => $item[3],
                    'image' => 'products/' . $item[4],
                ]);
            }
        }
    }
}
