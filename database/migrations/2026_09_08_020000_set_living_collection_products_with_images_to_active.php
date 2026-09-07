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
        // Find living collection products that have linked products with images and set to active
        $livingCollectionProducts = Product::where('category_id', 2)
            ->whereHas('linkedProducts', function ($q) {
                $q->whereHas('images');
            })
            ->get();

        foreach ($livingCollectionProducts as $product) {
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
