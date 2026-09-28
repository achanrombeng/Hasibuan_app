<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Enums\ProductStatus;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Services\Ai\GeminiVisionService;
use App\Services\ImageService;
use Illuminate\Console\Command;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SyncGoogleDriveProductsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'products:sync-drive 
                            {--path= : Custom base directory path containing downloaded product folders}
                            {--dry-run : Simulate the synchronization process without modifying database or files}
                            {--force : Force re-processing even if product already has images}
                            {--folder= : Process only a specific folder}
                            {--limit= : Limit the number of product folders to process}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Synchronize product images and catalog from downloaded Google Drive folders';

    public function __construct(private readonly GeminiVisionService $vision)
    {
        parent::__construct();
    }

    public function handle(): int
    {
        ini_set('memory_limit', '-1');

        $baseDir = $this->option('path') 
            ? (string) $this->option('path') 
            : '/Users/adnanmac/.gemini/antigravity-ide/brain/56f99149-693b-452d-a621-fb3b814a21b2/scratch/gdrive_import';

        if (! is_dir($baseDir)) {
            $this->error("Directory not found: {$baseDir}");

            return self::FAILURE;
        }

        $dryRun = (bool) $this->option('dry-run');
        $force = (bool) $this->option('force');
        $targetFolder = $this->option('folder');
        $limit = $this->option('limit') ? (int) $this->option('limit') : null;

        if ($dryRun) {
            $this->warn('--- DRY RUN MODE (No changes will be written to database or storage) ---');
        }

        // Find all directories that contain image files
        $productFolders = $this->findProductFolders($baseDir);

        if ($targetFolder) {
            $productFolders = array_filter(
                $productFolders,
                fn ($name) => strcasecmp($name, $targetFolder) === 0
            );
            if (empty($productFolders)) {
                $this->error("Folder '{$targetFolder}' not found in {$baseDir}");

                return self::FAILURE;
            }
        }

        if ($limit !== null && $limit > 0) {
            $productFolders = array_slice($productFolders, 0, $limit, true);
        }

        $this->info('Found ' . count($productFolders) . ' product folders to process.');

        $processed = 0;
        $created = 0;
        $updated = 0;
        $failed = 0;

        foreach ($productFolders as $folderPath => $folderName) {
            $this->newLine();
            $this->info("==================================================");
            $this->info("Processing Folder: [{$folderName}]");

            // Gather valid, deduplicated image files
            $imageFiles = $this->getImageFiles($folderPath);
            if (empty($imageFiles)) {
                $this->warn("No valid images found in folder '{$folderName}'. Skipping.");
                continue;
            }

            $this->line("Found " . count($imageFiles) . " distinct images (after deduplication).");

            try {
                // 1. Check if product already exists or needs to be created
                $existingProduct = $this->findExistingProduct($folderName);

                // Skip if product already has all images synced and force is not set
                if ($existingProduct && ! $force && ! $dryRun && $existingProduct->images()->count() >= count($imageFiles)) {
                    $this->info("✓ Product #{$existingProduct->id} ({$existingProduct->name}) already has " . $existingProduct->images()->count() . " images. Skipping.");
                    $processed++;
                    continue;
                }

                // 2. Identify front-view ("tampak depan") image
                $frontViewFile = $this->determineFrontViewImage($imageFiles, $folderName);
                $this->line("Identified Front View (Foto Utama): " . basename($frontViewFile));

                if ($dryRun) {
                    if ($existingProduct) {
                        $this->info("[DRY RUN] Would update existing Product #{$existingProduct->id} ({$existingProduct->name}) with " . count($imageFiles) . " photos.");
                    } else {
                        $this->info("[DRY RUN] Would create new Product for folder '{$folderName}' with " . count($imageFiles) . " photos.");
                    }
                    $processed++;
                    continue;
                }

                if ($existingProduct) {
                    $this->updateExistingProduct($existingProduct, $imageFiles, $frontViewFile);
                    $updated++;
                    $this->info("✓ Successfully updated Product #{$existingProduct->id} ({$existingProduct->name})");
                } else {
                    $newProduct = $this->createNewProduct($folderName, $imageFiles, $frontViewFile);
                    $created++;
                    $this->info("✓ Successfully created Product #{$newProduct->id} ({$newProduct->name})");
                }

                $processed++;
                gc_collect_cycles();
            } catch (\Throwable $e) {
                $failed++;
                $this->error("Error processing '{$folderName}': " . $e->getMessage());
                $this->line($e->getTraceAsString());
            }
        }

        $this->newLine();
        $this->info("==================================================");
        $this->info("Summary:");
        $this->info("Total Processed: {$processed}");
        $this->info("Products Created: {$created}");
        $this->info("Products Updated: {$updated}");
        if ($failed > 0) {
            $this->error("Failed: {$failed}");
        }

        if (! $dryRun) {
            Product::syncAllLivingCollections();
            $drafted = Product::whereDoesntHave('images')->update(['status' => ProductStatus::DRAFT]);
            $activated = Product::whereHas('images')->update(['status' => ProductStatus::ACTIVE]);
            $this->info("Products without images set to DRAFT: {$drafted}");
            $this->info("Products with images set to ACTIVE: {$activated}");
        }

        return self::SUCCESS;
    }

    /**
     * Recursively find all product directories that contain images.
     *
     * @return array<string, string> Map of folderPath => folderName
     */
    private function findProductFolders(string $baseDir): array
    {
        $productFolders = [];
        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($baseDir, \RecursiveDirectoryIterator::SKIP_DOTS),
            \RecursiveIteratorIterator::SELF_FIRST
        );

        foreach ($iterator as $item) {
            if ($item->isDir()) {
                $dirPath = $item->getPathname();
                $dirName = $item->getFilename();

                // Skip top-level numeric batch folders like '1', '7', '8', '9'
                if (in_array($dirName, ['1', '7', '8', '9'], true)) {
                    continue;
                }

                // Check if directory contains valid images
                $images = $this->getImageFiles($dirPath);
                if (! empty($images)) {
                    $productFolders[$dirPath] = $dirName;
                }
            }
        }

        ksort($productFolders);

        return $productFolders;
    }

    /**
     * Get image files from directory, ignoring macOS AppleDouble ._* metadata and removing duplicates.
     *
     * @return array<int, string>
     */
    private function getImageFiles(string $dir): array
    {
        $files = @scandir($dir);
        if ($files === false) {
            return [];
        }

        $rawFiles = [];
        foreach ($files as $file) {
            if (str_starts_with($file, '.') || str_starts_with($file, '._')) {
                continue;
            }
            $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
            if (in_array($ext, ['jpg', 'jpeg', 'png', 'webp'], true)) {
                $rawFiles[] = $file;
            }
        }
        sort($rawFiles);

        $filtered = [];
        $seenHashes = [];

        foreach ($rawFiles as $file) {
            // Check duplicate naming like 'DSC00520 2.jpg' or 'DSC00520-2.jpg'
            $baseName = preg_replace('/[\s_-]2\.(jpg|jpeg|png|webp)$/i', '.$1', $file);
            if ($baseName !== $file && in_array($baseName, $rawFiles, true)) {
                continue; // Skip named duplicate
            }

            $fullPath = $dir . '/' . $file;
            $hash = @md5_file($fullPath);
            if ($hash && in_array($hash, $seenHashes, true)) {
                continue; // Skip exact content duplicate
            }
            if ($hash) {
                $seenHashes[] = $hash;
            }

            $filtered[] = $fullPath;
        }

        // Limit to 6 best distinct photos per product to ensure fast loading while giving complete views
        return array_slice($filtered, 0, 6);
    }

    /**
     * Find existing product by matching folder name.
     */
    private function findExistingProduct(string $folderName): ?Product
    {
        $clean = trim($folderName);
        $clean = preg_replace('/\s*\([^)]*\)/', '', $clean);
        $clean = preg_replace('/\s+/', ' ', $clean);

        // Normalize aliases
        $normalizedSearch = $clean;
        $normalizedSearch = preg_replace('/\bDC\b/i', 'DINING CHAIR', $normalizedSearch);
        $normalizedSearch = preg_replace('/\bD\.Table\b/i', 'DINING TABLE', $normalizedSearch);
        $normalizedSearch = preg_replace('/\bCoffe\b/i', 'COFFEE', $normalizedSearch);
        $normalizedSearch = preg_replace('/\bBarstool\b/i', 'BAR CHAIR', $normalizedSearch);

        // Try exact case-insensitive match on name
        $allProducts = Product::all();
        foreach ($allProducts as $p) {
            $translations = $p->getTranslations('name');
            $nameId = $translations['id'] ?? (is_array($p->name) ? ($p->name['id'] ?? '') : (string) $p->name);
            $nameEn = $translations['en'] ?? (is_array($p->name) ? ($p->name['en'] ?? '') : (string) $p->name);

            if (strcasecmp($nameId, $clean) === 0 || strcasecmp($nameEn, $clean) === 0 ||
                strcasecmp($nameId, $normalizedSearch) === 0 || strcasecmp($nameEn, $normalizedSearch) === 0) {
                return $p;
            }
        }

        return null;
    }

    /**
     * Determine front-view image ("tampak depan") using edge detection & photoshoot sequence.
     *
     * @param array<int, string> $imageFiles
     */
    private function determineFrontViewImage(array $imageFiles, string $folderName): string
    {
        if (count($imageFiles) === 1) {
            return $imageFiles[0];
        }

        // 1. Check if any filename explicitly contains 'front', 'depan', or 'utama'
        foreach ($imageFiles as $filePath) {
            $base = strtolower(basename($filePath));
            if (str_contains($base, 'front') || str_contains($base, 'depan') || str_contains($base, 'utama')) {
                return $filePath;
            }
        }

        // 2. Select the first full-view photo (filtering out detail/close-up crops where subject touches edges)
        foreach ($imageFiles as $filePath) {
            if (! $this->isDetailCrop($filePath)) {
                return $filePath;
            }
        }

        // 3. Fallback to first image in photoshoot sequence
        return $imageFiles[0];
    }

    /**
     * Check if an image is a detail/close-up crop where the subject bleeds into the canvas borders.
     */
    private function isDetailCrop(string $filePath): bool
    {
        $info = @getimagesize($filePath);
        if (! $info) {
            return false;
        }

        $srcImg = match ($info[2]) {
            IMAGETYPE_JPEG => @imagecreatefromjpeg($filePath),
            IMAGETYPE_PNG => @imagecreatefrompng($filePath),
            IMAGETYPE_WEBP => @imagecreatefromwebp($filePath),
            default => null,
        };

        if (! $srcImg) {
            return false;
        }

        $w = imagesx($srcImg);
        $h = imagesy($srcImg);
        $touches = false;

        // Sample along top and bottom borders (margin of 12px)
        $stepX = max(1, (int) ($w / 25));
        for ($x = 0; $x < $w; $x += $stepX) {
            $rgbTop = imagecolorat($srcImg, $x, 12);
            $rgbBot = imagecolorat($srcImg, $x, $h - 12);
            $rTop = ($rgbTop >> 16) & 0xFF;
            $gTop = ($rgbTop >> 8) & 0xFF;
            $bTop = $rgbTop & 0xFF;
            $rBot = ($rgbBot >> 16) & 0xFF;
            $gBot = ($rgbBot >> 8) & 0xFF;
            $bBot = $rgbBot & 0xFF;

            if ($rTop < 240 || $gTop < 240 || $bTop < 240 || $rBot < 240 || $gBot < 240 || $bBot < 240) {
                $touches = true;
                break;
            }
        }

        if (! $touches) {
            // Sample along left and right borders
            $stepY = max(1, (int) ($h / 25));
            for ($y = 0; $y < $h; $y += $stepY) {
                $rgbLeft = imagecolorat($srcImg, 12, $y);
                $rgbRight = imagecolorat($srcImg, $w - 12, $y);
                $rLeft = ($rgbLeft >> 16) & 0xFF;
                $gLeft = ($rgbLeft >> 8) & 0xFF;
                $bLeft = $rgbLeft & 0xFF;
                $rRight = ($rgbRight >> 16) & 0xFF;
                $gRight = ($rgbRight >> 8) & 0xFF;
                $bRight = $rgbRight & 0xFF;

                if ($rLeft < 240 || $gLeft < 240 || $bLeft < 240 || $rRight < 240 || $gRight < 240 || $bRight < 240) {
                    $touches = true;
                    break;
                }
            }
        }

        imagedestroy($srcImg);

        return $touches;
    }

    /**
     * Update an existing product with new images from Google Drive.
     *
     * @param array<int, string> $imageFiles
     */
    private function updateExistingProduct(Product $product, array $imageFiles, string $frontViewFile): void
    {
        DB::transaction(function () use ($product, $imageFiles, $frontViewFile) {
            // 1. Delete old images from disk and database
            $oldImages = $product->images()->get();
            foreach ($oldImages as $oldImg) {
                if ($oldImg->image_path) {
                    Storage::disk('public')->delete($oldImg->image_path);
                }
                $oldImg->delete();
            }

            // 2. Sort image files so that frontViewFile is index 0
            $orderedFiles = [$frontViewFile];
            foreach ($imageFiles as $file) {
                if ($file !== $frontViewFile) {
                    $orderedFiles[] = $file;
                }
            }

            // 3. Process and store each image with white background
            $productName = is_array($product->name) ? ($product->name['id'] ?? $product->name['en'] ?? '') : (string) $product->name;
            foreach ($orderedFiles as $index => $filePath) {
                $savedRelPath = ImageService::storeWithWhiteBackground($filePath, 'products', 'public');

                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => $savedRelPath,
                    'alt_text' => $productName,
                    'sort_order' => $index,
                    'is_primary' => $index === 0,
                ]);
            }

            // 4. Ensure product status is Active and fill missing fields
            $dirty = [];
            if ($product->status !== ProductStatus::ACTIVE) {
                $dirty['status'] = ProductStatus::ACTIVE;
            }
            if (empty($product->short_description)) {
                $dirty['short_description'] = [
                    'id' => "Furnitur outdoor {$productName} dengan desain modern kontemporer dari Ronica Furniture, dibuat menggunakan material tahan cuaca berkualitas tinggi.",
                    'en' => "Elegant {$productName} outdoor furniture featuring contemporary modern design by Ronica Furniture, crafted with premium all-weather materials.",
                ];
            }
            if (empty($product->description)) {
                $dirty['description'] = [
                    'id' => "{$productName} merupakan produk furnitur luar ruangan premium dari Ronica Furniture. Dirancang khusus untuk ketahanan segala cuaca dengan paduan kayu jati solid berkualitas tinggi dan anyaman rotan sintetis berdaya tahan maksimal terhadap sinar UV.",
                    'en' => "The {$productName} is a premium outdoor furniture piece by Ronica Furniture. Expertly engineered for exceptional weather resistance featuring high-grade solid teak wood and UV-stabilized synthetic weave.",
                ];
            }
            if (! empty($dirty)) {
                $product->updateQuietly($dirty);
            }
        });
    }

    /**
     * Create a new product with all form fields filled and images stored.
     *
     * @param array<int, string> $imageFiles
     */
    private function createNewProduct(string $folderName, array $imageFiles, string $frontViewFile): Product
    {
        // 1. Sort files so front view is first
        $orderedFiles = [$frontViewFile];
        foreach ($imageFiles as $file) {
            if ($file !== $frontViewFile) {
                $orderedFiles[] = $file;
            }
        }

        // 2. Extract catalog attributes
        $attributes = $this->extractCatalogAttributes($folderName, $orderedFiles);

        return DB::transaction(function () use ($attributes, $orderedFiles) {
            /** @var Product $product */
            $product = Product::create($attributes);

            $productName = is_array($product->name) ? ($product->name['id'] ?? $product->name['en'] ?? '') : (string) $product->name;

            // Save images
            foreach ($orderedFiles as $index => $filePath) {
                $savedRelPath = ImageService::storeWithWhiteBackground($filePath, 'products', 'public');

                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => $savedRelPath,
                    'alt_text' => $productName,
                    'sort_order' => $index,
                    'is_primary' => $index === 0,
                ]);
            }

            return $product;
        });
    }

    /**
     * Extract full catalog form attributes for a new product.
     *
     * @param array<int, string> $orderedFiles
     * @return array<string, mixed>
     */
    private function extractCatalogAttributes(string $folderName, array $orderedFiles): array
    {
        $cleanName = trim($folderName);
        $cleanName = preg_replace('/\s*\([^)]*\)/', '', $cleanName);
        $cleanName = preg_replace('/\bDC\b/i', 'Dining Chair', $cleanName);
        $cleanName = preg_replace('/\bD\.Table\b/i', 'Dining Table', $cleanName);
        $cleanName = preg_replace('/\bCoffe\b/i', 'Coffee', $cleanName);
        $cleanName = preg_replace('/\bChildern\b/i', 'Children', $cleanName);
        $cleanName = preg_replace('/\bHight\b/i', 'High', $cleanName);
        $cleanName = preg_replace('/\bTry\b/i', 'Tray', $cleanName);
        $cleanName = preg_replace('/\s+/', ' ', $cleanName);
        $cleanName = trim($cleanName);

        // Determine Category (STRICTLY within existing active categories)
        $categoryId = $this->guessCategoryId($folderName);

        // Standard outdoor luxury furniture defaults
        $defaultData = [
            'category_id' => $categoryId,
            'sku' => $this->generateUniqueSku($cleanName),
            'name' => [
                'id' => $cleanName,
                'en' => $cleanName,
            ],
            'slug' => Str::slug($cleanName) . '-' . Str::lower(Str::random(4)),
            'short_description' => [
                'id' => "Furnitur outdoor elegan {$cleanName} dengan desain modern kontemporer dari Ronica Furniture, dibuat menggunakan material tahan cuaca berkualitas tinggi.",
                'en' => "Elegant {$cleanName} outdoor furniture featuring contemporary modern design by Ronica Furniture, crafted with premium all-weather materials.",
            ],
            'description' => [
                'id' => "{$cleanName} merupakan produk furnitur luar ruangan premium dari Ronica Furniture. Dirancang khusus untuk ketahanan segala cuaca dengan paduan kayu jati solid berkualitas tinggi dan anyaman rotan sintetis berdaya tahan maksimal terhadap sinar UV. Menghadirkan kenyamanan ergonomis serta estetika mewah yang menyempurnakan area taman, teras, patio, maupun ruang keluarga Anda.",
                'en' => "The {$cleanName} is a premium outdoor furniture piece by Ronica Furniture. Expertly engineered for exceptional weather resistance featuring high-grade solid teak wood and UV-stabilized synthetic weave. Provides superior ergonomic comfort and luxurious aesthetics for garden, patio, poolside, and indoor living spaces.",
            ],
            'low_stock_threshold' => 5,
            'track_stock' => false,
            'allow_backorder' => true,
            'is_pre_order' => false,
            'weight' => $this->estimateWeight($cleanName),
            'length' => 60.00,
            'width' => 60.00,
            'height' => 85.00,
            'shipping_class' => 'flat_rate',
            'material' => [
                'id' => 'Kayu Jati Grade A & Anyaman Tahan Cuaca (UV Resistant)',
                'en' => 'Grade-A Solid Teak Wood & All-Weather UV Resistant Weave',
            ],
            'color' => [
                'id' => 'Natural Teak Wood & Neutral Charcoal',
                'en' => 'Natural Teak Wood & Neutral Charcoal',
            ],
            'specifications' => [
                ['key' => 'Rangka / Framework', 'value' => 'Kayu Jati Solid / Powder Coated Aluminum'],
                ['key' => 'Material Anyaman', 'value' => 'High-Density Polyethylene (HDPE) All-Weather Wicker'],
                ['key' => 'Ketahanan Cuaca', 'value' => '100% Tahan Air, Tahan Sinar UV, Anti Jamur'],
                ['key' => 'Finishing', 'value' => 'Natural Outdoor Wood Treatment'],
                ['key' => 'Garansi', 'value' => 'Garansi Konstruksi 3 Tahun'],
            ],
            'status' => ProductStatus::ACTIVE,
            'is_featured' => false,
            'is_new_arrival' => true,
            'meta_title' => [
                'id' => "{$cleanName} - Ronica Outdoor Furniture",
                'en' => "{$cleanName} - Ronica Outdoor Furniture",
            ],
            'meta_description' => [
                'id' => "Koleksi {$cleanName} premium dari Ronica Furniture. Material kayu jati pilihan, tahan cuaca dan berdesain modern elegan.",
                'en' => "Premium {$cleanName} collection from Ronica Furniture. Premium teak craftsmanship, all-weather durability, and timeless luxury.",
            ],
            'meta_keywords' => [
                'id' => strtolower($cleanName) . ', furniture jepara, outdoor furniture, ronica',
                'en' => strtolower($cleanName) . ', outdoor furniture, teak furniture, luxury patio, ronica',
            ],
        ];

        return $defaultData;
    }

    /**
     * Map product name to an EXISTING Category ID.
     */
    private function guessCategoryId(string $name): int
    {
        $n = strtolower($name);

        // 1. Natural Rattan (Check first for explicit natural rattan tag)
        if (str_contains($n, 'natural rattan') || str_contains($n, '(nt)') || str_contains($n, 'ratania') || str_contains($n, 'bamboo')) {
            if (str_contains($n, 'table') || str_contains($n, 'coffe')) {
                $cat = Category::where('slug', 'tables')->first();
                if ($cat) return $cat->id;
            }
            if (str_contains($n, 'set')) {
                $cat = Category::where('slug', 'living-set')->first();
                if ($cat) return $cat->id;
            }
            if (str_contains($n, 'rack') || str_contains($n, 'tray') || str_contains($n, 'try') || str_contains($n, 'stand')) {
                $cat = Category::where('slug', 'accessories')->first();
                if ($cat) return $cat->id;
            }
            $cat = Category::where('slug', 'natural-rattan')->first();
            if ($cat) return $cat->id;
        }

        // 2. Corner Sets
        if (str_contains($n, 'corner') || str_contains($n, 'l-shape') || str_contains($n, 'sectional')) {
            $cat = Category::where('slug', 'corner-set')->first();
            if ($cat) return $cat->id;
        }

        // 3. Dining Sets
        if (str_contains($n, 'dining set') || str_contains($n, 'dining core set') || str_contains($n, 'bistro set') || str_contains($n, 'bar set')) {
            $cat = Category::where('slug', 'dining-set')->first();
            if ($cat) return $cat->id;
        }

        // 4. Living Sets & Sofas
        if (str_contains($n, 'living set') || str_contains($n, 'balcony set') || str_contains($n, 'occasional set') || str_contains($n, 'sofa set') || str_contains($n, 'lounge set')) {
            $cat = Category::where('slug', 'living-set')->first();
            if ($cat) return $cat->id;
        }

        // 5. Daybed & Sunbed
        if (str_contains($n, 'daybed') || str_contains($n, 'sunbed') || str_contains($n, 'hanging chair') || str_contains($n, 'lounger')) {
            $cat = Category::where('slug', 'daybedsunbed')->first();
            if ($cat) return $cat->id;
        }

        // 6. Tables
        if (str_contains($n, 'table') || str_contains($n, 'coffe') || str_contains($n, 'coffee') || str_contains($n, 'desk') || str_contains($n, 'ct')) {
            $cat = Category::where('slug', 'tables')->first();
            if ($cat) return $cat->id;
        }

        // 7. Chairs, Stools & Benches
        if (str_contains($n, 'chair') || str_contains($n, 'stool') || str_contains($n, 'barstool') || str_contains($n, 'swivel') || str_contains($n, 'armchair') || str_contains($n, 'bench') || str_contains($n, 'puff') || str_contains($n, 'dc')) {
            $cat = Category::where('slug', 'chairs')->first();
            if ($cat) return $cat->id;
        }

        // 8. Sofas (standalone)
        if (str_contains($n, 'sofa')) {
            $cat = Category::where('slug', 'living-set')->first();
            if ($cat) return $cat->id;
        }

        // 9. Cabinets & Storage Furniture
        if (str_contains($n, 'cabinet') || str_contains($n, 'drawer') || str_contains($n, 'credenza')) {
            $cat = Category::where('slug', 'home-furniture')->first();
            if ($cat) return $cat->id;
        }

        // 10. Accessories
        if (str_contains($n, 'stand') || str_contains($n, 'rack') || str_contains($n, 'tray') || str_contains($n, 'try') || str_contains($n, 'accessory') || str_contains($n, 'lantern')) {
            $cat = Category::where('slug', 'accessories')->first();
            if ($cat) return $cat->id;
        }

        // 11. Generic Set
        if (str_contains($n, 'set')) {
            $cat = Category::where('slug', 'living-set')->first();
            if ($cat) return $cat->id;
        }

        // Fallback to Chairs or first active category
        return Category::where('slug', 'chairs')->value('id') ?? (Category::first()?->id ?? 1);
    }

    private function estimateWeight(string $name): float
    {
        $n = strtolower($name);
        if (str_contains($n, 'set')) return 48.0;
        if (str_contains($n, 'sofa')) return 32.0;
        if (str_contains($n, 'table')) return 24.0;
        if (str_contains($n, 'cabinet') || str_contains($n, 'drawer')) return 35.0;
        if (str_contains($n, 'daybed')) return 38.0;
        return 8.5; // Single chair / stool
    }

    private function generateUniqueSku(string $name): string
    {
        $prefix = Str::of($name)
            ->ascii()
            ->upper()
            ->replaceMatches('/[^A-Z]/', '')
            ->substr(0, 4)
            ->value();

        if (strlen($prefix) < 3) {
            $prefix = 'RON';
        }

        for ($i = 0; $i < 15; $i++) {
            $candidate = 'RON-' . $prefix . '-' . Str::upper(Str::random(4));
            if (! Product::where('sku', $candidate)->exists()) {
                return $candidate;
            }
        }

        return 'RON-' . Str::upper(Str::random(8));
    }

    /**
     * Create a lightweight JPEG thumbnail for AI Vision analysis.
     */
    private function createThumbnail(string $source, string $dest, int $maxDim = 480): void
    {
        $info = @getimagesize($source);
        if (! $info) {
            @copy($source, $dest);
            return;
        }

        [$width, $height, $type] = $info;
        if ($width <= 0 || $height <= 0) {
            @copy($source, $dest);
            return;
        }

        $ratio = min($maxDim / $width, $maxDim / $height, 1.0);
        $newW = max(1, (int) ($width * $ratio));
        $newH = max(1, (int) ($height * $ratio));

        $srcImg = match ($type) {
            IMAGETYPE_JPEG => @imagecreatefromjpeg($source),
            IMAGETYPE_PNG => @imagecreatefrompng($source),
            IMAGETYPE_WEBP => @imagecreatefromwebp($source),
            default => null,
        };

        if (! $srcImg) {
            @copy($source, $dest);
            return;
        }

        $dstImg = imagecreatetruecolor($newW, $newH);
        imagecopyresampled($dstImg, $srcImg, 0, 0, 0, 0, $newW, $newH, $width, $height);
        imagejpeg($dstImg, $dest, 80);
        imagedestroy($srcImg);
        imagedestroy($dstImg);
    }
}
