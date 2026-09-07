<?php

declare(strict_types=1);

use App\Enums\ProductStatus;
use App\Models\Product;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Update all products with direct images from draft to active
        Product::where('status', ProductStatus::DRAFT->value)
            ->whereHas('images')
            ->update([
                'status' => ProductStatus::ACTIVE->value,
            ]);

        // 2. Update all Living Collection products with linked products having images from draft to active
        $livingCollectionWithImages = Product::where('status', ProductStatus::DRAFT->value)
            ->where('category_id', 2)
            ->whereHas('linkedProducts', function ($q) {
                $q->whereHas('images');
            })
            ->get();

        foreach ($livingCollectionWithImages as $product) {
            $product->updateQuietly([
                'status' => ProductStatus::ACTIVE->value,
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No-op
    }
};
