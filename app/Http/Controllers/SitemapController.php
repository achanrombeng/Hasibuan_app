<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;

class SitemapController extends Controller
{
    /**
     * Generate the main sitemap index.
     */
    public function index(): Response
    {
        $content = Cache::remember('sitemap-index', 3600, function () {
            $sitemaps = [
                url('/sitemap-pages.xml'),
                url('/sitemap-products.xml'),
                url('/sitemap-categories.xml'),
            ];

            $xml = '<?xml version="1.0" encoding="UTF-8"?>';
            $xml .= '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
            
            foreach ($sitemaps as $sitemap) {
                $xml .= '<sitemap>';
                $xml .= '<loc>' . $sitemap . '</loc>';
                $xml .= '<lastmod>' . now()->toW3cString() . '</lastmod>';
                $xml .= '</sitemap>';
            }
            
            $xml .= '</sitemapindex>';
            
            return $xml;
        });

        return response($content, 200)
            ->header('Content-Type', 'application/xml');
    }

    /**
     * Generate sitemap for static pages.
     */
    public function pages(): Response
    {
        $content = Cache::remember('sitemap-pages', 3600, function () {
            $pages = [
                ['url' => '/shop', 'priority' => '1.0', 'changefreq' => 'daily'],
                ['url' => '/shop/products', 'priority' => '0.9', 'changefreq' => 'daily'],
                ['url' => '/shop/categories', 'priority' => '0.8', 'changefreq' => 'weekly'],
                ['url' => '/shop/hot-sale', 'priority' => '0.9', 'changefreq' => 'daily'],
                ['url' => '/shop/clearance', 'priority' => '0.9', 'changefreq' => 'daily'],
                ['url' => '/shop/stock-sale', 'priority' => '0.8', 'changefreq' => 'weekly'],
                ['url' => '/shop/custom-order', 'priority' => '0.7', 'changefreq' => 'monthly'],
                ['url' => '/shop/about', 'priority' => '0.5', 'changefreq' => 'monthly'],
                ['url' => '/shop/contact', 'priority' => '0.5', 'changefreq' => 'monthly'],
            ];

            return $this->generateSitemap($pages);
        });

        return response($content, 200)
            ->header('Content-Type', 'application/xml');
    }

    /**
     * Generate sitemap for products.
     */
    public function products(): Response
    {
        $content = Cache::remember('sitemap-products', 3600, function () {
            $products = Product::where('is_active', true)
                ->select('slug', 'updated_at')
                ->orderBy('updated_at', 'desc')
                ->get();

            $pages = $products->map(fn ($product) => [
                'url' => '/shop/products/' . $product->slug,
                'priority' => '0.8',
                'changefreq' => 'weekly',
                'lastmod' => $product->updated_at->toW3cString(),
            ])->toArray();

            return $this->generateSitemap($pages);
        });

        return response($content, 200)
            ->header('Content-Type', 'application/xml');
    }

    /**
     * Generate sitemap for categories.
     */
    public function categories(): Response
    {
        $content = Cache::remember('sitemap-categories', 3600, function () {
            $categories = Category::where('is_active', true)
                ->select('slug', 'updated_at')
                ->get();

            $pages = $categories->map(fn ($category) => [
                'url' => '/shop/category/' . $category->slug,
                'priority' => '0.7',
                'changefreq' => 'weekly',
                'lastmod' => $category->updated_at->toW3cString(),
            ])->toArray();

            return $this->generateSitemap($pages);
        });

        return response($content, 200)
            ->header('Content-Type', 'application/xml');
    }

    /**
     * Generate XML sitemap from pages array.
     */
    private function generateSitemap(array $pages): string
    {
        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
        
        foreach ($pages as $page) {
            $xml .= '<url>';
            $xml .= '<loc>' . url($page['url']) . '</loc>';
            if (isset($page['lastmod'])) {
                $xml .= '<lastmod>' . $page['lastmod'] . '</lastmod>';
            }
            $xml .= '<changefreq>' . $page['changefreq'] . '</changefreq>';
            $xml .= '<priority>' . $page['priority'] . '</priority>';
            $xml .= '</url>';
        }
        
        $xml .= '</urlset>';
        
        return $xml;
    }
}

