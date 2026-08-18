<?php

return [
    'api_key' => env('RAJAONGKIR_API_KEY'),
    'base_url' => env('RAJAONGKIR_BASE_URL', 'https://rajaongkir.komerce.id/api/v1'),
    'origin' => env('RAJAONGKIR_ORIGIN_ID', '17547'), // District ID for Jepara, Jawa Tengah
    'default_couriers' => env('RAJAONGKIR_COURIERS', 'jne:sicepat:jnt:anteraja'),
];
