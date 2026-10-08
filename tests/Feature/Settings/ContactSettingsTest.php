<?php

declare(strict_types=1);

use App\Models\Setting;
use App\Models\User;
use Spatie\Permission\Models\Role;

test('admin can toggle admin 2 visibility and showroom/factory display modes', function () {
    $admin = User::firstOrCreate(
        ['email' => 'admin_test@example.com'],
        [
            'name' => 'Admin Test',
            'password' => bcrypt('password'),
        ]
    );
    Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
    if (! $admin->hasRole('admin')) {
        $admin->assignRole('admin');
    }

    $response = $this->actingAs($admin)->post('/admin/settings', [
        'site_name' => 'Hasibuan Design',
        'show_admin_2' => false,
        'location_display_mode' => 'showroom',
        'showroom_name' => 'Ronica Furniture',
        'showroom_address' => 'Jepara, Indonesia',
        'factory_name' => 'PT. Eren Outdoor',
        'factory_address' => 'Cirebon, Indonesia',
    ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();

    expect(Setting::where('key', 'show_admin_2')->value('value'))->toBe('0');
    expect(Setting::where('key', 'location_display_mode')->value('value'))->toBe('showroom');
    expect(Setting::where('key', 'show_showroom')->value('value'))->toBe('1');
    expect(Setting::where('key', 'show_factory')->value('value'))->toBe('0');

    // Test Factory Only
    $responseFactory = $this->actingAs($admin)->post('/admin/settings', [
        'site_name' => 'Hasibuan Design',
        'show_admin_2' => true,
        'location_display_mode' => 'factory',
    ]);
    $responseFactory->assertSessionHasNoErrors();
    expect(Setting::where('key', 'show_admin_2')->value('value'))->toBe('1');
    expect(Setting::where('key', 'location_display_mode')->value('value'))->toBe('factory');
    expect(Setting::where('key', 'show_showroom')->value('value'))->toBe('0');
    expect(Setting::where('key', 'show_factory')->value('value'))->toBe('1');
});
