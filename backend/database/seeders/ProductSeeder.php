<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            // KATEGORI 1: LAPTOP
            [
                'category_id' => 1,
                'name' => 'ASUS ROG Strix G16 Gaming Laptop',
                'price' => 18500000,
                'stock' => 8,
                'description' => 'Intel Core i7-13650HX, RTX 4060 8GB, 16GB RAM, 512GB SSD, 16" FHD 165Hz, Windows 11. Laptop gaming performa tinggi untuk gaming dan multitasking.',
                'image' => 'products/laptop-asus-rog.webp'
            ],
            [
                'category_id' => 1,
                'name' => 'Lenovo ThinkPad X1 Carbon Gen 11',
                'price' => 24000000,
                'stock' => 5,
                'description' => 'Intel Core i7-1355U, 16GB RAM, 512GB SSD, 14" WUXGA IPS, Windows 11 Pro. Laptop bisnis premium dengan desain tipis dan ringan.',
                'image' => 'products/laptop-lenovo-thinkpad.webp'
            ],
            [
                'category_id' => 1,
                'name' => 'MacBook Air M2 2024',
                'price' => 19999000,
                'stock' => 12,
                'description' => 'Apple M2 Chip, 8GB Unified Memory, 256GB SSD, 13.6" Liquid Retina Display, macOS. Laptop tipis dan powerful untuk produktivitas.',
                'image' => 'products/laptop-macbook-air.webp'
            ],
            [
                'category_id' => 1,
                'name' => 'HP Pavilion Plus 14',
                'price' => 13500000,
                'stock' => 15,
                'description' => 'Intel Core i5-13500H, 16GB RAM, 512GB SSD, 14" 2.8K OLED, Windows 11. Laptop multimedia dengan layar OLED berkualitas tinggi.',
                'image' => 'products/laptop-hp-pavilion.webp'
            ],
            [
                'category_id' => 1,
                'name' => 'Acer Swift X SFX14-71G',
                'price' => 14999000,
                'stock' => 10,
                'description' => 'Intel Core i5-12500H, RTX 3050 4GB, 16GB RAM, 512GB SSD, 14" FHD IPS, Windows 11. Laptop creator dengan GPU dedicated untuk editing.',
                'image' => 'products/laptop-acer-swift.webp'
            ],

            // KATEGORI 2: PRINTER
            [
                'category_id' => 2,
                'name' => 'Epson EcoTank L3250 Wi-Fi All-in-One',
                'price' => 2850000,
                'stock' => 20,
                'description' => 'Printer ink tank system dengan WiFi, print, scan, copy. Hemat biaya cetak hingga 90%. Cocok untuk rumah dan kantor kecil.',
                'image' => 'products/printer-epson-l3250.webp'
            ],
            [
                'category_id' => 2,
                'name' => 'Canon PIXMA G3770 Wireless',
                'price' => 3200000,
                'stock' => 15,
                'description' => 'Printer wireless all-in-one dengan tangki tinta besar. Print, scan, copy dengan kualitas foto. Support mobile printing.',
                'image' => 'products/printer-canon-g3770.webp'
            ],
            [
                'category_id' => 2,
                'name' => 'HP LaserJet Pro MFP M428fdw',
                'price' => 8500000,
                'stock' => 6,
                'description' => 'Printer laser monokrom multifungsi dengan kecepatan cetak 40 ppm. Auto duplex, WiFi, Ethernet. Ideal untuk kantor produktif.',
                'image' => 'products/printer-hp-laserjet.webp'
            ],
            [
                'category_id' => 2,
                'name' => 'Brother DCP-T720DW Ink Tank',
                'price' => 2950000,
                'stock' => 18,
                'description' => 'Printer ink tank 3-in-1 dengan auto duplex dan WiFi. Kapasitas tinta besar hingga 7,500 halaman. Efisien untuk cetak dokumen.',
                'image' => 'products/printer-brother-t720.webp'
            ],
            [
                'category_id' => 2,
                'name' => 'Epson L805 Photo Printer',
                'price' => 4200000,
                'stock' => 12,
                'description' => 'Printer foto 6-warna dengan WiFi. Cetak foto berkualitas lab hingga ukuran A4. Support CD/DVD printing. Cocok untuk studio foto.',
                'image' => 'products/printer-epson-l805.webp'
            ],

            // KATEGORI 3: COMPUTER
            [
                'category_id' => 3,
                'name' => 'Apple iMac 24" M3 2024',
                'price' => 25999000,
                'stock' => 5,
                'description' => 'Apple M3 Chip, 8GB RAM, 256GB SSD, 24" 4.5K Retina Display, Magic Keyboard & Mouse. All-in-one desktop dengan performa tinggi.',
                'image' => 'products/computer-imac-m3.webp'
            ],
            [
                'category_id' => 3,
                'name' => 'ASUS ROG Strix GA15 Gaming Desktop',
                'price' => 22000000,
                'stock' => 7,
                'description' => 'AMD Ryzen 7 7700X, RTX 4070 12GB, 16GB DDR5, 1TB NVMe SSD, Windows 11. PC gaming powerful dengan RGB lighting.',
                'image' => 'products/computer-asus-rog.webp'
            ],
            [
                'category_id' => 3,
                'name' => 'HP EliteDesk 800 G9 Mini',
                'price' => 15500000,
                'stock' => 10,
                'description' => 'Intel Core i7-12700, 16GB RAM, 512GB SSD, Intel UHD Graphics, Windows 11 Pro. Mini PC hemat ruang untuk kantor.',
                'image' => 'products/computer-hp-elitedesk.webp'
            ],
            [
                'category_id' => 3,
                'name' => 'Dell OptiPlex 7010 Tower',
                'price' => 12800000,
                'stock' => 12,
                'description' => 'Intel Core i5-13500, 8GB RAM, 512GB SSD, Intel UHD Graphics 770, Windows 11 Pro. Desktop bisnis reliable dan mudah upgrade.',
                'image' => 'products/computer-dell-optiplex.webp'
            ],
            [
                'category_id' => 3,
                'name' => 'Lenovo IdeaCentre AIO 5i 27"',
                'price' => 18500000,
                'stock' => 8,
                'description' => 'Intel Core i7-12700H, 16GB RAM, 512GB SSD, 27" QHD IPS Touch, Windows 11. All-in-one dengan layar besar untuk produktivitas.',
                'image' => 'products/computer-lenovo-aio.webp'
            ],

            // KATEGORI 4: PENYIMPANAN
            [
                'category_id' => 4,
                'name' => 'Samsung 870 EVO SATA SSD 1TB',
                'price' => 1450000,
                'stock' => 30,
                'description' => 'SSD SATA 2.5" dengan kecepatan baca 560MB/s, tulis 530MB/s. Garansi 5 tahun. Upgrade performa laptop dan PC lama.',
                'image' => 'products/storage-samsung-870evo.webp'
            ],
            [
                'category_id' => 4,
                'name' => 'WD Black SN850X NVMe SSD 2TB',
                'price' => 3200000,
                'stock' => 15,
                'description' => 'NVMe PCIe Gen4 SSD dengan kecepatan baca hingga 7,300MB/s. Perfect untuk gaming dan workstation high-end.',
                'image' => 'products/storage-wd-black.webp'
            ],
            [
                'category_id' => 4,
                'name' => 'Seagate IronWolf Pro 8TB NAS HDD',
                'price' => 5500000,
                'stock' => 10,
                'description' => 'Hard disk 7200 RPM untuk NAS. Garansi 5 tahun dengan data recovery services. Cocok untuk server dan storage array.',
                'image' => 'products/storage-seagate-ironwolf.webp'
            ],
            [
                'category_id' => 4,
                'name' => 'Kingston Fury Renegade 1TB NVMe',
                'price' => 1850000,
                'stock' => 25,
                'description' => 'NVMe PCIe 4.0 SSD dengan kecepatan baca 7,300MB/s. Heatsink included. Ideal untuk gaming dan content creation.',
                'image' => 'products/storage-kingston-fury.webp'
            ],
            [
                'category_id' => 4,
                'name' => 'SanDisk Extreme Portable SSD 2TB',
                'price' => 3800000,
                'stock' => 20,
                'description' => 'External SSD dengan kecepatan baca 1050MB/s. IP55 rating (tahan air dan debu). USB-C, compact dan durable.',
                'image' => 'products/storage-sandisk-extreme.webp'
            ],

            // KATEGORI 5: AKSESORIS
            [
                'category_id' => 5,
                'name' => 'Logitech MX Master 3S Wireless Mouse',
                'price' => 1650000,
                'stock' => 25,
                'description' => 'Mouse wireless ergonomis dengan sensor 8K DPI, quiet clicks, USB-C charging. Multi-device support hingga 3 perangkat.',
                'image' => 'products/accessory-logitech-mx3s.webp'
            ],
            [
                'category_id' => 5,
                'name' => 'Keychron K8 Pro Mechanical Keyboard',
                'price' => 1950000,
                'stock' => 18,
                'description' => 'Mechanical keyboard wireless dengan hot-swappable switch, RGB backlight. Layout 80%, support Windows & Mac.',
                'image' => 'products/accessory-keychron-k8.webp'
            ],
            [
                'category_id' => 5,
                'name' => 'Anker 747 PowerBank 25600mAh',
                'price' => 2200000,
                'stock' => 15,
                'description' => 'Power bank 140W dengan USB-C PD. Charge MacBook, laptop, dan smartphone. Display digital untuk monitor battery.',
                'image' => 'products/accessory-anker-747.webp'
            ],
            [
                'category_id' => 5,
                'name' => 'TP-Link Archer AX73 WiFi 6 Router',
                'price' => 1450000,
                'stock' => 22,
                'description' => 'WiFi 6 router dual-band dengan kecepatan hingga 5400Mbps. 6 antena high-gain, support OneMesh. Coverage luas.',
                'image' => 'products/accessory-tplink-ax73.webp'
            ],
            [
                'category_id' => 5,
                'name' => 'Razer Kraken V3 Pro Wireless Headset',
                'price' => 2800000,
                'stock' => 12,
                'description' => 'Gaming headset wireless dengan Razer HyperSense haptic feedback, THX Spatial Audio. Battery life 28 jam.',
                'image' => 'products/accessory-razer-kraken.webp'
            ],

            // KATEGORI 6: HP
            [
                'category_id' => 6,
                'name' => 'Samsung Galaxy S24 Ultra 5G',
                'price' => 19999000,
                'stock' => 15,
                'description' => 'Snapdragon 8 Gen 3, 12GB RAM, 256GB storage, 6.8" Dynamic AMOLED 2X, quad camera 200MP. S Pen included.',
                'image' => 'products/hp-samsung-s24ultra.webp'
            ],
            [
                'category_id' => 6,
                'name' => 'iPhone 15 Pro Max',
                'price' => 23999000,
                'stock' => 10,
                'description' => 'Apple A17 Pro chip, 256GB storage, 6.7" Super Retina XDR, Pro camera system 48MP. Titanium design dengan USB-C.',
                'image' => 'products/hp-iphone-15promax.webp'
            ],
            [
                'category_id' => 6,
                'name' => 'Xiaomi 14 Pro 5G',
                'price' => 11999000,
                'stock' => 20,
                'description' => 'Snapdragon 8 Gen 3, 12GB RAM, 512GB storage, 6.73" AMOLED 120Hz, Leica triple camera 50MP. Fast charging 120W.',
                'image' => 'products/hp-xiaomi-14pro.webp'
            ],
            [
                'category_id' => 6,
                'name' => 'OPPO Find X7 Ultra',
                'price' => 15999000,
                'stock' => 12,
                'description' => 'Snapdragon 8 Gen 3, 16GB RAM, 512GB storage, 6.82" AMOLED LTPO, Hasselblad quad camera. Premium flagship phone.',
                'image' => 'products/hp-oppo-findx7.webp'
            ],
            [
                'category_id' => 6,
                'name' => 'Google Pixel 8 Pro',
                'price' => 14999000,
                'stock' => 8,
                'description' => 'Google Tensor G3, 12GB RAM, 128GB storage, 6.7" LTPO OLED, triple camera 50MP. Pure Android experience dengan AI.',
                'image' => 'products/hp-google-pixel8.webp'
            ],

            // KATEGORI 7: CCTV
            [
                'category_id' => 7,
                'name' => 'Hikvision DS-2CD2143G2-I 4MP IP Camera',
                'price' => 2200000,
                'stock' => 25,
                'description' => 'IP camera 4MP dengan AcuSense technology, IR 30m, H.265+ compression. IP67 weatherproof untuk indoor/outdoor.',
                'image' => 'products/cctv-hikvision-2143.webp'
            ],
            [
                'category_id' => 7,
                'name' => 'Dahua DH-IPC-HFW2439S-SA-LED 4MP',
                'price' => 1850000,
                'stock' => 30,
                'description' => 'Full-color IP camera dengan LED warm light. Smart motion detection, built-in mic. Support PoE. Gambar jelas 24/7.',
                'image' => 'products/cctv-dahua-2439.webp'
            ],
            [
                'category_id' => 7,
                'name' => 'TP-Link Tapo C210 Pan/Tilt WiFi Camera',
                'price' => 450000,
                'stock' => 40,
                'description' => '3MP WiFi camera dengan pan 360° & tilt 114°. Night vision, two-way audio, motion tracking. Support SD card 256GB.',
                'image' => 'products/cctv-tapo-c210.webp'
            ],
            [
                'category_id' => 7,
                'name' => 'EZVIZ C6N 2K+ PT WiFi Smart Camera',
                'price' => 550000,
                'stock' => 35,
                'description' => 'WiFi camera 2K+ dengan AI human detection, auto-tracking, color night vision. Smart home integration.',
                'image' => 'products/cctv-ezviz-c6n.webp'
            ],
            [
                'category_id' => 7,
                'name' => 'Reolink RLC-810A 8MP PoE Camera',
                'price' => 2850000,
                'stock' => 15,
                'description' => '4K Ultra HD IP camera dengan person/vehicle detection. Smart spotlight & siren. PoE power. Weatherproof IP66.',
                'image' => 'products/cctv-reolink-810a.webp'
            ],

            // KATEGORI 8: MONITOR
            [
                'category_id' => 8,
                'name' => 'LG UltraGear 27GP850-B 27" Gaming',
                'price' => 5200000,
                'stock' => 12,
                'description' => '27" QHD (2560x1440) Nano IPS, 165Hz, 1ms, G-Sync Compatible, HDR10. Gaming monitor dengan color accuracy tinggi.',
                'image' => 'products/monitor-lg-27gp850.webp'
            ],
            [
                'category_id' => 8,
                'name' => 'Samsung Odyssey G7 32" Curved',
                'price' => 7500000,
                'stock' => 8,
                'description' => '32" QHD 1000R curved, 240Hz, 1ms, HDR600, G-Sync & FreeSync. Immersive gaming experience dengan kurva ekstrem.',
                'image' => 'products/monitor-samsung-g7.webp'
            ],
            [
                'category_id' => 8,
                'name' => 'Dell UltraSharp U2723DE 27" USB-C',
                'price' => 8200000,
                'stock' => 10,
                'description' => '27" QHD IPS Black, 99% sRGB, USB-C hub 90W, height adjustable. Professional monitor untuk content creator.',
                'image' => 'products/monitor-dell-u2723.webp'
            ],
            [
                'category_id' => 8,
                'name' => 'ASUS ProArt PA279CRV 27" 4K',
                'price' => 9500000,
                'stock' => 6,
                'description' => '27" 4K UHD IPS, 100% sRGB & Rec.709, Calman Verified, USB-C 96W. Color-critical work monitor dengan factory calibration.',
                'image' => 'products/monitor-asus-proart.webp'
            ],
            [
                'category_id' => 8,
                'name' => 'AOC 24G2 24" Budget Gaming',
                'price' => 2100000,
                'stock' => 20,
                'description' => '24" Full HD IPS, 144Hz, 1ms, FreeSync Premium. Budget gaming monitor dengan performa solid untuk esports.',
                'image' => 'products/monitor-aoc-24g2.webp'
            ],

            // KATEGORI 9: KOMPONEN KOMPUTER
            [
                'category_id' => 9,
                'name' => 'Intel Core i7-13700K Processor',
                'price' => 5800000,
                'stock' => 15,
                'description' => '16-core (8P+8E), 24 threads, base 3.4GHz boost 5.4GHz. Socket LGA1700. Powerful CPU untuk gaming dan workstation.',
                'image' => 'products/component-intel-i7-13700k.webp'
            ],
            [
                'category_id' => 9,
                'name' => 'NVIDIA GeForce RTX 4070 Ti SUPER',
                'price' => 14500000,
                'stock' => 8,
                'description' => '16GB GDDR6X, 8448 CUDA cores, DLSS 3, ray tracing. High-end GPU untuk 4K gaming dan AI workloads.',
                'image' => 'products/component-rtx-4070ti.webp'
            ],
            [
                'category_id' => 9,
                'name' => 'Corsair Vengeance DDR5 32GB (2x16GB)',
                'price' => 2200000,
                'stock' => 25,
                'description' => 'DDR5-6000MHz CL30, RGB lighting, Intel XMP 3.0. High-performance RAM untuk platform DDR5 terbaru.',
                'image' => 'products/component-corsair-ddr5.webp'
            ],
            [
                'category_id' => 9,
                'name' => 'ASUS ROG Strix Z790-E Gaming WiFi',
                'price' => 7200000,
                'stock' => 10,
                'description' => 'LGA1700 ATX motherboard, PCIe 5.0, DDR5, WiFi 6E, 2.5G LAN. Premium board dengan fitur lengkap untuk enthusiast.',
                'image' => 'products/component-asus-z790.webp'
            ],
            [
                'category_id' => 9,
                'name' => 'Corsair RM1000x 1000W 80+ Gold PSU',
                'price' => 3200000,
                'stock' => 12,
                'description' => 'Fully modular PSU 80+ Gold, silent fan mode, 10 tahun garansi. Reliable power supply untuk high-end PC.',
                'image' => 'products/component-corsair-rm1000x.webp'
            ],

            // KATEGORI 10: JARINGAN
            [
                'category_id' => 10,
                'name' => 'Ubiquiti UniFi Dream Machine Pro',
                'price' => 8500000,
                'stock' => 5,
                'description' => 'All-in-one network appliance: router, switch 8-port, controller. Support UniFi Protect. Enterprise-grade untuk SMB.',
                'image' => 'products/network-unifi-udmpro.webp'
            ],
            [
                'category_id' => 10,
                'name' => 'MikroTik hEX S RB760iGS Gigabit Router',
                'price' => 950000,
                'stock' => 18,
                'description' => '5x Gigabit ports, 1x SFP, RouterOS L4. Powerful router untuk network advanced dengan budget terjangkau.',
                'image' => 'products/network-mikrotik-hexs.webp'
            ],
            [
                'category_id' => 10,
                'name' => 'TP-Link TL-SG1024DE 24-Port Switch',
                'price' => 2200000,
                'stock' => 12,
                'description' => '24-port Gigabit smart managed switch. VLAN, QoS, IGMP snooping. Reliable switch untuk kantor dan warnet.',
                'image' => 'products/network-tplink-sg1024.webp'
            ],
            [
                'category_id' => 10,
                'name' => 'Aruba Instant On AP22 WiFi 6 Access Point',
                'price' => 3500000,
                'stock' => 10,
                'description' => 'WiFi 6 dual-band access point, 2x2 MIMO, cloud managed. Enterprise WiFi mudah setup untuk small business.',
                'image' => 'products/network-aruba-ap22.webp'
            ],
            [
                'category_id' => 10,
                'name' => 'Netgear Nighthawk RAX200 AX11000 Router',
                'price' => 9500000,
                'stock' => 6,
                'description' => 'Tri-band WiFi 6 router 11Gbps total speed. 12-stream, 2.5G WAN, 8 antena. Flagship router untuk ultra-fast network.',
                'image' => 'products/network-netgear-rax200.webp'
            ],
        ];

        foreach ($products as $product) {
            DB::table('products')->insert([
                'category_id' => $product['category_id'],
                'name' => $product['name'],
                'price' => $product['price'],
                'stock' => $product['stock'],
                'description' => $product['description'],
                'image' => $product['image'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $this->command->info('✅ Successfully seeded 50 products (5 per category)');
    }
}
