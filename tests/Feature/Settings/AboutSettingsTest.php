<?php

declare(strict_types=1);

use App\Models\Setting;
use App\Models\User;
use Spatie\Permission\Models\Role;

test('public visitor can view shop about page with Hasibuan Designs data', function () {
    $response = $this->get('/shop/about');

    $response->assertOk();
    $response->assertSee('Hasibuan Designs');
    $response->assertSee('Company Profile');
});

test('admin can access and update about settings', function () {
    $admin = User::firstOrCreate(
        ['email' => 'admin_about_test@example.com'],
        [
            'name' => 'Admin About Test',
            'password' => bcrypt('password'),
        ]
    );
    Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
    if (! $admin->hasRole('admin')) {
        $admin->assignRole('admin');
    }

    $response = $this->actingAs($admin)->get('/admin/settings/about');
    $response->assertOk();

    $updateResponse = $this->actingAs($admin)->post('/admin/settings/about', [
        'about_story_title' => 'Company Profile – Hasibuan Designs',
        'about_story_subtitle' => 'Jepara Teak Wood Master Craftsmen',
        'about_story_content' => 'Hasibuan Designs is a Jepara based company specialising in the wooden furniture.',
        'existing_images' => ['/images/about/hasibuan-profile-1.webp'],
    ]);

    $updateResponse->assertSessionHasNoErrors();
    $updateResponse->assertRedirect();

    expect(Setting::where('key', 'about_story_title')->value('value'))->toBe('Company Profile – Hasibuan Designs');
});
