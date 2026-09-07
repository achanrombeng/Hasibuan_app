<?php

declare(strict_types=1);

use App\Models\DealerInquiry;

test('guest can submit dealer inquiry with email in contact field', function () {
    $response = $this->post(route('shop.dealer.store'), [
        'name' => 'Budi Santoso',
        'contact' => 'budi@example.com',
        'message' => 'Saya tertarik menjadi mitra dealer furnitur di Surabaya.',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $inquiry = DealerInquiry::where('name', 'Budi Santoso')->first();
    expect($inquiry)->not->toBeNull();
    expect($inquiry->email)->toBe('budi@example.com');
    expect($inquiry->message)->toContain('Surabaya');
});

test('guest can submit dealer inquiry with phone number in contact field', function () {
    $response = $this->post(route('shop.dealer.store'), [
        'name' => 'Joko Widodo',
        'contact' => '+628123456789',
        'message' => 'Mohon info katalog dan syarat reseller.',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $inquiry = DealerInquiry::where('name', 'Joko Widodo')->first();
    expect($inquiry)->not->toBeNull();
    expect($inquiry->phone)->toBe('+628123456789');
});
