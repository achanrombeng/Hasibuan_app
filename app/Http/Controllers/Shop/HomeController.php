<?php

declare(strict_types=1);

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductResource;
use App\Models\Article;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductReview;
use App\Models\Setting;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        // Latest Products (4 newest items)
        $featuredProducts = Product::active()
            ->with(['category', 'images', 'linkedProducts.images'])
            ->latest()
            ->limit(4)
            ->get();

        // Active Root Categories (for storefront display)
        $allActiveCategories = Category::where('is_active', true)
            ->whereNull('parent_id')
            ->withProductsCount()
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        // Featured Categories (for navbar/hero display if featured, otherwise fallback)
        $featuredCategories = Category::where('is_active', true)
            ->where('is_featured', true)
            ->whereNull('parent_id')
            ->withProductsCount()
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        $displayCategories = $featuredCategories->isNotEmpty() ? $featuredCategories : $allActiveCategories;

        // Testimonials (approved reviews with high rating)
        $testimonials = ProductReview::where('is_approved', true)
            ->where('rating', '>=', 4)
            ->whereNotNull('comment')
            ->with('user')
            ->latest()
            ->limit(3)
            ->get()
            ->map(fn (ProductReview $review) => [
                'id' => $review->id,
                'text' => $review->comment,
                'rating' => $review->rating,
                'author' => $review->user?->name ?? 'Pelanggan',
                'location' => $review->user?->city ?? 'Indonesia',
            ]);

        // Recent Published Articles (3 items)
        $recentArticles = Article::published()
            ->latest('published_at')
            ->limit(3)
            ->get();

        // Hero Settings (with locale support)
        $locale = app()->getLocale();
        $heroSettings = [
            'badge' => Setting::get("hero_badge_{$locale}", Setting::get('hero_badge', 'RH OUTDOOR 2026')),
            'title' => Setting::get("hero_title_{$locale}", Setting::get('hero_title', 'THE ARCHITECTURAL TEAK & ROPE')),
            'title_highlight' => Setting::get("hero_title_highlight_{$locale}", Setting::get('hero_title_highlight', 'COLLECTION')),
            'description' => Setting::get("hero_description_{$locale}", Setting::get('hero_description', 'Vitruvian Balance, Enduring Proportion & Master Craftsmanship from Jepara')),
            'image_main' => Setting::get('hero_image_main', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2400&auto=format&fit=crop'),
            'image_secondary' => Setting::get('hero_image_secondary', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2400&auto=format&fit=crop'),
            'product_name' => Setting::get("hero_product_name_{$locale}", Setting::get('hero_product_name', 'Architectural Teak Lounge')),
            'media_type' => Setting::get('hero_media_type', 'image'),
        ];

        // Trust/Press Logos
        $trustLogos = json_decode(Setting::get('trust_logos', json_encode([
            ['name' => 'ARCHITECTURAL DIGEST', 'logo_url' => ''],
            ['name' => 'ELLE DECOR', 'logo_url' => ''],
            ['name' => 'WALLPAPER*', 'logo_url' => ''],
            ['name' => 'DEZEEN', 'logo_url' => ''],
            ['name' => 'VOGUE LIVING', 'logo_url' => ''],
            ['name' => 'THE LOCAL PROJECT', 'logo_url' => ''],
        ])), true);

        // Values/Features (with locale support)
        $defaultValues = [
            ['icon' => 'leaf', 'title' => 'SOLID INDONESIAN TEAK', 'desc' => 'Sustainably harvested Blora teak, aged and kiln-dried with exceptional natural oil content for enduring structural resilience.'],
            ['icon' => 'sparkles', 'title' => 'ALL-WEATHER ARTISANAL WEAVE', 'desc' => 'Hand-woven by generational masters of Cirebon using high-density synthetic fibers engineered to resist UV, moisture, and sea salt.'],
            ['icon' => 'shield-check', 'title' => 'ARCHITECTURAL SCALE & PROPORTION', 'desc' => 'Engineered for monumental spaces with classical Vitruvian balance, seamless joins, and export-grade structural warranties.'],
        ];
        $values = json_decode(Setting::get("home_values_{$locale}", Setting::get('home_values', json_encode($defaultValues))), true);

        // Carousel Banners
        $carouselBanners = json_decode(Setting::get('carousel_banners', json_encode([
            [
                'id' => 'outdoor-architectural',
                'image_url' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2400&auto=format&fit=crop',
                'media_type' => 'image',
                'link' => '/shop/products?filter[category]=collections',
                'sort_order' => 1,
            ],
            [
                'id' => 'contemporary-living',
                'image_url' => 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2400&auto=format&fit=crop',
                'media_type' => 'image',
                'link' => '/shop/products?filter[category]=chairs',
                'sort_order' => 2,
            ],
            [
                'id' => 'sculptural-dining',
                'image_url' => 'https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=2400&auto=format&fit=crop',
                'media_type' => 'image',
                'link' => '/shop/products?filter[category]=dining-sets',
                'sort_order' => 3,
            ],
            [
                'id' => 'resort-poolside',
                'image_url' => 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2400&auto=format&fit=crop',
                'media_type' => 'image',
                'link' => '/shop/products?filter[category]=sun-loungers',
                'sort_order' => 4,
            ],
        ])), true) ?? [];
        usort($carouselBanners, fn ($a, $b) => ($a['sort_order'] ?? 0) - ($b['sort_order'] ?? 0));

        // Craftsmanship Settings (with locale support)
        $craftsmanshipSettings = [
            'title_1' => Setting::get("craftsmanship_title_1_{$locale}", Setting::get('craftsmanship_title_1', 'HANDCRAFTED ALL-WEATHER WEAVING')),
            'desc_1' => Setting::get("craftsmanship_desc_1_{$locale}", Setting::get('craftsmanship_desc_1', 'Traditional hand-weaving techniques passed through generations of master artisans form the soul of our furniture. Woven over rust-proof aluminum frameworks, each strand is engineered to withstand tropical rain, UV exposure, and coastal breezes while offering enduring tactile warmth.')),
            'images_1' => json_decode(Setting::get('craftsmanship_images_1', json_encode([
                'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1600&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop',
            ])), true) ?? [],
            'title_2' => Setting::get("craftsmanship_title_2_{$locale}", Setting::get('craftsmanship_title_2', 'GRADE-A CERTIFIED SUSTAINABLE TEAK')),
            'desc_2' => Setting::get("craftsmanship_desc_2_{$locale}", Setting::get('craftsmanship_desc_2', "Sourced exclusively from responsibly managed Indonesian plantations, our premium teak wood is rich in natural protective oils. It offers supreme structural density and resilience against weather elements, gracefully aging into an iconic silvery-grey patina over decades.")),
            'images_2' => json_decode(Setting::get('craftsmanship_images_2', json_encode([
                'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1600&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop',
            ])), true) ?? [],
        ];

        // Page-specific Site Settings for SEO (siteSettings is shared via middleware)
        $pageSiteSettings = [
            'name' => Setting::get('site_name', config('app.name', 'Hasibuan Design')),
            'description' => Setting::get('site_description', 'Toko furnitur premium Indonesia'),
        ];

        // Section Visibility (Synced with Admin Homepage Settings defaults)
        $sectionVisibility = [
            'carousel_banners' => filter_var(Setting::get('section_carousel_banners_visible', '1'), FILTER_VALIDATE_BOOLEAN),
            'hero' => filter_var(Setting::get('section_hero_visible', '1'), FILTER_VALIDATE_BOOLEAN),
            'trust' => filter_var(Setting::get('section_trust_visible', '1'), FILTER_VALIDATE_BOOLEAN),
            'categories' => filter_var(Setting::get('section_categories_visible', '1'), FILTER_VALIDATE_BOOLEAN),
            'craftsmanship' => filter_var(Setting::get('section_craftsmanship_visible', '1'), FILTER_VALIDATE_BOOLEAN),
            'catalog' => filter_var(Setting::get('section_catalog_visible', '1'), FILTER_VALIDATE_BOOLEAN),
            'values' => filter_var(Setting::get('section_values_visible', '1'), FILTER_VALIDATE_BOOLEAN),
            'products' => filter_var(Setting::get('section_products_visible', '1'), FILTER_VALIDATE_BOOLEAN),
            'testimonials' => filter_var(Setting::get('section_testimonials_visible', '1'), FILTER_VALIDATE_BOOLEAN),
            'articles' => filter_var(Setting::get('section_articles_visible', '1'), FILTER_VALIDATE_BOOLEAN),
            'newsletter' => filter_var(Setting::get('section_newsletter_visible', '1'), FILTER_VALIDATE_BOOLEAN),
        ];

        $valuesSettings = [
            'badge' => Setting::get("values_badge_{$locale}", Setting::get('values_badge', 'OUR PHILOSOPHY')),
            'title' => Setting::get("values_title_{$locale}", Setting::get('values_title', 'VITRUVIAN VALUES & COMMITMENTS')),
            'values' => $values ?? [],
        ];

        // Section Backgrounds
        $sectionBackgrounds = json_decode(Setting::get('section_backgrounds', '{}'), true) ?: [];

        return Inertia::render('Shop/Home', [
            'featuredProducts' => ProductResource::collection($featuredProducts),
            'landingCategories' => CategoryResource::collection($displayCategories),
            'categories' => CategoryResource::collection($allActiveCategories),
            'articles' => ArticleResource::collection($recentArticles),
            'testimonials' => $testimonials,
            'heroSettings' => $heroSettings,
            'craftsmanshipSettings' => $craftsmanshipSettings,
            'carouselBanners' => $carouselBanners,
            'trustLogos' => $trustLogos,
            'values' => $values,
            'valuesSettings' => $valuesSettings,
            'pageSiteSettings' => $pageSiteSettings,
            'sectionVisibility' => $sectionVisibility,
            'sectionBackgrounds' => $sectionBackgrounds,
        ]);
    }
}
