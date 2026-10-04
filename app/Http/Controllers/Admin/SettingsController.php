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
                'site_name' => $settings['site_name'] ?? config('app.name', 'hasibuan_app'),
                'site_logo' => $settings['site_logo'] ?? '/ronica.png',
                'site_description' => $settings['site_description'] ?? '',
                'contact_email' => $settings['contact_email'] ?? '',
                'contact_email_2' => $settings['contact_email_2'] ?? '',
                'contact_phone' => $settings['contact_phone'] ?? '',
                'contact_whatsapp' => $settings['contact_whatsapp'] ?? '',
                'marketing_1_name' => $settings['marketing_1_name'] ?? ($settings['admin_1_name'] ?? ''),
                'marketing_1_email' => $settings['marketing_1_email'] ?? ($settings['admin_1_email'] ?? ($settings['contact_email'] ?? '')),
                'marketing_1_phone' => $settings['marketing_1_phone'] ?? ($settings['admin_1_phone'] ?? ($settings['contact_whatsapp'] ?? ($settings['contact_phone'] ?? ''))),
                'marketing_2_name' => $settings['marketing_2_name'] ?? ($settings['admin_2_name'] ?? ''),
                'marketing_2_email' => $settings['marketing_2_email'] ?? ($settings['admin_2_email'] ?? ($settings['contact_email_2'] ?? '')),
                'marketing_2_phone' => $settings['marketing_2_phone'] ?? ($settings['admin_2_phone'] ?? ''),
                'admin_1_name' => $settings['marketing_1_name'] ?? ($settings['admin_1_name'] ?? ''),
                'admin_1_email' => $settings['marketing_1_email'] ?? ($settings['admin_1_email'] ?? ($settings['contact_email'] ?? '')),
                'admin_1_phone' => $settings['marketing_1_phone'] ?? ($settings['admin_1_phone'] ?? ($settings['contact_whatsapp'] ?? ($settings['contact_phone'] ?? ''))),
                'admin_2_name' => $settings['marketing_2_name'] ?? ($settings['admin_2_name'] ?? ''),
                'admin_2_email' => $settings['marketing_2_email'] ?? ($settings['admin_2_email'] ?? ($settings['contact_email_2'] ?? '')),
                'admin_2_phone' => $settings['marketing_2_phone'] ?? ($settings['admin_2_phone'] ?? ''),
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
                'linkedin_url' => $settings['linkedin_url'] ?? '',
                'social_links' => $settings['social_links'] ?? '',
                'catalog_pdf_url' => array_key_exists('catalog_pdf_url', $settings) ? ($settings['catalog_pdf_url'] ?? '') : '/catalogs/ronica-catalog-2026.pdf',
                'catalog_docx_url' => array_key_exists('catalog_docx_url', $settings) ? ($settings['catalog_docx_url'] ?? '') : '/catalogs/ronica-catalog-2026.docx',
                'catalog_title' => $settings['catalog_title'] ?? 'Ronica Product Catalogue 2026',
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
            'contact_email_2' => ['nullable', 'email', 'max:255'],
            'contact_phone' => ['nullable', 'string', 'max:50'],
            'contact_whatsapp' => ['nullable', 'string', 'max:50'],
            'marketing_1_name' => ['nullable', 'string', 'max:255'],
            'marketing_1_email' => ['nullable', 'email', 'max:255'],
            'marketing_1_phone' => ['nullable', 'string', 'max:50'],
            'marketing_2_name' => ['nullable', 'string', 'max:255'],
            'marketing_2_email' => ['nullable', 'email', 'max:255'],
            'marketing_2_phone' => ['nullable', 'string', 'max:50'],
            'admin_1_name' => ['nullable', 'string', 'max:255'],
            'admin_1_email' => ['nullable', 'email', 'max:255'],
            'admin_1_phone' => ['nullable', 'string', 'max:50'],
            'admin_2_name' => ['nullable', 'string', 'max:255'],
            'admin_2_email' => ['nullable', 'email', 'max:255'],
            'admin_2_phone' => ['nullable', 'string', 'max:50'],
            'factory_name' => ['nullable', 'string', 'max:255'],
            'factory_address' => ['nullable', 'string', 'max:500'],
            'showroom_name' => ['nullable', 'string', 'max:255'],
            'showroom_address' => ['nullable', 'string', 'max:500'],
            'maps_showroom_url' => ['nullable', 'string', 'max:2000'],
            'maps_factory_url' => ['nullable', 'string', 'max:2000'],
            'address' => ['nullable', 'string', 'max:500'],
            'facebook_url' => ['nullable', 'string', 'max:500'],
            'instagram_url' => ['nullable', 'string', 'max:500'],
            'tiktok_url' => ['nullable', 'string', 'max:500'],
            'linkedin_url' => ['nullable', 'string', 'max:500'],
            'social_links' => ['nullable', 'string'],
            'catalog_title' => ['nullable', 'string', 'max:255'],
            'catalog_pdf_url' => ['nullable', 'string', 'max:500'],
            'catalog_docx_url' => ['nullable', 'string', 'max:500'],
            'catalog_file' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:51200'],
            'catalog_pdf_file' => ['nullable', 'file', 'mimes:pdf', 'max:51200'],
            'catalog_docx_file' => ['nullable', 'file', 'mimes:doc,docx', 'max:51200'],
            'delete_catalog_pdf' => ['nullable', 'boolean'],
            'delete_catalog_docx' => ['nullable', 'boolean'],
        ]);

        if ($request->has('social_links')) {
            $rawLinks = $request->input('social_links');
            $decoded = json_decode((string) $rawLinks, true);
            if (is_array($decoded)) {
                $cleaned = array_values(array_filter($decoded, function ($item) {
                    return !empty(trim($item['url'] ?? ''));
                }));
                $validated['social_links'] = json_encode($cleaned);

                // Auto-sync legacy fields for backward compatibility
                $fb = '';
                $ig = '';
                $tt = '';
                $yt = '';
                $li = '';
                foreach ($cleaned as $item) {
                    $platform = strtolower($item['platform'] ?? '');
                    $url = trim($item['url'] ?? '');
                    if ($platform === 'facebook' && empty($fb)) $fb = $url;
                    if ($platform === 'instagram' && empty($ig)) $ig = $url;
                    if ($platform === 'tiktok' && empty($tt)) $tt = $url;
                    if ($platform === 'youtube' && empty($yt)) $yt = $url;
                    if ($platform === 'linkedin' && empty($li)) $li = $url;
                }
                $validated['facebook_url'] = $fb;
                $validated['instagram_url'] = $ig;
                $validated['tiktok_url'] = $tt;
                $validated['linkedin_url'] = $li;
                if (!empty($yt)) {
                    $validated['youtube_url'] = $yt;
                }
            }
        }

        if ($request->hasFile('site_logo_file')) {
            $file = $request->file('site_logo_file');
            $path = $file->store('settings/logo', 'public');
            $validated['site_logo'] = '/storage/'.$path;
        }
        unset($validated['site_logo_file']);

        if ($request->hasFile('catalog_file')) {
            $file = $request->file('catalog_file');
            $ext = strtolower($file->getClientOriginalExtension());
            $path = $file->store('catalogs', 'public');
            if ($ext === 'pdf') {
                $validated['catalog_pdf_url'] = '/storage/'.$path;
            } else {
                $validated['catalog_docx_url'] = '/storage/'.$path;
            }
        }
        unset($validated['catalog_file']);

        if ($request->boolean('delete_catalog_pdf')) {
            $validated['catalog_pdf_url'] = '';
        }
        unset($validated['delete_catalog_pdf']);

        if ($request->hasFile('catalog_pdf_file')) {
            $file = $request->file('catalog_pdf_file');
            $path = $file->store('catalogs', 'public');
            $validated['catalog_pdf_url'] = '/storage/'.$path;
        }
        unset($validated['catalog_pdf_file']);

        if ($request->boolean('delete_catalog_docx')) {
            $validated['catalog_docx_url'] = '';
        }
        unset($validated['delete_catalog_docx']);

        if ($request->hasFile('catalog_docx_file')) {
            $file = $request->file('catalog_docx_file');
            $path = $file->store('catalogs', 'public');
            $validated['catalog_docx_url'] = '/storage/'.$path;
        }
        unset($validated['catalog_docx_file']);

        // Handle marketing_1 & admin_1 sync
        $m1Name = $validated['marketing_1_name'] ?? ($validated['admin_1_name'] ?? null);
        $m1Email = $validated['marketing_1_email'] ?? ($validated['admin_1_email'] ?? null);
        $m1Phone = $validated['marketing_1_phone'] ?? ($validated['admin_1_phone'] ?? null);

        if ($m1Name !== null) {
            $validated['marketing_1_name'] = $m1Name;
            $validated['admin_1_name'] = $m1Name;
        }
        if ($m1Email !== null) {
            $validated['marketing_1_email'] = $m1Email;
            $validated['admin_1_email'] = $m1Email;
            if (empty($validated['contact_email'])) {
                $validated['contact_email'] = $m1Email;
            }
        }
        if ($m1Phone !== null) {
            $validated['marketing_1_phone'] = $m1Phone;
            $validated['admin_1_phone'] = $m1Phone;
            if (empty($validated['contact_whatsapp'])) {
                $validated['contact_whatsapp'] = $m1Phone;
            }
            if (empty($validated['contact_phone'])) {
                $validated['contact_phone'] = $m1Phone;
            }
        }

        // Handle marketing_2 & admin_2 sync
        $m2Name = $validated['marketing_2_name'] ?? ($validated['admin_2_name'] ?? null);
        $m2Email = $validated['marketing_2_email'] ?? ($validated['admin_2_email'] ?? null);
        $m2Phone = $validated['marketing_2_phone'] ?? ($validated['admin_2_phone'] ?? null);

        if ($m2Name !== null) {
            $validated['marketing_2_name'] = $m2Name;
            $validated['admin_2_name'] = $m2Name;
        }
        if ($m2Email !== null) {
            $validated['marketing_2_email'] = $m2Email;
            $validated['admin_2_email'] = $m2Email;
            if (empty($validated['contact_email_2'])) {
                $validated['contact_email_2'] = $m2Email;
            }
        }
        if ($m2Phone !== null) {
            $validated['marketing_2_phone'] = $m2Phone;
            $validated['admin_2_phone'] = $m2Phone;
        }

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
     * Delete uploaded catalog file immediately
     */
    public function deleteCatalog(Request $request): RedirectResponse
    {
        $request->validate([
            'type' => ['required', 'string', 'in:pdf,docx,all'],
        ]);

        $type = $request->input('type');

        if ($type === 'pdf' || $type === 'all') {
            $pdfUrl = Setting::where('key', 'catalog_pdf_url')->value('value');
            if ($pdfUrl && str_starts_with($pdfUrl, '/storage/')) {
                $storagePath = str_replace('/storage/', '', $pdfUrl);
                Storage::disk('public')->delete($storagePath);
            }
            Setting::updateOrCreate(['key' => 'catalog_pdf_url'], ['value' => '']);
        }

        if ($type === 'docx' || $type === 'all') {
            $docxUrl = Setting::where('key', 'catalog_docx_url')->value('value');
            if ($docxUrl && str_starts_with($docxUrl, '/storage/')) {
                $storagePath = str_replace('/storage/', '', $docxUrl);
                Storage::disk('public')->delete($storagePath);
            }
            Setting::updateOrCreate(['key' => 'catalog_docx_url'], ['value' => '']);
        }

        // Clear site settings cache
        Cache::forget('site_settings');
        Cache::forget('site_settings.id');
        Cache::forget('site_settings.en');

        return back()->with('success', 'Catalog document removed successfully.');
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
                'values_badge' => $settings["values_badge_{$locale}"] ?? $settings['values_badge'] ?? ($locale === 'en' ? 'WHY CHOOSE US' : 'MENGAPA MEMILIH KAMI'),
                'values_title' => $settings["values_title_{$locale}"] ?? $settings['values_title'] ?? ($locale === 'en' ? 'Our Philosophy' : 'Filosofi Kami'),
                'home_values' => $settings["home_values_{$locale}"] ?? $settings['home_values'] ?? json_encode([
                    ['icon' => 'leaf', 'title' => 'Bahan Berkelanjutan', 'desc' => 'Setiap produk menggunakan kayu dari hutan yang dikelola secara bertanggung jawab dan bahan daur ulang.'],
                    ['icon' => 'truck', 'title' => 'Gratis Pengiriman', 'desc' => 'Pengiriman gratis untuk pembelian di atas Rp 5 juta ke seluruh Indonesia.'],
                    ['icon' => 'shield-check', 'title' => 'Garansi Selamanya', 'desc' => 'Garansi seumur hidup untuk semua kerusakan struktural karena kami percaya dengan kualitas kami.'],
                ]),
                // Carousel Banners (JSON array, not locale-specific)
                'carousel_banners' => $settings['carousel_banners'] ?? json_encode([]),
                // Craftsmanship Section (locale-aware)
                'craftsmanship_title_1' => $settings["craftsmanship_title_1_{$locale}"] ?? $settings['craftsmanship_title_1'] ?? 'Handcrafted, Unique Touch',
                'craftsmanship_desc_1' => $settings["craftsmanship_desc_1_{$locale}"] ?? $settings['craftsmanship_desc_1'] ?? 'Hand-woven traditional rattan forms the soul of Ronica furniture, reflecting craftsmanship passed down through generations of master artisans. This finely woven natural material not only adds aesthetic elegance but also gives our furniture a breathing, durable structure and timeless character.',
                'craftsmanship_images_1' => $settings['craftsmanship_images_1'] ?? json_encode([
                    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1200&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop',
                ]),
                'craftsmanship_title_2' => $settings["craftsmanship_title_2_{$locale}"] ?? $settings['craftsmanship_title_2'] ?? 'Strength of Nature, Timeless Elegance',
                'craftsmanship_desc_2' => $settings["craftsmanship_desc_2_{$locale}"] ?? $settings['craftsmanship_desc_2'] ?? 'The premium teak wood used in our furniture is one of nature\'s most durable and cherished materials. Rich in natural protective oils, it offers superior resistance against moisture, intense sunlight, and outdoor weather elements. As years pass, its texture and warm tone grow even more beautiful.',
                'craftsmanship_images_2' => $settings['craftsmanship_images_2'] ?? json_encode([
                    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop',
                ]),
                // Section visibility (not locale-specific)
                'section_carousel_banners_visible' => filter_var($settings['section_carousel_banners_visible'] ?? true, FILTER_VALIDATE_BOOLEAN),
                'section_hero_visible' => filter_var($settings['section_hero_visible'] ?? true, FILTER_VALIDATE_BOOLEAN),
                'section_trust_visible' => filter_var($settings['section_trust_visible'] ?? true, FILTER_VALIDATE_BOOLEAN),
                'section_categories_visible' => filter_var($settings['section_categories_visible'] ?? true, FILTER_VALIDATE_BOOLEAN),
                'section_craftsmanship_visible' => filter_var($settings['section_craftsmanship_visible'] ?? true, FILTER_VALIDATE_BOOLEAN),
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
            'values_badge' => ['nullable', 'string', 'max:255'],
            'values_title' => ['nullable', 'string', 'max:255'],
            'home_values' => ['nullable', 'string'],
            // Craftsmanship Section
            'craftsmanship_title_1' => ['nullable', 'string', 'max:255'],
            'craftsmanship_desc_1' => ['nullable', 'string', 'max:2000'],
            'craftsmanship_images_1' => ['nullable', 'string'],
            'craftsmanship_images_1_files' => ['nullable', 'array'],
            'craftsmanship_images_1_files.*' => ['nullable', 'file', 'max:10240', 'mimes:jpg,jpeg,png,webp,gif'],
            'craftsmanship_title_2' => ['nullable', 'string', 'max:255'],
            'craftsmanship_desc_2' => ['nullable', 'string', 'max:2000'],
            'craftsmanship_images_2' => ['nullable', 'string'],
            'craftsmanship_images_2_files' => ['nullable', 'array'],
            'craftsmanship_images_2_files.*' => ['nullable', 'file', 'max:10240', 'mimes:jpg,jpeg,png,webp,gif'],
            // Carousel banners
            'carousel_banners' => ['nullable', 'string'],
            'carousel_banner_files' => ['nullable', 'array'],
            'carousel_banner_files.*' => ['nullable', 'file', 'max:51200', 'mimes:jpg,jpeg,png,webp,gif,mp4,webm,ogg'],
            // Section visibility
            'section_carousel_banners_visible' => ['required', 'boolean'],
            'section_hero_visible' => ['required', 'boolean'],
            'section_trust_visible' => ['required', 'boolean'],
            'section_categories_visible' => ['required', 'boolean'],
            'section_craftsmanship_visible' => ['required', 'boolean'],
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

        // Handle craftsmanship images file uploads
        if (isset($validated['craftsmanship_images_1'])) {
            $images1 = json_decode($validated['craftsmanship_images_1'], true) ?? [];
            $files1 = $request->file('craftsmanship_images_1_files', []);

            foreach ($files1 as $index => $file) {
                if ($file && isset($images1[$index])) {
                    $path = $file->store('settings/craftsmanship', 'public');
                    $images1[$index] = '/storage/'.$path;
                }
            }
            $validated['craftsmanship_images_1'] = json_encode(array_values($images1));
        }
        unset($validated['craftsmanship_images_1_files']);

        if (isset($validated['craftsmanship_images_2'])) {
            $images2 = json_decode($validated['craftsmanship_images_2'], true) ?? [];
            $files2 = $request->file('craftsmanship_images_2_files', []);

            foreach ($files2 as $index => $file) {
                if ($file && isset($images2[$index])) {
                    $path = $file->store('settings/craftsmanship', 'public');
                    $images2[$index] = '/storage/'.$path;
                }
            }
            $validated['craftsmanship_images_2'] = json_encode(array_values($images2));
        }
        unset($validated['craftsmanship_images_2_files']);

        // Handle carousel banner file uploads
        if (isset($validated['carousel_banners'])) {
            $banners = json_decode($validated['carousel_banners'], true) ?? [];
            $bannerFiles = $request->file('carousel_banner_files', []);

            foreach ($bannerFiles as $index => $file) {
                if ($file && isset($banners[$index])) {
                    $path = $file->store('settings/carousel', 'public');
                    $banners[$index]['image_url'] = '/storage/'.$path;
                    $mime = $file->getMimeType();
                    $banners[$index]['media_type'] = str_starts_with($mime, 'video/') ? 'video' : 'image';
                }
            }

            // Ensure media_type is set for URL banners as well
            foreach ($banners as &$banner) {
                if (empty($banner['media_type'])) {
                    $url = $banner['image_url'] ?? '';
                    $ext = strtolower(pathinfo(parse_url($url, PHP_URL_PATH) ?? '', PATHINFO_EXTENSION));
                    $banner['media_type'] = in_array($ext, ['mp4', 'webm', 'ogg']) ? 'video' : 'image';
                }
            }
            unset($banner);

            // Cleanup orphaned carousel images
            $this->cleanupCarouselImages($banners);

            $validated['carousel_banners'] = json_encode($banners);
        }
        unset($validated['carousel_banner_files']);

        // Keys that need locale-specific storage
        $localeKeys = [
            'hero_badge', 'hero_title', 'hero_title_highlight',
            'hero_description', 'hero_product_name', 'home_values',
            'values_badge', 'values_title',
            'craftsmanship_title_1', 'craftsmanship_desc_1',
            'craftsmanship_title_2', 'craftsmanship_desc_2',
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

    /**
     * About Us settings page
     */
    public function about(): Response
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();

        $storyContent = $settings['about_story_content'] ?? null;
        if (empty($storyContent)) {
            $paragraphs = array_filter([
                $settings['about_story_p1'] ?? null,
                $settings['about_story_p2'] ?? null,
                $settings['about_story_p3'] ?? null,
                $settings['about_story_p4'] ?? null,
                $settings['about_story_p5'] ?? null,
            ]);
            if (!empty($paragraphs)) {
                $storyContent = implode("\n\n", $paragraphs);
            } else {
                $storyContent = "Founded in 2016, in Cirebon, Indonesia, Ronica is the representative of elegance produced by hand in outdoor furniture. The brand, which has specialized in the production of high-quality rattan, rope and aluminum furniture since the day it was founded, moved to its new state-of-the-art factory in 2021 and expanded its production range to include A-class teak wood. Teak is sourced from the most exclusive teak region of Indonesia, Perhutani Blora, and achieves a unique quality by processing and baking in Ronica's own facilities.\n\nBringing together the tradition of Cirebon's hand knitting and Jepara's deep-rooted woodwork, Ronica brings two great craft cultures together under one roof. This combination reveals durable and aesthetic products that carry the trace of craftsmanship in each furniture. Each detail is the result of a design understanding that is shaped in the hands of the masters.\n\nOnly high-end materials suitable for outdoor conditions are used in Ronica. Perhutani-sourced teak wood, Rehau and Viro synthetic rattan, Sunproof, Ateja, Sunbrella and Agora fabrics; as well as QuickDry technology sponges are carefully selected for longevity and comfort. All materials are UV treated, proven with laboratory tests and supported by a three-year warranty from suppliers.\n\nToday, Ronica exports to more than 15 countries, including the USA, Europe, the Middle East and Australia. While offering fast delivery to its customers thanks to its Mersin warehouse in Turkey, it has become a reliable solution partner in the international arena with private hotel and housing projects in Maldives, Qatar, Australia and the USA.\n\nAs a family business, Ronica is always passionate about quality, sustainability and customer satisfaction. Each collection is prepared with nature-respecting materials and innovative designs. Ronica brings not only comfort but also a lasting elegance to the outdoor life.";
            }
        }

        $storyImages = json_decode($settings['about_story_images'] ?? '[]', true);
        if (empty($storyImages) || !is_array($storyImages)) {
            $storyImages = array_values(array_filter([
                $settings['about_story_image_1'] ?? ($settings['about_story_image'] ?? '/images/about/about-banner-01.webp'),
                $settings['about_story_image_2'] ?? '/images/about/about-banner-02.webp',
                $settings['about_story_image_3'] ?? '/images/about/about-banner-03.webp',
            ]));
        }

        return Inertia::render('Admin/Settings/About', [
            'settings' => [
                'about_story_title' => $settings['about_story_title'] ?? 'Extending From Indonesia To The World',
                'about_story_subtitle' => $settings['about_story_subtitle'] ?? 'Handicraft Story',
                'about_story_content' => $storyContent,
                'about_story_images' => $storyImages,
            ],
        ]);
    }

    /**
     * Update About Us settings
     */
    public function updateAbout(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'about_story_title' => ['nullable', 'string', 'max:255'],
            'about_story_subtitle' => ['nullable', 'string', 'max:255'],
            'about_story_content' => ['nullable', 'string', 'max:20000'],
            'existing_images' => ['nullable', 'array'],
            'existing_images.*' => ['string'],
            'new_images' => ['nullable', 'array'],
            'new_images.*' => ['file', 'max:10240', 'mimes:jpg,jpeg,png,webp,svg,gif'],
        ]);

        $images = $request->input('existing_images', []);
        if ($request->hasFile('new_images')) {
            foreach ($request->file('new_images') as $file) {
                $path = $file->store('settings/about', 'public');
                $images[] = '/storage/'.$path;
            }
        }

        Setting::updateOrCreate(
            ['key' => 'about_story_images'],
            ['value' => json_encode(array_values($images))]
        );

        // Also save individual image keys for backwards compatibility
        Setting::updateOrCreate(['key' => 'about_story_image_1'], ['value' => $images[0] ?? '']);
        Setting::updateOrCreate(['key' => 'about_story_image_2'], ['value' => $images[1] ?? '']);
        Setting::updateOrCreate(['key' => 'about_story_image_3'], ['value' => $images[2] ?? '']);

        if ($request->has('about_story_title')) {
            Setting::updateOrCreate(['key' => 'about_story_title'], ['value' => $request->input('about_story_title') ?? '']);
        }
        if ($request->has('about_story_subtitle')) {
            Setting::updateOrCreate(['key' => 'about_story_subtitle'], ['value' => $request->input('about_story_subtitle') ?? '']);
        }
        if ($request->has('about_story_content')) {
            Setting::updateOrCreate(['key' => 'about_story_content'], ['value' => $request->input('about_story_content') ?? '']);
        }

        // Clear site settings cache
        Cache::forget('site_settings');

        return back()->with('success', 'About Us page settings saved successfully');
    }

    /**
     * Footer settings page
     */
    public function footer(): Response
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();

        $defaultCol1Links = json_encode([
            ['label' => 'Semua Produk', 'url' => '/shop/products'],
            ['label' => 'Hot Sale', 'url' => '/shop/products/hot-sale'],
            ['label' => 'Produk Terbaru', 'url' => '/shop/products?sort=newest'],
        ]);

        $defaultCol2Links = json_encode([
            ['label' => 'Tentang Kami', 'url' => '/shop/about'],
            ['label' => 'Kontak', 'url' => '/shop/contact'],
            ['label' => 'FAQ', 'url' => '/shop/faq'],
        ]);

        return Inertia::render('Admin/Settings/Footer', [
            'settings' => [
                'footer_description' => $settings['footer_description'] ?? '',
                'footer_copyright' => $settings['footer_copyright'] ?? '',
                'footer_col1_title' => $settings['footer_col1_title'] ?? 'Belanja',
                'footer_col1_links' => $settings['footer_col1_links'] ?? $defaultCol1Links,
                'footer_col2_title' => $settings['footer_col2_title'] ?? 'Perusahaan',
                'footer_col2_links' => $settings['footer_col2_links'] ?? $defaultCol2Links,
                'footer_contact_title' => $settings['footer_contact_title'] ?? 'Informasi Kontak',
                'footer_show_factory' => array_key_exists('footer_show_factory', $settings) ? filter_var($settings['footer_show_factory'], FILTER_VALIDATE_BOOLEAN) : true,
                'footer_show_showroom' => array_key_exists('footer_show_showroom', $settings) ? filter_var($settings['footer_show_showroom'], FILTER_VALIDATE_BOOLEAN) : true,
                'footer_show_phone' => array_key_exists('footer_show_phone', $settings) ? filter_var($settings['footer_show_phone'], FILTER_VALIDATE_BOOLEAN) : true,
                'footer_show_whatsapp' => array_key_exists('footer_show_whatsapp', $settings) ? filter_var($settings['footer_show_whatsapp'], FILTER_VALIDATE_BOOLEAN) : true,
                'footer_show_email' => array_key_exists('footer_show_email', $settings) ? filter_var($settings['footer_show_email'], FILTER_VALIDATE_BOOLEAN) : true,
                'footer_show_socials' => array_key_exists('footer_show_socials', $settings) ? filter_var($settings['footer_show_socials'], FILTER_VALIDATE_BOOLEAN) : true,
                'footer_show_privacy' => array_key_exists('footer_show_privacy', $settings) ? filter_var($settings['footer_show_privacy'], FILTER_VALIDATE_BOOLEAN) : true,
                'footer_show_terms' => array_key_exists('footer_show_terms', $settings) ? filter_var($settings['footer_show_terms'], FILTER_VALIDATE_BOOLEAN) : true,
                'youtube_url' => $settings['youtube_url'] ?? '',
                'footer_privacy_url' => $settings['footer_privacy_url'] ?? '/shop/privacy-policy',
                'footer_terms_url' => $settings['footer_terms_url'] ?? '/shop/terms',
                // Inherited site contact info for reference & social media management
                'site_description' => $settings['site_description'] ?? '',
                'contact_email' => $settings['contact_email'] ?? '',
                'contact_phone' => $settings['contact_phone'] ?? '',
                'contact_whatsapp' => $settings['contact_whatsapp'] ?? '',
                'facebook_url' => $settings['facebook_url'] ?? '',
                'instagram_url' => $settings['instagram_url'] ?? '',
                'tiktok_url' => $settings['tiktok_url'] ?? '',
                'linkedin_url' => $settings['linkedin_url'] ?? '',
                'social_links' => $settings['social_links'] ?? '',
            ],
        ]);
    }

    /**
     * Update Footer settings
     */
    public function updateFooter(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'footer_description' => ['nullable', 'string', 'max:1000'],
            'footer_copyright' => ['nullable', 'string', 'max:255'],
            'footer_col1_title' => ['required', 'string', 'max:100'],
            'footer_col1_links' => ['nullable', 'string'],
            'footer_col2_title' => ['required', 'string', 'max:100'],
            'footer_col2_links' => ['nullable', 'string'],
            'footer_contact_title' => ['required', 'string', 'max:100'],
            'footer_show_factory' => ['required', 'boolean'],
            'footer_show_showroom' => ['required', 'boolean'],
            'footer_show_phone' => ['required', 'boolean'],
            'footer_show_whatsapp' => ['required', 'boolean'],
            'footer_show_email' => ['required', 'boolean'],
            'footer_show_socials' => ['required', 'boolean'],
            'footer_show_privacy' => ['required', 'boolean'],
            'footer_show_terms' => ['required', 'boolean'],
            'social_links' => ['nullable', 'string'],
            'facebook_url' => ['nullable', 'string', 'max:255'],
            'instagram_url' => ['nullable', 'string', 'max:255'],
            'tiktok_url' => ['nullable', 'string', 'max:255'],
            'youtube_url' => ['nullable', 'string', 'max:255'],
            'linkedin_url' => ['nullable', 'string', 'max:255'],
            'footer_privacy_url' => ['nullable', 'string', 'max:255'],
            'footer_terms_url' => ['nullable', 'string', 'max:255'],
        ]);

        if ($request->has('social_links')) {
            $rawLinks = $request->input('social_links');
            $decoded = json_decode((string) $rawLinks, true);
            if (is_array($decoded)) {
                $cleaned = array_values(array_filter($decoded, function ($item) {
                    return !empty(trim($item['url'] ?? ''));
                }));
                $validated['social_links'] = json_encode($cleaned);

                // Auto-sync legacy fields for backward compatibility
                $fb = '';
                $ig = '';
                $tt = '';
                $yt = '';
                $li = '';
                foreach ($cleaned as $item) {
                    $platform = strtolower($item['platform'] ?? '');
                    $url = trim($item['url'] ?? '');
                    if ($platform === 'facebook' && empty($fb)) $fb = $url;
                    if ($platform === 'instagram' && empty($ig)) $ig = $url;
                    if ($platform === 'tiktok' && empty($tt)) $tt = $url;
                    if ($platform === 'youtube' && empty($yt)) $yt = $url;
                    if ($platform === 'linkedin' && empty($li)) $li = $url;
                }
                $validated['facebook_url'] = $fb;
                $validated['instagram_url'] = $ig;
                $validated['tiktok_url'] = $tt;
                $validated['linkedin_url'] = $li;
                $validated['youtube_url'] = $yt;
            }
        }

        foreach ($validated as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => is_bool($value) ? ($value ? '1' : '0') : ($value ?? '')]
            );
        }

        // Clear site settings cache
        Cache::forget('site_settings');
        Cache::forget('site_settings.id');
        Cache::forget('site_settings.en');

        return back()->with('success', 'Footer settings saved successfully.');
    }
}
