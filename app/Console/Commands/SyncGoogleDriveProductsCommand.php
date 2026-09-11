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
            : '/Users/adnanmac/.gemini/antigravity-ide/brain/e4d67261-58d6-41cb-ae35-84d759438c27/scratch/gdrive';

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

        // Get all subdirectories
        $allEntries = scandir($baseDir);
        $folders = [];
        foreach ($allEntries as $entry) {
            if ($entry === '.' || $entry === '..' || str_starts_with($entry, '.')) {
                continue;
            }
            $fullPath = $baseDir.'/'.$entry;
            if (is_dir($fullPath)) {
                $folders[] = $entry;
            }
        }
        sort($folders);

        if ($targetFolder) {
            $folders = array_filter($folders, fn ($f) => strcasecmp($f, $targetFolder) === 0);
            if (empty($folders)) {
                $this->error("Folder '{$targetFolder}' not found in {$baseDir}");

                return self::FAILURE;
            }
        }

        if ($limit !== null && $limit > 0) {
            $folders = array_slice($folders, 0, $limit);
        }

        $this->info('Found '.count($folders).' product folders to process.');

        $processed = 0;
        $created = 0;
        $updated = 0;
        $failed = 0;

        foreach ($folders as $folderName) {
            $folderPath = $baseDir.'/'.$folderName;
            $this->newLine();
            $this->info("==================================================");
            $this->info("Processing Folder: [{$folderName}]");

            // Gather valid image files
            $imageFiles = $this->getImageFiles($folderPath);
            if (empty($imageFiles)) {
                $this->warn("No valid images found in folder '{$folderName}'. Skipping.");
                continue;
            }

            $this->line("Found ".count($imageFiles)." images.");

            try {
                // 1. Check if product already exists or needs to be created
                $existingProduct = $this->findExistingProduct($folderName);

                // Skip if product already has all images synced and force is not set
                if ($existingProduct && ! $force && ! $dryRun && $existingProduct->images()->count() >= count($imageFiles)) {
                    $this->info("✓ Product #{$existingProduct->id} ({$existingProduct->name}) already has ".count($imageFiles)." images. Skipping.");
                    $processed++;
                    continue;
                }

                // 2. Identify front-view ("tampak depan") image
                $frontViewFile = $this->determineFrontViewImage($imageFiles, $folderName);
                $this->line("Identified Front View (Foto Utama): " . basename($frontViewFile));

                if ($dryRun) {
                    if ($existingProduct) {
                        $this->info("[DRY RUN] Would update existing Product #{$existingProduct->id} ({$existingProduct->name}) with ".count($imageFiles)." photos.");
                    } else {
                        $this->info("[DRY RUN] Would create new Product for folder '{$folderName}' with ".count($imageFiles)." photos.");
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

        return self::SUCCESS;
    }

    /**
     * Get image files from directory, ignoring macOS AppleDouble ._* metadata.
     *
     * @return array<int, string>
     */
    private function getImageFiles(string $dir): array
    {
        $files = scandir($dir);
        $images = [];
        foreach ($files as $file) {
            if (str_starts_with($file, '.') || str_starts_with($file, '._')) {
                continue;
            }
            $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
            if (in_array($ext, ['jpg', 'jpeg', 'png', 'webp'], true)) {
                $images[] = $dir.'/'.$file;
            }
        }
        sort($images);

        return $images;
    }

    /**
     * Find existing product by matching folder name.
     */
    private function findExistingProduct(string $folderName): ?Product
    {
        // 1. Direct name normalization
        $clean = trim($folderName);
        $clean = preg_replace('/\s+/', ' ', $clean);

        // Normalize aliases
        $normalizedSearch = $clean;
        $normalizedSearch = preg_replace('/\bDC\b/i', 'DINING CHAIR', $normalizedSearch);
        $normalizedSearch = preg_replace('/\bD\.Table\b/i', 'DINING TABLE', $normalizedSearch);
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

        // Special predefined mappings
        $specialMap = [
            'Alefa DC' => 'ALEFA DINING CHAIR',
            'Aranni Dining Chair' => 'ARANNI DINING CHAIR',
            'Astarte Dining Chair' => 'ASTARTE DINING CHAIR',
            'Batty Line Dining Chair (Blue)' => 'BATTY LINE DINING CHAIR (BLUE)',
            'Coral Barstool' => 'CORAL BAR CHAIR',
            'Coral Dining Chair' => 'CORAL DINING CHAIR',
            'Coral Dining Set' => 'CORAL DINING SET',
            'Coral Dining Table' => 'CORAL DINING TABLE',
            'Cordoba Dining Chair' => 'CORDOBA DINING CHAIR',
            'Dolce Balcony Set' => 'DOLCE BALCONY SET',
            'Dolce Balcony Sofa' => 'DOLCE BALCONY SOFA',
            'Dolce Balcony Table' => 'DOLCE BALCONY TABLE',
            'Dolce Dining Chair' => 'DOLCE DINING CHAIR',
            'Hemera Dining Chair' => 'HEMERA DINING CHAIR',
            'Hera Dining Chair' => 'HERA DINING CHAIR',
            'Koko Dining Chair' => 'KOKO DINING CHAIR',
            'Komodo Barstool' => 'KOMODO BAR CHAIR',
            'Komodo Barstool 2' => 'KOMODO BARSTOOL 2',
            'Linden Dining Chair' => 'LINDEN DINING CHAIR',
            'Meryl Dining Chair' => 'MERYL DINING CHAIR',
            'Monaco Dining Chair' => 'MONACO DINING CHAIR',
            'Montevideo Barstool' => 'MONTEVIDEO BAR CHAIR',
            'Nana DC Back' => 'NANA DINING CHAIR BACK',
            'Nana Dining Arm set' => 'NANA DINING ARM SET',
            'Nana Dining Chair Arm' => 'NANA DINING CHAIR ARM',
            'Nana High Back' => 'NANA HIGH BACK',
            'Nara D.Table Square' => 'NARA DINING TABLE SQUARE',
            'Nara Dining Chair Back Curve' => 'NARA DINING CHAIR BACK CURVE',
            'Nara Dining Chair Core' => 'NARA DINING CHAIR CORE',
            'Nara Dining Chair no Arm' => 'NARA DINING CHAIR NO ARM',
            'Nara Dining Core Set ( round & Squere Table)' => 'NARA DINING CORE SET',
            'Nara Round Dining Table' => 'NARA ROUND DINING TABLE',
            'Narnia Barstool' => 'NARNIA BAR CHAIR',
            'Narnia Dining Chair High Back' => 'NARNIA DINING CHAIR',
            'Narnia Occasional Chair' => 'NARNIA OCCASIONAL CHAIR',
            'Narnia Occasional Set' => 'NARNIA OCCASIONAL SET',
            'Narnia Occasional Table' => 'NARNIA OCCASIONAL TABLE',
            'Nexus Dining Chair' => 'NEXUS DINING CHAIR',
            'Nusa Dining Table' => 'NUSA DINING TABLE',
            'Rio Dining Chair' => 'RIO DINING CHAIR NATURAL',
            'Sisi Dining Chair' => 'SISI DINING CHAIR',
            'Vega Dining Chair' => 'VEGA DINING CHAIR',
            'Vero Dining Chair' => 'VERO DINING CHAIR',
            'Windsor Barstool' => 'WINDSOR BAR CHAIR',
            // Batch 2 mappings
            'Caira Coffe Table' => 'CAIRA COFFEE TABLE',
            'Caira Living Chair' => 'CAIRA LIVING CHAIR',
            'Caira Living Set' => 'CAIRA LIVING SET',
            'Caira Sofa 2 Seater' => 'CAIRA SOFA',
            'Coral Coffe Table' => 'CORAL COFFEE TABLE',
            'Coral Living Chair' => 'CORAL LIVING CHAIR',
            'Coral Living Set' => 'CORAL LIVING SET',
            'Coral Puff Round' => 'CORAL PUFF ROUND',
            'Coral Sofa 3 Seater' => 'CORAL SOFA',
            'Dune Coffe Table' => 'DUNE COFFEE TABLE',
            'Dune Living Chair' => 'DUNE LIVING CHAIR',
            'Dune Living Set' => 'DUNE LIVING SET',
            'Dune Sofa 3 Seater' => 'DUNE SOFA 3 SEATER',
            'Leora Coffe Table' => 'LEORA COFFEE TABLE',
            'Leora Dining Chair' => 'LEORA DINING CHAIR',
            'Leora Dining Set' => 'LEORA DINING SET',
            'Leora Dining Table' => 'LEORA DINING TABLE',
            'Leora Sofa 2 seater Set' => 'LEORA SOFA',
            'Narnia Counter Stool' => 'NARNIA COUNTER CHAIR',
            'Salvador Coffe Table' => 'SALVADOR COFFEE TABLE',
            'Salvador Dining Chair' => 'SALVADOR DINING CHAIR',
            'Salvador Dining Set' => 'SALVADOR DINING SET',
            'Salvador Dining Table' => 'SALVADOR DINING TABLE',
            'Salvador Living Chair' => 'SALVADOR LIVING CHAIR',
            'Salvador Living Set' => 'SALVADOR LIVING SET',
            'Salvador Side Table' => 'SALVADOR END TABLE',
            'Salvador Sofa 3 Seater' => 'SALVADOR SOFA',
        ];

        if (isset($specialMap[$clean])) {
            $target = $specialMap[$clean];
            foreach ($allProducts as $p) {
                $translations = $p->getTranslations('name');
                $nameId = $translations['id'] ?? '';
                $nameEn = $translations['en'] ?? (is_array($p->name) ? ($p->name['en'] ?? '') : (string) $p->name);
                if (strcasecmp($nameEn, $target) === 0 || strcasecmp($nameId, $target) === 0) {
                    return $p;
                }
            }
        }

        return null;
    }

    /**
     * Determine front-view image ("tampak depan") using Gemini Vision or fallback to first.
     *
     * @param array<int, string> $imageFiles
     */
    private function determineFrontViewImage(array $imageFiles, string $folderName): string
    {
        if (count($imageFiles) === 1) {
            return $imageFiles[0];
        }

        $tempFiles = [];
        try {
            // Upload up to 6 lightweight thumbnails for AI analysis
            $subset = array_slice($imageFiles, 0, 6);
            $uploadedFiles = [];
            foreach ($subset as $p) {
                $tmpPath = tempnam(sys_get_temp_dir(), 'ai_front_') . '.jpg';
                $this->createThumbnail($p, $tmpPath, 640);
                $tempFiles[] = $tmpPath;
                $uploadedFiles[] = new UploadedFile($tmpPath, basename($p), 'image/jpeg', null, true);
            }

            $filenames = array_map(fn ($f) => basename($f), $subset);
            $prompt = "Di antara foto-foto produk furnitur '{$folderName}' ini (nama file: " . implode(', ', $filenames) . "), gambar manakah yang merupakan foto TAMPAK DEPAN (front view lurus / straight-on from the front) yang paling pas sebagai foto utama katalog? Kembalikan JSON dengan format yang diminta.";

            $schema = [
                'type' => 'OBJECT',
                'properties' => [
                    'front_view_filename' => ['type' => 'STRING'],
                ],
                'required' => ['front_view_filename'],
            ];

            $res = $this->vision->generateJsonFromImages($uploadedFiles, $prompt, $schema);
            $chosen = trim((string) ($res['front_view_filename'] ?? ''));

            foreach ($imageFiles as $filePath) {
                if (strcasecmp(basename($filePath), $chosen) === 0) {
                    return $filePath;
                }
            }
        } catch (\Throwable $e) {
            $this->warn("AI front-view check skipped/failed: {$e->getMessage()}. Using first image as fallback.");
        } finally {
            foreach ($tempFiles as $tf) {
                @unlink($tf);
            }
        }

        return $imageFiles[0];
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

            // 4. Ensure product status is Active
            if ($product->status !== ProductStatus::ACTIVE) {
                $product->updateQuietly(['status' => ProductStatus::ACTIVE]);
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

        // 2. Extract catalog attributes via Gemini Vision
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
        $cleanName = preg_replace('/\bDC\b/i', 'DINING CHAIR', $cleanName);
        $cleanName = preg_replace('/\bD\.Table\b/i', 'DINING TABLE', $cleanName);
        $cleanName = preg_replace('/\bCoffe\b/i', 'COFFEE', $cleanName);
        $cleanName = preg_replace('/\s+/', ' ', $cleanName);
        $cleanName = strtoupper(trim($cleanName));

        // Determine default Category
        $categoryId = $this->guessCategoryId($cleanName);

        // Fallback default attributes
        $defaultData = [
            'category_id' => $categoryId,
            'sku' => $this->generateUniqueSku($cleanName),
            'name' => ['id' => $cleanName, 'en' => $cleanName],
            'slug' => Str::slug($cleanName).'-'.Str::lower(Str::random(5)),
            'short_description' => [
                'id' => "Furnitur elegan {$cleanName} dengan desain modern kontemporer dari Ronica Furniture.",
                'en' => "Elegant {$cleanName} furniture featuring contemporary modern design by Ronica Furniture.",
            ],
            'description' => [
                'id' => "{$cleanName} merupakan produk furnitur berkualitas tinggi dari Ronica. Dibuat dengan material pilihan yang kokoh, tahan lama, dan memiliki estetika visual yang menawan untuk melengkapi ruang interior maupun semi-outdoor Anda.",
                'en' => "The {$cleanName} is a high quality furniture piece by Ronica. Crafted with selected durable materials offering visual aesthetics and comfortable ergonomics.",
            ],
            'low_stock_threshold' => 5,
            'track_stock' => true,
            'allow_backorder' => false,
            'is_pre_order' => false,
            'weight' => 7.50,
            'length' => 55.00,
            'width' => 52.00,
            'height' => 82.00,
            'shipping_class' => 'flat_rate',
            'material' => [
                'id' => 'Kayu Jati & Rotan Alami',
                'en' => 'Teak Wood & Natural Rattan',
            ],
            'color' => [
                'id' => 'Natural Wood / Charcoal',
                'en' => 'Natural Wood / Charcoal',
            ],
            'specifications' => [
                ['key' => 'Gaya', 'value' => 'Modern Minimalis'],
                ['key' => 'Finishing', 'value' => 'Natural Matte'],
                ['key' => 'Perakitan', 'value' => 'Sudah Dirakit'],
                ['key' => 'Garansi', 'value' => '1 Tahun'],
            ],
            'status' => ProductStatus::ACTIVE,
            'is_featured' => false,
            'is_new_arrival' => true,
            'meta_title' => [
                'id' => "Beli {$cleanName} - Ronica Furniture",
                'en' => "Buy {$cleanName} - Ronica Furniture",
            ],
            'meta_description' => [
                'id' => "Koleksi {$cleanName} premium dari Ronica. Material berkualitas, desain elegan, dan pengerjaan presisi.",
                'en' => "Premium {$cleanName} collection from Ronica. Quality materials, elegant design, and precision craftsmanship.",
            ],
            'meta_keywords' => [
                'id' => strtolower($cleanName) . ', furniture jepara, kursi makan, ronica',
                'en' => strtolower($cleanName) . ', luxury furniture, dining chair, ronica',
            ],
        ];

        $tempFiles = [];
        try {
            $subset = array_slice($orderedFiles, 0, 3);
            $uploadedFiles = [];
            foreach ($subset as $p) {
                $tmpPath = tempnam(sys_get_temp_dir(), 'ai_cat_') . '.jpg';
                $this->createThumbnail($p, $tmpPath, 640);
                $tempFiles[] = $tmpPath;
                $uploadedFiles[] = new UploadedFile($tmpPath, basename($p), 'image/jpeg', null, true);
            }

            $categories = Category::where('is_active', true)->pluck('name', 'id')->all();
            $categoryList = implode(', ', array_map(fn ($c) => is_array($c) ? ($c['id'] ?? $c['en'] ?? '') : (string) $c, $categories));

            $prompt = "Anda adalah kurator katalog Ronica Furniture. Ekstrak data katalog untuk produk baru '{$cleanName}' berdasarkan gambar-gambar terlampir. Kategori yang tersedia: {$categoryList}.";

            $schema = [
                'type' => 'OBJECT',
                'properties' => [
                    'name_id' => ['type' => 'STRING'],
                    'name_en' => ['type' => 'STRING'],
                    'category' => ['type' => 'STRING'],
                    'description_id' => ['type' => 'STRING'],
                    'description_en' => ['type' => 'STRING'],
                    'material_id' => ['type' => 'STRING'],
                    'material_en' => ['type' => 'STRING'],
                    'color_id' => ['type' => 'STRING'],
                    'color_en' => ['type' => 'STRING'],
                    'weight_kg' => ['type' => 'NUMBER'],
                    'length_cm' => ['type' => 'NUMBER'],
                    'width_cm' => ['type' => 'NUMBER'],
                    'height_cm' => ['type' => 'NUMBER'],
                    'shipping_class' => ['type' => 'STRING'],
                    'specifications' => [
                        'type' => 'ARRAY',
                        'items' => [
                            'type' => 'OBJECT',
                            'properties' => [
                                'key' => ['type' => 'STRING'],
                                'value' => ['type' => 'STRING'],
                            ],
                            'required' => ['key', 'value'],
                        ],
                    ],
                ],
                'required' => ['name_id', 'description_id'],
            ];

            $ai = $this->vision->generateJsonFromImages($uploadedFiles, $prompt, $schema);

            if (! empty($ai['name_id'])) {
                $defaultData['name'] = [
                    'id' => strtoupper(trim((string) $ai['name_id'])),
                    'en' => strtoupper(trim((string) ($ai['name_en'] ?? $ai['name_id']))),
                ];
            }

            if (! empty($ai['description_id'])) {
                $descId = trim((string) $ai['description_id']);
                $descEn = trim((string) ($ai['description_en'] ?? $descId));
                $defaultData['description'] = ['id' => $descId, 'en' => $descEn];
                $defaultData['short_description'] = [
                    'id' => Str::limit($descId, 250, '...'),
                    'en' => Str::limit($descEn, 250, '...'),
                ];
            }

            if (! empty($ai['material_id'])) {
                $defaultData['material'] = [
                    'id' => trim((string) $ai['material_id']),
                    'en' => trim((string) ($ai['material_en'] ?? $ai['material_id'])),
                ];
            }

            if (! empty($ai['color_id'])) {
                $defaultData['color'] = [
                    'id' => trim((string) $ai['color_id']),
                    'en' => trim((string) ($ai['color_en'] ?? $ai['color_id'])),
                ];
            }

            if (! empty($ai['weight_kg'])) {
                $defaultData['weight'] = max(0.5, (float) $ai['weight_kg']);
            }
            if (! empty($ai['length_cm'])) {
                $defaultData['length'] = max(10, (float) $ai['length_cm']);
            }
            if (! empty($ai['width_cm'])) {
                $defaultData['width'] = max(10, (float) $ai['width_cm']);
            }
            if (! empty($ai['height_cm'])) {
                $defaultData['height'] = max(10, (float) $ai['height_cm']);
            }

            if (! empty($ai['specifications']) && is_array($ai['specifications'])) {
                $defaultData['specifications'] = $ai['specifications'];
            }
        } catch (\Throwable $e) {
            $this->warn("AI attribute extraction fallback: " . $e->getMessage());
        } finally {
            foreach ($tempFiles as $tf) {
                @unlink($tf);
            }
        }

        return $defaultData;
    }

    private function guessCategoryId(string $name): int
    {
        $upper = strtoupper($name);

        if (str_contains($upper, 'SOFA')) {
            return 29; // Comfort Products
        }

        if (str_contains($upper, 'DINING SET') || str_contains($upper, 'CORE SET')) {
            return 1; // Dining Set
        }

        if (str_contains($upper, 'LIVING SET') || str_contains($upper, 'BALCONY SET') || str_contains($upper, 'OCCASIONAL SET') || str_contains($upper, 'SET')) {
            return 6; // Living Set
        }

        if (str_contains($upper, 'TABLE')) {
            return 26; // Tables
        }

        if (str_contains($upper, 'CHAIR') || str_contains($upper, 'BARSTOOL') || str_contains($upper, 'STOOL')) {
            return 3; // Chairs
        }

        return 3; // Default Chairs
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
            $prefix = 'EOF';
        }

        for ($i = 0; $i < 10; $i++) {
            $candidate = 'EOF-' . $prefix . Str::upper(Str::random(4));
            if (! Product::where('sku', $candidate)->exists()) {
                return $candidate;
            }
        }

        return 'EOF-' . Str::upper(Str::random(8));
    }

    /**
     * Create a lightweight JPEG thumbnail for AI Vision analysis to stay within request size limits.
     */
    private function createThumbnail(string $source, string $dest, int $maxDim = 640): void
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
