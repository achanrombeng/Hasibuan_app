<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\PromoBanner;

return [
    'default_locale' => 'en',
    'supported_locales' => ['en', 'id'],
    'fallback_locale' => 'en',

    'auto_translate' => [
        'enabled' => env('AUTO_TRANSLATE_ENABLED', true),
        'provider' => 'google', // google|libretranslate
        'rate_limit' => [
            'delay_ms' => 100, // Delay between requests
            'max_retries' => 3,
        ],
    ],

    'translatable_models' => [
        'products' => Product::class,
        'categories' => Category::class,
        'promo_banners' => PromoBanner::class,
    ],
];
