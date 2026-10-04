<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use App\Services\ImageService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Throwable;
use ZipArchive;

class ProductBulkImageController extends Controller implements HasMiddleware
{
    /** @return array<int, Middleware> */
    public static function middleware(): array
    {
        return [
            new Middleware('permission:edit products|create products'),
        ];
    }

    /**
     * Match a list of image filenames to products based on SKU and naming patterns.
     */
    public function match(Request $request): JsonResponse
    {
        $request->validate([
            'filenames' => ['required', 'array', 'max:500'],
            'filenames.*' => ['required', 'string', 'max:255'],
        ]);

        /** @var array<int, string> $filenames */
        $filenames = $request->input('filenames', []);

        // Preload all active products with id, sku, and translatable name
        $products = Product::with(['images' => fn ($q) => $q->where('is_primary', true)->orWhere('sort_order', 0)])
            ->get(['id', 'sku', 'name', 'slug']);

        $skuMap = [];
        $slugMap = [];
        foreach ($products as $p) {
            $normalizedSku = strtolower(trim($p->sku));
            $skuMap[$normalizedSku] = $p;
            $slugMap[strtolower($p->slug)] = $p;
        }

        $results = [];
        foreach ($filenames as $filename) {
            $extractedSku = $this->extractSkuFromFilename($filename);
            $matchedProduct = $this->resolveProductForFilename($filename, $skuMap, $slugMap);

            $primaryImg = $matchedProduct?->images?->first();
            $primaryImgUrl = $primaryImg ? asset('storage/'.$primaryImg->image_path) : null;

            $results[] = [
                'filename' => $filename,
                'detected_sku' => $matchedProduct ? $matchedProduct->sku : $extractedSku,
                'matched' => $matchedProduct !== null,
                'product' => $matchedProduct ? [
                    'id' => $matchedProduct->id,
                    'sku' => $matchedProduct->sku,
                    'name' => is_array($matchedProduct->name) ? ($matchedProduct->name['id'] ?? $matchedProduct->name['en'] ?? '') : (string) $matchedProduct->name,
                    'primary_image_url' => $primaryImgUrl,
                ] : null,
            ];
        }

        return response()->json([
            'success' => true,
            'matches' => $results,
        ]);
    }

    /**
     * Search products for manual dropdown selection.
     */
    public function search(Request $request): JsonResponse
    {
        $q = trim((string) $request->query('q', ''));
        if ($q === '') {
            $products = Product::with(['images' => fn ($query) => $query->where('is_primary', true)->orWhere('sort_order', 0)])
                ->latest()
                ->limit(20)
                ->get(['id', 'sku', 'name', 'slug']);
        } else {
            $products = Product::with(['images' => fn ($query) => $query->where('is_primary', true)->orWhere('sort_order', 0)])
                ->where('sku', 'like', "%{$q}%")
                ->orWhere('name->id', 'like', "%{$q}%")
                ->orWhere('name->en', 'like', "%{$q}%")
                ->orWhere('slug', 'like', "%{$q}%")
                ->limit(30)
                ->get(['id', 'sku', 'name', 'slug']);
        }

        $items = $products->map(function (Product $p) {
            $primaryImg = $p->images?->first();

            return [
                'id' => $p->id,
                'sku' => $p->sku,
                'name' => is_array($p->name) ? ($p->name['id'] ?? $p->name['en'] ?? '') : (string) $p->name,
                'primary_image_url' => $primaryImg ? asset('storage/'.$primaryImg->image_path) : null,
            ];
        });

        return response()->json([
            'success' => true,
            'products' => $items,
        ]);
    }

