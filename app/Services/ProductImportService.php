<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\ProductStatus;
use App\Enums\SaleType;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Exception;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Writer\Csv;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Throwable;

class ProductImportService
{
    /**
     * Column field mappings with aliases/synonyms in Indonesian & English.
     *
     * @var array<string, array<int, string>>
     */
    private const FIELD_ALIASES = [
        'sku' => ['sku', 'kode', 'kode_produk', 'kode_barang', 'product_code'],
        'name' => ['name', 'nama', 'nama_produk', 'product_name', 'title', 'judul'],
        'category' => ['category', 'kategori', 'kategori_produk', 'category_name'],
        'price' => ['price', 'harga', 'harga_jual', 'selling_price', 'price_idr'],
        'compare_price' => ['compare_price', 'harga_coret', 'harga_asli', 'original_price', 'harga_sebelum_diskon'],
        'cost_price' => ['cost_price', 'harga_modal', 'modal', 'hpp'],
        'stock_quantity' => ['stock_quantity', 'stock', 'stok', 'qty', 'quantity', 'jumlah_stok'],
        'material' => ['material', 'bahan', 'material_furniture'],
        'color' => ['color', 'warna', 'colour'],
        'weight' => ['weight', 'berat', 'berat_kg', 'weight_kg'],
        'length' => ['length', 'panjang', 'panjang_cm', 'length_cm'],
        'width' => ['width', 'lebar', 'lebar_cm', 'width_cm'],
        'height' => ['height', 'tinggi', 'tinggi_cm', 'height_cm'],
        'short_description' => ['short_description', 'deskripsi_singkat', 'ringkasan', 'summary'],
        'description' => ['description', 'deskripsi', 'detail', 'keterangan'],
        'status' => ['status', 'status_produk'],
        'sale_type' => ['sale_type', 'tipe_penjualan', 'jenis_diskon', 'promo_type'],
        'discount_percentage' => ['discount_percentage', 'discount', 'diskon', 'persen_diskon', 'potongan'],
        'is_featured' => ['is_featured', 'featured', 'unggulan', 'produk_unggulan'],
        'is_new_arrival' => ['is_new_arrival', 'new_arrival', 'produk_baru', 'baru'],
        'image_urls' => ['image_urls', 'images', 'foto', 'gambar', 'url_gambar', 'image_url', 'photos'],
    ];

