<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Enums\ProductStatus;
use App\Enums\SaleType;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImportRonicaProductsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ronica:import-remote {--limit=20 : Maximum products to import per category} {--category= : Specific category slug to import}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import categories and products directly from ronica.com.tr';

    private string $baseUrl = 'https://www.ronica.com.tr/';

    /**
     * Categories on ronica.com.tr
     */
    private array $categories = [
        'lounge-sets' => 'Lounge Sets',
        'dining-sets' => 'Dining Sets',
        'chairs' => 'Chairs',
        'tables' => 'Tables',
        'corner-sets' => 'Corner Sets',
        'bar-chair-sets' => 'Bar Chair Sets',
        'living-chairs' => 'Living Chairs',
        'daybeds' => 'Daybeds',
    ];

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Starting product import from ronica.com.tr...');
        $limit = (int) $this->option('limit');
        $targetCategory = $this->option('category');

        $categoriesToProcess = $this->categories;
        if ($targetCategory && isset($this->categories[$targetCategory])) {
            $categoriesToProcess = [$targetCategory => $this->categories[$targetCategory]];
        }

        $importedCount = 0;

        foreach ($categoriesToProcess as $catSlug => $catName) {
            $this->info("\nProcessing Category: {$catName} ({$catSlug})...");

            // 1. Create or get Category
            $category = Category::firstOrCreate(
                ['slug' => $catSlug],
                [
                    'name' => $catName,
                    'is_active' => true,
                    'is_featured' => true,
                    'sort_order' => rand(1, 10),
                ]
            );

            // 2. Fetch category page
            $catUrl = $this->baseUrl.$catSlug.'/';
            $response = Http::withHeaders([
                'User-Agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            ])->get($catUrl);

            if (! $response->successful()) {
                $this->warn("Failed to fetch category page: {$catUrl}");

                continue;
            }

            $html = $response->body();
            $productLinks = $this->extractProductLinks($html);

            $this->info('Found '.count($productLinks)." products in {$catName}");

            $countInCat = 0;
            foreach ($productLinks as $productRelUrl) {
                if ($countInCat >= $limit) {
                    break;
                }

                $productUrl = Str::startsWith($productRelUrl, 'http')
                    ? $productRelUrl
                    : $this->baseUrl.ltrim($productRelUrl, '/');

                $importedProduct = $this->importSingleProduct($productUrl, $category);
                if ($importedProduct) {
                    $countInCat++;
                    $importedCount++;
                    $this->info("  [✓] Imported: {$importedProduct->name}");
                }
            }
        }

        $this->info("\nSuccessfully imported total {$importedCount} products!");

        return self::SUCCESS;
    }

    /**
     * Extract product relative URLs from category page HTML.
     */
    private function extractProductLinks(string $html): array
    {
        $links = [];
        preg_match_all('/href=["\'](products\/[^"\']+)["\']/i', $html, $matches);
        if (! empty($matches[1])) {
            foreach ($matches[1] as $href) {
                if (! in_array($href, $links)) {
                    $links[] = $href;
                }
            }
        }

        return $links;
    }

    /**
     * Import a single product from its detail URL.
     */
    private function importSingleProduct(string $url, Category $category): ?Product
    {
        try {
            $response = Http::withHeaders([
                'User-Agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            ])->get($url);

            if (! $response->successful()) {
                return null;
            }

            $html = $response->body();

            // Extract Name from <h1>
            preg_match('/<h1[^>]*>(.*?)<\/h1>/is', $html, $titleMatch);
            if (empty($titleMatch[1])) {
                return null;
            }
            $name = trim(strip_tags($titleMatch[1]));
            $slug = Str::slug($name);

            // Check existing product
            $existing = Product::where('slug', $slug)->first();
            if ($existing) {
                return $existing;
            }

            // Extract Description block from <div class="content1...">
            preg_match('/<div[^>]*class=["\'][^"\']*content1[^"\']*["\'][^>]*>(.*?)<\/div>/is', $html, $contentMatch);
            $descriptionHtml = ! empty($contentMatch[1]) ? trim($contentMatch[1]) : '';
            $descriptionText = strip_tags($descriptionHtml);

            // Short Description from first paragraph
            preg_match('/<p[^>]*>(.*?)<\/p>/is', $descriptionHtml, $pMatch);
            $shortDesc = ! empty($pMatch[1]) ? trim(strip_tags($pMatch[1])) : $name;

            // Generate price
            $estimatedPrice = $this->generateEstimatedPrice($name, $category->slug);

            // Extract Images
            $imageUrls = [];
            preg_match_all('/(yukleme\/products\/[^"\']+\.(webp|jpg|jpeg|png))/i', $html, $imgMatches);
            if (! empty($imgMatches[1])) {
                foreach ($imgMatches[1] as $imgRel) {
                    $fullImgUrl = $this->baseUrl.ltrim($imgRel, '/');
                    if (! in_array($fullImgUrl, $imageUrls)) {
                        $imageUrls[] = $fullImgUrl;
                    }
                }
            }

            $sku = 'RON-'.strtoupper(Str::random(6));

            // Create Product
            $product = Product::create([
                'category_id' => $category->id,
                'sku' => $sku,
                'name' => $name,
                'slug' => $slug,
                'short_description' => $shortDesc,
                'description' => $descriptionHtml ?: $descriptionText,
                'price' => $estimatedPrice,
                'compare_price' => (int) ($estimatedPrice * 1.15),
                'cost_price' => (int) ($estimatedPrice * 0.6),
                'stock_quantity' => rand(5, 25),
                'low_stock_threshold' => 3,
                'track_stock' => true,
                'allow_backorder' => false,
                'status' => ProductStatus::ACTIVE,
                'sale_type' => SaleType::REGULAR,
                'is_featured' => rand(0, 1) === 1,
                'is_new_arrival' => true,
                'material' => 'Teak Wood & Rattan',
                'color' => 'Natural Wood / Charcoal',
            ]);

            // Save Images
            $sortOrder = 0;
            foreach (array_slice($imageUrls, 0, 5) as $imgUrl) {
                $savedPath = $this->downloadAndSaveImage($imgUrl, $slug, $sortOrder);
                if ($savedPath) {
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_path' => $savedPath,
                        'alt_text' => $name,
                        'sort_order' => $sortOrder,
                        'is_primary' => $sortOrder === 0,
                    ]);
                    $sortOrder++;
                }
            }

            return $product;
        } catch (\Throwable $e) {
            $this->error("Error importing {$url}: ".$e->getMessage());

            return null;
        }
    }

    /**
     * Download remote image and store in public storage.
     */
    private function downloadAndSaveImage(string $url, string $slug, int $index): ?string
    {
        try {
            $response = Http::timeout(10)->get($url);
            if (! $response->successful()) {
                return null;
            }

            $extension = pathinfo(parse_url($url, PHP_URL_PATH), PATHINFO_EXTENSION) ?: 'webp';
            $filename = "products/{$slug}-{$index}.{$extension}";

            Storage::disk('public')->put($filename, $response->body());

            return $filename;
        } catch (\Throwable $e) {
            return null;
        }
    }

    /**
     * Generate realistic Rupiah prices.
     */
    private function generateEstimatedPrice(string $name, string $categorySlug): int
    {
        return match ($categorySlug) {
            'lounge-sets', 'corner-sets' => rand(15, 35) * 1000000,
            'dining-sets' => rand(12, 28) * 1000000,
            'daybeds' => rand(10, 22) * 1000000,
            'tables', 'bar-chair-sets' => rand(5, 12) * 1000000,
            'chairs', 'living-chairs' => rand(2, 6) * 1000000,
            default => rand(3, 10) * 1000000,
        };
    }
}
