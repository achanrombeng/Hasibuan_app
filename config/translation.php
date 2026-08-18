<?php

return [
    'default_locale' => 'id',
    'supported_locales' => ['id', 'en'],
    'fallback_locale' => 'id',

    'auto_translate' => [
        'enabled' => env('AUTO_TRANSLATE_ENABLED', true),
        'provider' => 'google', // google|libretranslate
        'rate_limit' => [
            'delay_ms' => 100, // Delay between requests
            'max_retries' => 3,
        ],
    ],

    'translatable_models' => [
        'products' => \App\Models\Product::class,
        'categories' => \App\Models\Category::class,
        'promo_banners' => \App\Models\PromoBanner::class,
    ],
];