    /**
     * Generate template spreadsheet with styling, notes, and sample data.
     */
    public function generateTemplate(string $format = 'xlsx'): string
    {
        $spreadsheet = new Spreadsheet;
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Template Import Produk');

        $headers = [
            'sku' => 'SKU (Opsional)',
            'name' => 'Nama Produk *',
            'category' => 'Kategori *',
            'price' => 'Harga (Rp) *',
            'compare_price' => 'Harga Coret (Rp)',
            'cost_price' => 'Harga Modal (Rp)',
            'stock_quantity' => 'Stok',
            'material' => 'Material',
            'color' => 'Warna',
            'weight' => 'Berat (kg)',
            'length' => 'Panjang (cm)',
            'width' => 'Lebar (cm)',
            'height' => 'Tinggi (cm)',
            'short_description' => 'Deskripsi Singkat',
            'description' => 'Deskripsi Lengkap',
            'status' => 'Status (active/draft)',
            'sale_type' => 'Tipe Penjualan',
            'discount_percentage' => 'Diskon (%)',
            'is_featured' => 'Unggulan (1/0)',
            'is_new_arrival' => 'Produk Baru (1/0)',
            'image_urls' => 'URL Foto (Pisahkan ;)',
        ];

        // Header Row
        $colIndex = 1;
        foreach ($headers as $headerKey => $headerLabel) {
            $colLetter = Coordinate::stringFromColumnIndex($colIndex);
            $sheet->setCellValue("{$colLetter}1", $headerKey);
            $sheet->getComment("{$colLetter}1")->getText()->createTextRun($headerLabel);
            $colIndex++;
        }

        // Style Header
        $highestColumn = Coordinate::stringFromColumnIndex(count($headers));
        $headerRange = "A1:{$highestColumn}1";
        $sheet->getStyle($headerRange)->applyFromArray([
            'font' => [
                'bold' => true,
                'color' => ['rgb' => 'FFFFFF'],
                'size' => 11,
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => '7A2E1E'], // Terra / Ronica Brand color
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => 'D4C5B9'],
                ],
            ],
        ]);
        $sheet->getRowDimension(1)->setRowHeight(28);

        // Sample Data Rows
        $samples = [
            [
                'sku' => 'SFA-001',
                'name' => 'Sofa Minimalis 3 Seater Grey',
                'category' => 'Sofa & Bench',
                'price' => 4500000,
                'compare_price' => 5200000,
                'cost_price' => 2800000,
                'stock_quantity' => 12,
                'material' => 'Kayu Jati Solid, Kain Fabric',
                'color' => 'Abu-abu Charcoal',
                'weight' => 45.0,
                'length' => 210,
                'width' => 85,
                'height' => 80,
                'short_description' => 'Sofa 3 seater elegan dengan rangka kayu jati pilihan dan busa empuk tahan lama.',
                'description' => 'Sofa minimalis berkonsep skandinavia dengan bahan kain premium dan bantalan ergonomis. Cocok untuk mempercantik ruang tamu modern.',
                'status' => 'active',
                'sale_type' => 'regular',
                'discount_percentage' => 0,
                'is_featured' => 1,
                'is_new_arrival' => 1,
                'image_urls' => 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
            ],
            [
                'sku' => 'TBL-DIN-002',
                'name' => 'Meja Makan Jati Scandinavian 6 Kursi',
                'category' => 'Dining Sets',
                'price' => 8200000,
                'compare_price' => 9500000,
                'cost_price' => 5100000,
                'stock_quantity' => 8,
                'material' => '100% Solid Teak Wood',
                'color' => 'Natural Wood Walnut',
                'weight' => 65.0,
                'length' => 180,
                'width' => 90,
                'height' => 76,
                'short_description' => 'Set meja makan jati solid dengan finishing natural melamine yang halus dan anti gores.',
                'description' => 'Meja makan bernuansa hangat dengan konstruksi kayu jati utuh, dikerjakan pengrajin berpengalaman. Sudah termasuk 6 kursi yang serasi.',
                'status' => 'active',
                'sale_type' => 'hot_sale',
                'discount_percentage' => 10,
                'is_featured' => 1,
                'is_new_arrival' => 0,
                'image_urls' => 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800',
            ],
            [
                'sku' => 'CHR-ARM-003',
                'name' => 'Armchair Lounge Rotan Sintetis',
                'category' => 'Chairs',
                'price' => 1850000,
                'compare_price' => 2200000,
                'cost_price' => 1100000,
                'stock_quantity' => 20,
                'material' => 'Rotan Sintetis UV-Resistant & Alumunium',
                'color' => 'Beige Sandy',
                'weight' => 12.5,
                'length' => 75,
                'width' => 70,
                'height' => 85,
                'short_description' => 'Kursi santai outdoor rotan sintetis yang tahan terhadap cuaca panas dan hujan.',
                'description' => 'Armchair stylish cocok untuk teras, kolam renang, maupun ruang keluarga. Rangka alumunium kokoh, ringan dan anti karat.',
                'status' => 'active',
                'sale_type' => 'regular',
                'discount_percentage' => 0,
                'is_featured' => 0,
                'is_new_arrival' => 1,
                'image_urls' => '',
            ],
        ];

        $rowIndex = 2;
        $keys = array_keys($headers);
        foreach ($samples as $sample) {
            $col = 1;
            foreach ($keys as $key) {
                $colLetter = Coordinate::stringFromColumnIndex($col);
                $val = $sample[$key] ?? '';
                $sheet->setCellValue("{$colLetter}{$rowIndex}", $val);
                $col++;
            }
            $rowIndex++;
        }

        // Auto-size columns
        for ($i = 1; $i <= count($headers); $i++) {
            $colLetter = Coordinate::stringFromColumnIndex($i);
            $sheet->getColumnDimension($colLetter)->setAutoSize(true);
        }

        // Save to temp file
        $tempDir = storage_path('app/temp');
        if (! file_exists($tempDir)) {
            mkdir($tempDir, 0755, true);
        }

        $format = strtolower($format);
        if ($format === 'csv') {
            $fileName = 'ronica_template_produk.csv';
            $filePath = $tempDir.'/'.$fileName;
            $writer = new Csv($spreadsheet);
            $writer->setUseBOM(true);
            $writer->save($filePath);
        } else {
            $fileName = 'ronica_template_produk.xlsx';
            $filePath = $tempDir.'/'.$fileName;
            $writer = new Xlsx($spreadsheet);
            $writer->save($filePath);
        }

        return $filePath;
    }

    /**
     * Import products from uploaded file or file path.
     *
     * @return array{
     *     total_rows: int,
     *     imported: int,
     *     updated: int,
     *     skipped: int,
     *     errors: array<int, array{row: int, sku: string, message: string}>
     * }
     */
    public function import(UploadedFile|string $file, bool $updateExisting = false): array
    {
        $realPath = $file instanceof UploadedFile ? $file->getRealPath() : $file;

        if (! $realPath || ! file_exists($realPath)) {
            throw new Exception('File import tidak ditemukan atau tidak dapat dibaca.');
        }

        $spreadsheet = IOFactory::load($realPath);
        $sheet = $spreadsheet->getActiveSheet();
        $rawRows = $sheet->toArray(null, true, true, true);

        if (empty($rawRows) || count($rawRows) < 2) {
            throw new Exception('File Excel kosong atau tidak memiliki baris data.');
        }

        // 1. Identify header mapping
        $headerRow = array_shift($rawRows);
        $columnMapping = $this->mapHeaders($headerRow);

        if (! isset($columnMapping['name'])) {
            throw new Exception("Kolom 'name' atau 'Nama Produk' wajib ada pada file spreadsheet.");
        }

        $report = [
            'total_rows' => 0,
            'imported' => 0,
            'updated' => 0,
            'skipped' => 0,
            'errors' => [],
        ];

        $rowNumber = 1; // starts at 2 after header
        foreach ($rawRows as $row) {
            $rowNumber++;

            // Extract row values based on column map
            $data = [];
            foreach ($columnMapping as $field => $colLetter) {
                $val = $row[$colLetter] ?? null;
                $data[$field] = is_string($val) ? trim($val) : $val;
            }

            // Skip completely empty rows
            if ($this->isRowEmpty($data)) {
                continue;
            }

            $report['total_rows']++;
            $sku = (string) ($data['sku'] ?? '');
            $name = (string) ($data['name'] ?? '');

            if (empty($name)) {
                $report['skipped']++;
                $report['errors'][] = [
                    'row' => $rowNumber,
                    'sku' => $sku ?: '-',
                    'message' => 'Nama produk kosong pada baris ini.',
                ];

                continue;
            }

            try {
                $result = $this->processRow($data, $updateExisting);
                if ($result === 'imported') {
                    $report['imported']++;
                } elseif ($result === 'updated') {
                    $report['updated']++;
                } else {
                    $report['skipped']++;
                }
            } catch (Throwable $e) {
                Log::error("Error importing product at row {$rowNumber}: ".$e->getMessage(), [
                    'row' => $data,
                    'trace' => $e->getTraceAsString(),
                ]);

                $report['errors'][] = [
                    'row' => $rowNumber,
                    'sku' => $sku ?: '-',
                    'message' => $e->getMessage(),
                ];
                $report['skipped']++;
            }
        }

        return $report;
    }

    /**
     * Map spreadsheet header row to recognized field names using alias lookup.
     *
     * @param  array<string, mixed>  $headerRow
     * @return array<string, string> Key is field name, Value is column letter (e.g. 'name' => 'B')
     */
    private function mapHeaders(array $headerRow): array
    {
        $mapping = [];

        foreach ($headerRow as $colLetter => $rawHeader) {
            if (! is_string($rawHeader) || trim($rawHeader) === '') {
                continue;
            }

            // Normalize header text (lowercase, remove asterisks and symbols)
            $cleanHeader = strtolower(trim($rawHeader));
            $cleanHeader = preg_replace('/[\(\)\*\#\:\_\-\s]+/', '_', $cleanHeader);
            $cleanHeader = trim($cleanHeader, '_');

            foreach (self::FIELD_ALIASES as $field => $aliases) {
                if (in_array($cleanHeader, $aliases, true)) {
                    $mapping[$field] = $colLetter;
                    break;
                }
            }
        }

        return $mapping;
    }

    /**
     * Check if extracted row data is empty.
     *
     * @param  array<string, mixed>  $data
     */
    private function isRowEmpty(array $data): bool
    {
        foreach ($data as $val) {
            if ($val !== null && $val !== '') {
                return false;
            }
        }

        return true;
    }

    /**
     * Process a single product record.
     *
     * @param  array<string, mixed>  $data
     * @return 'imported'|'updated'|'skipped'
     */
    private function processRow(array $data, bool $updateExisting): string
    {
        $name = (string) ($data['name'] ?? '');
        $sku = (string) ($data['sku'] ?? '');

        // 1. Check existing product by SKU or Name
        /** @var Product|null $existing */
        $existing = null;
        if (! empty($sku)) {
            $existing = Product::where('sku', $sku)->first();
        }

        if (! $existing) {
            $existing = Product::where('name->id', $name)
                ->orWhere('name->en', $name)
                ->first();
        }

        if ($existing && ! $updateExisting) {
            return 'skipped';
        }

        // 2. Resolve Category
        $categoryName = (string) ($data['category'] ?? 'General');
        $category = $this->resolveCategory($categoryName);

        // 3. Format numeric values
        $price = $this->parseInteger($data['price'] ?? 0);
        $comparePrice = ! empty($data['compare_price']) ? $this->parseInteger($data['compare_price']) : null;
        $costPrice = ! empty($data['cost_price']) ? $this->parseInteger($data['cost_price']) : null;
        $stockQuantity = $this->parseInteger($data['stock_quantity'] ?? 0);
        $discountPct = ! empty($data['discount_percentage']) ? (int) $data['discount_percentage'] : null;

        // 4. Status and SaleType enums
        $rawStatus = strtolower((string) ($data['status'] ?? 'active'));
        $status = match ($rawStatus) {
            'draft' => ProductStatus::DRAFT,
            'inactive' => ProductStatus::INACTIVE,
            'out_of_stock' => ProductStatus::OUT_OF_STOCK,
            'discontinued' => ProductStatus::DISCONTINUED,
            default => ProductStatus::ACTIVE,
        };

        $rawSaleType = strtolower((string) ($data['sale_type'] ?? 'regular'));
        $saleType = match ($rawSaleType) {
            'clearance' => SaleType::CLEARANCE,
            'stock_sale' => SaleType::STOCK_SALE,
            'custom' => SaleType::CUSTOM,
            'hot_sale' => SaleType::HOT_SALE,
            default => SaleType::REGULAR,
        };

        // 5. Generate SKU if missing
        if (empty($sku)) {
            $sku = $existing?->sku ?: $this->generateUniqueSku($categoryName);
        }

        // 6. Descriptions & translatable texts
        $shortDesc = (string) ($data['short_description'] ?? '');
        $desc = (string) ($data['description'] ?? '');
        $material = ! empty($data['material']) ? (string) $data['material'] : null;
        $color = ! empty($data['color']) ? (string) $data['color'] : null;

        $productPayload = [
            'category_id' => $category->id,
            'sku' => $sku,
            'name' => ['id' => $name, 'en' => $name],
            'short_description' => ['id' => $shortDesc, 'en' => $shortDesc],
            'description' => ['id' => $desc, 'en' => $desc],
            'price' => $price,
            'compare_price' => $comparePrice,
            'cost_price' => $costPrice,
            'stock_quantity' => $stockQuantity,
            'low_stock_threshold' => 5,
            'track_stock' => true,
            'weight' => ! empty($data['weight']) ? (float) $data['weight'] : null,
            'length' => ! empty($data['length']) ? (float) $data['length'] : null,
            'width' => ! empty($data['width']) ? (float) $data['width'] : null,
            'height' => ! empty($data['height']) ? (float) $data['height'] : null,
            'material' => $material ? ['id' => $material, 'en' => $material] : null,
            'color' => $color ? ['id' => $color, 'en' => $color] : null,
            'status' => $status,
            'sale_type' => $saleType,
            'is_featured' => ! empty($data['is_featured']) && (bool) $data['is_featured'],
            'is_new_arrival' => ! empty($data['is_new_arrival']) && (bool) $data['is_new_arrival'],
            'discount_percentage' => $discountPct,
            'discount_starts_at' => $discountPct ? now() : null,
            'discount_ends_at' => $discountPct ? now()->addDays(30) : null,
        ];

        return DB::transaction(function () use ($existing, $productPayload, $data) {
            if ($existing) {
                $existing->update($productPayload);
                $product = $existing;
                $actionType = 'updated';
            } else {
                $productPayload['slug'] = Str::slug($productPayload['name']['id']).'-'.Str::random(5);
                /** @var Product $product */
                $product = Product::create($productPayload);
                $actionType = 'imported';
            }

            // 7. Handle Image URLs
            if (! empty($data['image_urls'])) {
                $this->attachImagesFromUrls($product, (string) $data['image_urls']);
            }

            return $actionType;
        });
    }

    /**
     * Resolve existing category or create a new one.
     */
    private function resolveCategory(string $categoryName): Category
    {
        $categoryName = trim($categoryName);
        if ($categoryName === '') {
            $categoryName = 'General';
        }

        $slug = Str::slug($categoryName);

        /** @var Category|null $category */
        $category = Category::where('slug', $slug)
            ->orWhere('name->id', $categoryName)
            ->orWhere('name->en', $categoryName)
            ->first();

        if (! $category) {
            $category = Category::create([
                'name' => ['id' => $categoryName, 'en' => $categoryName],
                'slug' => $slug,
                'is_active' => true,
                'is_featured' => false,
                'sort_order' => 10,
            ]);
        }

        return $category;
    }

    /**
     * Download and attach images from comma or semicolon separated URLs.
     */
    private function attachImagesFromUrls(Product $product, string $rawUrls): void
    {
        $urls = preg_split('/[;,\|]+/', $rawUrls);
        if (! $urls) {
            return;
        }

        $startIndex = $product->images()->count();

        foreach ($urls as $index => $url) {
            $url = trim($url);
            if (empty($url) || ! filter_var($url, FILTER_VALIDATE_URL)) {
                continue;
            }

            try {
                $response = Http::timeout(10)
                    ->withHeaders(['User-Agent' => 'Mozilla/5.0'])
                    ->get($url);

                if (! $response->successful()) {
                    continue;
                }

                $tempPath = tempnam(sys_get_temp_dir(), 'ronica_img_');
                if (! $tempPath) {
                    continue;
                }

                file_put_contents($tempPath, $response->body());

                // Store with ImageService ensuring 1:1 square canvas & white background
                $storedPath = ImageService::storeWithWhiteBackground($tempPath, 'products', 'public');
                @unlink($tempPath);

                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => $storedPath,
                    'alt_text' => $product->name,
                    'sort_order' => $startIndex + $index,
                    'is_primary' => ($startIndex + $index) === 0,
                ]);
            } catch (Throwable $e) {
                Log::warning("Gagal mengunduh gambar untuk produk {$product->sku} dari {$url}: ".$e->getMessage());
            }
        }
    }

    /**
     * Generate unique SKU.
     */
    private function generateUniqueSku(string $categoryName): string
    {
        $prefix = strtoupper(substr(preg_replace('/[^A-Za-z]/', '', $categoryName) ?: 'RON', 0, 3));

        do {
            $sku = sprintf('%s-%s', $prefix, strtoupper(Str::random(5)));
        } while (Product::where('sku', $sku)->exists());

        return $sku;
    }

    /**
     * Parse integer from dirty string (e.g. "Rp 4.500.000,00" -> 4500000).
     */
    private function parseInteger(mixed $value): int
    {
        if (is_int($value)) {
            return $value;
        }

        if (is_float($value)) {
            return (int) round($value);
        }

        $str = (string) $value;
        // Remove "Rp", dots, spaces
        $str = preg_replace('/[^\d]/', '', $str);

        return (int) $str;
    }
}
