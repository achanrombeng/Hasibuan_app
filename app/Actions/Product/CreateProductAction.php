<?php

declare(strict_types=1);

namespace App\Actions\Product;

use App\Enums\ProductStatus;
use App\Models\Category;
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

            $linkedProductIds = $data['linked_product_ids'] ?? [];
            unset($data['linked_product_ids']);

            $isLivingCollection = false;
            if (isset($data['category_id'])) {
                $category = Category::find($data['category_id']);
                $isLivingCollection = $category && ($category->slug === 'living-collection' || strtolower(trim((string) ($category->name['en'] ?? $category->name))) === 'living collection');
            }

            $hasLinkedImages = false;
            if ($isLivingCollection && ! empty($linkedProductIds)) {
                $hasLinkedImages = Product::whereIn('id', $linkedProductIds)->whereHas('images')->exists();
            }

            // Produk tanpa foto otomatis berstatus Draft (kecuali Living Collection yang memiliki foto dari produk tertaut)
            if (empty($images) && ! $hasLinkedImages) {
                $data['status'] = ProductStatus::DRAFT;
            } else {
                $data['status'] = $data['status'] ?? ProductStatus::DRAFT;
            }

            /** @var Product $product */
            $product = Product::create($data);

            // Sync linked products
            if (! empty($linkedProductIds)) {
                $syncData = [];
                foreach ($linkedProductIds as $order => $linkedId) {
                    $syncData[$linkedId] = ['sort_order' => $order];
                }
                $product->linkedProducts()->sync($syncData);

                if ($isLivingCollection && empty($images)) {
                    $product->syncLivingCollectionImages();
                }
            }

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

            return $product->fresh()->load('images', 'category', 'linkedProducts');
        });
    }
}
