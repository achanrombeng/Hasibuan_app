<?php

declare(strict_types=1);

namespace App\Actions\Product;

use App\Models\Product;
use App\Models\ProductImage;
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
            // Extract primary_image_id before updating product
            $primaryImageId = $data['primary_image_id'] ?? null;
            unset($data['primary_image_id']);

            // Generate slug if name changed and slug not provided
            if (isset($data['name']) && ! isset($data['slug'])) {
                $data['slug'] = Str::slug($data['name']).'-'.Str::random(5);
            }

            $product->update($data);

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
                $path = $image->store('products', 'public');

                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => $path,
                    'alt_text' => $product->name,
                    'sort_order' => $existingCount + $index,
                    'is_primary' => $existingCount === 0 && $index === 0,
                ]);
            }

            return $product->fresh()->load('images', 'category');
        });
    }
}
