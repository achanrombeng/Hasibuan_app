<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\ProductStatus;
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
        'category' => ['category', 'kategori', 'kategori_produk', 'category_name', 'nama_kategori'],
        'material' => ['material', 'bahan', 'material_furniture', 'bahan_baku'],
        'color' => ['color', 'warna', 'colour'],
        'weight' => ['weight', 'berat', 'berat_kg', 'weight_kg'],
        'length' => ['length', 'panjang', 'panjang_cm', 'length_cm'],
        'width' => ['width', 'lebar', 'lebar_cm', 'width_cm'],
        'height' => ['height', 'tinggi', 'tinggi_cm', 'height_cm'],
        'short_description' => ['short_description', 'deskripsi_singkat', 'ringkasan', 'summary'],
        'description' => ['description', 'deskripsi', 'detail', 'keterangan', 'deskripsi_lengkap'],
        'status' => ['status', 'status_produk'],
        'is_featured' => ['is_featured', 'featured', 'unggulan', 'produk_unggulan'],
        'is_new_arrival' => ['is_new_arrival', 'new_arrival', 'produk_baru', 'baru'],
        'image_urls' => ['image_urls', 'images', 'foto', 'gambar', 'url_gambar', 'image_url', 'photos', 'url_foto'],
    ];

    /**
     * Generate template spreadsheet with styling, notes, sample data, and instructions.
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
            'material' => 'Material / Bahan',
            'color' => 'Warna',
            'weight' => 'Berat (kg)',
            'length' => 'Panjang (cm)',
            'width' => 'Lebar (cm)',
            'height' => 'Tinggi (cm)',
            'short_description' => 'Deskripsi Singkat',
            'description' => 'Deskripsi Lengkap',
            'status' => 'Status (active/draft)',
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
                'material' => 'Kayu Jati Solid, Kain Fabric',
                'color' => 'Abu-abu Charcoal',
                'weight' => 45.0,
                'length' => 210,
                'width' => 85,
                'height' => 80,
                'short_description' => 'Sofa 3 seater elegan dengan rangka kayu jati pilihan dan busa empuk tahan lama.',
                'description' => 'Sofa minimalis berkonsep skandinavia dengan bahan kain premium dan bantalan ergonomis. Cocok untuk mempercantik ruang tamu modern.',
                'status' => 'active',
                'is_featured' => 1,
                'is_new_arrival' => 1,
                'image_urls' => 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
            ],
            [
                'sku' => 'TBL-DIN-002',
                'name' => 'Meja Makan Jati Scandinavian 6 Kursi',
                'category' => 'Dining Sets',
                'material' => '100% Solid Teak Wood',
                'color' => 'Natural Wood Walnut',
                'weight' => 65.0,
                'length' => 180,
                'width' => 90,
                'height' => 76,
                'short_description' => 'Set meja makan jati solid dengan finishing natural melamine yang halus dan anti gores.',
                'description' => 'Meja makan bernuansa hangat dengan konstruksi kayu jati utuh, dikerjakan pengrajin berpengalaman. Sudah termasuk 6 kursi yang serasi.',
                'status' => 'active',
                'is_featured' => 1,
                'is_new_arrival' => 0,
                'image_urls' => 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800',
            ],
            [
                'sku' => 'CHR-ARM-003',
                'name' => 'Armchair Lounge Rotan Sintetis',
                'category' => 'Chairs',
                'material' => 'Rotan Sintetis UV-Resistant & Alumunium',
                'color' => 'Beige Sandy',
                'weight' => 12.5,
                'length' => 75,
                'width' => 70,
                'height' => 85,
                'short_description' => 'Kursi santai outdoor rotan sintetis yang tahan terhadap cuaca panas dan hujan.',
                'description' => 'Armchair stylish cocok untuk teras, kolam renang, maupun ruang keluarga. Rangka alumunium kokoh, ringan dan anti karat.',
                'status' => 'active',
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
            $sheet->getRowDimension($rowIndex)->setRowHeight(22);
            $rowIndex++;
        }

        // Auto-size columns
        foreach (range(1, count($headers)) as $colIndex) {
            $colLetter = Coordinate::stringFromColumnIndex($colIndex);
            $sheet->getColumnDimension($colLetter)->setAutoSize(true);
        }

        // Zebra striping for samples
        $dataRange = "A2:{$highestColumn}".(count($samples) + 1);
        $sheet->getStyle($dataRange)->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => 'E5E7EB'],
                ],
            ],
            'alignment' => [
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
        ]);

        // Add instructions guide sheet for XLSX format
        if ($format === 'xlsx') {
            $guideSheet = $spreadsheet->createSheet();
            $guideSheet->setTitle('Petunjuk Pengisian');

            $guideHeaders = ['Nama Kolom', 'Keterangan', 'Wajib / Opsional', 'Contoh Nilai'];
            foreach ($guideHeaders as $gIdx => $gTitle) {
                $gCol = Coordinate::stringFromColumnIndex($gIdx + 1);
                $guideSheet->setCellValue("{$gCol}1", $gTitle);
            }

            $guideSheet->getStyle('A1:D1')->applyFromArray([
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '7A2E1E']],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
            ]);
            $guideSheet->getRowDimension(1)->setRowHeight(26);

            $guideRows = [
                ['sku', 'Kode unik produk. Jika dikosongkan, sistem akan otomatis menghasilkan SKU unik.', 'Opsional', 'SFA-001'],
                ['name', 'Nama lengkap produk furniture.', 'Wajib', 'Sofa Minimalis 3 Seater Grey'],
                ['category', 'Nama kategori produk. Jika belum ada di sistem, kategori akan dibuat otomatis.', 'Wajib', 'Sofa & Bench'],
                ['material', 'Jenis bahan / material utama.', 'Opsional', 'Kayu Jati Solid, Kain Fabric'],
                ['color', 'Warna produk.', 'Opsional', 'Abu-abu Charcoal'],
                ['weight', 'Berat produk dalam kilogram (kg).', 'Opsional', '45.0'],
                ['length', 'Panjang dimensi produk dalam centimeter (cm).', 'Opsional', '210'],
                ['width', 'Lebar dimensi produk dalam centimeter (cm).', 'Opsional', '85'],
                ['height', 'Tinggi dimensi produk dalam centimeter (cm).', 'Opsional', '80'],
                ['short_description', 'Ringkasan singkat tentang keunggulan produk.', 'Opsional', 'Sofa 3 seater elegan berangka jati solid...'],
                ['description', 'Deskripsi detail spesifikasi dan kegunaan produk.', 'Opsional', 'Sofa minimalis berkonsep skandinavia...'],
                ['status', 'Status tayang produk: active atau draft.', 'Opsional (Default: active)', 'active'],
                ['is_featured', 'Tandai sebagai produk unggulan (1 = Ya, 0 = Tidak).', 'Opsional (Default: 0)', '1'],
                ['is_new_arrival', 'Tandai sebagai produk baru (1 = Ya, 0 = Tidak).', 'Opsional (Default: 0)', '1'],
                ['image_urls', 'Link URL foto produk di internet. Pisahkan dengan tanda titik koma (;) jika lebih dari 1 foto.', 'Opsional', 'https://example.com/img1.jpg;https://example.com/img2.jpg'],
            ];

            $gRowNum = 2;
            foreach ($guideRows as $gRow) {
                foreach ($gRow as $gColIdx => $gVal) {
                    $gCol = Coordinate::stringFromColumnIndex($gColIdx + 1);
                    $guideSheet->setCellValue("{$gCol}{$gRowNum}", $gVal);
                }
                $guideSheet->getRowDimension($gRowNum)->setRowHeight(20);
                $gRowNum++;
            }

            $guideRange = 'A2:D'.(count($guideRows) + 1);
            $guideSheet->getStyle($guideRange)->applyFromArray([
                'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'E5E7EB']]],
                'alignment' => ['vertical' => Alignment::VERTICAL_CENTER],
            ]);

            foreach (range(1, 4) as $colIdx) {
                $gCol = Coordinate::stringFromColumnIndex($colIdx);
                $guideSheet->getColumnDimension($gCol)->setAutoSize(true);
            }

            // Set the first sheet as active by default
            $spreadsheet->setActiveSheetIndex(0);
        }

        $filename = 'template-import-produk-'.date('YmdHis');

        if ($format === 'csv') {
            $writer = new Csv($spreadsheet);
            $writer->setDelimiter(',');
            $writer->setEnclosure('"');
            $writer->setLineEnding("\r\n");
            $writer->setSheetIndex(0);
            $path = storage_path("app/{$filename}.csv");
            $writer->save($path);

            return $path;
        }

        $writer = new Xlsx($spreadsheet);
        $path = storage_path("app/{$filename}.xlsx");
        $writer->save($path);

        return $path;
    }

    /**
     * Preview an uploaded spreadsheet without writing to the database.
     *
     * @return array{
     *     headers: array<string, string>,
     *     rows: array<int, array<string, mixed>>,
     *     total: int,
     *     valid_count: int,
     *     invalid_count: int,
     *     categories_found: array<int, string>,
     *     sample_errors: array<int, string>
     * }
     */
    public function preview(UploadedFile $file): array
    {
        $spreadsheet = IOFactory::load($file->getRealPath());
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray(null, true, true, true);

        if (empty($rows)) {
            throw new Exception('File kosong atau tidak dapat dibaca.');
        }

        // Row 1 is header
        $headerRow = array_shift($rows);
        $columnMap = $this->determineColumnMapping($headerRow);

        if (! isset($columnMap['name'])) {
            throw new Exception("Kolom 'name' / 'nama_produk' tidak ditemukan pada header file.");
        }

        $parsedRows = [];
        $validCount = 0;
        $invalidCount = 0;
        $categoriesFound = [];
        $sampleErrors = [];

        $rowNum = 1;
        foreach ($rows as $row) {
            $rowNum++;

            $rowData = [];
            foreach ($columnMap as $fieldKey => $colLetter) {
                $rowData[$fieldKey] = $row[$colLetter] ?? null;
            }

            if ($this->isRowEmpty($rowData)) {
                continue;
            }

            // Validation check
            $errors = [];
            if (empty($rowData['name'])) {
                $errors[] = 'Nama produk wajib diisi';
            }

            $category = (string) ($rowData['category'] ?? '');
            if (! empty($category)) {
                $categoriesFound[$category] = true;
            }

            $isValid = empty($errors);
            if ($isValid) {
                $validCount++;
            } else {
                $invalidCount++;
                if (count($sampleErrors) < 5) {
                    $sampleErrors[] = "Baris {$rowNum}: ".implode(', ', $errors);
                }
            }

            $parsedRows[] = array_merge($rowData, [
                '_row' => $rowNum,
                '_is_valid' => $isValid,
                '_errors' => $errors,
            ]);
        }

        return [
            'headers' => array_flip($columnMap),
            'rows' => array_slice($parsedRows, 0, 100), // Max 100 rows for preview UI
            'total' => count($parsedRows),
            'valid_count' => $validCount,
            'invalid_count' => $invalidCount,
            'categories_found' => array_keys($categoriesFound),
            'sample_errors' => $sampleErrors,
        ];
    }

    /**
     * Map spreadsheet column letters to internal field names based on fuzzy matching.
     *
     * @param  array<string, mixed>  $headerRow
     * @return array<string, string> Field name => Column letter
     */
    private function determineColumnMapping(array $headerRow): array
    {
        $map = [];

        foreach ($headerRow as $colLetter => $headerText) {
            if (empty($headerText) || ! is_string($headerText)) {
                continue;
            }

            $cleanHeader = strtolower(trim($headerText));
            // Remove special characters, accents, and extra spaces
            $cleanHeader = preg_replace('/[^a-z0-9_]/', '_', $cleanHeader) ?? $cleanHeader;
            $cleanHeader = trim($cleanHeader, '_');

            foreach (self::FIELD_ALIASES as $fieldKey => $fieldAliases) {
                if (in_array($cleanHeader, $fieldAliases, true) || $cleanHeader === $fieldKey) {
                    $map[$fieldKey] = $colLetter;
                    break;
                }
            }
        }

        return $map;
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
        $columnMapping = $this->determineColumnMapping($headerRow);

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
     * Check if a data row is completely empty.
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

        // 3. Status enum
        $rawStatus = strtolower((string) ($data['status'] ?? 'active'));
        $status = match ($rawStatus) {
            'draft' => ProductStatus::DRAFT,
            'inactive' => ProductStatus::INACTIVE,
            'out_of_stock' => ProductStatus::OUT_OF_STOCK,
            'discontinued' => ProductStatus::DISCONTINUED,
            default => ProductStatus::ACTIVE,
        };

        // 4. Generate SKU if missing
        if (empty($sku)) {
            $sku = $existing?->sku ?: $this->generateUniqueSku($categoryName);
        }

        // 5. Descriptions & translatable texts
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
            'low_stock_threshold' => 5,
            'track_stock' => true,
            'weight' => ! empty($data['weight']) ? (float) $data['weight'] : null,
            'length' => ! empty($data['length']) ? (float) $data['length'] : null,
            'width' => ! empty($data['width']) ? (float) $data['width'] : null,
            'height' => ! empty($data['height']) ? (float) $data['height'] : null,
            'material' => $material ? ['id' => $material, 'en' => $material] : null,
            'color' => $color ? ['id' => $color, 'en' => $color] : null,
            'status' => $status,
            'is_featured' => ! empty($data['is_featured']) && (bool) $data['is_featured'],
            'is_new_arrival' => ! empty($data['is_new_arrival']) && (bool) $data['is_new_arrival'],
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
