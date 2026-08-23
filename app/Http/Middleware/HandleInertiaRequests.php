<?php

namespace App\Http\Middleware;

use App\Models\Category;
use App\Models\PromoBanner;
use App\Models\Setting;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        $user = $request->user();
        $locale = App::getLocale();

        // Fetch featured categories for global navbar
        // Cache to avoid query on every page load
        $featuredCategories = Cache::remember("featured_categories_navbar.{$locale}", 3600, function () {
            return Category::query()
                ->active()
                ->root() // Only top level
                ->with(['children' => function ($query) {
                    $query->active()->orderBy('sort_order');
                }])
                ->orderBy('sort_order')
                ->limit(11) // Limit logic updated to match shop page
                ->get()
                ->map(function ($category) {
                    return [
                        'id' => $category->id,
                        'name' => $category->name, // Automatically translated
                        'slug' => $category->slug,
                        'description' => $category->description,
                        'image_url' => $category->image_url,
                        'is_featured' => $category->is_featured,
                        'children' => $category->children->map(function ($child) {
                            return [
                                'id' => $child->id,
                                'name' => $child->name,
                                'slug' => $child->slug,
                            ];
                        }),
                    ];
                });
        });

        // Fetch active promo banners for shop frontend
        $activePromoBanners = Cache::remember("active_promo_banners.{$locale}", 300, function () {
            return PromoBanner::active()
                ->ordered()
                ->get()
                ->map(function ($banner) {
                    return [
                        'id' => $banner->id,
                        'title' => $banner->title, // Automatically translated
                        'description' => $banner->description, // Automatically translated
                        'cta_text' => $banner->cta_text, // Automatically translated
                        'cta_link' => $banner->cta_link,
                        'icon' => $banner->icon,
                        'bg_gradient' => $banner->bg_gradient,
                        'display_type' => $banner->display_type,
                    ];
                });
        });

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $user ? [
                    ...$user->toArray(),
                    'roles' => $user->getRoleNames(),
                ] : null,
            ],
            'locale' => $locale,
            'translations' => fn () => $this->getTranslations($locale, $request),
            'wishlistCount' => $user ? $user->wishlists()->count() : 0,
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'siteSettings' => fn () => $this->getSiteSettings(),
            'featuredCategories' => $featuredCategories,
            'activePromoBanners' => $activePromoBanners,
        ];
    }

    /**
     * Get filtered translations for the current route.
     *
     * @return array<string, string>
     */
    private function getTranslations(string $locale, Request $request): array
    {
        $path = $request->path();

        // Determine which namespace prefixes to include
        $prefixes = ['common.', 'auth.'];

        if (str_starts_with($path, 'admin')) {
            $prefixes[] = 'admin.';
        } elseif (str_starts_with($path, 'settings')) {
            $prefixes[] = 'settings.';
        } else {
            // Root "/" or shop routes include "shop."
            $prefixes[] = 'shop.';
        }

        if (app()->environment('local')) {
            $file = lang_path("{$locale}.json");

            if (! File::exists($file)) {
                return [];
            }

            $all = json_decode(File::get($file), true) ?? [];

            return collect($all)
                ->filter(function ($value, $key) use ($prefixes) {
                    foreach ($prefixes as $prefix) {
                        if (str_starts_with($key, $prefix)) {
                            return true;
                        }
                    }

                    return false;
                })
                ->all();
        }

        return Cache::remember("translations.{$locale}.{$path}", 3600, function () use ($locale, $prefixes) {
            $file = lang_path("{$locale}.json");

            if (! File::exists($file)) {
                return [];
            }

            $all = json_decode(File::get($file), true) ?? [];

            return collect($all)
                ->filter(function ($value, $key) use ($prefixes) {
                    foreach ($prefixes as $prefix) {
                        if (str_starts_with($key, $prefix)) {
                            return true;
                        }
                    }

                    return false;
                })
                ->all();
        });
    }

    /**
     * Get site settings from cache or database.
     *
     * @return array<string, mixed>
     */
    private function getSiteSettings(): array
    {
        $locale = App::getLocale();

        return Cache::remember("site_settings.{$locale}", 3600, function () {
            $settings = Setting::all()->pluck('value', 'key')->toArray();

            return [
                'site_name' => $settings['site_name'] ?? 'Ronica',
                'site_logo' => $settings['site_logo'] ?? '/ronica.png',
                'site_description' => $settings['site_description'] ?? 'Toko furnitur premium Indonesia',
                'contact_email' => $settings['contact_email'] ?? '',
                'contact_email_2' => $settings['contact_email_2'] ?? '',
                'contact_phone' => $settings['contact_phone'] ?? '',
                'contact_whatsapp' => $settings['contact_whatsapp'] ?? '',
                'factory_address' => $settings['factory_address'] ?? '',
                'showroom_address' => $settings['showroom_address'] ?? '',
                'maps_showroom_url' => $settings['maps_showroom_url'] ?? '',
                'maps_factory_url' => $settings['maps_factory_url'] ?? '',
                'address' => $settings['address'] ?? '',
                'facebook_url' => $settings['facebook_url'] ?? '',
                'instagram_url' => $settings['instagram_url'] ?? '',
                'tiktok_url' => $settings['tiktok_url'] ?? '',
            ];
        });
    }
}
