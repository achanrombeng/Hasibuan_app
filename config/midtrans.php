<?php

return [
    'server_key' => env('MIDTRANS_SERVER_KEY', env('midtrans_server_key')),
    'client_key' => env('MIDTRANS_CLIENT_KEY', env('midtrans_client_key')),
    'is_production' => (bool) env('MIDTRANS_IS_PRODUCTION', env('midtrans_is_production', false)),
    'is_sanitized' => (bool) env('MIDTRANS_IS_SANITIZED', true),
    'is_3ds' => (bool) env('MIDTRANS_IS_3DS', true),
];