    /**
     * Process bulk image upload (multiple files or ZIP archive).
     */
    public function upload(Request $request): JsonResponse
    {
        @ini_set('memory_limit', '1024M');
        @set_time_limit(300);

        $request->validate([
            'images' => ['nullable', 'array'],
            'images.*' => ['nullable', 'file', 'mimes:jpeg,png,jpg,webp,gif,svg', 'max:51200'], // max 50MB each
            'zip_file' => ['nullable', 'file', 'max:256000'], // max 250MB (mimes checked flexibly)
            'mappings' => ['nullable', 'string'], // JSON string of filename => product_id
        ]);

        $mappings = [];
        if ($request->filled('mappings')) {
            $decoded = json_decode((string) $request->input('mappings'), true);
            if (is_array($decoded)) {
                $mappings = $decoded;
            }
        }

        $filesToProcess = []; // array of ['file' => UploadedFile|string, 'filename' => string, 'temp' => bool]
        $tempDir = null;

        try {
            // 1. Handle uploaded multiple files
            if ($request->hasFile('images')) {
                /** @var array<int, UploadedFile> $uploadedFiles */
                $uploadedFiles = $request->file('images', []);
                foreach ($uploadedFiles as $file) {
                    $filesToProcess[] = [
                        'file' => $file,
                        'filename' => $file->getClientOriginalName(),
                        'temp' => false,
                    ];
                }
            }

            // 2. Handle ZIP archive if provided
            if ($request->hasFile('zip_file')) {
                /** @var UploadedFile $zipFile */
                $zipFile = $request->file('zip_file');
                $zipName = pathinfo($zipFile->getClientOriginalName(), PATHINFO_FILENAME);
                $zip = new ZipArchive;

                if ($zip->open($zipFile->getRealPath()) === true) {
                    $tempDir = storage_path('app/temp_bulk_img_'.uniqid());
                    mkdir($tempDir, 0755, true);
                    $zip->extractTo($tempDir);
                    $zip->close();

                    $iterator = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($tempDir));
                    foreach ($iterator as $item) {
                        if ($item->isFile()) {
                            $filename = $item->getFilename();
                            $pathname = $item->getPathname();

                            // Ignore hidden macOS / system files
                            if (str_starts_with($filename, '._') || $filename === '.DS_Store' || str_contains($pathname, '__MACOSX')) {
                                continue;
                            }

                            $ext = strtolower($item->getExtension());
                            if (in_array($ext, ['jpg', 'jpeg', 'png', 'webp', 'gif'], true)) {
                                $parentDir = basename(dirname($pathname));
                                $context = ($parentDir !== '' && $parentDir !== basename($tempDir)) ? $parentDir : $zipName;

                                $filesToProcess[] = [
                                    'file' => $item->getRealPath(),
                                    'filename' => $filename,
                                    'context' => $context,
                                    'temp' => true,
                                ];
                            }
                        }
                    }
                } else {
                    throw new Exception('Failed to open ZIP archive. Please ensure the archive is valid.');
                }
            }

            if (empty($filesToProcess)) {
                throw new Exception('No valid image files found to process.');
            }

            // Preload products for fallback mapping
            $allProducts = Product::all(['id', 'sku', 'name', 'slug']);
            $skuMap = [];
            $slugMap = [];
            foreach ($allProducts as $p) {
                $skuMap[strtolower(trim($p->sku))] = $p;
                $slugMap[strtolower(trim($p->slug))] = $p;
            }

            $report = [
                'total' => count($filesToProcess),
                'successful' => 0,
                'failed' => 0,
                'updated_products' => [],
                'errors' => [],
            ];

            $updatedProductIds = [];

            foreach ($filesToProcess as $item) {
                $filename = $item['filename'];
                $fileSource = $item['file'];
                $context = $item['context'] ?? null;

                // Determine target Product
                $productId = null;
                if (isset($mappings[$filename]) && is_numeric($mappings[$filename])) {
                    $productId = (int) $mappings[$filename];
                } else {
                    $matchedProd = $this->resolveProductForFilename($filename, $skuMap, $slugMap, $context);
                    if ($matchedProd) {
                        $productId = $matchedProd->id;
                    }
                }

                if (! $productId) {
                    $report['failed']++;
                    $report['errors'][] = [
                        'filename' => $filename,
                        'message' => 'Product not found for this filename.',
                    ];

                    continue;
                }

                /** @var Product|null $product */
                $product = Product::find($productId);
                if (! $product) {
                    $report['failed']++;
                    $report['errors'][] = [
                        'filename' => $filename,
                        'message' => "Product with ID {$productId} not found in database.",
                    ];

                    continue;
                }

                try {
                    // Process & store with 1:1 white background canvas
                    $storedPath = ImageService::storeWithWhiteBackground($fileSource, 'products', 'public');

                    $existingCount = $product->images()->count();
                    $hasPrimary = $product->images()->where('is_primary', true)->exists();

                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_path' => $storedPath,
                        'alt_text' => is_array($product->name) ? ($product->name['id'] ?? $product->name['en'] ?? $product->sku) : (string) $product->name,
                        'sort_order' => $existingCount,
                        'is_primary' => ! $hasPrimary || $existingCount === 0,
                    ]);

                    // Aktifkan produk jika sebelumnya draft karena belum ada foto
                    if ($product->status === \App\Enums\ProductStatus::DRAFT) {
                        $product->updateQuietly(['status' => \App\Enums\ProductStatus::ACTIVE]);
                    }

                    // Sync Living Collection parents jika produk ini ditautkan
                    foreach ($product->parentProducts as $parent) {
                        if ($parent->isLivingCollection()) {
                            $parent->syncLivingCollectionImages();
                        }
                    }

                    $report['successful']++;
                    $updatedProductIds[$product->id] = is_array($product->name) ? ($product->name['id'] ?? $product->name['en'] ?? $product->sku) : (string) $product->name;
                } catch (\Throwable $e) {
                    Log::error("Bulk image upload error for {$filename}: ".$e->getMessage());
                    $report['failed']++;
                    $report['errors'][] = [
                        'filename' => $filename,
                        'message' => $e->getMessage(),
                    ];
                }
            }

            $report['updated_products'] = array_values($updatedProductIds);

            return response()->json([
                'success' => true,
                'message' => sprintf(
                    'Bulk image upload completed: %d successfully linked, %d skipped.',
                    $report['successful'],
                    $report['failed']
                ),
                'report' => $report,
            ]);
        } catch (\Throwable $e) {
            Log::error('Bulk image upload fatal error: '.$e->getMessage(), ['trace' => $e->getTraceAsString()]);

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        } finally {
            // Clean up extracted temp directory
            if ($tempDir && file_exists($tempDir)) {
                $this->deleteDirectory($tempDir);
            }
        }
    }

    /**
     * Resolve product from filename/context using direct matching, suffix stripping, and prefix fallback.
     *
     * @param  array<string, Product>  $skuMap
     * @param  array<string, Product>  $slugMap
     */
    private function resolveProductForFilename(string $filename, array $skuMap, array $slugMap, ?string $fallbackContext = null): ?Product
    {
        $rawName = pathinfo($filename, PATHINFO_FILENAME);
        $candidates = [$rawName];

        // If fallback context (e.g. parent folder name or zip archive name) is provided
        if ($fallbackContext !== null && $fallbackContext !== '') {
            $candidates[] = $fallbackContext;
            $candidates[] = $fallbackContext.'_'.$rawName;
        }

        foreach ($candidates as $candidate) {
            $normalizedRaw = strtolower(trim((string) $candidate));
            if ($normalizedRaw === '') {
                continue;
            }

            // 1. Direct exact match on SKU or Slug
            if (isset($skuMap[$normalizedRaw])) {
                return $skuMap[$normalizedRaw];
            }
            if (isset($slugMap[$normalizedRaw])) {
                return $slugMap[$normalizedRaw];
            }

            // 2. Strip suffixes like _1, _2, -front, -side, _detail, etc.
            $stripped = preg_replace('/[_\-]([0-9]+|side|front|back|top|bottom|detail|thumb|thumbnail|angle|preview)$/i', '', (string) $candidate);
            $normalizedStripped = strtolower(trim((string) $stripped));

            if ($normalizedStripped !== '') {
                if (isset($skuMap[$normalizedStripped])) {
                    return $skuMap[$normalizedStripped];
                }
                if (isset($slugMap[$normalizedStripped])) {
                    return $slugMap[$normalizedStripped];
                }
            }

            // 3. Prefix matching fallback: only if meaningful length (>= 3 chars)
            if (strlen($normalizedStripped) >= 3) {
                foreach ($skuMap as $skuKey => $prod) {
                    $skuStr = (string) $skuKey;
                    if (strlen($skuStr) >= 3) {
                        if (str_starts_with($normalizedStripped, $skuStr) || str_starts_with($skuStr, $normalizedStripped)) {
                            return $prod;
                        }
                    }
                }
            }
        }

        return null;
    }

    /**
     * Extract SKU prefix from image filename by stripping suffixes like _1, -side, etc.
     */
    private function extractSkuFromFilename(string $filename): string
    {
        $nameWithoutExt = pathinfo($filename, PATHINFO_FILENAME);

        // Strip common suffixes: _1, _2, -1, -2, _side, -front, _thumb, _detail, etc.
        $cleaned = preg_replace('/[_\-]([0-9]+|side|front|back|top|bottom|detail|thumb|angle|preview)$/i', '', $nameWithoutExt);

        return trim((string) $cleaned);
    }

    /**
     * Recursively delete a directory.
     */
    private function deleteDirectory(string $dir): void
    {
        if (! file_exists($dir)) {
            return;
        }

        $items = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($dir, \RecursiveDirectoryIterator::SKIP_DOTS),
            \RecursiveIteratorIterator::CHILD_FIRST
        );

        foreach ($items as $item) {
            if ($item->isDir()) {
                @rmdir($item->getRealPath());
            } else {
                @unlink($item->getRealPath());
            }
        }

        @rmdir($dir);
    }
}
