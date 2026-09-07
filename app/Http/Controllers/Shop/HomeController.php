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
            ->withCount('products')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        // Featured Categories (for navbar/hero display if featured, otherwise fallback)
        $featuredCategories = Category::where('is_active', true)
            ->where('is_featured', true)
            ->whereNull('parent_id')
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
            'badge' => Setting::get("hero_badge_{$locale}", Setting::get('hero_badge', $locale === 'en' ? 'Latest Collection 2025' : 'Koleksi Terbaru 2025')),
            'title' => Setting::get("hero_title_{$locale}", Setting::get('hero_title', $locale === 'en' ? 'Design that' : 'Desain yang')),
            'title_highlight' => Setting::get("hero_title_highlight_{$locale}", Setting::get('hero_title_highlight', $locale === 'en' ? 'breathes.' : 'bernafas.')),
            'description' => Setting::get("hero_description_{$locale}", Setting::get('hero_description', $locale === 'en' ? 'Minimalist furniture from sustainable materials. Made for those who find luxury in simplicity.' : 'Furniture minimalis dari bahan berkelanjutan. Dibuat untuk mereka yang menemukan kemewahan dalam kesederhanaan.')),
            'image_main' => Setting::get('hero_image_main', '/images/placeholder-hero.svg'),
            'image_secondary' => Setting::get('hero_image_secondary', '/images/placeholder-hero.svg'),
            'product_name' => Setting::get("hero_product_name_{$locale}", Setting::get('hero_product_name', $locale === 'en' ? 'Premium Lounge Chair' : 'Kursi Santai Premium')),
            'media_type' => Setting::get('hero_media_type', 'image'),
        ];

        // Trust/Press Logos
        $trustLogos = json_decode(Setting::get('trust_logos', '["Kompas", "Tempo", "Forbes Indonesia", "Bisnis Indonesia", "The Jakarta Post"]'), true);

        // Values/Features (with locale support)
        $defaultValues = $locale === 'en' ? [
            ['icon' => 'leaf', 'title' => 'Sustainable Materials', 'desc' => 'Every product uses wood from responsibly managed forests and recycled materials.'],
            ['icon' => 'truck', 'title' => 'Free Shipping', 'desc' => 'Free shipping for purchases over Rp 5 million throughout Indonesia.'],
            ['icon' => 'shield-check', 'title' => 'Lifetime Warranty', 'desc' => 'Lifetime warranty for all structural damage because we believe in our quality.'],
        ] : [
            ['icon' => 'leaf', 'title' => 'Bahan Berkelanjutan', 'desc' => 'Setiap produk menggunakan kayu dari hutan yang dikelola secara bertanggung jawab dan bahan daur ulang.'],
            ['icon' => 'truck', 'title' => 'Gratis Pengiriman', 'desc' => 'Pengiriman gratis untuk pembelian di atas Rp 5 juta ke seluruh Indonesia.'],
            ['icon' => 'shield-check', 'title' => 'Garansi Selamanya', 'desc' => 'Garansi seumur hidup untuk semua kerusakan struktural karena kami percaya dengan kualitas kami.'],
        ];
        $values = json_decode(Setting::get("home_values_{$locale}", Setting::get('home_values', json_encode($defaultValues))), true);

        // Carousel Banners
        $carouselBanners = json_decode(Setting::get('carousel_banners', '[]'), true) ?? [];
        usort($carouselBanners, fn ($a, $b) => ($a['sort_order'] ?? 0) - ($b['sort_order'] ?? 0));

        // Craftsmanship Settings (with locale support)
        $craftsmanshipSettings = [
            'title_1' => Setting::get("craftsmanship_title_1_{$locale}", Setting::get('craftsmanship_title_1', 'Handcrafted, Unique Touch')),
            'desc_1' => Setting::get("craftsmanship_desc_1_{$locale}", Setting::get('craftsmanship_desc_1', 'Hand-woven traditional rattan forms the soul of Ronica furniture, reflecting craftsmanship passed down through generations of master artisans. This finely woven natural material not only adds aesthetic elegance but also gives our furniture a breathing, durable structure and timeless character.')),
            'images_1' => json_decode(Setting::get('craftsmanship_images_1', json_encode([
                'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop',
            ])), true) ?? [],
            'title_2' => Setting::get("craftsmanship_title_2_{$locale}", Setting::get('craftsmanship_title_2', 'Strength of Nature, Timeless Elegance')),
            'desc_2' => Setting::get("craftsmanship_desc_2_{$locale}", Setting::get('craftsmanship_desc_2', 'The premium teak wood used in our furniture is one of nature\'s most durable and cherished materials. Rich in natural protective oils, it offers superior resistance against moisture, intense sunlight, and outdoor weather elements. As years pass, its texture and warm tone grow even more beautiful.')),
            'images_2' => json_decode(Setting::get('craftsmanship_images_2', json_encode([
                'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop',
            ])), true) ?? [],
        ];

        // Page-specific Site Settings for SEO (siteSettings is shared via middleware)
        $pageSiteSettings = [
            'name' => Setting::get('site_name', 'Ronica'),
            'description' => Setting::get('site_description', 'Toko furnitur premium Indonesia'),
        ];

        // Section Visibility
        $sectionVisibility = [
            'carousel_banners' => filter_var(Setting::get('section_carousel_banners_visible', '1'), FILTER_VALIDATE_BOOLEAN),
            'hero' => filter_var(Setting::get('section_hero_visible', '0'), FILTER_VALIDATE_BOOLEAN),
            'trust' => filter_var(Setting::get('section_trust_visible', '0'), FILTER_VALIDATE_BOOLEAN),
            'categories' => filter_var(Setting::get('section_categories_visible', '1'), FILTER_VALIDATE_BOOLEAN),
            'craftsmanship' => filter_var(Setting::get('section_craftsmanship_visible', '1'), FILTER_VALIDATE_BOOLEAN),
            'catalog' => filter_var(Setting::get('section_catalog_visible', '1'), FILTER_VALIDATE_BOOLEAN),
            'values' => filter_var(Setting::get('section_values_visible', '1'), FILTER_VALIDATE_BOOLEAN),
            'products' => filter_var(Setting::get('section_products_visible', '0'), FILTER_VALIDATE_BOOLEAN),
            'testimonials' => filter_var(Setting::get('section_testimonials_visible', '1'), FILTER_VALIDATE_BOOLEAN),
            'articles' => filter_var(Setting::get('section_articles_visible', '1'), FILTER_VALIDATE_BOOLEAN),
            'newsletter' => filter_var(Setting::get('section_newsletter_visible', '1'), FILTER_VALIDATE_BOOLEAN),
        ];

        $valuesSettings = [
            'badge' => Setting::get("values_badge_{$locale}", Setting::get('values_badge', $locale === 'en' ? 'WHY CHOOSE US' : 'MENGAPA MEMILIH KAMI')),
            'title' => Setting::get("values_title_{$locale}", Setting::get('values_title', $locale === 'en' ? 'Our Philosophy' : 'Filosofi Kami')),
            'values' => $values ?? [],
        ];

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
        ]);
    }
}
