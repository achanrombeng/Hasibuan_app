<?php

declare(strict_types=1);

namespace App\Actions\Product;

use App\Enums\ProductStatus;
use App\Models\Product;
use App\Models\ProductImage;
use App\Services\ImageService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CreateProductAction
{
    /**
     * @param  array<string, mixed>  $data
     * @param  array<int, UploadedFile>  $images
     */
    public function execute(array $data, array $images = []): Product
    {
        return DB::transaction(function () use ($data, $images) {
            $data['slug'] = $data['slug'] ?? Str::slug($data['name']).'-'.Str::random(5);
            $data['status'] = $data['status'] ?? ProductStatus::DRAFT;

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
