<?php

declare(strict_types=1);

use App\Models\PromoBanner;
use Illuminate\Support\Facades\Cache;

describe('PromoBanner Model', function () {
    it('can be created and clears cache', function () {
        Cache::put('active_promo_banners.id', ['dummy']);

        $banner = PromoBanner::create([
            'title' => 'Diskon Spesial',
            'description' => 'Promo Baju',
            'cta_text' => 'Beli',
            'cta_link' => '/shop',
            'icon' => 'percent',
            'bg_gradient' => 'from-red-500 to-pink-500',
            'display_type' => 'banner',
            'is_active' => true,
            'priority' => 1,
        ]);

        expect($banner)->toBeInstanceOf(PromoBanner::class)
            ->and($banner->is_active)->toBeTrue();

        expect(Cache::has('active_promo_banners.id'))->toBeFalse();
    });

    it('scopes active banners correctly', function () {
        PromoBanner::create([
            'title' => 'Banner Aktif',
            'cta_text' => 'Klik',
            'cta_link' => '/shop',
            'icon' => 'percent',
            'bg_gradient' => 'from-blue-500 to-indigo-500',
            'display_type' => 'banner',
            'is_active' => true,
            'priority' => 10,
        ]);

        PromoBanner::create([
            'title' => 'Banner Nonaktif',
            'cta_text' => 'Klik',
            'cta_link' => '/shop',
            'icon' => 'percent',
            'bg_gradient' => 'from-blue-500 to-indigo-500',
            'display_type' => 'banner',
            'is_active' => false,
            'priority' => 5,
        ]);

        $activeBanners = PromoBanner::active()->get();

        expect($activeBanners->pluck('title')->all())->toContain('Banner Aktif')
            ->and($activeBanners->pluck('title')->all())->not->toContain('Banner Nonaktif');
    });
});
