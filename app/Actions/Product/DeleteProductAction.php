<?php

declare(strict_types=1);

namespace App\Actions\Product;

use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class DeleteProductAction
{
    public function execute(Product $product): bool
    {
        return DB::transaction(function () use ($product) {
            // Delete product images from storage
            /** @var \Illuminate\Database\Eloquent\Collection<int, \App\Models\ProductImage> $images */
            $images = $product->images;

            foreach ($images as $image) {
                Storage::disk('public')->delete($image->image_path);
            }

            // Soft delete the product (images will be cascade deleted)
            return (bool) $product->delete();
        });
    }
}

