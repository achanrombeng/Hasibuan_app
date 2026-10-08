<?php

namespace App\Http\Middleware;

use App\Models\Category;
use App\Models\DealerInquiry;
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
                    $query->active()->orderBy('sort_order')->orderBy('id');
                }])
                ->orderBy('sort_order')
                ->orderBy('id')
                ->get()
                ->map(function ($category) {
                    return [
                        'id' => $category->id,
                        'name' => $category->name, // Automatically translated
                        'slug' => $category->slug,
                        'description' => $category->description,
                        'image_url' => $category->image_url,
                        'is_featured' => $category->is_featured,
                        'sort_order' => $category->sort_order,
                        'children' => $category->children->map(function ($child) {
                            return [
                                'id' => $child->id,
                                'name' => $child->name,
                                'slug' => $child->slug,
                                'sort_order' => $child->sort_order,
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
            'newDealerInquiriesCount' => $user ? DealerInquiry::where('status', 'new')->count() : 0,
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'siteSettings' => fn () => $this->getSiteSettings(),
            'featuredCategories' => $featuredCategories,
            'activePromoBanners' => $activePromoBanners,
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'warning' => fn () => $request->session()->get('warning'),
                'info' => fn () => $request->session()->get('info'),
            ],
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
                'site_name' => $settings['site_name'] ?? config('app.name', 'Hasibuan Design'),
                'site_logo' => $settings['site_logo'] ?? '/images/hasibuan-logo.png',
                'site_description' => $settings['site_description'] ?? 'Toko furnitur premium Indonesia',
                'contact_email' => $settings['contact_email'] ?? '',
                'contact_email_2' => $settings['contact_email_2'] ?? '',
                'contact_phone' => $settings['contact_phone'] ?? '',
                'contact_whatsapp' => $settings['contact_whatsapp'] ?? '',
                'admin_1_name' => $settings['marketing_1_name'] ?? ($settings['admin_1_name'] ?? ''),
                'admin_1_email' => $settings['marketing_1_email'] ?? ($settings['admin_1_email'] ?? ($settings['contact_email'] ?? '')),
                'admin_1_phone' => $settings['marketing_1_phone'] ?? ($settings['admin_1_phone'] ?? ($settings['contact_whatsapp'] ?? ($settings['contact_phone'] ?? ''))),
                'admin_2_name' => $settings['marketing_2_name'] ?? ($settings['admin_2_name'] ?? ''),
                'admin_2_email' => $settings['marketing_2_email'] ?? ($settings['admin_2_email'] ?? ($settings['contact_email_2'] ?? '')),
                'admin_2_phone' => $settings['marketing_2_phone'] ?? ($settings['admin_2_phone'] ?? ''),
                'marketing_1_name' => $settings['marketing_1_name'] ?? ($settings['admin_1_name'] ?? ''),
                'marketing_1_email' => $settings['marketing_1_email'] ?? ($settings['admin_1_email'] ?? ($settings['contact_email'] ?? '')),
                'marketing_1_phone' => $settings['marketing_1_phone'] ?? ($settings['admin_1_phone'] ?? ($settings['contact_whatsapp'] ?? ($settings['contact_phone'] ?? ''))),
                'marketing_2_name' => $settings['marketing_2_name'] ?? ($settings['admin_2_name'] ?? ''),
                'marketing_2_email' => $settings['marketing_2_email'] ?? ($settings['admin_2_email'] ?? ($settings['contact_email_2'] ?? '')),
                'marketing_2_phone' => $settings['marketing_2_phone'] ?? ($settings['admin_2_phone'] ?? ''),
                'factory_name' => $settings['factory_name'] ?? '',
                'factory_address' => $settings['factory_address'] ?? '',
                'showroom_name' => $settings['showroom_name'] ?? '',
                'showroom_address' => $settings['showroom_address'] ?? '',
                'maps_showroom_url' => $settings['maps_showroom_url'] ?? '',
                'maps_factory_url' => $settings['maps_factory_url'] ?? '',
                'address' => $settings['address'] ?? '',
                'facebook_url' => $settings['facebook_url'] ?? '',
                'instagram_url' => $settings['instagram_url'] ?? '',
                'tiktok_url' => $settings['tiktok_url'] ?? '',
                'youtube_url' => $settings['youtube_url'] ?? '',
                'linkedin_url' => $settings['linkedin_url'] ?? '',
                'social_links' => $settings['social_links'] ?? '',
                'footer_description' => $settings['footer_description'] ?? '',
                'footer_tagline' => $settings['footer_tagline'] ?? '',
                'footer_copyright' => $settings['footer_copyright'] ?? '',
                'footer_show_newsletter' => array_key_exists('footer_show_newsletter', $settings) ? filter_var($settings['footer_show_newsletter'], FILTER_VALIDATE_BOOLEAN) : true,
                'footer_newsletter_badge' => $settings['footer_newsletter_badge'] ?? '',
                'footer_newsletter_title' => $settings['footer_newsletter_title'] ?? '',
                'footer_newsletter_subtitle' => $settings['footer_newsletter_subtitle'] ?? '',
                'footer_col1_title' => $settings['footer_col1_title'] ?? '',
                'footer_col1_links' => $settings['footer_col1_links'] ?? '',
                'footer_col2_title' => $settings['footer_col2_title'] ?? '',
                'footer_col2_links' => $settings['footer_col2_links'] ?? '',
                'footer_col3_title' => $settings['footer_col3_title'] ?? '',
                'footer_col3_links' => $settings['footer_col3_links'] ?? '',
                'footer_col4_title' => $settings['footer_col4_title'] ?? '',
                'footer_col4_links' => $settings['footer_col4_links'] ?? '',
                'footer_contact_title' => $settings['footer_contact_title'] ?? '',
                'footer_show_factory' => array_key_exists('footer_show_factory', $settings) ? filter_var($settings['footer_show_factory'], FILTER_VALIDATE_BOOLEAN) : false,
                'footer_show_showroom' => array_key_exists('footer_show_showroom', $settings) ? filter_var($settings['footer_show_showroom'], FILTER_VALIDATE_BOOLEAN) : false,
                'footer_show_phone' => array_key_exists('footer_show_phone', $settings) ? filter_var($settings['footer_show_phone'], FILTER_VALIDATE_BOOLEAN) : false,
                'footer_show_whatsapp' => array_key_exists('footer_show_whatsapp', $settings) ? filter_var($settings['footer_show_whatsapp'], FILTER_VALIDATE_BOOLEAN) : true,
                'footer_show_email' => array_key_exists('footer_show_email', $settings) ? filter_var($settings['footer_show_email'], FILTER_VALIDATE_BOOLEAN) : false,
                'footer_show_socials' => array_key_exists('footer_show_socials', $settings) ? filter_var($settings['footer_show_socials'], FILTER_VALIDATE_BOOLEAN) : true,
                'footer_show_privacy' => array_key_exists('footer_show_privacy', $settings) ? filter_var($settings['footer_show_privacy'], FILTER_VALIDATE_BOOLEAN) : true,
                'footer_show_terms' => array_key_exists('footer_show_terms', $settings) ? filter_var($settings['footer_show_terms'], FILTER_VALIDATE_BOOLEAN) : true,
                'footer_privacy_url' => $settings['footer_privacy_url'] ?? '',
                'footer_terms_url' => $settings['footer_terms_url'] ?? '',
                'footer_show_sitemap' => array_key_exists('footer_show_sitemap', $settings) ? filter_var($settings['footer_show_sitemap'], FILTER_VALIDATE_BOOLEAN) : true,
                'footer_sitemap_url' => $settings['footer_sitemap_url'] ?? '',
                'footer_show_accessibility' => array_key_exists('footer_show_accessibility', $settings) ? filter_var($settings['footer_show_accessibility'], FILTER_VALIDATE_BOOLEAN) : true,
                'footer_accessibility_text' => $settings['footer_accessibility_text'] ?? '',
                'catalog_pdf_url' => array_key_exists('catalog_pdf_url', $settings) ? ($settings['catalog_pdf_url'] ?? '') : '/catalogs/ronica-catalog-2026.pdf',
                'catalog_docx_url' => array_key_exists('catalog_docx_url', $settings) ? ($settings['catalog_docx_url'] ?? '') : '/catalogs/ronica-catalog-2026.docx',
                'catalog_title' => $settings['catalog_title'] ?? 'Ronica Product Catalogue 2026',
            ];
        });
    }
}
