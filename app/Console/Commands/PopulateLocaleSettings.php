<?php

namespace App\Console\Commands;

use App\Models\Setting;
use Illuminate\Console\Command;

class PopulateLocaleSettings extends Command
{
    protected $signature = 'settings:populate-locale';
    protected $description = 'Populate locale-specific settings for hero section';

    public function handle()
    {
        $this->info('Populating locale-specific settings...');

        $settings = [
            // Hero Badge
            'hero_badge_id' => 'Koleksi Terbaru 2025',
            'hero_badge_en' => 'Latest Collection 2025',

            // Hero Title
            'hero_title_id' => 'Desain yang',
            'hero_title_en' => 'Design that',

            // Hero Title Highlight
            'hero_title_highlight_id' => 'bernafas.',
            'hero_title_highlight_en' => 'breathes.',

            // Hero Description
            'hero_description_id' => 'Furniture minimalis dari bahan berkelanjutan. Dibuat untuk mereka yang menemukan kemewahan dalam kesederhanaan.',
            'hero_description_en' => 'Minimalist furniture from sustainable materials. Made for those who find luxury in simplicity.',

            // Hero Product Name
            'hero_product_name_id' => 'Kursi Santai Premium',
            'hero_product_name_en' => 'Premium Lounge Chair',

            // Home Values (Indonesian)
            'home_values_id' => json_encode([
                ['icon' => 'leaf', 'title' => 'Bahan Berkelanjutan', 'desc' => 'Setiap produk menggunakan kayu dari hutan yang dikelola secara bertanggung jawab dan bahan daur ulang.'],
                ['icon' => 'truck', 'title' => 'Gratis Pengiriman', 'desc' => 'Pengiriman gratis untuk pembelian di atas Rp 5 juta ke seluruh Indonesia.'],
                ['icon' => 'shield-check', 'title' => 'Garansi Selamanya', 'desc' => 'Garansi seumur hidup untuk semua kerusakan struktural karena kami percaya dengan kualitas kami.'],
            ]),

            // Home Values (English)
            'home_values_en' => json_encode([
                ['icon' => 'leaf', 'title' => 'Sustainable Materials', 'desc' => 'Every product uses wood from responsibly managed forests and recycled materials.'],
                ['icon' => 'truck', 'title' => 'Free Shipping', 'desc' => 'Free shipping for purchases over Rp 5 million throughout Indonesia.'],
                ['icon' => 'shield-check', 'title' => 'Lifetime Warranty', 'desc' => 'Lifetime warranty for all structural damage because we believe in our quality.'],
            ]),
        ];

        foreach ($settings as $key => $value) {
            Setting::set($key, $value);
            $this->info("Set: {$key}");
        }

        $this->info('Done! Locale-specific settings populated.');
        $this->warn('Run: php artisan cache:clear');

        return 0;
    }
}
