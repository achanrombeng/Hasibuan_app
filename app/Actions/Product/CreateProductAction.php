<?php

declare(strict_types=1);

namespace App\Actions\Product;

use App\Enums\ProductStatus;
use App\Enums\SaleType;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

use App\Services\ImageService;

class CreateProductAction
{
    /**
     * @param array<string, mixed> $data
     * @param array<int, UploadedFile> $images
     */
    public function execute(array $data, array $images = []): Product
    {
        return DB::transaction(function () use ($data, $images) {
            $data['slug'] = $data['slug'] ?? Str::slug($data['name']).'-'.Str::random(5);
            $data['status'] = $data['status'] ?? ProductStatus::DRAFT;
            $data['sale_type'] = $data['sale_type'] ?? SaleType::REGULAR;
            $data['price'] = $data['price'] ?? 0;
            $data['stock_quantity'] = $data['stock_quantity'] ?? 0;

            /** @var Product $product */
            $product = Product::create($data);

            // Handle images
            foreach ($images as $index => $image) {
                $path = ImageService::storeWithWhiteBackground($image, 'products', 'public');

                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => $path,
                    'alt_text' => $product->name,
                    'sort_order' => $index,
                    'is_primary' => $index === 0,
                ]);
            }

            return $product->fresh()->load('images', 'category');
        });
    }
}

