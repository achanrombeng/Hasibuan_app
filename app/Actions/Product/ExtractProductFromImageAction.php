<?php

declare(strict_types=1);

namespace App\Actions\Product;

use App\Exceptions\NonFurnitureImageException;
use App\Models\Category;
use App\Models\Product;
use App\Models\Setting;
use App\Services\Ai\GeminiVisionService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class ExtractProductFromImageAction
{
    private const MAX_SKU_ATTEMPTS = 5;

    private const MAX_IMAGES = 5;

    public function __construct(private readonly GeminiVisionService $vision) {}

    /**
     * Analyse one or more product images and return draft form data ready to fill.
     *
     * @param  array<int, UploadedFile>  $images  Primary image first; additional angles boost accuracy.
     * @param  array<string, mixed>  $context  Fields the user has already filled; used as prompt hints.
     * @return array<string, mixed>
     *
     * @throws NonFurnitureImageException when the image content is not furniture.
     */
    public function execute(array $images, array $context = []): array
    {
        $images = array_slice(array_values($images), 0, self::MAX_IMAGES);

        $categories = Category::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn (Category $c) => $c->getTranslation('name', app()->getLocale(), false) ?: $c->name)
            ->all();

        $model = Setting::get('ai_model', '') ?: null;
        $temperature = max(0.0, min(1.0, (float) (Setting::get('ai_temperature', '') ?: '0.4')));

        $extracted = $this->vision->generateJsonFromImages(
            images: $images,
            prompt: $this->buildPrompt($categories, $this->contextHints($context)),
            jsonSchema: $this->responseSchema(),
            model: $model,
            temperature: $temperature,
        );

        if (! (bool) ($extracted['is_furniture'] ?? false)) {
            $reason = trim((string) ($extracted['rejection_reason'] ?? ''));
            throw new NonFurnitureImageException(
                $reason !== ''
                    ? "Gambar ditolak: {$reason}"
                    : 'Gambar yang diunggah bukan furnitur. Silakan unggah foto produk furnitur.'
            );
        }

        $categoryId = $this->resolveCategoryId((string) ($extracted['category'] ?? ''));
        $categoryName = $categoryId
            ? (string) Category::query()->find($categoryId)?->name
            : '';

        return [
            'name' => (string) ($extracted['name'] ?? ''),
            'sku' => $this->generateUniqueSku($categoryName ?: ($extracted['name'] ?? '')),
            'category_id' => $categoryId ? (string) $categoryId : '',
            'description' => (string) ($extracted['description'] ?? ''),
            'short_description' => Str::limit((string) ($extracted['description'] ?? ''), 280, ''),
            'price' => $this->normaliseInteger($extracted['price_idr'] ?? null),
            'compare_price' => $this->normaliseInteger($extracted['compare_price_idr'] ?? null),
            'cost_price' => $this->normaliseInteger($extracted['cost_price_idr'] ?? null),
            'stock_quantity' => $this->normaliseInteger($extracted['stock_quantity'] ?? null),
            'weight' => $this->normaliseNumeric($extracted['weight_kg'] ?? null, 0.01, 2),
            'length' => $this->normaliseNumeric($extracted['length_cm'] ?? null, 0.1, 2),
            'width' => $this->normaliseNumeric($extracted['width_cm'] ?? null, 0.1, 2),
            'height' => $this->normaliseNumeric($extracted['height_cm'] ?? null, 0.1, 2),
            'shipping_class' => $this->resolveShippingClass((string) ($extracted['shipping_class'] ?? '')),
            'material' => Str::limit((string) ($extracted['material'] ?? ''), 100, ''),
            'color' => Str::limit((string) ($extracted['color'] ?? ''), 50, ''),
            'meta_title' => Str::limit((string) ($extracted['meta_title'] ?? $extracted['name'] ?? ''), 60, ''),
            'meta_description' => Str::limit((string) ($extracted['meta_description'] ?? ''), 160, ''),
            'meta_keywords' => $this->normaliseKeywords($extracted['meta_keywords'] ?? null),
            'specifications' => $this->normaliseSpecifications($extracted['specifications'] ?? null),
        ];
    }

    /**
     * @param  array<int, string>  $categories
     * @param  array<int, string>  $contextHints  Pre-filled field hints in "label: value" form.
     */
    private function buildPrompt(array $categories, array $contextHints): string
    {
        $categoryList = implode(', ', $categories) ?: '(belum ada kategori terdaftar)';

        $contextBlock = '';
        if ($contextHints !== []) {
            $joined = implode("\n- ", $contextHints);
            $contextBlock = "\n\nPengguna sudah mengisi sebagian informasi sebagai acuan. Perlakukan sebagai fakta yang benar dan pastikan output Anda KONSISTEN dengannya:\n- {$joined}\n\nUntuk field di atas, Anda tetap harus mengembalikan nilai JSON agar struktur lengkap, tetapi gunakan nilai referensi tersebut (atau versi yang kompatibel) — jangan bertentangan. Untuk field yang belum diisi pengguna, ekstrak dari gambar dengan mempertimbangkan konteks ini.";
        }

        $template = Setting::get('ai_prompt_template', '') ?: self::defaultPromptTemplate();

        return str_replace(
            ['{{CATEGORY_LIST}}', '{{CONTEXT_BLOCK}}'],
            [$categoryList, $contextBlock],
            $template,
        );
    }

    public static function defaultPromptTemplate(): string
    {
        return 'Anda adalah asisten katalog untuk Ronica, toko furnitur online berbahasa Indonesia.

Anda akan menerima satu atau lebih gambar dari produk yang SAMA (berbagai sudut). Gabungkan informasi dari semua gambar untuk hasil yang lebih akurat.

LANGKAH PERTAMA — Verifikasi kelayakan:
- Tentukan apakah gambar menampilkan sebuah furnitur (meja, kursi, sofa, lemari, rak, tempat tidur, kabinet, bufet, dll.) yang layak dijual di toko furnitur.
- Tolak jika gambar adalah: orang, hewan, pemandangan, makanan, mobil, gadget/elektronik, pakaian, aksesoris non-furnitur, konten dewasa, atau gambar yang tidak jelas/buram.
- Jika TIDAK layak: kembalikan "is_furniture": false dan isi "rejection_reason" dengan alasan singkat dalam Bahasa Indonesia (maks 120 karakter). Semua field lain boleh kosong.
- Jika layak: isi "is_furniture": true, "rejection_reason": "", dan lanjutkan mengisi semua field di bawah.

Kategori yang tersedia (pilih TEPAT salah satu, gunakan ejaan persis): {{CATEGORY_LIST}}.{{CONTEXT_BLOCK}}

Aturan keluaran JSON (hanya relevan jika is_furniture = true):
- "name": nama produk yang menjual, maksimum 120 karakter.
- "category": pilih satu nama kategori dari daftar di atas. Jika tidak ada yang cocok, pilih yang paling dekat.
- "description": deskripsi lengkap dalam Bahasa Indonesia, MINIMAL 50 kata, ceritakan material, gaya, fungsi, dan kesan visual.
- "weight_kg": estimasi berat dalam kilogram sebagai angka desimal yang masuk akal untuk furnitur sejenis.
- "length_cm": estimasi panjang dalam sentimeter (sisi terpanjang saat dilihat dari atas).
- "width_cm": estimasi lebar dalam sentimeter (sisi kedua saat dilihat dari atas).
- "height_cm": estimasi tinggi dalam sentimeter (dari dasar ke puncak).
- "price_idr": estimasi harga jual dalam Rupiah (integer, tanpa titik/koma) berdasarkan material, ukuran, dan gaya. Gunakan harga pasar Indonesia yang wajar untuk furnitur sejenis (bukan harga impor premium).
- "compare_price_idr": harga coret (sebelum diskon) dalam Rupiah. Harus LEBIH BESAR dari price_idr — biasanya 15%-30% di atas price_idr untuk kesan promo.
- "cost_price_idr": estimasi harga modal/HPP dalam Rupiah. Harus LEBIH KECIL dari price_idr — biasanya 50%-65% dari price_idr (margin retail furnitur 35%-50%).
- "shipping_class": pilih TEPAT salah satu dari: "free_shipping" (item kecil & ringan, <5 kg, aksesoris), "flat_rate" (default untuk mayoritas furnitur ukuran sedang), "local_pickup" (item besar/berat seperti lemari besar, tempat tidur king, sofa besar >80 kg).
- "stock_quantity": saran stok awal yang realistis untuk toko furnitur retail (integer). Pedoman: item kecil/aksesoris (kursi, meja kecil, rak) 10-20 unit, item ukuran sedang (meja makan, lemari sedang, sofa single) 5-10 unit, item besar/custom (lemari besar, sofa L, tempat tidur king, furniture mewah) 2-5 unit. Jangan lebih dari 30.
- "material": material utama (contoh: "Kayu Jati", "MDF dilapisi HPL", "Besi & Kayu").
- "color": warna dominan dalam Bahasa Indonesia (contoh: "Coklat Tua", "Putih Natural").
- "meta_title": judul SEO maksimum 60 karakter.
- "meta_description": deskripsi SEO maksimum 160 karakter.
- "meta_keywords": 3-7 kata kunci dipisahkan koma, lowercase.
- "specifications": array berisi MINIMAL 3 dan maksimal 6 objek {"key": "...", "value": "..."} yang relevan dan informatif. JANGAN duplikasi field yang sudah ada terpisah (material utama, warna, dimensi, berat). Contoh key yang bagus: "Gaya" (Modern/Minimalis/Klasik/Scandinavian/Industrial), "Perakitan" (Sudah Dirakit/Perlu Dirakit), "Garansi" (mis. "1 Tahun"), "Kapasitas" (jumlah orang/beban maks), "Finishing" (Matte/Gloss/Natural), "Jumlah Laci", "Jumlah Rak", "Fitur Khusus", "Cocok Untuk" (Ruang Tamu/Kamar/Kantor), "Negara Asal". Gunakan key dalam Bahasa Indonesia, Title Case, dan value yang ringkas (maks 60 karakter).';
    }

    /**
     * Turn user-provided context into human-readable hints for the prompt.
     *
     * @param  array<string, mixed>  $context
     * @return array<int, string>
     */
    private function contextHints(array $context): array
    {
        $labels = [
            'name' => 'Nama produk',
            'description' => 'Deskripsi lengkap',
            'short_description' => 'Deskripsi singkat',
            'price' => 'Harga jual (Rp)',
            'compare_price' => 'Harga coret (Rp)',
            'cost_price' => 'Harga modal (Rp)',
            'weight' => 'Berat (kg)',
            'length' => 'Panjang (cm)',
            'width' => 'Lebar (cm)',
            'height' => 'Tinggi (cm)',
            'shipping_class' => 'Kelas pengiriman',
            'stock_quantity' => 'Jumlah stok',
            'material' => 'Material',
            'color' => 'Warna',
            'meta_title' => 'Meta title',
            'meta_description' => 'Meta description',
            'meta_keywords' => 'Meta keywords',
        ];

        $hints = [];

        foreach ($labels as $key => $label) {
            $value = trim((string) ($context[$key] ?? ''));
            if ($value !== '') {
                $hints[] = "{$label}: \"{$value}\"";
            }
        }

        if (! empty($context['category_id'])) {
            $category = Category::query()->find((int) $context['category_id']);
            if ($category) {
                $hints[] = "Kategori: \"{$category->name}\"";
            }
        }

        if (! empty($context['specifications']) && is_array($context['specifications'])) {
            $pairs = [];
            foreach ($context['specifications'] as $spec) {
                if (! is_array($spec)) {
                    continue;
                }
                $k = trim((string) ($spec['key'] ?? ''));
                $v = trim((string) ($spec['value'] ?? ''));
                if ($k !== '' && $v !== '') {
                    $pairs[] = "{$k}={$v}";
                }
            }
            if ($pairs !== []) {
                $hints[] = 'Spesifikasi sudah ada: '.implode('; ', $pairs).' — pertahankan key ini dan tambahkan spesifikasi baru yang berbeda bila perlu untuk mencapai minimal 3.';
            }
        }

        return $hints;
    }

    /** @return array<string, mixed> */
    private function responseSchema(): array
    {
        return [
            'type' => 'OBJECT',
            'properties' => [
                'is_furniture' => ['type' => 'BOOLEAN'],
                'rejection_reason' => ['type' => 'STRING'],
                'name' => ['type' => 'STRING'],
                'category' => ['type' => 'STRING'],
                'description' => ['type' => 'STRING'],
                'price_idr' => ['type' => 'NUMBER'],
                'compare_price_idr' => ['type' => 'NUMBER'],
                'cost_price_idr' => ['type' => 'NUMBER'],
                'weight_kg' => ['type' => 'NUMBER'],
                'length_cm' => ['type' => 'NUMBER'],
                'width_cm' => ['type' => 'NUMBER'],
                'height_cm' => ['type' => 'NUMBER'],
                'shipping_class' => ['type' => 'STRING'],
                'stock_quantity' => ['type' => 'NUMBER'],
                'material' => ['type' => 'STRING'],
                'color' => ['type' => 'STRING'],
                'meta_title' => ['type' => 'STRING'],
                'meta_description' => ['type' => 'STRING'],
                'meta_keywords' => ['type' => 'STRING'],
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
            'required' => ['is_furniture', 'rejection_reason'],
        ];
    }

    private function resolveCategoryId(string $categoryName): ?int
    {
        if ($categoryName === '') {
            return null;
        }

        $needle = Str::lower(trim($categoryName));

        $match = Category::where('is_active', true)
            ->get(['id', 'name'])
            ->first(fn (Category $c) => Str::lower($c->name) === $needle);

        if ($match) {
            return (int) $match->id;
        }

        // Loose contains-match as a fallback (e.g. AI says "Meja Kantor" but DB has "Meja").
        $loose = Category::where('is_active', true)
            ->get(['id', 'name'])
            ->first(fn (Category $c) => Str::contains(Str::lower($c->name), $needle)
                || Str::contains($needle, Str::lower($c->name)));

        return $loose ? (int) $loose->id : null;
    }

    private function generateUniqueSku(string $hint): string
    {
        $prefix = Str::of($hint)
            ->ascii()
            ->upper()
            ->replaceMatches('/[^A-Z]/', '')
            ->substr(0, 3)
            ->value();

        if ($prefix === '') {
            $prefix = 'PRD';
        }

        for ($attempt = 0; $attempt < self::MAX_SKU_ATTEMPTS; $attempt++) {
            $candidate = $prefix.'-'.Str::upper(Str::random(6));
            if (! Product::where('sku', $candidate)->exists()) {
                return $candidate;
            }
        }

        return $prefix.'-'.Str::upper(Str::random(8));
    }

    private function normaliseNumeric(mixed $value, float $min, int $decimals): string
    {
        if (! is_numeric($value)) {
            return '';
        }

        $number = max($min, (float) $value);

        return number_format($number, $decimals, '.', '');
    }

    private function normaliseInteger(mixed $value): string
    {
        if (! is_numeric($value)) {
            return '';
        }

        $number = max(0, (int) round((float) $value));

        return $number > 0 ? (string) $number : '';
    }

    private function resolveShippingClass(string $value): string
    {
        $allowed = ['free_shipping', 'flat_rate', 'local_pickup'];
        $needle = Str::lower(trim($value));

        return in_array($needle, $allowed, true) ? $needle : '';
    }

    private function normaliseKeywords(mixed $value): string
    {
        if (is_array($value)) {
            return Str::limit(implode(', ', array_map('strval', $value)), 255, '');
        }

        return Str::limit((string) $value, 255, '');
    }

    /**
     * @return array<int, array{key: string, value: string}>
     */
    private function normaliseSpecifications(mixed $value): array
    {
        if (! is_array($value)) {
            return [];
        }

        $specs = [];
        $seenKeys = [];

        foreach ($value as $item) {
            if (! is_array($item)) {
                continue;
            }

            $key = Str::limit(trim((string) ($item['key'] ?? '')), 50, '');
            $val = Str::limit(trim((string) ($item['value'] ?? '')), 60, '');

            if ($key === '' || $val === '') {
                continue;
            }

            $dedupe = Str::lower($key);
            if (isset($seenKeys[$dedupe])) {
                continue;
            }
            $seenKeys[$dedupe] = true;

            $specs[] = ['key' => $key, 'value' => $val];

            if (count($specs) >= 6) {
                break;
            }
        }

        return $specs;
    }
}
