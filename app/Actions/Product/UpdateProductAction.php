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
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UpdateProductAction
{
    /**
     * @param  array<string, mixed>  $data
     * @param  array<int, UploadedFile>  $newImages
     * @param  array<int, int>  $deleteImageIds
     */
    public function execute(Product $product, array $data, array $newImages = [], array $deleteImageIds = []): Product
    {
        return DB::transaction(function () use ($product, $data, $newImages, $deleteImageIds) {
            // Extract primary_image_id and linked_product_ids before updating product
            $primaryImageId = $data['primary_image_id'] ?? null;
            unset($data['primary_image_id']);

            $hasLinkedProductsKey = array_key_exists('linked_product_ids', $data);
            $linkedProductIds = $data['linked_product_ids'] ?? [];
            unset($data['linked_product_ids']);

            // Generate slug if name changed and slug not provided
            if (isset($data['name']) && ! isset($data['slug'])) {
                $data['slug'] = Str::slug($data['name']).'-'.Str::random(5);
            }

            // Produk tanpa foto otomatis berstatus Draft (kecuali Living Collection dengan produk tertaut yang memiliki foto)
            $remainingCount = $product->images()
                ->whereNotIn('id', $deleteImageIds)
                ->count();
            $totalImages = $remainingCount + count($newImages);

            $isLivingCollection = $product->isLivingCollection();
            if (isset($data['category_id']) && (int) $data['category_id'] !== $product->category_id) {
                $cat = Category::find($data['category_id']);
                $isLivingCollection = $cat && ($cat->slug === 'living-collection' || strtolower(trim((string) ($cat->name['en'] ?? $cat->name))) === 'living collection');
            }

            $hasLinkedImages = false;
            if ($isLivingCollection) {
                $effectiveLinkedIds = $hasLinkedProductsKey ? $linkedProductIds : $product->linkedProducts()->pluck('products.id')->toArray();
                if (! empty($effectiveLinkedIds)) {
                    $hasLinkedImages = Product::whereIn('id', $effectiveLinkedIds)->whereHas('images')->exists();
                }
            }

            if ($totalImages === 0 && ! $hasLinkedImages) {
                $data['status'] = ProductStatus::DRAFT;
            }

            $product->update($data);

            // Sync linked products if provided in request
            if ($hasLinkedProductsKey) {
                $syncData = [];
                foreach ($linkedProductIds as $order => $linkedId) {
                    $syncData[$linkedId] = ['sort_order' => $order];
                }
                $product->linkedProducts()->sync($syncData);
            }

            // Set primary image
            if ($primaryImageId) {
                $product->images()->update(['is_primary' => false]);
                $product->images()->where('id', $primaryImageId)->update(['is_primary' => true]);
            }

            // Delete specified images
            if (! empty($deleteImageIds)) {
                $imagesToDelete = ProductImage::whereIn('id', $deleteImageIds)
                    ->where('product_id', $product->id)
                    ->get();

                foreach ($imagesToDelete as $image) {
                    Storage::disk('public')->delete($image->image_path);
                    $image->delete();
                }
            }

            // Add new images
            $existingCount = $product->images()->count();
            foreach ($newImages as $index => $image) {
                $path = ImageService::storeWithWhiteBackground($image, 'products', 'public');

                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => $path,
                    'alt_text' => $product->name,
                    'sort_order' => $existingCount + $index,
                    'is_primary' => $existingCount === 0 && $index === 0,
                ]);
            }

            if ($isLivingCollection && empty($newImages) && empty($primaryImageId)) {
                $product->syncLivingCollectionImages();
            }

            // Sync any parent living collection products if this product is linked
            foreach ($product->parentProducts as $parent) {
                if ($parent->isLivingCollection()) {
                    $parent->syncLivingCollectionImages();
                }
            }

            return $product->fresh()->load('images', 'category');
        });
    }
}
