<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Actions\Product\ExtractProductFromImageAction;
use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function index(): Response
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();

        return Inertia::render('Admin/Settings/Index', [
            'settings' => [
                'site_name' => $settings['site_name'] ?? 'Ronica',
                'site_logo' => $settings['site_logo'] ?? '/ronica.png',
                'site_description' => $settings['site_description'] ?? '',
                'contact_email' => $settings['contact_email'] ?? '',
                'contact_phone' => $settings['contact_phone'] ?? '',
                'contact_whatsapp' => $settings['contact_whatsapp'] ?? '',
                'address' => $settings['address'] ?? '',
                'facebook_url' => $settings['facebook_url'] ?? '',
                'instagram_url' => $settings['instagram_url'] ?? '',
                'tiktok_url' => $settings['tiktok_url'] ?? '',
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'site_name' => ['required', 'string', 'max:255'],
            'site_logo' => ['nullable', 'string', 'max:500'],
            'site_logo_file' => ['nullable', 'file', 'max:10240', 'mimes:jpg,jpeg,png,webp,svg,gif'],
            'site_description' => ['nullable', 'string', 'max:500'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'contact_phone' => ['nullable', 'string', 'max:20'],
            'contact_whatsapp' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:500'],
            'facebook_url' => ['nullable', 'url', 'max:255'],
            'instagram_url' => ['nullable', 'url', 'max:255'],
            'tiktok_url' => ['nullable', 'url', 'max:255'],
        ]);

        if ($request->hasFile('site_logo_file')) {
            $file = $request->file('site_logo_file');
            $path = $file->store('settings/logo', 'public');
            $validated['site_logo'] = '/storage/'.$path;
        }
        unset($validated['site_logo_file']);

        foreach ($validated as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value ?? '']
            );
        }

        // Clear site settings cache
        Cache::forget('site_settings');
        Cache::forget('site_settings.id');
        Cache::forget('site_settings.en');

        return back()->with('success', __('messages.settings_saved'));
    }

    /**
     * Homepage settings page
     */
    public function homepage(): Response
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();
        $locale = app()->getLocale();

        // Load locale-specific hero text, falling back to non-localized keys
        return Inertia::render('Admin/Settings/Homepage', [
            'locale' => $locale,
            'settings' => [
                'site_logo' => $settings['site_logo'] ?? '/ronica.png',
                // Hero Section (locale-aware)
                'hero_badge' => $settings["hero_badge_{$locale}"] ?? $settings['hero_badge'] ?? ($locale === 'en' ? 'Latest Collection 2025' : 'Koleksi Terbaru 2025'),
                'hero_title' => $settings["hero_title_{$locale}"] ?? $settings['hero_title'] ?? ($locale === 'en' ? 'Design that' : 'Desain yang'),
                'hero_title_highlight' => $settings["hero_title_highlight_{$locale}"] ?? $settings['hero_title_highlight'] ?? ($locale === 'en' ? 'breathes.' : 'bernafas.'),
                'hero_description' => $settings["hero_description_{$locale}"] ?? $settings['hero_description'] ?? ($locale === 'en' ? 'Minimalist furniture from sustainable materials. Made for those who find luxury in simplicity.' : 'Furniture minimalis dari bahan berkelanjutan. Dibuat untuk mereka yang menemukan kemewahan dalam kesederhanaan.'),
                'hero_image_main' => $settings['hero_image_main'] ?? '/images/placeholder-hero.svg',
                'hero_media_type' => $settings['hero_media_type'] ?? 'image',
                'hero_product_name' => $settings["hero_product_name_{$locale}"] ?? $settings['hero_product_name'] ?? ($locale === 'en' ? 'Premium Lounge Chair' : 'Kursi Santai Premium'),
                // Trust Logos (JSON array, not locale-specific)
                'trust_logos' => $settings['trust_logos'] ?? json_encode([
                    ['name' => 'Kompas', 'logo_url' => ''],
                    ['name' => 'Tempo', 'logo_url' => ''],
                    ['name' => 'Forbes Indonesia', 'logo_url' => ''],
                ]),
                // Values (JSON array, locale-aware)
                'home_values' => $settings["home_values_{$locale}"] ?? $settings['home_values'] ?? json_encode([
                    ['icon' => 'leaf', 'title' => 'Bahan Berkelanjutan', 'desc' => 'Setiap produk menggunakan kayu dari hutan yang dikelola secara bertanggung jawab dan bahan daur ulang.'],
                    ['icon' => 'truck', 'title' => 'Gratis Pengiriman', 'desc' => 'Pengiriman gratis untuk pembelian di atas Rp 5 juta ke seluruh Indonesia.'],
                    ['icon' => 'shield-check', 'title' => 'Garansi Selamanya', 'desc' => 'Garansi seumur hidup untuk semua kerusakan struktural karena kami percaya dengan kualitas kami.'],
                ]),
                // Carousel Banners (JSON array, not locale-specific)
                'carousel_banners' => $settings['carousel_banners'] ?? json_encode([]),
                // Section visibility (not locale-specific)
                'section_carousel_banners_visible' => filter_var($settings['section_carousel_banners_visible'] ?? true, FILTER_VALIDATE_BOOLEAN),
                'section_hero_visible' => filter_var($settings['section_hero_visible'] ?? true, FILTER_VALIDATE_BOOLEAN),
                'section_trust_visible' => filter_var($settings['section_trust_visible'] ?? true, FILTER_VALIDATE_BOOLEAN),
                'section_categories_visible' => filter_var($settings['section_categories_visible'] ?? true, FILTER_VALIDATE_BOOLEAN),
                'section_catalog_visible' => filter_var($settings['section_catalog_visible'] ?? true, FILTER_VALIDATE_BOOLEAN),
                'section_values_visible' => filter_var($settings['section_values_visible'] ?? true, FILTER_VALIDATE_BOOLEAN),
                'section_products_visible' => filter_var($settings['section_products_visible'] ?? true, FILTER_VALIDATE_BOOLEAN),
                'section_testimonials_visible' => filter_var($settings['section_testimonials_visible'] ?? true, FILTER_VALIDATE_BOOLEAN),
                'section_newsletter_visible' => filter_var($settings['section_newsletter_visible'] ?? true, FILTER_VALIDATE_BOOLEAN),
            ],
        ]);
    }

    /**
     * Update homepage settings
     */
    public function updateHomepage(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'site_logo' => ['nullable', 'string', 'max:500'],
            'site_logo_file' => ['nullable', 'file', 'max:10240', 'mimes:jpg,jpeg,png,webp,svg,gif'],
            'hero_badge' => ['nullable', 'string', 'max:100'],
            'hero_title' => ['nullable', 'string', 'max:100'],
            'hero_title_highlight' => ['nullable', 'string', 'max:100'],
            'hero_description' => ['nullable', 'string', 'max:500'],
            'hero_image_main' => ['nullable', 'string', 'max:500'],
            'hero_media_file' => ['nullable', 'file', 'max:51200', 'mimes:jpg,jpeg,png,webp,gif,mp4,webm'],
            'hero_media_type' => ['nullable', 'string', 'in:image,video'],
            'hero_product_name' => ['nullable', 'string', 'max:100'],
            'trust_logos' => ['nullable', 'string'],
            'home_values' => ['nullable', 'string'],
            // Carousel banners
            'carousel_banners' => ['nullable', 'string'],
            'carousel_banner_files' => ['nullable', 'array'],
            'carousel_banner_files.*' => ['nullable', 'file', 'max:10240', 'mimes:jpg,jpeg,png,webp,gif'],
            // Section visibility
            'section_carousel_banners_visible' => ['required', 'boolean'],
            'section_hero_visible' => ['required', 'boolean'],
            'section_trust_visible' => ['required', 'boolean'],
            'section_categories_visible' => ['required', 'boolean'],
            'section_catalog_visible' => ['required', 'boolean'],
            'section_values_visible' => ['required', 'boolean'],
            'section_products_visible' => ['required', 'boolean'],
            'section_testimonials_visible' => ['required', 'boolean'],
            'section_newsletter_visible' => ['required', 'boolean'],
        ]);

        $locale = app()->getLocale();

        // Handle site logo file upload
        if ($request->hasFile('site_logo_file')) {
            $file = $request->file('site_logo_file');
            $path = $file->store('settings/logo', 'public');
            $validated['site_logo'] = '/storage/'.$path;
        }
        unset($validated['site_logo_file']);

        // Handle hero media file upload
        if ($request->hasFile('hero_media_file')) {
            $file = $request->file('hero_media_file');

            // Delete old uploaded file if it exists
            $this->deleteOldHeroFile();

            // Store new file
            $path = $file->store('settings/hero', 'public');
            $validated['hero_image_main'] = '/storage/'.$path;

            // Auto-detect media type from MIME
            $mime = $file->getMimeType();
            $validated['hero_media_type'] = str_starts_with($mime, 'video/') ? 'video' : 'image';
        } elseif (! empty($validated['hero_image_main'])) {
            // URL mode — clean up old uploaded file
            $this->deleteOldHeroFile();

            // Auto-detect media type from URL extension
            $ext = strtolower(pathinfo(parse_url($validated['hero_image_main'], PHP_URL_PATH) ?? '', PATHINFO_EXTENSION));
            if (in_array($ext, ['mp4', 'webm'])) {
                $validated['hero_media_type'] = 'video';
            } elseif (! isset($validated['hero_media_type'])) {
                $validated['hero_media_type'] = 'image';
            }
        }

        // Remove file field from validated data before saving to settings
        unset($validated['hero_media_file']);

        // Handle carousel banner file uploads
        if (isset($validated['carousel_banners'])) {
            $banners = json_decode($validated['carousel_banners'], true) ?? [];
            $bannerFiles = $request->file('carousel_banner_files', []);

            foreach ($bannerFiles as $index => $file) {
                if ($file && isset($banners[$index])) {
                    $path = $file->store('settings/carousel', 'public');
                    $banners[$index]['image_url'] = '/storage/'.$path;
                }
            }

            // Cleanup orphaned carousel images
            $this->cleanupCarouselImages($banners);

            $validated['carousel_banners'] = json_encode($banners);
        }
        unset($validated['carousel_banner_files']);

        // Keys that need locale-specific storage
        $localeKeys = [
            'hero_badge', 'hero_title', 'hero_title_highlight',
            'hero_description', 'hero_product_name', 'home_values',
        ];

        foreach ($validated as $key => $value) {
            $storeValue = is_bool($value) ? ($value ? '1' : '0') : ($value ?? '');

            if (in_array($key, $localeKeys)) {
                // Save to locale-specific key (e.g., hero_badge_id)
                Setting::updateOrCreate(
                    ['key' => "{$key}_{$locale}"],
                    ['value' => $storeValue]
                );
            } else {
                // Save non-localized keys as-is (images, section visibility, trust logos)
                Setting::updateOrCreate(
                    ['key' => $key],
                    ['value' => $storeValue]
                );
            }
        }

        // Clear all locale-specific caches
        Cache::forget('site_settings');
        Cache::forget('site_settings.id');
        Cache::forget('site_settings.en');

        return back()->with('success', __('messages.homepage_settings_saved'));
    }

    /**
     * AI settings page
     */
    public function ai(): Response
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();

        return Inertia::render('Admin/Settings/AI', [
            'settings' => [
                'gemini_api_key' => $settings['gemini_api_key'] ?? '',
                'ai_prompt_template' => $settings['ai_prompt_template'] ?? '',
                'ai_model' => $settings['ai_model'] ?? '',
                'ai_temperature' => (float) ($settings['ai_temperature'] ?? 0.4),
            ],
            'defaultPrompt' => ExtractProductFromImageAction::defaultPromptTemplate(),
            'configuredModel' => config('services.gemini.model', 'gemini-2.0-flash'),
            'availableModels' => [
                'gemini-2.0-flash',
                'gemini-2.0-flash-lite',
                'gemini-2.5-flash-preview-05-20',
                'gemini-1.5-flash',
                'gemini-1.5-flash-8b',
                'gemini-1.5-pro',
            ],
        ]);
    }

    /**
     * Update AI settings
     */
    public function updateAi(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'gemini_api_key' => ['nullable', 'string', 'max:255'],
            'ai_prompt_template' => [
                'nullable',
                'string',
                'max:10000',
                function (string $attribute, mixed $value, \Closure $fail) {
                    if ($value !== null && $value !== '' && ! str_contains($value, '{{CATEGORY_LIST}}')) {
                        $fail('Template prompt harus mengandung placeholder {{CATEGORY_LIST}}.');
                    }
                },
            ],
            'ai_model' => ['nullable', 'string', 'max:100'],
            'ai_temperature' => ['nullable', 'numeric', 'min:0', 'max:1'],
        ]);

        foreach ($validated as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value !== null ? (string) $value : '']
            );
        }

        Cache::forget('site_settings');

        return back()->with('success', __('messages.ai_settings_saved'));
    }

    /**
     * Delete old hero file from storage if it was an uploaded file.
     */
    private function deleteOldHeroFile(): void
    {
        $oldPath = Setting::get('hero_image_main', '');
        if (str_starts_with($oldPath, '/storage/settings/hero/')) {
            $relativePath = str_replace('/storage/', '', $oldPath);
            Storage::disk('public')->delete($relativePath);
        }
    }

    /**
     * Delete orphaned carousel images from storage.
     */
    private function cleanupCarouselImages(array $newBanners): void
    {
        $oldBannersJson = Setting::get('carousel_banners', '[]');
        $oldBanners = json_decode($oldBannersJson, true) ?? [];

        $newImageUrls = array_column($newBanners, 'image_url');

        foreach ($oldBanners as $oldBanner) {
            $url = $oldBanner['image_url'] ?? '';
            if (str_starts_with($url, '/storage/settings/carousel/') && ! in_array($url, $newImageUrls)) {
                $relativePath = str_replace('/storage/', '', $url);
                Storage::disk('public')->delete($relativePath);
            }
        }
    }

    /**
     * Payment settings page
     */
    public function payment(): Response
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();

        // Check if Midtrans is configured
        $midtransConfigured = ! empty(config('midtrans.server_key')) && ! empty(config('midtrans.client_key'));

        return Inertia::render('Admin/Settings/Payment', [
            'settings' => [
                // Midtrans
                'midtrans_enabled' => filter_var($settings['midtrans_enabled'] ?? true, FILTER_VALIDATE_BOOLEAN),
                'midtrans_environment' => $settings['midtrans_environment'] ?? (config('midtrans.is_production') ? 'production' : 'sandbox'),
                // WhatsApp Payment
                'whatsapp_payment_enabled' => filter_var($settings['whatsapp_payment_enabled'] ?? true, FILTER_VALIDATE_BOOLEAN),
                'whatsapp_payment_message' => $settings['whatsapp_payment_message'] ?? 'Halo, saya ingin melakukan pemesanan:',
                // Bank Transfer
                'bank_name' => $settings['bank_name'] ?? 'BCA',
                'bank_account_number' => $settings['bank_account_number'] ?? '',
                'bank_account_name' => $settings['bank_account_name'] ?? '',
                // General Payment
                'cod_fee' => (int) ($settings['cod_fee'] ?? 5000),
                'payment_deadline_hours' => (int) ($settings['payment_deadline_hours'] ?? 24),
            ],
            'midtransConfigured' => $midtransConfigured,
            'whatsappNumber' => $settings['contact_whatsapp'] ?? null,
        ]);
    }

    /**
     * Update payment settings
     */
    public function updatePayment(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'midtrans_enabled' => ['required', 'boolean'],
            'midtrans_environment' => ['required', 'string', 'in:sandbox,production'],
            'whatsapp_payment_enabled' => ['required', 'boolean'],
            'whatsapp_payment_message' => ['nullable', 'string', 'max:500'],
            'bank_name' => ['nullable', 'string', 'max:100'],
            'bank_account_number' => ['nullable', 'string', 'max:50'],
            'bank_account_name' => ['nullable', 'string', 'max:255'],
            'cod_fee' => ['required', 'integer', 'min:0'],
            'payment_deadline_hours' => ['required', 'integer', 'min:1', 'max:168'],
        ]);

        foreach ($validated as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => is_bool($value) ? ($value ? '1' : '0') : (string) ($value ?? '')]
            );
        }

        // Clear site settings cache
        Cache::forget('site_settings');

        return back()->with('success', __('messages.payment_settings_saved'));
    }
}
